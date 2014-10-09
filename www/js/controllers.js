angular.module('inklusik.controllers', [])

<<<<<<< HEAD
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
=======
.controller('HomeCtrl', function($scope, simpleLogin, ngAudio, fbutil, $cordovaMedia) {
	$scope.logout = function() {
		simpleLogin.logout();
	}
	$scope.sound = {};
	$scope.harmony = fbutil.syncArray(['harmony'], {limit: 10});
	$scope.last_melody = fbutil.syncArray(['harmony'], {limit: 1});
	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	$scope.last_melody.$watch(function(event) {
		console.log(event);
		var melody = $scope.last_melody[0];
		if (melody) {
			console.log(melody.$value);
			ngAudio.play("sound/sunda/angklung/"+melody.$value+".mp3");
			if (app) {
				var src = "/android_asset/www/sound/sunda/angklung/"+melody.$value+".mp3";

				var mediaSource = $cordovaMedia.newMedia(src);
				var promise = mediaSource.promise;
				var mediaStatus = mediaSource.mediaStatus;
				var media = mediaSource.media;

				$cordovaMedia.play(media);
			}
		}
	});
	$scope.sound = function(melody) {
		ngAudio.play("sound/sunda/angklung/"+melody+".mp3");
		if (app) {
			var src = "/android_asset/www/sound/sunda/angklung/"+melody+".mp3";

			var mediaSource = $cordovaMedia.newMedia(src);
			var promise = mediaSource.promise;
			var mediaStatus = mediaSource.mediaStatus;
			var media = mediaSource.media;

			$cordovaMedia.play(media);
		}
		$scope.harmony.$add(melody);
	}
})

.controller('LoginCtrl', function($scope, createProfile, simpleLogin, $location) {
	$scope.login = function() {
		$scope.err = null;
			simpleLogin.login()
			.then(function( user ) {
				console.log(user);
				createProfile(user.uid, user.displayName, user.thirdPartyUserData.picture.data.url, 0).then(function() {
					$location.path('/home');
				});
			}, function(err) {
				$scope.err = errMessage(err);
			});
	}
	$scope.guest = function() {
		$scope.err = null;
			simpleLogin.login()
			.then(function() {
				$location.path('/home');
			}, function(err) {
				$scope.err = errMessage(err);
			});
	}
	function errMessage(err) {
		return angular.isObject(err) && err.code? err.code : err + '';
	}
})
.controller('WikiCtrl',function($scope) {
	
})

.controller('WikimoreCtrl',function($scope) {
	
})

.controller('DetailCtrl',function($scope) {
	
})

.controller('PlayCtrl',function($scope){
	
})		




;
	
>>>>>>> eb0e7e12ee354684d712de8bfd30a4c98950d47d
