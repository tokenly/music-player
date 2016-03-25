require('./node_modules/babel-polyfill');
require('./node_modules/soundmanager2');

var account = require('./lib/account');
var loginPage = require('./lib/loginPage');
var player = require('./lib/player');


var TokenlyMusicPlayer = {}
TokenlyMusicPlayer.runLogin = ()=> {
    if (account.isLoggedIn()) {
        window.location.href = 'player.html';
        return
    }

    loginPage.runLoginForm();
}

TokenlyMusicPlayer.runPlayer = ()=> {
    if (!account.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    player.run();
}

window.TokenlyMusicPlayer = TokenlyMusicPlayer;
