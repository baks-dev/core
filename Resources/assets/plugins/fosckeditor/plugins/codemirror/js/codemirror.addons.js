!function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/comment/continuecomment.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function t(t) {
        if (t.getOption("disableInput")) return e.Pass;
        for (var i, a = t.listSelections(), l = [], s = 0; s < a.length; s++) {
            var c = a[s].head;
            if (!/\bcomment\b/.test(t.getTokenTypeAt(c))) return e.Pass;
            var d = t.getModeAt(c);
            if (i) {
                if (i != d) return e.Pass
            } else i = d;
            var u, f, h = null, p = i.blockCommentStart, m = i.lineComment;
            if (p && i.blockCommentContinue) {
                u = t.getLine(c.line);
                var g = u.lastIndexOf(i.blockCommentEnd, c.ch - i.blockCommentEnd.length);
                if (-1 != g && g == c.ch - i.blockCommentEnd.length || m && (f = u.lastIndexOf(m, c.ch - 1)) > -1 && /\bcomment\b/.test(t.getTokenTypeAt({
                    line: c.line,
                    ch: f + 1
                }))) ; else if (c.ch >= p.length && (f = u.lastIndexOf(p, c.ch - p.length)) > -1 && f > g) if (n(0, u) >= f) h = u.slice(0, f); else {
                    var v, b = t.options.tabSize;
                    f = e.countColumn(u, f, b), h = t.options.indentWithTabs ? o.call("\t", v = Math.floor(f / b)) + o.call(" ", f - b * v) : o.call(" ", f)
                } else (f = u.indexOf(i.blockCommentContinue)) > -1 && f <= c.ch && f <= n(0, u) && (h = u.slice(0, f));
                null != h && (h += i.blockCommentContinue)
            }
            if (null == h && m && r(t)) if (null == u && (u = t.getLine(c.line)), f = u.indexOf(m), c.ch || f) {
                if (f > -1 && n(0, u) >= f) {
                    if (!(h = n(c.ch, u) > -1)) {
                        var y = t.getLine(c.line + 1) || "", k = y.indexOf(m);
                        h = k > -1 && n(0, y) >= k || null
                    }
                    h && (h = u.slice(0, f) + m + u.slice(f + m.length).match(/^\s*/)[0])
                }
            } else h = "";
            if (null == h) return e.Pass;
            l[s] = "\n" + h
        }
        t.operation(function () {
            for (var e = a.length - 1; e >= 0; e--) t.replaceRange(l[e], a[e].from(), a[e].to(), "+insert")
        })
    }

    function n(e, t) {
        i.lastIndex = e;
        var n = i.exec(t);
        return n ? n.index : -1
    }

    function r(e) {
        var t = e.getOption("continueComments");
        return !t || "object" != typeof t || !1 !== t.continueLineComment
    }

    var i = /\S/g, o = String.prototype.repeat || function (e) {
        return Array(e + 1).join(this)
    };
    e.defineOption("continueComments", null, function (n, r, i) {
        if (i && i != e.Init && n.removeKeyMap("continueComment"), r) {
            var o = "Enter";
            "string" == typeof r ? o = r : "object" == typeof r && r.key && (o = r.key);
            var a = {name: "continueComment"};
            a[o] = t, n.addKeyMap(a)
        }
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/edit/closebrackets.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function t(e, t) {
        return "pairs" == t && "string" == typeof e ? e : "object" == typeof e && null != e[t] ? e[t] : f[t]
    }

    function n(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e.charAt(t), i = "'" + n + "'";
            p[i] || (p[i] = r(n))
        }
    }

    function r(e) {
        return function (t) {
            return c(t, e)
        }
    }

    function i(e) {
        var t = e.state.closeBrackets;
        return !t || t.override ? t : e.getModeAt(e.getCursor()).closeBrackets || t
    }

    function o(n) {
        var r = i(n);
        if (!r || n.getOption("disableInput")) return e.Pass;
        for (var o = t(r, "pairs"), a = n.listSelections(), l = 0; l < a.length; l++) {
            if (!a[l].empty()) return e.Pass;
            var s = d(n, a[l].head);
            if (!s || o.indexOf(s) % 2 != 0) return e.Pass
        }
        for (var l = a.length - 1; l >= 0; l--) {
            var c = a[l].head;
            n.replaceRange("", h(c.line, c.ch - 1), h(c.line, c.ch + 1), "+delete")
        }
    }

    function a(n) {
        var r = i(n), o = r && t(r, "explode");
        if (!o || n.getOption("disableInput")) return e.Pass;
        for (var a = n.listSelections(), s = 0; s < a.length; s++) {
            if (!a[s].empty()) return e.Pass;
            var c = d(n, a[s].head);
            if (!c || o.indexOf(c) % 2 != 0) return e.Pass
        }
        n.operation(function () {
            var e = n.lineSeparator() || "\n";
            n.replaceSelection(e + e, null), l(n, -1), a = n.listSelections();
            for (var t = 0; t < a.length; t++) {
                var r = a[t].head.line;
                n.indentLine(r, null, !0), n.indentLine(r + 1, null, !0)
            }
        })
    }

    function l(e, t) {
        for (var n = [], r = e.listSelections(), i = 0, o = 0; o < r.length; o++) {
            var a = r[o];
            a.head == e.getCursor() && (i = o);
            var l = {line: a.head.line, ch: a.head.ch + t};
            n.push({anchor: l, head: l})
        }
        e.setSelections(n, i)
    }

    function s(t) {
        var n = e.cmpPos(t.anchor, t.head) > 0;
        return {
            anchor: new h(t.anchor.line, t.anchor.ch + (n ? -1 : 1)),
            head: new h(t.head.line, t.head.ch + (n ? 1 : -1))
        }
    }

    function c(n, r) {
        var o = i(n);
        if (!o || n.getOption("disableInput")) return e.Pass;
        var a = t(o, "pairs"), c = a.indexOf(r);
        if (-1 == c) return e.Pass;
        for (var d, f = t(o, "closeBefore"), p = t(o, "triples"), m = a.charAt(c + 1) == r, g = n.listSelections(), v = c % 2 == 0, b = 0; b < g.length; b++) {
            var y, k = g[b], x = k.head, w = n.getRange(x, h(x.line, x.ch + 1));
            if (v && !k.empty()) y = "surround"; else if (!m && v || w != r) if (m && x.ch > 1 && p.indexOf(r) >= 0 && n.getRange(h(x.line, x.ch - 2), x) == r + r) {
                if (x.ch > 2 && /\bstring/.test(n.getTokenTypeAt(h(x.line, x.ch - 2)))) return e.Pass;
                y = "addFour"
            } else if (m) {
                var C = 0 == x.ch ? " " : n.getRange(h(x.line, x.ch - 1), x);
                if (e.isWordChar(w) || C == r || e.isWordChar(C)) return e.Pass;
                y = "both"
            } else {
                if (!v || !(0 === w.length || /\s/.test(w) || f.indexOf(w) > -1)) return e.Pass;
                y = "both"
            } else y = m && u(n, x) ? "both" : p.indexOf(r) >= 0 && n.getRange(x, h(x.line, x.ch + 3)) == r + r + r ? "skipThree" : "skip";
            if (d) {
                if (d != y) return e.Pass
            } else d = y
        }
        var O = c % 2 ? a.charAt(c - 1) : r, A = c % 2 ? r : a.charAt(c + 1);
        n.operation(function () {
            if ("skip" == d) l(n, 1); else if ("skipThree" == d) l(n, 3); else if ("surround" == d) {
                for (var e = n.getSelections(), t = 0; t < e.length; t++) e[t] = O + e[t] + A;
                n.replaceSelections(e, "around"), e = n.listSelections().slice();
                for (var t = 0; t < e.length; t++) e[t] = s(e[t]);
                n.setSelections(e)
            } else "both" == d ? (n.replaceSelection(O + A, null), n.triggerElectric(O + A), l(n, -1)) : "addFour" == d && (n.replaceSelection(O + O + O + O, "before"), l(n, 1))
        })
    }

    function d(e, t) {
        var n = e.getRange(h(t.line, t.ch - 1), h(t.line, t.ch + 1));
        return 2 == n.length ? n : null
    }

    function u(e, t) {
        var n = e.getTokenAt(h(t.line, t.ch + 1));
        return /\bstring/.test(n.type) && n.start == t.ch && (0 == t.ch || !/\bstring/.test(e.getTokenTypeAt(t)))
    }

    var f = {pairs: "()[]{}''\"\"", closeBefore: ")]}'\":;>", triples: "", explode: "[]{}"}, h = e.Pos;
    e.defineOption("autoCloseBrackets", !1, function (r, i, o) {
        o && o != e.Init && (r.removeKeyMap(p), r.state.closeBrackets = null), i && (n(t(i, "pairs")), r.state.closeBrackets = i, r.addKeyMap(p))
    });
    var p = {Backspace: o, Enter: a};
    n(f.pairs + "`")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/fold/xml-fold", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t) {
        return e.line - t.line || e.ch - t.ch
    }

    function n(e, t, n, r) {
        this.line = t, this.ch = n, this.cm = e, this.text = e.getLine(t), this.min = r ? Math.max(r.from, e.firstLine()) : e.firstLine(), this.max = r ? Math.min(r.to - 1, e.lastLine()) : e.lastLine()
    }

    function r(e, t) {
        var n = e.cm.getTokenTypeAt(f(e.line, t));
        return n && /\btag\b/.test(n)
    }

    function i(e) {
        if (!(e.line >= e.max)) return e.ch = 0, e.text = e.cm.getLine(++e.line), !0
    }

    function o(e) {
        if (!(e.line <= e.min)) return e.text = e.cm.getLine(--e.line), e.ch = e.text.length, !0
    }

    function a(e) {
        for (; ;) {
            var t = e.text.indexOf(">", e.ch);
            if (-1 == t) {
                if (i(e)) continue;
                return
            }
            {
                if (r(e, t + 1)) {
                    var n = e.text.lastIndexOf("/", t), o = n > -1 && !/\S/.test(e.text.slice(n + 1, t));
                    return e.ch = t + 1, o ? "selfClose" : "regular"
                }
                e.ch = t + 1
            }
        }
    }

    function l(e) {
        for (; ;) {
            var t = e.ch ? e.text.lastIndexOf("<", e.ch - 1) : -1;
            if (-1 == t) {
                if (o(e)) continue;
                return
            }
            if (r(e, t + 1)) {
                p.lastIndex = t, e.ch = t;
                var n = p.exec(e.text);
                if (n && n.index == t) return n
            } else e.ch = t
        }
    }

    function s(e) {
        for (; ;) {
            p.lastIndex = e.ch;
            var t = p.exec(e.text);
            if (!t) {
                if (i(e)) continue;
                return
            }
            {
                if (r(e, t.index + 1)) return e.ch = t.index + t[0].length, t;
                e.ch = t.index + 1
            }
        }
    }

    function c(e) {
        for (; ;) {
            var t = e.ch ? e.text.lastIndexOf(">", e.ch - 1) : -1;
            if (-1 == t) {
                if (o(e)) continue;
                return
            }
            {
                if (r(e, t + 1)) {
                    var n = e.text.lastIndexOf("/", t), i = n > -1 && !/\S/.test(e.text.slice(n + 1, t));
                    return e.ch = t + 1, i ? "selfClose" : "regular"
                }
                e.ch = t
            }
        }
    }

    function d(e, t) {
        for (var n = []; ;) {
            var r, i = s(e), o = e.line, l = e.ch - (i ? i[0].length : 0);
            if (!i || !(r = a(e))) return;
            if ("selfClose" != r) if (i[1]) {
                for (var c = n.length - 1; c >= 0; --c) if (n[c] == i[2]) {
                    n.length = c;
                    break
                }
                if (c < 0 && (!t || t == i[2])) return {tag: i[2], from: f(o, l), to: f(e.line, e.ch)}
            } else n.push(i[2])
        }
    }

    function u(e, t) {
        for (var n = []; ;) {
            var r = c(e);
            if (!r) return;
            if ("selfClose" != r) {
                var i = e.line, o = e.ch, a = l(e);
                if (!a) return;
                if (a[1]) n.push(a[2]); else {
                    for (var s = n.length - 1; s >= 0; --s) if (n[s] == a[2]) {
                        n.length = s;
                        break
                    }
                    if (s < 0 && (!t || t == a[2])) return {tag: a[2], from: f(e.line, e.ch), to: f(i, o)}
                }
            } else l(e)
        }
    }

    var f = e.Pos,
        h = "A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",
        p = new RegExp("<(/?)([" + h + "][A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD-:.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*)", "g");
    e.registerHelper("fold", "xml", function (e, r) {
        for (var i = new n(e, r.line, 0); ;) {
            var o = s(i);
            if (!o || i.line != r.line) return;
            var l = a(i);
            if (!l) return;
            if (!o[1] && "selfClose" != l) {
                var c = f(i.line, i.ch), u = d(i, o[2]);
                return u && t(u.from, c) > 0 ? {from: c, to: u.from} : null
            }
        }
    }), e.findMatchingTag = function (e, r, i) {
        var o = new n(e, r.line, r.ch, i);
        if (-1 != o.text.indexOf(">") || -1 != o.text.indexOf("<")) {
            var s = a(o), c = s && f(o.line, o.ch), h = s && l(o);
            if (s && h && !(t(o, r) > 0)) {
                var p = {from: f(o.line, o.ch), to: c, tag: h[2]};
                return "selfClose" == s ? {open: p, close: null, at: "open"} : h[1] ? {
                    open: u(o, h[2]),
                    close: p,
                    at: "close"
                } : (o = new n(e, c.line, c.ch, i), {open: p, close: d(o, h[2]), at: "open"})
            }
        }
    }, e.findEnclosingTag = function (e, t, r, i) {
        for (var o = new n(e, t.line, t.ch, r); ;) {
            var a = u(o, i);
            if (!a) break;
            var l = new n(e, t.line, t.ch, r), s = d(l, a.tag);
            if (s) return {open: a, close: s}
        }
    }, e.scanForClosingTag = function (e, t, r, i) {
        return d(new n(e, t.line, t.ch, i ? {from: 0, to: i} : null), r)
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../fold/xml-fold")) : "function" == typeof define && define.amd ? define("addon/edit/closetag.js", ["../../lib/codemirror", "../fold/xml-fold"], e) : e(CodeMirror)
}(function (e) {
    function t(t) {
        if (t.getOption("disableInput")) return e.Pass;
        for (var n = t.listSelections(), r = [], s = t.getOption("autoCloseTags"), c = 0; c < n.length; c++) {
            if (!n[c].empty()) return e.Pass;
            var d = n[c].head, u = t.getTokenAt(d), f = e.innerMode(t.getMode(), u.state), h = f.state,
                p = f.mode.xmlCurrentTag && f.mode.xmlCurrentTag(h), m = p && p.name;
            if (!m) return e.Pass;
            var g = "html" == f.mode.configuration, v = "object" == typeof s && s.dontCloseTags || g && a,
                b = "object" == typeof s && s.indentTags || g && l;
            u.end > d.ch && (m = m.slice(0, m.length - u.end + d.ch));
            var y = m.toLowerCase();
            if (!m || "string" == u.type && (u.end != d.ch || !/[\"\']/.test(u.string.charAt(u.string.length - 1)) || 1 == u.string.length) || "tag" == u.type && p.close || u.string.indexOf("/") == d.ch - u.start - 1 || v && i(v, y) > -1 || o(t, f.mode.xmlCurrentContext && f.mode.xmlCurrentContext(h) || [], m, d, !0)) return e.Pass;
            var k = "object" == typeof s && s.emptyTags;
            if (k && i(k, m) > -1) r[c] = {text: "/>", newPos: e.Pos(d.line, d.ch + 2)}; else {
                var x = b && i(b, y) > -1;
                r[c] = {
                    indent: x,
                    text: ">" + (x ? "\n\n" : "") + "</" + m + ">",
                    newPos: x ? e.Pos(d.line + 1, 0) : e.Pos(d.line, d.ch + 1)
                }
            }
        }
        for (var w = "object" == typeof s && s.dontIndentOnAutoClose, c = n.length - 1; c >= 0; c--) {
            var C = r[c];
            t.replaceRange(C.text, n[c].head, n[c].anchor, "+insert");
            var O = t.listSelections().slice(0);
            O[c] = {
                head: C.newPos,
                anchor: C.newPos
            }, t.setSelections(O), !w && C.indent && (t.indentLine(C.newPos.line, null, !0), t.indentLine(C.newPos.line + 1, null, !0))
        }
    }

    function n(t, n) {
        for (var r = t.listSelections(), i = [], a = n ? "/" : "</", l = t.getOption("autoCloseTags"), s = "object" == typeof l && l.dontIndentOnSlash, c = 0; c < r.length; c++) {
            if (!r[c].empty()) return e.Pass;
            var d = r[c].head, u = t.getTokenAt(d), f = e.innerMode(t.getMode(), u.state), h = f.state;
            if (n && ("string" == u.type || "<" != u.string.charAt(0) || u.start != d.ch - 1)) return e.Pass;
            var p, m = "xml" != f.mode.name && "htmlmixed" == t.getMode().name;
            if (m && "javascript" == f.mode.name) p = a + "script"; else if (m && "css" == f.mode.name) p = a + "style"; else {
                var g = f.mode.xmlCurrentContext && f.mode.xmlCurrentContext(h), v = g.length ? g[g.length - 1] : "";
                if (!g || g.length && o(t, g, v, d)) return e.Pass;
                p = a + v
            }
            ">" != t.getLine(d.line).charAt(u.end) && (p += ">"), i[c] = p
        }
        if (t.replaceSelections(i), r = t.listSelections(), !s) for (var c = 0; c < r.length; c++) (c == r.length - 1 || r[c].head.line < r[c + 1].head.line) && t.indentLine(r[c].head.line)
    }

    function r(t) {
        return t.getOption("disableInput") ? e.Pass : n(t, !0)
    }

    function i(e, t) {
        if (e.indexOf) return e.indexOf(t);
        for (var n = 0, r = e.length; n < r; ++n) if (e[n] == t) return n;
        return -1
    }

    function o(t, n, r, i, o) {
        if (!e.scanForClosingTag) return !1;
        var a = Math.min(t.lastLine() + 1, i.line + 500), l = e.scanForClosingTag(t, i, null, a);
        if (!l || l.tag != r) return !1;
        for (var s = o ? 1 : 0, c = n.length - 1; c >= 0 && n[c] == r; c--) ++s;
        i = l.to;
        for (var c = 1; c < s; c++) {
            var d = e.scanForClosingTag(t, i, null, a);
            if (!d || d.tag != r) return !1;
            i = d.to
        }
        return !0
    }

    e.defineOption("autoCloseTags", !1, function (n, i, o) {
        if (o != e.Init && o && n.removeKeyMap("autoCloseTags"), i) {
            var a = {name: "autoCloseTags"};
            "object" == typeof i && !1 === i.whenClosing || (a["'/'"] = function (e) {
                return r(e)
            }), "object" == typeof i && !1 === i.whenOpening || (a["'>'"] = function (e) {
                return t(e)
            }), n.addKeyMap(a)
        }
    });
    var a = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
        l = ["applet", "blockquote", "body", "button", "div", "dl", "fieldset", "form", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "html", "iframe", "layer", "legend", "object", "ol", "p", "select", "table", "ul"];
    e.commands.closeTag = function (e) {
        return n(e)
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/edit/matchbrackets.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function t(e) {
        return e && e.bracketRegex || /[(){}[\]]/
    }

    function n(e, n, i) {
        var o = e.getLineHandle(n.line), a = n.ch - 1, l = i && i.afterCursor;
        null == l && (l = /(^| )cm-fat-cursor($| )/.test(e.getWrapperElement().className));
        var d = t(i),
            u = !l && a >= 0 && d.test(o.text.charAt(a)) && c[o.text.charAt(a)] || d.test(o.text.charAt(a + 1)) && c[o.text.charAt(++a)];
        if (!u) return null;
        var f = ">" == u.charAt(1) ? 1 : -1;
        if (i && i.strict && f > 0 != (a == n.ch)) return null;
        var h = e.getTokenTypeAt(s(n.line, a + 1)), p = r(e, s(n.line, a + (f > 0 ? 1 : 0)), f, h || null, i);
        return null == p ? null : {from: s(n.line, a), to: p && p.pos, match: p && p.ch == u.charAt(0), forward: f > 0}
    }

    function r(e, n, r, i, o) {
        for (var a = o && o.maxScanLineLength || 1e4, l = o && o.maxScanLines || 1e3, d = [], u = t(o), f = r > 0 ? Math.min(n.line + l, e.lastLine() + 1) : Math.max(e.firstLine() - 1, n.line - l), h = n.line; h != f; h += r) {
            var p = e.getLine(h);
            if (p) {
                var m = r > 0 ? 0 : p.length - 1, g = r > 0 ? p.length : -1;
                if (!(p.length > a)) for (h == n.line && (m = n.ch - (r < 0 ? 1 : 0)); m != g; m += r) {
                    var v = p.charAt(m);
                    if (u.test(v) && (void 0 === i || e.getTokenTypeAt(s(h, m + 1)) == i)) {
                        var b = c[v];
                        if (b && ">" == b.charAt(1) == r > 0) d.push(v); else {
                            if (!d.length) return {pos: s(h, m), ch: v};
                            d.pop()
                        }
                    }
                }
            }
        }
        return h - r != (r > 0 ? e.lastLine() : e.firstLine()) && null
    }

    function i(e, t, r) {
        for (var i = e.state.matchBrackets.maxHighlightLineLength || 1e3, o = [], a = e.listSelections(), c = 0; c < a.length; c++) {
            var d = a[c].empty() && n(e, a[c].head, r);
            if (d && e.getLine(d.from.line).length <= i) {
                var u = d.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
                o.push(e.markText(d.from, s(d.from.line, d.from.ch + 1), {className: u})), d.to && e.getLine(d.to.line).length <= i && o.push(e.markText(d.to, s(d.to.line, d.to.ch + 1), {className: u}))
            }
        }
        if (o.length) {
            l && e.state.focused && e.focus();
            var f = function () {
                e.operation(function () {
                    for (var e = 0; e < o.length; e++) o[e].clear()
                })
            };
            if (!t) return f;
            setTimeout(f, 800)
        }
    }

    function o(e) {
        e.operation(function () {
            e.state.matchBrackets.currentlyHighlighted && (e.state.matchBrackets.currentlyHighlighted(), e.state.matchBrackets.currentlyHighlighted = null), e.state.matchBrackets.currentlyHighlighted = i(e, !1, e.state.matchBrackets)
        })
    }

    function a(e) {
        e.state.matchBrackets && e.state.matchBrackets.currentlyHighlighted && (e.state.matchBrackets.currentlyHighlighted(), e.state.matchBrackets.currentlyHighlighted = null)
    }

    var l = /MSIE \d/.test(navigator.userAgent) && (null == document.documentMode || document.documentMode < 8),
        s = e.Pos, c = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<", "<": ">>", ">": "<<"};
    e.defineOption("matchBrackets", !1, function (t, n, r) {
        r && r != e.Init && (t.off("cursorActivity", o), t.off("focus", o), t.off("blur", a), a(t)), n && (t.state.matchBrackets = "object" == typeof n ? n : {}, t.on("cursorActivity", o), t.on("focus", o), t.on("blur", a))
    }), e.defineExtension("matchBrackets", function () {
        i(this, !0)
    }), e.defineExtension("findMatchingBracket", function (e, t, r) {
        return (r || "boolean" == typeof t) && (r ? (r.strict = t, t = r) : t = t ? {strict: !0} : null), n(this, e, t)
    }), e.defineExtension("scanForBracket", function (e, t, n, i) {
        return r(this, e, t, n, i)
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../fold/xml-fold")) : "function" == typeof define && define.amd ? define("addon/edit/matchtags.js", ["../../lib/codemirror", "../fold/xml-fold"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        e.state.tagHit && e.state.tagHit.clear(), e.state.tagOther && e.state.tagOther.clear(), e.state.tagHit = e.state.tagOther = null
    }

    function n(n) {
        n.state.failedTagMatch = !1, n.operation(function () {
            if (t(n), !n.somethingSelected()) {
                var r = n.getCursor(), i = n.getViewport();
                i.from = Math.min(i.from, r.line), i.to = Math.max(r.line + 1, i.to);
                var o = e.findMatchingTag(n, r, i);
                if (o) {
                    if (n.state.matchBothTags) {
                        var a = "open" == o.at ? o.open : o.close;
                        a && (n.state.tagHit = n.markText(a.from, a.to, {className: "CodeMirror-matchingtag"}))
                    }
                    var l = "close" == o.at ? o.open : o.close;
                    l ? n.state.tagOther = n.markText(l.from, l.to, {className: "CodeMirror-matchingtag"}) : n.state.failedTagMatch = !0
                }
            }
        })
    }

    function r(e) {
        e.state.failedTagMatch && n(e)
    }

    e.defineOption("matchTags", !1, function (i, o, a) {
        a && a != e.Init && (i.off("cursorActivity", n), i.off("viewportChange", r), t(i)), o && (i.state.matchBothTags = "object" == typeof o && o.bothTags, i.on("cursorActivity", n), i.on("viewportChange", r), n(i))
    }), e.commands.toMatchingTag = function (t) {
        var n = e.findMatchingTag(t, t.getCursor());
        if (n) {
            var r = "close" == n.at ? n.open : n.close;
            r && t.extendSelection(r.to, r.from)
        }
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/edit/trailingspace.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    e.defineOption("showTrailingSpace", !1, function (t, n, r) {
        r == e.Init && (r = !1), r && !n ? t.removeOverlay("trailingspace") : !r && n && t.addOverlay({
            token: function (e) {
                for (var t = e.string.length, n = t; n && /\s/.test(e.string.charAt(n - 1)); --n) ;
                return n > e.pos ? (e.pos = n, null) : (e.pos = t, "trailingspace")
            }, name: "trailingspace"
        })
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/fold/foldcode", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(t, i, o, a) {
        function l(e) {
            var n = s(t, i);
            if (!n || n.to.line - n.from.line < c) return null;
            for (var r = t.findMarksAt(n.from), o = 0; o < r.length; ++o) if (r[o].__isFold && "fold" !== a) {
                if (!e) return null;
                n.cleared = !0, r[o].clear()
            }
            return n
        }

        if (o && o.call) {
            var s = o;
            o = null
        } else var s = r(t, o, "rangeFinder");
        "number" == typeof i && (i = e.Pos(i, 0));
        var c = r(t, o, "minFoldSize"), d = l(!0);
        if (r(t, o, "scanUp")) for (; !d && i.line > t.firstLine();) i = e.Pos(i.line - 1, 0), d = l(!1);
        if (d && !d.cleared && "unfold" !== a) {
            var u = n(t, o, d);
            e.on(u, "mousedown", function (t) {
                f.clear(), e.e_preventDefault(t)
            });
            var f = t.markText(d.from, d.to, {replacedWith: u, clearOnEnter: r(t, o, "clearOnEnter"), __isFold: !0});
            f.on("clear", function (n, r) {
                e.signal(t, "unfold", t, n, r)
            }), e.signal(t, "fold", t, d.from, d.to)
        }
    }

    function n(e, t, n) {
        var i = r(e, t, "widget");
        if ("function" == typeof i && (i = i(n.from, n.to)), "string" == typeof i) {
            var o = document.createTextNode(i);
            i = document.createElement("span"), i.appendChild(o), i.className = "CodeMirror-foldmarker"
        } else i && (i = i.cloneNode(!0));
        return i
    }

    function r(e, t, n) {
        if (t && void 0 !== t[n]) return t[n];
        var r = e.options.foldOptions;
        return r && void 0 !== r[n] ? r[n] : i[n]
    }

    e.newFoldFunction = function (e, n) {
        return function (r, i) {
            t(r, i, {rangeFinder: e, widget: n})
        }
    }, e.defineExtension("foldCode", function (e, n, r) {
        t(this, e, n, r)
    }), e.defineExtension("isFolded", function (e) {
        for (var t = this.findMarksAt(e), n = 0; n < t.length; ++n) if (t[n].__isFold) return !0
    }), e.commands.toggleFold = function (e) {
        e.foldCode(e.getCursor())
    }, e.commands.fold = function (e) {
        e.foldCode(e.getCursor(), null, "fold")
    }, e.commands.unfold = function (e) {
        e.foldCode(e.getCursor(), null, "unfold")
    }, e.commands.foldAll = function (t) {
        t.operation(function () {
            for (var n = t.firstLine(), r = t.lastLine(); n <= r; n++) t.foldCode(e.Pos(n, 0), null, "fold")
        })
    }, e.commands.unfoldAll = function (t) {
        t.operation(function () {
            for (var n = t.firstLine(), r = t.lastLine(); n <= r; n++) t.foldCode(e.Pos(n, 0), null, "unfold")
        })
    }, e.registerHelper("fold", "combine", function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return function (t, n) {
            for (var r = 0; r < e.length; ++r) {
                var i = e[r](t, n);
                if (i) return i
            }
        }
    }), e.registerHelper("fold", "auto", function (e, t) {
        for (var n = e.getHelpers(t, "fold"), r = 0; r < n.length; r++) {
            var i = n[r](e, t);
            if (i) return i
        }
    });
    var i = {rangeFinder: e.fold.auto, widget: "↔", minFoldSize: 0, scanUp: !1, clearOnEnter: !0};
    e.defineOption("foldOptions", null), e.defineExtension("foldOption", function (e, t) {
        return r(this, e, t)
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./foldcode")) : "function" == typeof define && define.amd ? define("addon/fold/foldgutter.js", ["../../lib/codemirror", "./foldcode"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        this.options = e, this.from = this.to = 0
    }

    function n(e) {
        return !0 === e && (e = {}), null == e.gutter && (e.gutter = "CodeMirror-foldgutter"), null == e.indicatorOpen && (e.indicatorOpen = "CodeMirror-foldgutter-open"), null == e.indicatorFolded && (e.indicatorFolded = "CodeMirror-foldgutter-folded"), e
    }

    function r(e, t) {
        for (var n = e.findMarks(f(t, 0), f(t + 1, 0)), r = 0; r < n.length; ++r) if (n[r].__isFold) {
            var i = n[r].find(-1);
            if (i && i.line === t) return n[r]
        }
    }

    function i(e) {
        if ("string" == typeof e) {
            var t = document.createElement("div");
            return t.className = e + " CodeMirror-guttermarker-subtle", t
        }
        return e.cloneNode(!0)
    }

    function o(e, t, n) {
        var o = e.state.foldGutter.options, l = t - 1, s = e.foldOption(o, "minFoldSize"),
            c = e.foldOption(o, "rangeFinder"), d = "string" == typeof o.indicatorFolded && a(o.indicatorFolded),
            u = "string" == typeof o.indicatorOpen && a(o.indicatorOpen);
        e.eachLine(t, n, function (t) {
            ++l;
            var n = null, a = t.gutterMarkers;
            if (a && (a = a[o.gutter]), r(e, l)) {
                if (d && a && d.test(a.className)) return;
                n = i(o.indicatorFolded)
            } else {
                var h = f(l, 0), p = c && c(e, h);
                if (p && p.to.line - p.from.line >= s) {
                    if (u && a && u.test(a.className)) return;
                    n = i(o.indicatorOpen)
                }
            }
            (n || a) && e.setGutterMarker(t, o.gutter, n)
        })
    }

    function a(e) {
        return new RegExp("(^|\\s)" + e + "(?:$|\\s)\\s*")
    }

    function l(e) {
        var t = e.getViewport(), n = e.state.foldGutter;
        n && (e.operation(function () {
            o(e, t.from, t.to)
        }), n.from = t.from, n.to = t.to)
    }

    function s(e, t, n) {
        var i = e.state.foldGutter;
        if (i) {
            var o = i.options;
            if (n == o.gutter) {
                var a = r(e, t);
                a ? a.clear() : e.foldCode(f(t, 0), o)
            }
        }
    }

    function c(e) {
        var t = e.state.foldGutter;
        if (t) {
            var n = t.options;
            t.from = t.to = 0, clearTimeout(t.changeUpdate), t.changeUpdate = setTimeout(function () {
                l(e)
            }, n.foldOnChangeTimeSpan || 600)
        }
    }

    function d(e) {
        var t = e.state.foldGutter;
        if (t) {
            var n = t.options;
            clearTimeout(t.changeUpdate), t.changeUpdate = setTimeout(function () {
                var n = e.getViewport();
                t.from == t.to || n.from - t.to > 20 || t.from - n.to > 20 ? l(e) : e.operation(function () {
                    n.from < t.from && (o(e, n.from, t.from), t.from = n.from), n.to > t.to && (o(e, t.to, n.to), t.to = n.to)
                })
            }, n.updateViewportTimeSpan || 400)
        }
    }

    function u(e, t) {
        var n = e.state.foldGutter;
        if (n) {
            var r = t.line;
            r >= n.from && r < n.to && o(e, r, r + 1)
        }
    }

    e.defineOption("foldGutter", !1, function (r, i, o) {
        o && o != e.Init && (r.clearGutter(r.state.foldGutter.options.gutter), r.state.foldGutter = null, r.off("gutterClick", s), r.off("changes", c), r.off("viewportChange", d), r.off("fold", u), r.off("unfold", u), r.off("swapDoc", c)), i && (r.state.foldGutter = new t(n(i)), l(r), r.on("gutterClick", s), r.on("changes", c), r.on("viewportChange", d), r.on("fold", u), r.on("unfold", u), r.on("swapDoc", c))
    });
    var f = e.Pos
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/fold/brace-fold.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.registerHelper("fold", "brace", function (t, n) {
        function r(r) {
            for (var l = n.ch, s = 0; ;) {
                var c = l <= 0 ? -1 : a.lastIndexOf(r, l - 1);
                if (-1 != c) {
                    if (1 == s && c < n.ch) break;
                    if (i = t.getTokenTypeAt(e.Pos(o, c + 1)), !/^(comment|string)/.test(i)) return c + 1;
                    l = c - 1
                } else {
                    if (1 == s) break;
                    s = 1, l = a.length
                }
            }
        }

        var i, o = n.line, a = t.getLine(o), l = "{", s = "}", c = r("{");
        if (null == c && (l = "[", s = "]", c = r("[")), null != c) {
            var d, u, f = 1, h = t.lastLine();
            e:for (var p = o; p <= h; ++p) for (var m = t.getLine(p), g = p == o ? c : 0; ;) {
                var v = m.indexOf(l, g), b = m.indexOf(s, g);
                if (v < 0 && (v = m.length), b < 0 && (b = m.length), (g = Math.min(v, b)) == m.length) break;
                if (t.getTokenTypeAt(e.Pos(p, g + 1)) == i) if (g == v) ++f; else if (!--f) {
                    d = p, u = g;
                    break e
                }
                ++g
            }
            if (null != d && o != d) return {from: e.Pos(o, c), to: e.Pos(d, u)}
        }
    }), e.registerHelper("fold", "import", function (t, n) {
        function r(n) {
            if (n < t.firstLine() || n > t.lastLine()) return null;
            var r = t.getTokenAt(e.Pos(n, 1));
            if (/\S/.test(r.string) || (r = t.getTokenAt(e.Pos(n, r.end + 1))), "keyword" != r.type || "import" != r.string) return null;
            for (var i = n, o = Math.min(t.lastLine(), n + 10); i <= o; ++i) {
                var a = t.getLine(i), l = a.indexOf(";");
                if (-1 != l) return {startCh: r.end, end: e.Pos(i, l)}
            }
        }

        var i, o = n.line, a = r(o);
        if (!a || r(o - 1) || (i = r(o - 2)) && i.end.line == o - 1) return null;
        for (var l = a.end; ;) {
            var s = r(l.line + 1);
            if (null == s) break;
            l = s.end
        }
        return {from: t.clipPos(e.Pos(o, a.startCh + 1)), to: l}
    }), e.registerHelper("fold", "include", function (t, n) {
        function r(n) {
            if (n < t.firstLine() || n > t.lastLine()) return null;
            var r = t.getTokenAt(e.Pos(n, 1));
            return /\S/.test(r.string) || (r = t.getTokenAt(e.Pos(n, r.end + 1))), "meta" == r.type && "#include" == r.string.slice(0, 8) ? r.start + 8 : void 0
        }

        var i = n.line, o = r(i);
        if (null == o || null != r(i - 1)) return null;
        for (var a = i; ;) {
            if (null == r(a + 1)) break;
            ++a
        }
        return {from: e.Pos(i, o + 1), to: t.clipPos(e.Pos(a))}
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/fold/comment-fold.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.registerGlobalHelper("fold", "comment", function (e) {
        return e.blockCommentStart && e.blockCommentEnd
    }, function (t, n) {
        var r = t.getModeAt(n), i = r.blockCommentStart, o = r.blockCommentEnd;
        if (i && o) {
            for (var a, l = n.line, s = t.getLine(l), c = n.ch, d = 0; ;) {
                var u = c <= 0 ? -1 : s.lastIndexOf(i, c - 1);
                if (-1 != u) {
                    if (1 == d && u < n.ch) return;
                    if (/comment/.test(t.getTokenTypeAt(e.Pos(l, u + 1))) && (0 == u || s.slice(u - o.length, u) == o || !/comment/.test(t.getTokenTypeAt(e.Pos(l, u))))) {
                        a = u + i.length;
                        break
                    }
                    c = u - 1
                } else {
                    if (1 == d) return;
                    d = 1, c = s.length
                }
            }
            var f, h, p = 1, m = t.lastLine();
            e:for (var g = l; g <= m; ++g) for (var v = t.getLine(g), b = g == l ? a : 0; ;) {
                var y = v.indexOf(i, b), k = v.indexOf(o, b);
                if (y < 0 && (y = v.length), k < 0 && (k = v.length), (b = Math.min(y, k)) == v.length) break;
                if (b == y) ++p; else if (!--p) {
                    f = g, h = b;
                    break e
                }
                ++b
            }
            if (null != f && (l != f || h != a)) return {from: e.Pos(l, a), to: e.Pos(f, h)}
        }
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/fold/indent-fold.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(t, n) {
        var r = t.getLine(n), i = r.search(/\S/);
        return -1 == i || /\bcomment\b/.test(t.getTokenTypeAt(e.Pos(n, i + 1))) ? -1 : e.countColumn(r, null, t.getOption("tabSize"))
    }

    e.registerHelper("fold", "indent", function (n, r) {
        var i = t(n, r.line);
        if (!(i < 0)) {
            for (var o = null, a = r.line + 1, l = n.lastLine(); a <= l; ++a) {
                var s = t(n, a);
                if (-1 == s) ; else {
                    if (!(s > i)) break;
                    o = a
                }
            }
            return o ? {from: e.Pos(r.line, n.getLine(r.line).length), to: e.Pos(o, n.getLine(o).length)} : void 0
        }
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/hint/show-hint.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t) {
        this.cm = e, this.options = t, this.widget = null, this.debounce = 0, this.tick = 0, this.startPos = this.cm.getCursor("start"), this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length;
        var n = this;
        e.on("cursorActivity", this.activityFunc = function () {
            n.cursorActivity()
        })
    }

    function n(e, t, n) {
        var r = e.options.hintOptions, i = {};
        for (var o in p) i[o] = p[o];
        if (r) for (var o in r) void 0 !== r[o] && (i[o] = r[o]);
        if (n) for (var o in n) void 0 !== n[o] && (i[o] = n[o]);
        return i.hint.resolve && (i.hint = i.hint.resolve(e, t)), i
    }

    function r(e) {
        return "string" == typeof e ? e : e.text
    }

    function i(e, t) {
        function n(e, n) {
            var i;
            i = "string" != typeof n ? function (e) {
                return n(e, t)
            } : r.hasOwnProperty(n) ? r[n] : n, o[e] = i
        }

        var r = {
            Up: function () {
                t.moveFocus(-1)
            }, Down: function () {
                t.moveFocus(1)
            }, PageUp: function () {
                t.moveFocus(1 - t.menuSize(), !0)
            }, PageDown: function () {
                t.moveFocus(t.menuSize() - 1, !0)
            }, Home: function () {
                t.setFocus(0)
            }, End: function () {
                t.setFocus(t.length - 1)
            }, Enter: t.pick, Tab: t.pick, Esc: t.close
        };
        /Mac/.test(navigator.platform) && (r["Ctrl-P"] = function () {
            t.moveFocus(-1)
        }, r["Ctrl-N"] = function () {
            t.moveFocus(1)
        });
        var i = e.options.customKeys, o = i ? {} : r;
        if (i) for (var a in i) i.hasOwnProperty(a) && n(a, i[a]);
        var l = e.options.extraKeys;
        if (l) for (var a in l) l.hasOwnProperty(a) && n(a, l[a]);
        return o
    }

    function o(e, t) {
        for (; t && t != e;) {
            if ("LI" === t.nodeName.toUpperCase() && t.parentNode == e) return t;
            t = t.parentNode
        }
    }

    function a(t, n) {
        this.completion = t, this.data = n, this.picked = !1;
        var a = this, l = t.cm, s = l.getInputField().ownerDocument, c = s.defaultView || s.parentWindow,
            f = this.hints = s.createElement("ul"), h = t.cm.options.theme;
        f.className = "CodeMirror-hints " + h, this.selectedHint = n.selectedHint || 0;
        for (var p = n.list, m = 0; m < p.length; ++m) {
            var g = f.appendChild(s.createElement("li")), v = p[m], b = d + (m != this.selectedHint ? "" : " " + u);
            null != v.className && (b = v.className + " " + b), g.className = b, v.render ? v.render(g, n, v) : g.appendChild(s.createTextNode(v.displayText || r(v))), g.hintId = m
        }
        var y = t.options.container || s.body, k = l.cursorCoords(t.options.alignWithWord ? n.from : null), x = k.left,
            w = k.bottom, C = !0, O = 0, A = 0;
        if (y !== s.body) {
            var j = -1 !== ["absolute", "relative", "fixed"].indexOf(c.getComputedStyle(y).position),
                T = j ? y : y.offsetParent, M = T.getBoundingClientRect(), S = s.body.getBoundingClientRect();
            O = M.left - S.left - T.scrollLeft, A = M.top - S.top - T.scrollTop
        }
        f.style.left = x - O + "px", f.style.top = w - A + "px";
        var L = c.innerWidth || Math.max(s.body.offsetWidth, s.documentElement.offsetWidth),
            P = c.innerHeight || Math.max(s.body.offsetHeight, s.documentElement.offsetHeight);
        y.appendChild(f);
        var F, H = t.options.moveOnOverlap ? f.getBoundingClientRect() : new DOMRect,
            z = !!t.options.paddingForScrollbar && f.scrollHeight > f.clientHeight + 1;
        if (setTimeout(function () {
            F = l.getScrollInfo()
        }), H.bottom - P > 0) {
            var E = H.bottom - H.top;
            if (k.top - (k.bottom - H.top) - E > 0) f.style.top = (w = k.top - E - A) + "px", C = !1; else if (E > P) {
                f.style.height = P - 5 + "px", f.style.top = (w = k.bottom - H.top - A) + "px";
                var q = l.getCursor();
                n.from.ch != q.ch && (k = l.cursorCoords(q), f.style.left = (x = k.left - O) + "px", H = f.getBoundingClientRect())
            }
        }
        var B = H.right - L;
        if (B > 0 && (H.right - H.left > L && (f.style.width = L - 5 + "px", B -= H.right - H.left - L), f.style.left = (x = k.left - B - O) + "px"), z) for (var I = f.firstChild; I; I = I.nextSibling) I.style.paddingRight = l.display.nativeBarWidth + "px";
        if (l.addKeyMap(this.keyMap = i(t, {
            moveFocus: function (e, t) {
                a.changeActive(a.selectedHint + e, t)
            }, setFocus: function (e) {
                a.changeActive(e)
            }, menuSize: function () {
                return a.screenAmount()
            }, length: p.length, close: function () {
                t.close()
            }, pick: function () {
                a.pick()
            }, data: n
        })), t.options.closeOnUnfocus) {
            var N;
            l.on("blur", this.onBlur = function () {
                N = setTimeout(function () {
                    t.close()
                }, 100)
            }), l.on("focus", this.onFocus = function () {
                clearTimeout(N)
            })
        }
        l.on("scroll", this.onScroll = function () {
            var e = l.getScrollInfo(), n = l.getWrapperElement().getBoundingClientRect(), r = w + F.top - e.top,
                i = r - (c.pageYOffset || (s.documentElement || s.body).scrollTop);
            if (C || (i += f.offsetHeight), i <= n.top || i >= n.bottom) return t.close();
            f.style.top = r + "px", f.style.left = x + F.left - e.left + "px"
        }), e.on(f, "dblclick", function (e) {
            var t = o(f, e.target || e.srcElement);
            t && null != t.hintId && (a.changeActive(t.hintId), a.pick())
        }), e.on(f, "click", function (e) {
            var n = o(f, e.target || e.srcElement);
            n && null != n.hintId && (a.changeActive(n.hintId), t.options.completeOnSingleClick && a.pick())
        }), e.on(f, "mousedown", function () {
            setTimeout(function () {
                l.focus()
            }, 20)
        });
        var R = this.getSelectedHintRange();
        return 0 === R.from && 0 === R.to || this.scrollToActive(), e.signal(n, "select", p[this.selectedHint], f.childNodes[this.selectedHint]), !0
    }

    function l(e, t) {
        if (!e.somethingSelected()) return t;
        for (var n = [], r = 0; r < t.length; r++) t[r].supportsSelection && n.push(t[r]);
        return n
    }

    function s(e, t, n, r) {
        if (e.async) e(t, r, n); else {
            var i = e(t, n);
            i && i.then ? i.then(r) : r(i)
        }
    }

    function c(t, n) {
        var r, i = t.getHelpers(n, "hint");
        if (i.length) {
            var o = function (e, t, n) {
                function r(i) {
                    if (i == o.length) return t(null);
                    s(o[i], e, n, function (e) {
                        e && e.list.length > 0 ? t(e) : r(i + 1)
                    })
                }

                var o = l(e, i);
                r(0)
            };
            return o.async = !0, o.supportsSelection = !0, o
        }
        return (r = t.getHelper(t.getCursor(), "hintWords")) ? function (t) {
            return e.hint.fromList(t, {words: r})
        } : e.hint.anyword ? function (t, n) {
            return e.hint.anyword(t, n)
        } : function () {
        }
    }

    var d = "CodeMirror-hint", u = "CodeMirror-hint-active";
    e.showHint = function (e, t, n) {
        if (!t) return e.showHint(n);
        n && n.async && (t.async = !0);
        var r = {hint: t};
        if (n) for (var i in n) r[i] = n[i];
        return e.showHint(r)
    }, e.defineExtension("showHint", function (r) {
        r = n(this, this.getCursor("start"), r);
        var i = this.listSelections();
        if (!(i.length > 1)) {
            if (this.somethingSelected()) {
                if (!r.hint.supportsSelection) return;
                for (var o = 0; o < i.length; o++) if (i[o].head.line != i[o].anchor.line) return
            }
            this.state.completionActive && this.state.completionActive.close();
            var a = this.state.completionActive = new t(this, r);
            a.options.hint && (e.signal(this, "startCompletion", this), a.update(!0))
        }
    }), e.defineExtension("closeHint", function () {
        this.state.completionActive && this.state.completionActive.close()
    });
    var f = window.requestAnimationFrame || function (e) {
        return setTimeout(e, 1e3 / 60)
    }, h = window.cancelAnimationFrame || clearTimeout;
    t.prototype = {
        close: function () {
            this.active() && (this.cm.state.completionActive = null, this.tick = null, this.cm.off("cursorActivity", this.activityFunc), this.widget && this.data && e.signal(this.data, "close"), this.widget && this.widget.close(), e.signal(this.cm, "endCompletion", this.cm))
        }, active: function () {
            return this.cm.state.completionActive == this
        }, pick: function (t, n) {
            var i = t.list[n], o = this;
            this.cm.operation(function () {
                i.hint ? i.hint(o.cm, t, i) : o.cm.replaceRange(r(i), i.from || t.from, i.to || t.to, "complete"), e.signal(t, "pick", i), o.cm.scrollIntoView()
            }), this.options.closeOnPick && this.close()
        }, cursorActivity: function () {
            this.debounce && (h(this.debounce), this.debounce = 0);
            var e = this.startPos;
            this.data && (e = this.data.from);
            var t = this.cm.getCursor(), n = this.cm.getLine(t.line);
            if (t.line != this.startPos.line || n.length - t.ch != this.startLen - this.startPos.ch || t.ch < e.ch || this.cm.somethingSelected() || !t.ch || this.options.closeCharacters.test(n.charAt(t.ch - 1))) this.options.closeOnCursorActivity && this.close(); else {
                var r = this;
                this.debounce = f(function () {
                    r.update()
                }), this.widget && this.widget.disable()
            }
        }, update: function (e) {
            if (null != this.tick) {
                var t = this, n = ++this.tick;
                s(this.options.hint, this.cm, this.options, function (r) {
                    t.tick == n && t.finishUpdate(r, e)
                })
            }
        }, finishUpdate: function (t, n) {
            this.data && e.signal(this.data, "update");
            var r = this.widget && this.widget.picked || n && this.options.completeSingle;
            this.widget && this.widget.close(), this.data = t, t && t.list.length && (r && 1 == t.list.length ? this.pick(t, 0) : (this.widget = new a(this, t), e.signal(t, "shown")))
        }
    }, a.prototype = {
        close: function () {
            if (this.completion.widget == this) {
                this.completion.widget = null, this.hints.parentNode.removeChild(this.hints), this.completion.cm.removeKeyMap(this.keyMap);
                var e = this.completion.cm;
                this.completion.options.closeOnUnfocus && (e.off("blur", this.onBlur), e.off("focus", this.onFocus)), e.off("scroll", this.onScroll)
            }
        }, disable: function () {
            this.completion.cm.removeKeyMap(this.keyMap);
            var e = this;
            this.keyMap = {
                Enter: function () {
                    e.picked = !0
                }
            }, this.completion.cm.addKeyMap(this.keyMap)
        }, pick: function () {
            this.completion.pick(this.data, this.selectedHint)
        }, changeActive: function (t, n) {
            if (t >= this.data.list.length ? t = n ? this.data.list.length - 1 : 0 : t < 0 && (t = n ? 0 : this.data.list.length - 1), this.selectedHint != t) {
                var r = this.hints.childNodes[this.selectedHint];
                r && (r.className = r.className.replace(" " + u, "")), r = this.hints.childNodes[this.selectedHint = t], r.className += " " + u, this.scrollToActive(), e.signal(this.data, "select", this.data.list[this.selectedHint], r)
            }
        }, scrollToActive: function () {
            var e = this.getSelectedHintRange(), t = this.hints.childNodes[e.from], n = this.hints.childNodes[e.to],
                r = this.hints.firstChild;
            t.offsetTop < this.hints.scrollTop ? this.hints.scrollTop = t.offsetTop - r.offsetTop : n.offsetTop + n.offsetHeight > this.hints.scrollTop + this.hints.clientHeight && (this.hints.scrollTop = n.offsetTop + n.offsetHeight - this.hints.clientHeight + r.offsetTop)
        }, screenAmount: function () {
            return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1
        }, getSelectedHintRange: function () {
            var e = this.completion.options.scrollMargin || 0;
            return {
                from: Math.max(0, this.selectedHint - e),
                to: Math.min(this.data.list.length - 1, this.selectedHint + e)
            }
        }
    }, e.registerHelper("hint", "auto", {resolve: c}), e.registerHelper("hint", "fromList", function (t, n) {
        var r, i = t.getCursor(), o = t.getTokenAt(i), a = e.Pos(i.line, o.start), l = i;
        o.start < i.ch && /\w/.test(o.string.charAt(i.ch - o.start - 1)) ? r = o.string.substr(0, i.ch - o.start) : (r = "", a = i);
        for (var s = [], c = 0; c < n.words.length; c++) {
            var d = n.words[c];
            d.slice(0, r.length) == r && s.push(d)
        }
        if (s.length) return {list: s, from: a, to: l}
    }), e.commands.autocomplete = e.showHint;
    var p = {
        hint: e.hint.auto,
        completeSingle: !0,
        alignWithWord: !0,
        closeCharacters: /[\s()\[\]{};:>,]/,
        closeOnCursorActivity: !0,
        closeOnPick: !0,
        closeOnUnfocus: !0,
        completeOnSingleClick: !0,
        container: null,
        customKeys: null,
        extraKeys: null,
        paddingForScrollbar: !0,
        moveOnOverlap: !0
    };
    e.defineOption("hintOptions", null)
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/hint/javascript-hint.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function t(e, t) {
        for (var n = 0, r = e.length; n < r; ++n) t(e[n])
    }

    function n(e, t) {
        if (!Array.prototype.indexOf) {
            for (var n = e.length; n--;) if (e[n] === t) return !0;
            return !1
        }
        return -1 != e.indexOf(t)
    }

    function r(t, n, r, i) {
        var o = t.getCursor(), a = r(t, o);
        if (!/\b(?:string|comment)\b/.test(a.type)) {
            var l = e.innerMode(t.getMode(), a.state);
            if ("json" !== l.mode.helperType) {
                a.state = l.state, /^[\w$_]*$/.test(a.string) ? a.end > o.ch && (a.end = o.ch, a.string = a.string.slice(0, o.ch - a.start)) : a = {
                    start: o.ch,
                    end: o.ch,
                    string: "",
                    state: a.state,
                    type: "." == a.string ? "property" : null
                };
                for (var d = a; "property" == d.type;) {
                    if (d = r(t, c(o.line, d.start)), "." != d.string) return;
                    if (d = r(t, c(o.line, d.start)), !u) var u = [];
                    u.push(d)
                }
                return {list: s(a, u, n, i), from: c(o.line, a.start), to: c(o.line, a.end)}
            }
        }
    }

    function i(e, t) {
        return r(e, h, function (e, t) {
            return e.getTokenAt(t)
        }, t)
    }

    function o(e, t) {
        var n = e.getTokenAt(t);
        return t.ch == n.start + 1 && "." == n.string.charAt(0) ? (n.end = n.start, n.string = ".", n.type = "property") : /^\.[\w$_]*$/.test(n.string) && (n.type = "property", n.start++, n.string = n.string.replace(/\./, "")), n
    }

    function a(e, t) {
        return r(e, p, o, t)
    }

    function l(e, t) {
        if (Object.getOwnPropertyNames && Object.getPrototypeOf) for (var n = e; n; n = Object.getPrototypeOf(n)) Object.getOwnPropertyNames(n).forEach(t); else for (var r in e) t(r)
    }

    function s(e, r, i, o) {
        function a(e) {
            0 != e.lastIndexOf(h, 0) || n(c, e) || c.push(e)
        }

        function s(e) {
            "string" == typeof e ? t(d, a) : e instanceof Array ? t(u, a) : e instanceof Function && t(f, a), l(e, a)
        }

        var c = [], h = e.string, p = o && o.globalScope || window;
        if (r && r.length) {
            var m, g = r.pop();
            for (g.type && 0 === g.type.indexOf("variable") ? (o && o.additionalContext && (m = o.additionalContext[g.string]), o && !1 === o.useGlobalScope || (m = m || p[g.string])) : "string" == g.type ? m = "" : "atom" == g.type ? m = 1 : "function" == g.type && (null == p.jQuery || "$" != g.string && "jQuery" != g.string || "function" != typeof p.jQuery ? null != p._ && "_" == g.string && "function" == typeof p._ && (m = p._()) : m = p.jQuery()); null != m && r.length;) m = m[r.pop().string];
            null != m && s(m)
        } else {
            for (var v = e.state.localVars; v; v = v.next) a(v.name);
            for (var b = e.state.context; b; b = b.prev) for (var v = b.vars; v; v = v.next) a(v.name);
            for (var v = e.state.globalVars; v; v = v.next) a(v.name);
            if (o && null != o.additionalContext) for (var y in o.additionalContext) a(y);
            o && !1 === o.useGlobalScope || s(p), t(i, a)
        }
        return c
    }

    var c = e.Pos;
    e.registerHelper("hint", "javascript", i), e.registerHelper("hint", "coffeescript", a);
    var d = "charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight toUpperCase toLowerCase split concat match replace search".split(" "),
        u = "length concat join splice push pop shift unshift slice reverse sort indexOf lastIndexOf every some filter forEach map reduce reduceRight ".split(" "),
        f = "prototype apply call bind".split(" "),
        h = "break case catch class const continue debugger default delete do else export extends false finally for function if in import instanceof new null return super switch this throw true try typeof var void while with yield".split(" "),
        p = "and break catch class continue delete do else extends false finally for if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes".split(" ")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("mode/css/css", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        for (var t = {}, n = 0; n < e.length; ++n) t[e[n].toLowerCase()] = !0;
        return t
    }

    function n(e, t) {
        for (var n, r = !1; null != (n = e.next());) {
            if (r && "/" == n) {
                t.tokenize = null;
                break
            }
            r = "*" == n
        }
        return ["comment", "comment"]
    }

    e.defineMode("css", function (t, n) {
        function r(e, t) {
            return p = t, e
        }

        function i(e, t) {
            var n = e.next();
            if (v[n]) {
                var i = v[n](e, t);
                if (!1 !== i) return i
            }
            return "@" == n ? (e.eatWhile(/[\w\\\-]/), r("def", e.current())) : "=" == n || ("~" == n || "|" == n) && e.eat("=") ? r(null, "compare") : '"' == n || "'" == n ? (t.tokenize = o(n), t.tokenize(e, t)) : "#" == n ? (e.eatWhile(/[\w\\\-]/), r("atom", "hash")) : "!" == n ? (e.match(/^\s*\w*/), r("keyword", "important")) : /\d/.test(n) || "." == n && e.eat(/\d/) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : "-" !== n ? /[,+>*\/]/.test(n) ? r(null, "select-op") : "." == n && e.match(/^-?[_a-z][_a-z0-9-]*/i) ? r("qualifier", "qualifier") : /[:;{}\[\]\(\)]/.test(n) ? r(null, n) : e.match(/[\w-.]+(?=\()/) ? (/^(url(-prefix)?|domain|regexp)$/.test(e.current().toLowerCase()) && (t.tokenize = a), r("variable callee", "variable")) : /[\w\\\-]/.test(n) ? (e.eatWhile(/[\w\\\-]/), r("property", "word")) : r(null, null) : /[\d.]/.test(e.peek()) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : e.match(/^-[\w\\\-]*/) ? (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? r("variable-2", "variable-definition") : r("variable-2", "variable")) : e.match(/^\w+-/) ? r("meta", "meta") : void 0
        }

        function o(e) {
            return function (t, n) {
                for (var i, o = !1; null != (i = t.next());) {
                    if (i == e && !o) {
                        ")" == e && t.backUp(1);
                        break
                    }
                    o = !o && "\\" == i
                }
                return (i == e || !o && ")" != e) && (n.tokenize = null), r("string", "string")
            }
        }

        function a(e, t) {
            return e.next(), e.match(/\s*[\"\')]/, !1) ? t.tokenize = null : t.tokenize = o(")"), r(null, "(")
        }

        function l(e, t, n) {
            this.type = e, this.indent = t, this.prev = n
        }

        function s(e, t, n, r) {
            return e.context = new l(n, t.indentation() + (!1 === r ? 0 : g), e.context), n
        }

        function c(e) {
            return e.context.prev && (e.context = e.context.prev), e.context.type
        }

        function d(e, t, n) {
            return F[n.context.type](e, t, n)
        }

        function u(e, t, n, r) {
            for (var i = r || 1; i > 0; i--) n.context = n.context.prev;
            return d(e, t, n)
        }

        function f(e) {
            var t = e.current().toLowerCase();
            m = T.hasOwnProperty(t) ? "atom" : j.hasOwnProperty(t) ? "keyword" : "variable"
        }

        var h = n.inline;
        n.propertyKeywords || (n = e.resolveMode("text/css"));
        var p, m, g = t.indentUnit, v = n.tokenHooks, b = n.documentTypes || {}, y = n.mediaTypes || {},
            k = n.mediaFeatures || {}, x = n.mediaValueKeywords || {}, w = n.propertyKeywords || {},
            C = n.nonStandardPropertyKeywords || {}, O = n.fontProperties || {}, A = n.counterDescriptors || {},
            j = n.colorKeywords || {}, T = n.valueKeywords || {}, M = n.allowNested, S = n.lineComment,
            L = !0 === n.supportsAtComponent, P = !1 !== t.highlightNonStandardPropertyKeywords, F = {};
        return F.top = function (e, t, n) {
            if ("{" == e) return s(n, t, "block");
            if ("}" == e && n.context.prev) return c(n);
            if (L && /@component/i.test(e)) return s(n, t, "atComponentBlock");
            if (/^@(-moz-)?document$/i.test(e)) return s(n, t, "documentTypes");
            if (/^@(media|supports|(-moz-)?document|import)$/i.test(e)) return s(n, t, "atBlock");
            if (/^@(font-face|counter-style)/i.test(e)) return n.stateArg = e, "restricted_atBlock_before";
            if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(e)) return "keyframes";
            if (e && "@" == e.charAt(0)) return s(n, t, "at");
            if ("hash" == e) m = "builtin"; else if ("word" == e) m = "tag"; else {
                if ("variable-definition" == e) return "maybeprop";
                if ("interpolation" == e) return s(n, t, "interpolation");
                if (":" == e) return "pseudo";
                if (M && "(" == e) return s(n, t, "parens")
            }
            return n.context.type
        }, F.block = function (e, t, n) {
            if ("word" == e) {
                var r = t.current().toLowerCase();
                return w.hasOwnProperty(r) ? (m = "property", "maybeprop") : C.hasOwnProperty(r) ? (m = P ? "string-2" : "property", "maybeprop") : M ? (m = t.match(/^\s*:(?:\s|$)/, !1) ? "property" : "tag", "block") : (m += " error", "maybeprop")
            }
            return "meta" == e ? "block" : M || "hash" != e && "qualifier" != e ? F.top(e, t, n) : (m = "error", "block")
        }, F.maybeprop = function (e, t, n) {
            return ":" == e ? s(n, t, "prop") : d(e, t, n)
        }, F.prop = function (e, t, n) {
            if (";" == e) return c(n);
            if ("{" == e && M) return s(n, t, "propBlock");
            if ("}" == e || "{" == e) return u(e, t, n);
            if ("(" == e) return s(n, t, "parens");
            if ("hash" != e || /^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(t.current())) {
                if ("word" == e) f(t); else if ("interpolation" == e) return s(n, t, "interpolation")
            } else m += " error";
            return "prop"
        }, F.propBlock = function (e, t, n) {
            return "}" == e ? c(n) : "word" == e ? (m = "property", "maybeprop") : n.context.type
        }, F.parens = function (e, t, n) {
            return "{" == e || "}" == e ? u(e, t, n) : ")" == e ? c(n) : "(" == e ? s(n, t, "parens") : "interpolation" == e ? s(n, t, "interpolation") : ("word" == e && f(t), "parens")
        }, F.pseudo = function (e, t, n) {
            return "meta" == e ? "pseudo" : "word" == e ? (m = "variable-3", n.context.type) : d(e, t, n)
        }, F.documentTypes = function (e, t, n) {
            return "word" == e && b.hasOwnProperty(t.current()) ? (m = "tag", n.context.type) : F.atBlock(e, t, n)
        }, F.atBlock = function (e, t, n) {
            if ("(" == e) return s(n, t, "atBlock_parens");
            if ("}" == e || ";" == e) return u(e, t, n);
            if ("{" == e) return c(n) && s(n, t, M ? "block" : "top");
            if ("interpolation" == e) return s(n, t, "interpolation");
            if ("word" == e) {
                var r = t.current().toLowerCase();
                m = "only" == r || "not" == r || "and" == r || "or" == r ? "keyword" : y.hasOwnProperty(r) ? "attribute" : k.hasOwnProperty(r) ? "property" : x.hasOwnProperty(r) ? "keyword" : w.hasOwnProperty(r) ? "property" : C.hasOwnProperty(r) ? P ? "string-2" : "property" : T.hasOwnProperty(r) ? "atom" : j.hasOwnProperty(r) ? "keyword" : "error"
            }
            return n.context.type
        }, F.atComponentBlock = function (e, t, n) {
            return "}" == e ? u(e, t, n) : "{" == e ? c(n) && s(n, t, M ? "block" : "top", !1) : ("word" == e && (m = "error"), n.context.type)
        }, F.atBlock_parens = function (e, t, n) {
            return ")" == e ? c(n) : "{" == e || "}" == e ? u(e, t, n, 2) : F.atBlock(e, t, n)
        }, F.restricted_atBlock_before = function (e, t, n) {
            return "{" == e ? s(n, t, "restricted_atBlock") : "word" == e && "@counter-style" == n.stateArg ? (m = "variable", "restricted_atBlock_before") : d(e, t, n)
        }, F.restricted_atBlock = function (e, t, n) {
            return "}" == e ? (n.stateArg = null, c(n)) : "word" == e ? (m = "@font-face" == n.stateArg && !O.hasOwnProperty(t.current().toLowerCase()) || "@counter-style" == n.stateArg && !A.hasOwnProperty(t.current().toLowerCase()) ? "error" : "property", "maybeprop") : "restricted_atBlock"
        }, F.keyframes = function (e, t, n) {
            return "word" == e ? (m = "variable", "keyframes") : "{" == e ? s(n, t, "top") : d(e, t, n)
        }, F.at = function (e, t, n) {
            return ";" == e ? c(n) : "{" == e || "}" == e ? u(e, t, n) : ("word" == e ? m = "tag" : "hash" == e && (m = "builtin"), "at")
        }, F.interpolation = function (e, t, n) {
            return "}" == e ? c(n) : "{" == e || ";" == e ? u(e, t, n) : ("word" == e ? m = "variable" : "variable" != e && "(" != e && ")" != e && (m = "error"), "interpolation")
        }, {
            startState: function (e) {
                return {
                    tokenize: null,
                    state: h ? "block" : "top",
                    stateArg: null,
                    context: new l(h ? "block" : "top", e || 0, null)
                }
            },
            token: function (e, t) {
                if (!t.tokenize && e.eatSpace()) return null;
                var n = (t.tokenize || i)(e, t);
                return n && "object" == typeof n && (p = n[1], n = n[0]), m = n, "comment" != p && (t.state = F[t.state](p, e, t)), m
            },
            indent: function (e, t) {
                var n = e.context, r = t && t.charAt(0), i = n.indent;
                return "prop" != n.type || "}" != r && ")" != r || (n = n.prev), n.prev && ("}" != r || "block" != n.type && "top" != n.type && "interpolation" != n.type && "restricted_atBlock" != n.type ? (")" != r || "parens" != n.type && "atBlock_parens" != n.type) && ("{" != r || "at" != n.type && "atBlock" != n.type) || (i = Math.max(0, n.indent - g)) : (n = n.prev, i = n.indent)), i
            },
            electricChars: "}",
            blockCommentStart: "/*",
            blockCommentEnd: "*/",
            blockCommentContinue: " * ",
            lineComment: S,
            fold: "brace"
        }
    })
    ;var r = ["domain", "regexp", "url", "url-prefix"], i = t(r),
        o = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"], a = t(o),
        l = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid", "orientation", "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio", "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme"],
        s = t(l),
        c = ["landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover", "interlace", "progressive", "dark", "light"],
        d = t(c),
        u = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "all", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "block-size", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "line-break", "line-height", "line-height-step", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotate", "rotation", "rotation-point", "row-gap", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-type", "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-orientation", "text-outline", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "touch-action", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "text-anchor", "writing-mode"],
        f = t(u),
        h = ["border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "margin-block", "margin-block-end", "margin-block-start", "margin-inline", "margin-inline-end", "margin-inline-start", "padding-block", "padding-block-end", "padding-block-start", "padding-inline", "padding-inline-end", "padding-inline-start", "scroll-snap-stop", "scrollbar-3d-light-color", "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-track-color", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "shape-inside", "zoom"],
        p = t(h),
        m = ["font-display", "font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"],
        g = t(m),
        v = ["additive-symbols", "fallback", "negative", "pad", "prefix", "range", "speak-as", "suffix", "symbols", "system"],
        b = t(v),
        y = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
        k = t(y),
        x = ["above", "absolute", "activeborder", "additive", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page", "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse", "compact", "condensed", "contain", "content", "contents", "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "dense", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "difference", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "japanese-formal", "japanese-informal", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "manipulation", "match", "matrix", "matrix3d", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "perspective", "pinch-zoom", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running", "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen", "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "simp-chinese-formal", "simp-chinese-informal", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub", "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "tamil", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "trad-chinese-formal", "trad-chinese-informal", "transform", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor", "xx-large", "xx-small"],
        w = t(x), C = r.concat(o).concat(l).concat(c).concat(u).concat(h).concat(y).concat(x);
    e.registerHelper("hintWords", "css", C), e.defineMIME("text/css", {
        documentTypes: i,
        mediaTypes: a,
        mediaFeatures: s,
        mediaValueKeywords: d,
        propertyKeywords: f,
        nonStandardPropertyKeywords: p,
        fontProperties: g,
        counterDescriptors: b,
        colorKeywords: k,
        valueKeywords: w,
        tokenHooks: {
            "/": function (e, t) {
                return !!e.eat("*") && (t.tokenize = n, n(e, t))
            }
        },
        name: "css"
    }), e.defineMIME("text/x-scss", {
        mediaTypes: a,
        mediaFeatures: s,
        mediaValueKeywords: d,
        propertyKeywords: f,
        nonStandardPropertyKeywords: p,
        colorKeywords: k,
        valueKeywords: w,
        fontProperties: g,
        allowNested: !0,
        lineComment: "//",
        tokenHooks: {
            "/": function (e, t) {
                return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = n, n(e, t)) : ["operator", "operator"]
            }, ":": function (e) {
                return !!e.match(/\s*\{/, !1) && [null, null]
            }, $: function (e) {
                return e.match(/^[\w-]+/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"]
            }, "#": function (e) {
                return !!e.eat("{") && [null, "interpolation"]
            }
        },
        name: "css",
        helperType: "scss"
    }), e.defineMIME("text/x-less", {
        mediaTypes: a,
        mediaFeatures: s,
        mediaValueKeywords: d,
        propertyKeywords: f,
        nonStandardPropertyKeywords: p,
        colorKeywords: k,
        valueKeywords: w,
        fontProperties: g,
        allowNested: !0,
        lineComment: "//",
        tokenHooks: {
            "/": function (e, t) {
                return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = n, n(e, t)) : ["operator", "operator"]
            }, "@": function (e) {
                return e.eat("{") ? [null, "interpolation"] : !e.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, !1) && (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"])
            }, "&": function () {
                return ["atom", "atom"]
            }
        },
        name: "css",
        helperType: "less"
    }), e.defineMIME("text/x-gss", {
        documentTypes: i,
        mediaTypes: a,
        mediaFeatures: s,
        propertyKeywords: f,
        nonStandardPropertyKeywords: p,
        fontProperties: g,
        counterDescriptors: b,
        colorKeywords: k,
        valueKeywords: w,
        supportsAtComponent: !0,
        tokenHooks: {
            "/": function (e, t) {
                return !!e.eat("*") && (t.tokenize = n, n(e, t))
            }
        },
        name: "css",
        helperType: "gss"
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../../mode/css/css")) : "function" == typeof define && define.amd ? define("addon/hint/css-hint.js", ["../../lib/codemirror", "../../mode/css/css"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    var t = {
        active: 1,
        after: 1,
        before: 1,
        checked: 1,
        default: 1,
        disabled: 1,
        empty: 1,
        enabled: 1,
        "first-child": 1,
        "first-letter": 1,
        "first-line": 1,
        "first-of-type": 1,
        focus: 1,
        hover: 1,
        "in-range": 1,
        indeterminate: 1,
        invalid: 1,
        lang: 1,
        "last-child": 1,
        "last-of-type": 1,
        link: 1,
        not: 1,
        "nth-child": 1,
        "nth-last-child": 1,
        "nth-last-of-type": 1,
        "nth-of-type": 1,
        "only-of-type": 1,
        "only-child": 1,
        optional: 1,
        "out-of-range": 1,
        placeholder: 1,
        "read-only": 1,
        "read-write": 1,
        required: 1,
        root: 1,
        selection: 1,
        target: 1,
        valid: 1,
        visited: 1
    };
    e.registerHelper("hint", "css", function (n) {
        function r(e) {
            for (var t in e) c && 0 != t.lastIndexOf(c, 0) || u.push(t)
        }

        var i = n.getCursor(), o = n.getTokenAt(i), a = e.innerMode(n.getMode(), o.state);
        if ("css" == a.mode.name) {
            if ("keyword" == o.type && 0 == "!important".indexOf(o.string)) return {
                list: ["!important"],
                from: e.Pos(i.line, o.start),
                to: e.Pos(i.line, o.end)
            };
            var l = o.start, s = i.ch, c = o.string.slice(0, s - l);
            /[^\w$_-]/.test(c) && (c = "", l = s = i.ch);
            var d = e.resolveMode("text/css"), u = [], f = a.state.state;
            return "pseudo" == f || "variable-3" == o.type ? r(t) : "block" == f || "maybeprop" == f ? r(d.propertyKeywords) : "prop" == f || "parens" == f || "at" == f || "params" == f ? (r(d.valueKeywords), r(d.colorKeywords)) : "media" != f && "media_parens" != f || (r(d.mediaTypes), r(d.mediaFeatures)), u.length ? {
                list: u,
                from: e.Pos(i.line, l),
                to: e.Pos(i.line, s)
            } : void 0
        }
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/hint/xml-hint", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t, n) {
        return n ? e.indexOf(t) >= 0 : 0 == e.lastIndexOf(t, 0)
    }

    function n(n, i) {
        function o() {
            return {list: p, from: m ? r(c.line, null == h ? d.start : h) : c, to: m ? r(c.line, d.end) : c}
        }

        var a = i && i.schemaInfo, l = i && i.quoteChar || '"', s = i && i.matchInMiddle;
        if (a) {
            var c = n.getCursor(), d = n.getTokenAt(c);
            d.end > c.ch && (d.end = c.ch, d.string = d.string.slice(0, c.ch - d.start));
            var u = e.innerMode(n.getMode(), d.state);
            if (u.mode.xmlCurrentTag) {
                var f, h, p = [], m = !1, g = /\btag\b/.test(d.type) && !/>$/.test(d.string),
                    v = g && /^\w/.test(d.string);
                if (v) {
                    var b = n.getLine(c.line).slice(Math.max(0, d.start - 2), d.start),
                        y = /<\/$/.test(b) ? "close" : /<$/.test(b) ? "open" : null;
                    y && (h = d.start - ("close" == y ? 2 : 1))
                } else g && "<" == d.string ? y = "open" : g && "</" == d.string && (y = "close");
                var k = u.mode.xmlCurrentTag(u.state);
                if (!g && !k || y) {
                    v && (f = d.string), m = y;
                    var x = u.mode.xmlCurrentContext ? u.mode.xmlCurrentContext(u.state) : [],
                        u = x.length && x[x.length - 1], w = u && a[u], C = u ? w && w.children : a["!top"];
                    if (C && "close" != y) for (var O = 0; O < C.length; ++O) f && !t(C[O], f, s) || p.push("<" + C[O]); else if ("close" != y) for (var A in a) !a.hasOwnProperty(A) || "!top" == A || "!attrs" == A || f && !t(A, f, s) || p.push("<" + A);
                    u && (!f || "close" == y && t(u, f, s)) && p.push("</" + u + ">")
                } else {
                    var w = k && a[k.name], j = w && w.attrs, T = a["!attrs"];
                    if (!j && !T) return;
                    if (j) {
                        if (T) {
                            var M = {};
                            for (var S in T) T.hasOwnProperty(S) && (M[S] = T[S]);
                            for (var S in j) j.hasOwnProperty(S) && (M[S] = j[S]);
                            j = M
                        }
                    } else j = T;
                    if ("string" == d.type || "=" == d.string) {
                        var L,
                            b = n.getRange(r(c.line, Math.max(0, c.ch - 60)), r(c.line, "string" == d.type ? d.start : d.end)),
                            P = b.match(/([^\s\u00a0=<>\"\']+)=$/);
                        if (!P || !j.hasOwnProperty(P[1]) || !(L = j[P[1]])) return;
                        if ("function" == typeof L && (L = L.call(this, n)), "string" == d.type) {
                            f = d.string;
                            var F = 0;
                            /['"]/.test(d.string.charAt(0)) && (l = d.string.charAt(0), f = d.string.slice(1), F++);
                            var H = d.string.length;
                            if (/['"]/.test(d.string.charAt(H - 1)) && (l = d.string.charAt(H - 1), f = d.string.substr(F, H - 2)), F) {
                                var z = n.getLine(c.line);
                                z.length > d.end && z.charAt(d.end) == l && d.end++
                            }
                            m = !0
                        }
                        var E = function (e) {
                            if (e) for (var n = 0; n < e.length; ++n) f && !t(e[n], f, s) || p.push(l + e[n] + l);
                            return o()
                        };
                        return L && L.then ? L.then(E) : E(L)
                    }
                    "attribute" == d.type && (f = d.string, m = !0);
                    for (var q in j) !j.hasOwnProperty(q) || f && !t(q, f, s) || p.push(q)
                }
                return o()
            }
        }
    }

    var r = e.Pos;
    e.registerHelper("hint", "xml", n)
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./xml-hint")) : "function" == typeof define && define.amd ? define("addon/hint/html-hint.js", ["../../lib/codemirror", "./xml-hint"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        for (var t in u) u.hasOwnProperty(t) && (e.attrs[t] = u[t])
    }

    function n(t, n) {
        var r = {schemaInfo: d};
        if (n) for (var i in n) r[i] = n[i];
        return e.hint.xml(t, r)
    }

    var r = "ab aa af ak sq am ar an hy as av ae ay az bm ba eu be bn bh bi bs br bg my ca ch ce ny zh cv kw co cr hr cs da dv nl dz en eo et ee fo fj fi fr ff gl ka de el gn gu ht ha he hz hi ho hu ia id ie ga ig ik io is it iu ja jv kl kn kr ks kk km ki rw ky kv kg ko ku kj la lb lg li ln lo lt lu lv gv mk mg ms ml mt mi mr mh mn na nv nb nd ne ng nn no ii nr oc oj cu om or os pa pi fa pl ps pt qu rm rn ro ru sa sc sd se sm sg sr gd sn si sk sl so st es su sw ss sv ta te tg th ti bo tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa cy wo fy xh yi yo za zu".split(" "),
        i = ["_blank", "_self", "_top", "_parent"], o = ["ascii", "utf-8", "utf-16", "latin1", "latin1"],
        a = ["get", "post", "put", "delete"],
        l = ["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"],
        s = ["all", "screen", "print", "embossed", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "speech", "3d-glasses", "resolution [>][<][=] [X]", "device-aspect-ratio: X/Y", "orientation:portrait", "orientation:landscape", "device-height: [X]", "device-width: [X]"],
        c = {attrs: {}}, d = {
            a: {attrs: {href: null, ping: null, type: null, media: s, target: i, hreflang: r}},
            abbr: c,
            acronym: c,
            address: c,
            applet: c,
            area: {
                attrs: {
                    alt: null,
                    coords: null,
                    href: null,
                    target: null,
                    ping: null,
                    media: s,
                    hreflang: r,
                    type: null,
                    shape: ["default", "rect", "circle", "poly"]
                }
            },
            article: c,
            aside: c,
            audio: {
                attrs: {
                    src: null,
                    mediagroup: null,
                    crossorigin: ["anonymous", "use-credentials"],
                    preload: ["none", "metadata", "auto"],
                    autoplay: ["", "autoplay"],
                    loop: ["", "loop"],
                    controls: ["", "controls"]
                }
            },
            b: c,
            base: {attrs: {href: null, target: i}},
            basefont: c,
            bdi: c,
            bdo: c,
            big: c,
            blockquote: {attrs: {cite: null}},
            body: c,
            br: c,
            button: {
                attrs: {
                    form: null,
                    formaction: null,
                    name: null,
                    value: null,
                    autofocus: ["", "autofocus"],
                    disabled: ["", "autofocus"],
                    formenctype: l,
                    formmethod: a,
                    formnovalidate: ["", "novalidate"],
                    formtarget: i,
                    type: ["submit", "reset", "button"]
                }
            },
            canvas: {attrs: {width: null, height: null}},
            caption: c,
            center: c,
            cite: c,
            code: c,
            col: {attrs: {span: null}},
            colgroup: {attrs: {span: null}},
            command: {
                attrs: {
                    type: ["command", "checkbox", "radio"],
                    label: null,
                    icon: null,
                    radiogroup: null,
                    command: null,
                    title: null,
                    disabled: ["", "disabled"],
                    checked: ["", "checked"]
                }
            },
            data: {attrs: {value: null}},
            datagrid: {attrs: {disabled: ["", "disabled"], multiple: ["", "multiple"]}},
            datalist: {attrs: {data: null}},
            dd: c,
            del: {attrs: {cite: null, datetime: null}},
            details: {attrs: {open: ["", "open"]}},
            dfn: c,
            dir: c,
            div: c,
            dialog: {attrs: {open: null}},
            dl: c,
            dt: c,
            em: c,
            embed: {attrs: {src: null, type: null, width: null, height: null}},
            eventsource: {attrs: {src: null}},
            fieldset: {attrs: {disabled: ["", "disabled"], form: null, name: null}},
            figcaption: c,
            figure: c,
            font: c,
            footer: c,
            form: {
                attrs: {
                    action: null,
                    name: null,
                    "accept-charset": o,
                    autocomplete: ["on", "off"],
                    enctype: l,
                    method: a,
                    novalidate: ["", "novalidate"],
                    target: i
                }
            },
            frame: c,
            frameset: c,
            h1: c,
            h2: c,
            h3: c,
            h4: c,
            h5: c,
            h6: c,
            head: {attrs: {}, children: ["title", "base", "link", "style", "meta", "script", "noscript", "command"]},
            header: c,
            hgroup: c,
            hr: c,
            html: {attrs: {manifest: null}, children: ["head", "body"]},
            i: c,
            iframe: {
                attrs: {
                    src: null,
                    srcdoc: null,
                    name: null,
                    width: null,
                    height: null,
                    sandbox: ["allow-top-navigation", "allow-same-origin", "allow-forms", "allow-scripts"],
                    seamless: ["", "seamless"]
                }
            },
            img: {
                attrs: {
                    alt: null,
                    src: null,
                    ismap: null,
                    usemap: null,
                    width: null,
                    height: null,
                    crossorigin: ["anonymous", "use-credentials"]
                }
            },
            input: {
                attrs: {
                    alt: null,
                    dirname: null,
                    form: null,
                    formaction: null,
                    height: null,
                    list: null,
                    max: null,
                    maxlength: null,
                    min: null,
                    name: null,
                    pattern: null,
                    placeholder: null,
                    size: null,
                    src: null,
                    step: null,
                    value: null,
                    width: null,
                    accept: ["audio/*", "video/*", "image/*"],
                    autocomplete: ["on", "off"],
                    autofocus: ["", "autofocus"],
                    checked: ["", "checked"],
                    disabled: ["", "disabled"],
                    formenctype: l,
                    formmethod: a,
                    formnovalidate: ["", "novalidate"],
                    formtarget: i,
                    multiple: ["", "multiple"],
                    readonly: ["", "readonly"],
                    required: ["", "required"],
                    type: ["hidden", "text", "search", "tel", "url", "email", "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color", "checkbox", "radio", "file", "submit", "image", "reset", "button"]
                }
            },
            ins: {attrs: {cite: null, datetime: null}},
            kbd: c,
            keygen: {
                attrs: {
                    challenge: null,
                    form: null,
                    name: null,
                    autofocus: ["", "autofocus"],
                    disabled: ["", "disabled"],
                    keytype: ["RSA"]
                }
            },
            label: {attrs: {for: null, form: null}},
            legend: c,
            li: {attrs: {value: null}},
            link: {
                attrs: {
                    href: null,
                    type: null,
                    hreflang: r,
                    media: s,
                    sizes: ["all", "16x16", "16x16 32x32", "16x16 32x32 64x64"]
                }
            },
            map: {attrs: {name: null}},
            mark: c,
            menu: {attrs: {label: null, type: ["list", "context", "toolbar"]}},
            meta: {
                attrs: {
                    content: null,
                    charset: o,
                    name: ["viewport", "application-name", "author", "description", "generator", "keywords"],
                    "http-equiv": ["content-language", "content-type", "default-style", "refresh"]
                }
            },
            meter: {attrs: {value: null, min: null, low: null, high: null, max: null, optimum: null}},
            nav: c,
            noframes: c,
            noscript: c,
            object: {
                attrs: {
                    data: null,
                    type: null,
                    name: null,
                    usemap: null,
                    form: null,
                    width: null,
                    height: null,
                    typemustmatch: ["", "typemustmatch"]
                }
            },
            ol: {attrs: {reversed: ["", "reversed"], start: null, type: ["1", "a", "A", "i", "I"]}},
            optgroup: {attrs: {disabled: ["", "disabled"], label: null}},
            option: {attrs: {disabled: ["", "disabled"], label: null, selected: ["", "selected"], value: null}},
            output: {attrs: {for: null, form: null, name: null}},
            p: c,
            param: {attrs: {name: null, value: null}},
            pre: c,
            progress: {attrs: {value: null, max: null}},
            q: {attrs: {cite: null}},
            rp: c,
            rt: c,
            ruby: c,
            s: c,
            samp: c,
            script: {attrs: {type: ["text/javascript"], src: null, async: ["", "async"], defer: ["", "defer"], charset: o}},
            section: c,
            select: {
                attrs: {
                    form: null,
                    name: null,
                    size: null,
                    autofocus: ["", "autofocus"],
                    disabled: ["", "disabled"],
                    multiple: ["", "multiple"]
                }
            },
            small: c,
            source: {attrs: {src: null, type: null, media: null}},
            span: c,
            strike: c,
            strong: c,
            style: {attrs: {type: ["text/css"], media: s, scoped: null}},
            sub: c,
            summary: c,
            sup: c,
            table: c,
            tbody: c,
            td: {attrs: {colspan: null, rowspan: null, headers: null}},
            textarea: {
                attrs: {
                    dirname: null,
                    form: null,
                    maxlength: null,
                    name: null,
                    placeholder: null,
                    rows: null,
                    cols: null,
                    autofocus: ["", "autofocus"],
                    disabled: ["", "disabled"],
                    readonly: ["", "readonly"],
                    required: ["", "required"],
                    wrap: ["soft", "hard"]
                }
            },
            tfoot: c,
            th: {attrs: {colspan: null, rowspan: null, headers: null, scope: ["row", "col", "rowgroup", "colgroup"]}},
            thead: c,
            time: {attrs: {datetime: null}},
            title: c,
            tr: c,
            track: {
                attrs: {
                    src: null,
                    label: null,
                    default: null,
                    kind: ["subtitles", "captions", "descriptions", "chapters", "metadata"],
                    srclang: r
                }
            },
            tt: c,
            u: c,
            ul: c,
            var: c,
            video: {
                attrs: {
                    src: null,
                    poster: null,
                    width: null,
                    height: null,
                    crossorigin: ["anonymous", "use-credentials"],
                    preload: ["auto", "metadata", "none"],
                    autoplay: ["", "autoplay"],
                    mediagroup: ["movie"],
                    muted: ["", "muted"],
                    controls: ["", "controls"]
                }
            },
            wbr: c
        }, u = {
            accesskey: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            class: null,
            contenteditable: ["true", "false"],
            contextmenu: null,
            dir: ["ltr", "rtl", "auto"],
            draggable: ["true", "false", "auto"],
            dropzone: ["copy", "move", "link", "string:", "file:"],
            hidden: ["hidden"],
            id: null,
            inert: ["inert"],
            itemid: null,
            itemprop: null,
            itemref: null,
            itemscope: ["itemscope"],
            itemtype: null,
            lang: ["en", "es"],
            spellcheck: ["true", "false"],
            autocorrect: ["true", "false"],
            autocapitalize: ["true", "false"],
            style: null,
            tabindex: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            title: null,
            translate: ["yes", "no"],
            onclick: null,
            rel: ["stylesheet", "alternate", "author", "bookmark", "help", "license", "next", "nofollow", "noreferrer", "prefetch", "prev", "search", "tag"]
        };
    t(c);
    for (var f in d) d.hasOwnProperty(f) && d[f] != c && t(d[f]);
    e.htmlSchema = d, e.registerHelper("hint", "html", n)
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/format/autoFormatAll.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    e.defineExtension("autoFormatAll", function (t, n) {
        function r() {
            c += "\n", u = !0, ++d
        }

        for (var i = this, o = i.getMode(), a = i.getRange(t, n).split("\n"), l = e.copyState(o, i.getTokenAt(t).state), s = i.getOption("tabSize"), c = "", d = 0, u = 0 == t.ch, f = 0; f < a.length; ++f) {
            for (var h = new e.StringStream(a[f], s); !h.eol();) {
                var p = e.innerMode(o, l), m = o.token(h, l), g = h.current();
                h.start = h.pos, u && !/\S/.test(g) || (c += g, u = !1), !u && p.mode.newlineAfterToken && p.mode.newlineAfterToken(m, g, h.string.slice(h.pos) || a[f + 1] || "", p.state) && r()
            }
            !h.pos && o.blankLine && o.blankLine(l), !u && f < a.length - 1 && r()
        }
        i.operation(function () {
            i.replaceRange(c, t, n);
            for (var e = t.line + 1, r = t.line + d; e <= r; ++e) i.indentLine(e, "smart");
            i.setCursor({line: 0, ch: 0})
        })
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/format/formatting.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function t(e) {
        for (var t = [/for\s*?\((.*?)\)/g, /&#?[a-z0-9]+;[\s\S]/g, /\"(.*?)((\")|$)/g, /\/\*(.*?)(\*\/|$)/g, /^\/\/.*/g], n = [], r = 0; r < t.length; r++) for (var i = 0; i < e.length;) {
            var o = e.substr(i).match(t[r]);
            if (null == o) break;
            n.push({start: i + o.index, end: i + o.index + o[0].length}), i += o.index + Math.max(1, o[0].length)
        }
        return n.sort(function (e, t) {
            return e.start - t.start
        }), n
    }

    e.extendMode("css", {
        commentStart: "/*", commentEnd: "*/", newlineAfterToken: function (e, t) {
            return /^[;{}]$/.test(t)
        }
    }), e.extendMode("javascript", {
        commentStart: "/*",
        commentEnd: "*/",
        wordWrapChars: [";", "\\{", "\\}"],
        autoFormatLineBreaks: function (e) {
            var n = 0, r = this.jsonMode ? function (e) {
                return e.replace(/([,{])/g, "$1\n").replace(/}/g, "\n}")
            } : function (e) {
                return e.replace(/(;|\{|\})([^\r\n;])/g, "$1\n$2")
            }, i = t(e), o = "";
            if (null != i) {
                for (var a = 0; a < i.length; a++) i[a].start > n && (o += r(e.substring(n, i[a].start)), n = i[a].start), i[a].start <= n && i[a].end >= n && (o += e.substring(n, i[a].end), n = i[a].end);
                n < e.length && (o += r(e.substr(n)))
            } else o = r(e);
            return o.replace(/^\n*|\n*$/, "")
        }
    });
    e.extendMode("xml", {
        commentStart: "\x3c!--",
        commentEnd: "--\x3e",
        noBreak: !1,
        noBreakEmpty: null,
        tagType: "",
        tagName: "",
        isXML: !1,
        newlineAfterToken: function (e, t, n, r) {
            var i = "a|b|bdi|bdo|big|center|cite|del|em|font|i|img|ins|s|small|span|strike|strong|sub|sup|u",
                o = "label|li|option|textarea|title|" + i, a = !1, l = null, s = "";
            if (this.isXML = "xml" == this.configuration, "comment" == e || /<!--/.test(n)) return !1;
            if ("tag" == e) {
                if (0 == t.indexOf("<") && 0 == !t.indexOf("</")) {
                    this.tagType = "open", l = t.match(/^<\s*?([\w]+?)$/i), this.tagName = null != l ? l[1] : "";
                    var s = this.tagName.toLowerCase();
                    -1 != ("|" + o + "|").indexOf("|" + s + "|") && (this.noBreak = !0)
                }
                if (0 == t.indexOf(">") && "open" == this.tagType) {
                    this.tagType = "";
                    var c = this.isXML ? "[^<]*?" : "";
                    return RegExp("^" + c + "</s*?" + this.tagName + "s*?>", "i").test(n) ? (this.noBreak = !1, this.isXML || (this.tagName = ""), !1) : (a = this.noBreak, this.noBreak = !1, !a)
                }
                if (0 == t.indexOf("</") && (this.tagType = "close", l = t.match(/^<\/\s*?([\w]+?)$/i), null != l && (s = l[1].toLowerCase()), -1 != ("|" + i + "|").indexOf("|" + s + "|") && (this.noBreak = !0)), 0 == t.indexOf(">") && "close" == this.tagType) return this.tagType = "", 0 == n.indexOf("<") && (l = n.match(/^<\/?\s*?([\w]+?)(\s|>)/i), s = null != l ? l[1].toLowerCase() : "", -1 == ("|" + o + "|").indexOf("|" + s + "|")) ? (this.noBreak = !1, !0) : (a = this.noBreak, this.noBreak = !1, !a)
            }
            return 0 == n.indexOf("<") && (this.noBreak = !1, this.isXML && "" != this.tagName ? (this.tagName = "", !1) : (l = n.match(/^<\/?\s*?([\w]+?)(\s|>)/i), s = null != l ? l[1].toLowerCase() : "", -1 == ("|" + o + "|").indexOf("|" + s + "|")))
        }
    }), e.defineExtension("commentRange", function (t, n, r) {
        var i = this, o = e.innerMode(i.getMode(), i.getTokenAt(n).state).mode;
        i.operation(function () {
            if (t) i.replaceRange(o.commentEnd, r), i.replaceRange(o.commentStart, n), i.setSelection(n, {
                line: r.line,
                ch: r.ch + o.commentStart.length + o.commentEnd.length
            }), n.line == r.line && n.ch == r.ch && i.setCursor(n.line, n.ch + o.commentStart.length); else {
                var e = i.getRange(n, r), a = e.indexOf(o.commentStart), l = e.lastIndexOf(o.commentEnd);
                a > -1 && l > -1 && l > a && (e = e.substr(0, a) + e.substring(a + o.commentStart.length, l) + e.substr(l + o.commentEnd.length)), i.replaceRange(e, n, r), i.setSelection(n, {
                    line: r.line,
                    ch: r.ch - o.commentStart.length - o.commentEnd.length
                })
            }
        })
    }), e.defineExtension("autoIndentRange", function (e, t) {
        var n = this;
        this.operation(function () {
            for (var r = e.line; r <= t.line; r++) n.indentLine(r, "smart")
        })
    }), e.defineExtension("autoFormatRange", function (t, n) {
        function r() {
            c += "\n", u = !0, ++d
        }

        for (var i = this, o = i.getMode(), a = i.getRange(t, n).split("\n"), l = e.copyState(o, i.getTokenAt(t).state), s = i.getOption("tabSize"), c = "", d = 0, u = 0 == t.ch, f = 0; f < a.length; ++f) {
            for (var h = new e.StringStream(a[f], s); !h.eol();) {
                var p = e.innerMode(o, l), m = o.token(h, l), g = h.current();
                h.start = h.pos, u && !/\S/.test(g) || (c += g, u = !1), !u && p.mode.newlineAfterToken && p.mode.newlineAfterToken(m, g, h.string.slice(h.pos) || a[f + 1] || "", p.state) && r()
            }
            !h.pos && o.blankLine && o.blankLine(l), !u && f < a.length - 1 && r()
        }
        i.operation(function () {
            i.replaceRange(c, t, n);
            for (var e = t.line + 1, r = t.line + d; e <= r; ++e) i.indentLine(e, "smart");
            i.setSelection(t, i.getCursor(!1))
        })
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/selection/active-line.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        for (var t = 0; t < e.state.activeLines.length; t++) e.removeLineClass(e.state.activeLines[t], "wrap", o), e.removeLineClass(e.state.activeLines[t], "background", a), e.removeLineClass(e.state.activeLines[t], "gutter", l)
    }

    function n(e, t) {
        if (e.length != t.length) return !1;
        for (var n = 0; n < e.length; n++) if (e[n] != t[n]) return !1;
        return !0
    }

    function r(e, r) {
        for (var i = [], s = 0; s < r.length; s++) {
            var c = r[s], d = e.getOption("styleActiveLine");
            if ("object" == typeof d && d.nonEmpty ? c.anchor.line == c.head.line : c.empty()) {
                var u = e.getLineHandleVisualStart(c.head.line);
                i[i.length - 1] != u && i.push(u)
            }
        }
        n(e.state.activeLines, i) || e.operation(function () {
            t(e);
            for (var n = 0; n < i.length; n++) e.addLineClass(i[n], "wrap", o), e.addLineClass(i[n], "background", a), e.addLineClass(i[n], "gutter", l);
            e.state.activeLines = i
        })
    }

    function i(e, t) {
        r(e, t.ranges)
    }

    var o = "CodeMirror-activeline", a = "CodeMirror-activeline-background", l = "CodeMirror-activeline-gutter";
    e.defineOption("styleActiveLine", !1, function (n, o, a) {
        var l = a != e.Init && a;
        o != l && (l && (n.off("beforeSelectionChange", i), t(n), delete n.state.activeLines), o && (n.state.activeLines = [], r(n, n.listSelections()), n.on("beforeSelectionChange", i)))
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/search/searchcursor", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        var t = e.flags;
        return null != t ? t : (e.ignoreCase ? "i" : "") + (e.global ? "g" : "") + (e.multiline ? "m" : "")
    }

    function n(e, n) {
        for (var r = t(e), i = r, o = 0; o < n.length; o++) -1 == i.indexOf(n.charAt(o)) && (i += n.charAt(o));
        return r == i ? e : new RegExp(e.source, i)
    }

    function r(e) {
        return /\\s|\\n|\n|\\W|\\D|\[\^/.test(e.source)
    }

    function i(e, t, r) {
        t = n(t, "g");
        for (var i = r.line, o = r.ch, a = e.lastLine(); i <= a; i++, o = 0) {
            t.lastIndex = o;
            var l = e.getLine(i), s = t.exec(l);
            if (s) return {from: m(i, s.index), to: m(i, s.index + s[0].length), match: s}
        }
    }

    function o(e, t, o) {
        if (!r(t)) return i(e, t, o);
        t = n(t, "gm");
        for (var a, l = 1, s = o.line, c = e.lastLine(); s <= c;) {
            for (var d = 0; d < l && !(s > c); d++) {
                var u = e.getLine(s++);
                a = null == a ? u : a + "\n" + u
            }
            l *= 2, t.lastIndex = o.ch;
            var f = t.exec(a);
            if (f) {
                var h = a.slice(0, f.index).split("\n"), p = f[0].split("\n"), g = o.line + h.length - 1,
                    v = h[h.length - 1].length;
                return {
                    from: m(g, v),
                    to: m(g + p.length - 1, 1 == p.length ? v + p[0].length : p[p.length - 1].length),
                    match: f
                }
            }
        }
    }

    function a(e, t, n) {
        for (var r, i = 0; i <= e.length;) {
            t.lastIndex = i;
            var o = t.exec(e);
            if (!o) break;
            var a = o.index + o[0].length;
            if (a > e.length - n) break;
            (!r || a > r.index + r[0].length) && (r = o), i = o.index + 1
        }
        return r
    }

    function l(e, t, r) {
        t = n(t, "g");
        for (var i = r.line, o = r.ch, l = e.firstLine(); i >= l; i--, o = -1) {
            var s = e.getLine(i), c = a(s, t, o < 0 ? 0 : s.length - o);
            if (c) return {from: m(i, c.index), to: m(i, c.index + c[0].length), match: c}
        }
    }

    function s(e, t, i) {
        if (!r(t)) return l(e, t, i);
        t = n(t, "gm");
        for (var o, s = 1, c = e.getLine(i.line).length - i.ch, d = i.line, u = e.firstLine(); d >= u;) {
            for (var f = 0; f < s && d >= u; f++) {
                var h = e.getLine(d--);
                o = null == o ? h : h + "\n" + o
            }
            s *= 2;
            var p = a(o, t, c);
            if (p) {
                var g = o.slice(0, p.index).split("\n"), v = p[0].split("\n"), b = d + g.length,
                    y = g[g.length - 1].length;
                return {
                    from: m(b, y),
                    to: m(b + v.length - 1, 1 == v.length ? y + v[0].length : v[v.length - 1].length),
                    match: p
                }
            }
        }
    }

    function c(e, t, n, r) {
        if (e.length == t.length) return n;
        for (var i = 0, o = n + Math.max(0, e.length - t.length); ;) {
            if (i == o) return i;
            var a = i + o >> 1, l = r(e.slice(0, a)).length;
            if (l == n) return a;
            l > n ? o = a : i = a + 1
        }
    }

    function d(e, t, n, r) {
        if (!t.length) return null;
        var i = r ? h : p, o = i(t).split(/\r|\n\r?/);
        e:for (var a = n.line, l = n.ch, s = e.lastLine() + 1 - o.length; a <= s; a++, l = 0) {
            var d = e.getLine(a).slice(l), u = i(d);
            if (1 == o.length) {
                var f = u.indexOf(o[0]);
                if (-1 == f) continue;
                var n = c(d, u, f, i) + l;
                return {from: m(a, c(d, u, f, i) + l), to: m(a, c(d, u, f + o[0].length, i) + l)}
            }
            var g = u.length - o[0].length;
            if (u.slice(g) == o[0]) {
                for (var v = 1; v < o.length - 1; v++) if (i(e.getLine(a + v)) != o[v]) continue e;
                var b = e.getLine(a + o.length - 1), y = i(b), k = o[o.length - 1];
                if (y.slice(0, k.length) == k) return {
                    from: m(a, c(d, u, g, i) + l),
                    to: m(a + o.length - 1, c(b, y, k.length, i))
                }
            }
        }
    }

    function u(e, t, n, r) {
        if (!t.length) return null;
        var i = r ? h : p, o = i(t).split(/\r|\n\r?/);
        e:for (var a = n.line, l = n.ch, s = e.firstLine() - 1 + o.length; a >= s; a--, l = -1) {
            var d = e.getLine(a);
            l > -1 && (d = d.slice(0, l));
            var u = i(d);
            if (1 == o.length) {
                var f = u.lastIndexOf(o[0]);
                if (-1 == f) continue;
                return {from: m(a, c(d, u, f, i)), to: m(a, c(d, u, f + o[0].length, i))}
            }
            var g = o[o.length - 1];
            if (u.slice(0, g.length) == g) {
                for (var v = 1, n = a - o.length + 1; v < o.length - 1; v++) if (i(e.getLine(n + v)) != o[v]) continue e;
                var b = e.getLine(a + 1 - o.length), y = i(b);
                if (y.slice(y.length - o[0].length) == o[0]) return {
                    from: m(a + 1 - o.length, c(b, y, b.length - o[0].length, i)),
                    to: m(a, c(d, u, g.length, i))
                }
            }
        }
    }

    function f(e, t, r, a) {
        this.atOccurrence = !1, this.doc = e, r = r ? e.clipPos(r) : m(0, 0), this.pos = {from: r, to: r};
        var c;
        "object" == typeof a ? c = a.caseFold : (c = a, a = null), "string" == typeof t ? (null == c && (c = !1), this.matches = function (n, r) {
            return (n ? u : d)(e, t, r, c)
        }) : (t = n(t, "gm"), a && !1 === a.multiline ? this.matches = function (n, r) {
            return (n ? l : i)(e, t, r)
        } : this.matches = function (n, r) {
            return (n ? s : o)(e, t, r)
        })
    }

    var h, p, m = e.Pos;
    String.prototype.normalize ? (h = function (e) {
        return e.normalize("NFD").toLowerCase()
    }, p = function (e) {
        return e.normalize("NFD")
    }) : (h = function (e) {
        return e.toLowerCase()
    }, p = function (e) {
        return e
    }), f.prototype = {
        findNext: function () {
            return this.find(!1)
        }, findPrevious: function () {
            return this.find(!0)
        }, find: function (t) {
            for (var n = this.matches(t, this.doc.clipPos(t ? this.pos.from : this.pos.to)); n && 0 == e.cmpPos(n.from, n.to);) t ? n.from.ch ? n.from = m(n.from.line, n.from.ch - 1) : n = n.from.line == this.doc.firstLine() ? null : this.matches(t, this.doc.clipPos(m(n.from.line - 1))) : n.to.ch < this.doc.getLine(n.to.line).length ? n.to = m(n.to.line, n.to.ch + 1) : n = n.to.line == this.doc.lastLine() ? null : this.matches(t, m(n.to.line + 1, 0));
            if (n) return this.pos = n, this.atOccurrence = !0, this.pos.match || !0;
            var r = m(t ? this.doc.firstLine() : this.doc.lastLine() + 1, 0);
            return this.pos = {from: r, to: r}, this.atOccurrence = !1
        }, from: function () {
            if (this.atOccurrence) return this.pos.from
        }, to: function () {
            if (this.atOccurrence) return this.pos.to
        }, replace: function (t, n) {
            if (this.atOccurrence) {
                var r = e.splitLines(t);
                this.doc.replaceRange(r, this.pos.from, this.pos.to, n), this.pos.to = m(this.pos.from.line + r.length - 1, r[r.length - 1].length + (1 == r.length ? this.pos.from.ch : 0))
            }
        }
    }, e.defineExtension("getSearchCursor", function (e, t, n) {
        return new f(this.doc, e, t, n)
    }), e.defineDocExtension("getSearchCursor", function (e, t, n) {
        return new f(this, e, t, n)
    }), e.defineExtension("selectMatches", function (t, n) {
        for (var r = [], i = this.getSearchCursor(t, this.getCursor("from"), n); i.findNext() && !(e.cmpPos(i.to(), this.getCursor("to")) > 0);) r.push({
            anchor: i.from(),
            head: i.to()
        });
        r.length && this.setSelections(r, 0)
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/scroll/annotatescrollbar", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t) {
        function n(e) {
            clearTimeout(r.doRedraw), r.doRedraw = setTimeout(function () {
                r.redraw()
            }, e)
        }

        this.cm = e, this.options = t, this.buttonHeight = t.scrollButtonHeight || e.getOption("scrollButtonHeight"), this.annotations = [], this.doRedraw = this.doUpdate = null, this.div = e.getWrapperElement().appendChild(document.createElement("div")), this.div.style.cssText = "position: absolute; right: 0; top: 0; z-index: 7; pointer-events: none", this.computeScale();
        var r = this;
        e.on("refresh", this.resizeHandler = function () {
            clearTimeout(r.doUpdate), r.doUpdate = setTimeout(function () {
                r.computeScale() && n(20)
            }, 100)
        }), e.on("markerAdded", this.resizeHandler), e.on("markerCleared", this.resizeHandler), !1 !== t.listenForChanges && e.on("changes", this.changeHandler = function () {
            n(250)
        })
    }

    e.defineExtension("annotateScrollbar", function (e) {
        return "string" == typeof e && (e = {className: e}), new t(this, e)
    }), e.defineOption("scrollButtonHeight", 0), t.prototype.computeScale = function () {
        var e = this.cm,
            t = (e.getWrapperElement().clientHeight - e.display.barHeight - 2 * this.buttonHeight) / e.getScrollerElement().scrollHeight;
        if (t != this.hScale) return this.hScale = t, !0
    }, t.prototype.update = function (e) {
        this.annotations = e, this.redraw()
    }, t.prototype.redraw = function (e) {
        function t(e, t) {
            if (s != e.line) {
                s = e.line, c = n.getLineHandle(e.line);
                var r = n.getLineHandleVisualStart(c);
                r != c && (s = n.getLineNumber(r), c = r)
            }
            return c.widgets && c.widgets.length || a && c.height > l ? n.charCoords(e, "local")[t ? "top" : "bottom"] : n.heightAtLine(c, "local") + (t ? 0 : c.height)
        }

        !1 !== e && this.computeScale();
        var n = this.cm, r = this.hScale, i = document.createDocumentFragment(), o = this.annotations,
            a = n.getOption("lineWrapping"), l = a && 1.5 * n.defaultTextHeight(), s = null, c = null, d = n.lastLine();
        if (n.display.barWidth) for (var u, f = 0; f < o.length; f++) {
            var h = o[f];
            if (!(h.to.line > d)) {
                for (var p = u || t(h.from, !0) * r, m = t(h.to, !1) * r; f < o.length - 1 && !(o[f + 1].to.line > d) && !((u = t(o[f + 1].from, !0) * r) > m + .9);) h = o[++f], m = t(h.to, !1) * r;
                if (m != p) {
                    var g = Math.max(m - p, 3), v = i.appendChild(document.createElement("div"));
                    v.style.cssText = "position: absolute; right: 0px; width: " + Math.max(n.display.barWidth - 1, 2) + "px; top: " + (p + this.buttonHeight) + "px; height: " + g + "px", v.className = this.options.className, h.id && v.setAttribute("annotation-id", h.id)
                }
            }
        }
        this.div.textContent = "", this.div.appendChild(i)
    }, t.prototype.clear = function () {
        this.cm.off("refresh", this.resizeHandler), this.cm.off("markerAdded", this.resizeHandler), this.cm.off("markerCleared", this.resizeHandler), this.changeHandler && this.cm.off("changes", this.changeHandler), this.div.parentNode.removeChild(this.div)
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./searchcursor"), require("../scroll/annotatescrollbar")) : "function" == typeof define && define.amd ? define("addon/search/matchesonscrollbar", ["../../lib/codemirror", "./searchcursor", "../scroll/annotatescrollbar"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t, n, r) {
        this.cm = e, this.options = r;
        var i = {listenForChanges: !1};
        for (var o in r) i[o] = r[o];
        i.className || (i.className = "CodeMirror-search-match"), this.annotation = e.annotateScrollbar(i), this.query = t, this.caseFold = n, this.gap = {
            from: e.firstLine(),
            to: e.lastLine() + 1
        }, this.matches = [], this.update = null, this.findMatches(), this.annotation.update(this.matches);
        var a = this;
        e.on("change", this.changeHandler = function (e, t) {
            a.onChange(t)
        })
    }

    function n(e, t, n) {
        return e <= t ? e : Math.max(t, e + n)
    }

    e.defineExtension("showMatchesOnScrollbar", function (e, n, r) {
        return "string" == typeof r && (r = {className: r}), r || (r = {}), new t(this, e, n, r)
    });
    t.prototype.findMatches = function () {
        if (this.gap) {
            for (var t = 0; t < this.matches.length; t++) {
                var n = this.matches[t];
                if (n.from.line >= this.gap.to) break;
                n.to.line >= this.gap.from && this.matches.splice(t--, 1)
            }
            for (var r = this.cm.getSearchCursor(this.query, e.Pos(this.gap.from, 0), {
                caseFold: this.caseFold,
                multiline: this.options.multiline
            }), i = this.options && this.options.maxMatches || 1e3; r.findNext();) {
                var n = {from: r.from(), to: r.to()};
                if (n.from.line >= this.gap.to) break;
                if (this.matches.splice(t++, 0, n), this.matches.length > i) break
            }
            this.gap = null
        }
    }, t.prototype.onChange = function (t) {
        var r = t.from.line, i = e.changeEnd(t).line, o = i - t.to.line;
        if (this.gap ? (this.gap.from = Math.min(n(this.gap.from, r, o), t.from.line), this.gap.to = Math.max(n(this.gap.to, r, o), t.from.line)) : this.gap = {
            from: t.from.line,
            to: i + 1
        }, o) for (var a = 0; a < this.matches.length; a++) {
            var l = this.matches[a], s = n(l.from.line, r, o);
            s != l.from.line && (l.from = e.Pos(s, l.from.ch));
            var c = n(l.to.line, r, o);
            c != l.to.line && (l.to = e.Pos(c, l.to.ch))
        }
        clearTimeout(this.update);
        var d = this;
        this.update = setTimeout(function () {
            d.updateAfterChange()
        }, 250)
    }, t.prototype.updateAfterChange = function () {
        this.findMatches(), this.annotation.update(this.matches)
    }, t.prototype.clear = function () {
        this.cm.off("change", this.changeHandler), this.annotation.clear()
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./matchesonscrollbar")) : "function" == typeof define && define.amd ? define("addon/search/match-highlighter.js", ["../../lib/codemirror", "./matchesonscrollbar"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        this.options = {};
        for (var t in u) this.options[t] = (e && e.hasOwnProperty(t) ? e : u)[t];
        this.overlay = this.timeout = null, this.matchesonscroll = null, this.active = !1
    }

    function n(e) {
        var t = e.state.matchHighlighter;
        (t.active || e.hasFocus()) && i(e, t)
    }

    function r(e) {
        var t = e.state.matchHighlighter;
        t.active || (t.active = !0, i(e, t))
    }

    function i(e, t) {
        clearTimeout(t.timeout), t.timeout = setTimeout(function () {
            l(e)
        }, t.options.delay)
    }

    function o(e, t, n, r) {
        var i = e.state.matchHighlighter;
        if (e.addOverlay(i.overlay = d(t, n, r)), i.options.annotateScrollbar && e.showMatchesOnScrollbar) {
            var o = n ? new RegExp((/\w/.test(t.charAt(0)) ? "\\b" : "") + t.replace(/[\\\[.+*?(){|^$]/g, "\\$&") + (/\w/.test(t.charAt(t.length - 1)) ? "\\b" : "")) : t;
            i.matchesonscroll = e.showMatchesOnScrollbar(o, !1, {className: "CodeMirror-selection-highlight-scrollbar"})
        }
    }

    function a(e) {
        var t = e.state.matchHighlighter;
        t.overlay && (e.removeOverlay(t.overlay), t.overlay = null, t.matchesonscroll && (t.matchesonscroll.clear(), t.matchesonscroll = null))
    }

    function l(e) {
        e.operation(function () {
            var t = e.state.matchHighlighter;
            if (a(e), !e.somethingSelected() && t.options.showToken) {
                for (var n = !0 === t.options.showToken ? /[\w$]/ : t.options.showToken, r = e.getCursor(), i = e.getLine(r.line), l = r.ch, c = l; l && n.test(i.charAt(l - 1));) --l;
                for (; c < i.length && n.test(i.charAt(c));) ++c;
                return void (l < c && o(e, i.slice(l, c), n, t.options.style))
            }
            var d = e.getCursor("from"), u = e.getCursor("to");
            if (d.line == u.line && (!t.options.wordsOnly || s(e, d, u))) {
                var f = e.getRange(d, u);
                t.options.trim && (f = f.replace(/^\s+|\s+$/g, "")), f.length >= t.options.minChars && o(e, f, !1, t.options.style)
            }
        })
    }

    function s(e, t, n) {
        if (null !== e.getRange(t, n).match(/^\w+$/)) {
            if (t.ch > 0) {
                var r = {line: t.line, ch: t.ch - 1}, i = e.getRange(r, t);
                if (null === i.match(/\W/)) return !1
            }
            if (n.ch < e.getLine(t.line).length) {
                var r = {line: n.line, ch: n.ch + 1}, i = e.getRange(n, r);
                if (null === i.match(/\W/)) return !1
            }
            return !0
        }
        return !1
    }

    function c(e, t) {
        return !(e.start && t.test(e.string.charAt(e.start - 1)) || e.pos != e.string.length && t.test(e.string.charAt(e.pos)))
    }

    function d(e, t, n) {
        return {
            token: function (r) {
                if (r.match(e) && (!t || c(r, t))) return n;
                r.next(), r.skipTo(e.charAt(0)) || r.skipToEnd()
            }
        }
    }

    var u = {
        style: "matchhighlight",
        minChars: 2,
        delay: 100,
        wordsOnly: !1,
        annotateScrollbar: !1,
        showToken: !1,
        trim: !0
    };
    e.defineOption("highlightSelectionMatches", !1, function (i, o, s) {
        if (s && s != e.Init && (a(i), clearTimeout(i.state.matchHighlighter.timeout), i.state.matchHighlighter = null, i.off("cursorActivity", n), i.off("focus", r)), o) {
            var c = i.state.matchHighlighter = new t(o);
            i.hasFocus() ? (c.active = !0, l(i)) : i.on("focus", r), i.on("cursorActivity", n)
        }
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/mode/multiplex.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.multiplexingMode = function (t) {
        function n(e, t, n, r) {
            if ("string" == typeof t) {
                var i = e.indexOf(t, n);
                return r && i > -1 ? i + t.length : i
            }
            var o = t.exec(n ? e.slice(n) : e);
            return o ? o.index + n + (r ? o[0].length : 0) : -1
        }

        var r = Array.prototype.slice.call(arguments, 1);
        return {
            startState: function () {
                return {outer: e.startState(t), innerActive: null, inner: null}
            }, copyState: function (n) {
                return {
                    outer: e.copyState(t, n.outer),
                    innerActive: n.innerActive,
                    inner: n.innerActive && e.copyState(n.innerActive.mode, n.inner)
                }
            }, token: function (i, o) {
                if (o.innerActive) {
                    var a = o.innerActive, l = i.string;
                    if (!a.close && i.sol()) return o.innerActive = o.inner = null, this.token(i, o);
                    var s = a.close ? n(l, a.close, i.pos, a.parseDelimiters) : -1;
                    if (s == i.pos && !a.parseDelimiters) return i.match(a.close), o.innerActive = o.inner = null, a.delimStyle && a.delimStyle + " " + a.delimStyle + "-close";
                    s > -1 && (i.string = l.slice(0, s));
                    var c = a.mode.token(i, o.inner);
                    return s > -1 && (i.string = l), s == i.pos && a.parseDelimiters && (o.innerActive = o.inner = null), a.innerStyle && (c = c ? c + " " + a.innerStyle : a.innerStyle), c
                }
                for (var d = 1 / 0, l = i.string, u = 0; u < r.length; ++u) {
                    var f = r[u], s = n(l, f.open, i.pos);
                    if (s == i.pos) {
                        f.parseDelimiters || i.match(f.open), o.innerActive = f;
                        var h = 0;
                        if (t.indent) {
                            var p = t.indent(o.outer, "", "");
                            p !== e.Pass && (h = p)
                        }
                        return o.inner = e.startState(f.mode, h), f.delimStyle && f.delimStyle + " " + f.delimStyle + "-open"
                    }
                    -1 != s && s < d && (d = s)
                }
                d != 1 / 0 && (i.string = l.slice(0, d));
                var m = t.token(i, o.outer);
                return d != 1 / 0 && (i.string = l), m
            }, indent: function (n, r, i) {
                var o = n.innerActive ? n.innerActive.mode : t;
                return o.indent ? o.indent(n.innerActive ? n.inner : n.outer, r, i) : e.Pass
            }, blankLine: function (n) {
                var i = n.innerActive ? n.innerActive.mode : t;
                if (i.blankLine && i.blankLine(n.innerActive ? n.inner : n.outer), n.innerActive) "\n" === n.innerActive.close && (n.innerActive = n.inner = null); else for (var o = 0; o < r.length; ++o) {
                    var a = r[o];
                    "\n" === a.open && (n.innerActive = a, n.inner = e.startState(a.mode, i.indent ? i.indent(n.outer, "", "") : 0))
                }
            }, electricChars: t.electricChars, innerMode: function (e) {
                return e.inner ? {state: e.inner, mode: e.innerActive.mode} : {state: e.outer, mode: t}
            }
        }
    }
}), function (e) {
    "function" == typeof e.define && e.define("addons", ["addon/comment/continuecomment.js", "addon/edit/closebrackets.js", "addon/edit/closetag.js", "addon/edit/matchbrackets.js", "addon/edit/matchtags.js", "addon/edit/trailingspace.js", "addon/fold/foldgutter.js", "addon/fold/brace-fold.js", "addon/fold/comment-fold.js", "addon/fold/indent-fold.js", "addon/hint/show-hint.js", "addon/hint/javascript-hint.js", "addon/hint/css-hint.js", "addon/hint/xml-hint.js", "addon/hint/html-hint.js", "addon/format/autoFormatAll.js", "addon/format/formatting.js", "addon/selection/active-line.js", "addon/search/match-highlighter.js", "addon/mode/multiplex.js"], function () {
    })
}(this);