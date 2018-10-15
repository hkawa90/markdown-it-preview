// Process inline-level custom comment
//
'use strict';
const COMMNET_INLINE_RE = /\<\!-- .* --\>/;


module.exports = function CustomComment_plugin(md, name, options) {
    options = options || {};
    let validate    = options.validate || validateDefault
    let params
    function validateDefault(params) {
        return params.trim().split(' ', 2)[0] === name;
    }
    var block_comment = function (state, startLine, endLine, silent) {
        var ch, match, nextLine, token,
            pos = state.bMarks[startLine],
            max = state.eMarks[startLine],
            shift = state.tShift[startLine];
        pos += shift;
        if (pos + 2 >= max) { return false; }
        ch = state.src.charCodeAt(pos);
        if (ch === 0x3C/* < */) {
            match = state.src.slice(pos, max).match(COMMNET_INLINE_RE);
            if (match) { return false; }
            // opening tag
            match = state.src.slice(pos, max).match(/^\<\!--\s*/);
            if (!match) { return false; }
        } else {
            return false;
        }
        params = state.src.slice(pos + 4, max);
        if (!validate(params)) { return false; }
        if (silent) { return true; }
        // search a end tag
        nextLine = startLine;
        while (nextLine < state.lineMax) {
            nextLine++;
            pos = state.bMarks[nextLine],
                max = state.eMarks[nextLine];
            if (pos + state.tShift[nextLine] + 2 <= max) {
                // TODO: end of file is ignore
                if (state.src.slice(pos, max).match(/^(.+\s+|\s*)-->$/)) {
                    nextLine++;
                    break;
                }
            }
        }
        state.line = nextLine;
        token = state.push('blockcomment_' + name, '', 0);
        token.map = [startLine, state.line];
        token.info = token.content = state.getLines(startLine, nextLine, 0, true);
        return true;
    };
    var inline_comment = function (state, silent) {
        var ch, code, match, pos = state.pos, max = state.posMax;
        let params
        if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }
        if (pos + 1 < max) {
            ch = state.src.charCodeAt(pos + 1);
            if (ch === 0x21 /* ! */) {
                match = state.src.slice(pos).match(COMMNET_INLINE_RE);
                if (match) {
                    params = state.src.slice(pos + 4, max);
                    if (!validate(params)) { return false; }
                    if (silent) { return true; }
                    state.pos += match[0].length;
                    if (!silent) {
                        var token = state.push('inlinecomment_' + name, '', 0);
                        token.block = false;
                        token.info = state.src.slice(pos + 5, pos + match[0].length - 4);
                        token.content = state.src.slice(pos, pos + match[0].length);
                    }
                    return true;
                }
            }
        }
        return false;
    }
    if ((options !== undefined) && (options !== null)) {
        md.inline.ruler.before('image', 'inlinecomment_' + name, inline_comment);
        md.block.ruler.before('html_block', 'blockcomment_' + name, block_comment);
        md.renderer.rules['inlinecomment_' + name] = options.render;
        md.renderer.rules['blockcomment_' + name] = options.render;
    }
};