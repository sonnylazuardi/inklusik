angular.module('inklusik.controllers', [])

.controller('PlayCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments, requireUser) {
  var name = $stateParams.name;
  $scope.instrument = Instruments.find(name);
  $scope.harmony = fbutil.syncArray(['harmony'], {limit: 10});
  $scope.last_melody = fbutil.syncArray(['harmony'], {limit: 1});

  requireUser().then(function(user) {
    var profile = fbutil.syncObject(['users', user.uid]);
    profile.$bindTo($scope, 'profile');

    profile.$loaded().then(function(snap) {
      var listRef = fbutil.ref('presences');
      console.log(snap);
      var userObj = {
        uid: user.uid,
        name: snap.name,
        avatar: snap.avatar,
        instrument: {name: name, image: $scope.instrument.image}
      };
      var userRef = fbutil.ref('presences', user.uid);
      userRef.set(userObj);

      var presenceRef = fbutil.ref('.info', 'connected');
      presenceRef.on('value', function(snap) {
        userRef.onDisconnect().remove();
      });

    });
  });

  var onlineusers = fbutil.syncObject('presences');
  onlineusers.$bindTo($scope, 'onlineusers');

  $scope.last_melody.$watch(function(event) {
    var melody = $scope.last_melody[0];
    if (melody && $scope.profile) {
      if ($scope.profile.uid != melody.uid) {
        Player(melody.name, melody.melody);
      }
    }
  });
  $scope.sound = function(melody) {
    Player(name, melody);
    $scope.harmony.$add({melody: melody, name: name, uid: $scope.profile.uid});
  }
})

.controller('PlayGuestCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments) {
  var name = $stateParams.name;
  $scope.instrument = Instruments.find(name);
  $scope.sound = function(melody) {
    Player(name, melody);
  }
})

.controller('LoginCtrl', function($scope, createProfile, simpleLogin, $state, $rootScope) {
  $rootScope.hide = false;
  $scope.login = function() {
    $scope.err = null;
      simpleLogin.login()
      .then(function( user ) {
        console.log(user);
        createProfile(user.uid, user.displayName, user.thirdPartyUserData.picture.data.url, 0).then(function() {
          $rootScope.$broadcast('afterlogin');
          $state.go('browse');
        });
      }, function(err) {
        $scope.err = errMessage(err);
      });
  }
  $scope.guest = function() {
    $rootScope.hide = true;
    $state.go('browse');
  }
  function errMessage(err) {
    return angular.isObject(err) && err.code? err.code : err + '';
  }
})

.controller('MenuCtrl', function($scope, fbutil, requireUser, simpleLogin, $rootScope, $state) {
  $scope.load = function() {
    console.log('load');
    requireUser().then(function(user) {
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile');
    });
  }
  $scope.load();
  $scope.$on('afterlogin', $scope.load);
  $scope.logout = function() {
    if ($scope.profile) {
      console.log('exit');
      simpleLogin.logout();
    }
    console.log('keluar');
    $rootScope.hide = false;
    $state.go('login');
  }
})

.controller('BrowseCtrl', function($scope, Instruments) {
  $scope.instruments = Instruments.instruments;
})

.controller('WikimoreCtrl', function($scope) {
  
})

.controller('DetailCtrl', function($scope, Instruments, $stateParams) {
  $scope.instrument = Instruments.find($stateParams.name);

})

.controller('AboutCtrl', function($scope) {
  
});
