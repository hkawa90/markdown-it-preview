# markdown-it preview
Markdown をPDF出力したり、ブラウザで閲覧します。
## Requirement
See package.json.
## Synopsis
```
markdown-preview [options]
```
## Description

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
    apply css file.(This argument is currently not supported)
```
## Limitations
- Markdown file size is up to about 2MB.
- In Browser preview mode, view port size is small to window size.
## TODO
- [ ] CSS
- [ ] Document
- [ ] Apply markdown-it plugin([markdown-it-sub](https://github.com/markdown-it/markdown-it-sub), [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins), [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote), etc)
- [ ] Test code
## Miscellaneous

test/markdown-example.md : from [markdown-it demo](https://markdown-it.github.io/)