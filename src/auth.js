define(function(require) {
    return function(config, io) {
        return {
            login: function(user, password, cb) {
                io.call('auth', 'login')(user, password, function(result) {
                    if (result.error)
                        return cb(result.error);
                    io.session().authKey = result.key;
                    cb('OK');
                });
            },
            logout: function() {
                io.session().authKey = undefined;
            }
        }
    }
});