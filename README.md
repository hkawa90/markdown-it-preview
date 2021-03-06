# markdown-it preview
Convert markdown/HTML to PDF/HTML, Preview with internal browser(puppeteer)
## Requirement
See package.json.
## Synopsis
```
markdown-preview [options]
```
### Command line Option

Mandatory arguments:

```
--file=MARKDOWN_FILE_PATH
    specify input markdown file.
```
Otherwise arguments:
```
--output=PDF_FILE_PATH
    specify output pdf file.
--view
    open browser
--css=CSS_FILE_PATH
    apply css file.
--html=HTML_FILE_PATH
    output html file.
--inputFileType=html
    treat input file type as html. 
--screenshot=PNG_FILE_PATH
    obtain screenshot as PNG image.
--pdf
    output PDF file.
--url=url string
    input web page url.
--config=config file path
    input config file path.

```
## Features
- Convert Markdown to PDF with [puppeteer](https://github.com/GoogleChrome/puppeteer).
- Convert Markdown to HTML with [markdown-it](https://github.com/markdown-it/markdown-it)
- Supported code highlighting with [highlight.js](https://highlightjs.org/)
- Markdown preview with builtin-Chrome
- Markdown-it plugin(See plugins directory)
    - [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr)
    - [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
    - [markdown-it-checkbox](https://github.com/mcecot/markdown-it-checkbox)
    - [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins)
    - [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)
    - [markdown-it-container](https://github.com/markdown-it/markdown-it-container)
    - [markdown-it-mathjax](https://github.com/classeur/markdown-it-mathjax)
    - [markdown-it-deflist](https://github.com/markdown-it/markdown-it-deflist)
    - [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub)
    - [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup)
    - [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)
- Markdown fenced code block extension
    - [mermaid](https://mermaidjs.github.io/)
    - [viz](https://github.com/mdaines/viz.js)
    - [Wavedrom](https://github.com/drom/wavedrom)
## Example
- PDF output only
```
node index.js --file test/markdown-example.md --css css/markdown.md
```
- Preview
```
node index.js --file test/markdown-example.md --css css/markdown.md --view
```
- HTML output only
```
node index.js --file test/markdown-example.md --css css/markdown.md --html output.html
```
- HTML output to stdout only
```
node index.js --file test/markdown-example.md --css css/markdown.md --html -
```
## Configuration
### PDF output options
See [puppeteer](https://github.com/GoogleChrome/puppeteer/blob/v1.9.0/docs/api.md#pagepdfoptions).
The options defined `pdf_options` in `markdown-preview.conf.js`.
``` js
    pdf_options: {
        scale: 1,
        displayHeaderFooter: false,
        headerTemplate: '',
        footerTemplate: '',
        landscape: false,
        pageRanges: '',
        format: 'A4',
        width: '',
        height: '',
        margin: {
            top: '',
            right: '',
            bottom: '',
            left: ''
        },
        preferCSSPageSize: false
    }
```
### Highlighting('highlight.js') theme
Highlighting theme defined `highlight` in `markdown-preview.conf.js`. The default value is 'tomorrow'.Now the style options is ignored.
``` js
    highlight: {
        theme: 'tomorrow',
        style: {
            font: {
                size: null,
                family: null
            }
        }
    },
```
## Limitations
- Markdown file size is up to about 2MB.
- ~~In Browser preview mode, view port size is small to window size.~~  
 [Resolved] Set defaultViewport of `puppeteer.launch` option to null.
## TODO
- [x] CSS
- [x] output html
- [x] configure pdf output options(See [`puppeteer.pdf` option](https://github.com/GoogleChrome/puppeteer/blob/v1.9.0/docs/api.md#pagepdfoptions))
- [x] configure highlight.js theme
- [x] input markdown file from stdin
- [ ] highlight style setting
- [x] configuration file
- [x] screenshot
- [x] url option
- [ ] Do pdf output/screenshot, when completed with rendering mermaid and viz.
- [ ] Document
- [ ] html-converter
- [x] Apply markdown-it plugin([markdown-it-sub](https://github.com/markdown-it/markdown-it-sub), [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins), [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote), etc)
- [ ] Test code
## Issues
- [x] conflict between markdown css and MathJax style.
- [x] take big margin around mermaid diagram.
## Miscellaneous
- test/markdown-example.md : from [markdown-it demo](https://markdown-it.github.io/)
- css/markdown.css: from [markdown-css-themes](https://github.com/jasonm23/markdown-css-themes)
- css/markdown1.css: from [markdown-css-themes](https://github.com/jasonm23/markdown-css-themes)
- css/Vostok.css : from [markown-utilities](https://github.com/nWODT-Cobalt/markown-utilities)