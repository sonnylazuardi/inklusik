angular.module('inklusik.controllers', [])

.controller('PlayCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments, requireUser, Shake, Partiturs, $interval, $ionicScrollDelegate) {
  var name = $stateParams.name;
  $scope.name = name;
  $scope.instrument = Instruments.find(name);
  $scope.harmony = fbutil.syncArray(['harmony'], {limit: 10});
  $scope.last_melody = fbutil.syncArray(['harmony'], {limit: 1});

  $scope.selected = '';
  $scope.holded = false;
  var timer, timer2, timer3, delay = 350;

  requireUser().then(function(user) {
    $scope.user = user;
    var profile = fbutil.syncObject(['users', user.uid]);
    profile.$bindTo($scope, 'profile');

    //mencari user pertama
    $scope.presences = fbutil.syncArray(['presences']);

    profile.$loaded().then(function(snap) {
      var listRef = fbutil.ref('presences');
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
        Player(melody.name, $scope.instrument.location, melody.melody);
      }
    }
  });
  $scope.playSound = function(melody) {
    $scope.selected = melody;
    Player(name, $scope.instrument.location, melody);
    $scope.harmony.$add({melody: melody, name: name, uid: $scope.profile.uid});
  }
  $scope.sound = function(melody) {
    $scope.holded = true;
    $scope.playSound(melody);
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: true});
    if (!timer) {
      timer = $interval(function() {
        $scope.playSound(melody);
      }, delay);
    } 
  }
  $scope.enter = function(melody) {
    if ($scope.holded) {
      $scope.sound(melody);
    }
  }
  $scope.stop = function() {
    $scope.holded = false;
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: false});
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  $scope.leave = function() {
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  var shake = new Shake({
    frequency: 300,                                                //milliseconds between polls for accelerometer data.
    waitBetweenShakes: 1000,                                       //milliseconds to wait before watching for more shake events.
    threshold: 12,                                                 //how hard the shake has to be to register.
    success: function(magnitude, accelerationDelta, timestamp) {
      Player($scope.name, $scope.instrument.location, $scope.selected);   
      $scope.harmony.$add({melody: $scope.selected, name: $scope.name, uid: $scope.profile.uid});
    }, //callback when shake is detected. "this" will be the "shake" object.
    failure: function() {},                                        //callback when watching/getting acceleration fails. "this" will be the "shake" object.
  });
  shake.startWatch();
  $scope.$on('$destroy', function() {
    shake.stopWatch();
  });

    //Partitiur
  $scope.usingPartitur = false;
  $scope.partiturs = Partiturs.partiturs;
  $scope.doTimer = function() {
    $scope.time++;
    if ($scope.user.uid == $scope.presences[0].uid) {
      var songRef = fbutil.ref('song');
      songRef.update({time: $scope.time});
    }
    if ($scope.time > ($scope.settings.currentSong.melody.length + 10) * 5 ) {
      $scope.time = 0;
    }
  };
  
  $scope.changeSong = function() {
    var timeTemp = $scope.time;
    $scope.time = 0;
    $scope.song.time = 0;
    $scope.song.tempo = $scope.settings.tempo;
    $scope.song = $scope.settings.currentSong;
    $scope.isPlaying = false;

    if (timeTemp != 0)
      $scope.control();
  };

  $scope.switch = function() {
    $scope.usingPartitur = !$scope.usingPartitur;
    $ionicScrollDelegate.resize();
  }

  $scope.settings = {
    notes: false,
    tempo: 150,
    tempoVal: 70,
    currentSong : {melody: [], title: 'Song', source: '-'}
  };
  $scope.converter = {
    'da2' : '1',
    'la' : '3',
    'ti' : '4',
    'na' : '5',
    'mi' : '7',
    'da' : '1\'',
  };
  $scope.notes = function(melody) {
    if ($scope.settings.notes) {
      if ($scope.converter[melody.toLowerCase()] != null)
        return $scope.converter[melody.toLowerCase()];
      else
        return melody.toUpperCase();
    } else {
      return melody.toUpperCase();
    }
  }
  $scope.isPlaying = false;
  $scope.control = function() {
    $scope.controlPlay();
    $scope.last_songEvent.$add({state: $scope.isPlaying, time: $scope.time});
  };
  $scope.controlPlay = function() {
    $scope.isPlaying = !$scope.isPlaying;
    if ($scope.isPlaying) {
      if ( angular.isDefined(timer2) ) return;
      timer2 = $interval($scope.doTimer, $scope.settings.tempo); 
    } else {
      if (angular.isDefined(timer2)) {
        $interval.cancel(timer2);
        timer2 = undefined;
      }  
    }
  };
  
  $scope.tempoChange = function() {
    if ($scope.isPlaying) {
      // console.log($scope.settings.tempo);
      $scope.settings.tempo = 400 - ($scope.settings.tempoVal / 100 * 400);
      $interval.cancel(timer2);
      timer2 = $interval($scope.doTimer, $scope.settings.tempo);
      //remote
      $scope.song.tempo = $scope.settings.tempo;
    }
  };

  var song = fbutil.syncObject('song');
  song.$bindTo($scope, 'song');
  song.$loaded(function(data) {
    if ($scope.song.id != null) {
      $scope.usingPartitur = true;
      $ionicScrollDelegate.resize();
      $scope.settings.currentSong = angular.copy($scope.song);
      $scope.changeSong();
      $scope.time = $scope.song.time+2;
    }
  
  });

  $scope.last_songEvent = fbutil.syncArray(['song', 'events'], {limit: 1});
  $scope.last_songEvent.$watch(function() {
    var object = $scope.last_songEvent[0];
    if (object) {
      console.log(object);
      $scope.isPlaying = !object.state;
      $scope.time = object.time;
      $scope.controlPlay();
    }
  });
  
  $scope.isRecording = false;
  $scope.record = function(){
    $scope.isRecording = !$scope.isRecording;
  };


})

