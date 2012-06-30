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
            sid : null,
            // `sendSMS(sms, cb)`  
            // Sends a SMS using Twilio's API
            // The SMS object must contain the following attributes
            // {
            //      To : The phone number to whom to send the SMS
            //      From : The phone number your are using to send the SMS
            //      Body : The content of the SMS limited to 160 characters
            // }
            // The CallBack function cb will be call after the query to the twilio API has been made.
            // And not after the SMS has been sent.
            // Twilio API only support sending SMS shorter than 160 characters
            sendSMS: function(sms, cb) {
                if(null== twilio.sid) throw "SID not defined";
                if(undefined == sms)        throw "No SMS object given";
                if(undefined == sms.From)   throw "No 'From' attribute in SMS object";
                if(undefined == sms.To)     throw "No 'To' attribute in SMS object";
                if(undefined == sms.Body)   throw "No 'Body' attribute in SMS object";
                if(sms.Body.length > 160)   throw "Twilio's SMS supports 20 more characters than twitter and nothing more."

                io.call('twilio', 'sendSMS')(twilio.sid, sms, cb);
            },

            // `makeCall(call, cb)`
            // Makes a Call using Twilio's API
            // The CALL object must contain the following attributes
            // {
            //      To : The phone number to whom to send the SMS
            //      From : The phone number your are using to send the SMS
            //   Must contain one of the followin
            //      xml : Contains the TiwtML to be deserved
            //      say : Contains a Text Message which will read by Twilio's API
            // }
            //
            makeCall:  function(call, cb) {
                if(undefined == call)       throw "No CALL object given";
                if(undefined == call.From)  throw "No 'From' attribute in CALL object";
                if(undefined == call.To)    throw "No 'To' attribute in CALL object";
                if(undefined == call.xml && undefined == call.say)    throw "No 'xml' nor 'say' attribute in CALL object";
                if(undefined !== call.xml && undefined !== call.say)  throw "Only give 'xml' or 'say' attribute.";
                
                io.call('twilio', 'makeCall')(twilio.sid, call, cb);
            }

        };
        return function(sid) {
            twilio.sid = sid;
            return twilio;
        };
    };
});
