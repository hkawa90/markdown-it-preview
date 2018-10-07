
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
    { name: 'screenshot', type: String},
    { name: 'inputFileType', type: String, defaultValue: 'markdown' },
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
                    name: 'inputFileType',
                    typeLabel: '{underline markdown|html}',
                    description: 'input file type(default markdown)'
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
                    name: 'screenshot',
                    typeLabel: '{underline png_file}',
                    description: 'obtain screenshot as PNG file..'
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

    async function readFile(filePath) {
        return new Promise((resolve, reject) => {
            let content = new String();
            try {
                if (filePath === '-') {
                    process.stdin.setEncoding('utf8');
                    process.stdin.on('readable', () => {
                        const chunk = process.stdin.read();
                        if (chunk !== null) {
                            content += chunk
                        }
                    });
                    process.stdin.on('end', () => {
                        resolve(content)
                    });
                    process.stdin.on('close', () => {
                        resolve(content)
                    });
                    process.stdin.on('error', () => {
                        resolve('')
                    });
                } else if (check(filePath)) {
                    content = fs.readFileSync(filePath, 'utf8');
                    resolve(content);
                } else {
                    resolve('')
                }
            } catch (e) {
                resolve('')
            }
        })
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
    let inputString = await readFile(options.file)
    let htmldoc = null
    if (options.inputFileType === 'markdown') {
        // create html
        let css = Buffer.from(await readFile(options.css), 'utf8').toString('base64')
        let meta = '<meta charset="utf-8">'
        let doctype = '<!DOCTYPE html>'

        let link = `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
        css = Buffer.from(await readFile(`node_modules/highlight.js/styles/${config.highlight.theme}.css`), 'utf8').toString('base64')
        link += `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
        let head = `<head>${link}</head>`
        let body_contents = md.render(inputString) + postProcess(config.plugins) + postProcess(config.fenced_code_blocks_extensions)
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
    }

    await page.goto(`data:text/html,${htmldoc}`, { waitUntil: 'networkidle0' });
    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    if (!options.view) {
        let opt = Object.assign({ path: options.output, format: 'A4' }, config.pdf_options)
        await page.pdf(opt);
    }
    if (options.screenshot) {
        await page.screenshot({path: options.screenshot, fullPage:true})
    }
    if (!options.view) {
        await browser.close();
    }
})(options);