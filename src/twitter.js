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
            appService = null;
        var transfer = function(name, args) {
            if (!appService) throw 'Twitter service was not initialized.';
            io.call(appService, name).apply(undefined, args);
        }

        var module = {
            init: function(key, secret, token, cb) {
                io.call('twitter', 'init')(key, secret, token, function(svcName) {
                    appService = svcName;
                    cb();
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
                transfer('blocking', [params, ids, cb]);
            },
            isBlocked: function(user, params, cb) {
                transfer('isBlocked', [user, params, cb]);
            },
            createBlock: function(user, params, cb) {
                transfer('createBlock', [user, params, cb]);
            },
            destroyBlock: function(user, params, cb) {
                transfer('destroyBlock', [user, params, cb]);
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
                transfer('allLists', [user, cb]);
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
                transfer('rateLimit', [cb]);
            },
            verifyCredentials: function(cb) {
                transfer('verifyCredentials', [cb]);
            },
            endSession: function(cb) {
                transfer('endSession', [cb]);
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
                transfer('updateProfileColors', [params, cb]);
            },

            accountTotals: function(cb) {
                transfer('accountTotals', [cb]);
            },

            settings: function(cb) {
                transfer('settings', [cb]);
            },

            updateSettings: function(params, cb) {
                transfer('updateSettings', [params, cb]);
            },

            // ### Notifications
            follow: function(user, cb) {
                transfer('follow', [user, cb]);
            },
            leave: function(user, cb) {
                transfer('leave', [user, cb]);
            },
            // ### Saved searches
            savedSearches: function(cb) {
                transfer('savedSearches', [cb]);
            },
            showSavedSearch: function(id, cb) {
                transfer('showSavedSearch', [id, cb]);
            },
            createSavedSearch: function(query, cb) {
                transfer('createSavedSearch', [query, cb]);
            },
            destroySavedSearch: function(id, cb) {
                transfer('destroySavedSearch', [id, cb]);
            },

            // ### Geolocation
            geoId: function(placeId, cb) {
                transfer('geoId', [placeId, cb]);
            },
            reverseGeocode: function(latitude, longitude, params, cb) {
                transfer('reverseGeocode', [latitude, longitude, params, cb]);
            },
            searchGeo: function(query, params, cb) {
                transfer('searchGeo', [query, params, cb]);
            },
            similarPlaces: function(latitude, longitude, name, params, cb) {
                transfer('similarPlaces', arguments);
            },
            createPlace: function(params, cb) {
                transfer('createPlace', [params, cb]);
            },

            // ### Trends
            trends: function(woeid, exclude, cb) {
                transfer('trends', [woeid, exclude, cb]);
            },
            availableTrends: function(latitude, longitude, cb) {
                transfer('dailyTrends', [latitude, longitude, cb]);
            },
            dailyTrends: function(params, cb) {
                transfer('dailyTrends', [params, cb]);
            },
            weeklyTrends: function(params, cb) {
                transfer('weeklyTrends', [params, cb]);
            },

            // ### Help
            test: function(cb) {
                transfer('test', [cb]);
            },
            config: function(cb) {
                transfer('config', [cb]);
            },
            languages: function(cb) {
                transfer('languages', [cb]);
            },

            // ### Search API
            search: function() {
                transfer('search', arguments);
            },

            // ## Streaming API
            sampleStream: function(params, cb) {
                transfer('sampleStream', [params, cb]);
            },
            filteredStream: function(params, cb) {
                transfer('filteredStream', [params, cb]);
            },
            firehose: function(params, cb) {
                transfer('firehose', [params, cb]);
            },
            siteStream: function(follow, params, cb) {
                transfer('siteStream', [follow, params, cb]);
            },
            userStream: function(params, cb) {
                transfer('userStream', [params, cb]);
            }
        };

        return module;
    };
});