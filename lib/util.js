'use strict'

const fs = require('fs');

const check = function (filePath) {
    var isExist = false;
    try {
        fs.statSync(filePath);
        isExist = true;
    } catch (err) {
        isExist = false;
    }
    return isExist;
}
module.exports.check = check

const simpleBundleFile = async function (fileList) {
    let result = ''
    for (let i = 0; i < fileList.length; i++) {
        result += await simpleReadFile(fileList[i])
    }
    return result
}
module.exports.simpleBundleFile = simpleBundleFile


const simpleReadFile = async function (filePath) {
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
module.exports.simpleReadFile = simpleReadFile

module.exports.postProcess = function (plugins) {
    let postdoc = ''
    for (let plugin of plugins) {
        if ((plugin.postProcess !== null) && plugin.enable) {
            postdoc += plugin.postProcess()
        }
    }
    return postdoc
}