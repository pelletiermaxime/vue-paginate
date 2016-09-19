import {should} from 'chai'; should();
import vuePaginate from '../../src';
// import Vue from 'vue';
import Vue from 'vue/dist/vue';

Vue.use(vuePaginate);

var vm;

describe('Vue-Paginate', () => {

  beforeEach(() => {
    vm = new Vue({
      template: '<div v-paginate:2="langs">Hello</div>',
      data: {
        langs: ['PHP', 'JS', 'Ruby', 'Python'],
        fullLangs: {},
        refreshLangsPage: {},
        hasLangsLinks: {},
        langsLinks: {},
        currentLangsPage: 0,
      }
    }).$mount();
  }),

  it('slices the list according to the given per-page number', () => {
    vm.$data.langs.should.have.length(2);
  });

  it('exposes the full list (before slicing)', () => {
    vm.$data.fullLangs.should.have.length(4);
  });

  it('provides the paginator links array', () => {
    // In this case we should have 2 pages. 4/2 = 2.
    vm.$data.langsLinks.should.have.length(2);
    vm.$data.langsLinks.should.eql([1, 2]);
  });

  it('provides an access to the current page', () => {
    vm.$data.currentLangsPage.should.equal(1);
  });

  // it('changes the current page', () => {
  //   vm.$data.currentLangsPage.should.equal(1);
  //   vm.$data.langs.should.eql(['PHP', 'JS']);

  //   vm.changeLangsPage(2);
  //   triggerUpdate();

  //   vm.$data.currentLangsPage.should.equal(2);
  //   vm.$data.langs.should.eql(['Ruby', 'Python']);
  // });

  // it('refreshes the list', () => {
  //   vm.$data.langsLinks.should.have.length(2);
  //   vm.$data.fullLangs = ['PHP', 'JS', 'Ruby', 'Python', 'Java', 'Erlang'];

  //   vm.refreshLangsPage();
  //   triggerUpdate();

  //   vm.$data.langsLinks.should.have.length(3);
  // });

  // it('supports next/prev navigation', () => {
  //   vm.$data.currentLangsPage.should.equal(1);
  //   vm.$data.langs.should.eql(['PHP', 'JS']);

  //   vm.nextLangsPage();
  //   triggerUpdate();

  //   vm.$data.currentLangsPage.should.equal(2);
  //   vm.$data.langs.should.eql(['Ruby', 'Python']);

  //   vm.prevLangsPage();
  //   triggerUpdate();

  //   vm.$data.currentLangsPage.should.equal(1);
  //   vm.$data.langs.should.eql(['PHP', 'JS']);
  // });

  // it('checks if there is a need to show the navigation links', () => {
  //   vm.$data.hasLangsLinks.should.be.true;

  //   vm.$data.fullLangs = ['PHP', 'JS'];
  //   vm.refreshLangsPage();
  //   triggerUpdate();

  //   vm.$data.hasLangsLinks.should.be.false;
  // });

  // it('can be applied on multiple lists at the same time', () => {
  //   vm = new Vue({
  //     template: '<div v-paginate:2="langs"></div><div v-paginate:3="names"></div>',
  //     data: {
  //       langs: ['PHP', 'JS', 'Ruby', 'Python'],
  //       names: ['John', 'Jade', 'Matt', 'Alex'],
  //     }
  //   }).$mount();

  //   vm.$data.langs.should.eqls(['PHP', 'JS']);
  //   vm.$data.names.should.eqls(['John', 'Jade', 'Matt']);
  // });

  // describe('Limited Links', () => {
  //   it('changes the displayed links according to the clicked one', () => {
  //     vm = new Vue({
  //       template: '<div v-paginate:1="langs" limit="2">Hello</div>',
  //       data: {
  //         langs: ['PHP', 'JavaScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang']
  //       }
  //     }).$mount();

  //     vm.$data.limitedLangsLinks.should.eql([1, 2, '…', 7, '»']);

  //     vm.changeLangsPage('…');
  //     vm.$data.limitedLangsLinks.should.eql(['«', 3, 4, '…', 7, '»']);

  //     vm.changeLangsPage('»');
  //     vm.$data.limitedLangsLinks.should.eql(['«', 5, 6, 7]);

  //     vm.changeLangsPage('«');
  //     vm.$data.limitedLangsLinks.should.eql(['«', 3, 4, '…', 7, '»']);

  //     vm.changeLangsPage('«');
  //     vm.$data.limitedLangsLinks.should.eql([1, 2, '…', 7, '»']);

  //     vm.changeLangsPage(7);
  //     vm.$data.limitedLangsLinks.should.eql(['«', 5, 6, 7]);
  //   });

  //   it('removes the arrows and the elipses if there is no need to limit the links', () => {
  //     vm = new Vue({
  //       template: '<div v-paginate:1="langs" limit="6">Hello</div>',
  //       data: {
  //         langs: ['PHP', 'JavaScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang']
  //       }
  //     }).$mount();

  //     vm.$data.limitedLangsLinks.should.eql([1, 2, 3, 4, 5, 6, 7]);
  //   });

  //   it('updates the links when the list is updated', (done) => {
  //     vm = new Vue({
  //       template: '<div v-paginate:1="langs" limit="6">Hello</div>',
  //       data: {
  //         langs: ['PHP']
  //       }
  //     }).$mount();

  //     vm.$data.fullLangs = ['PHP', 'JavaScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang'];

  //     Vue.nextTick(() => {
  //       vm.$data.limitedLangsLinks.should.eql([1, 2, 3, 4, 5, 6, 7]);
  //       done();
  //     });
  //   });
  // });

  // describe('Dynamic perPage', () => {
  //   it('supports dynamic perPage', () => {
  //     vm = new Vue({
  //       template: '<div v-paginate:perPage="langs">Hello</div>',
  //       data: {
  //         langs: ['PHP', 'JS', 'Ruby', 'Python'],
  //         perPage: 2
  //       }
  //     }).$mount();

  //     vm.$data.langs.should.have.length(2);
  //   });

  //   it('guards agains non-positive perPage', () => {
  //     vm = new Vue({
  //       template: '<div v-paginate:perPage="langs">Hello</div>',
  //       data: {
  //         langs: ['PHP', 'JS', 'Ruby', 'Python'],
  //         perPage: -3
  //       }
  //     }).$mount();

  //     vm.$data.langs.should.have.length(1);
  //   });

  // });
});

var triggerUpdate = () => vm._directives[0].update(vm.$data.fullLangs);
