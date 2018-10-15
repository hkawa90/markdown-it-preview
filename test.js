//const plugin = require('./plugin')
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
    html: false
});

var md = require('markdown-it')()
            .use(require('./plugins/markdown-it-mathjax')());
console.log(readFile('./test/markdown-example.md'))
console.log(md.render(readFile('./test/markdown-example.md')));
// const config = require('./markdown-preview.conf')
// // load plugin
// const setup_plugin = require('./plugin')
// setup_plugin(md, config.plugins)

//console.log(md.render('*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.'))