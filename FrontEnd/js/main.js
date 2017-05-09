(function() {
    'use strict';

    angular.module('routing', ['ui.router']).config(function($stateProvider, $urlRouterProvider, $locationProvider) {

        if(localStorage.getItem('token')){
          $urlRouterProvider.otherwise('home/profile');
        }else{
          $urlRouterProvider.otherwise('login');
        }

        $stateProvider.state('login', {
            url: '/login',
            views: {
                'content@': {
                    templateUrl: '../partials/login.html',
                    controller: 'mainController',
                    controllerAs: 'vm'
                }
            }
        }).state('create', {
            url: '/create',
            views: {
                'content@': {
                    templateUrl: '../partials/create.html',
                    controller: 'mainController',
                    controllerAs: 'vm'
                }
            }
        }).state('home', {
            url: '/home',
            views: {
                'content@': {
                    templateUrl: '../partials/home.html',
                    controller: 'homeController',
                    controllerAs: 'vm'
                }
            }
        }).state('groups', {
            url: '/groups',
            parent:'home',
            views: {
                'allGroups': {
                    templateUrl: '../partials/groups.html',
                    controller: 'mainController',
                    controllerAs: 'vm'
                }
            }
        })
        .state('findgroup', {
            url: '/findgroup',
            parent:'home',
            views: {
                'allGroups': {
                    templateUrl: '../partials/findgroup.html',
                    controller: 'mainController',
                    controllerAs: 'vm'
                }
            }
        }).state('profile', {
            url: '/profile',
            parent:'home',
            views: {
                'allGroups': {
                    templateUrl: '../partials/Profile.html',
                    controller: 'profileController',
                    controllerAs: 'vm'
                }
            }
        }).state('editProfile', {
            url: '/editProfile',
            parent:'home',
            views: {
                'allGroups': {
                    templateUrl: '../partials/editProfile.html',
                    controller: 'editController',
                    controllerAs: 'vm'
                }
            }
        });

    });

})();
