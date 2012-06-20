/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Jr Prévost <jr@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// ## dotcloud.twilio
// *Sub-module providing the simple bindings with Twilio's REST API.*  
// 
define(function(require) {
    return function(config, io) {
        var twilio = {
            // `twilio.init(crendentials, cb)`  
            // does nothing
            init: function(crendentials, cb) {
                io.call('twilio', 'init')(config.dbid, crendentials, cb);
                return this;
            }
        };
        return twilio;
    };
});
