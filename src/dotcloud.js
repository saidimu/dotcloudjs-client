/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
 
// dotcloud.js is provided as a *requirejs* module. For more information, you can visit
// <http://requirejs.org>
define(function(require) {
    var isReady = false;
    var readyCb = [];
    var self = {};

    var config = require('config');

    function ready() {
        var i = readyCb.length;
        while (--i >= 0) {
            readyCb[i](self);
        }
        isReady = true;
    }


    // When provided with a function parameter, `ready` will use it
    // as a callback when the `dotcloud` module is ready to be used.  
    // The module is provided as first (and only) argument of the callback.
    self.ready = function(fn) {
        readyCb.push(fn);
        if (isReady)
            fn(self);
    };

    config.ready(function(config) {
        if (config.modules.DB_ENABLED) {
            self.db = require('db')(config);
        }

        if (config.modules.SYNC_ENABLED) {
            self.sync = require('sync')(config);
        }

        ready();
        isReady = true;
    });

    return self;
});
