!function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("mode/xml/xml", ["../../lib/codemirror"], e) : e(CodeMirror)
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
    }, r = {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: !1,
        allowMissing: !1,
        allowMissingTagName: !1,
        caseFold: !1
    };
    e.defineMode("xml", function (n, o) {
        function i(e, t) {
            function r(r) {
                return t.tokenize = r, r(e, t)
            }
            var n = e.next();
            if ("<" == n) return e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? r(s("atom", "]]>")) : null : e.match("--") ? r(s("comment", "--\x3e")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), r(c(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = s("meta", "?>"), "meta") : (S = e.eat("/") ? "closeTag" : "openTag", t.tokenize = a, "tag bracket");
            if ("&" == n) {
                var o;
                return o = e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";"), o ? "atom" : "error"
            }
            return e.eatWhile(/[^&<]/), null
        }

        function a(e, t) {
            var r = e.next();
            if (">" == r || "/" == r && e.eat(">")) return t.tokenize = i, S = ">" == r ? "endTag" : "selfcloseTag", "tag bracket";
            if ("=" == r) return S = "equals", null;
            if ("<" == r) {
                t.tokenize = i, t.state = m, t.tagName = t.tagStart = null;
                var n = t.tokenize(e, t);
                return n ? n + " tag error" : "tag error"
            }
            return /[\'\"]/.test(r) ? (t.tokenize = l(r), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word")
        }

        function l(e) {
            var t = function (t, r) {
                for (; !t.eol();) if (t.next() == e) {
                    r.tokenize = a;
                    break
                }
                return "string"
            };
            return t.isInAttribute = !0, t
        }

        function s(e, t) {
            return function (r, n) {
                for (; !r.eol();) {
                    if (r.match(t)) {
                        n.tokenize = i;
                        break
                    }
                    r.next()
                }
                return e
            }
        }

        function c(e) {
            return function (t, r) {
                for (var n; null != (n = t.next());) {
                    if ("<" == n) return r.tokenize = c(e + 1), r.tokenize(t, r);
                    if (">" == n) {
                        if (1 == e) {
                            r.tokenize = i;
                            break
                        }
                        return r.tokenize = c(e - 1), r.tokenize(t, r)
                    }
                }
                return "meta"
            }
        }

        function d(e, t, r) {
            this.prev = e.context, this.tagName = t || "", this.indent = e.indented, this.startOfLine = r, (z.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0)
        }

        function u(e) {
            e.context && (e.context = e.context.prev)
        }

        function p(e, t) {
            for (var r; ;) {
                if (!e.context) return;
                if (r = e.context.tagName, !z.contextGrabbers.hasOwnProperty(r) || !z.contextGrabbers[r].hasOwnProperty(t)) return;
                u(e)
            }
        }

        function m(e, t, r) {
            return "openTag" == e ? (r.tagStart = t.column(), f) : "closeTag" == e ? g : m
        }

        function f(e, t, r) {
            return "word" == e ? (r.tagName = t.current(), T = "tag", k) : z.allowMissingTagName && "endTag" == e ? (T = "tag bracket", k(e, t, r)) : (T = "error", f)
        }

        function g(e, t, r) {
            if ("word" == e) {
                var n = t.current();
                return r.context && r.context.tagName != n && z.implicitlyClosed.hasOwnProperty(r.context.tagName) && u(r), r.context && r.context.tagName == n || !1 === z.matchClosing ? (T = "tag", h) : (T = "tag error", b)
            }
            return z.allowMissingTagName && "endTag" == e ? (T = "tag bracket", h(e, t, r)) : (T = "error", b)
        }

        function h(e, t, r) {
            return "endTag" != e ? (T = "error", h) : (u(r), m)
        }

        function b(e, t, r) {
            return T = "error", h(e, t, r)
        }

        function k(e, t, r) {
            if ("word" == e) return T = "attribute", y;
            if ("endTag" == e || "selfcloseTag" == e) {
                var n = r.tagName, o = r.tagStart;
                return r.tagName = r.tagStart = null, "selfcloseTag" == e || z.autoSelfClosers.hasOwnProperty(n) ? p(r, n) : (p(r, n), r.context = new d(r, n, o == r.indented)), m
            }
            return T = "error", k
        }

        function y(e, t, r) {
            return "equals" == e ? v : (z.allowMissing || (T = "error"), k(e, t, r))
        }

        function v(e, t, r) {
            return "string" == e ? w : "word" == e && z.allowUnquoted ? (T = "string", k) : (T = "error", k(e, t, r))
        }

        function w(e, t, r) {
            return "string" == e ? w : k(e, t, r)
        }

        var x = n.indentUnit, z = {}, M = o.htmlMode ? t : r;
        for (var j in M) z[j] = M[j];
        for (var j in o) z[j] = o[j];
        var S, T;
        return i.isInText = !0, {
            startState: function (e) {
                var t = {tokenize: i, state: m, indented: e || 0, tagName: null, tagStart: null, context: null};
                return null != e && (t.baseIndent = e), t
            },
            token: function (e, t) {
                if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
                S = null;
                var r = t.tokenize(e, t);
                return (r || S) && "comment" != r && (T = null, t.state = t.state(S || r, e, t), T && (r = "error" == T ? r + " error" : T)), r
            },
            indent: function (t, r, n) {
                var o = t.context;
                if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + x;
                if (o && o.noIndent) return e.Pass;
                if (t.tokenize != a && t.tokenize != i) return n ? n.match(/^(\s*)/)[0].length : 0;
                if (t.tagName) return !1 !== z.multilineTagIndentPastTag ? t.tagStart + t.tagName.length + 2 : t.tagStart + x * (z.multilineTagIndentFactor || 1);
                if (z.alignCDATA && /<!\[CDATA\[/.test(r)) return 0;
                var l = r && /^<(\/)?([\w_:\.-]*)/.exec(r);
                if (l && l[1]) for (; o;) {
                    if (o.tagName == l[2]) {
                        o = o.prev;
                        break
                    }
                    if (!z.implicitlyClosed.hasOwnProperty(o.tagName)) break;
                    o = o.prev
                } else if (l) for (; o;) {
                    var s = z.contextGrabbers[o.tagName];
                    if (!s || !s.hasOwnProperty(l[2])) break;
                    o = o.prev
                }
                for (; o && o.prev && !o.startOfLine;) o = o.prev;
                return o ? o.indent + x : t.baseIndent || 0
            },
            electricInput: /<\/[\s\w:]+>$/,
            blockCommentStart: "\x3c!--",
            blockCommentEnd: "--\x3e",
            configuration: z.htmlMode ? "html" : "xml",
            helperType: z.htmlMode ? "html" : "xml",
            skipAttribute: function (e) {
                e.state == v && (e.state = k)
            },
            xmlCurrentTag: function (e) {
                return e.tagName ? {name: e.tagName, close: "closeTag" == e.type} : null
            },
            xmlCurrentContext: function (e) {
                for (var t = [], r = e.context; r; r = r.prev) t.push(r.tagName);
                return t.reverse()
            }
        }
    }), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
        name: "xml",
        htmlMode: !0
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("mode/javascript/javascript", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineMode("javascript", function (t, r) {
        function n(e) {
            for (var t, r = !1, n = !1; null != (t = e.next());) {
                if (!r) {
                    if ("/" == t && !n) return;
                    "[" == t ? n = !0 : n && "]" == t && (n = !1)
                }
                r = !r && "\\" == t
            }
        }

        function o(e, t, r) {
            return We = e, Le = r, t
        }

        function i(e, t) {
            var r = e.next();
            if ('"' == r || "'" == r) return t.tokenize = a(r), t.tokenize(e, t);
            if ("." == r && e.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return o("number", "number");
            if ("." == r && e.match("..")) return o("spread", "meta");
            if (/[\[\]{}\(\),;\:\.]/.test(r)) return o(r);
            if ("=" == r && e.eat(">")) return o("=>", "operator");
            if ("0" == r && e.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return o("number", "number");
            if (/\d/.test(r)) return e.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), o("number", "number");
            if ("/" == r) return e.eat("*") ? (t.tokenize = l, l(e, t)) : e.eat("/") ? (e.skipToEnd(), o("comment", "comment")) : Be(e, t, 1) ? (n(e), e.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/), o("regexp", "string-2")) : (e.eat("="), o("operator", "operator", e.current()));
            if ("`" == r) return t.tokenize = s, s(e, t);
            if ("#" == r && "!" == e.peek()) return e.skipToEnd(), o("meta", "meta");
            if ("#" == r && e.eatWhile(Ye)) return o("variable", "property");
            if ("<" == r && e.match("!--") || "-" == r && e.match("->") && !/\S/.test(e.string.slice(0, e.start))) return e.skipToEnd(), o("comment", "comment");
            if (Xe.test(r)) return ">" == r && t.lexical && ">" == t.lexical.type || (e.eat("=") ? "!" != r && "=" != r || e.eat("=") : /[<>*+\-|&?]/.test(r) && (e.eat(r), ">" == r && e.eat(r))), "?" == r && e.eat(".") ? o(".") : o("operator", "operator", e.current());
            if (Ye.test(r)) {
                e.eatWhile(Ye);
                var i = e.current();
                if ("." != t.lastType) {
                    if (Re.propertyIsEnumerable(i)) {
                        var c = Re[i];
                        return o(c.type, c.style, i)
                    }
                    if ("async" == i && e.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, !1)) return o("async", "keyword", i)
                }
                return o("variable", "variable", i)
            }
        }

        function a(e) {
            return function (t, r) {
                var n, a = !1;
                if (Ue && "@" == t.peek() && t.match(Ze)) return r.tokenize = i, o("jsonld-keyword", "meta");
                for (; null != (n = t.next()) && (n != e || a);) a = !a && "\\" == n;
                return a || (r.tokenize = i), o("string", "string")
            }
        }

        function l(e, t) {
            for (var r, n = !1; r = e.next();) {
                if ("/" == r && n) {
                    t.tokenize = i;
                    break
                }
                n = "*" == r
            }
            return o("comment", "comment")
        }

        function s(e, t) {
            for (var r, n = !1; null != (r = e.next());) {
                if (!n && ("`" == r || "$" == r && e.eat("{"))) {
                    t.tokenize = i;
                    break
                }
                n = !n && "\\" == r
            }
            return o("quasi", "string-2", e.current())
        }

        function c(e, t) {
            t.fatArrowAt && (t.fatArrowAt = null);
            var r = e.string.indexOf("=>", e.start);
            if (!(r < 0)) {
                if (Ge) {
                    var n = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(e.string.slice(e.start, r));
                    n && (r = n.index)
                }
                for (var o = 0, i = !1, a = r - 1; a >= 0; --a) {
                    var l = e.string.charAt(a), s = Je.indexOf(l);
                    if (s >= 0 && s < 3) {
                        if (!o) {
                            ++a;
                            break
                        }
                        if (0 == --o) {
                            "(" == l && (i = !0);
                            break
                        }
                    } else if (s >= 3 && s < 6) ++o; else if (Ye.test(l)) i = !0; else if (/["'\/`]/.test(l)) for (; ; --a) {
                        if (0 == a) return;
                        var c = e.string.charAt(a - 1);
                        if (c == l && "\\" != e.string.charAt(a - 2)) {
                            a--;
                            break
                        }
                    } else if (i && !o) {
                        ++a;
                        break
                    }
                }
                i && !o && (t.fatArrowAt = a)
            }
        }

        function d(e, t, r, n, o, i) {
            this.indented = e, this.column = t, this.type = r, this.prev = o, this.info = i, null != n && (this.align = n)
        }

        function u(e, t) {
            for (var r = e.localVars; r; r = r.next) if (r.name == t) return !0;
            for (var n = e.context; n; n = n.prev) for (var r = n.vars; r; r = r.next) if (r.name == t) return !0
        }

        function p(e, t, r, n, o) {
            var i = e.cc;
            for (et.state = e, et.stream = o, et.marked = null, et.cc = i, et.style = t, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0); ;) {
                if ((i.length ? i.pop() : He ? C : T)(r, n)) {
                    for (; i.length && i[i.length - 1].lex;) i.pop()();
                    return et.marked ? et.marked : "variable" == r && u(e, n) ? "variable-2" : t
                }
            }
        }

        function m() {
            for (var e = arguments.length - 1; e >= 0; e--) et.cc.push(arguments[e])
        }

        function f() {
            return m.apply(null, arguments), !0
        }

        function g(e, t) {
            for (var r = t; r; r = r.next) if (r.name == e) return !0;
            return !1
        }

        function h(e) {
            var t = et.state;
            if (et.marked = "def", t.context) if ("var" == t.lexical.info && t.context && t.context.block) {
                var n = b(e, t.context);
                if (null != n) return void (t.context = n)
            } else if (!g(e, t.localVars)) return void (t.localVars = new v(e, t.localVars));
            r.globalVars && !g(e, t.globalVars) && (t.globalVars = new v(e, t.globalVars))
        }

        function b(e, t) {
            if (t) {
                if (t.block) {
                    var r = b(e, t.prev);
                    return r ? r == t.prev ? t : new y(r, t.vars, !0) : null
                }
                return g(e, t.vars) ? t : new y(t.prev, new v(e, t.vars), !1)
            }
            return null
        }

        function k(e) {
            return "public" == e || "private" == e || "protected" == e || "abstract" == e || "readonly" == e
        }

        function y(e, t, r) {
            this.prev = e, this.vars = t, this.block = r
        }

        function v(e, t) {
            this.name = e, this.next = t
        }

        function w() {
            et.state.context = new y(et.state.context, et.state.localVars, !1), et.state.localVars = tt
        }

        function x() {
            et.state.context = new y(et.state.context, et.state.localVars, !0), et.state.localVars = null
        }

        function z() {
            et.state.localVars = et.state.context.vars, et.state.context = et.state.context.prev
        }

        function M(e, t) {
            var r = function () {
                var r = et.state, n = r.indented;
                if ("stat" == r.lexical.type) n = r.lexical.indented; else for (var o = r.lexical; o && ")" == o.type && o.align; o = o.prev) n = o.indented;
                r.lexical = new d(n, et.stream.column(), e, null, r.lexical, t)
            };
            return r.lex = !0, r
        }

        function j() {
            var e = et.state;
            e.lexical.prev && (")" == e.lexical.type && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
        }

        function S(e) {
            function t(r) {
                return r == e ? f() : ";" == e || "}" == r || ")" == r || "]" == r ? m() : f(t)
            }

            return t
        }

        function T(e, t) {
            return "var" == e ? f(M("vardef", t), de, S(";"), j) : "keyword a" == e ? f(M("form"), q, T, j) : "keyword b" == e ? f(M("form"), T, j) : "keyword d" == e ? et.stream.match(/^\s*$/, !1) ? f() : f(M("stat"), E, S(";"), j) : "debugger" == e ? f(S(";")) : "{" == e ? f(M("}"), x, X, j, z) : ";" == e ? f() : "if" == e ? ("else" == et.state.lexical.info && et.state.cc[et.state.cc.length - 1] == j && et.state.cc.pop()(), f(M("form"), q, T, j, he)) : "function" == e ? f(ve) : "for" == e ? f(M("form"), be, T, j) : "class" == e || Ge && "interface" == t ? (et.marked = "keyword", f(M("form", "class" == e ? e : t), je, j)) : "variable" == e ? Ge && "declare" == t ? (et.marked = "keyword", f(T)) : Ge && ("module" == t || "enum" == t || "type" == t) && et.stream.match(/^\s*\w/, !1) ? (et.marked = "keyword", "enum" == t ? f(Ke) : "type" == t ? f(xe, S("operator"), te, S(";")) : f(M("form"), ue, S("{"), M("}"), X, j, j)) : Ge && "namespace" == t ? (et.marked = "keyword", f(M("form"), C, T, j)) : Ge && "abstract" == t ? (et.marked = "keyword", f(T)) : f(M("stat"), F) : "switch" == e ? f(M("form"), q, S("{"), M("}", "switch"), x, X, j, j, z) : "case" == e ? f(C, S(":")) : "default" == e ? f(S(":")) : "catch" == e ? f(M("form"), w, A, T, j, z) : "export" == e ? f(M("stat"), Ce, j) : "import" == e ? f(M("stat"), qe, j) : "async" == e ? f(T) : "@" == t ? f(C, T) : m(M("stat"), C, S(";"), j)
        }

        function A(e) {
            if ("(" == e) return f(ze, S(")"))
        }

        function C(e, t) {
            return I(e, t, !1)
        }

        function P(e, t) {
            return I(e, t, !0)
        }

        function q(e) {
            return "(" != e ? m() : f(M(")"), E, S(")"), j)
        }

        function I(e, t, r) {
            if (et.state.fatArrowAt == et.stream.start) {
                var n = r ? V : $;
                if ("(" == e) return f(w, M(")"), Y(ze, ")"), j, S("=>"), n, z);
                if ("variable" == e) return m(w, ue, S("=>"), n, z)
            }
            var o = r ? O : N;
            return Qe.hasOwnProperty(e) ? f(o) : "function" == e ? f(ve, o) : "class" == e || Ge && "interface" == t ? (et.marked = "keyword", f(M("form"), Me, j)) : "keyword c" == e || "async" == e ? f(r ? P : C) : "(" == e ? f(M(")"), E, S(")"), j, o) : "operator" == e || "spread" == e ? f(r ? P : C) : "[" == e ? f(M("]"), _e, j, o) : "{" == e ? R(U, "}", null, o) : "quasi" == e ? m(_, o) : "new" == e ? f(B(r)) : "import" == e ? f(C) : f()
        }

        function E(e) {
            return e.match(/[;\}\)\],]/) ? m() : m(C)
        }

        function N(e, t) {
            return "," == e ? f(E) : O(e, t, !1)
        }

        function O(e, t, r) {
            var n = 0 == r ? N : O, o = 0 == r ? C : P;
            return "=>" == e ? f(w, r ? V : $, z) : "operator" == e ? /\+\+|--/.test(t) || Ge && "!" == t ? f(n) : Ge && "<" == t && et.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, !1) ? f(M(">"), Y(te, ">"), j, n) : "?" == t ? f(C, S(":"), o) : f(o) : "quasi" == e ? m(_, n) : ";" != e ? "(" == e ? R(P, ")", "call", n) : "." == e ? f(D, n) : "[" == e ? f(M("]"), E, S("]"), j, n) : Ge && "as" == t ? (et.marked = "keyword", f(te, n)) : "regexp" == e ? (et.state.lastType = et.marked = "operator", et.stream.backUp(et.stream.pos - et.stream.start - 1), f(o)) : void 0 : void 0
        }

        function _(e, t) {
            return "quasi" != e ? m() : "${" != t.slice(t.length - 2) ? f(_) : f(C, K)
        }

        function K(e) {
            if ("}" == e) return et.marked = "string-2", et.state.tokenize = s, f(_)
        }

        function $(e) {
            return c(et.stream, et.state), m("{" == e ? T : C)
        }

        function V(e) {
            return c(et.stream, et.state), m("{" == e ? T : P)
        }

        function B(e) {
            return function (t) {
                return "." == t ? f(e ? L : W) : "variable" == t && Ge ? f(le, e ? O : N) : m(e ? P : C)
            }
        }

        function W(e, t) {
            if ("target" == t) return et.marked = "keyword", f(N)
        }

        function L(e, t) {
            if ("target" == t) return et.marked = "keyword", f(O)
        }

        function F(e) {
            return ":" == e ? f(j, T) : m(N, S(";"), j)
        }

        function D(e) {
            if ("variable" == e) return et.marked = "property", f()
        }

        function U(e, t) {
            if ("async" == e) return et.marked = "property", f(U);
            if ("variable" == e || "keyword" == et.style) {
                if (et.marked = "property", "get" == t || "set" == t) return f(H);
                var r;
                return Ge && et.state.fatArrowAt == et.stream.start && (r = et.stream.match(/^\s*:\s*/, !1)) && (et.state.fatArrowAt = et.stream.pos + r[0].length), f(G)
            }
            return "number" == e || "string" == e ? (et.marked = Ue ? "property" : et.style + " property", f(G)) : "jsonld-keyword" == e ? f(G) : Ge && k(t) ? (et.marked = "keyword", f(U)) : "[" == e ? f(C, Z, S("]"), G) : "spread" == e ? f(P, G) : "*" == t ? (et.marked = "keyword", f(U)) : ":" == e ? m(G) : void 0
        }

        function H(e) {
            return "variable" != e ? m(G) : (et.marked = "property", f(ve))
        }

        function G(e) {
            return ":" == e ? f(P) : "(" == e ? m(ve) : void 0
        }

        function Y(e, t, r) {
            function n(o, i) {
                if (r ? r.indexOf(o) > -1 : "," == o) {
                    var a = et.state.lexical;
                    return "call" == a.info && (a.pos = (a.pos || 0) + 1), f(function (r, n) {
                        return r == t || n == t ? m() : m(e)
                    }, n)
                }
                return o == t || i == t ? f() : r && r.indexOf(";") > -1 ? m(e) : f(S(t))
            }

            return function (r, o) {
                return r == t || o == t ? f() : m(e, n)
            }
        }

        function R(e, t, r) {
            for (var n = 3; n < arguments.length; n++) et.cc.push(arguments[n]);
            return f(M(t, r), Y(e, t), j)
        }

        function X(e) {
            return "}" == e ? f() : m(T, X)
        }

        function Z(e, t) {
            if (Ge) {
                if (":" == e) return f(te);
                if ("?" == t) return f(Z)
            }
        }

        function J(e, t) {
            if (Ge && (":" == e || "in" == t)) return f(te)
        }

        function Q(e) {
            if (Ge && ":" == e) return et.stream.match(/^\s*\w+\s+is\b/, !1) ? f(C, ee, te) : f(te)
        }

        function ee(e, t) {
            if ("is" == t) return et.marked = "keyword", f()
        }

        function te(e, t) {
            return "keyof" == t || "typeof" == t || "infer" == t ? (et.marked = "keyword", f("typeof" == t ? P : te)) : "variable" == e || "void" == t ? (et.marked = "type", f(ae)) : "|" == t || "&" == t ? f(te) : "string" == e || "number" == e || "atom" == e ? f(ae) : "[" == e ? f(M("]"), Y(te, "]", ","), j, ae) : "{" == e ? f(M("}"), ne, j, ae) : "(" == e ? f(Y(ie, ")"), re, ae) : "<" == e ? f(Y(te, ">"), te) : void 0
        }

        function re(e) {
            if ("=>" == e) return f(te)
        }

        function ne(e) {
            return "}" == e ? f() : "," == e || ";" == e ? f(ne) : m(oe, ne)
        }

        function oe(e, t) {
            return "variable" == e || "keyword" == et.style ? (et.marked = "property", f(oe)) : "?" == t || "number" == e || "string" == e ? f(oe) : ":" == e ? f(te) : "[" == e ? f(S("variable"), J, S("]"), oe) : "(" == e ? m(we, oe) : e.match(/[;\}\)\],]/) ? void 0 : f()
        }

        function ie(e, t) {
            return "variable" == e && et.stream.match(/^\s*[?:]/, !1) || "?" == t ? f(ie) : ":" == e ? f(te) : "spread" == e ? f(ie) : m(te)
        }

        function ae(e, t) {
            return "<" == t ? f(M(">"), Y(te, ">"), j, ae) : "|" == t || "." == e || "&" == t ? f(te) : "[" == e ? f(te, S("]"), ae) : "extends" == t || "implements" == t ? (et.marked = "keyword", f(te)) : "?" == t ? f(te, S(":"), te) : void 0
        }

        function le(e, t) {
            if ("<" == t) return f(M(">"), Y(te, ">"), j, ae)
        }

        function se() {
            return m(te, ce)
        }

        function ce(e, t) {
            if ("=" == t) return f(te)
        }

        function de(e, t) {
            return "enum" == t ? (et.marked = "keyword", f(Ke)) : m(ue, Z, fe, ge)
        }

        function ue(e, t) {
            return Ge && k(t) ? (et.marked = "keyword", f(ue)) : "variable" == e ? (h(t), f()) : "spread" == e ? f(ue) : "[" == e ? R(me, "]") : "{" == e ? R(pe, "}") : void 0
        }

        function pe(e, t) {
            return "variable" != e || et.stream.match(/^\s*:/, !1) ? ("variable" == e && (et.marked = "property"), "spread" == e ? f(ue) : "}" == e ? m() : "[" == e ? f(C, S("]"), S(":"), pe) : f(S(":"), ue, fe)) : (h(t), f(fe))
        }

        function me() {
            return m(ue, fe)
        }

        function fe(e, t) {
            if ("=" == t) return f(P)
        }

        function ge(e) {
            if ("," == e) return f(de)
        }

        function he(e, t) {
            if ("keyword b" == e && "else" == t) return f(M("form", "else"), T, j)
        }

        function be(e, t) {
            return "await" == t ? f(be) : "(" == e ? f(M(")"), ke, j) : void 0
        }

        function ke(e) {
            return "var" == e ? f(de, ye) : "variable" == e ? f(ye) : m(ye)
        }

        function ye(e, t) {
            return ")" == e ? f() : ";" == e ? f(ye) : "in" == t || "of" == t ? (et.marked = "keyword", f(C, ye)) : m(C, ye)
        }

        function ve(e, t) {
            return "*" == t ? (et.marked = "keyword", f(ve)) : "variable" == e ? (h(t), f(ve)) : "(" == e ? f(w, M(")"), Y(ze, ")"), j, Q, T, z) : Ge && "<" == t ? f(M(">"), Y(se, ">"), j, ve) : void 0
        }

        function we(e, t) {
            return "*" == t ? (et.marked = "keyword", f(we)) : "variable" == e ? (h(t), f(we)) : "(" == e ? f(w, M(")"), Y(ze, ")"), j, Q, z) : Ge && "<" == t ? f(M(">"), Y(se, ">"), j, we) : void 0
        }

        function xe(e, t) {
            return "keyword" == e || "variable" == e ? (et.marked = "type", f(xe)) : "<" == t ? f(M(">"), Y(se, ">"), j) : void 0
        }

        function ze(e, t) {
            return "@" == t && f(C, ze), "spread" == e ? f(ze) : Ge && k(t) ? (et.marked = "keyword", f(ze)) : Ge && "this" == e ? f(Z, fe) : m(ue, Z, fe)
        }

        function Me(e, t) {
            return "variable" == e ? je(e, t) : Se(e, t)
        }

        function je(e, t) {
            if ("variable" == e) return h(t), f(Se)
        }

        function Se(e, t) {
            return "<" == t ? f(M(">"), Y(se, ">"), j, Se) : "extends" == t || "implements" == t || Ge && "," == e ? ("implements" == t && (et.marked = "keyword"), f(Ge ? te : C, Se)) : "{" == e ? f(M("}"), Te, j) : void 0
        }

        function Te(e, t) {
            return "async" == e || "variable" == e && ("static" == t || "get" == t || "set" == t || Ge && k(t)) && et.stream.match(/^\s+[\w$\xa1-\uffff]/, !1) ? (et.marked = "keyword", f(Te)) : "variable" == e || "keyword" == et.style ? (et.marked = "property", f(Ae, Te)) : "number" == e || "string" == e ? f(Ae, Te) : "[" == e ? f(C, Z, S("]"), Ae, Te) : "*" == t ? (et.marked = "keyword", f(Te)) : Ge && "(" == e ? m(we, Te) : ";" == e || "," == e ? f(Te) : "}" == e ? f() : "@" == t ? f(C, Te) : void 0
        }

        function Ae(e, t) {
            if ("?" == t) return f(Ae);
            if (":" == e) return f(te, fe);
            if ("=" == t) return f(P);
            var r = et.state.lexical.prev;
            return m(r && "interface" == r.info ? we : ve)
        }

        function Ce(e, t) {
            return "*" == t ? (et.marked = "keyword", f(Oe, S(";"))) : "default" == t ? (et.marked = "keyword", f(C, S(";"))) : "{" == e ? f(Y(Pe, "}"), Oe, S(";")) : m(T)
        }

        function Pe(e, t) {
            return "as" == t ? (et.marked = "keyword", f(S("variable"))) : "variable" == e ? m(P, Pe) : void 0
        }

        function qe(e) {
            return "string" == e ? f() : "(" == e ? m(C) : m(Ie, Ee, Oe)
        }

        function Ie(e, t) {
            return "{" == e ? R(Ie, "}") : ("variable" == e && h(t), "*" == t && (et.marked = "keyword"), f(Ne))
        }

        function Ee(e) {
            if ("," == e) return f(Ie, Ee)
        }

        function Ne(e, t) {
            if ("as" == t) return et.marked = "keyword", f(Ie)
        }

        function Oe(e, t) {
            if ("from" == t) return et.marked = "keyword", f(C)
        }

        function _e(e) {
            return "]" == e ? f() : m(Y(P, "]"))
        }

        function Ke() {
            return m(M("form"), ue, S("{"), M("}"), Y($e, "}"), j, j)
        }

        function $e() {
            return m(ue, fe)
        }

        function Ve(e, t) {
            return "operator" == e.lastType || "," == e.lastType || Xe.test(t.charAt(0)) || /[,.]/.test(t.charAt(0))
        }

        function Be(e, t, r) {
            return t.tokenize == i && /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(t.lastType) || "quasi" == t.lastType && /\{\s*$/.test(e.string.slice(0, e.pos - (r || 0)))
        }

        var We, Le, Fe = t.indentUnit, De = r.statementIndent, Ue = r.jsonld, He = r.json || Ue, Ge = r.typescript,
            Ye = r.wordCharacters || /[\w$\xa1-\uffff]/, Re = function () {
                function e(e) {
                    return {type: e, style: "keyword"}
                }

                var t = e("keyword a"), r = e("keyword b"), n = e("keyword c"), o = e("keyword d"), i = e("operator"),
                    a = {type: "atom", style: "atom"};
                return {
                    if: e("if"),
                    while: t,
                    with: t,
                    else: r,
                    do: r,
                    try: r,
                    finally: r,
                    return: o,
                    break: o,
                    continue: o,
                    new: e("new"),
                    delete: n,
                    void: n,
                    throw: n,
                    debugger: e("debugger"),
                    var: e("var"),
                    const: e("var"),
                    let: e("var"),
                    function: e("function"),
                    catch: e("catch"),
                    for: e("for"),
                    switch: e("switch"),
                    case: e("case"),
                    default: e("default"),
                    in: i,
                    typeof: i,
                    instanceof: i,
                    true: a,
                    false: a,
                    null: a,
                    undefined: a,
                    NaN: a,
                    Infinity: a,
                    this: e("this"),
                    class: e("class"),
                    super: e("atom"),
                    yield: n,
                    export: e("export"),
                    import: e("import"),
                    extends: n,
                    await: n
                }
            }(), Xe = /[+\-*&%=<>!?|~^@]/,
            Ze = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/, Je = "([{}])",
            Qe = {atom: !0, number: !0, variable: !0, string: !0, regexp: !0, this: !0, "jsonld-keyword": !0},
            et = {state: null, column: null, marked: null, cc: null}, tt = new v("this", new v("arguments", null));
        return z.lex = !0, j.lex = !0, {
            startState: function (e) {
                var t = {
                    tokenize: i,
                    lastType: "sof",
                    cc: [],
                    lexical: new d((e || 0) - Fe, 0, "block", !1),
                    localVars: r.localVars,
                    context: r.localVars && new y(null, null, !1),
                    indented: e || 0
                };
                return r.globalVars && "object" == typeof r.globalVars && (t.globalVars = r.globalVars), t
            },
            token: function (e, t) {
                if (e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation(), c(e, t)), t.tokenize != l && e.eatSpace()) return null;
                var r = t.tokenize(e, t);
                return "comment" == We ? r : (t.lastType = "operator" != We || "++" != Le && "--" != Le ? We : "incdec", p(t, r, We, Le, e))
            },
            indent: function (t, n) {
                if (t.tokenize == l || t.tokenize == s) return e.Pass;
                if (t.tokenize != i) return 0;
                var o, a = n && n.charAt(0), c = t.lexical;
                if (!/^\s*else\b/.test(n)) for (var d = t.cc.length - 1; d >= 0; --d) {
                    var u = t.cc[d];
                    if (u == j) c = c.prev; else if (u != he) break
                }
                for (; ("stat" == c.type || "form" == c.type) && ("}" == a || (o = t.cc[t.cc.length - 1]) && (o == N || o == O) && !/^[,\.=+\-*:?[\(]/.test(n));) c = c.prev;
                De && ")" == c.type && "stat" == c.prev.type && (c = c.prev);
                var p = c.type, m = a == p;
                return "vardef" == p ? c.indented + ("operator" == t.lastType || "," == t.lastType ? c.info.length + 1 : 0) : "form" == p && "{" == a ? c.indented : "form" == p ? c.indented + Fe : "stat" == p ? c.indented + (Ve(t, n) ? De || Fe : 0) : "switch" != c.info || m || 0 == r.doubleIndentSwitch ? c.align ? c.column + (m ? 0 : 1) : c.indented + (m ? 0 : Fe) : c.indented + (/^(?:case|default)\b/.test(n) ? Fe : 2 * Fe)
            },
            electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
            blockCommentStart: He ? null : "/*",
            blockCommentEnd: He ? null : "*/",
            blockCommentContinue: He ? null : " * ",
            lineComment: He ? null : "//",
            fold: "brace",
            closeBrackets: "()[]{}''\"\"``",
            helperType: He ? "json" : "javascript",
            jsonldMode: Ue,
            jsonMode: He,
            expressionAllowed: Be,
            skipExpression: function (e) {
                var t = e.cc[e.cc.length - 1];
                t != C && t != P || e.cc.pop()
            }
        }
    }), e.registerHelper("wordChars", "javascript", /[\w$]/), e.defineMIME("text/javascript", "javascript"), e.defineMIME("text/ecmascript", "javascript"), e.defineMIME("application/javascript", "javascript"), e.defineMIME("application/x-javascript", "javascript"), e.defineMIME("application/ecmascript", "javascript"), e.defineMIME("application/json", {
        name: "javascript",
        json: !0
    }), e.defineMIME("application/x-json", {
        name: "javascript",
        json: !0
    }), e.defineMIME("application/manifest+json", {
        name: "javascript",
        json: !0
    }), e.defineMIME("application/ld+json", {
        name: "javascript",
        jsonld: !0
    }), e.defineMIME("text/typescript", {
        name: "javascript",
        typescript: !0
    }), e.defineMIME("application/typescript", {name: "javascript", typescript: !0})
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("mode/css/css", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e) {
        for (var t = {}, r = 0; r < e.length; ++r) t[e[r].toLowerCase()] = !0;
        return t
    }

    function r(e, t) {
        for (var r, n = !1; null != (r = e.next());) {
            if (n && "/" == r) {
                t.tokenize = null;
                break
            }
            n = "*" == r
        }
        return ["comment", "comment"]
    }

    e.defineMode("css", function (t, r) {
        function n(e, t) {
            return f = t, e
        }

        function o(e, t) {
            var r = e.next();
            if (b[r]) {
                var o = b[r](e, t);
                if (!1 !== o) return o
            }
            return "@" == r ? (e.eatWhile(/[\w\\\-]/), n("def", e.current())) : "=" == r || ("~" == r || "|" == r) && e.eat("=") ? n(null, "compare") : '"' == r || "'" == r ? (t.tokenize = i(r), t.tokenize(e, t)) : "#" == r ? (e.eatWhile(/[\w\\\-]/), n("atom", "hash")) : "!" == r ? (e.match(/^\s*\w*/), n("keyword", "important")) : /\d/.test(r) || "." == r && e.eat(/\d/) ? (e.eatWhile(/[\w.%]/), n("number", "unit")) : "-" !== r ? /[,+>*\/]/.test(r) ? n(null, "select-op") : "." == r && e.match(/^-?[_a-z][_a-z0-9-]*/i) ? n("qualifier", "qualifier") : /[:;{}\[\]\(\)]/.test(r) ? n(null, r) : e.match(/[\w-.]+(?=\()/) ? (/^(url(-prefix)?|domain|regexp)$/.test(e.current().toLowerCase()) && (t.tokenize = a), n("variable callee", "variable")) : /[\w\\\-]/.test(r) ? (e.eatWhile(/[\w\\\-]/), n("property", "word")) : n(null, null) : /[\d.]/.test(e.peek()) ? (e.eatWhile(/[\w.%]/), n("number", "unit")) : e.match(/^-[\w\\\-]*/) ? (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? n("variable-2", "variable-definition") : n("variable-2", "variable")) : e.match(/^\w+-/) ? n("meta", "meta") : void 0
        }

        function i(e) {
            return function (t, r) {
                for (var o, i = !1; null != (o = t.next());) {
                    if (o == e && !i) {
                        ")" == e && t.backUp(1);
                        break
                    }
                    i = !i && "\\" == o
                }
                return (o == e || !i && ")" != e) && (r.tokenize = null), n("string", "string")
            }
        }

        function a(e, t) {
            return e.next(), e.match(/\s*[\"\')]/, !1) ? t.tokenize = null : t.tokenize = i(")"), n(null, "(")
        }

        function l(e, t, r) {
            this.type = e, this.indent = t, this.prev = r
        }

        function s(e, t, r, n) {
            return e.context = new l(r, t.indentation() + (!1 === n ? 0 : h), e.context), r
        }

        function c(e) {
            return e.context.prev && (e.context = e.context.prev), e.context.type
        }

        function d(e, t, r) {
            return I[r.context.type](e, t, r)
        }

        function u(e, t, r, n) {
            for (var o = n || 1; o > 0; o--) r.context = r.context.prev;
            return d(e, t, r)
        }

        function p(e) {
            var t = e.current().toLowerCase();
            g = T.hasOwnProperty(t) ? "atom" : S.hasOwnProperty(t) ? "keyword" : "variable"
        }

        var m = r.inline;
        r.propertyKeywords || (r = e.resolveMode("text/css"));
        var f, g, h = t.indentUnit, b = r.tokenHooks, k = r.documentTypes || {}, y = r.mediaTypes || {},
            v = r.mediaFeatures || {}, w = r.mediaValueKeywords || {}, x = r.propertyKeywords || {},
            z = r.nonStandardPropertyKeywords || {}, M = r.fontProperties || {}, j = r.counterDescriptors || {},
            S = r.colorKeywords || {}, T = r.valueKeywords || {}, A = r.allowNested, C = r.lineComment,
            P = !0 === r.supportsAtComponent, q = !1 !== t.highlightNonStandardPropertyKeywords, I = {};
        return I.top = function (e, t, r) {
            if ("{" == e) return s(r, t, "block");
            if ("}" == e && r.context.prev) return c(r);
            if (P && /@component/i.test(e)) return s(r, t, "atComponentBlock");
            if (/^@(-moz-)?document$/i.test(e)) return s(r, t, "documentTypes");
            if (/^@(media|supports|(-moz-)?document|import)$/i.test(e)) return s(r, t, "atBlock");
            if (/^@(font-face|counter-style)/i.test(e)) return r.stateArg = e, "restricted_atBlock_before";
            if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(e)) return "keyframes";
            if (e && "@" == e.charAt(0)) return s(r, t, "at");
            if ("hash" == e) g = "builtin"; else if ("word" == e) g = "tag"; else {
                if ("variable-definition" == e) return "maybeprop";
                if ("interpolation" == e) return s(r, t, "interpolation");
                if (":" == e) return "pseudo";
                if (A && "(" == e) return s(r, t, "parens")
            }
            return r.context.type
        }, I.block = function (e, t, r) {
            if ("word" == e) {
                var n = t.current().toLowerCase();
                return x.hasOwnProperty(n) ? (g = "property", "maybeprop") : z.hasOwnProperty(n) ? (g = q ? "string-2" : "property", "maybeprop") : A ? (g = t.match(/^\s*:(?:\s|$)/, !1) ? "property" : "tag", "block") : (g += " error", "maybeprop")
            }
            return "meta" == e ? "block" : A || "hash" != e && "qualifier" != e ? I.top(e, t, r) : (g = "error", "block")
        }, I.maybeprop = function (e, t, r) {
            return ":" == e ? s(r, t, "prop") : d(e, t, r)
        }, I.prop = function (e, t, r) {
            if (";" == e) return c(r);
            if ("{" == e && A) return s(r, t, "propBlock");
            if ("}" == e || "{" == e) return u(e, t, r);
            if ("(" == e) return s(r, t, "parens");
            if ("hash" != e || /^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(t.current())) {
                if ("word" == e) p(t); else if ("interpolation" == e) return s(r, t, "interpolation")
            } else g += " error";
            return "prop"
        }, I.propBlock = function (e, t, r) {
            return "}" == e ? c(r) : "word" == e ? (g = "property", "maybeprop") : r.context.type
        }, I.parens = function (e, t, r) {
            return "{" == e || "}" == e ? u(e, t, r) : ")" == e ? c(r) : "(" == e ? s(r, t, "parens") : "interpolation" == e ? s(r, t, "interpolation") : ("word" == e && p(t), "parens")
        }, I.pseudo = function (e, t, r) {
            return "meta" == e ? "pseudo" : "word" == e ? (g = "variable-3", r.context.type) : d(e, t, r)
        }, I.documentTypes = function (e, t, r) {
            return "word" == e && k.hasOwnProperty(t.current()) ? (g = "tag", r.context.type) : I.atBlock(e, t, r)
        }, I.atBlock = function (e, t, r) {
            if ("(" == e) return s(r, t, "atBlock_parens");
            if ("}" == e || ";" == e) return u(e, t, r);
            if ("{" == e) return c(r) && s(r, t, A ? "block" : "top");
            if ("interpolation" == e) return s(r, t, "interpolation");
            if ("word" == e) {
                var n = t.current().toLowerCase();
                g = "only" == n || "not" == n || "and" == n || "or" == n ? "keyword" : y.hasOwnProperty(n) ? "attribute" : v.hasOwnProperty(n) ? "property" : w.hasOwnProperty(n) ? "keyword" : x.hasOwnProperty(n) ? "property" : z.hasOwnProperty(n) ? q ? "string-2" : "property" : T.hasOwnProperty(n) ? "atom" : S.hasOwnProperty(n) ? "keyword" : "error"
            }
            return r.context.type
        }, I.atComponentBlock = function (e, t, r) {
            return "}" == e ? u(e, t, r) : "{" == e ? c(r) && s(r, t, A ? "block" : "top", !1) : ("word" == e && (g = "error"), r.context.type)
        }, I.atBlock_parens = function (e, t, r) {
            return ")" == e ? c(r) : "{" == e || "}" == e ? u(e, t, r, 2) : I.atBlock(e, t, r)
        }, I.restricted_atBlock_before = function (e, t, r) {
            return "{" == e ? s(r, t, "restricted_atBlock") : "word" == e && "@counter-style" == r.stateArg ? (g = "variable", "restricted_atBlock_before") : d(e, t, r)
        }, I.restricted_atBlock = function (e, t, r) {
            return "}" == e ? (r.stateArg = null, c(r)) : "word" == e ? (g = "@font-face" == r.stateArg && !M.hasOwnProperty(t.current().toLowerCase()) || "@counter-style" == r.stateArg && !j.hasOwnProperty(t.current().toLowerCase()) ? "error" : "property", "maybeprop") : "restricted_atBlock"
        }, I.keyframes = function (e, t, r) {
            return "word" == e ? (g = "variable", "keyframes") : "{" == e ? s(r, t, "top") : d(e, t, r)
        }, I.at = function (e, t, r) {
            return ";" == e ? c(r) : "{" == e || "}" == e ? u(e, t, r) : ("word" == e ? g = "tag" : "hash" == e && (g = "builtin"), "at")
        }, I.interpolation = function (e, t, r) {
            return "}" == e ? c(r) : "{" == e || ";" == e ? u(e, t, r) : ("word" == e ? g = "variable" : "variable" != e && "(" != e && ")" != e && (g = "error"), "interpolation")
        }, {
            startState: function (e) {
                return {
                    tokenize: null,
                    state: m ? "block" : "top",
                    stateArg: null,
                    context: new l(m ? "block" : "top", e || 0, null)
                }
            },
            token: function (e, t) {
                if (!t.tokenize && e.eatSpace()) return null;
                var r = (t.tokenize || o)(e, t);
                return r && "object" == typeof r && (f = r[1], r = r[0]), g = r, "comment" != f && (t.state = I[t.state](f, e, t)), g
            },
            indent: function (e, t) {
                var r = e.context, n = t && t.charAt(0), o = r.indent;
                return "prop" != r.type || "}" != n && ")" != n || (r = r.prev), r.prev && ("}" != n || "block" != r.type && "top" != r.type && "interpolation" != r.type && "restricted_atBlock" != r.type ? (")" != n || "parens" != r.type && "atBlock_parens" != r.type) && ("{" != n || "at" != r.type && "atBlock" != r.type) || (o = Math.max(0, r.indent - h)) : (r = r.prev, o = r.indent)), o
            },
            electricChars: "}",
            blockCommentStart: "/*",
            blockCommentEnd: "*/",
            blockCommentContinue: " * ",
            lineComment: C,
            fold: "brace"
        }
    })
    ;var n = ["domain", "regexp", "url", "url-prefix"], o = t(n),
        i = ["all", "aural", "braille", "handheld", "print", "projection", "screen", "tty", "tv", "embossed"], a = t(i),
        l = ["width", "min-width", "max-width", "height", "min-height", "max-height", "device-width", "min-device-width", "max-device-width", "device-height", "min-device-height", "max-device-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "device-aspect-ratio", "min-device-aspect-ratio", "max-device-aspect-ratio", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "min-monochrome", "max-monochrome", "resolution", "min-resolution", "max-resolution", "scan", "grid", "orientation", "device-pixel-ratio", "min-device-pixel-ratio", "max-device-pixel-ratio", "pointer", "any-pointer", "hover", "any-hover", "prefers-color-scheme"],
        s = t(l),
        c = ["landscape", "portrait", "none", "coarse", "fine", "on-demand", "hover", "interlace", "progressive", "dark", "light"],
        d = t(c),
        u = ["align-content", "align-items", "align-self", "alignment-adjust", "alignment-baseline", "all", "anchor-point", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "azimuth", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "binding", "bleed", "block-size", "bookmark-label", "bookmark-level", "bookmark-state", "bookmark-target", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "color", "color-profile", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "content", "counter-increment", "counter-reset", "crop", "cue", "cue-after", "cue-before", "cursor", "direction", "display", "dominant-baseline", "drop-initial-after-adjust", "drop-initial-after-align", "drop-initial-before-adjust", "drop-initial-before-align", "drop-initial-size", "drop-initial-value", "elevation", "empty-cells", "fit", "fit-position", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "float-offset", "flow-from", "flow-into", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "inline-box-align", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "line-break", "line-height", "line-height-step", "line-stacking", "line-stacking-ruby", "line-stacking-shift", "line-stacking-strategy", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marks", "marquee-direction", "marquee-loop", "marquee-play-count", "marquee-speed", "marquee-style", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "move-to", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-style", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "page-policy", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "pitch", "pitch-range", "place-content", "place-items", "place-self", "play-during", "position", "presentation-level", "punctuation-trim", "quotes", "region-break-after", "region-break-before", "region-break-inside", "region-fragment", "rendering-intent", "resize", "rest", "rest-after", "rest-before", "richness", "right", "rotate", "rotation", "rotation-point", "row-gap", "ruby-align", "ruby-overhang", "ruby-position", "ruby-span", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-type", "shape-image-threshold", "shape-inside", "shape-margin", "shape-outside", "size", "speak", "speak-as", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress", "string-set", "tab-size", "table-layout", "target", "target-name", "target-new", "target-position", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-height", "text-indent", "text-justify", "text-orientation", "text-outline", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-space-collapse", "text-transform", "text-underline-position", "text-wrap", "top", "touch-action", "transform", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vertical-align", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "volume", "white-space", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", "clip-path", "clip-rule", "mask", "enable-background", "filter", "flood-color", "flood-opacity", "lighting-color", "stop-color", "stop-opacity", "pointer-events", "color-interpolation", "color-interpolation-filters", "color-rendering", "fill", "fill-opacity", "fill-rule", "image-rendering", "marker", "marker-end", "marker-mid", "marker-start", "paint-order", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "text-rendering", "baseline-shift", "dominant-baseline", "glyph-orientation-horizontal", "glyph-orientation-vertical", "text-anchor", "writing-mode"],
        p = t(u),
        m = ["border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "margin-block", "margin-block-end", "margin-block-start", "margin-inline", "margin-inline-end", "margin-inline-start", "padding-block", "padding-block-end", "padding-block-start", "padding-inline", "padding-inline-end", "padding-inline-start", "scroll-snap-stop", "scrollbar-3d-light-color", "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color", "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-track-color", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "shape-inside", "zoom"],
        f = t(m),
        g = ["font-display", "font-family", "src", "unicode-range", "font-variant", "font-feature-settings", "font-stretch", "font-weight", "font-style"],
        h = t(g),
        b = ["additive-symbols", "fallback", "negative", "pad", "prefix", "range", "speak-as", "suffix", "symbols", "system"],
        k = t(b),
        y = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
        v = t(y),
        w = ["above", "absolute", "activeborder", "additive", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alphabetic", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "attr", "auto", "auto-flow", "avoid", "avoid-column", "avoid-page", "avoid-region", "axis-pan", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break", "break-all", "break-word", "bullets", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "calc", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-decimal", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "color", "color-burn", "color-dodge", "column", "column-reverse", "compact", "condensed", "contain", "content", "contents", "content-box", "context-menu", "continuous", "copy", "counter", "counters", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "cyclic", "darken", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "dense", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "difference", "disc", "discard", "disclosure-closed", "disclosure-open", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipse", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ethiopic-numeric", "ew-resize", "exclusion", "expanded", "extends", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fill-box", "fixed", "flat", "flex", "flex-end", "flex-start", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "grid", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hard-light", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "hue", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-flex", "inline-grid", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "japanese-formal", "japanese-informal", "justify", "kannada", "katakana", "katakana-iroha", "keep-all", "khmer", "korean-hangul-formal", "korean-hanja-formal", "korean-hanja-informal", "landscape", "lao", "large", "larger", "left", "level", "lighter", "lighten", "line-through", "linear", "linear-gradient", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "luminosity", "malayalam", "manipulation", "match", "matrix", "matrix3d", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "multiple_mask_images", "multiply", "myanmar", "n-resize", "narrower", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "numbers", "numeric", "nw-resize", "nwse-resize", "oblique", "octal", "opacity", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "outside-shape", "overlay", "overline", "padding", "padding-box", "painted", "page", "paused", "persian", "perspective", "pinch-zoom", "plus-darker", "plus-lighter", "pointer", "polygon", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radial-gradient", "radio", "read-only", "read-write", "read-write-plaintext-only", "rectangle", "region", "relative", "repeat", "repeating-linear-gradient", "repeating-radial-gradient", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "rotate", "rotate3d", "rotateX", "rotateY", "rotateZ", "round", "row", "row-resize", "row-reverse", "rtl", "run-in", "running", "s-resize", "sans-serif", "saturation", "scale", "scale3d", "scaleX", "scaleY", "scaleZ", "screen", "scroll", "scrollbar", "scroll-position", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "self-start", "self-end", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "simp-chinese-formal", "simp-chinese-informal", "single", "skew", "skewX", "skewY", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "soft-light", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "space-around", "space-between", "space-evenly", "spell-out", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "stroke-box", "sub", "subpixel-antialiased", "svg_masks", "super", "sw-resize", "symbolic", "symbols", "system-ui", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "tamil", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "trad-chinese-formal", "trad-chinese-informal", "transform", "translate", "translate3d", "translateX", "translateY", "translateZ", "transparent", "ultra-condensed", "ultra-expanded", "underline", "unidirectional-pan", "unset", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "var", "vertical", "vertical-text", "view-box", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "wider", "window", "windowframe", "windowtext", "words", "wrap", "wrap-reverse", "x-large", "x-small", "xor", "xx-large", "xx-small"],
        x = t(w), z = n.concat(i).concat(l).concat(c).concat(u).concat(m).concat(y).concat(w);
    e.registerHelper("hintWords", "css", z), e.defineMIME("text/css", {
        documentTypes: o,
        mediaTypes: a,
        mediaFeatures: s,
        mediaValueKeywords: d,
        propertyKeywords: p,
        nonStandardPropertyKeywords: f,
        fontProperties: h,
        counterDescriptors: k,
        colorKeywords: v,
        valueKeywords: x,
        tokenHooks: {
            "/": function (e, t) {
                return !!e.eat("*") && (t.tokenize = r, r(e, t))
            }
        },
        name: "css"
    }), e.defineMIME("text/x-scss", {
        mediaTypes: a,
        mediaFeatures: s,
        mediaValueKeywords: d,
        propertyKeywords: p,
        nonStandardPropertyKeywords: f,
        colorKeywords: v,
        valueKeywords: x,
        fontProperties: h,
        allowNested: !0,
        lineComment: "//",
        tokenHooks: {
            "/": function (e, t) {
                return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = r, r(e, t)) : ["operator", "operator"]
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
        propertyKeywords: p,
        nonStandardPropertyKeywords: f,
        colorKeywords: v,
        valueKeywords: x,
        fontProperties: h,
        allowNested: !0,
        lineComment: "//",
        tokenHooks: {
            "/": function (e, t) {
                return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = r, r(e, t)) : ["operator", "operator"]
            }, "@": function (e) {
                return e.eat("{") ? [null, "interpolation"] : !e.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, !1) && (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"])
            }, "&": function () {
                return ["atom", "atom"]
            }
        },
        name: "css",
        helperType: "less"
    }), e.defineMIME("text/x-gss", {
        documentTypes: o,
        mediaTypes: a,
        mediaFeatures: s,
        propertyKeywords: p,
        nonStandardPropertyKeywords: f,
        fontProperties: h,
        counterDescriptors: k,
        colorKeywords: v,
        valueKeywords: x,
        supportsAtComponent: !0,
        tokenHooks: {
            "/": function (e, t) {
                return !!e.eat("*") && (t.tokenize = r, r(e, t))
            }
        },
        name: "css",
        helperType: "gss"
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../xml/xml"), require("../javascript/javascript"), require("../css/css")) : "function" == typeof define && define.amd ? define("mode/htmlmixed/htmlmixed", ["../../lib/codemirror", "../xml/xml", "../javascript/javascript", "../css/css"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function t(e, t, r) {
        var n = e.current(), o = n.search(t);
        return o > -1 ? e.backUp(n.length - o) : n.match(/<\/?$/) && (e.backUp(n.length), e.match(t, !1) || e.match(n)), r
    }

    function r(e) {
        var t = s[e];
        return t || (s[e] = new RegExp("\\s+" + e + "\\s*=\\s*('|\")?([^'\"]+)('|\")?\\s*"))
    }

    function n(e, t) {
        var n = e.match(r(t));
        return n ? /^\s*(.*?)\s*$/.exec(n[2])[1] : ""
    }

    function o(e, t) {
        return new RegExp((t ? "^" : "") + "</s*" + e + "s*>", "i")
    }

    function i(e, t) {
        for (var r in e) for (var n = t[r] || (t[r] = []), o = e[r], i = o.length - 1; i >= 0; i--) n.unshift(o[i])
    }

    function a(e, t) {
        for (var r = 0; r < e.length; r++) {
            var o = e[r];
            if (!o[0] || o[1].test(n(t, o[0]))) return o[2]
        }
    }

    var l = {
        script: [["lang", /(javascript|babel)/i, "javascript"], ["type", /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, "javascript"], ["type", /./, "text/plain"], [null, null, "javascript"]],
        style: [["lang", /^css$/i, "css"], ["type", /^(text\/)?(x-)?(stylesheet|css)$/i, "css"], ["type", /./, "text/plain"], [null, null, "css"]]
    }, s = {};
    e.defineMode("htmlmixed", function (r, n) {
        function s(n, i) {
            var l, u = c.token(n, i.htmlState), p = /\btag\b/.test(u);
            if (p && !/[<>\s\/]/.test(n.current()) && (l = i.htmlState.tagName && i.htmlState.tagName.toLowerCase()) && d.hasOwnProperty(l)) i.inTag = l + " "; else if (i.inTag && p && />$/.test(n.current())) {
                var m = /^([\S]+) (.*)/.exec(i.inTag);
                i.inTag = null;
                var f = ">" == n.current() && a(d[m[1]], m[2]), g = e.getMode(r, f), h = o(m[1], !0), b = o(m[1], !1);
                i.token = function (e, r) {
                    return e.match(h, !1) ? (r.token = s, r.localState = r.localMode = null, null) : t(e, b, r.localMode.token(e, r.localState))
                }, i.localMode = g, i.localState = e.startState(g, c.indent(i.htmlState, "", ""))
            } else i.inTag && (i.inTag += n.current(), n.eol() && (i.inTag += " "));
            return u
        }

        var c = e.getMode(r, {
            name: "xml",
            htmlMode: !0,
            multilineTagIndentFactor: n.multilineTagIndentFactor,
            multilineTagIndentPastTag: n.multilineTagIndentPastTag,
            allowMissingTagName: n.allowMissingTagName
        }), d = {}, u = n && n.tags, p = n && n.scriptTypes;
        if (i(l, d), u && i(u, d), p) for (var m = p.length - 1; m >= 0; m--) d.script.unshift(["type", p[m].matches, p[m].mode]);
        return {
            startState: function () {
                return {token: s, inTag: null, localMode: null, localState: null, htmlState: e.startState(c)}
            }, copyState: function (t) {
                var r;
                return t.localState && (r = e.copyState(t.localMode, t.localState)), {
                    token: t.token,
                    inTag: t.inTag,
                    localMode: t.localMode,
                    localState: r,
                    htmlState: e.copyState(c, t.htmlState)
                }
            }, token: function (e, t) {
                return t.token(e, t)
            }, indent: function (t, r, n) {
                return !t.localMode || /^\s*<\//.test(r) ? c.indent(t.htmlState, r, n) : t.localMode.indent ? t.localMode.indent(t.localState, r, n) : e.Pass
            }, innerMode: function (e) {
                return {state: e.localState || e.htmlState, mode: e.localMode || c}
            }
        }
    }, "xml", "javascript", "css"), e.defineMIME("text/html", "htmlmixed")
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/mode/multiplex", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.multiplexingMode = function (t) {
        function r(e, t, r, n) {
            if ("string" == typeof t) {
                var o = e.indexOf(t, r);
                return n && o > -1 ? o + t.length : o
            }
            var i = t.exec(r ? e.slice(r) : e);
            return i ? i.index + r + (n ? i[0].length : 0) : -1
        }

        var n = Array.prototype.slice.call(arguments, 1);
        return {
            startState: function () {
                return {outer: e.startState(t), innerActive: null, inner: null}
            }, copyState: function (r) {
                return {
                    outer: e.copyState(t, r.outer),
                    innerActive: r.innerActive,
                    inner: r.innerActive && e.copyState(r.innerActive.mode, r.inner)
                }
            }, token: function (o, i) {
                if (i.innerActive) {
                    var a = i.innerActive, l = o.string;
                    if (!a.close && o.sol()) return i.innerActive = i.inner = null, this.token(o, i);
                    var s = a.close ? r(l, a.close, o.pos, a.parseDelimiters) : -1;
                    if (s == o.pos && !a.parseDelimiters) return o.match(a.close), i.innerActive = i.inner = null, a.delimStyle && a.delimStyle + " " + a.delimStyle + "-close";
                    s > -1 && (o.string = l.slice(0, s));
                    var c = a.mode.token(o, i.inner);
                    return s > -1 && (o.string = l), s == o.pos && a.parseDelimiters && (i.innerActive = i.inner = null), a.innerStyle && (c = c ? c + " " + a.innerStyle : a.innerStyle), c
                }
                for (var d = 1 / 0, l = o.string, u = 0; u < n.length; ++u) {
                    var p = n[u], s = r(l, p.open, o.pos);
                    if (s == o.pos) {
                        p.parseDelimiters || o.match(p.open), i.innerActive = p;
                        var m = 0;
                        if (t.indent) {
                            var f = t.indent(i.outer, "", "");
                            f !== e.Pass && (m = f)
                        }
                        return i.inner = e.startState(p.mode, m), p.delimStyle && p.delimStyle + " " + p.delimStyle + "-open"
                    }
                    -1 != s && s < d && (d = s)
                }
                d != 1 / 0 && (o.string = l.slice(0, d));
                var g = t.token(o, i.outer);
                return d != 1 / 0 && (o.string = l), g
            }, indent: function (r, n, o) {
                var i = r.innerActive ? r.innerActive.mode : t;
                return i.indent ? i.indent(r.innerActive ? r.inner : r.outer, n, o) : e.Pass
            }, blankLine: function (r) {
                var o = r.innerActive ? r.innerActive.mode : t;
                if (o.blankLine && o.blankLine(r.innerActive ? r.inner : r.outer), r.innerActive) "\n" === r.innerActive.close && (r.innerActive = r.inner = null); else for (var i = 0; i < n.length; ++i) {
                    var a = n[i];
                    "\n" === a.open && (r.innerActive = a, r.inner = e.startState(a.mode, o.indent ? o.indent(r.outer, "", "") : 0))
                }
            }, electricChars: t.electricChars, innerMode: function (e) {
                return e.inner ? {state: e.inner, mode: e.innerActive.mode} : {state: e.outer, mode: t}
            }
        }
    }
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("../htmlmixed/htmlmixed"), require("../../addon/mode/multiplex")) : "function" == typeof define && define.amd ? define("mode/htmlembedded/htmlembedded.js", ["../../lib/codemirror", "../htmlmixed/htmlmixed", "../../addon/mode/multiplex"], e) : e(CodeMirror)
}(function (e) {
    "use strict";
    e.defineMode("htmlembedded", function (t, r) {
        var n = r.closeComment || "--%>";
        return e.multiplexingMode(e.getMode(t, "htmlmixed"), {
            open: r.openComment || "<%--",
            close: n,
            delimStyle: "comment",
            mode: {
                token: function (e) {
                    return e.skipTo(n) || e.skipToEnd(), "comment"
                }
            }
        }, {
            open: r.open || r.scriptStartRegex || "<%",
            close: r.close || r.scriptEndRegex || "%>",
            mode: e.getMode(t, r.scriptingModeSpec)
        })
    }, "htmlmixed"), e.defineMIME("application/x-ejs", {
        name: "htmlembedded",
        scriptingModeSpec: "javascript"
    }), e.defineMIME("application/x-aspx", {
        name: "htmlembedded",
        scriptingModeSpec: "text/x-csharp"
    }), e.defineMIME("application/x-jsp", {
        name: "htmlembedded",
        scriptingModeSpec: "text/x-java"
    }), e.defineMIME("application/x-erb", {name: "htmlembedded", scriptingModeSpec: "ruby"})
}), function (e) {
    "function" == typeof define && define("modeHtml", ["mode/htmlembedded/htmlembedded.js"], function () {
    })
}();