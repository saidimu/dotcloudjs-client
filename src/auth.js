define(function(require) {
    return function(config, io) {
        return {
            register: function(user, password, password2, cb) {
                if (password !== password2)
                    return cb({ error: 'Passwords do not match.' });
                io.call('auth', 'register')(user, password, cb);
            },
            login: function(user, password, cb) {
                io.call('auth', 'login')(user, password, function(result) {
                    if (result.error)
                        return cb(result.error);
                    io.session().key = result.key;
                    io.session().username = result.username;
                    io.session().userId = result.userId;
                    cb('OK');
                });
            },
            logout: function() {
                var s = io.session();
                for (var k in s) {
                    s[k] = undefined;
                }
            },
            checkAvailable: function(user, cb) {
                io.call('auth', 'checkAvailable')(user, cb);
            },
            getUserId: function(cb) {
                io.call('auth', 'getUserId')(cb);
            }
        }
    }
});