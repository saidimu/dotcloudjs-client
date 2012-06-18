/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

// ## dotcloud.twitter  
// *Sub-module providing the Twitter API*  
// REST API, Search API and Streaming API are supported. Bindings are
// mostly done one-to-one on REST endpoints.  
// Also provides a simplified oauth mechanism (see OAuth section).  
// *Parameters that identify a user can be given either a `screen_name` or a `user_id`.
// To avoid ambiguity, `screen_name`s can be prefixed with "@"*
define(function(require) {
    return function(config) {
        var appService = null, accessToken = null, appKey;
        var transfer = function(name, args, noauth) {
            if (!appService) throw 'Twitter service was not initialized.';
            args = Array.prototype.slice.call(args);
            noauth || args.unshift(accessToken);
            io.call(appService, name).apply(undefined, args);
        };

        var module = {
            // `init(key, [secret], [token], callback)`  
            // Initializes the twitter service for the twitter application identified
            // by its consumer *key*. The consumer secret has to be provided **once** and will
            // be persisted safely on the server. It should not be exposed in released code!  
            // For quick testing, the *token* parameter can also be provided with an 
            // access token object containing a key and secret.
            init: function(key, secret, token, cb) {
                if (typeof secret == 'function') {
                    cb = secret, token = null, secret = null;
                } else if (typeof token == 'function') {
                    cb = token, token = null;
                    if (typeof secret != 'string') {
                        token = secret, secret = null;
                    }
                    
                }

                io.call('twitter', 'init')(key, secret, token, function(svcName) {
                    if (svcName.error) {
                        if (typeof svcName.error == 'string') {
                            throw svcName.error;
                        } else {
                            throw JSON.stringify(svcName.error);
                        }
                    } else {
                        appKey = key;
                        appService = svcName;
                        cb && cb();
                    }
                });
            },
            
            // ### Timelines  
            // `timeline([type], [params], cb)`  
            // [GET /statuses/home\_timeline](https://dev.twitter.com/docs/api/1/GET/statuses/home_timeline), [GET /statuses/user\_timeline](https://dev.twitter.com/docs/api/1/GET/statuses/user_timeline)  
            // *type* can be either "user" or "home". Defaults to "home".  
            // *params* can be provided as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/user_timeline),
            // [here](https://dev.twitter.com/docs/api/1/get/statuses/home_timeline)
            timeline: function(type, params, cb) {
                transfer('timeline', arguments);
            },
            // `timeline([params], cb)`  
            // [GET /statuses/mentions](https://dev.twitter.com/docs/api/1/GET/statuses/mentions)  
            // *params* can be provided as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/mentions)
            mentions: function(params, cb) {
                transfer('mentions', arguments);
            },
            // `retweetsTimeline([type], [user], [params], cb)`  
            // [GET /statuses/retweeted\_by\_me](https://dev.twitter.com/docs/api/1/GET/statuses/retweeted_by_me), [GET /statuses/retweeted\_to\_me](https://dev.twitter.com/docs/api/1/GET/statuses/retweeted_to_me),
            // [GET /statuses/retweets\_of\_me](https://dev.twitter.com/docs/api/1/GET/statuses/retweets_of_me), [GET /statuses/retweeted\_by\_user](https://dev.twitter.com/docs/api/1/GET/statuses/retweeted_by_user), 
            // [GET /statuses/retweeted\_to\_user](https://dev.twitter.com/docs/api/1/GET/statuses/retweeted_to_user)  
            // *type* can be one of `[by, to, of]`  
            // *user* is a `user_id` or a `screen_name`. The values `"me"` and `null` will retrieve the
            // timeline for the authenticated user.  
            // *params* can be provided as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/retweeted_by_user)  
            retweetsTimeline: function(type, user, params, cb) {
                transfer('retweetsTimeline', arguments);
            },

            // ### Statuses  
            // `retweeters(id, ids, [params], cb)`  
            // [GET /statuses/:id/retweeted\_by](https://dev.twitter.com/docs/api/1/GET/statuses/:id/retweeted_by), [GET /statuses/:id/retweeted\_by/ids](https://dev.twitter.com/docs/api/1/GET/statuses/:id/retweeted_by/ids)  
            // *id* is the status id whose retweeters you want to look up.  
            // *ids* is a boolean. If set to true, an array of `user_id`s will be returned.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweeted_by)
            retweeters: function(id, ids, params, cb) {
                transfer('retweeters', arguments);
            },

            // `retweets(id, [params], cb)`  
            // [GET /statuses/retweets/:id](https://dev.twitter.com/docs/api/1/GET/statuses/retweets/:id)  
            // *id* is the status id for which you want to find retweets.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/retweets)
            retweets: function(id, params, cb) {
                transfer('retweets', arguments);
            },
            // `showStatus(id, [params], cb)`  
            // [GET /statuses/show/:id](https://dev.twitter.com/docs/api/1/GET/statuses/show/:id)  
            // *id* is the status id for which you want to find retweets.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/statuses/%3Aid/show)
            showStatus: function(id, params, cb) {
                transfer('showStatus', arguments);
            },
            // `destroyStatus(id, cb)`  
            // [POST /statuses/destroy/:id](https://dev.twitter.com/docs/api/1/POST/statuses/destroy/:id)  
            // *id* is the id of the status you want to destroy.  
            destroyStatus: function(id, cb) {
                transfer('destroyStatus', arguments);
            },

            // `updateStatus(status, [params], cb)`  
            // [POST /statuses/update](https://dev.twitter.com/docs/api/1/POST/statuses/update)  
            // *status* is the status (tweet) you want to post.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/statuses/update)
            updateStatus: function(status, params, cb) {
                transfer('updateStatus', arguments);
            },

            // `retweetStatus(id, cb)`  
            // [POST /statuses/retweet/:id](https://dev.twitter.com/docs/api/1/POST/statuses/retweet/:id)  
            // *id* is the id of the status you want to retweet.  
            retweetStatus: function(id, cb) {
                transfer('retweetStatus', arguments);
            },

            // ### Direct messages
            // `receivedDMs([params], cb)`  
            // [GET /direct\_messages](https://dev.twitter.com/docs/api/1/GET/direct_messages)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/direct_messages)
            receivedDMs: function(params, cb) {
                transfer('receivedDMs', arguments);
            },

            // `sentDMs([params], cb)`  
            // [GET /direct\_messages/sent](https://dev.twitter.com/docs/api/1/GET/direct_messages/sent)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/direct_messages/sent)
            sentDMs: function(params, cb) {
                transfer('sentDMs', arguments);
            },

            // `destroyDM(id, cb)`  
            // [POST /direct\_messages/:id/destroy](https://dev.twitter.com/docs/api/1/POST/direct_messages/:id/destroy)  
            // *id* is the id of the message you want to destroy.
            destroyDM: function(id, cb) {
                transfer('destroyDM', arguments);
            },

            // `newDM(user, text, [params], cb)`  
            // [POST /direct\_messages/new](https://dev.twitter.com/docs/api/1/POST/direct_messages/new)  
            // *user* can be either a `user_id` or `screen_name` indicating the recipient
            // of the DM.  
            // *text* is the content of the message to be sent.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/direct_messages/new)
            newDM: function(user, text, params, cb) {
                transfer('newDM', arguments);
            },

            // ### Friends/followers
            // `followers(user, [params], cb)`  
            // [GET /followers/ids](https://dev.twitter.com/docs/api/1/GET/followers/ids)  
            // *user* can be either a `user_id` or `screen_name` indicating whose followers
            // to get.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/followers/ids)
            followers: function(user, params, cb) {
                transfer('followers', arguments);
            },
            // `friends(user, [params], cb)`  
            // [GET /friends/ids](https://dev.twitter.com/docs/api/1/GET/friends/ids)  
            // *user* can be either a `user_id` or `screen_name` indicating whose friends
            // to get.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/friends/ids)
            friends: function(user, params, cb) {
                transfer('friends', arguments);
            },
            // `areFriends(userA, userB, cb)`  
            // [GET /friendships/exists](https://dev.twitter.com/docs/api/1/GET/friendships/exists)  
            // *userA* and *userB* can be `user_id` or `screen_name`.  
            // Will return true if userA follows userB, false otherwise.
            areFriends: function(userA, userB, cb) {
                transfer('areFriends', arguments);
            },
            // `friendshipsIn([params], cb)`  
            // [GET /friendships/incoming](https://dev.twitter.com/docs/api/1/GET/friendships/incoming)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/friendships/incoming)
            friendshipsIn: function(params, cb) {
                transfer('friendshipsIn', arguments);
            },
            // `friendshipsOut([params], cb)`
            // [GET /friendships/outgoing](https://dev.twitter.com/docs/api/1/GET/friendships/outgoing)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/friendships/outgoing)
            friendshipsOut: function(params, cb) {
                transfer('friendshipsOut', arguments);
            },
            // `showFriendship(source, target, cb)`  
            // [GET /friendships/show](https://dev.twitter.com/docs/api/1/GET/friendships/show)  
            // *source* and *target* can be either `user_id` or `screen_name`.
            showFriendship: function(source, target, cb) {
                transfer('showFriendship', arguments);
            },
            // `createFriendship(user, follow, cb)`  
            // [POST /friendships/create](https://dev.twitter.com/docs/api/1/POST/friendships/create)  
            // *user* can be either a `screen_name` or `user_id`  
            // *follow* is a boolean that, if set to true, will enable notifications
            // for the target user.
            createFriendship: function(user, follow, cb) {
                transfer('createFriendship', arguments);
            },
            // `destroyFriendship(user, cb)`  
            // [POST /friendships/destroy](https://dev.twitter.com/docs/api/1/POST/friendships/destroy)  
            // *user* can be either a `screen_name` or `user_id`
            destroyFriendship: function(user, cb) {
                transfer('destroyFriendship', arguments);
            },
            // `lookupFriendships(users, cb)`  
            // [GET /friendshups/lookup](https://dev.twitter.com/docs/api/1/GET/friendshups/lookup)  
            // *users* is an array of `screen_name`s or `user_id`s
            lookupFriendships: function(users, cb) {
                transfer('lookupFriendships', arguments);
            },
            // `updateFriendship(user, device, retweets, cb)`  
            // [POST /friendships/update](https://dev.twitter.com/docs/api/1/POST/friendships/update)  
            // *user* can be either a `screen_name` or `user_id`  
            // *device* is a boolean that enables/disables notifications 
            // from target user. Pass in null to leave unchanged.  
            // *retweets* is a boolean that enables/disables retweets from
            // target user. Pass in null to leave unchanged.
            updateFriendship: function(user, device, retweets, cb) {
                transfer('updateFriendship', arguments);
            },

            // ### Users
            // `lookupUsers(users, cb)`  
            // [GET /users/lookup](https://dev.twitter.com/docs/api/1/GET/users/lookup)  
            // *users* is an array of `screen_name`s or `user_id`s
            lookupUsers: function(users, cb) {
                transfer('lookupUsers', arguments);
            },
            // `searchUsers(query, [params], cb)`  
            // [GET /users/search](https://dev.twitter.com/docs/api/1/GET/users/search)  
            // *query* is the search query to execute.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/users/search)
            searchUsers: function(query, params, cb) {
                transfer('searchUsers', arguments);
            },
            // `showUser(user, [params], cb)`  
            // [GET /users/show](https://dev.twitter.com/docs/api/1/GET/users/show)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/users/show)
            showUser: function(user, params, cb) {
                transfer('showUser', arguments);
            },
            // `contributees(user, [params], cb)`  
            // [GET /users/contributees](https://dev.twitter.com/docs/api/1/GET/users/contributees)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/users/contributees)
            contributees: function(user, params, cb) {
                transfer('contributees', arguments);
            },
            // `contributors(user, [params], cb)`  
            // [GET /users/contributors](https://dev.twitter.com/docs/api/1/GET/users/contributors)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/users/contributors)
            contributors: function(user, params, cb) {
                transfer('contributors', arguments);
            },
            // `suggestionCategories([lang], cb)`  
            // [GET /users/suggestions](https://dev.twitter.com/docs/api/1/GET/users/suggestions)  
            // *lang* is a two-letter language code, defaults to `en`.
            suggestionCategories: function(lang, cb) {
                transfer('suggestionCategories', arguments);
            },
            // `suggestions(slug, [members], [lang], cb)`  
            // [GET /users/suggestions/:slug](https://dev.twitter.com/docs/api/1/GET/users/suggestions/:slug), [GET /users/suggestions/:slug/members](https://dev.twitter.com/docs/api/1/GET/users/suggestions/:slug/members)  
            // *slug* is the slug identifier for the suggestion category.  
            // *members* is a boolean indicating if the most recent status of suggested users
            // should be included in the response. Defaults to false.  
            // *lang* is a two-letter language code, defaults to `en`.
            suggestions: function(slug, members, lang, cb) {
                transfer('suggestions', arguments);
            },

            // ### Block
            // `blocking([params], [ids], cb)`  
            // [GET /blocks/blocking](https://dev.twitter.com/docs/api/1/GET/blocks/blocking), [GET /blocks/blocking/ids](https://dev.twitter.com/docs/api/1/GET/blocks/blocking/ids)  
            // *ids* - if true, return an array of user ids instead of full user objects  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/blocks/blocking)
            blocking: function(params, ids, cb) {
                transfer('blocking', arguments);
            },
            // `isBlocked(user, [params], cb)`  
            // [GET /blocks/exists](https://dev.twitter.com/docs/api/1/GET/blocks/exists)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/blocks/exists)
            isBlocked: function(user, params, cb) {
                transfer('isBlocked', arguments);
            },
            // `createBlock(user, [params], cb)`  
            // [POST /blocks/create](https://dev.twitter.com/docs/api/1/POST/blocks/create)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/blocks/create)
            createBlock: function(user, params, cb) {
                transfer('createBlock', arguments);
            },
            // `destroyBlock(user, [params], cb)`  
            // [POST /blocks/destroy](https://dev.twitter.com/docs/api/1/POST/blocks/destroy)  
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/blocks/destroy)
            destroyBlock: function(user, params, cb) {
                transfer('destroyBlock', arguments);
            },

            // ### Favorites
            // `favorites(user, [params], cb)`  
            // [GET /favorites](https://dev.twitter.com/docs/api/1/GET/favorites)
            // *user* can be either a `screen_name` or `user_id`  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/favorites)
            favorites: function(user, params, cb) {
                transfer('favorites', arguments);
            },
            // `createFavorite(id, cb)`  
            // [POST /favorites/create/:id](https://dev.twitter.com/docs/api/1/POST/favorites/create/:id)  
            // *id* is the identifier for the tweet to be added to favorites.
            createFavorite: function(id, cb) {
                transfer('createFavorite', arguments);
            },
            // `destroyFavorite(id, cb)`  
            // [POST /favorites/destroy/:id](https://dev.twitter.com/docs/api/1/POST/favorites/destroy/:id)  
            // *id* is the identifier for the tweet to be removed from favorites.
            destroyFavorite: function(id, cb) {
                transfer('destroyFavorite', arguments);
            },

            // ### Lists
            // `allLists([user], cb)`  
            // [GET /lists/all](https://dev.twitter.com/docs/api/1/GET/lists/all)  
            // *user* can be either a `screen_name` or `user_id`. If ommitted, 
            // defaults to the currently authenticated user.  
            allLists: function(user, cb) {
                transfer('allLists', arguments);
            },

            // `listStatuses(list, [owner], [params], cb)`  
            // [GET /lists/statuses](https://dev.twitter.com/docs/api/1/GET/lists/statuses)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/statuses)
            listStatuses: function(list, owner, params, cb) {
                transfer('listStatuses', arguments);
            },

            // `listSubscriptions(user, [params], cb)`  
            // [GET /lists/subscriptions](https://dev.twitter.com/docs/api/1/GET/lists/subscriptions)  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/subscriptions)
            listSubscriptions: function(user, params, cb) {
                transfer('listSubscriptions', arguments);
            },

            // `listSubscribers(list, [owner], [params], cb)`  
            // [GET /lists/subscribers](https://dev.twitter.com/docs/api/1/GET/lists/subscribers)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/subscribers)
            listSubscribers: function(list, owner, params, cb) {
                transfer('listSubscribers', arguments);
            },

            // `listSubscribe(list, [owner], cb)`  
            // [POST /lists/subscribers/create](https://dev.twitter.com/docs/api/1/POST/lists/subscribers/create)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            listSubscribe: function(list, owner, cb) {
                transfer('listSubscribe', arguments);
            },

            // `isListSubscriber(list, [owner], user, [params], cb)`  
            // [GET /lists/subscribers/show](https://dev.twitter.com/docs/api/1/GET/lists/subscribers/show)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/subscribers/show)
            isListSubscriber: function(list, owner, user, params, cb) {
                transfer('isListSubscriber', arguments);
            },

            // `listUnsubscribe(list, [owner], cb)`  
            // [POST /lists/subscribers/destroy](https://dev.twitter.com/docs/api/1/POST/lists/subscribers/destroy)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            listUnsubscribe: function(list, owner, cb) {
                transfer('listUnsubscribe', arguments);
            },

            // `listMemberships(user, [params], cb)`  
            // [GET /lists/memberships](https://dev.twitter.com/docs/api/1/GET/lists/memberships)  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/memberships)
            listMemberships: function(user, params, cb) {
                transfer('listMemberships', arguments);
            },

            // `listMembers(list, [owner], [params], cb)`  
            // [GET /lists/members](https://dev.twitter.com/docs/api/1/GET/lists/members)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/members)
            listMembers: function(list, owner, params, cb) {
                transfer('listMembers', arguments);
            },

            // `addMember(list, [owner], user, cb)`  
            // [POST /lists/members/create](https://dev.twitter.com/docs/api/1/POST/lists/members/create), [POST /lists/members/create\_all](https://dev.twitter.com/docs/api/1/POST/lists/members/create_all)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`. Alternatively, 
            // if an array is provided, the create_all endpoint will be used.
            addMember: function(list, owner, user, cb) {
                transfer('addMember', arguments);
            },

            // `isListMember(list, [owner], user, [params], cb)`  
            // [GET /lists/members/show](https://dev.twitter.com/docs/api/1/GET/lists/members/show)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/lists/members/show)
            isListMember: function(list, owner, user, params, cb) {
                transfer('isListMember', arguments);
            },

            // `removelistMember(list, [owner], user, cb)`  
            // [POST /lists/members/destroy](https://dev.twitter.com/docs/api/1/POST/lists/members/destroy), [POST /lists/members/destroy\_all](https://dev.twitter.com/docs/api/1/POST/lists/members/destroy_all)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *user* can be either a `screen_name` or `user_id`. Alternatively, 
            // if an array is provided, the destroy\_all endpoint will be used.
            removeListMember: function(list, owner, user, cb) {
                transfer('removeListMember', arguments);
            },

            // `createList(name, mode, [desc], cb)`  
            // [POST /lists/create](https://dev.twitter.com/docs/api/1/POST/lists/create)  
            // *name* Name of the list to be created.  
            // *mode* one of "private", "public".  
            // *desc* Optional list description.
            createList: function(name, mode, desc, cb) {
                transfer('createList', arguments);
            },

            // `destroyList(list, [owner], cb)`  
            // [POST /lists/destroy](https://dev.twitter.com/docs/api/1/POST/lists/destroy)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            destroyList: function(list, owner, cb) {
                transfer('destroyList', arguments);
            },

            // `updateList(list, [owner], update, cb)`  
            // [POST /lists/update](https://dev.twitter.com/docs/api/1/POST/lists/update)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            // *update* an object containing (optionally) `mode`, `name` and 
            // `description` keys
            updateList: function(list, owner, update, cb) {
                transfer('updateList', arguments);
            },

            // `lists(user, [cursor], cb)`  
            // [GET /lists](https://dev.twitter.com/docs/api/1/GET/lists)  
            // *user* can be either a `screen_name` or `user_id`.  
            // *cursor* integer that can be used to break the results into pages.
            // If ommitted, the result will be sent in one single chunk.
            lists: function(user, cursor, cb) {
                transfer('lists', arguments);
            },

            // `showList(list, [owner], cb)`  
            // [GET /lists/show](https://dev.twitter.com/docs/api/1/GET/lists/show)  
            // *list* can be either a list ID or a slug, in which case the
            // *owner* parameter is required.  
            // *owner* can be either a `screen_name` or `user_id`.  
            showList: function(list, owner, cb) {
                transfer('showList', arguments);
            },

            // ### Accounts
            // `rateLimit(cb)`  
            // [GET /account/rate\_limit\_status](https://dev.twitter.com/docs/api/1/GET/account/rate_limit_status)
            rateLimit: function(cb) {
                transfer('rateLimit', arguments);
            },
            // `verifyCredentials(cb)`  
            // [GET /account/verify\_credentials](https://dev.twitter.com/docs/api/1/GET/account/verify_credentials)
            verifyCredentials: function(cb) {
                transfer('verifyCredentials', arguments);
            },

            // `endSession(cb)`  
            // [GET /account/end\_session](https://dev.twitter.com/docs/api/1/GET/account/end_session)
            endSession: function(cb) {
                transfer('endSession', arguments);
            },
            // `updateProfile(params, cb)`  
            // [POST /account/update\_profile](https://dev.twitter.com/docs/api/1/POST/account/update_profile)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/account/update_profile)
            updateProfile: function(params, cb) {
                transfer('updateProfile', arguments);
            },
            // `updateBackgroundImg(image, [params], cb)`  
            // [POST /account/update\_profile\_background\_image](https://dev.twitter.com/docs/api/1/POST/account/update_profile_background_image)  
            // *image* image data, base-64 encoded.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/account/update_profile_background_image)
            updateBackgroundImg: function(image, params, cb) {
                transfer('updateBackgroundImg', arguments);
            },
            // `updateProfileImg(image, [params], cb)`  
            // [POST /account/update\_profile\_image](https://dev.twitter.com/docs/api/1/POST/account/update_profile_image)  
            // *image* image data, base-64 encoded.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/account/update_profile_image)
            updateProfileImg: function(image, params, cb) {
                transfer('updateProfileImg', arguments);
            },
            // `updateProfileColors(params, cb)`  
            // [POST /account/update\_profile\_colors](https://dev.twitter.com/docs/api/1/POST/account/update_profile_colors)  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/post/account/update_profile_colors)
            updateProfileColors: function(params, cb) {
                transfer('updateProfileColors', arguments);
            },

            // `accountTotals(cb)`  
            // [GET /account/totals](https://dev.twitter.com/docs/api/1/GET/account/totals)
            accountTotals: function(cb) {
                transfer('accountTotals', arguments);
            },

            // `settings(cb)`  
            // [GET /account/settings](https://dev.twitter.com/docs/api/1/GET/account/settings)
            settings: function(cb) {
                transfer('settings', arguments);
            },

            // `updateSettings(params, cb)`  
            // [POST /account/settings](https://dev.twitter.com/docs/api/1/POST/account/settings)  
            // *params as specified [here](https://dev.twitter.com/docs/api/1/post/account/settings)
            updateSettings: function(params, cb) {
                transfer('updateSettings', arguments);
            },

            // ### Notifications
            // `follow(user, cb)`  
            // [POST /notifications/follow](https://dev.twitter.com/docs/api/1/POST/notifications/follow)  
            // *user* can be either a `screen_name` or `user_id`.
            follow: function(user, cb) {
                transfer('follow', arguments);
            },
            // `leave(user, cb)`  
            // [POST /notifications/leave](https://dev.twitter.com/docs/api/1/POST/notifications/leave)  
            // *user* can be either a `screen_name` or `user_id`.
            leave: function(user, cb) {
                transfer('leave', arguments);
            },
            // ### Saved searches
            // `savedSearches(cb)`  
            // [GET /saved\_searches](https://dev.twitter.com/docs/api/1/GET/saved_searches)
            savedSearches: function(cb) {
                transfer('savedSearches', arguments);
            },
            // `showSavedSearch(id, cb)`  
            // [GET /saved\_searches/show/:id](https://dev.twitter.com/docs/api/1/GET/saved_searches/show/:id)  
            // *id*: identifier for the saved search
            showSavedSearch: function(id, cb) {
                transfer('showSavedSearch', arguments);
            },
            // `createSavedSearch(query, cb)`  
            // [POST /saved\_searches/create](https://dev.twitter.com/docs/api/1/POST/saved_searches/create)  
            // *query*: search query that needs to be saved
            createSavedSearch: function(query, cb) {
                transfer('createSavedSearch', arguments);
            },
            // `destroySavedSearch(id, cb)`  
            // [POST /saved\_searches/destroy/:id](https://dev.twitter.com/docs/api/1/POST/saved_searches/destroy/:id)  
            // *id*: identifier for the saved search
            destroySavedSearch: function(id, cb) {
                transfer('destroySavedSearch', arguments);
            },

            // ### Geolocation
            // `geoId(placeId, cb)`  
            // [GET /geo/id/:place\_id](https://dev.twitter.com/docs/api/1/GET/geo/id/:place_id)  
            // *placeId*: Identifier for the place we need information on
            geoId: function(placeId, cb) {
                transfer('geoId', arguments);
            },
            // `reverseGeocode(latitude, longitude, [params], cb)`  
            // [GET /geo/reverse\_geocode](https://dev.twitter.com/docs/api/1/GET/geo/reverse_geocode)
            // *latitude*, *longitude*: place coordinates.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/geo/reverse_geocode)
            reverseGeocode: function(latitude, longitude, params, cb) {
                transfer('reverseGeocode', arguments);
            },
            // `searchGeo(query, [params], cb)`  
            // [GET /geo/search](https://dev.twitter.com/docs/api/1/GET/geo/search)  
            // *query*: Search query  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/geo/search)
            searchGeo: function(query, params, cb) {
                transfer('searchGeo', arguments);
            },
            // `similarPlaces(latitude, longitude, name, [params], cb)`  
            // [GET /geo/similar\_places](https://dev.twitter.com/docs/api/1/get/geo/similar_places)  
            // *latitude*, *longitude*: place coordinates.  
            // *name* of the place referred to.  
            // *params* as specified [here](https://dev.twitter.com/docs/api/1/get/geo/similar_places)
            similarPlaces: function(latitude, longitude, name, params, cb) {
                transfer('similarPlaces', arguments);
            },
            // `createPlace(params, cb)`  
            // [POST /geo/place](https://dev.twitter.com/docs/api/1/POST/geo/place)
            createPlace: function(params, cb) {
                transfer('createPlace', arguments);
            },

            // ### Trends
            // `trends(woeid, [exclude], cb)`  
            // [GET /trends/:woeid](https://dev.twitter.com/docs/api/1/GET/trends/:woeid)  
            // *woeid*: The Yahoo! Where On Earth ID of the location to return trending information for. Global information is available by using 1 as the WOEID.  
            // *exclude*: Setting this equal to hashtags will remove all hashtags from the trends list.
            trends: function(woeid, exclude, cb) {
                transfer('trends', arguments);
            },
            // `availableTrends(latitude, longitude, cb)`  
            // [GET /trends/available](https://dev.twitter.com/docs/api/1/GET/trends/available)  
            // *latitude*, *longitude*: place coordinates.
            availableTrends: function(latitude, longitude, cb) {
                transfer('dailyTrends', arguments);
            },
            // `dailyTrends([params], cb)`  
            // [GET /trends/daily](https://dev.twitter.com/docs/api/1/GET/trends/daily)  
            // *params*: see [GET /trends/daily](https://dev.twitter.com/docs/api/1/GET/trends/daily)
            dailyTrends: function(params, cb) {
                transfer('dailyTrends', arguments);
            },
            // `weeklyTrends([params], cb)`  
            // [GET /trends/weekly](https://dev.twitter.com/docs/api/1/GET/trends/weekly)  
            // *params*: see [GET /trends/weekly](https://dev.twitter.com/docs/api/1/GET/trends/weekly)
            weeklyTrends: function(params, cb) {
                transfer('weeklyTrends', arguments);
            },

            // ### Help
            // `test(cb)`  
            // [GET /help/test](https://dev.twitter.com/docs/api/1/GET/help/test)
            test: function(cb) {
                transfer('test', [cb]);
            },
            // `config(cb)`  
            // [GET /help/configuration](https://dev.twitter.com/docs/api/1/GET/help/configuration)
            config: function(cb) {
                transfer('config', [cb], true);
            },
            // `languages(cb)`  
            // [GET /help/languages](https://dev.twitter.com/docs/api/1/GET/help/languages)
            languages: function(cb) {
                transfer('languages', [cb], true);
            },

            // ### Search API
            // `search(query, [params], cb)`  
            // [GET /search](https://dev.twitter.com/docs/api/1/get/search)
            search: function(query, params, cb) {
                transfer('search', arguments, true);
            },

            // ## Streaming API
            // `sampleStream([params], cb)`  
            // [GET /statuses/sample](https://dev.twitter.com/docs/api/1/get/statuses/sample)
            sampleStream: function(params, cb) {
                transfer('sampleStream', arguments);
            },
            // `filteredStream([params], cb)`  
            // [POST /statuses/filter](https://dev.twitter.com/docs/api/1/post/statuses/filter)
            filteredStream: function(params, cb) {
                transfer('filteredStream', arguments);
            },
            // `firehose([params], cb)`  
            // [GET /statuses/sample](https://dev.twitter.com/docs/api/1/get/statuses/firehose)
            firehose: function(params, cb) {
                transfer('firehose', arguments);
            },
            // `siteStream(follow, [params], cb)`  
            // [GET /site](https://dev.twitter.com/docs/api/2b/get/site)
            siteStream: function(follow, params, cb) {
                transfer('siteStream', arguments);
            },
            // `userStream([params], cb)`  
            // [GET /user](https://dev.twitter.com/docs/api/2/get/user)
            userStream: function(params, cb) {
                transfer('userStream', arguments);
            },

            // ## OAuth
            // `requestToken(cb)`  
            // First step in OAuth process, obtains a request token.
            requestToken: function(cb) {
                transfer('requestToken', [config.host, cb], true);
            },
            // `accessToken(requestToken, secret, cb)`  
            // Second step in OAuth process. Provided with a *requestToken* key and 
            // *secret*, obtain an `access_token` after redirecting the user through
            // the twitter page and back.
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
            // `auth(cb)`  
            // Chains all steps of the OAuth process and saves the obtained
            // `access_token` in a cookie for future sessions.
            auth: function(cb) {
                if (!appService) throw 'Twitter service was not initialized.';

                var cookie = JSON.parse($.cookie('dotcloudjs-twitter.' + appKey));
                if (cookie && cookie.screen_name) {
                    accessToken = { key: cookie.key, secret: cookie.secret };
                    return cb(cookie);
                }
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

            // `logout([cb])`  
            // Remove the `access_token` cookie and unauthenticate the user.
            logout: function(cb) {
                if (!appKey) throw 'Twitter service was not initialized.';
                $.cookie('dotcloudjs-twitter.' + appKey, null, { path: '/' });
                accessToken = null;
                cb && cb();
            },

            // `setAccessToken(key, secret)`  
            // Set the access token manually (for example, an access token can be 
            // obtained through the twitter developers site.)
            setAccessToken: function(key, secret) {
                accessToken = { key: key, secret: secret };
            }
        };

        return module;
    };
});