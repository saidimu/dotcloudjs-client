/**
 * dotcloud.js, a Javascript gateway library to powerful cloud services.
 * Copyright 2012 DotCloud Inc (Joffrey Fuhrer <joffrey@dotcloud.com>))
 *
 * This project is free software released under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
var fs = require('fs'),
    util = require('util');

var DEFAULT_CONFIG = {
    paths: {
        "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
        "dotcloud": "http://jslib.dotcloud.com/dotcloud",
        "jq-cookie": "http://jslib.dotcloud.com/jq-cookie",
        "config": "http://jslib.dotcloud.com/config"
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
    console.error('Usage: node build.js build_dir [[-s STACK_VARS] -f require_config.json]');
}

function build(dir, cfg_obj) {
    var requirejs_content = fs.readFileSync('./libraries/require.js', 'utf-8');
    fs.mkdirSync(dir);
    fs.writeFileSync(dir + '/dotcloud-require.js', requirejs_content + 
        conf_string(cfg_obj));
}

function copy_src_files(dst) {
    copy('./src/dotcloud.js', dst + '/dotcloud.js');
    copy('./libraries/jq-cookie.js', dst + '/jq-cookie.js');
}

if (argc === 3) { // No additional arguments, default build
    build(process.argv[2], DEFAULT_CONFIG);
} else if (process.argv[3] == '-f' && argc === 5) {
    var cfg = read_json(fs.readFileSync(process.argv[4]));
    if (!cfg) 
        process.exit(1);
    else
        build(process.argv[2], cfg);
} else if (process.argv[3] == '-s' && argc >= 5) {
    if (argc === 5) {
        build(process.argv[2], { paths: { jquery: DEFAULT_CONFIG.paths.jquery }});
    } else if (process.argv[5] == '-f' && argc >= 7) {
        var cfg = read_json(fs.readFileSync(process.argv[6]));
        if (!cfg)
            process.exit(1);
        else
            build(process.argv[2], cfg);
    } else {
        usage();
        process.exit(1);
    }
    copy_src_files(process.argv[2]);
    var configjs = fs.readFileSync('./src/config.js.TMPL', 'utf-8');
    var config_vars = JSON.parse(process.argv[4]);
    for (var k in config_vars) {
        var tmpl_key = new RegExp('\\/\\*\\*' + k.toUpperCase() + '\\*\\*\\/', 'g');
        configjs = configjs.replace(tmpl_key, config_vars[k]);
    }
    fs.writeFileSync(process.argv[2] + '/config.js', configjs);
} else {
    usage();
    process.exit(1);
}