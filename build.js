var fs = require('fs'),
    util = require('util');

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

function copy(src, dst, cb) {
    is = fs.createReadStream(src);
    os = fs.createWriteStream(dst);
    util.pump(is, os, cb);
}

function read_json(path) {
    var contents = null;
    try {
        contents = JSON.parse(fs.readFileSync(process.argv[3], 'utf-8'));
    } catch (e) {
        console.error('File should obey the JSON format.', e);
    }
    return contents;
}

function usage() {
    console.error('Usage: node build.js [[-s STACK_VARS] -f require_config.json]');
}

function build(cfg_obj) {
    var requirejs_content = fs.readFileSync('./libraries/require.js', 'utf-8');
    fs.mkdirSync('./build');
    fs.writeFileSync('./build/dotcloud-require.js', requirejs_content + 
        conf_string(cfg_obj));
}

function copy_src_files() {
    copy('./src/dotcloud.js', './build/dotcloud.js');
    copy('./libraries/jq-cookie.js', './build/jq-cookie.js');
}

if (argc === 2) { // No additional arguments, default build
    build(DEFAULT_CONFIG);
} else if (process.argv[2] == '-f' && argc === 4) {
    var cfg = read_json(fs.readFileSync(process.argv[3]));
    if (!cfg) 
        process.exit(1);
    else
        build(cfg);
} else if (process.argv[2] == '-s' && argc >= 4) {
    if (argc === 4) {
        build({ paths: { jquery: DEFAULT_CONFIG.paths.jquery }});
    } else if (process.argv[4] == '-f' && argc >= 6) {
        var cfg = read_json(fs.readFileSync(process.argv[5]));
        if (!cfg)
            process.exit(1);
        else
            build(cfg);
    } else {
        usage();
        process.exit(1);
    }
    copy_src_files();
    var configjs = fs.readFileSync('./src/config.js.TMPL', 'utf-8');
    var config_vars = JSON.parse(process.argv[3]);
    for (var k in config_vars) {
        var tmpl_key = '/**' + k.toUpperCase() + '**/';
        configjs = configjs.replace(tmpl_key, '"' + config_vars[k] + '"');
    }
    fs.writeFileSync('./build/config.js', configjs);
} else {
    usage();
    process.exit(1);
}