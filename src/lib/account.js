var store = require('../node_modules/store');

var exports = {};

exports.isLoggedIn = () => {
    credentials = exports.getCredentials();
    if (credentials == null || credentials.apiToken == null) {
        return false;
    }

    return true;
}


exports.getCredentials = () => {
    return store.get('credentials');
}

exports.storeCredentials = (credentials)=> {
    store.set('credentials', credentials);
}

exports.clearCredentials = (credentials)=> {
    store.remove('credentials');
}


module.exports = exports;
