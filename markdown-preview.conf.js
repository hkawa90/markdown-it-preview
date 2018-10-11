module.exports = {
    highlight: {
        theme: 'tomorrow',
        style: {
            font: {
                size: null,
                family: null
            }
        }
    },
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
    },
    css_media_type: null,
    emulate_screen_device: null,
    fenced_code_blocks_extensions: [
        {
            name: 'wavedrom',
            description: 'digital timing diagram (waveform) rendering engine',
            proc: function (contents) { return `<script type="WaveDrom">${contents}</script>` },
            postProcess: function () {
                return `
            <script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/1.6.2/skins/default.js" type="text/javascript"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/wavedrom/1.6.2/wavedrom.min.js" type="text/javascript"></script>
            <script>window.addEventListener("load",function(){WaveDrom.ProcessAll()});</script>
            ` },
            enable: true
        },
        {
            name: 'mermaid',
            description: 'Generation of diagrams and flowcharts from text in a similar manner as markdown.',
            proc: function (contents) { return `<div class="mermaid">${contents}</div>` },
            postProcess: function () { return '<script src="https://unpkg.com/mermaid@7.1.2/dist/mermaid.min.js"></script><script>window.addEventListener("load",function(){mermaid.initialize({startOnLoad:true});});</script>' },
            enable: true
        },
        {
            name: 'viz',
            description: 'Graphviz Features',
            proc: function (contents) { return `<div class="viz">${contents}</div>` },
            postProcess: function () {
                return `
            <script src="./node_modules/viz.js/viz.js"></script>
            <script src="./node_modules/viz.js/full.render.js"></script>
            <script>window.addEventListener("load", function () { startViz(); });</script>
    <script>
        function startViz() {
            var viz = new Viz();
            var promiseSlot = []
            var elementList = document.querySelectorAll('.viz')
            for (var idx = 0; idx < elementList.length; idx++) {
                promiseSlot.push(viz.renderSVGElement(elementList[idx].textContent)
                    .then(function (element) {
                        return element
                    })
                )
            }
            Promise.all(promiseSlot).then((values) => {
                for (var idx = 0; idx < elementList.length; idx++) {
                    elementList[idx].textContent = ''
                    elementList[idx].appendChild(values[idx])
                    elementList[idx].setAttribute('data-processed', 'true')
                }
            })
        }
    </script>` },
            enable: true
        }
    ],
    plugins: [
        {
            name: 'markdown-it-abbr',
            description: 'Abbreviation (<abbr>) tag plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-footnote',
            description: 'Footnotes plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-mark',
            description: '',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-emoji',
            description: 'Emoji syntax plugin for markdown-it markdown parser',
            postProcess: function () {
                let script = '<script src="http://twemoji.maxcdn.com/2/twemoji.min.js?11.2"></script><script>window.addEventListener("load",function(){twemoji.parse(document.body);});</script>'
                let style = '<style>.emoji {height: 1.2em;}</style>'
                return script + style
            },
            enable: true
        },
        {
            name: 'markdown-it-emoji-light',
            description: 'Emoji syntax plugin for markdown-it markdown parser',
            postProcess: function () {
                let script = '<script src="http://twemoji.maxcdn.com/2/twemoji.min.js?11.2"></script><script>window.addEventListener("load",function(){twemoji.parse(document.body);});</script>'
                let style = '<style>.emoji {height: 1.2em;}</style>'
                return script + style
            },
            enable: false
        },
        {
            name: 'markdown-it-cjk-breaks',
            description: 'Suppress linebreaks between east asian characters',
            postProcess: null,
            enable: false
        },
        {
            name: 'markdown-it-deflist',
            description: 'Definition list (<dl>) tag plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-ins',
            description: '<ins> tag plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-sub',
            description: 'Subscript (<sub>) tag plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-sup',
            description: 'Superscript (<sup>) tag plugin for markdown-it markdown parser',
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-checkbox',
            description: 'Plugin to create checkboxes for markdown-it markdown parser.',
            url: 'https://github.com/mcecot/markdown-it-checkbox',
            authors: ['Markus Cecot'],
            postProcess: null,
            enable: true
        },
        {
            name: 'markdown-it-mathjax',
            description: 'Markdown-it plugin to bypass LaTeX math for mathjax processing.',
            url: 'https://github.com/classeur/markdown-it-mathjax',
            authors: ['Benoit Schweblin'],
            requireCall: function (func) {
                return func()
            },
            postProcess: function () {
                return '<script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML" async></script>'
            },
            enable: true
        },
        {
            name: 'markdown-it-container',
            description: 'Fenced container plugin for markdown-it markdown parser',
            options: [
                {
                    name: 'spoiler',
                    container: {

                        validate: function (params) {
                            return params.trim().match(/^spoiler\s+(.*)$/);
                        },

                        render: function (tokens, idx) {
                            // https://stackoverflow.com/questions/1787322/htmlspecialchars-equivalent-in-javascript/4835406#4835406
                            function escapeHtml(text) {
                                var map = {
                                    '&': '&amp;',
                                    '<': '&lt;',
                                    '>': '&gt;',
                                    '"': '&quot;',
                                    "'": '&#039;'
                                };

                                return text.replace(/[&<>"']/g, function (m) { return map[m]; });
                            }
                            var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
                            if (tokens[idx].nesting === 1) {
                                // opening tag
                                return '<details><summary>' + escapeHtml(m[1]) + '</summary>\n';

                            } else {
                                // closing tag
                                return '</details>\n';
                            }
                        }
                    }
                }
            ],
            postProcess: null,
            enable: true
        },
    ]
}