.controller('PlayGuestCtrl', function($scope, simpleLogin, Player, fbutil, $stateParams, Instruments, Shake, Partiturs, $interval, $ionicScrollDelegate) {
  var name = $stateParams.name;
  $scope.name = name;
  $scope.instrument = Instruments.find(name);
  $scope.selected = '';
  $scope.time = 0;
  $scope.tempo = 150;
  var timer, timer2, delay = 350;
  
  $scope.playSound = function(melody) {
    $scope.selected = melody;
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: true});
    Player(name, $scope.instrument.location, melody);
  }
  $scope.sound = function(melody) {
    $scope.holded = true;
    $scope.playSound(melody);
    if (!timer) {
      timer = $interval(function() {
        $scope.playSound(melody);
      }, delay);
    } 
  }
  $scope.enter = function(melody) {
    if ($scope.holded) {
      $scope.sound(melody);
    }
  }
  $scope.stop = function() {
    $scope.holded = false;
    var userRef = fbutil.ref('presences', $scope.user.uid);
    userRef.update({sounded: false});
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }
  $scope.leave = function() {
    if (timer) {
      $interval.cancel(timer);
      timer = null;
    }
  }

  var shake = new Shake({
    frequency: 300,                                                //milliseconds between polls for accelerometer data.
    waitBetweenShakes: 1000,                                       //milliseconds to wait before watching for more shake events.
    threshold: 12,                                                 //how hard the shake has to be to register.
    success: function(magnitude, accelerationDelta, timestamp) {
      Player($scope.name, $scope.instrument.location, $scope.selected);   
    }, //callback when shake is detected. "this" will be the "shake" object.
    failure: function() {},                                        //callback when watching/getting acceleration fails. "this" will be the "shake" object.
  });
  shake.startWatch();
  $scope.$on('$destroy', function() {
    shake.stopWatch();
  });

  //Partitiur
  $scope.usingPartitur = false;
  $scope.partiturs = Partiturs.partiturs;
  $scope.doTimer = function() {
    $scope.time++;
    if ($scope.time > ($scope.settings.currentSong.melody.length + 10) * 5 ) {
      $scope.time = 0;
    }
  };
  var timer;
  $scope.changeSong = function() {
    $scope.time = 0;
    console.log($scope.settings.currentSong);
    $scope.control();
  };

  $scope.switch = function() {
    $scope.usingPartitur = !$scope.usingPartitur;
    $ionicScrollDelegate.resize();
  }

  $scope.settings = {
    notes: false,
    tempo: 150,
    tempoVal: 70,
    currentSong : {melody: [], title: 'Song', source: '-'}
  };
  $scope.converter = {
    'da2' : '1',
    'la' : '3',
    'ti' : '4',
    'na' : '5',
    'mi' : '7',
    'da' : '1\'',
  };
  $scope.notes = function(melody) {
    if ($scope.settings.notes) {
      if ($scope.converter[melody.toLowerCase()] != '')
        return $scope.converter[melody.toLowerCase()];
      else
        return melody.toUpperCase();
    } else {
      return melody.toUpperCase();
    }
  }
  $scope.isPlaying = false;
  $scope.control = function() {
    $scope.isPlaying = !$scope.isPlaying;
    if ($scope.isPlaying) {
      if ( angular.isDefined(timer2) ) return;
      timer2 = $interval($scope.doTimer, $scope.settings.tempo); 
    } else {
      if (angular.isDefined(timer2)) {
        $interval.cancel(timer2);
        timer2 = undefined;
      }  
    }
  };
  $scope.tempoChange = function() {
    if ($scope.isPlaying) {
      // console.log($scope.settings.tempo);
      $scope.settings.tempo = 400 - ($scope.settings.tempoVal / 100 * 400);
      $interval.cancel(timer2);
      timer2 = $interval($scope.doTimer, $scope.settings.tempo);
    }
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
  $scope.exit = function() {
    navigator.app.exitApp();
  }
})

