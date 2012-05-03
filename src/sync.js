/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
 
define(function(require) {
    return function(config) {
        var io = require("stack.io")();

        var sync = {
            synchronize : function(collection) {
                return new this.Array(collection);
            }
        };

        sync.Array = function(collection) {
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
                // FIXME!!
                return b;
            }

            io.call('sync', 'retrieve')(dbid, collection, function(result) {
                if (result[0])
                    throw result[0];
                data = result[1] || [];
                notifyChanged('synchronized', data);
            });

            io.on('inserted-' + dbid + '.' + collection, function(obj) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i]._id === obj._id) {
                        return;
                    }
                }
                data.push(obj);
                notifyChanged('inserted', obj);
            });

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
            
            io.on('updated-' + dbid + '.' + collection, function(obj) {
                for (var i = data.length - 1; i >= 0; i--) {
                    if (obj._id == data[i]._id) {
                        data[i] = obj;
                        notifyChanged('updated', obj);
                        break;
                    }
                }
            });

            this.length = data.length;
            
            this.at = function(index, update) {
                if (!!update) {
                    data[index] = merge(data[index], update);
                    io.call('sync', 'update')(dbid, collection, data[index]._id, update, function(result) {
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
                io.call('sync', 'remove')(dbid, collection, data[data.length - 1]._id, 
                    function(result) {
                        if (result[0]) throw result[0];
                    });
                //notifyChanged('removed', data.pop());
            };

            this.push = function(obj) {
                io.call('sync', 'add')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
                //data.push(obj);
                //notifyChanged('inserted', obj);
            };

            this.reverse = function() {
                return data.reverse();
            };

            this.shift = function() {
                io.call('sync', 'remove')(dbid, collection, data[0]._id, function(result) {
                    if (result[0]) throw result[0];
                });
                //notifyChanged('removed', data.shift());
            };

            this.slice = function(start, end) {
                return data.slice(start, end);
            };

            this.sort = function(fn) {
                return data.sort(fn);
            };

            this.splice = function(index, num) {
                for (var i = num - 1; i >= 0; i--) {
                    io.call('sync', 'remove')(dbid, collection, data[index + i]._id, function(result) {
                        if (result[0]) throw result[0];
                    });
                }
                
                for (var i = arguments.length - 1; i >= 2; i--) {
                     this.push(arguments[i]);
                }
                /*data.splice.apply(data, arguments);
                notifyChanged('spliced', arguments);*/
            };

            this.toString = function() {
                return 'SynchronizedArray(' + collection + '):[' + data.join(', ') + ']';
            };

            this.unshift = function(obj) {
                io.call('sync', 'add')(dbid, collection, obj, function(result) {
                    if (result[0]) throw result[0];
                });
                //data.unshift(obj);
                //notifyChanged('inserted', obj);
            };

            this.valueOf = function() {
                return data.valueOf();
            };

            this.observe = function(fn) {
                changeCallbacks.unshift(fn);
            };
        }

        return sync;
    };
});
