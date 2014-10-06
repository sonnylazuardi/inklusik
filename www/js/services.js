angular.module('inklusik.services', [])

.service('Player', function(ngAudio, $cordovaMedia) {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    var ctr = 1;
    function Player (url) {
        if (app) {
            var src = "/android_asset/www/sound/sunda/angklung/"+url+".mp3";

            var my_media = new Media(src, 
                function() { my_media.stop(); my_media.release();},
                function() { my_media.stop(); my_media.release();}); 
            my_media.play();
        } else {
            ngAudio.play("sound/sunda/angklung/"+url+".mp3");
        }
    }
    return Player;
});