'use strict'

const fs = require('fs');
const path = require('path')
const hljs = require('highlight.js');
const Util = require('./util.js')

function buildLink(html) {
    return html;
}
function buildScript(html) {
    return html;
}


/**
 * Build no external references html source
 * @param {String} html - input html source
 * @returns {String} build independent html source
 */
function buildHTML(html) {
    html = buildLink(html)
    html = buildScript(html)
    return html
}

module.exports = async function convertHTML(options, configuration) {
    const md = require('markdown-it')({
        html: false,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) {
                }
            } else if (fencedCodeBlockExt !== null) {
                for (let ext of fencedCodeBlockExt) {
                    if (ext.name === lang) {
                        return ext.proc(str)
                    }
                }
            }
            return ''; // use external default escaping
        }
    });
    // load plugin
    const setup_plugin = require('./plugin.js')
    setup_plugin(md, configuration.plugins)
    // fenced Code Block Extensions
    const fencedCodeBlockExt = configuration.fenced_code_blocks_extensions
    let inputString = await Util.simpleReadFile(options.file)
    let htmldoc = null
    if (options.inputFileType === 'markdown') {
        // create html
        let css = (options.css === undefined) ? '' : Buffer.from(await Util.simpleBundleFile(options.css), 'utf8').toString('base64')
        let meta = '<meta charset="utf-8">'
        let doctype = '<!DOCTYPE html>'
        let link = `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
        css = Buffer.from(await Util.simpleReadFile(`node_modules/highlight.js/styles/${configuration.highlight.theme}.css`), 'utf8').toString('base64')
        link += `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
        let head = `<head>${link}</head>`
        let body_contents = md.render(inputString) + Util.postProcess(configuration.plugins) + Util.postProcess(configuration.fenced_code_blocks_extensions)
        let body = `<body>${body_contents}</body>`
        htmldoc = doctype + `<html lang="ja">` + head + body + '</html>'
    } else {
        htmldoc = inputString
    }
    if (options.html) {
        if (options.html === '-') {
            process.stdout.write(htmldoc)
        } else {
            fs.writeFileSync(options.html, htmldoc);
        }
    } else {
        fs.writeFileSync(configuration.tmpfile, htmldoc);
    }
    return htmldoc
}

