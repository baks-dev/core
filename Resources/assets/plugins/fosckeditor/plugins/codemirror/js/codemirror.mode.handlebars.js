!function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/mode/simple.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t) {
        if (!e.hasOwnProperty(t)) throw new Error("Undefined state " + t + " in simple mode")
    }

    function n(e, t) {
        if (!e) return /(?:)/;
        var n = "";
        return e instanceof RegExp ? (e.ignoreCase && (n = "i"), e = e.source) : e = String(e), new RegExp((!1 === t ? "" : "^") + "(?:" + e + ")", n)
    }

    function r(e) {
        if (!e) return null;
        if (e.apply) return e;
        if ("string" == typeof e) return e.replace(/\./g, " ");
        for (var t = [], n = 0; n < e.length; n++) t.push(e[n] && e[n].replace(/\./g, " "));
        return t
    }

    function o(e, o) {
        (e.next || e.push) && t(o, e.next || e.push), this.regex = n(e.regex), this.token = r(e.token), this.data = e
    }

    function a(e, t) {
        return function (n, r) {
            if (r.pending) {
                var o = r.pending.shift();
                return 0 == r.pending.length && (r.pending = null), n.pos += o.text.length, o.token
            }
            if (r.local) {
                if (r.local.end && n.match(r.local.end)) {
                    var a = r.local.endToken || null;
                    return r.local = r.localState = null, a
                }
                var i, a = r.local.mode.token(n, r.localState);
                return r.local.endScan && (i = r.local.endScan.exec(n.current())) && (n.pos = n.start + i.index), a
            }
            for (var d = e[r.state], s = 0; s < d.length; s++) {
                var c = d[s], u = (!c.data.sol || n.sol()) && n.match(c.regex);
                if (u) {
                    c.data.next ? r.state = c.data.next : c.data.push ? ((r.stack || (r.stack = [])).push(r.state), r.state = c.data.push) : c.data.pop && r.stack && r.stack.length && (r.state = r.stack.pop()), c.data.mode && l(t, r, c.data.mode, c.token), c.data.indent && r.indent.push(n.indentation() + t.indentUnit), c.data.dedent && r.indent.pop();
                    var f = c.token;
                    if (f && f.apply && (f = f(u)), u.length > 2 && c.token && "string" != typeof c.token) {
                        r.pending = [];
                        for (var m = 2; m < u.length; m++) u[m] && r.pending.push({text: u[m], token: c.token[m - 1]});
                        return n.backUp(u[0].length - (u[1] ? u[1].length : 0)), f[0]
                    }
                    return f && f.join ? f[0] : f
                }
            }
            return n.next(), null
        }
    }

    function i(e, t) {
        if (e === t) return !0;
        if (!e || "object" != typeof e || !t || "object" != typeof t) return !1;
        var n = 0;
        for (var r in e) if (e.hasOwnProperty(r)) {
            if (!t.hasOwnProperty(r) || !i(e[r], t[r])) return !1;
            n++
        }
        for (var r in t) t.hasOwnProperty(r) && n--;
        return 0 == n
    }

    function l(t, r, o, a) {
        var l;
        if (o.persistent) for (var d = r.persistentStates; d && !l; d = d.next) (o.spec ? i(o.spec, d.spec) : o.mode == d.mode) && (l = d);
        var s = l ? l.mode : o.mode || e.getMode(t, o.spec), c = l ? l.state : e.startState(s);
        o.persistent && !l && (r.persistentStates = {
            mode: s,
            spec: o.spec,
            state: c,
            next: r.persistentStates
        }), r.localState = c, r.local = {
            mode: s,
            end: o.end && n(o.end),
            endScan: o.end && !1 !== o.forceEnd && n(o.end, !1),
            endToken: a && a.join ? a[a.length - 1] : a
        }
    }

    function d(e, t) {
        for (var n = 0; n < t.length; n++) if (t[n] === e) return !0
    }

    function s(t, n) {
        return function (r, o, a) {
            if (r.local && r.local.mode.indent) return r.local.mode.indent(r.localState, o, a);
            if (null == r.indent || r.local || n.dontIndentStates && d(r.state, n.dontIndentStates) > -1) return e.Pass;
            var i = r.indent.length - 1, l = t[r.state];
            e:for (; ;) {
                for (var s = 0; s < l.length; s++) {
                    var c = l[s];
                    if (c.data.dedent && !1 !== c.data.dedentIfLineStart) {
                        var u = c.regex.exec(o);
                        if (u && u[0]) {
                            i--, (c.next || c.push) && (l = t[c.next || c.push]), o = o.slice(u[0].length);
                            continue e
                        }
                    }
                }
                break
            }
            return i < 0 ? 0 : r.indent[i]
        }
    }

    e.defineSimpleMode = function (t, n) {
        e.defineMode(t, function (t) {
            return e.simpleMode(t, n)
        })
    }, e.simpleMode = function (n, r) {
        t(r, "start");
        var i = {}, l = r.meta || {}, d = !1;
        for (var c in r) if (c != l && r.hasOwnProperty(c)) for (var u = i[c] = [], f = r[c], m = 0; m < f.length; m++) {
            var p = f[m];
            u.push(new o(p, r)), (p.indent || p.dedent) && (d = !0)
        }
        var g = {
            startState: function () {
                return {state: "start", pending: null, local: null, localState: null, indent: d ? [] : null}
            }, copyState: function (t) {
                var n = {
                    state: t.state,
                    pending: t.pending,
                    local: t.local,
                    localState: null,
                    indent: t.indent && t.indent.slice(0)
                };
                t.localState && (n.localState = e.copyState(t.local.mode, t.localState)), t.stack && (n.stack = t.stack.slice(0));
                for (var r = t.persistentStates; r; r = r.next) n.persistentStates = {
                    mode: r.mode,
                    spec: r.spec,
                    state: r.state == t.localState ? n.localState : e.copyState(r.mode, r.state),
                    next: n.persistentStates
                };
                return n
            }, token: a(i, n), innerMode: function (e) {
                return e.local && {mode: e.local.mode, state: e.localState}
            }, indent: s(i, l)
        };
        if (l) for (var h in l) l.hasOwnProperty(h) && (g[h] = l[h]);
        return g
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/mode/multiplex", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.multiplexingMode = function (t) {
        function n(e, t, n, r) {
            if ("string" == typeof t) {
                var o = e.indexOf(t, n);
                return r && o > -1 ? o + t.length : o
            }
            var a = t.exec(n ? e.slice(n) : e);
            return a ? a.index + n + (r ? a[0].length : 0) : -1
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
            }, token: function (o, a) {
                if (a.innerActive) {
                    var i = a.innerActive, l = o.string;
                    if (!i.close && o.sol()) return a.innerActive = a.inner = null, this.token(o, a);
                    var d = i.close ? n(l, i.close, o.pos, i.parseDelimiters) : -1;
                    if (d == o.pos && !i.parseDelimiters) return o.match(i.close), a.innerActive = a.inner = null, i.delimStyle && i.delimStyle + " " + i.delimStyle + "-close";
                    d > -1 && (o.string = l.slice(0, d));
                    var s = i.mode.token(o, a.inner);
                    return d > -1 && (o.string = l), d == o.pos && i.parseDelimiters && (a.innerActive = a.inner = null), i.innerStyle && (s = s ? s + " " + i.innerStyle : i.innerStyle), s
                }
                for (var c = 1 / 0, l = o.string, u = 0; u < r.length; ++u) {
                    var f = r[u], d = n(l, f.open, o.pos);
                    if (d == o.pos) {
                        f.parseDelimiters || o.match(f.open), a.innerActive = f;
                        var m = 0;
                        if (t.indent) {
                            var p = t.indent(a.outer, "", "");
                            p !== e.Pass && (m = p)
                        }
                        return a.inner = e.startState(f.mode, m), f.delimStyle && f.delimStyle + " " + f.delimStyle + "-open"
                    }
                    -1 != d && d < c && (c = d)
                }
                c != 1 / 0 && (o.string = l.slice(0, c));
                var g = t.token(o, a.outer);
                return c != 1 / 0 && (o.string = l), g
            }, indent: function (n, r, o) {
                var a = n.innerActive ? n.innerActive.mode : t;
                return a.indent ? a.indent(n.innerActive ? n.inner : n.outer, r, o) : e.Pass
            }, blankLine: function (n) {
                var o = n.innerActive ? n.innerActive.mode : t;
                if (o.blankLine && o.blankLine(n.innerActive ? n.inner : n.outer), n.innerActive) "\n" === n.innerActive.close && (n.innerActive = n.inner = null); else for (var a = 0; a < r.length; ++a) {
                    var i = r[a];
                    "\n" === i.open && (n.innerActive = i, n.inner = e.startState(i.mode, o.indent ? o.indent(n.outer, "", "") : 0))
                }
            }, electricChars: t.electricChars, innerMode: function (e) {
                return e.inner ? {state: e.inner, mode: e.innerActive.mode} : {state: e.outer, mode: t}
            }
        }
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../../addon/mode/simple"), require("../../addon/mode/multiplex")) : "function" == typeof define && define.amd ? define("mode/handlebars/handlebars.js", ["../../lib/codemirror", "../../addon/mode/simple", "../../addon/mode/multiplex"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineSimpleMode("handlebars-tags", {
        start: [{
            regex: /\{\{\{/,
            push: "handlebars_raw",
            token: "tag"
        }, {regex: /\{\{!--/, push: "dash_comment", token: "comment"}, {
            regex: /\{\{!/,
            push: "comment",
            token: "comment"
        }, {regex: /\{\{/, push: "handlebars", token: "tag"}],
        handlebars_raw: [{regex: /\}\}\}/, pop: !0, token: "tag"}],
        handlebars: [{regex: /\}\}/, pop: !0, token: "tag"}, {
            regex: /"(?:[^\\"]|\\.)*"?/,
            token: "string"
        }, {regex: /'(?:[^\\']|\\.)*'?/, token: "string"}, {
            regex: />|[#\/]([A-Za-z_]\w*)/,
            token: "keyword"
        }, {regex: /(?:else|this)\b/, token: "keyword"}, {regex: /\d+/i, token: "number"}, {
            regex: /=|~|@|true|false/,
            token: "atom"
        }, {regex: /(?:\.\.\/)*(?:[A-Za-z_][\w\.]*)+/, token: "variable-2"}],
        dash_comment: [{regex: /--\}\}/, pop: !0, token: "comment"}, {regex: /./, token: "comment"}],
        comment: [{regex: /\}\}/, pop: !0, token: "comment"}, {regex: /./, token: "comment"}],
        meta: {blockCommentStart: "{{--", blockCommentEnd: "--}}"}
    }), e.defineMode("handlebars", function (t, n) {
        var r = e.getMode(t, "handlebars-tags");
        return n && n.base ? e.multiplexingMode(e.getMode(t, n.base), {
            open: "{{",
            close: /\}\}\}?/,
            mode: r,
            parseDelimiters: !0
        }) : r
    }), e.defineMIME("text/x-handlebars-template", "handlebars")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("mode/xml/xml.js", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    var t = {
        autoSelfClosers: {
            area: !0,
            base: !0,
            br: !0,
            col: !0,
            command: !0,
            embed: !0,
            frame: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0,
            menuitem: !0
        },
        implicitlyClosed: {
            dd: !0,
            li: !0,
            optgroup: !0,
            option: !0,
            p: !0,
            rp: !0,
            rt: !0,
            tbody: !0,
            td: !0,
            tfoot: !0,
            th: !0,
            tr: !0
        },
        contextGrabbers: {
            dd: {dd: !0, dt: !0},
            dt: {dd: !0, dt: !0},
            li: {li: !0},
            option: {option: !0, optgroup: !0},
            optgroup: {optgroup: !0},
            p: {
                address: !0,
                article: !0,
                aside: !0,
                blockquote: !0,
                dir: !0,
                div: !0,
                dl: !0,
                fieldset: !0,
                footer: !0,
                form: !0,
                h1: !0,
                h2: !0,
                h3: !0,
                h4: !0,
                h5: !0,
                h6: !0,
                header: !0,
                hgroup: !0,
                hr: !0,
                menu: !0,
                nav: !0,
                ol: !0,
                p: !0,
                pre: !0,
                section: !0,
                table: !0,
                ul: !0
            },
            rp: {rp: !0, rt: !0},
            rt: {rp: !0, rt: !0},
            tbody: {tbody: !0, tfoot: !0},
            td: {td: !0, th: !0},
            tfoot: {tbody: !0},
            th: {td: !0, th: !0},
            thead: {tbody: !0, tfoot: !0},
            tr: {tr: !0}
        },
        doNotIndent: {pre: !0},
        allowUnquoted: !0,
        allowMissing: !0,
        caseFold: !0
    }, n = {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: !1,
        allowMissing: !1,
        allowMissingTagName: !1,
        caseFold: !1
    };
    e.defineMode("xml", function (r, o) {
        function a(e, t) {
            function n(n) {
                return t.tokenize = n, n(e, t)
            }

            var r = e.next();
            if ("<" == r) return e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? n(d("atom", "]]>")) : null : e.match("--") ? n(d("comment", "--\x3e")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(s(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = d("meta", "?>"), "meta") : (C = e.eat("/") ? "closeTag" : "openTag", t.tokenize = i, "tag bracket");
            if ("&" == r) {
                var o;
                return o = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), o ? "atom" : "error"
            }
            return e.eatWhile(/[^&<]/), null
        }

        function i(e, t) {
            var n = e.next();
            if (">" == n || "/" == n && e.eat(">")) return t.tokenize = a, C = ">" == n ? "endTag" : "selfcloseTag", "tag bracket";
            if ("=" == n) return C = "equals", null;
            if ("<" == n) {
                t.tokenize = a, t.state = m, t.tagName = t.tagStart = null;
                var r = t.tokenize(e, t);
                return r ? r + " tag error" : "tag error"
            }
            return /[\'\"]/.test(n) ? (t.tokenize = l(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
        }

        function l(e) {
            var t = function (t, n) {
                for (; !t.eol();) if (t.next() == e) {
                    n.tokenize = i;
                    break
                }
                return "string"
            };
            return t.isInAttribute = !0, t
        }

        function d(e, t) {
            return function (n, r) {
                for (; !n.eol();) {
                    if (n.match(t)) {
                        r.tokenize = a;
                        break
                    }
                    n.next()
                }
                return e
            }
        }

        function s(e) {
            return function (t, n) {
                for (var r; null != (r = t.next());) {
                    if ("<" == r) return n.tokenize = s(e + 1), n.tokenize(t, n);
                    if (">" == r) {
                        if (1 == e) {
                            n.tokenize = a;
                            break
                        }
                        return n.tokenize = s(e - 1), n.tokenize(t, n)
                    }
                }
                return "meta"
            }
        }

        function c(e, t, n) {
            this.prev = e.context, this.tagName = t || "", this.indent = e.indented, this.startOfLine = n, (w.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
        }

        function u(e) {
            e.context && (e.context = e.context.prev)
        }

        function f(e, t) {
            for (var n; ;) {
                if (!e.context) return;
                if (n = e.context.tagName, !w.contextGrabbers.hasOwnProperty(n) || !w.contextGrabbers[n].hasOwnProperty(t)) return;
                u(e)
            }
        }

        function m(e, t, n) {
            return "openTag" == e ? (n.tagStart = t.column(), p) : "closeTag" == e ? g : m
        }

        function p(e, t, n) {
            return "word" == e ? (n.tagName = t.current(), T = "tag", v) : w.allowMissingTagName && "endTag" == e ? (T = "tag bracket", v(e, t, n)) : (T = "error", p)
        }

        function g(e, t, n) {
            if ("word" == e) {
                var r = t.current();
                return n.context && n.context.tagName != r && w.implicitlyClosed.hasOwnProperty(n.context.tagName) && u(n), n.context && n.context.tagName == r || !1 === w.matchClosing ? (T = "tag", h) : (T = "tag error", x)
            }
            return w.allowMissingTagName && "endTag" == e ? (T = "tag bracket", h(e, t, n)) : (T = "error", x)
        }

        function h(e, t, n) {
            return "endTag" != e ? (T = "error", h) : (u(n), m)
        }

        function x(e, t, n) {
            return T = "error", h(e, t, n)
        }

        function v(e, t, n) {
            if ("word" == e) return T = "attribute", k;
            if ("endTag" == e || "selfcloseTag" == e) {
                var r = n.tagName, o = n.tagStart;
                return n.tagName = n.tagStart = null, "selfcloseTag" == e || w.autoSelfClosers.hasOwnProperty(r) ? f(n, r) : (f(n, r), n.context = new c(n, r, o == n.indented)), m
            }
            return T = "error", v
        }

        function k(e, t, n) {
            return "equals" == e ? b : (w.allowMissing || (T = "error"), v(e, t, n))
        }

        function b(e, t, n) {
            return "string" == e ? y : "word" == e && w.allowUnquoted ? (T = "string", v) : (T = "error", v(e, t, n))
        }

        function y(e, t, n) {
            return "string" == e ? y : v(e, t, n)
        }

        var S = r.indentUnit, w = {}, M = o.htmlMode ? t : n;
        for (var A in M) w[A] = M[A];
        for (var A in o) w[A] = o[A];
        var C, T;
        return a.isInText = !0, {
            startState: function (e) {
                var t = {tokenize: a, state: m, indented: e || 0, tagName: null, tagStart: null, context: null};
                return null != e && (t.baseIndent = e), t
            },
            token: function (e, t) {
                if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
                C = null;
                var n = t.tokenize(e, t);
                return (n || C) && "comment" != n && (T = null, t.state = t.state(C || n, e, t), T && (n = "error" == T ? n + " error" : T)), n
            },
            indent: function (t, n, r) {
                var o = t.context;
                if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + S;
                if (o && o.noIndent) return e.Pass;
                if (t.tokenize != i && t.tokenize != a) return r ? r.match(/^(\s*)/)[0].length : 0;
                if (t.tagName) return !1 !== w.multilineTagIndentPastTag ? t.tagStart + t.tagName.length + 2 : t.tagStart + S * (w.multilineTagIndentFactor || 1);
                if (w.alignCDATA && /<!\[CDATA\[/.test(n)) return 0;
                var l = n && /^<(\/)?([\w_:\.-]*)/.exec(n);
                if (l && l[1]) for (; o;) {
                    if (o.tagName == l[2]) {
                        o = o.prev;
                        break
                    }
                    if (!w.implicitlyClosed.hasOwnProperty(o.tagName)) break;
                    o = o.prev
                } else if (l) for (; o;) {
                    var d = w.contextGrabbers[o.tagName];
                    if (!d || !d.hasOwnProperty(l[2])) break;
                    o = o.prev
                }
                for (; o && o.prev && !o.startOfLine;) o = o.prev;
                return o ? o.indent + S : t.baseIndent || 0
            },
            electricInput: /<\/[\s\w:]+>$/,
            blockCommentStart: "\x3c!--",
            blockCommentEnd: "--\x3e",
            configuration: w.htmlMode ? "html" : "xml",
            helperType: w.htmlMode ? "html" : "xml",
            skipAttribute: function (e) {
                e.state == b && (e.state = v)
            },
            xmlCurrentTag: function (e) {
                return e.tagName ? {name: e.tagName, close: "closeTag" == e.type} : null
            },
            xmlCurrentContext: function (e) {
                for (var t = [], n = e.context; n; n = n.prev) t.push(n.tagName);
                return t.reverse()
            }
        }
    }), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
        name: "xml",
        htmlMode: !0
    })
}), function (e) {
    "function" == typeof e.define && e.define("modeHandlebars", ["mode/handlebars/handlebars.js"], function () {
    })
}(this);