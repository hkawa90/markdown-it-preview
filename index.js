#!/usr/bin/env node
'use strict';

const path = require('path')
const getOpt = require('./lib/cmdline.js')
const convertHTML = require('./lib/markdown2html.js')
const publish = require('./lib/publish.js')

const TMP_HTML_FILE = '_temp.html'
let options

try {
    options = getOpt()
} catch (e) {
    if (e.toString() !== 'Help message') {
        process.stdout.write(e.toString())
        process.exit(1)
    }
}

// load config
const config = require(path.resolve(options.config))
config.tmpfile = TMP_HTML_FILE

convertHTML(options, config).then((html) => { publish(options, config) })














