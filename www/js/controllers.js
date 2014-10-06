angular.module('inklusik.controllers', [])

.controller('PlayCtrl', function($scope, simpleLogin, fbutil, Player) {
  $scope.logout = function() {
    simpleLogin.logout();
  }
  $scope.sound = {};
  $scope.last_melody = fbutil.syncArray(['harmony'], {limit: 1});

  $scope.last_melody.$watch(function(event) {
    // console.log(event);
    var melody = $scope.last_melody[0];
    if (melody) {
      console.log(melody.$value);
      Player(melody.$value);
    }
  });
  $scope.sound = function(melody) {
    Player(melody);
    $scope.last_melody.$add(melody);
  }
})

.controller('LoginCtrl', function($scope, createProfile, simpleLogin, $location) {
  $scope.login = function() {
    $scope.err = null;
      simpleLogin.login()
      .then(function( user ) {
        console.log(user);
        createProfile(user.uid, user.displayName, user.thirdPartyUserData.picture.data.url, 0).then(function() {
          $location.path('/play');
        });
      }, function(err) {
        $scope.err = errMessage(err);
      });
  }
  $scope.guest = function() {
    $scope.err = null;
      simpleLogin.login()
      .then(function() {
        $location.path('/play');
      }, function(err) {
        $scope.err = errMessage(err);
      });
  }
  function errMessage(err) {
    return angular.isObject(err) && err.code? err.code : err + '';
  }
});
