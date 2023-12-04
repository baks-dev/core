!function () {
    var t = function (t) {
        function e(i) {
            if (n[i]) return n[i].exports;
            var _ = n[i] = {i: i, l: !1, exports: {}};
            return t[i].call(_.exports, _, _.exports, e), _.l = !0, _.exports
        }

        var n = {};
        return e.m = t, e.c = n, e.d = function (t, n, i) {
            e.o(t, n) || Object.defineProperty(t, n, {enumerable: !0, get: i})
        }, e.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
        }, e.t = function (t, n) {
            if (1 & n && (t = e(t)), 8 & n) return t;
            if (4 & n && "object" == typeof t && t && t.__esModule) return t;
            var i = Object.create(null);
            if (e.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: t
            }), 2 & n && "string" != typeof t) for (var _ in t) e.d(i, _, function (e) {
                return t[e]
            }.bind(null, _));
            return i
        }, e.n = function (t) {
            var n = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(n, "a", n), n
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 0)
    }([function (t, e, n) {
        function i(t, e) {
            return new _(t, e).beautify()
        }

        var _ = n(1).Beautifier, s = n(5).Options;
        t.exports = i, t.exports.defaultOptions = function () {
            return new s
        }
    }, function (t, e, n) {
        function i(t, e) {
            return -1 !== e.indexOf(t)
        }

        function _(t) {
            return t.replace(/^\s+/g, "")
        }

        function s(t, e) {
            return t && t.type === k.RESERVED && t.text === e
        }

        function a(t, e) {
            return t && t.type === k.RESERVED && i(t.text, e)
        }

        function u(t, e) {
            e.multiline_frame || e.mode === T.ForInitializer || e.mode === T.Conditional || t.remove_indent(e.start_line_index)
        }

        function r(t) {
            t = t.replace(g.allLineBreaks, "\n");
            for (var e = [], n = t.indexOf("\n"); -1 !== n;) e.push(t.substring(0, n)), t = t.substring(n + 1), n = t.indexOf("\n");
            return t.length && e.push(t), e
        }

        function o(t) {
            return t === T.ArrayLiteral
        }

        function p(t) {
            return i(t, [T.Expression, T.ForInitializer, T.Conditional])
        }

        function h(t, e) {
            for (var n = 0; n < t.length; n++) {
                if (t[n].trim().charAt(0) !== e) return !1
            }
            return !0
        }

        function l(t, e) {
            for (var n, i = 0, _ = t.length; i < _; i++) if ((n = t[i]) && 0 !== n.indexOf(e)) return !1;
            return !0
        }

        function c(t, e) {
            e = e || {}, this._source_text = t || "", this._output = null, this._tokens = null, this._last_last_text = null, this._flags = null, this._previous_flags = null, this._flag_store = null, this._options = new b(e)
        }

        var f = n(2).Output, d = n(3).Token, g = n(4), b = n(5).Options, m = n(7).Tokenizer, y = n(7).line_starters,
            w = n(7).positionable_operators, k = n(7).TOKEN,
            x = ["case", "return", "do", "if", "throw", "else", "await", "break", "continue", "async"],
            v = ["before-newline", "after-newline", "preserve-newline"], E = function (t) {
                for (var e = {}, n = 0; n < t.length; n++) e[t[n].replace(/-/g, "_")] = t[n];
                return e
            }(v), O = [E.before_newline, E.preserve_newline], T = {
                BlockStatement: "BlockStatement",
                Statement: "Statement",
                ObjectLiteral: "ObjectLiteral",
                ArrayLiteral: "ArrayLiteral",
                ForInitializer: "ForInitializer",
                Conditional: "Conditional",
                Expression: "Expression"
            };
        c.prototype.create_flags = function (t, e) {
            var n = 0;
            return t && (n = t.indentation_level, !this._output.just_added_newline() && t.line_indent_level > n && (n = t.line_indent_level)), {
                mode: e,
                parent: t,
                last_token: t ? t.last_token : new d(k.START_BLOCK, ""),
                last_word: t ? t.last_word : "",
                declaration_statement: !1,
                declaration_assignment: !1,
                multiline_frame: !1,
                inline_frame: !1,
                if_block: !1,
                else_block: !1,
                do_block: !1,
                do_while: !1,
                import_block: !1,
                in_case_statement: !1,
                in_case: !1,
                case_body: !1,
                indentation_level: n,
                alignment: 0,
                line_indent_level: t ? t.line_indent_level : n,
                start_line_index: this._output.get_line_number(),
                ternary_depth: 0
            }
        }, c.prototype._reset = function (t) {
            var e = t.match(/^[\t ]*/)[0];
            this._last_last_text = "", this._output = new f(this._options, e), this._output.raw = this._options.test_output_raw, this._flag_store = [], this.set_mode(T.BlockStatement);
            var n = new m(t, this._options);
            return this._tokens = n.tokenize(), t
        }, c.prototype.beautify = function () {
            if (this._options.disabled) return this._source_text;
            var t = this._reset(this._source_text), e = this._options.eol;
            "auto" === this._options.eol && (e = "\n", t && g.lineBreak.test(t || "") && (e = t.match(g.lineBreak)[0]));
            for (var n = this._tokens.next(); n;) this.handle_token(n), this._last_last_text = this._flags.last_token.text, this._flags.last_token = n, n = this._tokens.next();
            return this._output.get_code(e)
        }, c.prototype.handle_token = function (t, e) {
            t.type === k.START_EXPR ? this.handle_start_expr(t) : t.type === k.END_EXPR ? this.handle_end_expr(t) : t.type === k.START_BLOCK ? this.handle_start_block(t) : t.type === k.END_BLOCK ? this.handle_end_block(t) : t.type === k.WORD ? this.handle_word(t) : t.type === k.RESERVED ? this.handle_word(t) : t.type === k.SEMICOLON ? this.handle_semicolon(t) : t.type === k.STRING ? this.handle_string(t) : t.type === k.EQUALS ? this.handle_equals(t) : t.type === k.OPERATOR ? this.handle_operator(t) : t.type === k.COMMA ? this.handle_comma(t) : t.type === k.BLOCK_COMMENT ? this.handle_block_comment(t, e) : t.type === k.COMMENT ? this.handle_comment(t, e) : t.type === k.DOT ? this.handle_dot(t) : t.type === k.EOF ? this.handle_eof(t) : (t.type, k.UNKNOWN, this.handle_unknown(t, e))
        }, c.prototype.handle_whitespace_and_comments = function (t, e) {
            var n = t.newlines, i = this._options.keep_array_indentation && o(this._flags.mode);
            if (t.comments_before) for (var _ = t.comments_before.next(); _;) this.handle_whitespace_and_comments(_, e), this.handle_token(_, e), _ = t.comments_before.next();
            if (i) for (var s = 0; s < n; s += 1) this.print_newline(s > 0, e); else if (this._options.max_preserve_newlines && n > this._options.max_preserve_newlines && (n = this._options.max_preserve_newlines), this._options.preserve_newlines && n > 1) {
                this.print_newline(!1, e);
                for (var a = 1; a < n; a += 1) this.print_newline(!0, e)
            }
        };
        var R = ["async", "break", "continue", "return", "throw", "yield"];
        c.prototype.allow_wrap_or_preserved_newline = function (t, e) {
            if (e = void 0 !== e && e, !this._output.just_added_newline()) {
                var n = this._options.preserve_newlines && t.newlines || e;
                if (i(this._flags.last_token.text, w) || i(t.text, w)) {
                    var _ = i(this._flags.last_token.text, w) && i(this._options.operator_position, O) || i(t.text, w);
                    n = n && _
                }
                if (n) this.print_newline(!1, !0); else if (this._options.wrap_line_length) {
                    if (a(this._flags.last_token, R)) return;
                    this._output.set_wrap_point()
                }
            }
        }, c.prototype.print_newline = function (t, e) {
            if (!e && ";" !== this._flags.last_token.text && "," !== this._flags.last_token.text && "=" !== this._flags.last_token.text && (this._flags.last_token.type !== k.OPERATOR || "--" === this._flags.last_token.text || "++" === this._flags.last_token.text)) for (var n = this._tokens.peek(); !(this._flags.mode !== T.Statement || this._flags.if_block && s(n, "else") || this._flags.do_block);) this.restore_mode();
            this._output.add_new_line(t) && (this._flags.multiline_frame = !0)
        }, c.prototype.print_token_line_indentation = function (t) {
            this._output.just_added_newline() && (this._options.keep_array_indentation && t.newlines && ("[" === t.text || o(this._flags.mode)) ? (this._output.current_line.set_indent(-1), this._output.current_line.push(t.whitespace_before), this._output.space_before_token = !1) : this._output.set_indent(this._flags.indentation_level, this._flags.alignment) && (this._flags.line_indent_level = this._flags.indentation_level))
        }, c.prototype.print_token = function (t) {
            if (this._output.raw) return void this._output.add_raw_token(t);
            if (this._options.comma_first && t.previous && t.previous.type === k.COMMA && this._output.just_added_newline() && "," === this._output.previous_line.last()) {
                var e = this._output.previous_line.pop();
                this._output.previous_line.is_empty() && (this._output.previous_line.push(e), this._output.trim(!0), this._output.current_line.pop(), this._output.trim()), this.print_token_line_indentation(t), this._output.add_token(","), this._output.space_before_token = !0
            }
            this.print_token_line_indentation(t), this._output.non_breaking_space = !0, this._output.add_token(t.text), this._output.previous_token_wrapped && (this._flags.multiline_frame = !0)
        }, c.prototype.indent = function () {
            this._flags.indentation_level += 1, this._output.set_indent(this._flags.indentation_level, this._flags.alignment)
        }, c.prototype.deindent = function () {
            this._flags.indentation_level > 0 && (!this._flags.parent || this._flags.indentation_level > this._flags.parent.indentation_level) && (this._flags.indentation_level -= 1, this._output.set_indent(this._flags.indentation_level, this._flags.alignment))
        }, c.prototype.set_mode = function (t) {
            this._flags ? (this._flag_store.push(this._flags), this._previous_flags = this._flags) : this._previous_flags = this.create_flags(null, t), this._flags = this.create_flags(this._previous_flags, t), this._output.set_indent(this._flags.indentation_level, this._flags.alignment)
        }, c.prototype.restore_mode = function () {
            this._flag_store.length > 0 && (this._previous_flags = this._flags, this._flags = this._flag_store.pop(), this._previous_flags.mode === T.Statement && u(this._output, this._previous_flags), this._output.set_indent(this._flags.indentation_level, this._flags.alignment))
        }, c.prototype.start_of_object_property = function () {
            return this._flags.parent.mode === T.ObjectLiteral && this._flags.mode === T.Statement && (":" === this._flags.last_token.text && 0 === this._flags.ternary_depth || a(this._flags.last_token, ["get", "set"]))
        }, c.prototype.start_of_statement = function (t) {
            var e = !1;
            return e = e || a(this._flags.last_token, ["var", "let", "const"]) && t.type === k.WORD, e = e || s(this._flags.last_token, "do"), e = e || !(this._flags.parent.mode === T.ObjectLiteral && this._flags.mode === T.Statement) && a(this._flags.last_token, R) && !t.newlines, e = e || s(this._flags.last_token, "else") && !(s(t, "if") && !t.comments_before), e = e || this._flags.last_token.type === k.END_EXPR && (this._previous_flags.mode === T.ForInitializer || this._previous_flags.mode === T.Conditional), e = e || this._flags.last_token.type === k.WORD && this._flags.mode === T.BlockStatement && !this._flags.in_case && !("--" === t.text || "++" === t.text) && "function" !== this._last_last_text && t.type !== k.WORD && t.type !== k.RESERVED, !!(e = e || this._flags.mode === T.ObjectLiteral && (":" === this._flags.last_token.text && 0 === this._flags.ternary_depth || a(this._flags.last_token, ["get", "set"]))) && (this.set_mode(T.Statement), this.indent(), this.handle_whitespace_and_comments(t, !0), this.start_of_object_property() || this.allow_wrap_or_preserved_newline(t, a(t, ["do", "for", "if", "while"])), !0)
        }, c.prototype.handle_start_expr = function (t) {
            this.start_of_statement(t) || this.handle_whitespace_and_comments(t);
            var e = T.Expression;
            if ("[" === t.text) {
                if (this._flags.last_token.type === k.WORD || ")" === this._flags.last_token.text) return a(this._flags.last_token, y) && (this._output.space_before_token = !0), this.print_token(t), this.set_mode(e), this.indent(), void (this._options.space_in_paren && (this._output.space_before_token = !0));
                e = T.ArrayLiteral, o(this._flags.mode) && ("[" !== this._flags.last_token.text && ("," !== this._flags.last_token.text || "]" !== this._last_last_text && "}" !== this._last_last_text) || this._options.keep_array_indentation || this.print_newline()), i(this._flags.last_token.type, [k.START_EXPR, k.END_EXPR, k.WORD, k.OPERATOR]) || (this._output.space_before_token = !0)
            } else {
                if (this._flags.last_token.type === k.RESERVED) "for" === this._flags.last_token.text ? (this._output.space_before_token = this._options.space_before_conditional, e = T.ForInitializer) : i(this._flags.last_token.text, ["if", "while"]) ? (this._output.space_before_token = this._options.space_before_conditional, e = T.Conditional) : i(this._flags.last_word, ["await", "async"]) ? this._output.space_before_token = !0 : "import" === this._flags.last_token.text && "" === t.whitespace_before ? this._output.space_before_token = !1 : (i(this._flags.last_token.text, y) || "catch" === this._flags.last_token.text) && (this._output.space_before_token = !0); else if (this._flags.last_token.type === k.EQUALS || this._flags.last_token.type === k.OPERATOR) this.start_of_object_property() || this.allow_wrap_or_preserved_newline(t); else if (this._flags.last_token.type === k.WORD) {
                    this._output.space_before_token = !1;
                    var n = this._tokens.peek(-3);
                    if (this._options.space_after_named_function && n) {
                        var _ = this._tokens.peek(-4);
                        a(n, ["async", "function"]) || "*" === n.text && a(_, ["async", "function"]) ? this._output.space_before_token = !0 : this._flags.mode === T.ObjectLiteral && ("{" !== n.text && "," !== n.text && ("*" !== n.text || "{" !== _.text && "," !== _.text) || (this._output.space_before_token = !0))
                    }
                } else this.allow_wrap_or_preserved_newline(t);
                (this._flags.last_token.type === k.RESERVED && ("function" === this._flags.last_word || "typeof" === this._flags.last_word) || "*" === this._flags.last_token.text && (i(this._last_last_text, ["function", "yield"]) || this._flags.mode === T.ObjectLiteral && i(this._last_last_text, ["{", ","]))) && (this._output.space_before_token = this._options.space_after_anon_function)
            }
            ";" === this._flags.last_token.text || this._flags.last_token.type === k.START_BLOCK ? this.print_newline() : this._flags.last_token.type !== k.END_EXPR && this._flags.last_token.type !== k.START_EXPR && this._flags.last_token.type !== k.END_BLOCK && "." !== this._flags.last_token.text && this._flags.last_token.type !== k.COMMA || this.allow_wrap_or_preserved_newline(t, t.newlines), this.print_token(t), this.set_mode(e), this._options.space_in_paren && (this._output.space_before_token = !0), this.indent()
        }, c.prototype.handle_end_expr = function (t) {
            for (; this._flags.mode === T.Statement;) this.restore_mode();
            this.handle_whitespace_and_comments(t), this._flags.multiline_frame && this.allow_wrap_or_preserved_newline(t, "]" === t.text && o(this._flags.mode) && !this._options.keep_array_indentation), this._options.space_in_paren && (this._flags.last_token.type !== k.START_EXPR || this._options.space_in_empty_paren ? this._output.space_before_token = !0 : (this._output.trim(), this._output.space_before_token = !1)), this.deindent(), this.print_token(t), this.restore_mode(), u(this._output, this._previous_flags), this._flags.do_while && this._previous_flags.mode === T.Conditional && (this._previous_flags.mode = T.Expression, this._flags.do_block = !1, this._flags.do_while = !1)
        }, c.prototype.handle_start_block = function (t) {
            this.handle_whitespace_and_comments(t);
            var e = this._tokens.peek(), n = this._tokens.peek(1);
            "switch" === this._flags.last_word && this._flags.last_token.type === k.END_EXPR ? (this.set_mode(T.BlockStatement), this._flags.in_case_statement = !0) : this._flags.case_body ? this.set_mode(T.BlockStatement) : n && (i(n.text, [":", ","]) && i(e.type, [k.STRING, k.WORD, k.RESERVED]) || i(e.text, ["get", "set", "..."]) && i(n.type, [k.WORD, k.RESERVED])) ? i(this._last_last_text, ["class", "interface"]) ? this.set_mode(T.BlockStatement) : this.set_mode(T.ObjectLiteral) : this._flags.last_token.type === k.OPERATOR && "=>" === this._flags.last_token.text ? this.set_mode(T.BlockStatement) : i(this._flags.last_token.type, [k.EQUALS, k.START_EXPR, k.COMMA, k.OPERATOR]) || a(this._flags.last_token, ["return", "throw", "import", "default"]) ? this.set_mode(T.ObjectLiteral) : this.set_mode(T.BlockStatement);
            var _ = !e.comments_before && "}" === e.text,
                s = _ && "function" === this._flags.last_word && this._flags.last_token.type === k.END_EXPR;
            if (this._options.brace_preserve_inline) {
                var u = 0, r = null;
                this._flags.inline_frame = !0;
                do {
                    if (u += 1, r = this._tokens.peek(u - 1), r.newlines) {
                        this._flags.inline_frame = !1;
                        break
                    }
                } while (r.type !== k.EOF && (r.type !== k.END_BLOCK || r.opened !== t))
            }
            ("expand" === this._options.brace_style || "none" === this._options.brace_style && t.newlines) && !this._flags.inline_frame ? this._flags.last_token.type !== k.OPERATOR && (s || this._flags.last_token.type === k.EQUALS || a(this._flags.last_token, x) && "else" !== this._flags.last_token.text) ? this._output.space_before_token = !0 : this.print_newline(!1, !0) : (!o(this._previous_flags.mode) || this._flags.last_token.type !== k.START_EXPR && this._flags.last_token.type !== k.COMMA || ((this._flags.last_token.type === k.COMMA || this._options.space_in_paren) && (this._output.space_before_token = !0), (this._flags.last_token.type === k.COMMA || this._flags.last_token.type === k.START_EXPR && this._flags.inline_frame) && (this.allow_wrap_or_preserved_newline(t), this._previous_flags.multiline_frame = this._previous_flags.multiline_frame || this._flags.multiline_frame, this._flags.multiline_frame = !1)), this._flags.last_token.type !== k.OPERATOR && this._flags.last_token.type !== k.START_EXPR && (this._flags.last_token.type !== k.START_BLOCK || this._flags.inline_frame ? this._output.space_before_token = !0 : this.print_newline())), this.print_token(t), this.indent(), _ || this._options.brace_preserve_inline && this._flags.inline_frame || this.print_newline()
        }, c.prototype.handle_end_block = function (t) {
            for (this.handle_whitespace_and_comments(t); this._flags.mode === T.Statement;) this.restore_mode();
            var e = this._flags.last_token.type === k.START_BLOCK;
            this._flags.inline_frame && !e ? this._output.space_before_token = !0 : "expand" === this._options.brace_style ? e || this.print_newline() : e || (o(this._flags.mode) && this._options.keep_array_indentation ? (this._options.keep_array_indentation = !1, this.print_newline(), this._options.keep_array_indentation = !0) : this.print_newline()), this.restore_mode(), this.print_token(t)
        }, c.prototype.handle_word = function (t) {
            if (t.type === k.RESERVED) if (i(t.text, ["set", "get"]) && this._flags.mode !== T.ObjectLiteral) t.type = k.WORD; else if ("import" === t.text && "(" === this._tokens.peek().text) t.type = k.WORD; else if (i(t.text, ["as", "from"]) && !this._flags.import_block) t.type = k.WORD; else if (this._flags.mode === T.ObjectLiteral) {
                var e = this._tokens.peek();
                ":" === e.text && (t.type = k.WORD)
            }
            if (this.start_of_statement(t) ? a(this._flags.last_token, ["var", "let", "const"]) && t.type === k.WORD && (this._flags.declaration_statement = !0) : !t.newlines || p(this._flags.mode) || this._flags.last_token.type === k.OPERATOR && "--" !== this._flags.last_token.text && "++" !== this._flags.last_token.text || this._flags.last_token.type === k.EQUALS || !this._options.preserve_newlines && a(this._flags.last_token, ["var", "let", "const", "set", "get"]) ? this.handle_whitespace_and_comments(t) : (this.handle_whitespace_and_comments(t), this.print_newline()), this._flags.do_block && !this._flags.do_while) {
                if (s(t, "while")) return this._output.space_before_token = !0, this.print_token(t), this._output.space_before_token = !0, void (this._flags.do_while = !0);
                this.print_newline(), this._flags.do_block = !1
            }
            if (this._flags.if_block) if (!this._flags.else_block && s(t, "else")) this._flags.else_block = !0; else {
                for (; this._flags.mode === T.Statement;) this.restore_mode();
                this._flags.if_block = !1, this._flags.else_block = !1
            }
            if (this._flags.in_case_statement && a(t, ["case", "default"])) return this.print_newline(), this._flags.last_token.type !== k.END_BLOCK && (this._flags.case_body || this._options.jslint_happy) && this.deindent(), this._flags.case_body = !1, this.print_token(t), void (this._flags.in_case = !0);
            if (this._flags.last_token.type !== k.COMMA && this._flags.last_token.type !== k.START_EXPR && this._flags.last_token.type !== k.EQUALS && this._flags.last_token.type !== k.OPERATOR || this.start_of_object_property() || this.allow_wrap_or_preserved_newline(t), s(t, "function")) return (i(this._flags.last_token.text, ["}", ";"]) || this._output.just_added_newline() && !i(this._flags.last_token.text, ["(", "[", "{", ":", "=", ","]) && this._flags.last_token.type !== k.OPERATOR) && (this._output.just_added_blankline() || t.comments_before || (this.print_newline(), this.print_newline(!0))), this._flags.last_token.type === k.RESERVED || this._flags.last_token.type === k.WORD ? a(this._flags.last_token, ["get", "set", "new", "export"]) || a(this._flags.last_token, R) ? this._output.space_before_token = !0 : s(this._flags.last_token, "default") && "export" === this._last_last_text ? this._output.space_before_token = !0 : "declare" === this._flags.last_token.text ? this._output.space_before_token = !0 : this.print_newline() : this._flags.last_token.type === k.OPERATOR || "=" === this._flags.last_token.text ? this._output.space_before_token = !0 : (this._flags.multiline_frame || !p(this._flags.mode) && !o(this._flags.mode)) && this.print_newline(), this.print_token(t), void (this._flags.last_word = t.text);
            var n = "NONE";
            if (this._flags.last_token.type === k.END_BLOCK ? this._previous_flags.inline_frame ? n = "SPACE" : a(t, ["else", "catch", "finally", "from"]) ? "expand" === this._options.brace_style || "end-expand" === this._options.brace_style || "none" === this._options.brace_style && t.newlines ? n = "NEWLINE" : (n = "SPACE", this._output.space_before_token = !0) : n = "NEWLINE" : this._flags.last_token.type === k.SEMICOLON && this._flags.mode === T.BlockStatement ? n = "NEWLINE" : this._flags.last_token.type === k.SEMICOLON && p(this._flags.mode) ? n = "SPACE" : this._flags.last_token.type === k.STRING ? n = "NEWLINE" : this._flags.last_token.type === k.RESERVED || this._flags.last_token.type === k.WORD || "*" === this._flags.last_token.text && (i(this._last_last_text, ["function", "yield"]) || this._flags.mode === T.ObjectLiteral && i(this._last_last_text, ["{", ","])) ? n = "SPACE" : this._flags.last_token.type === k.START_BLOCK ? n = this._flags.inline_frame ? "SPACE" : "NEWLINE" : this._flags.last_token.type === k.END_EXPR && (this._output.space_before_token = !0, n = "NEWLINE"), a(t, y) && ")" !== this._flags.last_token.text && (n = this._flags.inline_frame || "else" === this._flags.last_token.text || "export" === this._flags.last_token.text ? "SPACE" : "NEWLINE"), a(t, ["else", "catch", "finally"])) if ((this._flags.last_token.type !== k.END_BLOCK || this._previous_flags.mode !== T.BlockStatement || "expand" === this._options.brace_style || "end-expand" === this._options.brace_style || "none" === this._options.brace_style && t.newlines) && !this._flags.inline_frame) this.print_newline(); else {
                this._output.trim(!0);
                var _ = this._output.current_line;
                "}" !== _.last() && this.print_newline(), this._output.space_before_token = !0
            } else "NEWLINE" === n ? a(this._flags.last_token, x) ? this._output.space_before_token = !0 : "declare" === this._flags.last_token.text && a(t, ["var", "let", "const"]) ? this._output.space_before_token = !0 : this._flags.last_token.type !== k.END_EXPR ? this._flags.last_token.type === k.START_EXPR && a(t, ["var", "let", "const"]) || ":" === this._flags.last_token.text || (s(t, "if") && s(t.previous, "else") ? this._output.space_before_token = !0 : this.print_newline()) : a(t, y) && ")" !== this._flags.last_token.text && this.print_newline() : this._flags.multiline_frame && o(this._flags.mode) && "," === this._flags.last_token.text && "}" === this._last_last_text ? this.print_newline() : "SPACE" === n && (this._output.space_before_token = !0);
            !t.previous || t.previous.type !== k.WORD && t.previous.type !== k.RESERVED || (this._output.space_before_token = !0), this.print_token(t), this._flags.last_word = t.text, t.type === k.RESERVED && ("do" === t.text ? this._flags.do_block = !0 : "if" === t.text ? this._flags.if_block = !0 : "import" === t.text ? this._flags.import_block = !0 : this._flags.import_block && s(t, "from") && (this._flags.import_block = !1))
        }, c.prototype.handle_semicolon = function (t) {
            this.start_of_statement(t) ? this._output.space_before_token = !1 : this.handle_whitespace_and_comments(t);
            for (var e = this._tokens.peek(); !(this._flags.mode !== T.Statement || this._flags.if_block && s(e, "else") || this._flags.do_block);) this.restore_mode();
            this._flags.import_block && (this._flags.import_block = !1), this.print_token(t)
        }, c.prototype.handle_string = function (t) {
            this.start_of_statement(t) ? this._output.space_before_token = !0 : (this.handle_whitespace_and_comments(t), this._flags.last_token.type === k.RESERVED || this._flags.last_token.type === k.WORD || this._flags.inline_frame ? this._output.space_before_token = !0 : this._flags.last_token.type === k.COMMA || this._flags.last_token.type === k.START_EXPR || this._flags.last_token.type === k.EQUALS || this._flags.last_token.type === k.OPERATOR ? this.start_of_object_property() || this.allow_wrap_or_preserved_newline(t) : this.print_newline()), this.print_token(t)
        }, c.prototype.handle_equals = function (t) {
            this.start_of_statement(t) || this.handle_whitespace_and_comments(t), this._flags.declaration_statement && (this._flags.declaration_assignment = !0), this._output.space_before_token = !0, this.print_token(t), this._output.space_before_token = !0
        }, c.prototype.handle_comma = function (t) {
            this.handle_whitespace_and_comments(t, !0), this.print_token(t), this._output.space_before_token = !0, this._flags.declaration_statement ? (p(this._flags.parent.mode) && (this._flags.declaration_assignment = !1), this._flags.declaration_assignment ? (this._flags.declaration_assignment = !1, this.print_newline(!1, !0)) : this._options.comma_first && this.allow_wrap_or_preserved_newline(t)) : this._flags.mode === T.ObjectLiteral || this._flags.mode === T.Statement && this._flags.parent.mode === T.ObjectLiteral ? (this._flags.mode === T.Statement && this.restore_mode(), this._flags.inline_frame || this.print_newline()) : this._options.comma_first && this.allow_wrap_or_preserved_newline(t)
        }, c.prototype.handle_operator = function (t) {
            var e = "*" === t.text && (a(this._flags.last_token, ["function", "yield"]) || i(this._flags.last_token.type, [k.START_BLOCK, k.COMMA, k.END_BLOCK, k.SEMICOLON])),
                n = i(t.text, ["-", "+"]) && (i(this._flags.last_token.type, [k.START_BLOCK, k.START_EXPR, k.EQUALS, k.OPERATOR]) || i(this._flags.last_token.text, y) || "," === this._flags.last_token.text);
            if (this.start_of_statement(t)) ; else {
                var _ = !e;
                this.handle_whitespace_and_comments(t, _)
            }
            if (a(this._flags.last_token, x)) return this._output.space_before_token = !0, void this.print_token(t);
            if ("*" === t.text && this._flags.last_token.type === k.DOT) return void this.print_token(t);
            if ("::" === t.text) return void this.print_token(t);
            if (this._flags.last_token.type === k.OPERATOR && i(this._options.operator_position, O) && this.allow_wrap_or_preserved_newline(t), ":" === t.text && this._flags.in_case) return this.print_token(t), this._flags.in_case = !1, this._flags.case_body = !0, void (this._tokens.peek().type !== k.START_BLOCK ? (this.indent(), this.print_newline()) : this._output.space_before_token = !0);
            var s = !0, u = !0, r = !1;
            if (":" === t.text ? 0 === this._flags.ternary_depth ? s = !1 : (this._flags.ternary_depth -= 1, r = !0) : "?" === t.text && (this._flags.ternary_depth += 1), !n && !e && this._options.preserve_newlines && i(t.text, w)) {
                var o = ":" === t.text, h = o && r, l = o && !r;
                switch (this._options.operator_position) {
                    case E.before_newline:
                        return this._output.space_before_token = !l, this.print_token(t), o && !h || this.allow_wrap_or_preserved_newline(t), void (this._output.space_before_token = !0);
                    case E.after_newline:
                        return this._output.space_before_token = !0, !o || h ? this._tokens.peek().newlines ? this.print_newline(!1, !0) : this.allow_wrap_or_preserved_newline(t) : this._output.space_before_token = !1, this.print_token(t), void (this._output.space_before_token = !0);
                    case E.preserve_newline:
                        return l || this.allow_wrap_or_preserved_newline(t), s = !(this._output.just_added_newline() || l), this._output.space_before_token = s, this.print_token(t), void (this._output.space_before_token = !0)
                }
            }
            if (e) {
                this.allow_wrap_or_preserved_newline(t), s = !1;
                var c = this._tokens.peek();
                u = c && i(c.type, [k.WORD, k.RESERVED])
            } else "..." === t.text ? (this.allow_wrap_or_preserved_newline(t), s = this._flags.last_token.type === k.START_BLOCK, u = !1) : (i(t.text, ["--", "++", "!", "~"]) || n) && (this._flags.last_token.type !== k.COMMA && this._flags.last_token.type !== k.START_EXPR || this.allow_wrap_or_preserved_newline(t), s = !1, u = !1, !t.newlines || "--" !== t.text && "++" !== t.text || this.print_newline(!1, !0), ";" === this._flags.last_token.text && p(this._flags.mode) && (s = !0), this._flags.last_token.type === k.RESERVED ? s = !0 : this._flags.last_token.type === k.END_EXPR ? s = !("]" === this._flags.last_token.text && ("--" === t.text || "++" === t.text)) : this._flags.last_token.type === k.OPERATOR && (s = i(t.text, ["--", "-", "++", "+"]) && i(this._flags.last_token.text, ["--", "-", "++", "+"]), i(t.text, ["+", "-"]) && i(this._flags.last_token.text, ["--", "++"]) && (u = !0)), (this._flags.mode !== T.BlockStatement || this._flags.inline_frame) && this._flags.mode !== T.Statement || "{" !== this._flags.last_token.text && ";" !== this._flags.last_token.text || this.print_newline());
            this._output.space_before_token = this._output.space_before_token || s, this.print_token(t), this._output.space_before_token = u
        }, c.prototype.handle_block_comment = function (t, e) {
            return this._output.raw ? (this._output.add_raw_token(t), void (t.directives && "end" === t.directives.preserve && (this._output.raw = this._options.test_output_raw))) : t.directives ? (this.print_newline(!1, e), this.print_token(t), "start" === t.directives.preserve && (this._output.raw = !0), void this.print_newline(!1, !0)) : g.newline.test(t.text) || t.newlines ? void this.print_block_commment(t, e) : (this._output.space_before_token = !0, this.print_token(t), void (this._output.space_before_token = !0))
        }, c.prototype.print_block_commment = function (t, e) {
            var n, i = r(t.text), s = !1, a = !1, u = t.whitespace_before, o = u.length;
            if (this.print_newline(!1, e), this.print_token_line_indentation(t), this._output.add_token(i[0]), this.print_newline(!1, e), i.length > 1) {
                for (i = i.slice(1), s = h(i, "*"), a = l(i, u), s && (this._flags.alignment = 1), n = 0; n < i.length; n++) s ? (this.print_token_line_indentation(t), this._output.add_token(_(i[n]))) : a && i[n] ? (this.print_token_line_indentation(t), this._output.add_token(i[n].substring(o))) : (this._output.current_line.set_indent(-1), this._output.add_token(i[n])), this.print_newline(!1, e);
                this._flags.alignment = 0
            }
        }, c.prototype.handle_comment = function (t, e) {
            t.newlines ? this.print_newline(!1, e) : this._output.trim(!0), this._output.space_before_token = !0, this.print_token(t), this.print_newline(!1, e)
        }, c.prototype.handle_dot = function (t) {
            this.start_of_statement(t) || this.handle_whitespace_and_comments(t, !0), a(this._flags.last_token, x) ? this._output.space_before_token = !1 : this.allow_wrap_or_preserved_newline(t, ")" === this._flags.last_token.text && this._options.break_chained_methods), this._options.unindent_chained_methods && this._output.just_added_newline() && this.deindent(), this.print_token(t)
        }, c.prototype.handle_unknown = function (t, e) {
            this.print_token(t), "\n" === t.text[t.text.length - 1] && this.print_newline(!1, e)
        }, c.prototype.handle_eof = function (t) {
            for (; this._flags.mode === T.Statement;) this.restore_mode();
            this.handle_whitespace_and_comments(t)
        }, t.exports.Beautifier = c
    }, function (t, e, n) {
        function i(t) {
            this.__parent = t, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = []
        }

        function _(t, e) {
            this.__cache = [""], this.__indent_size = t.indent_size, this.__indent_string = t.indent_char, t.indent_with_tabs || (this.__indent_string = new Array(t.indent_size + 1).join(t.indent_char)), e = e || "", t.indent_level > 0 && (e = new Array(t.indent_level + 1).join(this.__indent_string)), this.__base_string = e, this.__base_string_length = e.length
        }

        function s(t, e) {
            this.__indent_cache = new _(t, e), this.raw = !1, this._end_with_newline = t.end_with_newline, this.indent_size = t.indent_size, this.wrap_line_length = t.wrap_line_length, this.indent_empty_lines = t.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new i(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline()
        }

        i.prototype.clone_empty = function () {
            var t = new i(this.__parent);
            return t.set_indent(this.__indent_count, this.__alignment_count), t
        }, i.prototype.item = function (t) {
            return t < 0 ? this.__items[this.__items.length + t] : this.__items[t]
        }, i.prototype.has_match = function (t) {
            for (var e = this.__items.length - 1; e >= 0; e--) if (this.__items[e].match(t)) return !0;
            return !1
        }, i.prototype.set_indent = function (t, e) {
            this.is_empty() && (this.__indent_count = t || 0, this.__alignment_count = e || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count))
        }, i.prototype._set_wrap_point = function () {
            this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count)
        }, i.prototype._should_wrap = function () {
            return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count
        }, i.prototype._allow_wrap = function () {
            if (this._should_wrap()) {
                this.__parent.add_new_line();
                var t = this.__parent.current_line;
                return t.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), t.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), t.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, " " === t.__items[0] && (t.__items.splice(0, 1), t.__character_count -= 1), !0
            }
            return !1
        }, i.prototype.is_empty = function () {
            return 0 === this.__items.length
        }, i.prototype.last = function () {
            return this.is_empty() ? null : this.__items[this.__items.length - 1]
        }, i.prototype.push = function (t) {
            this.__items.push(t);
            var e = t.lastIndexOf("\n");
            -1 !== e ? this.__character_count = t.length - e : this.__character_count += t.length
        }, i.prototype.pop = function () {
            var t = null;
            return this.is_empty() || (t = this.__items.pop(), this.__character_count -= t.length), t
        }, i.prototype._remove_indent = function () {
            this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size)
        }, i.prototype._remove_wrap_indent = function () {
            this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1)
        }, i.prototype.trim = function () {
            for (; " " === this.last();) this.__items.pop(), this.__character_count -= 1
        }, i.prototype.toString = function () {
            var t = "";
            return this.is_empty() ? this.__parent.indent_empty_lines && (t = this.__parent.get_indent_string(this.__indent_count)) : (t = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), t += this.__items.join("")), t
        }, _.prototype.get_indent_size = function (t, e) {
            var n = this.__base_string_length;
            return e = e || 0, t < 0 && (n = 0), n += t * this.__indent_size, n += e
        }, _.prototype.get_indent_string = function (t, e) {
            var n = this.__base_string;
            return e = e || 0, t < 0 && (t = 0, n = ""), e += t * this.__indent_size, this.__ensure_cache(e), n += this.__cache[e]
        }, _.prototype.__ensure_cache = function (t) {
            for (; t >= this.__cache.length;) this.__add_column()
        }, _.prototype.__add_column = function () {
            var t = this.__cache.length, e = 0, n = "";
            this.__indent_size && t >= this.__indent_size && (e = Math.floor(t / this.__indent_size), t -= e * this.__indent_size, n = new Array(e + 1).join(this.__indent_string)), t && (n += new Array(t + 1).join(" ")), this.__cache.push(n)
        }, s.prototype.__add_outputline = function () {
            this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line)
        }, s.prototype.get_line_number = function () {
            return this.__lines.length
        }, s.prototype.get_indent_string = function (t, e) {
            return this.__indent_cache.get_indent_string(t, e)
        }, s.prototype.get_indent_size = function (t, e) {
            return this.__indent_cache.get_indent_size(t, e)
        }, s.prototype.is_empty = function () {
            return !this.previous_line && this.current_line.is_empty()
        }, s.prototype.add_new_line = function (t) {
            return !(this.is_empty() || !t && this.just_added_newline()) && (this.raw || this.__add_outputline(), !0)
        }, s.prototype.get_code = function (t) {
            this.trim(!0);
            var e = this.current_line.pop();
            e && ("\n" === e[e.length - 1] && (e = e.replace(/\n+$/g, "")), this.current_line.push(e)), this._end_with_newline && this.__add_outputline();
            var n = this.__lines.join("\n");
            return "\n" !== t && (n = n.replace(/[\n]/g, t)), n
        }, s.prototype.set_wrap_point = function () {
            this.current_line._set_wrap_point()
        }, s.prototype.set_indent = function (t, e) {
            return t = t || 0, e = e || 0, this.next_line.set_indent(t, e), this.__lines.length > 1 ? (this.current_line.set_indent(t, e), !0) : (this.current_line.set_indent(), !1)
        }, s.prototype.add_raw_token = function (t) {
            for (var e = 0; e < t.newlines; e++) this.__add_outputline();
            this.current_line.set_indent(-1), this.current_line.push(t.whitespace_before), this.current_line.push(t.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1
        }, s.prototype.add_token = function (t) {
            this.__add_space_before_token(), this.current_line.push(t), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap()
        }, s.prototype.__add_space_before_token = function () {
            this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "))
        }, s.prototype.remove_indent = function (t) {
            for (var e = this.__lines.length; t < e;) this.__lines[t]._remove_indent(), t++;
            this.current_line._remove_wrap_indent()
        }, s.prototype.trim = function (t) {
            for (t = void 0 !== t && t, this.current_line.trim(); t && this.__lines.length > 1 && this.current_line.is_empty();) this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
            this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null
        }, s.prototype.just_added_newline = function () {
            return this.current_line.is_empty()
        }, s.prototype.just_added_blankline = function () {
            return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty()
        }, s.prototype.ensure_empty_line_above = function (t, e) {
            for (var n = this.__lines.length - 2; n >= 0;) {
                var _ = this.__lines[n];
                if (_.is_empty()) break;
                if (0 !== _.item(0).indexOf(t) && _.item(-1) !== e) {
                    this.__lines.splice(n + 1, 0, new i(this)), this.previous_line = this.__lines[this.__lines.length - 2];
                    break
                }
                n--
            }
        }, t.exports.Output = s
    }, function (t, e, n) {
        function i(t, e, n, i) {
            this.type = t, this.text = e, this.comments_before = null, this.newlines = n || 0, this.whitespace_before = i || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null
        }

        t.exports.Token = i
    }, function (t, e, n) {
        var i = "\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc",
            _ = "\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f",
            s = "(?:\\\\u[0-9a-fA-F]{4}|[\\x23\\x24\\x40\\x41-\\x5a\\x5f\\x61-\\x7a" + i + "])";
        e.identifier = new RegExp(s + "(?:\\\\u[0-9a-fA-F]{4}|[\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a\\xaa\\xb5\\xba\\xc0-\\xd6\\xd8-\\xf6\\xf8-\\u02c1\\u02c6-\\u02d1\\u02e0-\\u02e4\\u02ec\\u02ee\\u0370-\\u0374\\u0376\\u0377\\u037a-\\u037d\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03f5\\u03f7-\\u0481\\u048a-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0620-\\u064a\\u066e\\u066f\\u0671-\\u06d3\\u06d5\\u06e5\\u06e6\\u06ee\\u06ef\\u06fa-\\u06fc\\u06ff\\u0710\\u0712-\\u072f\\u074d-\\u07a5\\u07b1\\u07ca-\\u07ea\\u07f4\\u07f5\\u07fa\\u0800-\\u0815\\u081a\\u0824\\u0828\\u0840-\\u0858\\u08a0\\u08a2-\\u08ac\\u0904-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09bd\\u09ce\\u09dc\\u09dd\\u09df-\\u09e1\\u09f0\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a72-\\u0a74\\u0a85-\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae1\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b35-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b71\\u0b83\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb9\\u0bd0\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c3d\\u0c58\\u0c59\\u0c60\\u0c61\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cbd\\u0cde\\u0ce0\\u0ce1\\u0cf1\\u0cf2\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d3a\\u0d3d\\u0d4e\\u0d60\\u0d61\\u0d7a-\\u0d7f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e46\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ec6\\u0edc-\\u0edf\\u0f00\\u0f40-\\u0f47\\u0f49-\\u0f6c\\u0f88-\\u0f8c\\u1000-\\u102a\\u103f\\u1050-\\u1055\\u105a-\\u105d\\u1061\\u1065\\u1066\\u106e-\\u1070\\u1075-\\u1081\\u108e\\u10a0-\\u10c5\\u10c7\\u10cd\\u10d0-\\u10fa\\u10fc-\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1288\\u128a-\\u128d\\u1290-\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12d6\\u12d8-\\u1310\\u1312-\\u1315\\u1318-\\u135a\\u1380-\\u138f\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u167f\\u1681-\\u169a\\u16a0-\\u16ea\\u16ee-\\u16f0\\u1700-\\u170c\\u170e-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176c\\u176e-\\u1770\\u1780-\\u17b3\\u17d7\\u17dc\\u1820-\\u1877\\u1880-\\u18a8\\u18aa\\u18b0-\\u18f5\\u1900-\\u191c\\u1950-\\u196d\\u1970-\\u1974\\u1980-\\u19ab\\u19c1-\\u19c7\\u1a00-\\u1a16\\u1a20-\\u1a54\\u1aa7\\u1b05-\\u1b33\\u1b45-\\u1b4b\\u1b83-\\u1ba0\\u1bae\\u1baf\\u1bba-\\u1be5\\u1c00-\\u1c23\\u1c4d-\\u1c4f\\u1c5a-\\u1c7d\\u1ce9-\\u1cec\\u1cee-\\u1cf1\\u1cf5\\u1cf6\\u1d00-\\u1dbf\\u1e00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u2071\\u207f\\u2090-\\u209c\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2139\\u213c-\\u213f\\u2145-\\u2149\\u214e\\u2160-\\u2188\\u2c00-\\u2c2e\\u2c30-\\u2c5e\\u2c60-\\u2ce4\\u2ceb-\\u2cee\\u2cf2\\u2cf3\\u2d00-\\u2d25\\u2d27\\u2d2d\\u2d30-\\u2d67\\u2d6f\\u2d80-\\u2d96\\u2da0-\\u2da6\\u2da8-\\u2dae\\u2db0-\\u2db6\\u2db8-\\u2dbe\\u2dc0-\\u2dc6\\u2dc8-\\u2dce\\u2dd0-\\u2dd6\\u2dd8-\\u2dde\\u2e2f\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303c\\u3041-\\u3096\\u309d-\\u309f\\u30a1-\\u30fa\\u30fc-\\u30ff\\u3105-\\u312d\\u3131-\\u318e\\u31a0-\\u31ba\\u31f0-\\u31ff\\u3400-\\u4db5\\u4e00-\\u9fcc\\ua000-\\ua48c\\ua4d0-\\ua4fd\\ua500-\\ua60c\\ua610-\\ua61f\\ua62a\\ua62b\\ua640-\\ua66e\\ua67f-\\ua697\\ua6a0-\\ua6ef\\ua717-\\ua71f\\ua722-\\ua788\\ua78b-\\ua78e\\ua790-\\ua793\\ua7a0-\\ua7aa\\ua7f8-\\ua801\\ua803-\\ua805\\ua807-\\ua80a\\ua80c-\\ua822\\ua840-\\ua873\\ua882-\\ua8b3\\ua8f2-\\ua8f7\\ua8fb\\ua90a-\\ua925\\ua930-\\ua946\\ua960-\\ua97c\\ua984-\\ua9b2\\ua9cf\\uaa00-\\uaa28\\uaa40-\\uaa42\\uaa44-\\uaa4b\\uaa60-\\uaa76\\uaa7a\\uaa80-\\uaaaf\\uaab1\\uaab5\\uaab6\\uaab9-\\uaabd\\uaac0\\uaac2\\uaadb-\\uaadd\\uaae0-\\uaaea\\uaaf2-\\uaaf4\\uab01-\\uab06\\uab09-\\uab0e\\uab11-\\uab16\\uab20-\\uab26\\uab28-\\uab2e\\uabc0-\\uabe2\\uac00-\\ud7a3\\ud7b0-\\ud7c6\\ud7cb-\\ud7fb\\uf900-\\ufa6d\\ufa70-\\ufad9\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe70-\\ufe74\\ufe76-\\ufefc\\uff21-\\uff3a\\uff41-\\uff5a\\uff66-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc\\u0300-\\u036f\\u0483-\\u0487\\u0591-\\u05bd\\u05bf\\u05c1\\u05c2\\u05c4\\u05c5\\u05c7\\u0610-\\u061a\\u0620-\\u0649\\u0672-\\u06d3\\u06e7-\\u06e8\\u06fb-\\u06fc\\u0730-\\u074a\\u0800-\\u0814\\u081b-\\u0823\\u0825-\\u0827\\u0829-\\u082d\\u0840-\\u0857\\u08e4-\\u08fe\\u0900-\\u0903\\u093a-\\u093c\\u093e-\\u094f\\u0951-\\u0957\\u0962-\\u0963\\u0966-\\u096f\\u0981-\\u0983\\u09bc\\u09be-\\u09c4\\u09c7\\u09c8\\u09d7\\u09df-\\u09e0\\u0a01-\\u0a03\\u0a3c\\u0a3e-\\u0a42\\u0a47\\u0a48\\u0a4b-\\u0a4d\\u0a51\\u0a66-\\u0a71\\u0a75\\u0a81-\\u0a83\\u0abc\\u0abe-\\u0ac5\\u0ac7-\\u0ac9\\u0acb-\\u0acd\\u0ae2-\\u0ae3\\u0ae6-\\u0aef\\u0b01-\\u0b03\\u0b3c\\u0b3e-\\u0b44\\u0b47\\u0b48\\u0b4b-\\u0b4d\\u0b56\\u0b57\\u0b5f-\\u0b60\\u0b66-\\u0b6f\\u0b82\\u0bbe-\\u0bc2\\u0bc6-\\u0bc8\\u0bca-\\u0bcd\\u0bd7\\u0be6-\\u0bef\\u0c01-\\u0c03\\u0c46-\\u0c48\\u0c4a-\\u0c4d\\u0c55\\u0c56\\u0c62-\\u0c63\\u0c66-\\u0c6f\\u0c82\\u0c83\\u0cbc\\u0cbe-\\u0cc4\\u0cc6-\\u0cc8\\u0cca-\\u0ccd\\u0cd5\\u0cd6\\u0ce2-\\u0ce3\\u0ce6-\\u0cef\\u0d02\\u0d03\\u0d46-\\u0d48\\u0d57\\u0d62-\\u0d63\\u0d66-\\u0d6f\\u0d82\\u0d83\\u0dca\\u0dcf-\\u0dd4\\u0dd6\\u0dd8-\\u0ddf\\u0df2\\u0df3\\u0e34-\\u0e3a\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0eb4-\\u0eb9\\u0ec8-\\u0ecd\\u0ed0-\\u0ed9\\u0f18\\u0f19\\u0f20-\\u0f29\\u0f35\\u0f37\\u0f39\\u0f41-\\u0f47\\u0f71-\\u0f84\\u0f86-\\u0f87\\u0f8d-\\u0f97\\u0f99-\\u0fbc\\u0fc6\\u1000-\\u1029\\u1040-\\u1049\\u1067-\\u106d\\u1071-\\u1074\\u1082-\\u108d\\u108f-\\u109d\\u135d-\\u135f\\u170e-\\u1710\\u1720-\\u1730\\u1740-\\u1750\\u1772\\u1773\\u1780-\\u17b2\\u17dd\\u17e0-\\u17e9\\u180b-\\u180d\\u1810-\\u1819\\u1920-\\u192b\\u1930-\\u193b\\u1951-\\u196d\\u19b0-\\u19c0\\u19c8-\\u19c9\\u19d0-\\u19d9\\u1a00-\\u1a15\\u1a20-\\u1a53\\u1a60-\\u1a7c\\u1a7f-\\u1a89\\u1a90-\\u1a99\\u1b46-\\u1b4b\\u1b50-\\u1b59\\u1b6b-\\u1b73\\u1bb0-\\u1bb9\\u1be6-\\u1bf3\\u1c00-\\u1c22\\u1c40-\\u1c49\\u1c5b-\\u1c7d\\u1cd0-\\u1cd2\\u1d00-\\u1dbe\\u1e01-\\u1f15\\u200c\\u200d\\u203f\\u2040\\u2054\\u20d0-\\u20dc\\u20e1\\u20e5-\\u20f0\\u2d81-\\u2d96\\u2de0-\\u2dff\\u3021-\\u3028\\u3099\\u309a\\ua640-\\ua66d\\ua674-\\ua67d\\ua69f\\ua6f0-\\ua6f1\\ua7f8-\\ua800\\ua806\\ua80b\\ua823-\\ua827\\ua880-\\ua881\\ua8b4-\\ua8c4\\ua8d0-\\ua8d9\\ua8f3-\\ua8f7\\ua900-\\ua909\\ua926-\\ua92d\\ua930-\\ua945\\ua980-\\ua983\\ua9b3-\\ua9c0\\uaa00-\\uaa27\\uaa40-\\uaa41\\uaa4c-\\uaa4d\\uaa50-\\uaa59\\uaa7b\\uaae0-\\uaae9\\uaaf2-\\uaaf3\\uabc0-\\uabe1\\uabec\\uabed\\uabf0-\\uabf9\\ufb20-\\ufb28\\ufe00-\\ufe0f\\ufe20-\\ufe26\\ufe33\\ufe34\\ufe4d-\\ufe4f\\uff10-\\uff19\\uff3f])*", "g"), e.identifierStart = new RegExp(s), e.identifierMatch = new RegExp("(?:\\\\u[0-9a-fA-F]{4}|[\\x24\\x30-\\x39\\x41-\\x5a\\x5f\\x61-\\x7a" + i + _ + "])+");
        e.newline = /[\n\r\u2028\u2029]/, e.lineBreak = new RegExp("\r\n|" + e.newline.source), e.allLineBreaks = new RegExp(e.lineBreak.source, "g")
    }, function (t, e, n) {
        function i(t) {
            _.call(this, t, "js");
            var e = this.raw_options.brace_style || null;
            "expand-strict" === e ? this.raw_options.brace_style = "expand" : "collapse-preserve-inline" === e ? this.raw_options.brace_style = "collapse,preserve-inline" : void 0 !== this.raw_options.braces_on_own_line && (this.raw_options.brace_style = this.raw_options.braces_on_own_line ? "expand" : "collapse");
            var n = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
            this.brace_preserve_inline = !1, this.brace_style = "collapse";
            for (var i = 0; i < n.length; i++) "preserve-inline" === n[i] ? this.brace_preserve_inline = !0 : this.brace_style = n[i];
            this.unindent_chained_methods = this._get_boolean("unindent_chained_methods"), this.break_chained_methods = this._get_boolean("break_chained_methods"), this.space_in_paren = this._get_boolean("space_in_paren"), this.space_in_empty_paren = this._get_boolean("space_in_empty_paren"), this.jslint_happy = this._get_boolean("jslint_happy"), this.space_after_anon_function = this._get_boolean("space_after_anon_function"), this.space_after_named_function = this._get_boolean("space_after_named_function"), this.keep_array_indentation = this._get_boolean("keep_array_indentation"), this.space_before_conditional = this._get_boolean("space_before_conditional", !0), this.unescape_strings = this._get_boolean("unescape_strings"), this.e4x = this._get_boolean("e4x"), this.comma_first = this._get_boolean("comma_first"), this.operator_position = this._get_selection("operator_position", s), this.test_output_raw = this._get_boolean("test_output_raw"), this.jslint_happy && (this.space_after_anon_function = !0)
        }

        var _ = n(6).Options, s = ["before-newline", "after-newline", "preserve-newline"];
        i.prototype = new _, t.exports.Options = i
    }, function (t, e, n) {
        function i(t, e) {
            this.raw_options = _(t, e), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", "\t" === this.indent_char), this.indent_with_tabs && (this.indent_char = "\t", 1 === this.indent_size && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php"], ["auto"])
        }

        function _(t, e) {
            var n = {};
            t = s(t);
            var i;
            for (i in t) i !== e && (n[i] = t[i]);
            if (e && t[e]) for (i in t[e]) n[i] = t[e][i];
            return n
        }

        function s(t) {
            var e, n = {};
            for (e in t) {
                n[e.replace(/-/g, "_")] = t[e]
            }
            return n
        }

        i.prototype._get_array = function (t, e) {
            var n = this.raw_options[t], i = e || [];
            return "object" == typeof n ? null !== n && "function" == typeof n.concat && (i = n.concat()) : "string" == typeof n && (i = n.split(/[^a-zA-Z0-9_\/\-]+/)), i
        }, i.prototype._get_boolean = function (t, e) {
            var n = this.raw_options[t];
            return void 0 === n ? !!e : !!n
        }, i.prototype._get_characters = function (t, e) {
            var n = this.raw_options[t], i = e || "";
            return "string" == typeof n && (i = n.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "\t")), i
        }, i.prototype._get_number = function (t, e) {
            var n = this.raw_options[t];
            e = parseInt(e, 10), isNaN(e) && (e = 0);
            var i = parseInt(n, 10);
            return isNaN(i) && (i = e), i
        }, i.prototype._get_selection = function (t, e, n) {
            var i = this._get_selection_list(t, e, n);
            if (1 !== i.length) throw new Error("Invalid Option Value: The option '" + t + "' can only be one of the following values:\n" + e + "\nYou passed in: '" + this.raw_options[t] + "'");
            return i[0]
        }, i.prototype._get_selection_list = function (t, e, n) {
            if (!e || 0 === e.length) throw new Error("Selection list cannot be empty.");
            if (n = n || [e[0]], !this._is_valid_selection(n, e)) throw new Error("Invalid Default Value!");
            var i = this._get_array(t, n);
            if (!this._is_valid_selection(i, e)) throw new Error("Invalid Option Value: The option '" + t + "' can contain only the following values:\n" + e + "\nYou passed in: '" + this.raw_options[t] + "'");
            return i
        }, i.prototype._is_valid_selection = function (t, e) {
            return t.length && e.length && !t.some(function (t) {
                return -1 === e.indexOf(t)
            })
        }, t.exports.Options = i, t.exports.normalizeOpts = s, t.exports.mergeOpts = _
    }, function (t, e, n) {
        function i(t, e) {
            return -1 !== e.indexOf(t)
        }

        function _(t) {
            for (var e = "", n = 0, i = new s(t), _ = null; i.hasNext();) if (_ = i.match(/([\s]|[^\\]|\\\\)+/g), _ && (e += _[0]), "\\" === i.peek()) {
                if (i.next(), "x" === i.peek()) _ = i.match(/x([0-9A-Fa-f]{2})/g); else {
                    if ("u" !== i.peek()) {
                        e += "\\", i.hasNext() && (e += i.next());
                        continue
                    }
                    _ = i.match(/u([0-9A-Fa-f]{4})/g)
                }
                if (!_) return t;
                if ((n = parseInt(_[1], 16)) > 126 && n <= 255 && 0 === _[0].indexOf("x")) return t;
                if (n >= 0 && n < 32) {
                    e += "\\" + _[0];
                    continue
                }
                e += 34 === n || 39 === n || 92 === n ? "\\" + String.fromCharCode(n) : String.fromCharCode(n)
            }
            return e
        }

        var s = n(8).InputScanner, a = n(9).Tokenizer, u = n(9).TOKEN, r = n(13).Directives, o = n(4),
            p = n(12).Pattern, h = n(14).TemplatablePattern, l = {
                START_EXPR: "TK_START_EXPR",
                END_EXPR: "TK_END_EXPR",
                START_BLOCK: "TK_START_BLOCK",
                END_BLOCK: "TK_END_BLOCK",
                WORD: "TK_WORD",
                RESERVED: "TK_RESERVED",
                SEMICOLON: "TK_SEMICOLON",
                STRING: "TK_STRING",
                EQUALS: "TK_EQUALS",
                OPERATOR: "TK_OPERATOR",
                COMMA: "TK_COMMA",
                BLOCK_COMMENT: "TK_BLOCK_COMMENT",
                COMMENT: "TK_COMMENT",
                DOT: "TK_DOT",
                UNKNOWN: "TK_UNKNOWN",
                START: u.START,
                RAW: u.RAW,
                EOF: u.EOF
            }, c = new r(/\/\*/, /\*\//),
            f = /0[xX][0123456789abcdefABCDEF]*|0[oO][01234567]*|0[bB][01]*|\d+n|(?:\.\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?/,
            d = /[0-9]/, g = /[^\d\.]/,
            b = ">>> === !== << && >= ** != == <= >> || ?? |> < / - + > : & % ? ^ | *".split(" "),
            m = ">>>= ... >>= <<= === >>> !== **= => ^= :: /= << <= == && -= >= >> != -- += ** || ?? ++ %= &= *= |= |> = ! ? > < : / ^ - + * & % ~ |";
        m = m.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&"), m = "\\?\\.(?!\\d) " + m, m = m.replace(/ /g, "|");
        var y, w = new RegExp(m),
            k = "continue,try,throw,return,var,let,const,if,switch,case,default,for,while,break,function,import,export".split(","),
            x = k.concat(["do", "in", "of", "else", "get", "set", "new", "catch", "finally", "typeof", "yield", "async", "await", "from", "as"]),
            v = new RegExp("^(?:" + x.join("|") + ")$"), E = function (t, e) {
                a.call(this, t, e), this._patterns.whitespace = this._patterns.whitespace.matching(/\u00A0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff/.source, /\u2028\u2029/.source);
                var n = new p(this._input), i = new h(this._input).read_options(this._options);
                this.__patterns = {
                    template: i,
                    identifier: i.starting_with(o.identifier).matching(o.identifierMatch),
                    number: n.matching(f),
                    punct: n.matching(w),
                    comment: n.starting_with(/\/\//).until(/[\n\r\u2028\u2029]/),
                    block_comment: n.starting_with(/\/\*/).until_after(/\*\//),
                    html_comment_start: n.matching(/<!--/),
                    html_comment_end: n.matching(/-->/),
                    include: n.starting_with(/#include/).until_after(o.lineBreak),
                    shebang: n.starting_with(/#!/).until_after(o.lineBreak),
                    xml: n.matching(/[\s\S]*?<(\/?)([-a-zA-Z:0-9_.]+|{[\s\S]+?}|!\[CDATA\[[\s\S]*?\]\])(\s+{[\s\S]+?}|\s+[-a-zA-Z:0-9_.]+|\s+[-a-zA-Z:0-9_.]+\s*=\s*('[^']*'|"[^"]*"|{[\s\S]+?}))*\s*(\/?)\s*>/),
                    single_quote: i.until(/['\\\n\r\u2028\u2029]/),
                    double_quote: i.until(/["\\\n\r\u2028\u2029]/),
                    template_text: i.until(/[`\\$]/),
                    template_expression: i.until(/[`}\\]/)
                }
            };
        E.prototype = new a, E.prototype._is_comment = function (t) {
            return t.type === l.COMMENT || t.type === l.BLOCK_COMMENT || t.type === l.UNKNOWN
        }, E.prototype._is_opening = function (t) {
            return t.type === l.START_BLOCK || t.type === l.START_EXPR
        }, E.prototype._is_closing = function (t, e) {
            return (t.type === l.END_BLOCK || t.type === l.END_EXPR) && e && ("]" === t.text && "[" === e.text || ")" === t.text && "(" === e.text || "}" === t.text && "{" === e.text)
        }, E.prototype._reset = function () {
            y = !1
        }, E.prototype._get_next_token = function (t, e) {
            var n = null;
            this._readWhitespace();
            var i = this._input.peek();
            return null === i ? this._create_token(l.EOF, "") : (n = n || this._read_non_javascript(i), n = n || this._read_string(i), n = n || this._read_word(t), n = n || this._read_singles(i), n = n || this._read_comment(i), n = n || this._read_regexp(i, t), n = n || this._read_xml(i, t), n = n || this._read_punctuation(), n = n || this._create_token(l.UNKNOWN, this._input.next()))
        }, E.prototype._read_word = function (t) {
            var e;
            return "" !== (e = this.__patterns.identifier.read()) ? (e = e.replace(o.allLineBreaks, "\n"), t.type !== l.DOT && (t.type !== l.RESERVED || "set" !== t.text && "get" !== t.text) && v.test(e) ? "in" === e || "of" === e ? this._create_token(l.OPERATOR, e) : this._create_token(l.RESERVED, e) : this._create_token(l.WORD, e)) : (e = this.__patterns.number.read(), "" !== e ? this._create_token(l.WORD, e) : void 0)
        }, E.prototype._read_singles = function (t) {
            var e = null;
            return "(" === t || "[" === t ? e = this._create_token(l.START_EXPR, t) : ")" === t || "]" === t ? e = this._create_token(l.END_EXPR, t) : "{" === t ? e = this._create_token(l.START_BLOCK, t) : "}" === t ? e = this._create_token(l.END_BLOCK, t) : ";" === t ? e = this._create_token(l.SEMICOLON, t) : "." === t && g.test(this._input.peek(1)) ? e = this._create_token(l.DOT, t) : "," === t && (e = this._create_token(l.COMMA, t)), e && this._input.next(), e
        }, E.prototype._read_punctuation = function () {
            var t = this.__patterns.punct.read();
            if ("" !== t) return "=" === t ? this._create_token(l.EQUALS, t) : "?." === t ? this._create_token(l.DOT, t) : this._create_token(l.OPERATOR, t)
        }, E.prototype._read_non_javascript = function (t) {
            var e = "";
            if ("#" === t) {
                if (this._is_first_token() && (e = this.__patterns.shebang.read())) return this._create_token(l.UNKNOWN, e.trim() + "\n");
                if (e = this.__patterns.include.read()) return this._create_token(l.UNKNOWN, e.trim() + "\n");
                t = this._input.next();
                var n = "#";
                if (this._input.hasNext() && this._input.testChar(d)) {
                    do {
                        t = this._input.next(), n += t
                    } while (this._input.hasNext() && "#" !== t && "=" !== t);
                    return "#" === t || ("[" === this._input.peek() && "]" === this._input.peek(1) ? (n += "[]", this._input.next(), this._input.next()) : "{" === this._input.peek() && "}" === this._input.peek(1) && (n += "{}", this._input.next(), this._input.next())), this._create_token(l.WORD, n)
                }
                this._input.back()
            } else if ("<" === t && this._is_first_token()) {
                if (e = this.__patterns.html_comment_start.read()) {
                    for (; this._input.hasNext() && !this._input.testChar(o.newline);) e += this._input.next();
                    return y = !0, this._create_token(l.COMMENT, e)
                }
            } else if (y && "-" === t && (e = this.__patterns.html_comment_end.read())) return y = !1, this._create_token(l.COMMENT, e);
            return null
        }, E.prototype._read_comment = function (t) {
            var e = null;
            if ("/" === t) {
                var n = "";
                if ("*" === this._input.peek(1)) {
                    n = this.__patterns.block_comment.read();
                    var i = c.get_directives(n);
                    i && "start" === i.ignore && (n += c.readIgnored(this._input)), n = n.replace(o.allLineBreaks, "\n"), e = this._create_token(l.BLOCK_COMMENT, n), e.directives = i
                } else "/" === this._input.peek(1) && (n = this.__patterns.comment.read(), e = this._create_token(l.COMMENT, n))
            }
            return e
        }, E.prototype._read_string = function (t) {
            if ("`" === t || "'" === t || '"' === t) {
                var e = this._input.next();
                return this.has_char_escapes = !1, e += "`" === t ? this._read_string_recursive("`", !0, "${") : this._read_string_recursive(t), this.has_char_escapes && this._options.unescape_strings && (e = _(e)), this._input.peek() === t && (e += this._input.next()), e = e.replace(o.allLineBreaks, "\n"), this._create_token(l.STRING, e)
            }
            return null
        }, E.prototype._allow_regexp_or_xml = function (t) {
            return t.type === l.RESERVED && i(t.text, ["return", "case", "throw", "else", "do", "typeof", "yield"]) || t.type === l.END_EXPR && ")" === t.text && t.opened.previous.type === l.RESERVED && i(t.opened.previous.text, ["if", "while", "for"]) || i(t.type, [l.COMMENT, l.START_EXPR, l.START_BLOCK, l.START, l.END_BLOCK, l.OPERATOR, l.EQUALS, l.EOF, l.SEMICOLON, l.COMMA])
        }, E.prototype._read_regexp = function (t, e) {
            if ("/" === t && this._allow_regexp_or_xml(e)) {
                for (var n = this._input.next(), i = !1, _ = !1; this._input.hasNext() && (i || _ || this._input.peek() !== t) && !this._input.testChar(o.newline);) n += this._input.peek(), i ? i = !1 : (i = "\\" === this._input.peek(), "[" === this._input.peek() ? _ = !0 : "]" === this._input.peek() && (_ = !1)), this._input.next();
                return this._input.peek() === t && (n += this._input.next(), n += this._input.read(o.identifier)), this._create_token(l.STRING, n)
            }
            return null
        }, E.prototype._read_xml = function (t, e) {
            if (this._options.e4x && "<" === t && this._allow_regexp_or_xml(e)) {
                var n = "", i = this.__patterns.xml.read_match();
                if (i) {
                    for (var _ = i[2].replace(/^{\s+/, "{").replace(/\s+}$/, "}"), s = 0 === _.indexOf("{"), a = 0; i;) {
                        var u = !!i[1], r = i[2];
                        if (!(!!i[i.length - 1] || "![CDATA[" === r.slice(0, 8)) && (r === _ || s && r.replace(/^{\s+/, "{").replace(/\s+}$/, "}")) && (u ? --a : ++a), n += i[0], a <= 0) break;
                        i = this.__patterns.xml.read_match()
                    }
                    return i || (n += this._input.match(/[\s\S]*/g)[0]), n = n.replace(o.allLineBreaks, "\n"), this._create_token(l.STRING, n)
                }
            }
            return null
        }, E.prototype._read_string_recursive = function (t, e, n) {
            var i, _;
            "'" === t ? _ = this.__patterns.single_quote : '"' === t ? _ = this.__patterns.double_quote : "`" === t ? _ = this.__patterns.template_text : "}" === t && (_ = this.__patterns.template_expression);
            for (var s = _.read(), a = ""; this._input.hasNext();) {
                if ((a = this._input.next()) === t || !e && o.newline.test(a)) {
                    this._input.back();
                    break
                }
                "\\" === a && this._input.hasNext() ? (i = this._input.peek(), "x" === i || "u" === i ? this.has_char_escapes = !0 : "\r" === i && "\n" === this._input.peek(1) && this._input.next(), a += this._input.next()) : n && ("${" === n && "$" === a && "{" === this._input.peek() && (a += this._input.next()), n === a && (a += "`" === t ? this._read_string_recursive("}", e, "`") : this._read_string_recursive("`", e, "${"), this._input.hasNext() && (a += this._input.next()))), a += _.read(), s += a
            }
            return s
        }, t.exports.Tokenizer = E, t.exports.TOKEN = l, t.exports.positionable_operators = b.slice(), t.exports.line_starters = k.slice()
    }, function (t, e, n) {
        function i(t) {
            this.__input = t || "", this.__input_length = this.__input.length, this.__position = 0
        }

        var _ = RegExp.prototype.hasOwnProperty("sticky");
        i.prototype.restart = function () {
            this.__position = 0
        }, i.prototype.back = function () {
            this.__position > 0 && (this.__position -= 1)
        }, i.prototype.hasNext = function () {
            return this.__position < this.__input_length
        }, i.prototype.next = function () {
            var t = null;
            return this.hasNext() && (t = this.__input.charAt(this.__position), this.__position += 1), t
        }, i.prototype.peek = function (t) {
            var e = null;
            return t = t || 0, t += this.__position, t >= 0 && t < this.__input_length && (e = this.__input.charAt(t)), e
        }, i.prototype.__match = function (t, e) {
            t.lastIndex = e;
            var n = t.exec(this.__input);
            return !n || _ && t.sticky || n.index !== e && (n = null), n
        }, i.prototype.test = function (t, e) {
            return e = e || 0, (e += this.__position) >= 0 && e < this.__input_length && !!this.__match(t, e)
        }, i.prototype.testChar = function (t, e) {
            var n = this.peek(e);
            return t.lastIndex = 0, null !== n && t.test(n)
        }, i.prototype.match = function (t) {
            var e = this.__match(t, this.__position);
            return e ? this.__position += e[0].length : e = null, e
        }, i.prototype.read = function (t, e, n) {
            var i, _ = "";
            return t && (i = this.match(t)) && (_ += i[0]), !e || !i && t || (_ += this.readUntil(e, n)), _
        }, i.prototype.readUntil = function (t, e) {
            var n = "", i = this.__position;
            t.lastIndex = this.__position;
            var _ = t.exec(this.__input);
            return _ ? (i = _.index, e && (i += _[0].length)) : i = this.__input_length, n = this.__input.substring(this.__position, i), this.__position = i, n
        }, i.prototype.readUntilAfter = function (t) {
            return this.readUntil(t, !0)
        }, i.prototype.get_regexp = function (t, e) {
            var n = null, i = "g";
            return e && _ && (i = "y"), "string" == typeof t && "" !== t ? n = new RegExp(t, i) : t && (n = new RegExp(t.source, i)), n
        }, i.prototype.get_literal_regexp = function (t) {
            return RegExp(t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
        }, i.prototype.peekUntilAfter = function (t) {
            var e = this.__position, n = this.readUntilAfter(t);
            return this.__position = e, n
        }, i.prototype.lookBack = function (t) {
            var e = this.__position - 1;
            return e >= t.length && this.__input.substring(e - t.length, e).toLowerCase() === t
        }, t.exports.InputScanner = i
    }, function (t, e, n) {
        var i = n(8).InputScanner, _ = n(3).Token, s = n(10).TokenStream, a = n(11).WhitespacePattern,
            u = {START: "TK_START", RAW: "TK_RAW", EOF: "TK_EOF"}, r = function (t, e) {
                this._input = new i(t), this._options = e || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new a(this._input)
            };
        r.prototype.tokenize = function () {
            this._input.restart(), this.__tokens = new s, this._reset();
            for (var t, e = new _(u.START, ""), n = null, i = [], a = new s; e.type !== u.EOF;) {
                for (t = this._get_next_token(e, n); this._is_comment(t);) a.add(t), t = this._get_next_token(e, n);
                a.isEmpty() || (t.comments_before = a, a = new s), t.parent = n, this._is_opening(t) ? (i.push(n), n = t) : n && this._is_closing(t, n) && (t.opened = n, n.closed = t, n = i.pop(), t.parent = n), t.previous = e, e.next = t, this.__tokens.add(t), e = t
            }
            return this.__tokens
        }, r.prototype._is_first_token = function () {
            return this.__tokens.isEmpty()
        }, r.prototype._reset = function () {
        }, r.prototype._get_next_token = function (t, e) {
            this._readWhitespace();
            var n = this._input.read(/.+/g);
            return n ? this._create_token(u.RAW, n) : this._create_token(u.EOF, "")
        }, r.prototype._is_comment = function (t) {
            return !1
        }, r.prototype._is_opening = function (t) {
            return !1
        }, r.prototype._is_closing = function (t, e) {
            return !1
        }, r.prototype._create_token = function (t, e) {
            return new _(t, e, this._patterns.whitespace.newline_count, this._patterns.whitespace.whitespace_before_token)
        }, r.prototype._readWhitespace = function () {
            return this._patterns.whitespace.read()
        }, t.exports.Tokenizer = r, t.exports.TOKEN = u
    }, function (t, e, n) {
        function i(t) {
            this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = t
        }

        i.prototype.restart = function () {
            this.__position = 0
        }, i.prototype.isEmpty = function () {
            return 0 === this.__tokens_length
        }, i.prototype.hasNext = function () {
            return this.__position < this.__tokens_length
        }, i.prototype.next = function () {
            var t = null;
            return this.hasNext() && (t = this.__tokens[this.__position], this.__position += 1), t
        }, i.prototype.peek = function (t) {
            var e = null;
            return t = t || 0, t += this.__position, t >= 0 && t < this.__tokens_length && (e = this.__tokens[t]), e
        }, i.prototype.add = function (t) {
            this.__parent_token && (t.parent = this.__parent_token), this.__tokens.push(t), this.__tokens_length += 1
        }, t.exports.TokenStream = i
    }, function (t, e, n) {
        function i(t, e) {
            _.call(this, t, e), e ? this._line_regexp = this._input.get_regexp(e._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = ""
        }

        var _ = n(12).Pattern;
        i.prototype = new _, i.prototype.__set_whitespace_patterns = function (t, e) {
            t += "\\t ", e += "\\n\\r", this._match_pattern = this._input.get_regexp("[" + t + e + "]+", !0), this._newline_regexp = this._input.get_regexp("\\r\\n|[" + e + "]")
        }, i.prototype.read = function () {
            this.newline_count = 0, this.whitespace_before_token = "";
            var t = this._input.read(this._match_pattern);
            if (" " === t) this.whitespace_before_token = " "; else if (t) {
                var e = this.__split(this._newline_regexp, t);
                this.newline_count = e.length - 1, this.whitespace_before_token = e[this.newline_count]
            }
            return t
        }, i.prototype.matching = function (t, e) {
            var n = this._create();
            return n.__set_whitespace_patterns(t, e), n._update(), n
        }, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype.__split = function (t, e) {
            t.lastIndex = 0;
            for (var n = 0, i = [], _ = t.exec(e); _;) i.push(e.substring(n, _.index)), n = _.index + _[0].length, _ = t.exec(e);
            return n < e.length ? i.push(e.substring(n, e.length)) : i.push(""), i
        }, t.exports.WhitespacePattern = i
    }, function (t, e, n) {
        function i(t, e) {
            this._input = t, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = !1, e && (this._starting_pattern = this._input.get_regexp(e._starting_pattern, !0), this._match_pattern = this._input.get_regexp(e._match_pattern, !0), this._until_pattern = this._input.get_regexp(e._until_pattern), this._until_after = e._until_after)
        }

        i.prototype.read = function () {
            var t = this._input.read(this._starting_pattern);
            return this._starting_pattern && !t || (t += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), t
        }, i.prototype.read_match = function () {
            return this._input.match(this._match_pattern)
        }, i.prototype.until_after = function (t) {
            var e = this._create();
            return e._until_after = !0, e._until_pattern = this._input.get_regexp(t), e._update(), e
        }, i.prototype.until = function (t) {
            var e = this._create();
            return e._until_after = !1, e._until_pattern = this._input.get_regexp(t), e._update(), e
        }, i.prototype.starting_with = function (t) {
            var e = this._create();
            return e._starting_pattern = this._input.get_regexp(t, !0), e._update(), e
        }, i.prototype.matching = function (t) {
            var e = this._create();
            return e._match_pattern = this._input.get_regexp(t, !0), e._update(), e
        }, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype._update = function () {
        }, t.exports.Pattern = i
    }, function (t, e, n) {
        function i(t, e) {
            t = "string" == typeof t ? t : t.source, e = "string" == typeof e ? e : e.source, this.__directives_block_pattern = new RegExp(t + / beautify( \w+[:]\w+)+ /.source + e, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(t + /\sbeautify\signore:end\s/.source + e, "g")
        }

        i.prototype.get_directives = function (t) {
            if (!t.match(this.__directives_block_pattern)) return null;
            var e = {};
            this.__directive_pattern.lastIndex = 0;
            for (var n = this.__directive_pattern.exec(t); n;) e[n[1]] = n[2], n = this.__directive_pattern.exec(t);
            return e
        }, i.prototype.readIgnored = function (t) {
            return t.readUntilAfter(this.__directives_end_ignore_pattern)
        }, t.exports.Directives = i
    }, function (t, e, n) {
        function i(t, e) {
            _.call(this, t, e), this.__template_pattern = null, this._disabled = Object.assign({}, s), this._excluded = Object.assign({}, s), e && (this.__template_pattern = this._input.get_regexp(e.__template_pattern), this._excluded = Object.assign(this._excluded, e._excluded), this._disabled = Object.assign(this._disabled, e._disabled));
            var n = new _(t);
            this.__patterns = {
                handlebars_comment: n.starting_with(/{{!--/).until_after(/--}}/),
                handlebars_unescaped: n.starting_with(/{{{/).until_after(/}}}/),
                handlebars: n.starting_with(/{{/).until_after(/}}/),
                php: n.starting_with(/<\?(?:[=]|php)/).until_after(/\?>/),
                erb: n.starting_with(/<%[^%]/).until_after(/[^%]%>/),
                django: n.starting_with(/{%/).until_after(/%}/),
                django_value: n.starting_with(/{{/).until_after(/}}/),
                django_comment: n.starting_with(/{#/).until_after(/#}/)
            }
        }

        var _ = n(12).Pattern, s = {django: !1, erb: !1, handlebars: !1, php: !1};
        i.prototype = new _, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype._update = function () {
            this.__set_templated_pattern()
        }, i.prototype.disable = function (t) {
            var e = this._create();
            return e._disabled[t] = !0, e._update(), e
        }, i.prototype.read_options = function (t) {
            var e = this._create();
            for (var n in s) e._disabled[n] = -1 === t.templating.indexOf(n);
            return e._update(), e
        }, i.prototype.exclude = function (t) {
            var e = this._create();
            return e._excluded[t] = !0, e._update(), e
        }, i.prototype.read = function () {
            var t = "";
            t = this._match_pattern ? this._input.read(this._starting_pattern) : this._input.read(this._starting_pattern, this.__template_pattern);
            for (var e = this._read_template(); e;) this._match_pattern ? e += this._input.read(this._match_pattern) : e += this._input.readUntil(this.__template_pattern), t += e, e = this._read_template();
            return this._until_after && (t += this._input.readUntilAfter(this._until_pattern)), t
        }, i.prototype.__set_templated_pattern = function () {
            var t = [];
            this._disabled.php || t.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || t.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || t.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (t.push(this.__patterns.django._starting_pattern.source), t.push(this.__patterns.django_value._starting_pattern.source), t.push(this.__patterns.django_comment._starting_pattern.source)), this._until_pattern && t.push(this._until_pattern.source), this.__template_pattern = this._input.get_regexp("(?:" + t.join("|") + ")")
        }, i.prototype._read_template = function () {
            var t = "", e = this._input.peek();
            if ("<" === e) {
                var n = this._input.peek(1);
                this._disabled.php || this._excluded.php || "?" !== n || (t = t || this.__patterns.php.read()), this._disabled.erb || this._excluded.erb || "%" !== n || (t = t || this.__patterns.erb.read())
            } else "{" === e && (this._disabled.handlebars || this._excluded.handlebars || (t = t || this.__patterns.handlebars_comment.read(), t = t || this.__patterns.handlebars_unescaped.read(), t = t || this.__patterns.handlebars.read()), this._disabled.django || (this._excluded.django || this._excluded.handlebars || (t = t || this.__patterns.django_value.read()), this._excluded.django || (t = t || this.__patterns.django_comment.read(), t = t || this.__patterns.django.read())));
            return t
        }, t.exports.TemplatablePattern = i
    }]), e = t;
    "function" == typeof define && define.amd ? define("beautify.js", [], function () {
        return {js_beautify: e}
    }) : "undefined" != typeof exports ? exports.js_beautify = e : "undefined" != typeof window ? window.js_beautify = e : "undefined" != typeof global && (global.js_beautify = e)
}(), function () {
    var t = function (t) {
        function e(i) {
            if (n[i]) return n[i].exports;
            var _ = n[i] = {i: i, l: !1, exports: {}};
            return t[i].call(_.exports, _, _.exports, e), _.l = !0, _.exports
        }

        var n = {};
        return e.m = t, e.c = n, e.d = function (t, n, i) {
            e.o(t, n) || Object.defineProperty(t, n, {enumerable: !0, get: i})
        }, e.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(t, "__esModule", {value: !0})
        }, e.t = function (t, n) {
            if (1 & n && (t = e(t)), 8 & n) return t;
            if (4 & n && "object" == typeof t && t && t.__esModule) return t;
            var i = Object.create(null);
            if (e.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: t
            }), 2 & n && "string" != typeof t) for (var _ in t) e.d(i, _, function (e) {
                return t[e]
            }.bind(null, _));
            return i
        }, e.n = function (t) {
            var n = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return e.d(n, "a", n), n
        }, e.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 18)
    }([, , function (t, e, n) {
        function i(t) {
            this.__parent = t, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = []
        }

        function _(t, e) {
            this.__cache = [""], this.__indent_size = t.indent_size, this.__indent_string = t.indent_char, t.indent_with_tabs || (this.__indent_string = new Array(t.indent_size + 1).join(t.indent_char)), e = e || "", t.indent_level > 0 && (e = new Array(t.indent_level + 1).join(this.__indent_string)), this.__base_string = e, this.__base_string_length = e.length
        }

        function s(t, e) {
            this.__indent_cache = new _(t, e), this.raw = !1, this._end_with_newline = t.end_with_newline, this.indent_size = t.indent_size, this.wrap_line_length = t.wrap_line_length, this.indent_empty_lines = t.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new i(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline()
        }

        i.prototype.clone_empty = function () {
            var t = new i(this.__parent);
            return t.set_indent(this.__indent_count, this.__alignment_count), t
        }, i.prototype.item = function (t) {
            return t < 0 ? this.__items[this.__items.length + t] : this.__items[t]
        }, i.prototype.has_match = function (t) {
            for (var e = this.__items.length - 1; e >= 0; e--) if (this.__items[e].match(t)) return !0;
            return !1
        }, i.prototype.set_indent = function (t, e) {
            this.is_empty() && (this.__indent_count = t || 0, this.__alignment_count = e || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count))
        }, i.prototype._set_wrap_point = function () {
            this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count)
        }, i.prototype._should_wrap = function () {
            return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count
        }, i.prototype._allow_wrap = function () {
            if (this._should_wrap()) {
                this.__parent.add_new_line();
                var t = this.__parent.current_line;
                return t.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), t.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), t.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, " " === t.__items[0] && (t.__items.splice(0, 1), t.__character_count -= 1), !0
            }
            return !1
        }, i.prototype.is_empty = function () {
            return 0 === this.__items.length
        }, i.prototype.last = function () {
            return this.is_empty() ? null : this.__items[this.__items.length - 1]
        }, i.prototype.push = function (t) {
            this.__items.push(t);
            var e = t.lastIndexOf("\n");
            -1 !== e ? this.__character_count = t.length - e : this.__character_count += t.length
        }, i.prototype.pop = function () {
            var t = null;
            return this.is_empty() || (t = this.__items.pop(), this.__character_count -= t.length), t
        }, i.prototype._remove_indent = function () {
            this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size)
        }, i.prototype._remove_wrap_indent = function () {
            this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1)
        }, i.prototype.trim = function () {
            for (; " " === this.last();) this.__items.pop(), this.__character_count -= 1
        }, i.prototype.toString = function () {
            var t = "";
            return this.is_empty() ? this.__parent.indent_empty_lines && (t = this.__parent.get_indent_string(this.__indent_count)) : (t = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), t += this.__items.join("")), t
        }, _.prototype.get_indent_size = function (t, e) {
            var n = this.__base_string_length;
            return e = e || 0, t < 0 && (n = 0), n += t * this.__indent_size, n += e
        }, _.prototype.get_indent_string = function (t, e) {
            var n = this.__base_string;
            return e = e || 0, t < 0 && (t = 0, n = ""), e += t * this.__indent_size, this.__ensure_cache(e), n += this.__cache[e]
        }, _.prototype.__ensure_cache = function (t) {
            for (; t >= this.__cache.length;) this.__add_column()
        }, _.prototype.__add_column = function () {
            var t = this.__cache.length, e = 0, n = "";
            this.__indent_size && t >= this.__indent_size && (e = Math.floor(t / this.__indent_size), t -= e * this.__indent_size, n = new Array(e + 1).join(this.__indent_string)), t && (n += new Array(t + 1).join(" ")), this.__cache.push(n)
        }, s.prototype.__add_outputline = function () {
            this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line)
        }, s.prototype.get_line_number = function () {
            return this.__lines.length
        }, s.prototype.get_indent_string = function (t, e) {
            return this.__indent_cache.get_indent_string(t, e)
        }, s.prototype.get_indent_size = function (t, e) {
            return this.__indent_cache.get_indent_size(t, e)
        }, s.prototype.is_empty = function () {
            return !this.previous_line && this.current_line.is_empty()
        }, s.prototype.add_new_line = function (t) {
            return !(this.is_empty() || !t && this.just_added_newline()) && (this.raw || this.__add_outputline(), !0)
        }, s.prototype.get_code = function (t) {
            this.trim(!0);
            var e = this.current_line.pop();
            e && ("\n" === e[e.length - 1] && (e = e.replace(/\n+$/g, "")), this.current_line.push(e)), this._end_with_newline && this.__add_outputline();
            var n = this.__lines.join("\n");
            return "\n" !== t && (n = n.replace(/[\n]/g, t)), n
        }, s.prototype.set_wrap_point = function () {
            this.current_line._set_wrap_point()
        }, s.prototype.set_indent = function (t, e) {
            return t = t || 0, e = e || 0, this.next_line.set_indent(t, e), this.__lines.length > 1 ? (this.current_line.set_indent(t, e), !0) : (this.current_line.set_indent(), !1)
        }, s.prototype.add_raw_token = function (t) {
            for (var e = 0; e < t.newlines; e++) this.__add_outputline();
            this.current_line.set_indent(-1), this.current_line.push(t.whitespace_before), this.current_line.push(t.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1
        }, s.prototype.add_token = function (t) {
            this.__add_space_before_token(), this.current_line.push(t), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap()
        }, s.prototype.__add_space_before_token = function () {
            this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "))
        }, s.prototype.remove_indent = function (t) {
            for (var e = this.__lines.length; t < e;) this.__lines[t]._remove_indent(), t++;
            this.current_line._remove_wrap_indent()
        }, s.prototype.trim = function (t) {
            for (t = void 0 !== t && t, this.current_line.trim(); t && this.__lines.length > 1 && this.current_line.is_empty();) this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
            this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null
        }, s.prototype.just_added_newline = function () {
            return this.current_line.is_empty()
        }, s.prototype.just_added_blankline = function () {
            return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty()
        }, s.prototype.ensure_empty_line_above = function (t, e) {
            for (var n = this.__lines.length - 2; n >= 0;) {
                var _ = this.__lines[n];
                if (_.is_empty()) break;
                if (0 !== _.item(0).indexOf(t) && _.item(-1) !== e) {
                    this.__lines.splice(n + 1, 0, new i(this)), this.previous_line = this.__lines[this.__lines.length - 2];
                    break
                }
                n--
            }
        }, t.exports.Output = s
    }, function (t, e, n) {
        function i(t, e, n, i) {
            this.type = t, this.text = e, this.comments_before = null, this.newlines = n || 0, this.whitespace_before = i || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null
        }

        t.exports.Token = i
    }, , , function (t, e, n) {
        function i(t, e) {
            this.raw_options = _(t, e), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", "\t" === this.indent_char), this.indent_with_tabs && (this.indent_char = "\t", 1 === this.indent_size && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php"], ["auto"])
        }

        function _(t, e) {
            var n = {};
            t = s(t);
            var i;
            for (i in t) i !== e && (n[i] = t[i]);
            if (e && t[e]) for (i in t[e]) n[i] = t[e][i];
            return n
        }

        function s(t) {
            var e, n = {};
            for (e in t) {
                n[e.replace(/-/g, "_")] = t[e]
            }
            return n
        }

        i.prototype._get_array = function (t, e) {
            var n = this.raw_options[t], i = e || [];
            return "object" == typeof n ? null !== n && "function" == typeof n.concat && (i = n.concat()) : "string" == typeof n && (i = n.split(/[^a-zA-Z0-9_\/\-]+/)), i
        }, i.prototype._get_boolean = function (t, e) {
            var n = this.raw_options[t];
            return void 0 === n ? !!e : !!n
        }, i.prototype._get_characters = function (t, e) {
            var n = this.raw_options[t], i = e || "";
            return "string" == typeof n && (i = n.replace(/\\r/, "\r").replace(/\\n/, "\n").replace(/\\t/, "\t")), i
        }, i.prototype._get_number = function (t, e) {
            var n = this.raw_options[t];
            e = parseInt(e, 10), isNaN(e) && (e = 0);
            var i = parseInt(n, 10);
            return isNaN(i) && (i = e), i
        }, i.prototype._get_selection = function (t, e, n) {
            var i = this._get_selection_list(t, e, n);
            if (1 !== i.length) throw new Error("Invalid Option Value: The option '" + t + "' can only be one of the following values:\n" + e + "\nYou passed in: '" + this.raw_options[t] + "'");
            return i[0]
        }, i.prototype._get_selection_list = function (t, e, n) {
            if (!e || 0 === e.length) throw new Error("Selection list cannot be empty.");
            if (n = n || [e[0]], !this._is_valid_selection(n, e)) throw new Error("Invalid Default Value!");
            var i = this._get_array(t, n);
            if (!this._is_valid_selection(i, e)) throw new Error("Invalid Option Value: The option '" + t + "' can contain only the following values:\n" + e + "\nYou passed in: '" + this.raw_options[t] + "'");
            return i
        }, i.prototype._is_valid_selection = function (t, e) {
            return t.length && e.length && !t.some(function (t) {
                return -1 === e.indexOf(t)
            })
        }, t.exports.Options = i, t.exports.normalizeOpts = s, t.exports.mergeOpts = _
    }, , function (t, e, n) {
        function i(t) {
            this.__input = t || "", this.__input_length = this.__input.length, this.__position = 0
        }

        var _ = RegExp.prototype.hasOwnProperty("sticky");
        i.prototype.restart = function () {
            this.__position = 0
        }, i.prototype.back = function () {
            this.__position > 0 && (this.__position -= 1)
        }, i.prototype.hasNext = function () {
            return this.__position < this.__input_length
        }, i.prototype.next = function () {
            var t = null;
            return this.hasNext() && (t = this.__input.charAt(this.__position), this.__position += 1), t
        }, i.prototype.peek = function (t) {
            var e = null;
            return t = t || 0, t += this.__position, t >= 0 && t < this.__input_length && (e = this.__input.charAt(t)), e
        }, i.prototype.__match = function (t, e) {
            t.lastIndex = e;
            var n = t.exec(this.__input);
            return !n || _ && t.sticky || n.index !== e && (n = null), n
        }, i.prototype.test = function (t, e) {
            return e = e || 0, (e += this.__position) >= 0 && e < this.__input_length && !!this.__match(t, e)
        }, i.prototype.testChar = function (t, e) {
            var n = this.peek(e);
            return t.lastIndex = 0, null !== n && t.test(n)
        }, i.prototype.match = function (t) {
            var e = this.__match(t, this.__position);
            return e ? this.__position += e[0].length : e = null, e
        }, i.prototype.read = function (t, e, n) {
            var i, _ = "";
            return t && (i = this.match(t)) && (_ += i[0]), !e || !i && t || (_ += this.readUntil(e, n)), _
        }, i.prototype.readUntil = function (t, e) {
            var n = "", i = this.__position;
            t.lastIndex = this.__position;
            var _ = t.exec(this.__input);
            return _ ? (i = _.index, e && (i += _[0].length)) : i = this.__input_length, n = this.__input.substring(this.__position, i), this.__position = i, n
        }, i.prototype.readUntilAfter = function (t) {
            return this.readUntil(t, !0)
        }, i.prototype.get_regexp = function (t, e) {
            var n = null, i = "g";
            return e && _ && (i = "y"), "string" == typeof t && "" !== t ? n = new RegExp(t, i) : t && (n = new RegExp(t.source, i)), n
        }, i.prototype.get_literal_regexp = function (t) {
            return RegExp(t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
        }, i.prototype.peekUntilAfter = function (t) {
            var e = this.__position, n = this.readUntilAfter(t);
            return this.__position = e, n
        }, i.prototype.lookBack = function (t) {
            var e = this.__position - 1;
            return e >= t.length && this.__input.substring(e - t.length, e).toLowerCase() === t
        }, t.exports.InputScanner = i
    }, function (t, e, n) {
        var i = n(8).InputScanner, _ = n(3).Token, s = n(10).TokenStream, a = n(11).WhitespacePattern,
            u = {START: "TK_START", RAW: "TK_RAW", EOF: "TK_EOF"}, r = function (t, e) {
                this._input = new i(t), this._options = e || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new a(this._input)
            };
        r.prototype.tokenize = function () {
            this._input.restart(), this.__tokens = new s, this._reset();
            for (var t, e = new _(u.START, ""), n = null, i = [], a = new s; e.type !== u.EOF;) {
                for (t = this._get_next_token(e, n); this._is_comment(t);) a.add(t), t = this._get_next_token(e, n);
                a.isEmpty() || (t.comments_before = a, a = new s), t.parent = n, this._is_opening(t) ? (i.push(n), n = t) : n && this._is_closing(t, n) && (t.opened = n, n.closed = t, n = i.pop(), t.parent = n), t.previous = e, e.next = t, this.__tokens.add(t), e = t
            }
            return this.__tokens
        }, r.prototype._is_first_token = function () {
            return this.__tokens.isEmpty()
        }, r.prototype._reset = function () {
        }, r.prototype._get_next_token = function (t, e) {
            this._readWhitespace();
            var n = this._input.read(/.+/g);
            return n ? this._create_token(u.RAW, n) : this._create_token(u.EOF, "")
        }, r.prototype._is_comment = function (t) {
            return !1
        }, r.prototype._is_opening = function (t) {
            return !1
        }, r.prototype._is_closing = function (t, e) {
            return !1
        }, r.prototype._create_token = function (t, e) {
            return new _(t, e, this._patterns.whitespace.newline_count, this._patterns.whitespace.whitespace_before_token)
        }, r.prototype._readWhitespace = function () {
            return this._patterns.whitespace.read()
        }, t.exports.Tokenizer = r, t.exports.TOKEN = u
    }, function (t, e, n) {
        function i(t) {
            this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = t
        }

        i.prototype.restart = function () {
            this.__position = 0
        }, i.prototype.isEmpty = function () {
            return 0 === this.__tokens_length
        }, i.prototype.hasNext = function () {
            return this.__position < this.__tokens_length
        }, i.prototype.next = function () {
            var t = null;
            return this.hasNext() && (t = this.__tokens[this.__position], this.__position += 1), t
        }, i.prototype.peek = function (t) {
            var e = null;
            return t = t || 0, t += this.__position, t >= 0 && t < this.__tokens_length && (e = this.__tokens[t]), e
        }, i.prototype.add = function (t) {
            this.__parent_token && (t.parent = this.__parent_token), this.__tokens.push(t), this.__tokens_length += 1
        }, t.exports.TokenStream = i
    }, function (t, e, n) {
        function i(t, e) {
            _.call(this, t, e), e ? this._line_regexp = this._input.get_regexp(e._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = ""
        }

        var _ = n(12).Pattern;
        i.prototype = new _, i.prototype.__set_whitespace_patterns = function (t, e) {
            t += "\\t ", e += "\\n\\r", this._match_pattern = this._input.get_regexp("[" + t + e + "]+", !0), this._newline_regexp = this._input.get_regexp("\\r\\n|[" + e + "]")
        }, i.prototype.read = function () {
            this.newline_count = 0, this.whitespace_before_token = "";
            var t = this._input.read(this._match_pattern);
            if (" " === t) this.whitespace_before_token = " "; else if (t) {
                var e = this.__split(this._newline_regexp, t);
                this.newline_count = e.length - 1, this.whitespace_before_token = e[this.newline_count]
            }
            return t
        }, i.prototype.matching = function (t, e) {
            var n = this._create();
            return n.__set_whitespace_patterns(t, e), n._update(), n
        }, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype.__split = function (t, e) {
            t.lastIndex = 0;
            for (var n = 0, i = [], _ = t.exec(e); _;) i.push(e.substring(n, _.index)), n = _.index + _[0].length, _ = t.exec(e);
            return n < e.length ? i.push(e.substring(n, e.length)) : i.push(""), i
        }, t.exports.WhitespacePattern = i
    }, function (t, e, n) {
        function i(t, e) {
            this._input = t, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = !1, e && (this._starting_pattern = this._input.get_regexp(e._starting_pattern, !0), this._match_pattern = this._input.get_regexp(e._match_pattern, !0), this._until_pattern = this._input.get_regexp(e._until_pattern), this._until_after = e._until_after)
        }

        i.prototype.read = function () {
            var t = this._input.read(this._starting_pattern);
            return this._starting_pattern && !t || (t += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), t
        }, i.prototype.read_match = function () {
            return this._input.match(this._match_pattern)
        }, i.prototype.until_after = function (t) {
            var e = this._create();
            return e._until_after = !0, e._until_pattern = this._input.get_regexp(t), e._update(), e
        }, i.prototype.until = function (t) {
            var e = this._create();
            return e._until_after = !1, e._until_pattern = this._input.get_regexp(t), e._update(), e
        }, i.prototype.starting_with = function (t) {
            var e = this._create();
            return e._starting_pattern = this._input.get_regexp(t, !0), e._update(), e
        }, i.prototype.matching = function (t) {
            var e = this._create();
            return e._match_pattern = this._input.get_regexp(t, !0), e._update(), e
        }, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype._update = function () {
        }, t.exports.Pattern = i
    }, function (t, e, n) {
        function i(t, e) {
            t = "string" == typeof t ? t : t.source, e = "string" == typeof e ? e : e.source, this.__directives_block_pattern = new RegExp(t + / beautify( \w+[:]\w+)+ /.source + e, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(t + /\sbeautify\signore:end\s/.source + e, "g")
        }

        i.prototype.get_directives = function (t) {
            if (!t.match(this.__directives_block_pattern)) return null;
            var e = {};
            this.__directive_pattern.lastIndex = 0;
            for (var n = this.__directive_pattern.exec(t); n;) e[n[1]] = n[2], n = this.__directive_pattern.exec(t);
            return e
        }, i.prototype.readIgnored = function (t) {
            return t.readUntilAfter(this.__directives_end_ignore_pattern)
        }, t.exports.Directives = i
    }, function (t, e, n) {
        function i(t, e) {
            _.call(this, t, e), this.__template_pattern = null, this._disabled = Object.assign({}, s), this._excluded = Object.assign({}, s), e && (this.__template_pattern = this._input.get_regexp(e.__template_pattern), this._excluded = Object.assign(this._excluded, e._excluded), this._disabled = Object.assign(this._disabled, e._disabled));
            var n = new _(t);
            this.__patterns = {
                handlebars_comment: n.starting_with(/{{!--/).until_after(/--}}/),
                handlebars_unescaped: n.starting_with(/{{{/).until_after(/}}}/),
                handlebars: n.starting_with(/{{/).until_after(/}}/),
                php: n.starting_with(/<\?(?:[=]|php)/).until_after(/\?>/),
                erb: n.starting_with(/<%[^%]/).until_after(/[^%]%>/),
                django: n.starting_with(/{%/).until_after(/%}/),
                django_value: n.starting_with(/{{/).until_after(/}}/),
                django_comment: n.starting_with(/{#/).until_after(/#}/)
            }
        }

        var _ = n(12).Pattern, s = {django: !1, erb: !1, handlebars: !1, php: !1};
        i.prototype = new _, i.prototype._create = function () {
            return new i(this._input, this)
        }, i.prototype._update = function () {
            this.__set_templated_pattern()
        }, i.prototype.disable = function (t) {
            var e = this._create();
            return e._disabled[t] = !0, e._update(), e
        }, i.prototype.read_options = function (t) {
            var e = this._create();
            for (var n in s) e._disabled[n] = -1 === t.templating.indexOf(n);
            return e._update(), e
        }, i.prototype.exclude = function (t) {
            var e = this._create();
            return e._excluded[t] = !0, e._update(), e
        }, i.prototype.read = function () {
            var t = "";
            t = this._match_pattern ? this._input.read(this._starting_pattern) : this._input.read(this._starting_pattern, this.__template_pattern);
            for (var e = this._read_template(); e;) this._match_pattern ? e += this._input.read(this._match_pattern) : e += this._input.readUntil(this.__template_pattern), t += e, e = this._read_template();
            return this._until_after && (t += this._input.readUntilAfter(this._until_pattern)), t
        }, i.prototype.__set_templated_pattern = function () {
            var t = [];
            this._disabled.php || t.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || t.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || t.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (t.push(this.__patterns.django._starting_pattern.source), t.push(this.__patterns.django_value._starting_pattern.source), t.push(this.__patterns.django_comment._starting_pattern.source)), this._until_pattern && t.push(this._until_pattern.source),
                this.__template_pattern = this._input.get_regexp("(?:" + t.join("|") + ")")
        }, i.prototype._read_template = function () {
            var t = "", e = this._input.peek();
            if ("<" === e) {
                var n = this._input.peek(1);
                this._disabled.php || this._excluded.php || "?" !== n || (t = t || this.__patterns.php.read()), this._disabled.erb || this._excluded.erb || "%" !== n || (t = t || this.__patterns.erb.read())
            } else "{" === e && (this._disabled.handlebars || this._excluded.handlebars || (t = t || this.__patterns.handlebars_comment.read(), t = t || this.__patterns.handlebars_unescaped.read(), t = t || this.__patterns.handlebars.read()), this._disabled.django || (this._excluded.django || this._excluded.handlebars || (t = t || this.__patterns.django_value.read()), this._excluded.django || (t = t || this.__patterns.django_comment.read(), t = t || this.__patterns.django.read())));
            return t
        }, t.exports.TemplatablePattern = i
    }, , , , function (t, e, n) {
        function i(t, e, n, i) {
            return new _(t, e, n, i).beautify()
        }

        var _ = n(19).Beautifier, s = n(20).Options;
        t.exports = i, t.exports.defaultOptions = function () {
            return new s
        }
    }, function (t, e, n) {
        function i(t, e) {
            return -1 !== e.indexOf(t)
        }

        function _(t, e, n) {
            this.parent = t || null, this.tag = e ? e.tag_name : "", this.indent_level = n || 0, this.parser_token = e || null
        }

        function s(t) {
            this._printer = t, this._current_frame = null
        }

        function a(t, e, n, i) {
            this._source_text = t || "", e = e || {}, this._js_beautify = n, this._css_beautify = i, this._tag_stack = null;
            var _ = new u(e, "html");
            this._options = _, this._is_wrap_attributes_force = "force" === this._options.wrap_attributes.substr(0, "force".length), this._is_wrap_attributes_force_expand_multiline = "force-expand-multiline" === this._options.wrap_attributes, this._is_wrap_attributes_force_aligned = "force-aligned" === this._options.wrap_attributes, this._is_wrap_attributes_aligned_multiple = "aligned-multiple" === this._options.wrap_attributes, this._is_wrap_attributes_preserve = "preserve" === this._options.wrap_attributes.substr(0, "preserve".length), this._is_wrap_attributes_preserve_aligned = "preserve-aligned" === this._options.wrap_attributes
        }

        var u = n(20).Options, r = n(2).Output, o = n(21).Tokenizer, p = n(21).TOKEN, h = /\r\n|[\r\n]/,
            l = /\r\n|[\r\n]/g, c = function (t, e) {
                this.indent_level = 0, this.alignment_size = 0, this.max_preserve_newlines = t.max_preserve_newlines, this.preserve_newlines = t.preserve_newlines, this._output = new r(t, e)
            };
        c.prototype.current_line_has_match = function (t) {
            return this._output.current_line.has_match(t)
        }, c.prototype.set_space_before_token = function (t, e) {
            this._output.space_before_token = t, this._output.non_breaking_space = e
        }, c.prototype.set_wrap_point = function () {
            this._output.set_indent(this.indent_level, this.alignment_size), this._output.set_wrap_point()
        }, c.prototype.add_raw_token = function (t) {
            this._output.add_raw_token(t)
        }, c.prototype.print_preserved_newlines = function (t) {
            var e = 0;
            t.type !== p.TEXT && t.previous.type !== p.TEXT && (e = t.newlines ? 1 : 0), this.preserve_newlines && (e = t.newlines < this.max_preserve_newlines + 1 ? t.newlines : this.max_preserve_newlines + 1);
            for (var n = 0; n < e; n++) this.print_newline(n > 0);
            return 0 !== e
        }, c.prototype.traverse_whitespace = function (t) {
            return !(!t.whitespace_before && !t.newlines) && (this.print_preserved_newlines(t) || (this._output.space_before_token = !0), !0)
        }, c.prototype.previous_token_wrapped = function () {
            return this._output.previous_token_wrapped
        }, c.prototype.print_newline = function (t) {
            this._output.add_new_line(t)
        }, c.prototype.print_token = function (t) {
            t.text && (this._output.set_indent(this.indent_level, this.alignment_size), this._output.add_token(t.text))
        }, c.prototype.indent = function () {
            this.indent_level++
        }, c.prototype.get_full_indent = function (t) {
            return t = this.indent_level + (t || 0), t < 1 ? "" : this._output.get_indent_string(t)
        };
        var f = function (t) {
            for (var e = null, n = t.next; n.type !== p.EOF && t.closed !== n;) {
                if (n.type === p.ATTRIBUTE && "type" === n.text) {
                    n.next && n.next.type === p.EQUALS && n.next.next && n.next.next.type === p.VALUE && (e = n.next.next.text);
                    break
                }
                n = n.next
            }
            return e
        }, d = function (t, e) {
            var n = null, i = null;
            return e.closed ? ("script" === t ? n = "text/javascript" : "style" === t && (n = "text/css"), n = f(e) || n, n.search("text/css") > -1 ? i = "css" : n.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1 ? i = "javascript" : n.search(/(text|application|dojo)\/(x-)?(html)/) > -1 ? i = "html" : n.search(/test\/null/) > -1 && (i = "null"), i) : null
        };
        s.prototype.get_parser_token = function () {
            return this._current_frame ? this._current_frame.parser_token : null
        }, s.prototype.record_tag = function (t) {
            var e = new _(this._current_frame, t, this._printer.indent_level);
            this._current_frame = e
        }, s.prototype._try_pop_frame = function (t) {
            var e = null;
            return t && (e = t.parser_token, this._printer.indent_level = t.indent_level, this._current_frame = t.parent), e
        }, s.prototype._get_frame = function (t, e) {
            for (var n = this._current_frame; n && -1 === t.indexOf(n.tag);) {
                if (e && -1 !== e.indexOf(n.tag)) {
                    n = null;
                    break
                }
                n = n.parent
            }
            return n
        }, s.prototype.try_pop = function (t, e) {
            var n = this._get_frame([t], e);
            return this._try_pop_frame(n)
        }, s.prototype.indent_to_tag = function (t) {
            var e = this._get_frame(t);
            e && (this._printer.indent_level = e.indent_level)
        }, a.prototype.beautify = function () {
            if (this._options.disabled) return this._source_text;
            var t = this._source_text, e = this._options.eol;
            "auto" === this._options.eol && (e = "\n", t && h.test(t) && (e = t.match(h)[0])), t = t.replace(l, "\n");
            var n = t.match(/^[\t ]*/)[0], i = {text: "", type: ""}, _ = new g, a = new c(this._options, n),
                u = new o(t, this._options).tokenize();
            this._tag_stack = new s(a);
            for (var r = null, f = u.next(); f.type !== p.EOF;) f.type === p.TAG_OPEN || f.type === p.COMMENT ? (r = this._handle_tag_open(a, f, _, i), _ = r) : f.type === p.ATTRIBUTE || f.type === p.EQUALS || f.type === p.VALUE || f.type === p.TEXT && !_.tag_complete ? r = this._handle_inside_tag(a, f, _, u) : f.type === p.TAG_CLOSE ? r = this._handle_tag_close(a, f, _) : f.type === p.TEXT ? r = this._handle_text(a, f, _) : a.add_raw_token(f), i = r, f = u.next();
            return a._output.get_code(e)
        }, a.prototype._handle_tag_close = function (t, e, n) {
            var i = {text: e.text, type: e.type};
            return t.alignment_size = 0, n.tag_complete = !0, t.set_space_before_token(e.newlines || "" !== e.whitespace_before, !0), n.is_unformatted ? t.add_raw_token(e) : ("<" === n.tag_start_char && (t.set_space_before_token("/" === e.text[0], !0), this._is_wrap_attributes_force_expand_multiline && n.has_wrapped_attrs && t.print_newline(!1)), t.print_token(e)), !n.indent_content || n.is_unformatted || n.is_content_unformatted || (t.indent(), n.indent_content = !1), n.is_inline_element || n.is_unformatted || n.is_content_unformatted || t.set_wrap_point(), i
        }, a.prototype._handle_inside_tag = function (t, e, n, i) {
            var _ = n.has_wrapped_attrs, s = {text: e.text, type: e.type};
            if (t.set_space_before_token(e.newlines || "" !== e.whitespace_before, !0), n.is_unformatted) t.add_raw_token(e); else if ("{" === n.tag_start_char && e.type === p.TEXT) t.print_preserved_newlines(e) ? (e.newlines = 0, t.add_raw_token(e)) : t.print_token(e); else {
                if (e.type === p.ATTRIBUTE ? (t.set_space_before_token(!0), n.attr_count += 1) : e.type === p.EQUALS ? t.set_space_before_token(!1) : e.type === p.VALUE && e.previous.type === p.EQUALS && t.set_space_before_token(!1), e.type === p.ATTRIBUTE && "<" === n.tag_start_char && ((this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) && (t.traverse_whitespace(e), _ = _ || 0 !== e.newlines), this._is_wrap_attributes_force)) {
                    var a = n.attr_count > 1;
                    if (this._is_wrap_attributes_force_expand_multiline && 1 === n.attr_count) {
                        var u, r = !0, o = 0;
                        do {
                            if (u = i.peek(o), u.type === p.ATTRIBUTE) {
                                r = !1;
                                break
                            }
                            o += 1
                        } while (o < 4 && u.type !== p.EOF && u.type !== p.TAG_CLOSE);
                        a = !r
                    }
                    a && (t.print_newline(!1), _ = !0)
                }
                t.print_token(e), _ = _ || t.previous_token_wrapped(), n.has_wrapped_attrs = _
            }
            return s
        }, a.prototype._handle_text = function (t, e, n) {
            var i = {text: e.text, type: "TK_CONTENT"};
            return n.custom_beautifier_name ? this._print_custom_beatifier_text(t, e, n) : n.is_unformatted || n.is_content_unformatted ? t.add_raw_token(e) : (t.traverse_whitespace(e), t.print_token(e)), i
        }, a.prototype._print_custom_beatifier_text = function (t, e, n) {
            var i = this;
            if ("" !== e.text) {
                var _, s = e.text, u = 1, r = "", o = "";
                "javascript" === n.custom_beautifier_name && "function" == typeof this._js_beautify ? _ = this._js_beautify : "css" === n.custom_beautifier_name && "function" == typeof this._css_beautify ? _ = this._css_beautify : "html" === n.custom_beautifier_name && (_ = function (t, e) {
                    return new a(t, e, i._js_beautify, i._css_beautify).beautify()
                }), "keep" === this._options.indent_scripts ? u = 0 : "separate" === this._options.indent_scripts && (u = -t.indent_level);
                var p = t.get_full_indent(u);
                if (s = s.replace(/\n[ \t]*$/, ""), "html" !== n.custom_beautifier_name && "<" === s[0] && s.match(/^(<!--|<!\[CDATA\[)/)) {
                    var h = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(s);
                    if (!h) return void t.add_raw_token(e);
                    r = p + h[1] + "\n", s = h[4], h[5] && (o = p + h[5]), s = s.replace(/\n[ \t]*$/, ""), (h[2] || -1 !== h[3].indexOf("\n")) && (h = h[3].match(/[ \t]+$/)) && (e.whitespace_before = h[0])
                }
                if (s) if (_) {
                    var l = function () {
                        this.eol = "\n"
                    };
                    l.prototype = this._options.raw_options;
                    var c = new l;
                    s = _(p + s, c)
                } else {
                    var f = e.whitespace_before;
                    f && (s = s.replace(new RegExp("\n(" + f + ")?", "g"), "\n")), s = p + s.replace(/\n/g, "\n" + p)
                }
                r && (s = s ? r + s + "\n" + o : r + o), t.print_newline(!1), s && (e.text = s, e.whitespace_before = "", e.newlines = 0, t.add_raw_token(e), t.print_newline(!0))
            }
        }, a.prototype._handle_tag_open = function (t, e, n, i) {
            var _ = this._get_tag_open_token(e);
            return !n.is_unformatted && !n.is_content_unformatted || n.is_empty_element || e.type !== p.TAG_OPEN || 0 !== e.text.indexOf("</") ? (t.traverse_whitespace(e), this._set_tag_position(t, e, _, n, i), _.is_inline_element || t.set_wrap_point(), t.print_token(e)) : (t.add_raw_token(e), _.start_tag_token = this._tag_stack.try_pop(_.tag_name)), (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) && (_.alignment_size = e.text.length + 1), _.tag_complete || _.is_unformatted || (t.alignment_size = _.alignment_size), _
        };
        var g = function (t, e) {
            if (this.parent = t || null, this.text = "", this.type = "TK_TAG_OPEN", this.tag_name = "", this.is_inline_element = !1, this.is_unformatted = !1, this.is_content_unformatted = !1, this.is_empty_element = !1, this.is_start_tag = !1, this.is_end_tag = !1, this.indent_content = !1, this.multiline_content = !1, this.custom_beautifier_name = null, this.start_tag_token = null, this.attr_count = 0, this.has_wrapped_attrs = !1, this.alignment_size = 0, this.tag_complete = !1, this.tag_start_char = "", this.tag_check = "", e) {
                var n;
                this.tag_start_char = e.text[0], this.text = e.text, "<" === this.tag_start_char ? (n = e.text.match(/^<([^\s>]*)/), this.tag_check = n ? n[1] : "") : (n = e.text.match(/^{{(?:[\^]|#\*?)?([^\s}]+)/), this.tag_check = n ? n[1] : "", "{{#>" === e.text && ">" === this.tag_check && null !== e.next && (this.tag_check = e.next.text)), this.tag_check = this.tag_check.toLowerCase(), e.type === p.COMMENT && (this.tag_complete = !0), this.is_start_tag = "/" !== this.tag_check.charAt(0), this.tag_name = this.is_start_tag ? this.tag_check : this.tag_check.substr(1), this.is_end_tag = !this.is_start_tag || e.closed && "/>" === e.closed.text, this.is_end_tag = this.is_end_tag || "{" === this.tag_start_char && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(2)))
            } else this.tag_complete = !0
        };
        a.prototype._get_tag_open_token = function (t) {
            var e = new g(this._tag_stack.get_parser_token(), t);
            return e.alignment_size = this._options.wrap_attributes_indent_size, e.is_end_tag = e.is_end_tag || i(e.tag_check, this._options.void_elements), e.is_empty_element = e.tag_complete || e.is_start_tag && e.is_end_tag, e.is_unformatted = !e.tag_complete && i(e.tag_check, this._options.unformatted), e.is_content_unformatted = !e.is_empty_element && i(e.tag_check, this._options.content_unformatted), e.is_inline_element = i(e.tag_name, this._options.inline) || "{" === e.tag_start_char, e
        }, a.prototype._set_tag_position = function (t, e, n, _, s) {
            if (n.is_empty_element || (n.is_end_tag ? n.start_tag_token = this._tag_stack.try_pop(n.tag_name) : (this._do_optional_end_element(n) && (n.is_inline_element || t.print_newline(!1)), this._tag_stack.record_tag(n), "script" !== n.tag_name && "style" !== n.tag_name || n.is_unformatted || n.is_content_unformatted || (n.custom_beautifier_name = d(n.tag_check, e)))), i(n.tag_check, this._options.extra_liners) && (t.print_newline(!1), t._output.just_added_blankline() || t.print_newline(!0)), n.is_empty_element) {
                if ("{" === n.tag_start_char && "else" === n.tag_check) {
                    this._tag_stack.indent_to_tag(["if", "unless", "each"]), n.indent_content = !0;
                    t.current_line_has_match(/{{#if/) || t.print_newline(!1)
                }
                "!--" === n.tag_name && s.type === p.TAG_CLOSE && _.is_end_tag && -1 === n.text.indexOf("\n") || (n.is_inline_element || n.is_unformatted || t.print_newline(!1), this._calcluate_parent_multiline(t, n))
            } else if (n.is_end_tag) {
                var a = !1;
                a = n.start_tag_token && n.start_tag_token.multiline_content, a = a || !n.is_inline_element && !(_.is_inline_element || _.is_unformatted) && !(s.type === p.TAG_CLOSE && n.start_tag_token === _) && "TK_CONTENT" !== s.type, (n.is_content_unformatted || n.is_unformatted) && (a = !1), a && t.print_newline(!1)
            } else n.indent_content = !n.custom_beautifier_name, "<" === n.tag_start_char && ("html" === n.tag_name ? n.indent_content = this._options.indent_inner_html : "head" === n.tag_name ? n.indent_content = this._options.indent_head_inner_html : "body" === n.tag_name && (n.indent_content = this._options.indent_body_inner_html)), n.is_inline_element || n.is_unformatted || "TK_CONTENT" === s.type && !n.is_content_unformatted || t.print_newline(!1), this._calcluate_parent_multiline(t, n)
        }, a.prototype._calcluate_parent_multiline = function (t, e) {
            !e.parent || !t._output.just_added_newline() || (e.is_inline_element || e.is_unformatted) && e.parent.is_inline_element || (e.parent.multiline_content = !0)
        };
        var b = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"],
            m = ["a", "audio", "del", "ins", "map", "noscript", "video"];
        a.prototype._do_optional_end_element = function (t) {
            var e = null;
            if (!t.is_empty_element && t.is_start_tag && t.parent) {
                if ("body" === t.tag_name) e = e || this._tag_stack.try_pop("head"); else if ("li" === t.tag_name) e = e || this._tag_stack.try_pop("li", ["ol", "ul"]); else if ("dd" === t.tag_name || "dt" === t.tag_name) e = e || this._tag_stack.try_pop("dt", ["dl"]), e = e || this._tag_stack.try_pop("dd", ["dl"]); else if ("p" === t.parent.tag_name && -1 !== b.indexOf(t.tag_name)) {
                    var n = t.parent.parent;
                    n && -1 !== m.indexOf(n.tag_name) || (e = e || this._tag_stack.try_pop("p"))
                } else "rp" === t.tag_name || "rt" === t.tag_name ? (e = e || this._tag_stack.try_pop("rt", ["ruby", "rtc"]), e = e || this._tag_stack.try_pop("rp", ["ruby", "rtc"])) : "optgroup" === t.tag_name ? e = e || this._tag_stack.try_pop("optgroup", ["select"]) : "option" === t.tag_name ? e = e || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]) : "colgroup" === t.tag_name ? e = e || this._tag_stack.try_pop("caption", ["table"]) : "thead" === t.tag_name ? (e = e || this._tag_stack.try_pop("caption", ["table"]), e = e || this._tag_stack.try_pop("colgroup", ["table"])) : "tbody" === t.tag_name || "tfoot" === t.tag_name ? (e = e || this._tag_stack.try_pop("caption", ["table"]), e = e || this._tag_stack.try_pop("colgroup", ["table"]), e = e || this._tag_stack.try_pop("thead", ["table"]), e = e || this._tag_stack.try_pop("tbody", ["table"])) : "tr" === t.tag_name ? (e = e || this._tag_stack.try_pop("caption", ["table"]), e = e || this._tag_stack.try_pop("colgroup", ["table"]), e = e || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"])) : "th" !== t.tag_name && "td" !== t.tag_name || (e = e || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]), e = e || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]));
                return t.parent = this._tag_stack.get_parser_token(), e
            }
        }, t.exports.Beautifier = a
    }, function (t, e, n) {
        function i(t) {
            _.call(this, t, "html"), 1 === this.templating.length && "auto" === this.templating[0] && (this.templating = ["django", "erb", "handlebars", "php"]), this.indent_inner_html = this._get_boolean("indent_inner_html"), this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", !0), this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", !0), this.indent_handlebars = this._get_boolean("indent_handlebars", !0), this.wrap_attributes = this._get_selection("wrap_attributes", ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]), this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size), this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]), this.inline = this._get_array("inline", ["a", "abbr", "area", "audio", "b", "bdi", "bdo", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "map", "mark", "math", "meter", "noscript", "object", "output", "progress", "q", "ruby", "s", "samp", "select", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "var", "video", "wbr", "text", "acronym", "big", "strike", "tt"]), this.void_elements = this._get_array("void_elements", ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr", "!doctype", "?xml", "basefont", "isindex"]), this.unformatted = this._get_array("unformatted", []), this.content_unformatted = this._get_array("content_unformatted", ["pre", "textarea"]), this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter"), this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"])
        }

        var _ = n(6).Options;
        i.prototype = new _, t.exports.Options = i
    }, function (t, e, n) {
        var i = n(9).Tokenizer, _ = n(9).TOKEN, s = n(13).Directives, a = n(14).TemplatablePattern, u = n(12).Pattern,
            r = {
                TAG_OPEN: "TK_TAG_OPEN",
                TAG_CLOSE: "TK_TAG_CLOSE",
                ATTRIBUTE: "TK_ATTRIBUTE",
                EQUALS: "TK_EQUALS",
                VALUE: "TK_VALUE",
                COMMENT: "TK_COMMENT",
                TEXT: "TK_TEXT",
                UNKNOWN: "TK_UNKNOWN",
                START: _.START,
                RAW: _.RAW,
                EOF: _.EOF
            }, o = new s(/<\!--/, /-->/), p = function (t, e) {
                i.call(this, t, e), this._current_tag_name = "";
                var n = new a(this._input).read_options(this._options), _ = new u(this._input);
                if (this.__patterns = {
                    word: n.until(/[\n\r\t <]/),
                    single_quote: n.until_after(/'/),
                    double_quote: n.until_after(/"/),
                    attribute: n.until(/[\n\r\t =>]|\/>/),
                    element_name: n.until(/[\n\r\t >\/]/),
                    handlebars_comment: _.starting_with(/{{!--/).until_after(/--}}/),
                    handlebars: _.starting_with(/{{/).until_after(/}}/),
                    handlebars_open: _.until(/[\n\r\t }]/),
                    handlebars_raw_close: _.until(/}}/),
                    comment: _.starting_with(/<!--/).until_after(/-->/),
                    cdata: _.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
                    conditional_comment: _.starting_with(/<!\[/).until_after(/]>/),
                    processing: _.starting_with(/<\?/).until_after(/\?>/)
                }, this._options.indent_handlebars && (this.__patterns.word = this.__patterns.word.exclude("handlebars")), this._unformatted_content_delimiter = null, this._options.unformatted_content_delimiter) {
                    var s = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
                    this.__patterns.unformatted_content_delimiter = _.matching(s).until_after(s)
                }
            };
        p.prototype = new i, p.prototype._is_comment = function (t) {
            return !1
        }, p.prototype._is_opening = function (t) {
            return t.type === r.TAG_OPEN
        }, p.prototype._is_closing = function (t, e) {
            return t.type === r.TAG_CLOSE && e && ((">" === t.text || "/>" === t.text) && "<" === e.text[0] || "}}" === t.text && "{" === e.text[0] && "{" === e.text[1])
        }, p.prototype._reset = function () {
            this._current_tag_name = ""
        }, p.prototype._get_next_token = function (t, e) {
            var n = null;
            this._readWhitespace();
            var i = this._input.peek();
            return null === i ? this._create_token(r.EOF, "") : (n = n || this._read_open_handlebars(i, e), n = n || this._read_attribute(i, t, e), n = n || this._read_close(i, e), n = n || this._read_raw_content(i, t, e), n = n || this._read_content_word(i), n = n || this._read_comment_or_cdata(i), n = n || this._read_processing(i), n = n || this._read_open(i, e), n = n || this._create_token(r.UNKNOWN, this._input.next()))
        }, p.prototype._read_comment_or_cdata = function (t) {
            var e = null, n = null, i = null;
            if ("<" === t) {
                "!" === this._input.peek(1) && (n = this.__patterns.comment.read(), n ? (i = o.get_directives(n)) && "start" === i.ignore && (n += o.readIgnored(this._input)) : n = this.__patterns.cdata.read()), n && (e = this._create_token(r.COMMENT, n), e.directives = i)
            }
            return e
        }, p.prototype._read_processing = function (t) {
            var e = null, n = null;
            if ("<" === t) {
                var i = this._input.peek(1);
                "!" !== i && "?" !== i || (n = this.__patterns.conditional_comment.read(), n = n || this.__patterns.processing.read()), n && (e = this._create_token(r.COMMENT, n), e.directives = null)
            }
            return e
        }, p.prototype._read_open = function (t, e) {
            var n = null, i = null;
            return e || "<" === t && (n = this._input.next(), "/" === this._input.peek() && (n += this._input.next()), n += this.__patterns.element_name.read(), i = this._create_token(r.TAG_OPEN, n)), i
        }, p.prototype._read_open_handlebars = function (t, e) {
            var n = null, i = null;
            return e || this._options.indent_handlebars && "{" === t && "{" === this._input.peek(1) && ("!" === this._input.peek(2) ? (n = this.__patterns.handlebars_comment.read(), n = n || this.__patterns.handlebars.read(), i = this._create_token(r.COMMENT, n)) : (n = this.__patterns.handlebars_open.read(), i = this._create_token(r.TAG_OPEN, n))), i
        }, p.prototype._read_close = function (t, e) {
            var n = null, i = null;
            return e && ("<" === e.text[0] && (">" === t || "/" === t && ">" === this._input.peek(1)) ? (n = this._input.next(), "/" === t && (n += this._input.next()), i = this._create_token(r.TAG_CLOSE, n)) : "{" === e.text[0] && "}" === t && "}" === this._input.peek(1) && (this._input.next(), this._input.next(), i = this._create_token(r.TAG_CLOSE, "}}"))), i
        }, p.prototype._read_attribute = function (t, e, n) {
            var i = null, _ = "";
            if (n && "<" === n.text[0]) if ("=" === t) i = this._create_token(r.EQUALS, this._input.next()); else if ('"' === t || "'" === t) {
                var s = this._input.next();
                s += '"' === t ? this.__patterns.double_quote.read() : this.__patterns.single_quote.read(), i = this._create_token(r.VALUE, s)
            } else (_ = this.__patterns.attribute.read()) && (i = e.type === r.EQUALS ? this._create_token(r.VALUE, _) : this._create_token(r.ATTRIBUTE, _));
            return i
        }, p.prototype._is_content_unformatted = function (t) {
            return -1 === this._options.void_elements.indexOf(t) && (-1 !== this._options.content_unformatted.indexOf(t) || -1 !== this._options.unformatted.indexOf(t))
        }, p.prototype._read_raw_content = function (t, e, n) {
            var i = "";
            if (n && "{" === n.text[0]) i = this.__patterns.handlebars_raw_close.read(); else if (e.type === r.TAG_CLOSE && "<" === e.opened.text[0] && "/" !== e.text[0]) {
                var _ = e.opened.text.substr(1).toLowerCase();
                if ("script" === _ || "style" === _) {
                    var s = this._read_comment_or_cdata(t);
                    if (s) return s.type = r.TEXT, s;
                    i = this._input.readUntil(new RegExp("</" + _ + "[\\n\\r\\t ]*?>", "ig"))
                } else this._is_content_unformatted(_) && (i = this._input.readUntil(new RegExp("</" + _ + "[\\n\\r\\t ]*?>", "ig")))
            }
            return i ? this._create_token(r.TEXT, i) : null
        }, p.prototype._read_content_word = function (t) {
            var e = "";
            if (this._options.unformatted_content_delimiter && t === this._options.unformatted_content_delimiter[0] && (e = this.__patterns.unformatted_content_delimiter.read()), e || (e = this.__patterns.word.read()), e) return this._create_token(r.TEXT, e)
        }, t.exports.Tokenizer = p, t.exports.TOKEN = r
    }]), e = t;
    if ("function" == typeof define && define.amd) define("beautify-html.js", ["require", "./beautify", "./beautify-css"], function (t) {
        var n = t("./beautify"), i = t("./beautify-css");
        return {
            html_beautify: function (t, _) {
                return e(t, _, n.js_beautify, i.css_beautify)
            }
        }
    }); else if ("undefined" != typeof exports) {
        var n = require("./beautify.js"), i = require("./beautify-css.js");
        exports.html_beautify = function (t, _) {
            return e(t, _, n.js_beautify, i.css_beautify)
        }
    } else "undefined" != typeof window ? window.html_beautify = function (t, n) {
        return e(t, n, window.js_beautify, window.css_beautify)
    } : "undefined" != typeof global && (global.html_beautify = function (t, n) {
        return e(t, n, global.js_beautify, global.css_beautify)
    })
}(), function (t) {
    "function" == typeof t.define && (t.define("beautify", ["beautify.js"], function (t) {
        return t
    }), t.define("beautify-css", [], function () {
        return {css_beautify: void 0}
    }), t.define("beautifyModule", ["beautify", "beautify-html.js"], function (e, n) {
        t.js_beautify = e.js_beautify, t.html_beautify = n.html_beautify
    }))
}(this);