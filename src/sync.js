/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>)
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
// ## dotcloud.sync
// *Sub-module providing the synchronized storage API.*  
// You can retrieve a collection using the sync.synchronize method.
// All collections retrieved this way are automatically synchronized across all the
// clients who access it. Changes are persisted (in mongoDB or redis) and propagated.
define(function(require) {
    // This module is initialized by passing the config object which is a dependency 
    // of the *dotcloud* module.
    return function(config) {
        // *stack.io* is a transport library based on socket.io which propagates events
        // across multiple clients and back-end services. It also has an RPC layer which
        // this submodule uses extensively.
        var io = require("stack.io")();

        // `dotcloud.sync` object.
        var sync = {
            // `sync.synchronize(collection, [mode])`  
            // `collection` identifies a collection (well, duh) of objects.  
            // `mode` is the persistence layer used. Currently supports mongo, redis. 
            // Defaults to mongo.
            synchronize : function(collection, mode) {
                if (mode === 'redis') {
                    return new this.RedisArray(collection);
                } else if (mode == 'mongo' || !mode) {
                    return new this.Array(collection);
                } else {
                    throw 'Unsupported persistence mode: ' + mode;
                }
                
            }
        };

        // ### sync.Array
        // Synchronized Array type, which is the return type of the `sync.synchronize` 
        // method. It wraps a javascript array and provides the same methods.  
        // **Note: Since the underlying persistence layer has no order preservation, 
        // order is discarded when using this structure. (push and unshift perform the 
        // same operation, as well as pop and shift). If order is important to your 
        // application, you should use the `RedisArray`.**
        sync.Array = function(collection) {
            var data = [];
            var dbid = config.dbid;
            var that = this;

            // Update the length property.
            var updateLength = function() {
                that.length = data.length;
            }

            var changeCallbacks = [updateLength];

            // This method is called everytime the underlying data is changed.
            // It is responsible of calling all the observers declared using the
            // `observe` method.
            var notifyChanged = function() {
                for (var i = changeCallbacks.length - 1; i >= 0; i--) {
                    changeCallbacks[i].apply(null, arguments);
                }
            }
            
            var merge = function(a, b) {
                for (var k in b) {
                    if (!a[k]) {
                        a[k] = b[k];
                    } else if (typeof a[k] == 'object' && !(a[k] instanceof Array)) {
                        a[k] = merge(a[k], b[k]);
                    } else {
                        a[k] = b[k];
                    }
                }
                return a;
            }

            // We call this RPC method once when creating the array to retrieve
            // the whole collection.
            io.call('sync', 'retrieve')(dbid, collection, function(result) {
                if (result[0])
                    throw result[0];
                data = result[1] || [];
                notifyChanged('synchronized', data);
            });

            // Subscribe to the 'inserted' event.
            io.on('inserted-' + dbid + '.' + collection, function(obj) {
                if (obj instanceof Array) {
                    for (var j = obj.length; j >= 0; j--) {
                        for (var i = data.length - 1; i >= 0; i--) {
                            if (data[i]._id === obj[i]._id) {
                                break;
                            }
                        }
                        (i < 0) && data.push(obj);
                    }
                } else {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i]._id === obj._id) {
                            return;
                        }
                    }
                    data.push(obj);
                }
                notifyChanged('inserted', obj);
            });

            // Subscribe to the 'removed' event.
            io.on('removed-' + dbid + '.' + collection, function(id) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i]._id === id) {
                        if (i === 0) { 
                            data.shift();
                        } else if (i === data.length - 1) {
                            data.pop();
                        } else {
                            data.splice(i, 1);
                        }
                        notifyChanged('removed', id);
                        break;
                    }
                }
            });
            
            // Subscribe to the 'updated' event.
            io.on('updated-' + dbid + '.' + collection, function(obj) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (obj._id == data[i]._id) {
                        data[i] = obj;
                        notifyChanged('updated', obj);
                        break;
                    }
                }
            });

            // `Array#length` property.
            this.length = data.length;
            
            // `Array#at(index, [update])`  
            // This method is not a standard Array method. It allows accessing the 
            // item present at the specified `index`.  
            // If the second parameter is provided, the objects will be merged and an
            // update command will be sent to the underlying persistence layer.
            this.at = function(index, update) {
                if (!!update) {
                    data[index] = merge(data[index], update);
                    io.call('sync', 'update')(dbid, collection, data[index]._id, update, function(result) {
                        if (result[0]) throw result[0];
                    });
                }
                return data[index];
            }

            // `Array#indexOf(obj)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf>
            this.indexOf = function(obj) {
                return data.indexOf(obj);
            };

            // `Array#join(str)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/join>
            this.join = function(str) {
                return data.join(str);
            };

            // `Array#lastIndexOf(obj)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf>
            this.lastIndexOf = function(obj) {
                return data.lastIndexOf(obj);
            };

            // `Array#pop()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/pop>
            this.pop = function() {
                io.call('sync', 'remove')(dbid, collection, data[data.length - 1]._id, 
                    function(result) {
                        if (result[0]) throw result[0];
                    });

                return data[data.length - 1];
            };

            // `Array#push(objs...)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/push>
            this.push = function(obj) {
                if (arguments.length > 1) {
                    var args = [];
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        args.unshift(arguments[i]);
                    }
                    obj = args;
                }

                io.call('sync', 'add')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
                return data.length + arguments.length;
            };

            // `Array#reverse()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reverse>
            // **Note: the resulting Array is a plain, non-synchronized Javascript array.**
            this.reverse = function() {
                return data.reverse();
            };

            this.shift = function() {
                io.call('sync', 'remove')(dbid, collection, data[0]._id, function(result) {
                    if (result[0]) throw result[0];
                });
                return data[0];
            };

            // `Array#slice(start, [end])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/slice>
            // **Note: the returned Array is a plain, non-synchronized Javascript array.**
            this.slice = function(start, end) {
                return data.slice(start, end);
            };

            // `Array#sort([fn])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/sort>
            // **Note: the returned Array is a plain, non-synchronized Javascript array.**
            this.sort = function(fn) {
                return data.sort(fn);
            };

            // `Array#splice(index, num, [objects...])`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/splice>
            // **Note: the returned Array is a plain, non-synchronized Javascript array.**
            this.splice = function(index, num) {
                if (index < 0)
                    index += data.length;
                for (var i = num - 1; i >= 0; i--) {
                    io.call('sync', 'remove')(dbid, collection, data[index + i]._id, function(result) {
                        if (result[0]) throw result[0];
                    });
                }
                
                for (var i = arguments.length - 1; i >= 2; i--) {
                     this.push(arguments[i]);
                }
                return data.slice(index, index + num - 1);
            };

            // `Array#toString()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/toString>
            this.toString = function() {
                return 'SynchronizedArray(' + collection + '):[' + data.join(', ') + ']';
            };

            // `Array#unshift(objs...)`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/unshift>
            this.unshift = function(obj) {
                if (arguments.length > 1) {
                    var args = [];
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        args.unshift(arguments[i]);
                    }
                    obj = args;
                }

                io.call('sync', 'add')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
            };

            // `Array#valueOf()`  
            // <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/valueOf>
            this.valueOf = function() {
                return data.valueOf();
            };

            // `Array#observe(fn)`  
            // This method adds an observer function to the synchronized array. 
            // Whenever an insert, removal, or update occurs, the function is called
            // with parameters indicating the type and target of the change.
            this.observe = function(fn) {
                changeCallbacks.unshift(fn);
                return this;
            };
        };

        // ### sync.RedisArray
        // Synchronized Array type, but mapped on a redis list.  
        // Documentation provided for `sync.Array` is valid for this class unless 
        // otherwise stated.
        sync.RedisArray = function(collection) {
            var data = [];
            var dbid = config.dbid;
            var that = this;

            var updateLength = function() {
                that.length = data.length;
            }

            var changeCallbacks = [updateLength];

            var notifyChanged = function() {
                for (var i = changeCallbacks.length - 1; i >= 0; i--) {
                    changeCallbacks[i].apply(null, arguments);
                }
            }

            var merge = function(a, b) {
                for (var k in b) {
                    if (!a[k]) {
                        a[k] = b[k];
                    } else if (typeof a[k] == 'object' && !(a[k] instanceof Array)) {
                        a[k] = merge(a[k], b[k]);
                    } else {
                        a[k] = b[k];
                    }
                }
                return a;
            }

            io.call('sync-redis', 'retrieve')(dbid, collection, function(result) {
                if (result[0])
                    throw result[0];
                data = result[1] || [];
                notifyChanged('synchronized', data);
            });

            io.on('inserted-' + dbid + ':' + collection, function(obj, mode) {
                data[mode](obj);
                notifyChanged(mode, obj);
            });

            io.on('removed-' + dbid + ':' + collection, function(obj, mode) {
                data[mode]();
                notifyChanged(mode, obj);
            });

            io.on('updated-' + dbid + ':' + collection, function(index, obj) {
                data[index] = obj;
                notifyChanged('updated', obj, index);
            });

            // With redis persistence, the splice operation is actually performed 
            // atomically, so a specific event is fired when a splice happens.
            io.on('spliced-' + dbid + ':' + collection, function(index, num, objects) {
                if (!objects || !objects.length)
                    data.splice(index, num)
                else {
                    objects.unshift(num); objects.unshift(index);
                    data.splice.apply(data, objects);
                }

                notifyChanged('spliced', index, num, objects);
            });

            this.length = data.length;
            
            this.at = function(index, update) {
                if (!!update) {
                    data[index] = merge(data[index], update);
                    io.call('sync-redis', 'update')(dbid, collection, index, update, function(result) {
                        if (result[0]) throw result[0];
                    });
                }
                return data[index];
            }

            this.indexOf = function(obj) {
                return data.indexOf(obj);
            };

            this.join = function(str) {
                return data.join(str);
            };

            this.lastIndexOf = function(obj) {
                return data.lastIndexOf(obj);
            };

            this.pop = function() {
                io.call('sync-redis', 'pop')(dbid, collection, function(result) {
                    if (result[0]) throw result[0];
                });
                return data[data.length - 1];
            };

            this.push = function(obj) {
                if (arguments.length > 1) {
                    var args = [];
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        args.unshift(arguments[i]);
                    }
                    obj = args;
                }

                io.call('sync-redis', 'push')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
                return data.length + arguments.length;
            };

            this.reverse = function() {
                return data.reverse();
            };

            this.shift = function() {
                io.call('sync-redis', 'shift')(dbid, collection, function(result) {
                    if (result[0]) throw result[0];
                });
                return data[0];
            };

            this.slice = function(start, end) {
                return data.slice(start, end);
            };

            this.sort = function(fn) {
                return data.sort(fn);
            };

            this.splice = function(index, num) {
                if (index < 0)
                    index += data.length;
                var objects = [];
                for (var i = arguments.length - 1; i >= 2; i--) {
                     objects.push(arguments[i]);
                }
                io.call('sync-redis', 'splice')(dbid, collection, index, num, objects, function(result) {
                    if (result[0]) {
                        throw result[0];
                    }
                    console.log(result[1]);
                });
                return data.slice(index, index + num - 1);
            };

            this.toString = function() {
                return 'SynchronizedArray(' + collection + '):[' + data.join(', ') + ']';
            };

            this.unshift = function(obj) {
                if (arguments.length > 1) {
                    var args = [];
                    for (var i = arguments.length - 1; i >= 0; i--) {
                        args.unshift(arguments[i]);
                    }
                    obj = args;
                }

                io.call('sync-redis', 'unshift')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
                return data[0];
            };

            this.valueOf = function() {
                return data.valueOf();
            };

            this.observe = function(fn) {
                changeCallbacks.unshift(fn);
                return this;
            };
        };

        return sync;
    };
});
