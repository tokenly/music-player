var $ = require('jquery');

var exports = {};

let currentTracks = [];


exports.setTracks = (tracksData) => {
    currentTracks = tracksData.slice(0);

    let ulEl = $('ul', '.sm2-playlist-wrapper');
    ulEl.empty();

    tracksData.forEach((trackData, idx) => {
        addTrack(trackData);
    });
}

exports.getCurrentTracks = ()=>{
    return currentTracks;
}


// ------------------------------------------------------------------------

let addTrack = (trackData) => {
    var ulEl = $('ul', '.sm2-playlist-wrapper');
    let trackText = buildTrackText(trackData);
    var newEl = $('<li></li>').append(
        $('<div/>').addClass('sm2-row').append(
            $('<div>').addClass('sm2-col sm2-wide').append(
                $('<a></a>').attr('href', trackData.downloadUrl).html(trackText)
            )
        )
    ).appendTo(ulEl);
};

let buildTrackText = (trackData) => {
    let trackText = '';
    if (trackData.performers != null && trackData.performers.length > 0) { trackText += `<strong>${encodeEntities(trackData.performers)}</strong> - `; }
    if (trackData.name != null && trackData.name.length > 0) { trackText += encodeEntities(trackData.name); }
    if (trackText.length < 1) {
        trackText = "[No Name]";
    }
    return trackText
}

let encodeEntities = (s) => {
    return $("<div/>").text(s).html();
}


module.exports = exports;