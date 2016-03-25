var $ = require('jquery');
var account = require('./account');
var HmacSHA256 = require('../node_modules/crypto-js/hmac-sha256');
var Base64 = require('../node_modules/crypto-js/enc-base64');

var exports = {};

const URL_PREFIX = 'https://music-stage.tokenly.com/api/v1'
// const URL_PREFIX = 'http://localhost:8000/api/v1'

exports.login = (username, password) => {
    let params = { username, password };
    console.log('login params = ',params);
    return send('POST', '/account/login', params, {public: true})
        .catch((errorData) => {
            if (errorData.status == 403) {
                throw `Could not login.  Please check your username and password and try again.`;
            }
            console.error(errorData);
            throw new Error(`There was an error logging in: ${errorData.error}`);
        });
}

exports.getAuthorizedSongs = () => {
    return send('GET', '/music/mysongs')
        .catch((errorData) => {
            console.error(errorData);
            throw new Error(`There was an error fetching songs: ${errorData.error}`);
        });
}


// ------------------------------------------------------------------------

let send = (method, apiPathSuffix, params, opts)=> {
    return new Promise((resolve, reject) => {
        
        let url = URL_PREFIX+apiPathSuffix;

        let headers = signRequest(method, url, params, opts);

        opts = {
            method  : method,
            url     : url,
            data    : params,
            dataType: 'json',
            headers : headers,
            success : resolve,
            error   : (jqXHR, textStatus, errorString) => {
                let errorMessage = `This request failed with error code (${jqXHR.status}).`;
                let consoleErrorMessage = `${method} ${url} failed with code ${jqXHR.status}.`;
                if (jqXHR.responseJSON != null && jqXHR.responseJSON.message != null) {
                    errorMessage = jqXHR.responseJSON.message;
                    consoleErrorMessage += ' '+consoleErrorMessage;
                }
                console.error(consoleErrorMessage, jqXHR);
                reject({error: errorMessage, status: jqXHR.status});
            }
        }

        // send the ajax request
        console.log('sending ajax request to '+url);
        $.ajax(opts);

        // setTimeout(resolve, duration);
        // setTimeout(()=>{
        //     console.log('resolving');
        //     resolve();
        // }, 1500);
    });
}

let signRequest = (method, url, params, opts)=> {
    if (opts != null && opts.public != null && opts.public == true) {
        // public request
        return {};
    }

    if (!account.isLoggedIn()) {
        return {};
    }

    let credentials = account.getCredentials();
    let nonce = newNonce();
    let paramsBody = '{}';
    if (params != null) {
        paramsBody = window.JSON.stringify(paramsBody)
    }

    // strip off any query
    let parser = document.createElement('a');
    parser.href = url;
    let strippedUrl = parser.protocol + '//' + parser.host + parser.pathname;

    let signature = signURLParameters(method, strippedUrl, paramsBody, nonce, credentials)

    let headers = {
        'X-Tokenly-Auth-Nonce':     nonce,
        'X-Tokenly-Auth-Api-Token': credentials.apiToken,
        'X-Tokenly-Auth-Signature': signature,
    }

    return headers;
}


let newNonce = ()=> {
    return Math.round( 0 + new Date() / 1000)
}

let signURLParameters = (method, url, paramsBody, nonce, credentials)=> {
    let hmacMessage = method + "\n" + url + "\n" + paramsBody + "\n" + credentials.apiToken + "\n" + nonce;
    console.log(`credentials.apiToken: "${credentials.apiToken}"`);
    console.log(`hmacMessage: "${hmacMessage}"`);
    let signature = HmacSHA256(hmacMessage, credentials.apiSecretKey).toString(Base64);
    console.log(`signature: "${signature}"`);
    return signature
}


module.exports = exports;