.controller('BrowseCtrl', function($scope, Instruments) {
  $scope.instruments = Instruments.instruments;
  $scope.locations = [ 'sunda', 'jawa','bali','kalimantan','maluku','nusa','papua','sumatera',];
})

.controller('WikimoreCtrl', function($scope) {
  
})

.controller('DetailCtrl', function($scope, Instruments, $stateParams, $ionicScrollDelegate) {
  $scope.instrument = Instruments.find($stateParams.name);
  $scope.expanded = ['short', 'short', 'short'];
  $scope.expand = function(id) {
    if ($scope.expanded[id] == 'short') {
      $scope.expanded[id] = 'full';
    } else {
      $scope.expanded[id] = 'short';
    }
    $ionicScrollDelegate.resize();
  }

})

.controller('AboutCtrl', function($scope) {
  
})

.controller('SongCtrl', function($scope,Partiturs) {
  $scope.partiturs = Partiturs.partiturs;
  $scope.locations = ['Jawa Tengah','Jakarta','Maluku','Jawa Barat','Nusa Tenggara Timur','Yogyakarta','Papua'];
})

.controller('LyricCtrl', function($scope,Partiturs, $stateParams) {
  $scope.partitur = Partiturs.find($stateParams.id);
  console.log($scope.partitur);
})


.controller('ChooseCtrl', function($scope,Partiturs, Instruments, $stateParams){
  $scope.instruments = Instruments.instruments;
  $scope.locations = ['sunda', 'jawa','bali','kalimantan','maluku','nusa','papua','sumatera',];
  $scope.partiturid = Partiturs.find($stateParams.id);
})

.controller('StreamCtrl', function($scope,Partiturs){
  $scope.author = "Luthfi Hamid";
  $scope.partitur = Partiturs.find(1);
  $scope.liked = false;
  $scope.next = function(){

  }
  $scope.prev = function(){

  }
  $scope.toggleLike = function(){
    $scope.liked = !$scope.liked;
  }
})


.controller('SearchCtrl', function($scope, Instruments){
  $scope.instruments = Instruments.instruments;
});



