/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// ## dotcloud.twitter
define(function(require) {
    return function(config) {
        var io = require('stack.io')(),
            appService = null, accessToken = null;
        var transfer = function(name, args, noauth) {
            if (!appService) throw 'Twitter service was not initialized.';
            args = Array.prototype.slice.call(args);
            noauth || args.unshift(accessToken);
            console.log(name + ": ", args);
            io.call(appService, name).apply(undefined, args);
        }

        var module = {
            init: function(key, secret, token, cb) {
                if (typeof token == 'function') {
                    cb = token, token = null;
                }

                io.call('twitter', 'init')(key, secret, token, function(svcName) {
                    appService = svcName;
                    cb && cb();
                });
            },
            
            // ### Timelines
            timeline: function(type, params, cb) {
                transfer('timeline', arguments);
            },
            mentions: function(params, cb) {
                transfer('mentions', arguments);
            },
            retweetsTimeline: function(type, user, params, cb) {
                transfer('retweetsTimeline', arguments);
            },

            // ### Statuses
            retweeters: function(id, ids, params, cb) {
                transfer('retweeters', arguments);
            },
            retweets: function(id, params, cb) {
                transfer('retweets', arguments);
            },
            showStatus: function(id, params, cb) {
                transfer('showStatus', arguments);
            },
            destroyStatus: function(id, cb) {
                transfer('destroyStatus', arguments);
            },
            updateStatus: function(status, params, cb) {
                transfer('updateStatus', arguments);
            },
            retweetStatus: function(id, cb) {
                transfer('retweetStatus', arguments);
            },

            // ### Direct messages
            receivedDMs: function(params, cb) {
                transfer('receivedDMs', arguments);
            },
            sentDMs: function(params, cb) {
                transfer('sentDMs', arguments);
            },
            destroyDM: function(id, cb) {
                transfer('destroyDM', arguments);
            },
            newDM: function(user, text, params, cb) {
                transfer('newDM', arguments);
            },

            // ### Friends/followers
            followers: function(user, cb) {
                transfer('followers', arguments);
            },
            friends: function(user, cb) {
                transfer('friends', arguments);
            },
            areFriends: function(userA, userB, cb) {
                transfer('areFriends', arguments);
            },
            friendshipsIn: function(params, cb) {
                transfer('friendshipsIn', arguments);
            },
            friendshipsOut: function(params, cb) {
                transfer('friendshipsOut', arguments);
            },
            showFriendship: function(source, target, cb) {
                transfer('showFriendship', arguments);
            },
            createFriendship: function(user, follow, cb) {
                transfer('createFriendship', arguments);
            },
            destroyFriendship: function(user, cb) {
                transfer('destroyFriendship', arguments);
            },
            lookupFriendships: function(users, cb) {
                transfer('lookupFriendships', arguments);
            },
            updateFriendship: function(user, device, retweets, cb) {
                transfer('updateFriendship', arguments);
            },

            // ### Users
            lookupUsers: function(users, cb) {
                transfer('lookupUsers', arguments);
            },
            searchUsers: function(query, params, cb) {
                transfer('searchUsers', arguments);
            },
            showUser: function(user, params, cb) {
                transfer('showUser', arguments);
            },
            contributees: function(user, params, cb) {
                transfer('contributees', arguments);
            },
            contributors: function(user, params, cb) {
                transfer('contributors', arguments);
            },
            suggestionCategories: function(lang, cb) {
                transfer('suggestionCategories', arguments);
            },
            suggestions: function(slug, members, lang, cb) {
                transfer('suggestions', arguments);
            },

            // ### Block
            blocking: function(params, ids, cb) {
                transfer('blocking', arguments);
            },
            isBlocked: function(user, params, cb) {
                transfer('isBlocked', arguments);
            },
            createBlock: function(user, params, cb) {
                transfer('createBlock', arguments);
            },
            destroyBlock: function(user, params, cb) {
                transfer('destroyBlock', arguments);
            },

            // ### Favorites
            favorites: function(user, params, cb) {
                transfer('favorites', arguments);
            },
            createFavorite: function(id, cb) {
                transfer('createFavorite', arguments);
            },
            destroyFavorite: function(id, cb) {
                transfer('destroyFavorite', arguments);
            },

            // ### Lists
            allLists: function(user, cb) {
                transfer('allLists', arguments);
            },

            listStatuses: function(list, owner, params, cb) {
                transfer('listStatuses', arguments);
            },

            listSubscriptions: function(user, params, cb) {
                transfer('listSubscriptions', arguments);
            },

            listSubscribers: function(list, owner, params, cb) {
                transfer('listSubscribers', arguments);
            },

            listSubscribe: function(list, owner, cb) {
                transfer('listSubscribe', arguments);
            },

            isListSubscriber: function(list, owner, user, params, cb) {
                transfer('isListSubscriber', arguments);
            },

            listUnsubscribe: function(list, owner, cb) {
                transfer('listUnsubscribe', arguments);
            },

            listMemberships: function(user, params, cb) {
                transfer('listMemberships', arguments);
            },

            listMembers: function(list, owner, params, cb) {
                transfer('listMembers', arguments);
            },

            addMember: function(list, owner, user, cb) {
                transfer('addMember', arguments);
            },

            isListMember: function(list, owner, user, params, cb) {
                transfer('isListMember', arguments);
            },

            removeListMember: function(list, owner, user, cb) {
                transfer('removeListMember', arguments);
            },

            createList: function(name, mode, desc, cb) {
                transfer('createList', arguments);
            },

            destroyList: function(list, owner, cb) {
                transfer('destroyList', arguments);
            },

            updateList: function(list, owner, update, cb) {
                transfer('updateList', arguments);
            },

            lists: function(user, cursor, cb) {
                transfer('lists', arguments);
            },

            showList: function(list, owner, cb) {
                transfer('showList', arguments);
            },

            // ### Accounts
            rateLimit: function(cb) {
                transfer('rateLimit', arguments);
            },
            verifyCredentials: function(cb) {
                transfer('verifyCredentials', arguments);
            },
            endSession: function(cb) {
                transfer('endSession', arguments);
            },
            updateProfile: function(params, cb) {
                transfer('updateProfile', arguments);
            },
            updateBackgroundImg: function(image, params, cb) {
                transfer('updateBackgroundImg', arguments);
            },
            updateProfileImg: function(image, params, cb) {
                transfer('updateProfileImg', arguments);
            },
            updateProfileColors: function(params, cb) {
                transfer('updateProfileColors', arguments);
            },

            accountTotals: function(cb) {
                transfer('accountTotals', arguments);
            },

            settings: function(cb) {
                transfer('settings', arguments);
            },

            updateSettings: function(params, cb) {
                transfer('updateSettings', arguments);
            },

            // ### Notifications
            follow: function(user, cb) {
                transfer('follow', arguments);
            },
            leave: function(user, cb) {
                transfer('leave', arguments);
            },
            // ### Saved searches
            savedSearches: function(cb) {
                transfer('savedSearches', arguments);
            },
            showSavedSearch: function(id, cb) {
                transfer('showSavedSearch', arguments);
            },
            createSavedSearch: function(query, cb) {
                transfer('createSavedSearch', arguments);
            },
            destroySavedSearch: function(id, cb) {
                transfer('destroySavedSearch', arguments);
            },

            // ### Geolocation
            geoId: function(placeId, cb) {
                transfer('geoId', arguments);
            },
            reverseGeocode: function(latitude, longitude, params, cb) {
                transfer('reverseGeocode', arguments);
            },
            searchGeo: function(query, params, cb) {
                transfer('searchGeo', arguments);
            },
            similarPlaces: function(latitude, longitude, name, params, cb) {
                transfer('similarPlaces', arguments);
            },
            createPlace: function(params, cb) {
                transfer('createPlace', arguments);
            },

            // ### Trends
            trends: function(woeid, exclude, cb) {
                transfer('trends', arguments);
            },
            availableTrends: function(latitude, longitude, cb) {
                transfer('dailyTrends', arguments);
            },
            dailyTrends: function(params, cb) {
                transfer('dailyTrends', arguments);
            },
            weeklyTrends: function(params, cb) {
                transfer('weeklyTrends', arguments);
            },

            // ### Help
            test: function(cb) {
                transfer('test', [cb]);
            },
            config: function(cb) {
                transfer('config', [cb], true);
            },
            languages: function(cb) {
                transfer('languages', [cb], true);
            },

            // ### Search API
            search: function(query, params, cb) {
                transfer('search', arguments, true);
            },

            // ## Streaming API
            sampleStream: function(params, cb) {
                transfer('sampleStream', arguments);
            },
            filteredStream: function(params, cb) {
                transfer('filteredStream', arguments);
            },
            firehose: function(params, cb) {
                transfer('firehose', arguments);
            },
            siteStream: function(follow, params, cb) {
                transfer('siteStream', arguments);
            },
            userStream: function(params, cb) {
                transfer('userStream', arguments);
            },

            // ## OAuth
            requestToken: function(cb) {
                transfer('requestToken', [config.host, cb], true);
            },
            accessToken: function(requestToken, secret, cb) {
                if (!appService) throw 'Twitter service was not initialized.';

                var listener = function(e) {
                    if (e.origin !== config.host)
                        return;
                    var data = JSON.parse(e.data);

                    if (data.token != requestToken) {
                        return cb({ error: 'Received token is different from sent token' });
                    }

                    io.call(appService, 'accessToken')(data.verifier, data.token, secret, function(result) {
                        if (!result.error) {
                            accessToken = { key: result.key, secret: result.secret };
                        }
                        cb(result);
                    });
                    window.removeEventListener('message', listener);
                };
                window.addEventListener('message', listener);
                window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' + 
                    requestToken);
            },
            auth: function(cb) {
                // FIXME: check if cookie present before going through the whole flow.
                var self = this;
                this.requestToken(function(result) {
                    if (result.error) {
                        return cb(result);
                    }
                    self.accessToken(result.token, result.secret, function(r2) {
                        if (r2.error) {
                            return cb(r2);
                        }
                        $.cookie('dotcloudjs-twitter.' + r2.appKey, 
                            JSON.stringify(r2), { expires: 9001, path: '/' });
                        accessToken = { key: r2.key, secret: r2.secret };
                        cb(r2);
                    });
                });
            },
            setAccessToken: function(key, secret) {
                accessToken = { key: key, secret: secret };
            }
        };

        return module;
    };
});