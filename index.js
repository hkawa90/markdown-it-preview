
const fs = require('fs');
const puppeteer = require('puppeteer');
var hljs = require('highlight.js');
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

    var md = require('markdown-it')({
        html: false,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (__) { }
            }
            return ''; // use external default escaping
        }
    });

    let html = md.render(readFile(options.file))
    let css = Buffer.from(readFile(options.css), 'utf8').toString('base64')
    let meta = `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
    css = Buffer.from(readFile('node_modules/highlight.js/styles/tomorrow.css'), 'utf8').toString('base64')
    meta += `<link rel="stylesheet" href="data:text/css;base64,${css}"/>`
    html = meta + html;
    if (options.html) {
        if (options.html === '-') {
            process.stdout.write(html)
        } else {
            fs.writeFileSync(options.html,html);
        }
    }
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
    // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
    if (!options.view) {
        await page.pdf({ path: options.output, format: 'A4' });
    }
    if (!options.view) {
        await browser.close();
    }
})(options);