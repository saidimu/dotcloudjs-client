/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
define(['jquery', 'jq-cookie'], function($) {
    var result = {};
    result.host = 'http://api.jslib.dotcloud.com';
    var readyCb = null, isReady = false, fiddleid = null;

    result.ready = function(cb) {
        readyCb = cb;
        if (isReady) {
            readyCb(result);
        }
    };
    // JsFiddle specific, try to extract fiddle-id.
    if (document.referrer) {
        var urlParts = document.referrer.split('/');
        if (urlParts[2] == 'jsfiddle.net' && urlParts.length >= 4) {
            if (urlParts.length == 4 || urlParts[4] === '') // No username
                fiddleid = urlParts[3] || undefined;
            else if (urlParts[4].match(/[0-9]+/)) // no username, version
                fiddleid = urlParts[3] || undefined;
            else
                fiddleid = urlParts[4] || undefined;
        }
    }

    var cookieId = $.cookie('dotcloud_tmp_stack') || undefined;
    if (cookieId && !fiddleid) {
        result.dbid = $.cookie('dotcloud_tmp_stack');
        if (readyCb)
            readyCb(result);
        isReady = true;
    } else {
        var self = result;
        $.post(result.host + '/rpc/newdb', {
            fiddleid: fiddleid,
            dbid: cookieId
        }, function(data) {
            if (data.error) throw data.error;
            if (!data.result || !data.result.id)
                throw 'Backend didn\'t respond with a DB id';
            result.dbid = data.result.id;
            if (!fiddleid)
                $.cookie('dotcloud_tmp_stack', result.dbid, { expires: 9001, path: '/' });
            if (readyCb)
                readyCb(self);
            isReady = true;
        });
    }

    return result;
});
