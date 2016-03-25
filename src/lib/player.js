// var $ = require('jquery');
var playlist = require('./playlist');
var musicAPI = require('./musicAPI');
var account = require('./account');

var exports = {};

const FADE_SPEED = 500;

exports.run = function() {
    hideUI();
    showStatus('Loading...');

    $('.login-status .username').text(account.getCredentials().username);

    musicAPI.getAuthorizedSongs()
        .then((songsData)=>{
            synchronizeSongs(songsData);
            // throw "Test error in synchronizeSongs";
            hideStatus().then( ()=>{
                return showUI();
            }).then ( () => {
                window.sm2BarPlayers[0].playlistController.playItemByOffset(0);
            });
        })
        .catch((error)=>{
            hideStatus().then( ()=>{
                showError(`Failed to load player: ${error}`);
            });
        })

    bindEvents();
};

// ------------------------------------------------------------------------

let showError = (error)=> {
    $('.error').text(error).fadeIn(FADE_SPEED);
}

let synchronizeSongs = (songsData)=> {
    console.log('synchronizeSongs: ', songsData);

    let currentTracks = playlist.getCurrentTracks();

    let anyChanges = false;
    songsData.forEach((songData, idx) => {
        if (anyChanges) { return; }
        if (currentTracks[idx] == null || currentTracks[idx].id != songData.id) {
            anyChanges = true;
        }
    });

    if (anyChanges) {
        playlist.setTracks(songsData);
    }
}

let hideUI = ()=>{
    $('.sm2-bar-ui').hide();
    $('.footer').hide();
}
let showUI = ()=>{
    return new Promise((resolve, reject) => {
        $('.sm2-bar-ui').fadeIn(FADE_SPEED, resolve);
        $('.footer').fadeIn(FADE_SPEED);
    });
}
let showStatus = ()=>{
    $('.status').fadeIn(FADE_SPEED);
}
let hideStatus = ()=>{
    return new Promise((resolve, reject) => {
        $('.status').fadeOut(FADE_SPEED, resolve);
    });
}

let bindEvents = ()=>{
    $('a[data-logout]').on('click', (e)=>{
        e.preventDefault();
        account.clearCredentials();
        window.location.href = 'index.html';
    });
}

module.exports = exports;