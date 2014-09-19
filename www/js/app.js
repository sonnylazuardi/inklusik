// Inklusik App
angular.module('inklusik', [
  'ionic', 
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

.run(function(simpleLogin, $ionicPlatform) {
  simpleLogin.getUser();
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});