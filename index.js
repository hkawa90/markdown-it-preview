
'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
var hljs = require('highlight.js');
var fencedCodeBlockExt = null;
const optionDefinitions = [
    { name: 'css', alias: 'c', type: String },
    { name: 'html', type: String },
    { name: 'view', type: Boolean, defaultValue: false },
    { name: 'file', type: String },
    { name: 'output', type: String, defaultValue: 'output.pdf' },
    { name: 'help', alias: 'h', type: Boolean }
];
const commandLineArgs = require('command-line-args');
var options;
try {
    options = commandLineArgs(optionDefinitions)
} catch (e) {
    process.stdout.write(e.toString() + '\n')
    process.exit(1)
}
if (options.help) {
    const commandLineUsage = require('command-line-usage')
    const sections = [
        {
            header: 'Markdown preview',
            content: 'Markdown file preview and output pdf'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'css',
                    typeLabel: '{underline css_file}',
                    description: 'css file.'
                },
                {
                    name: 'html',
                    typeLabel: '{underline html_file}',
                    description: 'output html file.'
                },
                {
                    name: 'view',
                    description: 'preview mode with browser.'
                },
                {
                    name: 'file',
                    typeLabel: '{underline Markdown_file}',
                    description: 'markdown file(input).'
                },
                {
                    name: 'output',
                    typeLabel: '{underline pdf_file}',
                    description: 'PDF output path(output).'
                },
                {
                    name: 'help',
                    description: 'Print this usage guide.'
                }
            ]
        }
    ]
    const usage = commandLineUsage(sections)
    process.stdout.write(usage + '\n')
    process.stdout.write(JSON.stringify(options) + '\n')
    process.exit(0)
}
if (options.file === undefined) {
    process.stdout.write('You must specify markdown file.\n')
    process.exit(1)
}

(async (options) => {
    const lauchOpt = {
        headless: !options.view,
        args: ['--no-sandbox']
    }
    if (options.view) {
        lauchOpt.defaultViewport = null
    }
    const browser = await puppeteer.launch(lauchOpt)
    const page = await browser.newPage();
    function check(filePath) {
        var isExist = false;
        try {
            fs.statSync(filePath);
            isExist = true;
        } catch (err) {
            isExist = false;
        }
        return isExist;
    }

    function readFile(filePath) {
        var content = new String();
        if (check(filePath)) {
            content = fs.readFileSync(filePath, 'utf8');
        }
        return content;
    }

    function postProcess(plugins) {
        let postdoc = ''
        for (let plugin of plugins) {
            if ((plugin.postProcess !== null) && plugin.enable) {
                postdoc += plugin.postProcess()
            }
        }
        return postdoc
    }
    var md = require('markdown-it')({
        html: false,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
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

    // load config
    const config = require('./markdown-preview.conf')
    // load plugin
    const setup_plugin = require('./plugin')
    setup_plugin(md, config.plugins)
    // fenced Code Block Extensions
    fencedCodeBlockExt = config.fenced_code_blocks_extensions

    let html = md.render(readFile(options.file))
    let css = Buffer.from(readFile(options.css), 'utf8').toString('base64')
    let meta = '<meta charset="utf-8">'
    meta = meta + `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
    css = Buffer.from(readFile(`node_modules/highlight.js/styles/${config.highlight.theme}.css`), 'utf8').toString('base64')
    meta += `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
    html = meta + '\n' + html;
    html += postProcess(config.plugins)
    html += postProcess(config.fenced_code_blocks_extensions)
    if (options.html) {
        if (options.html === '-') {
            process.stdout.write(html)
        } else {
            fs.writeFileSync(options.html, html);
        }
    }
    
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    if (!options.view) {
        let opt = Object.assign({ path: options.output, format: 'A4' }, config.pdf_options)
        await page.pdf(opt);
    }
    if (!options.view) {
        await browser.close();
    }
})(options);