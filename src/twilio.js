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
            // one way to setup the API keys, not the best though
            init: function(sid, token, cb) {
                io.call('twilio', 'init')(config.dbid, sid, token, cb);
                return this;
            },

            sendSMS: function(sms, cb) {
                if(undefined == sms)        throw "No SMS object given";
                if(undefined == sms.From)   throw "No 'From' attribute in SMS object";
                if(undefined == sms.To)     throw "No 'To' attribute in SMS object";
                if(undefined == sms.Body)   throw "No 'Body' attribute in SMS object";
                
                io.call('twilio', 'sendSMS')(sms, cb);
            },

            makeCall:  function(call, cb) {
                if(undefined == call)       throw "No CALL object given";
                if(undefined == call.From)  throw "No 'From' attribute in CALL object";
                if(undefined == call.To)    throw "No 'To' attribute in CALL object";

                io.call('twilio', 'makeCall')(call, cb);
            }

        };
        return twilio;
    };
});
