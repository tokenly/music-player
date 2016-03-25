var $ = require('jquery');
var musicAPI = require('./musicAPI');
var account = require('./account');

var exports = {};

const FADE_SPEED = 500;

exports.runLoginForm = () => {
    console.log('running login form');
    
    showLogo(FADE_SPEED*1.8)
        .then(()=>{
            return wait(150);
        })
        .then(()=>{
            return showForm();
        });

    $('#LoginForm').on('submit', (e) => {
        e.preventDefault();
        let formEl = $(e.delegateTarget);
        let username = formEl.find('input[name=username]').val();
        let password = formEl.find('input[name=password]').val();

        beginProcessingForm()

        // call login API
        musicAPI.login(username, password)
            .then( (result)=> {
                console.log('musicAPI.login result', result);
                account.storeCredentials({
                    username    : result.username,
                    apiToken    : result.apiToken,
                    apiSecretKey: result.apiSecretKey,
                });

                // redirect to the player
                window.location.href = 'player.html';
            })
            .catch ( (error)=> {
                console.log('musicAPI.login error', error);
                $('#LoginForm .error').html(error).fadeIn('fast');
            })
            .then( (result)=> {
                endProcessingForm();
            })
            ;

        return;
    });
    return;
}

// ------------------------------------------------------------------------

let beginProcessingForm = () => {
    $('#LoginForm .error').hide();
    $('#LoginForm').fadeTo('fast', 0.15);
}

let endProcessingForm = ()=>{
    $('#LoginForm').fadeTo('fast', 1);
}

let showLogo = (speed)=>{
    return new Promise((resolve, reject) => {
        speed = speed || FADE_SPEED;
        $('.logo').fadeIn(speed, resolve);
    });
}

let showForm = ()=>{
    return new Promise((resolve, reject) => {
        $('#LoginForm').fadeIn(FADE_SPEED, resolve);
    });
}

let wait = (ms)=>{
    return new Promise((resolve, reject) => {
        window.setTimeout(resolve, ms);
    });

}

module.exports = exports;