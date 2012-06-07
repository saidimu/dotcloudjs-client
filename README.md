dotcloud.js
===========
Javascript gateway library to powerful cloud services. Meant to be used in conjuction with [dotcloudjs-server](https://github.com/dotcloud/dotcloudjs-server).  
For more information, head over to <http://js.dotcloud.com>

Building your own
=================
The following line builds the client files in the `build/` directory, using the variables in `stack_config.json` to configure the stack, and those in `require_config.json` to configure require.

    node build.js build/ -s stack_config.json -f require_config.json

Sample `stack_config` file:

    {
        "stackid": "my_stack",
        "host": "", 
        "submodules": [
            "sync",
            "db",
            "twitter"
        ]
    }

Sample `require_config` file:

    {
        "paths": {
            "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
            "dotcloud": "/dotcloud",
            "jq-cookie": "/jq-cookie",
            "config": "/config",
            "db": "/db",
            "sync": "/sync",
            "twitter": "/twitter",
            "stack.io": "/stack.io/stack.io"
        }
    }

Optimize/minify
===============
More information soon.