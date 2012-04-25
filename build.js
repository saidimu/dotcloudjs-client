var fs = require('fs');

var DEFAULT_CONFIG = {
    paths: {
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
        "dotcloud": "http://jslib-dotcloud-labs.dotcloud.com/dotcloud",
        "jq-cookie": "http://jslib-dotcloud-labs.dotcloud.com/jq-cookie",
        "config": "http://jslib-dotcloud-labs.dotcloud.com/config"
    }
};

var argc = process.argv.length;

function conf_string(cfg_obj) {
    return 'require.config(' + JSON.stringify(cfg_obj) + ');';
}

function usage() {
    console.error('Usage: node build.js [-f config.json]');
}

function build(cfg_obj) {
    var requirejs_content = fs.readFileSync('./libraries/require.js', 'utf-8');
    fs.mkdirSync('./build');
    fs.writeFileSync('./build/dotcloud-require.js', requirejs_content + 
        conf_string(cfg_obj));
}

if (argc === 2) { // No additional arguments, default build
    build(DEFAULT_CONFIG);
} else if (process.argv[2] == '-f' && argc === 4) {
    var cfg = null;
    try {
        cfg = JSON.parse(fs.readFileSync(process.argv[3]));
    } catch (e) {
        console.error('File should obey the JSON format.', e);
        process.exit(1);
    }
    build(cfg);
} else {
    usage();
}