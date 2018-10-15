'use strict'

const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer');
const Util = require('./util.js')

module.exports = async function publish(options, configuration) {
    const lauchOpt = {
        headless: !options.view,
        args: ['--no-sandbox']
    }
    if (options.view) {
        lauchOpt.defaultViewport = null
    }
    const browser = await puppeteer.launch(lauchOpt)
    browser.on('disconnected', () => {
        if (Util.check(configuration.tmpfile)) {
            fs.unlinkSync(configuration.tmpfile)
        }
    })
    const page = await browser.newPage();
    const pageURI = options.url || 'file://' + path.join(__dirname, '../', (options.html) ? options.html : configuration.tmpfile)
    await page.goto(pageURI, { waitUntil: 'networkidle0' });
    if (!options.view && options.pdf) {
        // See https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
        let opt = Object.assign({ path: options.output }, configuration.pdf_options)
        await page.pdf(opt);
    }
    if (options.screenshot) {
        await page.screenshot({ path: options.screenshot, fullPage: true })
    }
    if (!options.view) {
        await browser.close();
    }
}