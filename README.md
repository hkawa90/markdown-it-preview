# markdown-it preview
Markdown をPDF出力したり、ブラウザで閲覧します。
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
```
## Features
- Convert Markdown to PDF with [puppeteer](https://github.com/GoogleChrome/puppeteer).
- Convert Markdown to HTML with [markdown-it](https://github.com/markdown-it/markdown-it)
- Supported code highlighting with [highlight.js](https://highlightjs.org/)
- Markdown preview with builtin-Chrome
## Limitations
- Markdown file size is up to about 2MB.
- ~~In Browser preview mode, view port size is small to window size.~~  
 [Resolved] Set defaultViewport of `puppeteer.launch` option to null.
## TODO
- [x] CSS
- [x] output html
- [ ] configure pdf output options(See [`puppeteer.pdf` option](https://github.com/GoogleChrome/puppeteer/blob/v1.9.0/docs/api.md#pagepdfoptions))
- [ ] configure highlight.js theme
- [ ] input markdown file from stdin
- [ ] Document
- [ ] Apply markdown-it plugin([markdown-it-sub](https://github.com/markdown-it/markdown-it-sub), [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins), [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote), etc)
- [ ] Test code
## Miscellaneous
- test/markdown-example.md : from [markdown-it demo](https://markdown-it.github.io/)
- test/markdown.css: from [markdown-css-themes](https://github.com/jasonm23/markdown-css-themes)
- test/Vostok.css : from [markown-utilities](https://github.com/nWODT-Cobalt/markown-utilities)