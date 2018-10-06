'use strict';
const path = require('path')
const fs = require('fs')

function plugin_loader() {
    const plugins = []
    let files
    try {
        files = fs.readdirSync(path.join(__dirname, 'plugins'));
    } catch (e) {
        return plugins
    }
    for (let file of files || []) {
        if (file.match(/.*\.js$/) !== null) {
            let obj = new Object()
            obj['name'] = file.replace(/\.js$|\.min\.js$/, '')
            obj['instance'] = require(path.join(__dirname, 'plugins', file))
            plugins.push(obj)
        }
    }
    return plugins
}

module.exports = function setup_plugin(md, plugin_configs) {
    const pluginFiles = plugin_loader()
    for (let pluginFile of pluginFiles || []) {
        for (let plugin of plugin_configs || []) {
            if ((pluginFile.name === plugin.name) && (plugin.enable)) {
                let ins = null
                if (plugin.requireCall !== undefined) {
                    ins = plugin.requireCall(pluginFile.instance)
                } else {
                    ins = pluginFile.instance
                } if (plugin.name === 'markdown-it-container') {
                    for (let opt of plugin.options) {
                        md.use(ins, opt.name, opt.container)
                    }
                } else {
                    md.use(ins)
                }
            }
        }
    }
}
