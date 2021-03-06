/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    vars: true,
    node: true
*/

module.exports = function (options) {
    "use strict";
    options = options || {};
    if(Array.isArray(options.files) === false) {
        throw new Error('files array must be specified');
    }
    
    var browserify = require('browserify');
    
    var defaults = {
        'files' : options.files || null, //Array
        'add' : options.add || null, // string
        'require' : options.require || null, // array
        'external' : options.external || null, // array
        'ignore' : options.ignore || null, // array
        'transform' : options.transform || null, // string or function
        'insertGlobals' : options.insertGlobals || false, // boolean
        'detectGlobals' : options.detectGlobals || true, // boolean
        'debug' : options.debug || false, // boolean
        'callback' : options.callback || function (src) {
            console.log(src);
        }
    };
    
    [
        'add',
        'require',
        'external',
        'ignore',
        'transform',
        'insertGlobals',
        'detectGlobals',
        'debug',
        'callback'
    ].forEach(function (item) {
        if(defaults[item] === null) {
            delete defaults[item];
        }
    });
    
    if(options.insertGlobals === true) {
        options.detectGlobals = false;
    }
    
    try {
        var b = browserify(defaults.files);
    } catch (e) {
        err = {
            'message' : 'Could not complete browserify.browserify' +
                ' because ' + e,
            'browserifyError' : e
        };
        err.toString = function () {
            return 'Could not complete browserify.browserify' +
            ' because ' + e
        };
        throw new Error(err);
    }
    
    [
        'add',
        'transform'
    ].forEach(function (fn) {
        if(defaults[fn]) {
            if(typeof defaults[fn] === 'string') {
                try {
                    b[fn](defaults[fn]);
                } catch (e) {
                    err = {
                        'message' : 'Could not complete browserify.' + fn +
                            ' because ' + e,
                        'browserifyError' : e
                    };
                    err.toString = function () {
                        return 'Could not complete browserify.' + fn +
                        ' because ' + e
                    };
                    throw new Error(err);
                }
            }
        }
    });
    
    [
        'require',
        'external',
        'ignore'
    ].forEach(function (fn) {
        if(Array.isArray(defaults[fn])) {
            defaults[fn].forEach(function (file) {
                try {
                    b[fn](file);
                } catch (e) {
                    err = {
                        'message' : 'Could not complete browserify.' + fn +
                            ' on ' + file + ' because ' + e,
                        'browserifyError' : e
                    };
                    err.toString = function () {
                        return 'Could not complete browserify.' + fn +
                        ' because ' + e
                    };
                    throw new Error(err);
                }
            });
        }
    });
    
    b.bundle({
        'insertGlobals' : defaults.insertGlobals,
        'detectGlobals' : defaults.detectGlobals,
        'debug' : defaults.debug
    }, function (err, src) {
        defaults.callback(err, src);
    });
};


