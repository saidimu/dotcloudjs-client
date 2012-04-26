/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
 
// dotcloud.js is provided as a *requirejs* module. For more information, you can visit
// <http://requirejs.org>
define(["config", "jquery"], function(config, $) {
    var prefix = null;
    var readyCb = null;
    var self = this;

    
    // When provided with a function parameter, `ready` will use it
    // as a callback when the `dotcloud` module is ready to be used.  
    // The module is provided as first (and only) argument of the callback.
    this.ready = function(fn) {
        readyCb = fn;
        if (prefix)
            fn(this);
    };

    config.ready(function(config) {
        prefix = config.host + '/rpc/' + config.dbid + '/';
        if (readyCb)
            readyCb(self);
    });

    var noop = function() {};

    // Short-hand for issuing POST requests with JSON-formatted data.
    var post = function(url, data, cb) {
        $.ajax(url, {
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: cb || noop,
            type: 'POST'
        });
    };

    // ## dotcloud.db
    // *Sub-module providing the simple storage API.*  
    // Every method of this sub-module can be chained.
    // Every method's callback is provided with one `data` argument containing
    // an `error` field if something occured server-side and a `result` field
    // containing the data returned by the query, if any.
    this.db = {
        // `db.insert(collection, obj|objArray, [cb])`  
        // Insert one or several objects in `collection`.  
        // If an array is provided as the second argument, each element will be inserted in the
        // specified collection.
        // Result of this method contains the inserted object(s) with their newly-created _id.
        insert: function(collection, obj, cb) {
            post(prefix + collection + '/insert', { obj: obj }, cb);
            return this;
        },
        // `db.update(collection, id|criteria, obj, [cb])`  
        // Update one or several objects in `collection`.  
        // Second argument can be an object ID or a MongoDB query object.
        // Result of this method indicates the number of objects effected.
        update: function(collection, criteria, obj, cb) {
            var data = {
                obj: obj,
                id: (typeof criteria == 'string') ? criteria : undefined,
                conditions: (typeof criteria == 'string') ? undefined : criteria
            };

            post(prefix + collection + '/update', data, cb);
            return this;
        },
        // `db.remove(collection, [id], [cb])`  
        // Remove an object in `collection` using its `id`, or drop the whole collection.  
        // If the second argument is ommitted, the whole collection will be dropped.
        // This method doesn't provide any result.
        remove: function(collection, id, cb) {
            if (!cb && (typeof id == 'function')) {
                cb = id;
                id = undefined;
            }

            post(prefix + collection + '/remove', { id: id }, cb);
            return this;
        },
        // `db.find(collection, [id|criteria], [cb])`  
        // Query `collection` to retrieve one or several objects.  
        // The second argument can be an object ID or a MongoDB query object.
        // If ommitted, the method will query the whole collection.
        find: function(collection, criteria, cb) {
            if (!cb && (typeof criteria == 'function')) {
                cb = criteria;
                criteria = undefined;
            }

            var data = {
                id: (typeof criteria == 'string') ? criteria : undefined,
                query: (typeof criteria == 'string') ? undefined : criteria
            };

            post(prefix + collection + '/find', data, cb);
            return this;
        },
        // `db.upsert(collection, criteria, obj, [cb])`  
        // Look for an object matching the given `criteria` in `collection`.  
        // If found, update it with `obj`. Otherwise, insert `obj` as a new element.  
        // `criteria` is a MongoDB query object.
        upsert: function(collection, criteria, obj, cb) {
            post(prefix + collection + '/upsert', {
                obj: obj,
                conditions: criteria
            }, cb);
            return this;
        }
    };

    return this;
});
