"use strict";

angular.module('inklusik.routes', ['ui.router', 'simpleLogin'])

  .constant('ROUTES', {
    '/login': {
      url: "/login",
      controller: 'LoginCtrl'
    },
<<<<<<< HEAD
    '/play': {
      url: "/play",
      templateUrl: "templates/play.html",
      controller: 'PlayCtrl',
      authRequired: true // must authenticate before viewing this page
=======
    '/home': {
      url: "/home",
      templateUrl: "templates/home.html",
      controller: 'HomeCtrl'// must authenticate before viewing this page
    },
    '/wiki':{
      url: "/wiki",
      templateUrl: "templates/wiki.html",
      controller: 'WikiCtrl'
    },
    '/wikimore':{
      url:"/wikimore",
      templateUrl: "templates/wikimore.html",
      controller: 'WikimoreCtrl'
    },
    '/detail':{
      url: "/detail",
      templateUrl: "templates/detail.html",
      controller: 'DetailCtrl'
    },
    '/play':{
      url: "/play",
      templateUrl: "templates/play.html",
      controller: "PlayCtrl"
>>>>>>> eb0e7e12ee354684d712de8bfd30a4c98950d47d
    }
  })
  
  .config(function($stateProvider) {
   
    $stateProvider.stateAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['requireUser', function(requireUser) {
        return requireUser();
      }];
      $stateProvider.state(path, route);
    }
  })

  .config(function($stateProvider, ROUTES, $urlRouterProvider) {
    angular.forEach(ROUTES, function(route, path) {
      if ( route.authRequired ) {
        $stateProvider.stateAuthenticated(path, route);
      } else {
        $stateProvider.state(path, route);
      }
    });
    // routes which are not in our map are redirected to /home
    $urlRouterProvider.otherwise('/login');
  })

  .run(function($rootScope, $location, simpleLogin, ROUTES, loginRedirectPath) {
    simpleLogin.watch(check, $rootScope);

    $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
      if( angular.isObject(err) && err.authRequired ) {
        $location.path(loginRedirectPath);
      }
    });

    function check(user) {
      if( !user && authRequired($location.path()) ) {
        $location.path(loginRedirectPath);
      }
    }

    function authRequired(path) {
      return ROUTES.hasOwnProperty(path) && ROUTES[path].authRequired;
    }
  });