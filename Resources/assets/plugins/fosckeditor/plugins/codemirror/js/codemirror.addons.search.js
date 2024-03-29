!function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/search/searchcursor", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function n(e) {
        var n = e.flags;
        return null != n ? n : (e.ignoreCase ? "i" : "") + (e.global ? "g" : "") + (e.multiline ? "m" : "")
    }

    function t(e, t) {
        for (var o = n(e), r = o, i = 0; i < t.length; i++) -1 == r.indexOf(t.charAt(i)) && (r += t.charAt(i));
        return o == r ? e : new RegExp(e.source, r)
    }

    function o(e) {
        return /\\s|\\n|\n|\\W|\\D|\[\^/.test(e.source)
    }

    function r(e, n, o) {
        n = t(n, "g");
        for (var r = o.line, i = o.ch, s = e.lastLine(); r <= s; r++, i = 0) {
            n.lastIndex = i;
            var a = e.getLine(r), l = n.exec(a);
            if (l) return {from: g(r, l.index), to: g(r, l.index + l[0].length), match: l}
        }
    }

    function i(e, n, i) {
        if (!o(n)) return r(e, n, i);
        n = t(n, "gm");
        for (var s, a = 1, l = i.line, c = e.lastLine(); l <= c;) {
            for (var u = 0; u < a && !(l > c); u++) {
                var f = e.getLine(l++);
                s = null == s ? f : s + "\n" + f
            }
            a *= 2, n.lastIndex = i.ch;
            var h = n.exec(s);
            if (h) {
                var p = s.slice(0, h.index).split("\n"), d = h[0].split("\n"), m = i.line + p.length - 1,
                    v = p[p.length - 1].length;
                return {
                    from: g(m, v),
                    to: g(m + d.length - 1, 1 == d.length ? v + d[0].length : d[d.length - 1].length),
                    match: h
                }
            }
        }
    }

    function s(e, n, t) {
        for (var o, r = 0; r <= e.length;) {
            n.lastIndex = r;
            var i = n.exec(e);
            if (!i) break;
            var s = i.index + i[0].length;
            if (s > e.length - t) break;
            (!o || s > o.index + o[0].length) && (o = i), r = i.index + 1
        }
        return o
    }

    function a(e, n, o) {
        n = t(n, "g");
        for (var r = o.line, i = o.ch, a = e.firstLine(); r >= a; r--, i = -1) {
            var l = e.getLine(r), c = s(l, n, i < 0 ? 0 : l.length - i);
            if (c) return {from: g(r, c.index), to: g(r, c.index + c[0].length), match: c}
        }
    }

    function l(e, n, r) {
        if (!o(n)) return a(e, n, r);
        n = t(n, "gm");
        for (var i, l = 1, c = e.getLine(r.line).length - r.ch, u = r.line, f = e.firstLine(); u >= f;) {
            for (var h = 0; h < l && u >= f; h++) {
                var p = e.getLine(u--);
                i = null == i ? p : p + "\n" + i
            }
            l *= 2;
            var d = s(i, n, c);
            if (d) {
                var m = i.slice(0, d.index).split("\n"), v = d[0].split("\n"), y = u + m.length,
                    x = m[m.length - 1].length;
                return {
                    from: g(y, x),
                    to: g(y + v.length - 1, 1 == v.length ? x + v[0].length : v[v.length - 1].length),
                    match: d
                }
            }
        }
    }

    function c(e, n, t, o) {
        if (e.length == n.length) return t;
        for (var r = 0, i = t + Math.max(0, e.length - n.length); ;) {
            if (r == i) return r;
            var s = r + i >> 1, a = o(e.slice(0, s)).length;
            if (a == t) return s;
            a > t ? i = s : r = s + 1
        }
    }

    function u(e, n, t, o) {
        if (!n.length) return null;
        var r = o ? p : d, i = r(n).split(/\r|\n\r?/);
        e:for (var s = t.line, a = t.ch, l = e.lastLine() + 1 - i.length; s <= l; s++, a = 0) {
            var u = e.getLine(s).slice(a), f = r(u);
            if (1 == i.length) {
                var h = f.indexOf(i[0]);
                if (-1 == h) continue;
                var t = c(u, f, h, r) + a;
                return {from: g(s, c(u, f, h, r) + a), to: g(s, c(u, f, h + i[0].length, r) + a)}
            }
            var m = f.length - i[0].length;
            if (f.slice(m) == i[0]) {
                for (var v = 1; v < i.length - 1; v++) if (r(e.getLine(s + v)) != i[v]) continue e;
                var y = e.getLine(s + i.length - 1), x = r(y), C = i[i.length - 1];
                if (x.slice(0, C.length) == C) return {
                    from: g(s, c(u, f, m, r) + a),
                    to: g(s + i.length - 1, c(y, x, C.length, r))
                }
            }
        }
    }

    function f(e, n, t, o) {
        if (!n.length) return null;
        var r = o ? p : d, i = r(n).split(/\r|\n\r?/);
        e:for (var s = t.line, a = t.ch, l = e.firstLine() - 1 + i.length; s >= l; s--, a = -1) {
            var u = e.getLine(s);
            a > -1 && (u = u.slice(0, a));
            var f = r(u);
            if (1 == i.length) {
                var h = f.lastIndexOf(i[0]);
                if (-1 == h) continue;
                return {from: g(s, c(u, f, h, r)), to: g(s, c(u, f, h + i[0].length, r))}
            }
            var m = i[i.length - 1];
            if (f.slice(0, m.length) == m) {
                for (var v = 1, t = s - i.length + 1; v < i.length - 1; v++) if (r(e.getLine(t + v)) != i[v]) continue e;
                var y = e.getLine(s + 1 - i.length), x = r(y);
                if (x.slice(x.length - i[0].length) == i[0]) return {
                    from: g(s + 1 - i.length, c(y, x, y.length - i[0].length, r)),
                    to: g(s, c(u, f, m.length, r))
                }
            }
        }
    }

    function h(e, n, o, s) {
        this.atOccurrence = !1, this.doc = e, o = o ? e.clipPos(o) : g(0, 0), this.pos = {from: o, to: o};
        var c;
        "object" == typeof s ? c = s.caseFold : (c = s, s = null), "string" == typeof n ? (null == c && (c = !1), this.matches = function (t, o) {
            return (t ? f : u)(e, n, o, c)
        }) : (n = t(n, "gm"), s && !1 === s.multiline ? this.matches = function (t, o) {
            return (t ? a : r)(e, n, o)
        } : this.matches = function (t, o) {
            return (t ? l : i)(e, n, o)
        })
    }

    var p, d, g = e.Pos;
    String.prototype.normalize ? (p = function (e) {
        return e.normalize("NFD").toLowerCase()
    }, d = function (e) {
        return e.normalize("NFD")
    }) : (p = function (e) {
        return e.toLowerCase()
    }, d = function (e) {
        return e
    }), h.prototype = {
        findNext: function () {
            return this.find(!1)
        }, findPrevious: function () {
            return this.find(!0)
        }, find: function (n) {
            for (var t = this.matches(n, this.doc.clipPos(n ? this.pos.from : this.pos.to)); t && 0 == e.cmpPos(t.from, t.to);) n ? t.from.ch ? t.from = g(t.from.line, t.from.ch - 1) : t = t.from.line == this.doc.firstLine() ? null : this.matches(n, this.doc.clipPos(g(t.from.line - 1))) : t.to.ch < this.doc.getLine(t.to.line).length ? t.to = g(t.to.line, t.to.ch + 1) : t = t.to.line == this.doc.lastLine() ? null : this.matches(n, g(t.to.line + 1, 0));
            if (t) return this.pos = t, this.atOccurrence = !0, this.pos.match || !0;
            var o = g(n ? this.doc.firstLine() : this.doc.lastLine() + 1, 0);
            return this.pos = {from: o, to: o}, this.atOccurrence = !1
        }, from: function () {
            if (this.atOccurrence) return this.pos.from
        }, to: function () {
            if (this.atOccurrence) return this.pos.to
        }, replace: function (n, t) {
            if (this.atOccurrence) {
                var o = e.splitLines(n);
                this.doc.replaceRange(o, this.pos.from, this.pos.to, t), this.pos.to = g(this.pos.from.line + o.length - 1, o[o.length - 1].length + (1 == o.length ? this.pos.from.ch : 0))
            }
        }
    }, e.defineExtension("getSearchCursor", function (e, n, t) {
        return new h(this.doc, e, n, t)
    }), e.defineDocExtension("getSearchCursor", function (e, n, t) {
        return new h(this, e, n, t)
    }), e.defineExtension("selectMatches", function (n, t) {
        for (var o = [], r = this.getSearchCursor(n, this.getCursor("from"), t); r.findNext() && !(e.cmpPos(r.to(), this.getCursor("to")) > 0);) o.push({
            anchor: r.from(),
            head: r.to()
        });
        o.length && this.setSelections(o, 0)
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define("addon/dialog/dialog", ["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
    function n(n, t, o) {
        var r, i = n.getWrapperElement();
        return r = i.appendChild(document.createElement("div")), r.className = o ? "CodeMirror-dialog CodeMirror-dialog-bottom" : "CodeMirror-dialog CodeMirror-dialog-top", "string" == typeof t ? r.innerHTML = t : r.appendChild(t), e.addClass(i, "dialog-opened"), r
    }

    function t(e, n) {
        e.state.currentNotificationClose && e.state.currentNotificationClose(), e.state.currentNotificationClose = n
    }

    e.defineExtension("openDialog", function (o, r, i) {
        function s(n) {
            if ("string" == typeof n) f.value = n; else {
                if (c) return;
                c = !0, e.rmClass(l.parentNode, "dialog-opened"), l.parentNode.removeChild(l), u.focus(), i.onClose && i.onClose(l)
            }
        }

        i || (i = {}), t(this, null);
        var a, l = n(this, o, i.bottom), c = !1, u = this, f = l.getElementsByTagName("input")[0];
        return f ? (f.focus(), i.value && (f.value = i.value, !1 !== i.selectValueOnOpen && f.select()), i.onInput && e.on(f, "input", function (e) {
            i.onInput(e, f.value, s)
        }), i.onKeyUp && e.on(f, "keyup", function (e) {
            i.onKeyUp(e, f.value, s)
        }), e.on(f, "keydown", function (n) {
            i && i.onKeyDown && i.onKeyDown(n, f.value, s) || ((27 == n.keyCode || !1 !== i.closeOnEnter && 13 == n.keyCode) && (f.blur(), e.e_stop(n), s()), 13 == n.keyCode && r(f.value, n))
        }), !1 !== i.closeOnBlur && e.on(l, "focusout", function (e) {
            null !== e.relatedTarget && s()
        })) : (a = l.getElementsByTagName("button")[0]) && (e.on(a, "click", function () {
            s(), u.focus()
        }), !1 !== i.closeOnBlur && e.on(a, "blur", s), a.focus()), s
    }), e.defineExtension("openConfirm", function (o, r, i) {
        function s() {
            c || (c = !0, e.rmClass(a.parentNode, "dialog-opened"), a.parentNode.removeChild(a), u.focus())
        }

        t(this, null);
        var a = n(this, o, i && i.bottom), l = a.getElementsByTagName("button"), c = !1, u = this, f = 1;
        l[0].focus();
        for (var h = 0; h < l.length; ++h) {
            var p = l[h];
            !function (n) {
                e.on(p, "click", function (t) {
                    e.e_preventDefault(t), s(), n && n(u)
                })
            }(r[h]), e.on(p, "blur", function () {
                --f, setTimeout(function () {
                    f <= 0 && s()
                }, 200)
            }), e.on(p, "focus", function () {
                ++f
            })
        }
    }), e.defineExtension("openNotification", function (o, r) {
        function i() {
            l || (l = !0, clearTimeout(s), e.rmClass(a.parentNode, "dialog-opened"), a.parentNode.removeChild(a))
        }

        t(this, i);
        var s, a = n(this, o, r && r.bottom), l = !1, c = r && void 0 !== r.duration ? r.duration : 5e3;
        return e.on(a, "click", function (n) {
            e.e_preventDefault(n), i()
        }), c && (s = setTimeout(i, c)), i
    })
}), function (e) {
    "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog")) : "function" == typeof define && define.amd ? define("addon/search/search.js", ["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], e) : e(CodeMirror)
}(function (e) {
    "use strict";

    function n(e, n) {
        return "string" == typeof e ? e = new RegExp(e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), n ? "gi" : "g") : e.global || (e = new RegExp(e.source, e.ignoreCase ? "gi" : "g")), {
            token: function (n) {
                e.lastIndex = n.pos;
                var t = e.exec(n.string);
                if (t && t.index == n.pos) return n.pos += t[0].length || 1, "searching";
                t ? n.pos = t.index : n.skipToEnd()
            }
        }
    }

    function t() {
        this.posFrom = this.posTo = this.lastQuery = this.query = null, this.overlay = null
    }

    function o(e) {
        return e.state.search || (e.state.search = new t)
    }

    function r(e) {
        return "string" == typeof e && e == e.toLowerCase()
    }

    function i(e, n, t) {
        return e.getSearchCursor(n, t, {caseFold: r(n), multiline: !0})
    }

    function s(e, n, t, o, r) {
        e.openDialog(n, o, {
            value: t, selectValueOnOpen: !0, closeOnEnter: !1, onClose: function () {
                d(e)
            }, onKeyDown: r, bottom: e.options.search.bottom
        })
    }

    function a(e, n, t, o, r) {
        e.openDialog ? e.openDialog(n, r, {
            value: o,
            selectValueOnOpen: !0,
            bottom: e.options.search.bottom
        }) : r(prompt(t, o))
    }

    function l(e, n, t, o) {
        e.openConfirm ? e.openConfirm(n, o) : confirm(t) && o[0]()
    }

    function c(e) {
        return e.replace(/\\([nrt\\])/g, function (e, n) {
            return "n" == n ? "\n" : "r" == n ? "\r" : "t" == n ? "\t" : "\\" == n ? "\\" : e
        })
    }

    function u(e) {
        var n = e.match(/^\/(.*)\/([a-z]*)$/);
        if (n) try {
            e = new RegExp(n[1], -1 == n[2].indexOf("i") ? "" : "i")
        } catch (e) {
        } else e = c(e);
        return ("string" == typeof e ? "" == e : e.test("")) && (e = /x^/), e
    }

    function f(e, t, o) {
        t.queryText = o, t.query = u(o), e.removeOverlay(t.overlay, r(t.query)), t.overlay = n(t.query, r(t.query)), e.addOverlay(t.overlay), e.showMatchesOnScrollbar && (t.annotate && (t.annotate.clear(), t.annotate = null), t.annotate = e.showMatchesOnScrollbar(t.query, r(t.query)))
    }

    function h(n, t, r, i) {
        var l = o(n);
        if (l.query) return p(n, t);
        var c = n.getSelection() || l.lastQuery;
        if (c instanceof RegExp && "x^" == c.source && (c = null), r && n.openDialog) {
            var u = null, h = function (t, o) {
                e.e_stop(o), t && (t != l.queryText && (f(n, l, t), l.posFrom = l.posTo = n.getCursor()), u && (u.style.opacity = 1), p(n, o.shiftKey, function (e, t) {
                    var o;
                    t.line < 3 && document.querySelector && (o = n.display.wrapper.querySelector(".CodeMirror-dialog")) && o.getBoundingClientRect().bottom - 4 > n.cursorCoords(t, "window").top && ((u = o).style.opacity = .4)
                }))
            };
            s(n, g(n), c, h, function (t, r) {
                var i = e.keyName(t), s = n.getOption("extraKeys"), a = s && s[i] || e.keyMap[n.getOption("keyMap")][i];
                "findNext" == a || "findPrev" == a || "findPersistentNext" == a || "findPersistentPrev" == a ? (e.e_stop(t), f(n, o(n), r), n.execCommand(a)) : "find" != a && "findPersistent" != a || (e.e_stop(t), h(r, t))
            }), i && c && (f(n, l, c), p(n, t))
        } else a(n, g(n), "Search for:", c, function (e) {
            e && !l.query && n.operation(function () {
                f(n, l, e), l.posFrom = l.posTo = n.getCursor(), p(n, t)
            })
        })
    }

    function p(n, t, r) {
        n.operation(function () {
            var s = o(n), a = i(n, s.query, t ? s.posFrom : s.posTo);
            (a.find(t) || (a = i(n, s.query, t ? e.Pos(n.lastLine()) : e.Pos(n.firstLine(), 0)), a.find(t))) && (n.setSelection(a.from(), a.to()), n.scrollIntoView({
                from: a.from(),
                to: a.to()
            }, 20), s.posFrom = a.from(), s.posTo = a.to(), r && r(a.from(), a.to()))
        })
    }

    function d(e) {
        e.operation(function () {
            var n = o(e);
            n.lastQuery = n.query, n.query && (n.query = n.queryText = null, e.removeOverlay(n.overlay), n.annotate && (n.annotate.clear(), n.annotate = null))
        })
    }

    function g(e) {
        return '<span class="CodeMirror-search-label">' + e.phrase("Search:") + '</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">' + e.phrase("(Use /re/ syntax for regexp search)") + "</span>"
    }

    function m(e) {
        return ' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">' + e.phrase("(Use /re/ syntax for regexp search)") + "</span>"
    }

    function v(e) {
        return '<span class="CodeMirror-search-label">' + e.phrase("With:") + '</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>'
    }

    function y(e) {
        return '<span class="CodeMirror-search-label">' + e.phrase("Replace?") + "</span> <button>" + e.phrase("Yes") + "</button> <button>" + e.phrase("No") + "</button> <button>" + e.phrase("All") + "</button> <button>" + e.phrase("Stop") + "</button> "
    }

    function x(e, n, t) {
        e.operation(function () {
            for (var o = i(e, n); o.findNext();) if ("string" != typeof n) {
                var r = e.getRange(o.from(), o.to()).match(n);
                o.replace(t.replace(/\$(\d)/g, function (e, n) {
                    return r[n]
                }))
            } else o.replace(t)
        })
    }

    function C(e, n) {
        if (!e.getOption("readOnly")) {
            var t = e.getSelection() || o(e).lastQuery,
                r = '<span class="CodeMirror-search-label">' + (n ? e.phrase("Replace all:") : e.phrase("Replace:")) + "</span>";
            a(e, r + m(e), r, t, function (t) {
                t && (t = u(t), a(e, v(e), e.phrase("Replace with:"), "", function (o) {
                    if (o = c(o), n) x(e, t, o); else {
                        d(e);
                        var r = i(e, t, e.getCursor("from")), s = function () {
                            var n, c = r.from();
                            !(n = r.findNext()) && (r = i(e, t), !(n = r.findNext()) || c && r.from().line == c.line && r.from().ch == c.ch) || (e.setSelection(r.from(), r.to()), e.scrollIntoView({
                                from: r.from(),
                                to: r.to()
                            }), l(e, y(e), e.phrase("Replace?"), [function () {
                                a(n)
                            }, s, function () {
                                x(e, t, o)
                            }]))
                        }, a = function (e) {
                            r.replace("string" == typeof t ? o : o.replace(/\$(\d)/g, function (n, t) {
                                return e[t]
                            })), s()
                        };
                        s()
                    }
                }))
            })
        }
    }

    e.defineOption("search", {bottom: !1}), e.commands.find = function (e) {
        d(e), h(e)
    }, e.commands.findPersistent = function (e) {
        d(e), h(e, !1, !0)
    }, e.commands.findPersistentNext = function (e) {
        h(e, !1, !0, !0)
    }, e.commands.findPersistentPrev = function (e) {
        h(e, !0, !0, !0)
    }, e.commands.findNext = h, e.commands.findPrev = function (e) {
        h(e, !0)
    }, e.commands.clearSearch = d, e.commands.replace = C, e.commands.replaceAll = function (e) {
        C(e, !0)
    }
}), function (e) {
    "function" == typeof e.define && e.define("addonSearch", ["addon/search/search.js"], function () {
    })
}(this);