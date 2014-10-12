// Inklusik App
angular.module('inklusik', [
  'ionic',
  'firebase',
  'ngStorage',
  'ngAudio',
  'ngCordova',
  'inklusik.config',
  'inklusik.routes',
  'inklusik.filters',
  'inklusik.services',
  'inklusik.directives',
  'inklusik.decorators',
  'inklusik.controllers'
])

.run(function(simpleLogin, $ionicPlatform, $state) {
  simpleLogin.getUser();
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $ionicPlatform.registerBackButtonAction(function () {
      if($state.current.name=="login"){
        navigator.app.exitApp();
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);
  });
});