import {Vue} from './index';
import utils from './utils';
import LimitedLinksGenerator from './LimitedLinksGenerator';

/**
 * Each instance contains these state variables:
 *
 * list: {
 *   perPage: 0,
 *   numberOfPages: 0,
 *   currentPage: 0,
 *   initial: 0 // the initial page number in limited links
 * }
 *
 * listName: ''
 *
 * originalList: {} // The initial list (before it's sliced)
 */
export default {
  twoWay: true,

  params: ['limit'],

  bind (el, binding, vnode) {

    // Turn off warnings (because we're using vm.$set).
    Vue.config.silent = true;

    var vm = vnode.context;
    el.listName = binding.expression;
    var perPage = getPerPage(vm, binding.arg);
    var limit = +binding.arg;

    if (!vm[el.listName]) {
      throw new Error('[vue-paginate] the list name "' + el.listName + '" is not defined in your vm instance.');
    }

    el.originalList = vm[el.listName];

    // Set the full version on the vm
    Vue.set(vm, 'full' + utils.capitalize(el.listName), el.originalList);

    // Update the original list when the user changes the full list.
    vm.$watch('full' + utils.capitalize(el.listName), (newVal, oldVal) => {
      el.originalList = newVal;
      setNumberOfPages(vm, el);
      vm['refresh' + utils.capitalize(el.listName) + 'Page']();
    });

    if (isPerPageDynamic(binding.arg)) {
      vm.$watch(binding.arg, (newVal) => {
        el.list.perPage = +newVal <= 0 ? 1 : +newVal;
        vm['refresh' + utils.capitalize(el.listName) + 'Page']();
      });
    }

    el.list = { currentPage: 0, initial: 0, perPage };

    // Set links array.
    setNumberOfPages(vm, el);

    // Set links array for limited navs (if used).
    setLimitedPages(vm, el, limit);

    // To check if the number of links in the nav is sufficient to be displayed.
    Vue.set(vm, 'has' + utils.capitalize(el.listName) + 'Links', el.list.numberOfPages > 1);

    vm['change' + utils.capitalize(el.listName) + 'Page'] = (page) => {
      console.log('CHANGE!');
      // Reset the list with original data for two reasons:
      // 1. To change it, so the update hook gets triggered.
      // 2. To slice it with new positions from the beginning.
      vm[el.listName] = el.originalList;

      el.list.currentPage = typeof page == 'number' ? page - 1 : page;

      setLimitedPages(vm, el, limit);
    };

    // Another way to navigate pages (Next & Prev)
    vm['next' + utils.capitalize(el.listName) + 'Page'] = () => {
      vm[el.listName] = el.originalList;

      el.list.currentPage = (el.list.currentPage + 1 < el.list.numberOfPages) ?
        el.list.currentPage + 1 :
        el.list.currentPage;
    };

    vm['prev' + utils.capitalize(el.listName) + 'Page'] = () => {
      vm[el.listName] = el.originalList;

      el.list.currentPage = (el.list.currentPage - 1 > 0) ?
        el.list.currentPage - 1 :
        0;
    };

    vm['refresh' + utils.capitalize(el.listName) + 'Page'] = () => {
      vm['change' + utils.capitalize(el.listName) + 'Page'](1);
    };

    vm[el.listName] = el.originalList;

    var index = el.list.currentPage * el.list.perPage;
    vm[el.listName] = (el.originalList.slice(index, index + el.list.perPage));
    setCurrentPage(vm, el);

    // Turn on warnings back
    Vue.config.silent = false;
  },

  update (el, binding, vnode, oldVnode) {
    console.log('UPDATE');
    var vm = vnode.context;

    // Refresh number of pages (useful in case you're filtering the list)
    setNumberOfPages(vm, el);

    el.list.currentPage = el.list.currentPage >= el.list.numberOfPages ?
      el.list.numberOfPages - 1 :
      el.list.currentPage;

    // Apply the current page from the list state to the vm.
    setCurrentPage(vm, el);

    var index = el.list.currentPage * el.list.perPage;

    // this.set(list.slice(index, index + el.list.perPage));
    vnode = (el.originalList.slice(index, index + el.list.perPage));
  }
}

function setNumberOfPages (vm, el) {
  let numberOfItems = el.originalList.length;
  el.list.numberOfPages = Math.ceil(numberOfItems / el.list.perPage);

  var links = utils.generateLinksArray(1, el.list.numberOfPages);

  Vue.set(vm, el.listName + 'Links', links);
}

function setCurrentPage (vm, el) {
  Vue.config.silent = true;
  vm['current' + utils.capitalize(el.listName) + 'Page'] = el.list.currentPage + 1;
  vm['has' + utils.capitalize(el.listName) + 'Links'] = el.list.numberOfPages > 1;
  Vue.config.silent = false;
}

function setLimitedPages (vm, el, limit) {
  let links =
      new LimitedLinksGenerator(
        vm,
        el.list,
        el.listName
      ).generate(limit);

  Vue.set(vm, 'limited' + utils.capitalize(el.listName) + 'Links', links);
}

function getPerPage (vm, arg) {
  let regex = new RegExp(arg, 'i')

  if (! isPerPageDynamic(arg)) {
    return +arg
  }

  if (isDynamicPerPageValid()) {
    this.arg = getDynamicArg();
    return +vm[this.arg];
  }

  return 1;

  function getDynamicArg() { return Object.keys(vm.$data).find(a => a.match(regex)) }
  function isDynamicPerPageValid () { return +vm[getDynamicArg()] > 0; }
}

function isPerPageDynamic (arg) {
  return ! Number.isInteger(Number.parseInt(arg));
}
