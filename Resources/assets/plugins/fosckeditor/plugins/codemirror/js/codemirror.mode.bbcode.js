CodeMirror.defineMode("bbcode", function (b) {
    var e, a, g;
    e = {bbCodeTags: "b i u s img quote code list table  tr td size color url", bbCodeUnaryTags: "* :-) hr cut"};
    if (b.hasOwnProperty("bbCodeTags")) {
        e.bbCodeTags = b.bbCodeTags
    }
    if (b.hasOwnProperty("bbCodeUnaryTags")) {
        e.bbCodeUnaryTags = b.bbCodeUnaryTags
    }
    var f = {
        cont: function (i, h) {
            g = h;
            return i
        }, escapeRegEx: function (h) {
            return h.replace(/([\:\-\)\(\*\+\?\[\]])/g, "\\$1")
        }
    };
    var d = {
        validIdentifier: /[a-zA-Z0-9_]/,
        stringChar: /['"]/,
        tags: new RegExp("(?:" + f.escapeRegEx(e.bbCodeTags).split(" ").join("|") + ")"),
        unaryTags: new RegExp("(?:" + f.escapeRegEx(e.bbCodeUnaryTags).split(" ").join("|") + ")")
    };
    var c = {
        tokenizer: function (i, h) {
            if (i.eatSpace()) {
                return null
            }
            if (i.match("[", true)) {
                h.tokenize = c.bbcode;
                return f.cont("tag", "startTag")
            }
            i.next();
            return null
        }, inAttribute: function (h) {
            return function (k, i) {
                var l = null;
                var j = null;
                while (!k.eol()) {
                    j = k.peek();
                    if (k.next() == h && l !== "\\") {
                        i.tokenize = c.bbcode;
                        break
                    }
                    l = j
                }
                return "string"
            }
        }, bbcode: function (k, i) {
            if (a = k.match("]", true)) {
                i.tokenize = c.tokenizer;
                return f.cont("tag", null)
            }
            if (k.match("[", true)) {
                return f.cont("tag", "startTag")
            }
            var h = k.next();
            if (d.stringChar.test(h)) {
                i.tokenize = c.inAttribute(h);
                return f.cont("string", "string")
            } else {
                if (/\d/.test(h)) {
                    k.eatWhile(/\d/);
                    return f.cont("number", "number")
                } else {
                    if (i.last == "whitespace") {
                        k.eatWhile(d.validIdentifier);
                        return f.cont("attribute", "modifier")
                    }
                    if (i.last == "property") {
                        k.eatWhile(d.validIdentifier);
                        return f.cont("property", null)
                    } else {
                        if (/\s/.test(h)) {
                            g = "whitespace";
                            return null
                        }
                    }
                    var j = "";
                    if (h != "/") {
                        j += h
                    }
                    var l = null;
                    while (l = k.eat(d.validIdentifier)) {
                        j += l
                    }
                    if (d.unaryTags.test(j)) {
                        return f.cont("atom", "atom")
                    }
                    if (d.tags.test(j)) {
                        return f.cont("keyword", "keyword")
                    }
                    if (/\s/.test(h)) {
                        return null
                    }
                    return f.cont("tag", "tag")
                }
            }
        }
    };
    return {
        startState: function () {
            return {tokenize: c.tokenizer, mode: "bbcode", last: null}
        }, token: function (j, i) {
            var h = i.tokenize(j, i);
            i.last = g;
            return h
        }, electricChars: ""
    }
});
CodeMirror.defineMIME("text/x-bbcode", "bbcode");