/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// ## dotcloud.db
// *Sub-module providing the simple storage API.*  
// Every method of this sub-module can be chained.
// Every method's callback is provided with one `data` argument containing
// an `error` field if something occured server-side and a `result` field
// containing the data returned by the query, if any.
define(function(require) {
    return function(config, io) {
        var db = {
            // `db.insert(collection, obj|objArray, [cb])`  
            // Insert one or several objects in `collection`.  
            // If an array is provided as the second argument, each element will be inserted in the
            // specified collection.
            // Result of this method contains the inserted object(s) with their newly-created _id.
            insert: function(collection, obj, cb) {
                io.call('db', 'insert')(config.dbid, collection, obj, cb);
                return this;
            },
            // `db.update(collection, id|criteria, obj, [cb])`  
            // Update one or several objects in `collection`.  
            // Second argument can be an object ID or a MongoDB query object.
            // Result of this method indicates the number of objects effected.
            update: function(collection, criteria, obj, cb) {
                io.call('db', 'update')(config.dbid, collection, criteria, obj, cb);
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
                io.call('db', 'remove')(config.dbid, collection, id, cb);
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

                io.call('db', 'find')(config.dbid, collection, criteria, cb);
                return this;
            },
            // `db.upsert(collection, criteria, obj, [cb])`  
            // Look for an object matching the given `criteria` in `collection`.  
            // If found, update it with `obj`. Otherwise, insert `obj` as a new element.  
            // `criteria` is a MongoDB query object.
            upsert: function(collection, criteria, obj, cb) {
                io.call('db', 'upsert')(config.dbid, collection, criteria, obj, cb);
                return this;
            },
            private: {
                // `db.insert(collection, obj|objArray, [cb])`  
                // Insert one or several objects in `collection`.  
                // If an array is provided as the second argument, each element will be inserted in the
                // specified collection.
                // Result of this method contains the inserted object(s) with their newly-created _id.
                insert: function(collection, obj, cb) {
                    io.call('db-private', 'insert')(config.dbid, collection, obj, cb);
                    return this;
                },
                // `db.update(collection, id|criteria, obj, [cb])`  
                // Update one or several objects in `collection`.  
                // Second argument can be an object ID or a MongoDB query object.
                // Result of this method indicates the number of objects effected.
                update: function(collection, criteria, obj, cb) {
                    io.call('db-private', 'update')(config.dbid, collection, criteria, obj, cb);
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
                    io.call('db-private', 'remove')(config.dbid, collection, id, cb);
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

                    io.call('db-private', 'find')(config.dbid, collection, criteria, cb);
                    return this;
                },
                // `db.upsert(collection, criteria, obj, [cb])`  
                // Look for an object matching the given `criteria` in `collection`.  
                // If found, update it with `obj`. Otherwise, insert `obj` as a new element.  
                // `criteria` is a MongoDB query object.
                upsert: function(collection, criteria, obj, cb) {
                    io.call('db-private', 'upsert')(config.dbid, collection, criteria, obj, cb);
                    return this;
                }
            }
        };
        return db;
    };
});