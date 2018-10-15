const chai = require('chai');
const assert = chai.assert;

var cmdline = require('../lib/cmdline');

describe("cmdline", function () {
    var opt
    describe("help option", function () {
        it("Throw exception on help option", function () {
            assert.throws(function () {
                cmdline(['--help'])
            }, Error);
        })
    })
    describe("file option", function () {
        it("PDF option and --file", function () {
            opt = cmdline(['--file', '-'])
            assert(opt.file, '-')
        })
        it("Throw exception on file option without arg", function () {
            assert.throws(function () {
                cmdline(['--file'])
            }, Error);
        })
    })
    describe("pdf option", function () {
        it("Throw exception on PDF option only", function () {
            assert.throws(function () {
                cmdline(['--pdf'])
            }, Error);
        })
        it("PDF option and --file", function () {
            opt = cmdline(['--pdf', '--file', '-'])
            assert.isTrue(opt.pdf)
            assert(opt.file, '-')
        })
    })
    describe("css option", function () {
        it("Throw exception on css option only", function () {
            assert.throws(function () {
                cmdline(['--css'])
            }, Error);
        })
        it("css option and --file", function () {
            opt = cmdline(['--css', '1.css', '--file', '-'])
            assert(opt.css, '1.css')
            assert(opt.file, '-')
        })
        it("css option(specified multi file) and --file", function () {
            try {
                opt = cmdline(['--css', '1.css', '2.css', '--file', '-'])
            } catch (e) {
                console.log(e.toString())
            }
            assert(opt.css, ['1.css', '2.css'])
            assert(opt.file, '-')
            // check default values
            assert.isFalse(opt.view);
            assert(opt.output, 'output.pdf')
            assert.isTrue(opt.pdf) // exclusive view option
            assert(opt.inputFileType, 'markdown')
            assert(opt.config, 'markdown-preview.conf.js')
        })
        it("Throw exception on css option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--css'])
            }, Error);
        })
    })
    describe("html option", function () {
        it("Throw exception on html option only", function () {
            assert.throws(function () {
                cmdline(['--html'])
            }, Error);
        })
        it("html option and --file", function () {
            opt = cmdline(['--html', '1.html', '--file', '-'])
            assert(opt.html, '1.html')
            assert(opt.file, '-')
        })
        it("Throw exception on html option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--html'])
            }, Error);
        })
    })
    describe("view option", function () {
        it("Throw exception on view option only", function () {
            assert.throws(function () {
                cmdline(['--view'])
            }, Error);
        })
        it("view option and --file", function () {
            opt = cmdline(['--view', '--file', '-'])
            assert.isTrue(opt.view)
            assert(opt.file, '-')
        })
        it("Throw exception on specified both view and pdf option", function () {
            assert.throws(function () {
                opt = cmdline(['--view', '--pdf', '--file', '-'])
            }, Error);
        })
    })
    describe("url option", function () {
        it("url option only", function () {
            opt = cmdline(['--url', 'http://hoge.hoge'])
            assert(opt.url, 'http://hoge.hoge')
        })
        it("Throw exception on specified both url and file option", function () {
            assert.throws(function () {
                opt = cmdline(['--url', 'http://hoge.hoge', '--file', '-'])
            }, Error)
        })
        it("Throw exception on url option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--url'])
            }, Error);
        })
    })
    describe("output option", function () {
        it("Throw exception on output option only", function () {
            assert.throws(function () {
                cmdline(['--output'])
            }, Error);
        })
        it("output option and --file", function () {
            opt = cmdline(['--output', 'temp.pdf', '--file', '-'])
            assert(opt.output, 'temp.pdf')
            assert(opt.file, '-')
        })
        it("Throw exception on output option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--output'])
            }, Error);
        })
    })
    describe("screenshot option", function () {
        it("Throw exception on screenshot option only with arg", function () {
            assert.throws(function () {
                cmdline(['--screenshot'])
            }, Error);
        })
        it("screenshot option and --file", function () {
            opt = cmdline(['--screenshot', 'tmp.png', '--file', '-'])
            assert(opt.screenshot, 'tmp.png')
            assert(opt.file, '-')
        })
        it("Throw exception on screenshot option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--screenshot'])
            }, Error);
        })
    })
    describe("inputFileType option", function () {
        it("Throw exception on inputFileType option only without arg", function () {
            assert.throws(function () {
                cmdline(['--inputFileType'])
            }, Error);
        })
        it("inputFileType(markdown) option and --file", function () {
            opt = cmdline(['--inputFileType', 'markdown', '--file', '-'])
            assert(opt.inputFileType, 'markdown')
            assert(opt.file, '-')
        })
        it("inputFileType(html) option and --file", function () {
            opt = cmdline(['--inputFileType', 'html', '--file', '-'])
            assert(opt.inputFileType, 'html')
            assert(opt.file, '-')
        })
        it("inputFileType specified invaild arg", function () {
            assert.throws(function () {
                opt = cmdline(['--inputFileType', 'pdf', '--file', '-'])
            }, Error);
        })
        it("Throw exception on inputFileType option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--inputFileType'])
            }, Error);
        })
    })
    describe("config option", function () {
        it("Throw exception on config option only without arg", function () {
            assert.throws(function () {
                cmdline(['--config'])
            }, Error);
        })
        it("config option and --file", function () {
            opt = cmdline(['--config', 'markdown.conf.js', '--file', '-'])
            assert(opt.config, 'markdown.conf.js')
            assert(opt.file, '-')
        })
        it("Throw exception on config option without arg", function () {
            assert.throws(function () {
                cmdline(['--file', '-', '--config'])
            }, Error);
        })
    })
})