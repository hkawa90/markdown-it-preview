'use strict'

const optionDefinitions = [
    { name: 'css', alias: 'c', multiple: true, type: String },
    { name: 'html', type: String },
    { name: 'view', type: Boolean, defaultValue: false },
    { name: 'file', type: String },
    { name: 'url', type: String },
    { name: 'output', type: String, defaultValue: 'output.pdf' },
    { name: 'screenshot', type: String },
    { name: 'inputFileType', type: String, defaultValue: 'markdown' },
    { name: 'pdf', type: Boolean, defaultValue: false },
    { name: 'config', type: String, defaultValue: 'markdown-preview.conf.js' },
    { name: 'help', alias: 'h', type: Boolean }
];

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
                name: 'url',
                typeLabel: '{underline url}',
                description: 'input web page url.'
            },
            {
                name: 'pdf',
                description: 'output PDF file.'
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

const commandLineArgs = require('command-line-args');



module.exports = function cmdline(args) {
    let options;
    try {
        options = commandLineArgs(optionDefinitions, { argv: args })
    } catch (e) {
        throw new Error(e.toString());
    }
    if (((options.file === undefined) && (options.url === undefined)) ||
        (options.file !== undefined) && (options.url !== undefined)) {
        throw new Error('You must specify either --file or --url\n');
    }
    if (!options.pdf && options.screenshot === undefined && !options.view) {
        options.pdf = true
    }
    if (options.pdf && options.view) {
        throw new Error('You must specify either --pdf or --view\n');
    }
    if (options.inputFileType !== 'markdown' && options.inputFileType !== 'html') {
        throw new Error('You must specify either html or markdown\n');
    }
    if ((typeof options.file !== 'undefined') && (options.file === null)) {
        throw new Error('You must specify file\n');
    }
    if ((typeof options.url !== 'undefined') && (options.url === null)) {
        throw new Error('You must specify url\n');
    }
    if ((typeof options.output !== 'undefined') && (options.output === null)) {
        throw new Error('You must specify output\n');
    }
    if ((typeof options.html !== 'undefined') && (options.html === null)) {
        throw new Error('You must specify html\n');
    }
    if ((typeof options.screenshot !== 'undefined') && (options.screenshot === null)) {
        throw new Error('You must specify screenshot\n');
    }
    if ((typeof options.config !== 'undefined') && (options.config === null)) {
        throw new Error('You must specify config\n');
    }
    if ((typeof options.css !== 'undefined') && (options.css.length === 0)) {
        throw new Error('You must specify css file\n');
    }
    if (options.help) {
        const commandLineUsage = require('command-line-usage')
        const usage = commandLineUsage(sections)
        process.stdout.write(usage + '\n')
        process.stdout.write(JSON.stringify(options) + '\n')
        throw new Error('Help message');
    };
    return options
}