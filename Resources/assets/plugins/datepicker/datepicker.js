!function(e, t)
{
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.MCDatepicker = t() : e.MCDatepicker = t()
}(self, (function()
{
    return (() =>
    {
        "use strict";
        var e = {
            422: (e, t, n) =>
            {
                n.d(t, {default: () => _e});
                var a = {
                    DMY: ["calendar", "month", "year"],
                    DY: ["calendar", "month", "year"],
                    D: ["calendar", "month", "year"],
                    MY: ["month", "year"],
                    M: ["month"],
                    Y: ["year"]
                };
                const r = {
                    el: null,
                    dateFormat: "DD-MMM-YYYY",
                    bodyType: "modal",
                    autoClose: !1,
                    closeOndblclick: !0,
                    closeOnBlur: !1,
                    showCalendarDisplay: !0,
                    customWeekDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    customMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    customOkBTN: "OK",
                    customClearBTN: "Clear",
                    customCancelBTN: "CANCEL",
                    firstWeekday: 0,
                    selectedDate: null,
                    minDate: null,
                    maxDate: null,
                    jumpToMinMax: !0,
                    jumpOverDisabled: !0,
                    disableWeekends: !1,
                    disableWeekDays: [],
                    disableDates: [],
                    allowedMonths: [],
                    allowedYears: [],
                    disableMonths: [],
                    disableYears: [],
                    markDates: []
                };
                var c = "show-calendar", i = "hide-calendar", l = "update-calendar", o = "update-display",
                    s = "update-header", d = "update-preview", u = "date-pick", m = "preview-pick", v = "month-change",
                    h = "year-change", p = "set-date", f = function(e)
                    {
                        e.dispatchEvent(new CustomEvent(d, {bubbles: !0}))
                    }, y = function(e)
                    {
                        e.dispatchEvent(new CustomEvent(s, {bubbles: !0}))
                    }, b = function(e)
                    {
                        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        e.dispatchEvent(new CustomEvent(u, {
                            bubbles: !0,
                            detail: {dblclick: t, date: new Date(e.getAttribute("data-val-date"))}
                        }))
                    }, g = function(e, t)
                    {
                        e.dispatchEvent(new CustomEvent(v, {bubbles: !0, detail: {direction: t}}))
                    }, w = function(e, t)
                    {
                        e.dispatchEvent(new CustomEvent(h, {bubbles: !0, detail: {direction: t}}))
                    }, _ = function(e)
                    {
                        var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        e.dispatchEvent(new CustomEvent(m, {
                            bubbles: !0,
                            detail: {dblclick: t, data: e.children[0].innerHTML}
                        }))
                    }, D = function(e)
                    {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                            instance: null,
                            date: null
                        };
                        e.dispatchEvent(new CustomEvent(p, {bubbles: !0, detail: t}))
                    };
                var k = function(e, t, n)
                {
                    var a = (t + 1) % e.length, r = ((t - 1) % e.length + e.length) % e.length, c = (t + 1) / e.length,
                        i = (t - e.length) / e.length;
                    return {newIndex: "next" === n ? a : r, overlap: "next" === n ? ~~c : ~~i}
                }, M = function(e)
                {
                    return new Promise((function(t, n)
                    {
                        setTimeout(t, e)
                    }))
                }, C = function()
                {
                    var e = null;
                    return {
                        slide: function(t, n, a)
                        {
                            var r = "prev" === a ? "slide-right--out" : "slide-left--out",
                                c = "prev" === a ? "slide-right--in" : "slide-left--in";
                            t.classList.add(r), n.classList.add(c), e = M(150).then((function()
                            {
                                t.remove(), n.removeAttribute("style"), n.classList.remove(c)
                            }))
                        }, onFinish: function(t)
                        {
                            !e && t(), e && e.then((function()
                            {
                                return t()
                            })), e = null
                        }
                    }
                }, L = function()
                {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : new Date,
                        t = arguments.length > 1 ? arguments[1] : void 0, n = t.customWeekDays, a = t.customMonths,
                        r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "dd-mmm-yyyy";
                    if(q(e).date() && H(r.toLocaleLowerCase()).isValid())
                    {
                        var c = e.getDay(), i = e.getDate(), l = e.getMonth(), o = e.getFullYear(), s = {
                            d: String(i),
                            dd: String(i).padStart(2, "0"),
                            ddd: n[c].substr(0, 3),
                            dddd: n[c],
                            m: String(l + 1),
                            mm: String(l + 1).padStart(2, "0"),
                            mmm: a[l].substr(0, 3),
                            mmmm: a[l],
                            yy: String(o).substr(2),
                            yyyy: String(o)
                        };
                        return H(r.toLocaleLowerCase()).replaceMatch(s)
                    }
                    throw new Error(e + " Is not a Date object.")
                }, E = function(e)
                {
                    return e.setHours(0, 0, 0, 0).valueOf()
                }, x = function(e)
                {
                    var t = e.getBoundingClientRect();
                    return {
                        t: Math.ceil(t.top),
                        l: Math.ceil(t.left),
                        b: Math.ceil(t.bottom),
                        r: Math.ceil(t.right),
                        w: Math.ceil(t.width),
                        h: Math.ceil(t.height)
                    }
                }, T = function(e, t)
                {
                    var n = function(e, t)
                        {
                            var n = window.innerWidth, a = window.innerHeight, r = document.body.offsetHeight, c = x(t),
                                i = x(e);
                            return {
                                vw: n,
                                vh: a,
                                dh: r,
                                elementOffsetTop: c.t + +window.scrollY,
                                elementOffsetleft: c.l + window.scrollX,
                                elem: c,
                                cal: i
                            }
                        }(e, t), a = n.cal, r = n.elem, c = n.vw, i = n.vh, l = n.dh, o = n.elementOffsetTop,
                        s = n.elementOffsetleft, d = function(e)
                        {
                            var t = e.elem, n = e.cal;
                            return {
                                t: t.t - n.h - 10,
                                b: t.b + n.h + 10,
                                l: t.w > n.w ? t.l : t.l - n.w,
                                r: t.w > n.w ? t.r : t.r + n.w
                            }
                        }(n), u = function(e)
                        {
                            var t = e.elementOffsetTop, n = e.elem, a = e.cal;
                            return {t: t - a.h - 10, b: t + n.h + a.h + 10}
                        }(n), m = d.l > 0, v = c > d.r, h = d.t > 0, p = i > d.b, f = u.t > 0, y = l > u.b, b = null,
                        g = null;
                    return v && (g = s), !v && m && (g = s + r.w - a.w), v || m || (g = (c - a.w) / 2), p && (b = o + r.h + 5), !p && h && (b = o - a.h - 5), p || h || (y && (b = o + r.h + 5), !y && f && (b = o - a.h - 5), y || f || (b = (i - a.h) / 2)), {
                        top: b,
                        left: g
                    }
                }, O = function(e)
                {
                    return {
                        active: function()
                        {
                            e.classList.remove("mc-select__nav--inactive")
                        }, inactive: function()
                        {
                            e.classList.add("mc-select__nav--inactive")
                        }
                    }
                }, S = function(e, t)
                {
                    var n = e.calendar, a = e.calendarDisplay, r = e.calendarHeader, c = e.monthYearPreview;
                    return {
                        display: {
                            target: t, date: null, set setDate(e)
                            {
                                this.date = e, a.dispatchEvent(new CustomEvent(o, {bubbles: !0}))
                            }
                        }, header: {
                            target: t, month: null, year: null, set setTarget(e)
                            {
                                this.target = e, y(r)
                            }, set setMonth(e)
                            {
                                this.month = e, y(r)
                            }, set setYear(e)
                            {
                                this.year = e, y(r)
                            }
                        }, preview: {
                            target: null, month: null, year: null, set setTarget(e)
                            {
                                this.target = e, f(c)
                            }, set setMonth(e)
                            {
                                this.month = e, f(c)
                            }, set setYear(e)
                            {
                                this.year = e, f(c)
                            }
                        }, calendar: {
                            date: null, set setDate(e)
                            {
                                this.date = e, n.dispatchEvent(new CustomEvent(l, {bubbles: !0}))
                            }
                        }
                    }
                }, Y = function(e)
                {
                    var t = null, n = null, a = null, r = !1;
                    return {
                        opened: !1,
                        closed: !0,
                        blured: !1,
                        isOpening: !1,
                        isClosing: !1,
                        isBluring: !1,
                        open : function(n)
                        {
                            var i = this;

                            // 🛑 УЖЕ ОТКРЫТО — ничего не делать
                            if(this.opened || this.isOpening || this.isClosing)
                            {
                                return;
                            }

                            r = a && a._id === n._id;
                            this.isOpening = true;

                            clearTimeout(t);

                            (function(e, t)
                            {
                                e.dispatchEvent(new CustomEvent(c, {
                                    bubbles : true,
                                    detail : {instance : t},
                                }));
                            })(e, n);

                            t = setTimeout(function()
                            {
                                i.isOpening = false;
                                i.opened = true;
                                i.closed = false;
                                a = n;
                            }, 200);
                        },
                        close: function()
                        {
                            var t = this;
                            this.closed || this.isOpening || this.isClosing || (r = !1, this.isClosing = !0, clearTimeout(n), e.dispatchEvent(new CustomEvent(i, {bubbles: !0})), n = setTimeout((function()
                            {
                                t.isClosing = !1, t.opened = !1, t.closed = !0;
                                document.activeElement.blur();
                            }), 200))
                        },
                        blur: function()
                        {
                            var e = this;
                            return this.isBluring = !0, M(100).then((function()
                            {
                                return e.closed || e.isOpening || e.isClosing ? !r : !(a && !a.options.closeOnBlur) && (e.close(), e.isBluring = !1, e.blured = !0, !0)
                            }))
                        }
                    }
                }, j = function()
                {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16;
                    return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(e)).toString(16)
                };

                function N(e, t)
                {
                    var n = Object.keys(e);
                    if(Object.getOwnPropertySymbols)
                    {
                        var a = Object.getOwnPropertySymbols(e);
                        t && (a = a.filter((function(t)
                        {
                            return Object.getOwnPropertyDescriptor(e, t).enumerable
                        }))), n.push.apply(n, a)
                    }
                    return n
                }

                function F(e)
                {
                    for(var t = 1; t < arguments.length; t++)
                    {
                        var n = null != arguments[t] ? arguments[t] : {};
                        t % 2 ? N(Object(n), !0).forEach((function(t)
                        {
                            A(e, t, n[t])
                        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : N(Object(n)).forEach((function(t)
                        {
                            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                        }))
                    }
                    return e
                }

                function A(e, t, n)
                {
                    return t in e ? Object.defineProperty(e, t, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }) : e[t] = n, e
                }

                function P(e)
                {
                    return function(e)
                    {
                        if(Array.isArray(e))
                        {
                            return B(e)
                        }
                    }(e) || function(e)
                    {
                        if("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                        {
                            return Array.from(e)
                        }
                    }(e) || function(e, t)
                    {
                        if(!e)
                        {
                            return;
                        }
                        if("string" == typeof e)
                        {
                            return B(e, t);
                        }
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if("Map" === n || "Set" === n)
                        {
                            return Array.from(e);
                        }
                        if("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                        {
                            return B(e, t)
                        }
                    }(e) || function()
                    {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function B(e, t)
                {
                    (null == t || t > e.length) && (t = e.length);
                    for(var n = 0, a = new Array(t); n < t; n++) a[n] = e[n];
                    return a
                }

                var q = function(e)
                {
                    var t = Object.prototype.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
                    return {
                        object: function()
                        {
                            return "object" === t
                        }, array: function()
                        {
                            return "array" === t
                        }, date: function()
                        {
                            return "date" === t
                        }, number: function()
                        {
                            var n = Number.isNaN(e);
                            return "number" === t && !n
                        }, string: function()
                        {
                            return "string" === t
                        }, boolean: function()
                        {
                            return "boolean" === t
                        }, func: function()
                        {
                            return "function" === t
                        }
                    }
                }, H = function(e)
                {
                    var t = /^(?:(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})?\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{4}|y{2})\b(?:(?:,\s)|[.-\s\/]{1})?(d{1,4}|m{1,4}|y{2}|y{4})?\b)$/gi;
                    return {
                        isValid: function()
                        {
                            var n = t.test(e);
                            return n || console.error(new Error('"'.concat(e, '" format is not supported')))
                        }, replaceMatch: function(n)
                        {
                            return e.replace(t, (function(e)
                            {
                                for(var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) a[r - 1] = arguments[r];
                                return a.forEach((function(t)
                                {
                                    t && (e = e.replace(t, n[t]))
                                })), e
                            }))
                        }
                    }
                }, W = function(e, t)
                {
                    var n = Object.keys(t).filter((function(n)
                    {
                        return !t[n](e[n])
                    })).map((function(e)
                    {
                        return new Error('Data does not match the schema for property: "'.concat(e, '"'))
                    }));
                    return 0 === n.length || (n.forEach((function(e)
                    {
                        return console.error(e)
                    })), !1)
                }, I = {
                    date: function(e)
                    {
                        return q(e).date()
                    }, title: function(e)
                    {
                        return q(e).string()
                    }, description: function(e)
                    {
                        return q(e).string()
                    }
                }, $ = {
                    type: function(e)
                    {
                        return q(e).string()
                    }, color: function(e)
                    {
                        return /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(e)
                    }
                }, J = {
                    el: function(e)
                    {
                        return /^[#][-\w]+$/.test(e)
                    }, dateFormat: function(e)
                    {
                        return H(e).isValid()
                    }, bodyType: function(e)
                    {
                        return ["modal", "inline", "permanent"].includes(e)
                    }, autoClose: function(e)
                    {
                        return q(e).boolean()
                    }, closeOndblclick: function(e)
                    {
                        return q(e).boolean()
                    }, closeOnBlur: function(e)
                    {
                        return q(e).boolean()
                    }, showCalendarDisplay: function(e)
                    {
                        return q(e).boolean()
                    }, customWeekDays: function(e)
                    {
                        return q(e).array() && 7 === e.length && e.every((function(e)
                        {
                            return /^[^\d\s]{2,}$/.test(e)
                        }))
                    }, customMonths: function(e)
                    {
                        return q(e).array() && 12 === e.length && e.every((function(e)
                        {
                            return /^[^\d\s]{2,}$/.test(e)
                        }))
                    }, customOkBTN: function(e)
                    {
                        return q(e).string()
                    }, customClearBTN: function(e)
                    {
                        return q(e).string()
                    }, customCancelBTN: function(e)
                    {
                        return q(e).string()
                    }, firstWeekday: function(e)
                    {
                        return q(e).number() && /^[0-6]{1}$/.test(e)
                    }, selectedDate: function(e)
                    {
                        return q(e).date()
                    }, minDate: function(e)
                    {
                        return q(e).date()
                    }, maxDate: function(e)
                    {
                        return q(e).date()
                    }, jumpToMinMax: function(e)
                    {
                        return q(e).boolean()
                    }, jumpOverDisabled: function(e)
                    {
                        return q(e).boolean()
                    }, disableWeekends: function(e)
                    {
                        return q(e).boolean()
                    }, disableWeekDays: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return /^[0-6]{1}$/.test(e)
                        }))
                    }, disableDates: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).date()
                        }))
                    }, allowedMonths: function(e)
                    {
                        return q(e).array() && e.length < 12 && e.every((function(e)
                        {
                            return q(e).number() && e < 12
                        }))
                    }, allowedYears: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).number()
                        }))
                    }, disableMonths: function(e)
                    {
                        return q(e).array() && e.length < 12 && e.every((function(e)
                        {
                            return q(e).number() && e < 12
                        }))
                    }, disableYears: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).number()
                        }))
                    }, markDates: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).date()
                        }))
                    }, markDatesCustom: function(e)
                    {
                        return q(e).func()
                    }, daterange: function(e)
                    {
                        return q(e).boolean()
                    }, events: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).object() && W(e, I)
                        }))
                    }, eventColorScheme: function(e)
                    {
                        return q(e).array() && e.every((function(e)
                        {
                            return q(e).object() && W(e, $)
                        }))
                    }
                }, z = function(e, t)
                {
                    var n = Object.keys(e).filter((function(e)
                    {
                        return !t.hasOwnProperty(e)
                    })).map((function(e)
                    {
                        return new Error('Property "'.concat(e, '" is not recognized'))
                    }));
                    e.hasOwnProperty("allowedMonths") && e.hasOwnProperty("disableMonths") && n.unshift(new Error('"disableMonths" option cannot be used along with "allowedMonths" option')), e.hasOwnProperty("allowedYears") && e.hasOwnProperty("disableYears") && n.unshift(new Error('"disableYears" option cannot be used along with "allowedYears" option'));
                    var a = Object.keys(e).filter((function(n)
                    {
                        return t.hasOwnProperty(n) && !J[n](e[n])
                    })).map((function(e)
                    {
                        return new Error('Data does not match the schema for property: "'.concat(e, '"'))
                    }));
                    return e.hasOwnProperty("minDate") && e.hasOwnProperty("maxDate") && E(e.minDate) >= E(e.maxDate) && n.push(new Error("maxDate should be greater than minDate")), a.length > 0 && n.push.apply(n, P(a)), n.length > 0 ? n.forEach((function(e)
                    {
                        return console.error(e)
                    })) : F(F({}, t), e)
                }, U = function(e, t)
                {
                    return '<span style="transform: translateX('.concat("next" === e ? "-100" : "100", 'px);">').concat(t, "</span>")
                };
                var V = function(e)
                {
                    e.linkedElement && (e.linkedElement.onfocus = function(t)
                    {
                        e.open()
                    })
                }, K = function(e, t)
                {
                    return !(!e || !t) && E(e) < E(t)
                }, X = function(e, t)
                {
                    return !(!e || !t) && E(e) > E(t)
                }, R = function(e, t)
                {
                    var n = e.allowedMonths, a = e.disableMonths;
                    return n.length ? n.includes(t) : !a.includes(t)
                }, Z = function(e, t)
                {
                    var n = e.disableYears, a = e.allowedYears;
                    return a.length ? a.includes(t) : !n.includes(t)
                }, G = function()
                {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                    return {
                        date: e,
                        day: e.getDay(),
                        dateNumb: e.getDate(),
                        month: e.getMonth(),
                        year: e.getFullYear(),
                        classList: []
                    }
                }, Q = function(e, t)
                {
                    var n = e.options, a = e.pickedDate, r = new Date(t.getFullYear(), t.getMonth(), 1),
                        c = r.getMonth(), i = function(t)
                        {
                            var r = ["mc-date"];
                            return !function(e, t)
                            {
                                return t.month === e
                            }(c, t) || !R(n, t.month) || !Z(n, t.year) || function(e, t)
                            {
                                var n = e.prevLimitDate, a = e.nextLimitDate, r = t.date, c = !!n && E(r) < E(n),
                                    i = !!a && E(a) < E(r);
                                return c || i
                            }(e, t) || function(e, t)
                            {
                                var n = e.disableWeekends, a = t.day;
                                return !!n && (0 === a || 6 === a)
                            }(n, t) || function(e, t)
                            {
                                var n = e.disableWeekDays, a = t.day;
                                return !!n.length && n.some((function(e)
                                {
                                    return e === a
                                }))
                            }(n, t) || function(e, t)
                            {
                                var n = e.disableDates, a = t.date;
                                return !!n.length && n.some((function(e)
                                {
                                    return E(e) === E(a)
                                }))
                            }(n, t) ? r.push("mc-date--inactive") : r.push("mc-date--active"), function(e, t)
                            {
                                var n = t.date;
                                return null !== e && E(e) === E(n)
                            }(a, t) && r.push("mc-date--picked"), function(e, t)
                            {
                                var n = e.options, a = e.markCustomCallbacks, r = t.date,
                                    c = n.markDates.some((function(e)
                                    {
                                        return E(e) === E(r)
                                    })), i = a.some((function(e)
                                    {
                                        return e.apply(null, [r])
                                    }));
                                return c || i
                            }(e, t) && r.push("mc-date--marked"), function(e)
                            {
                                var t = e.date;
                                return E(t) === E(new Date)
                            }(t) && r.push("mc-date--today"), t.classList = r.join(" "), t
                        };
                    return function(e, t)
                    {
                        var n = [], a = e.firstWeekday, r = -1 * (t.getDay() - (a - 7) % 7 - 1) % 7;
                        for(r = r > -6 ? r : 1; n.length < 42;)
                        {
                            var c = new Date(t), i = new Date(c.setDate(r++));
                            n.push(G(i))
                        }
                        return n
                    }(n, r).map((function(e)
                    {
                        return i(e)
                    }))
                };

                function ee()
                {
                    var e = document.createElement("div");
                    e.className = "mc-calendar", e.setAttribute("tabindex", 0), e.innerHTML = '<div class="mc-display" data-target="calendar">\n<div class="mc-display__header">\n<h3 class="mc-display__day">Thursday</h3>\n</div>\n<div class="mc-display__body">\n<div class="mc-display__data mc-display__data--primary">\n<h1 class="mc-display__date">1</h1>\n</div>\n<div class="mc-display__data mc-display__data--secondary">\n<h3 class="mc-display__month">January</h3>\n<h2 class="mc-display__year">1970</h2>\n</div>\n</div>\n</div>\n<div class="mc-picker">\n<div class="mc-picker__header mc-select mc-container" data-target="calendar">\n<div class="mc-select__month">\n<button id="mc-picker__month--prev" class="mc-select__nav mc-select__nav--prev">\n<svg class="icon-angle icon-angle--left" viewBox="0 0 256 512" width=\'10px\' height=\'100%\'>\n<path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />\n</svg>\n</button>\n<div id="mc-current--month" class="mc-select__data mc-select__data--month">\n<span>January</span>\n</div>\n<button id="mc-picker__month--next" class="mc-select__nav mc-select__nav--next">\n<svg class="icon-angle icon-angle--right" viewBox="0 0 256 512" width=\'10px\' height=\'100%\'>\n<path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />\n</svg>\n</button>\n</div>\n<div class="mc-select__year">\n<button id="mc-picker__year--prev" class="mc-select__nav mc-select__nav--prev">\n<svg class="icon-angle icon-angle--left" viewBox="0 0 256 512" width=\'10px\' height=\'100%\'>\n<path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z" />\n</svg>\n</button>\n<div id="mc-current--year" class="mc-select__data mc-select__data--year">\n<span>1970</span>\n</div>\n<button id="mc-picker__year--next" class="mc-select__nav mc-select__nav--next">\n<svg class="icon-angle icon-angle--right" viewBox="0 0 256 512" width=\'10px\' height=\'100%\'>\n<path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z" />\n</svg>\n</button>\n</div>\n</div>\n<div class="mc-picker__body">\n<table class="mc-table mc-container">\n<thead class="mc-table__header">\n<tr>\n<th class="mc-table__weekday">S</th>\n<th class="mc-table__weekday">M</th>\n<th class="mc-table__weekday">T</th>\n<th class="mc-table__weekday">W</th>\n<th class="mc-table__weekday">T</th>\n<th class="mc-table__weekday">F</th>\n<th class="mc-table__weekday">S</th>\n</tr>\n</thead>\n<tbody class="mc-table__body">\n<tr class="mc-table__week">\n<td class="mc-date mc-date--inactive" data-val-date="">28</td>\n<td class="mc-date mc-date--inactive" data-val-date="">29</td>\n<td class="mc-date mc-date--inactive" data-val-date="">30</td>\n<td class="mc-date mc-date--inactive" data-val-date="">31</td>\n<td class="mc-date mc-date--active" data-val-date="">1</td>\n<td class="mc-date mc-date--active" data-val-date="">2</td>\n<td class="mc-date mc-date--active" data-val-date="">3</td>\n</tr>\n<tr class="mc-table__week">\n<td class="mc-date mc-date--active" data-val-date="">4</td>\n<td class="mc-date mc-date--active" data-val-date="">5</td>\n<td class="mc-date mc-date--active" data-val-date="">6</td>\n<td class="mc-date mc-date--active" data-val-date="">7</td>\n<td class="mc-date mc-date--active" data-val-date="">8</td>\n<td class="mc-date mc-date--active" data-val-date="">9</td>\n<td class="mc-date mc-date--active" data-val-date="">10</td>\n</tr>\n<tr class="mc-table__week">\n<td class="mc-date mc-date--active" data-val-date="">11</td>\n<td class="mc-date mc-date--active" data-val-date="">12</td>\n<td class="mc-date mc-date--active" data-val-date="">13</td>\n<td class="mc-date mc-date--active" data-val-date="">14</td>\n<td class="mc-date mc-date--active" data-val-date="">15</td>\n<td class="mc-date mc-date--active" data-val-date="">16</td>\n<td class="mc-date mc-date--active" data-val-date="">17</td>\n</tr>\n<tr class="mc-table__week">\n<td class="mc-date mc-date--active" data-val-date="">18</td>\n<td class="mc-date mc-date--active" data-val-date="">19</td>\n<td class="mc-date mc-date--active" data-val-date="">20</td>\n<td class="mc-date mc-date--active" data-val-date="">21</td>\n<td class="mc-date mc-date--active" data-val-date="">22</td>\n<td class="mc-date mc-date--active" data-val-date="">23</td>\n<td class="mc-date mc-date--active" data-val-date="">24</td>\n</tr>\n<tr class="mc-table__week">\n<td class="mc-date mc-date--active" data-val-date="">25</td>\n<td class="mc-date mc-date--active" data-val-date="">26</td>\n<td class="mc-date mc-date--active" data-val-date="">27</td>\n<td class="mc-date mc-date--active" data-val-date="">28</td>\n<td class="mc-date mc-date--active" data-val-date="">29</td>\n<td class="mc-date mc-date--active" data-val-date="">30</td>\n<td class="mc-date mc-date--active" data-val-date="">31</td>\n</tr>\n<tr class="mc-table__week">\n<td class="mc-date mc-date--inactive" data-val-date="">1</td>\n<td class="mc-date mc-date--inactive" data-val-date="">2</td>\n<td class="mc-date mc-date--inactive" data-val-date="">3</td>\n<td class="mc-date mc-date--inactive" data-val-date="">4</td>\n<td class="mc-date mc-date--inactive" data-val-date="">5</td>\n<td class="mc-date mc-date--inactive" data-val-date="">6</td>\n<td class="mc-date mc-date--inactive" data-val-date="">7</td>\n</tr>\n</tbody>\n</table>\n<div class="mc-month-year__preview" data-target=null>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n<div class="mc-month-year__cell"></div>\n</div>\n</div>\n<div class="mc-picker__footer mc-container">\n<div class="mc-footer__section mc-footer__section--primary">\n<button id="mc-btn__clear" class="mc-btn mc-btn--danger">Clear</button>\n</div>\n<div class="mc-footer__section mc-footer__section--secondary">\n<button id="mc-btn__cancel" class="mc-btn mc-btn--success">CANCEL</button>\n<button id="mc-btn__ok" class="mc-btn mc-btn--success">OK</button>\n</div>\n</div>\n</div>', document.body.appendChild(e);

                    var t = ae(e);
                    return function(e)
                    {
                        var t = null, n = !0, a = e.calendarStates, r = e.calendar, f = e.calendarDisplay,
                            y = e.calendarHeader, D = e.currentMonthSelect, k = e.currentYearSelect,
                            M = e.monthYearPreview, L = e.monthNavPrev, E = e.monthNavNext, x = e.yearNavPrev,
                            T = e.yearNavNext, O = e.dateCells, S = e.previewCells, Y = e.cancelButton, j = e.okButton,
                            N = e.clearButton;
                        r.addEventListener(c, (function(n)
                        {

                            if(typeof idFormDebounce !== 'undefined' && idFormDebounce !== false)
                            {
                                clearTimeout(idFormDebounce);
                            }

                            t = n.detail.instance, pe(e, t), r.classList.add("mc-calendar--opened"), r.focus(), t.onOpenCallbacks.forEach((function(e)
                            {
                                return e.apply(null)
                            }))
                        })), r.addEventListener(i, (function()
                        {
                            var e = t, n = (e.store, e.options), a = e.onCloseCallbacks;
                            r.classList.remove("mc-calendar--opened"), "inline" == n.bodyType && r.removeAttribute("style"), t = null, a.forEach((function(e)
                            {
                                return e.apply(null)
                            }))
                        })), r.addEventListener(u, (function(e)
                        {
                            var n = t.options, r = n.autoClose, c = n.closeOndblclick;
                            if(!e.target.classList.contains("mc-date--inactive"))
                            {
                                if(e.detail.dblclick)
                                {
                                    if(!c)
                                    {
                                        return;
                                    }
                                    return se(t, a)
                                }
                                t.pickedDate = e.detail.date, t.store.display.setDate = e.detail.date, O.forEach((function(e)
                                {
                                    return e.classList.remove("mc-date--picked")
                                })), e.target.classList.add("mc-date--picked"), r && se(t, a)
                            }
                        })), r.addEventListener(m, (function(e)
                        {
                            var n = e.detail, r = n.data, c = n.dblclick, i = t, l = i.store, o = i.options,
                                s = i.viewLayers, d = o.customMonths, u = o.autoClose, m = o.closeOndblclick,
                                v = l.preview.target;
                            if(!e.target.classList.contains("mc-month-year__cell--inactive"))
                            {
                                if(S.forEach((function(e)
                                {
                                    return e.classList.remove("mc-month-year__cell--picked")
                                })), e.target.classList.add("mc-month-year__cell--picked"), c && l.preview.target === s[0])
                                {
                                    if(!m)
                                    {
                                        return;
                                    }
                                    return se(t, a)
                                }
                                var h = l.preview.year, p = d[l.header.month];
                                "year" === s[0] && (p = d[0]), "month" === v && (p = r), "year" === v && (h = Number(r));
                                var f = d.findIndex((function(e)
                                {
                                    return e.includes(p)
                                })), y = ce(t, new Date(h, f));
                                l.header.month = y.getMonth(), l.preview.year = y.getFullYear(), "year" !== s[0] && (l.header.year = y.getFullYear()), l.preview.month = y.getMonth(), "calendar" !== s[0] && (t.pickedDate = y), "calendar" !== s[0] && (l.display.setDate = y), "calendar" === s[0] && (l.calendar.setDate = y), l.preview.setTarget = s[0], l.header.setTarget = s[0], u && l.preview.target === s[0] && se(t, a)
                            }
                        })), r.addEventListener(p, (function(e)
                        {
                            var n = e.detail, a = n.instance, r = n.date;
                            if(a.pickedDate = r, de(a), JSON.stringify(t) === JSON.stringify(a))
                            {
                                var c = t.store;
                                c.display.setDate = r, c.calendar.setDate = c.calendar.date, "calendar" !== c.preview.target && (c.preview.month = r.getMonth(), c.preview.year = r.getFullYear(), c.preview.setTarget = c.preview.target), "month" === c.header.target && (c.header.month = r.getMonth(), c.header.year = r.getFullYear(), c.header.setTarget = c.header.target)
                            }
                        })), r.addEventListener(l, (function(n)
                        {
                            return me(e, t)
                        })), r.addEventListener("blur", (function(e)
                        {
                            e.preventDefault(), !r.contains(e.relatedTarget) && t && a.blur()
                        })), f.addEventListener(o, (function(n)
                        {
                            ue(e, t)
                        })), y.addEventListener(s, (function(n)
                        {
                            return ve(e, t)
                        })), M.addEventListener(d, (function(n)
                        {
                            return he(e, t)
                        })), D.addEventListener(v, (function(e)
                        {
                            if(n)
                            {
                                n = !n;
                                var a = C(), r = t, c = r.store, i = r.viewLayers, l = r.options,
                                    o = r.onMonthChangeCallbacks, s = r.onYearChangeCallbacks, d = l.customMonths,
                                    u = e.detail.direction, m = d[c.header.month], v = c.header.year, h = ie(t, m, u),
                                    p = h.newMonth, f = h.overlap, y = 0 !== f ? le(l, v, u) : v,
                                    b = new Date(y, p.index, 1);
                                0 !== f && (k.innerHTML += U(u, y), a.slide(k.children[0], k.children[1], u), s.forEach((function(e)
                                {
                                    return e.apply(null)
                                }))), e.target.innerHTML += U(u, p.name), a.slide(e.target.children[0], e.target.children[1], u), a.onFinish((function()
                                {
                                    "calendar" === i[0] && (c.calendar.setDate = b), "calendar" !== i[0] && (c.display.setDate = b), "month" === i[0] && (t.pickedDate = b), c.header.year = b.getFullYear(), c.header.setMonth = b.getMonth(), c.preview.year = b.getFullYear(), c.preview.setMonth = b.getMonth(), o.forEach((function(e)
                                    {
                                        return e.apply(null)
                                    })), n = !n
                                }))
                            }
                        })), k.addEventListener(h, (function(e)
                        {
                            if(n)
                            {
                                n = !n;
                                var a = e.detail.direction, r = t, c = r.store, i = r.viewLayers, l = r.options,
                                    o = r.onMonthChangeCallbacks, s = r.onYearChangeCallbacks, d = r.prevLimitDate,
                                    u = r.nextLimitDate, m = l.customMonths, v = C(), h = "next" === a,
                                    p = c.header.year, f = c.header.month, y = c.header.target, b = le(l, p, a),
                                    g = null, w = b && ce(t, new Date(b, f, 1));
                                if(b || (w = h ? u : d), w.getMonth() !== f && (g = m[w.getMonth()]), "year" === y)
                                {
                                    var _ = c.header.year, k = h ? _ + 12 : _ - 12;
                                    return c.header.setYear = k, c.preview.setTarget = "year", void (n = !n)
                                }
                                g && (D.innerHTML += U(a, g), v.slide(D.children[0], D.children[1], a), o.forEach((function(e)
                                {
                                    return e.apply(null)
                                }))), b && (e.target.innerHTML += U(a, b), v.slide(e.target.children[0], e.target.children[1], a), s.forEach((function(e)
                                {
                                    return e.apply(null)
                                }))), v.onFinish((function()
                                {
                                    "calendar" === i[0] && (c.calendar.setDate = w), "calendar" !== i[0] && (c.display.setDate = w), "calendar" !== i[0] && (t.pickedDate = w), c.preview.year = w.getFullYear(), c.preview.setMonth = w.getMonth(), c.header.year = w.getFullYear(), c.header.setMonth = w.getMonth(), n = !n
                                }))
                            }
                        })), D.onclick = function()
                        {
                            var e = t, n = e.store, a = e.viewLayers;
                            if("month" !== a[0])
                            {
                                var r = M.classList.contains("mc-month-year__preview--opened"),
                                    c = "month" === n.preview.target;
                                r && c ? n.preview.setTarget = a[0] : (n.header.setTarget = "month", n.preview.setTarget = "month")
                            }
                        }, k.onclick = function()
                        {
                            var e = t, n = e.store, a = e.viewLayers;
                            if("year" !== a[0])
                            {
                                var r = M.classList.contains("mc-month-year__preview--opened"), c = n.preview.target;
                                if(r && "year" === c)
                                {
                                    return n.header.year = n.preview.year, n.preview.setTarget = a[0], void (n.header.setTarget = a[0]);
                                }
                                n.header.year = n.preview.year - 4, n.header.setTarget = "year", n.preview.setTarget = "year"
                            }
                        }, S.forEach((function(e)
                        {
                            e.onclick = function(e)
                            {
                                1 === e.detail && _(e.currentTarget)
                            }, e.ondblclick = function(e)
                            {
                                2 === e.detail && _(e.currentTarget, !0)
                            }
                        })), O.forEach((function(e)
                        {
                            e.onclick = function(e)
                            {
                                1 === e.detail && b(e.target)
                            }, e.ondblclick = function(e)
                            {
                                2 === e.detail && b(e.target, !0)
                            }
                        })), L.addEventListener("click", (function(e)
                        {
                            e.currentTarget.classList.contains("mc-select__nav--inactive") || g(D, "prev")
                        })), E.addEventListener("click", (function(e)
                        {
                            e.currentTarget.classList.contains("mc-select__nav--inactive") || g(D, "next")
                        })), x.addEventListener("click", (function(e)
                        {
                            e.currentTarget.classList.contains("mc-select__nav--inactive") || w(k, "prev")
                        })), T.addEventListener("click", (function(e)
                        {
                            e.currentTarget.classList.contains("mc-select__nav--inactive") || w(k, "next")
                        })), Y.addEventListener("click", (function(e)
                        {
                            t.onCancelCallbacks.forEach((function(e)
                            {
                                return e.apply(null)
                            })), a.close()
                        })), j.addEventListener("click", (function(e)
                        {
                            return se(t, a)
                        })), N.addEventListener("click", (function(e)
                        {
                            var n = t.linkedElement;
                            O.forEach((function(e)
                            {
                                return e.classList.remove("mc-date--picked")
                            })), t.pickedDate = null, n && (n.value = null)
                        }))
                    }(t), t
                }

                function te(e)
                {
                    return function(e)
                    {
                        if(Array.isArray(e))
                        {
                            return ne(e)
                        }
                    }(e) || function(e)
                    {
                        if("undefined" != typeof Symbol && Symbol.iterator in Object(e))
                        {
                            return Array.from(e)
                        }
                    }(e) || function(e, t)
                    {
                        if(!e)
                        {
                            return;
                        }
                        if("string" == typeof e)
                        {
                            return ne(e, t);
                        }
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        "Object" === n && e.constructor && (n = e.constructor.name);
                        if("Map" === n || "Set" === n)
                        {
                            return Array.from(e);
                        }
                        if("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
                        {
                            return ne(e, t)
                        }
                    }(e) || function()
                    {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                    }()
                }

                function ne(e, t)
                {
                    (null == t || t > e.length) && (t = e.length);
                    for(var n = 0, a = new Array(t); n < t; n++) a[n] = e[n];
                    return a
                }

                var ae = function(e)
                {
                    return {
                        calendar: e,
                        calendarDisplay: e.querySelector(".mc-display"),
                        displayDay: e.querySelector(".mc-display__day"),
                        displayDate: e.querySelector(".mc-display__date"),
                        displayMonth: e.querySelector(".mc-display__month"),
                        displayYear: e.querySelector(".mc-display__year"),
                        calendarHeader: e.querySelector(".mc-picker__header"),
                        currentMonthSelect: e.querySelector("#mc-current--month"),
                        currentYearSelect: e.querySelector("#mc-current--year"),
                        monthNavPrev: e.querySelector("#mc-picker__month--prev"),
                        monthNavNext: e.querySelector("#mc-picker__month--next"),
                        yearNavPrev: e.querySelector("#mc-picker__year--prev"),
                        yearNavNext: e.querySelector("#mc-picker__year--next"),
                        weekdays: e.querySelectorAll(".mc-table__weekday"),
                        okButton: e.querySelector("#mc-btn__ok"),
                        cancelButton: e.querySelector("#mc-btn__cancel"),
                        clearButton: e.querySelector("#mc-btn__clear"),
                        dateCells: e.querySelectorAll(".mc-date"),
                        monthYearPreview: e.querySelector(".mc-month-year__preview"),
                        previewCells: e.querySelectorAll(".mc-month-year__cell"),
                        calendarStates: Y(e)
                    }
                }, re = function(e)
                {

                    var t = e.dateFormat.split(/(?:(?:,\s)|[.-\s\/]{1})/).map((function(e)
                    {
                        return e.charAt(0).toUpperCase()
                    })), n = te(new Set(t)).sort().join("");
                    return a[n]
                }, ce = function(e)
                {

                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, n = e.options,
                        a = e.pickedDate, r = e.prevLimitDate, c = e.nextLimitDate, i = e.activeMonths,
                        l = a || new Date, o = l.getMonth();
                    if(!R(n, o))
                    {
                        var s = i.reduce((function(e, t)
                        {
                            return Math.abs(t.index - o) < Math.abs(e.index - o) ? t : e
                        }));
                        l.setMonth(s.index)
                    }
                    return t && (l = t), r && K(l, r) && (l = r), c && X(l, c) && (l = c), l
                }, ie = function(e, t, n)
                {

                    var a = e.activeMonths, r = e.options, c = r.customMonths;
                    if(!r.jumpOverDisabled)
                    {
                        var i = k(c, c.indexOf(t), n), l = i.newIndex, o = i.overlap;
                        return {newMonth: {name: c[l], index: l}, overlap: o}
                    }
                    var s = a.findIndex((function(e)
                    {
                        return e.name === t
                    })), d = k(a, s, n), u = d.newIndex, m = d.overlap;
                    return {newMonth: a[u], overlap: m}
                }, le = function(e, t, n)
                {

                    var a = e.allowedYears, r = "next" === n ? t + 1 : t - 1;
                    if(!e.jumpOverDisabled)
                    {
                        return r;
                    }
                    if(a.length)
                    {
                        var c = k(a, a.indexOf(t), n), i = c.newIndex;
                        return r = 0 !== c.overlap ? null : a[i]
                    }
                    for(; !Z(e, r);) "next" === n ? r++ : r--;
                    return r
                }, oe = function(e)
                {

                    return e.customMonths.map((function(t, n)
                    {
                        return R(e, n) ? {name: t, index: n} : null
                    })).filter((function(e)
                    {
                        return e
                    }))
                }, se = function(e, t)
                {
                    if(e)
                    {

                        let inpt, frm;


                        var n = e.pickedDate, a = e.linkedElement, r = e.onSelectCallbacks, c = e.options,
                            i = c.dateFormat, l = n ? L(n, c, i) : null;


                        a && (a.value = l),


                            inpt = document.getElementById(a.id);

                        if(inpt)
                        {
                            inpt.setAttribute('value', l ? l.toString() : '');
                            inpt.dispatchEvent(new Event('change'));

                            frm = inpt.closest('form');

                            if(frm)
                            {
                                frm.dispatchEvent(new Event('change'));
                            }
                        }

                        if(typeof changeDatapicker === 'function')
                        {
                            changeDatapicker(a)
                        }

                        r.forEach((function(e)
                        {
                            return e.apply(null, [n, l])
                        })), t.close()
                    }
                }, de = function(e)
                {
                    var t = e.pickedDate, n = e.linkedElement, a = e.options, r = a.dateFormat;
                    n && t && (n.value = L(t, a, r))
                }, ue = function(e, t)
                {
                    var n = e.displayDay, a = e.displayDate, r = e.displayMonth, c = e.displayYear,
                        i = e.calendarDisplay, l = t.store, o = t.options, s = l.display, d = s.target, u = s.date,
                        m = o.customWeekDays, v = o.customMonths;
                    o.showCalendarDisplay ? i.classList.remove("u-display-none") : i.classList.add("u-display-none"), i.setAttribute("data-target", l.display.target), c.innerText = u.getFullYear(), "year" !== d && (r.innerText = v[u.getMonth()], "month" !== d && (n.innerText = m[u.getDay()], a.innerText = u.getDate()))
                }, me = function(e, t)
                {
                    var n = e.dateCells, a = t.store, r = t.viewLayers, c = a.calendar.date;
                    if("calendar" === r[0])
                    {
                        var i = Q(t, c);
                        n.forEach((function(e, t)
                        {
                            e.innerText = i[t].dateNumb, e.classList = i[t].classList, e.setAttribute("data-val-date", i[t].date)
                        }))
                    }
                }, ve = function(e, t)
                {
                    var n = e.currentMonthSelect, a = e.currentYearSelect, r = e.calendarHeader, c = t.store,
                        i = t.options.customMonths, l = c.header, o = l.target, s = l.month, d = l.year;
                    if(r.setAttribute("data-target", o), function(e, t)
                    {
                        var n = e.monthNavPrev, a = e.monthNavNext, r = e.yearNavPrev, c = e.yearNavNext, i = t.store,
                            l = t.prevLimitDate, o = t.nextLimitDate, s = t.options, d = s.customMonths,
                            u = s.jumpToMinMax, m = i.header.target, v = i.header.month, h = i.header.year, p = O(n),
                            f = O(a), y = O(r), b = O(c);
                        if(y.active(), b.active(), p.active(), f.active(), "year" === m)
                        {
                            return p.inactive(), f.inactive(), l && l.getFullYear() > h - 1 && y.inactive(), void (o && o.getFullYear() < h + 12 && b.inactive());
                        }
                        var g = ie(t, d[v], "prev"), w = ie(t, d[v], "next"), _ = "year" !== m && le(s, h, "prev"),
                            D = "year" !== m && le(s, h, "next");
                        if("calendar" === m && 0 !== g.overlap && !_ && p.inactive(), "calendar" === m && 0 !== g.overlap && !_ && y.inactive(), "calendar" === m && 0 !== w.overlap && !D && f.inactive(), "calendar" === m && 0 !== w.overlap && !D && b.inactive(), l)
                        {
                            var k = new Date(h, v, 1), M = new Date(_, v + 1, 0), C = K(k, l), L = K(M, l);
                            u && C && y.inactive(), u || !L && D || y.inactive(), C && p.inactive()
                        }
                        if(o)
                        {
                            var E = new Date(h, v + 1, 0), x = new Date(D, v, 1), T = X(E, o), S = X(x, o);
                            u && T && b.inactive(), u || !S && D || b.inactive(), T && f.inactive()
                        }
                    }(e, t), "year" !== o)
                    {
                        n.innerHTML = "<span>".concat(i[s], "</span>"), a.innerHTML = "<span>".concat(d, "</span>");
                    } else
                    {
                        var u = d;
                        a.innerHTML = "<span>".concat(u, "</span><span> - </span><span>").concat(u + 11, "</span>")
                    }
                }, he = function(e, t)
                {
                    if(t)
                    {
                        var n = e.monthYearPreview, a = t.store.preview.target, r = t.store.header.year;
                        if("calendar" === a)
                        {
                            return n.classList.remove("mc-month-year__preview--opened");
                        }
                        n.setAttribute("data-target", a), n.classList.add("mc-month-year__preview--opened"), "month" == a && function(e,
                            t)
                        {


                            var n = e.previewCells, a = t.store, r = t.prevLimitDate, c = t.nextLimitDate,
                                i = t.options, l = i.customMonths, o = l[a.preview.month], s = a.preview.year;
                            l.map((function(e, t)
                            {
                                var a = ["mc-month-year__cell"], l = new Date(Number(s), t),
                                    d = new Date(Number(s), t + 1, 0), u = r && E(d) < E(r), m = c && E(l) > E(c);
                                e === o && a.push("mc-month-year__cell--picked"), !u && !m && R(i, t) && Z(i, Number(s)) || a.push("mc-month-year__cell--inactive"), n[t].classList = a.join(" "), n[t].innerHTML = "<span>".concat(e.substr(0, 3), "</span>")
                            }))
                        }(e, t), "year" == a && function(e, t, n)
                        {
                            var a = e.previewCells, r = t.store, c = t.prevLimitDate, i = t.nextLimitDate,
                                l = t.options, o = c && c.getFullYear(), s = i && i.getFullYear(), d = r.preview.year;
                            a.forEach((function(e, t)
                            {
                                var a = ["mc-month-year__cell"], r = n + t, u = c && r < o, m = i && r > s;
                                r === d && a.push("mc-month-year__cell--picked"), (u || m || !Z(l, r)) && a.push("mc-month-year__cell--inactive"), e.classList = a.join(" "), e.innerHTML = "<span>".concat(r, "</span>")
                            }))
                        }(e, t, r)
                    }
                }, pe = function(e, t)
                {
                    var n = e.calendar, a = t.store, r = t.viewLayers, c = t.options, i = t.pickedDate, l = c.bodyType,
                        o = ce(t), s = o.getFullYear(), d = o.getMonth();
                    n.classList = "mc-calendar", n.classList.add("mc-calendar--".concat(l)), a.display.target = r[0], a.display.setDate = i || new Date, a.calendar.setDate = o, a.header.month = d, a.header.year = "year" === r[0] ? s - 4 : s, a.preview.month = d, a.preview.year = s, a.header.setTarget = r[0], a.preview.setTarget = r[0], function(e,
                        t)
                    {
                        var n = e.weekdays, a = t.customWeekDays, r = t.firstWeekday;
                        n.forEach((function(e, t)
                        {
                            var n = (r + t) % a.length;
                            e.innerText = a[n].substr(0, 2)
                        }))
                    }(e, c), function(e, t)
                    {
                        var n = t.customOkBTN, a = t.customClearBTN, r = t.customCancelBTN, c = e.okButton,
                            i = e.clearButton, l = e.cancelButton;
                        c.innerText = n, i.innerText = a, l.innerText = r
                    }(e, c), function(e, t)
                    {
                        var n = e.calendar, a = t.options, r = t.linkedElement;
                        if("inline" === a.bodyType)
                        {
                            var c = T(n, r), i = c.top, l = c.left;
                            n.style.top = "".concat(i, "px"), n.style.left = "".concat(l, "px")
                        } else
                        {
                            n.hasAttribute("style") && n.removeAttribute("style")
                        }
                    }(e, t)
                };

                function fe(e, t, n)
                {
                    n.allowedYears.sort((function(e, t)
                    {
                        return e - t
                    }));
                    var a = null !== n.el ? document.querySelector(n.el) : null, r = oe(n), c = function(e)
                    {
                        var t = e.minDate, n = e.maxDate, a = e.allowedYears, r = null, c = null, i = oe(e), l = i[0],
                            o = i[i.length - 1], s = a.length ? Math.min.apply(Math, te(a)) : null,
                            d = a.length ? Math.max.apply(Math, te(a)) : null, u = s ? new Date(s, l.index, 1) : null,
                            m = d ? new Date(d, o.index + 1, 0) : null;
                        return t && u && (r = new Date(Math.max(t, u))), n && m && (c = new Date(Math.min(n, m))), r || (r = t || u), c || (c = n || m), {
                            prevLimitDate: r,
                            nextLimitDate: c
                        }
                    }(n), i = c.prevLimitDate, l = c.nextLimitDate, o = re(n), s = S(t, o[0]);
                    return {
                        _id: j(),
                        datepicker: e,
                        el: n.el,
                        linkedElement: a,
                        pickedDate: n.selectedDate,
                        viewLayers: o,
                        activeMonths: r,
                        prevLimitDate: i,
                        nextLimitDate: l,
                        options: n,
                        onOpenCallbacks: [],
                        onCloseCallbacks: [],
                        onSelectCallbacks: [],
                        onCancelCallbacks: [],
                        onMonthChangeCallbacks: [],
                        onYearChangeCallbacks: [],
                        markCustomCallbacks: [],
                        store: s,
                        open: function()
                        {
                            e.open(this._id)
                        },
                        close: function()
                        {
                            e.close()
                        },
                        reset: function()
                        {
                            this.pickedDate = null, this.linkedElement && (this.linkedElement.value = null)
                        },
                        destroy: function()
                        {
                            e.remove(this._id)
                        },
                        onOpen: function()
                        {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function()
                            {
                            };
                            this.onOpenCallbacks.push(e)
                        },
                        onClose: function()
                        {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function()
                            {
                            };
                            this.onCloseCallbacks.push(e)
                        },
                        onSelect: function(e)
                        {
                            this.onSelectCallbacks.push(e)
                        },
                        onCancel: function(e)
                        {
                            this.onCancelCallbacks.push(e)
                        },
                        onMonthChange: function(e)
                        {
                            this.onMonthChangeCallbacks.push(e)
                        },
                        onYearChange: function(e)
                        {
                            this.onYearChangeCallbacks.push(e)
                        },
                        getDay: function()
                        {
                            return this.pickedDate ? this.pickedDate.getDay() : null
                        },
                        getDate: function()
                        {
                            return this.pickedDate ? this.pickedDate.getDate() : null
                        },
                        getMonth: function()
                        {
                            return this.pickedDate ? this.pickedDate.getMonth() : null
                        },
                        getYear: function()
                        {
                            return this.pickedDate ? this.pickedDate.getFullYear() : null
                        },
                        getFullDate: function()
                        {
                            return this.pickedDate
                        },
                        getFormatedDate: function()
                        {
                            return this.pickedDate ? L(this.pickedDate, this.options, this.options.dateFormat) : null
                        },
                        markDatesCustom: function(e)
                        {
                            this.markCustomCallbacks.push(e)
                        },
                        setFullDate: function(e)
                        {
                            if(!q(e).date())
                            {
                                throw new TypeError("Parameter of setFullDate() is not of type date");
                            }
                            D(t.calendar, {instance: this, date: e})
                        },
                        setDate: function(e)
                        {
                            if(!q(e).number())
                            {
                                throw new TypeError("Parameter 'date' of setDate() is not of type number");
                            }
                            var n = this.pickedDate ? new Date(this.pickedDate) : new Date;
                            n.setDate(e), D(t.calendar, {instance: this, date: n})
                        },
                        setMonth: function(e)
                        {
                            if(!q(e).number())
                            {
                                throw new TypeError("Parameter 'month' of setMonth() is not of type number");
                            }
                            var n = this.pickedDate ? new Date(this.pickedDate) : new Date;
                            n.setMonth(e), D(t.calendar, {instance: this, date: n})
                        },
                        setYear: function(e)
                        {
                            if(!q(e).number())
                            {
                                throw new TypeError("Parameter 'year' of setYear() is not of type number");
                            }
                            var n = this.pickedDate ? new Date(this.pickedDate) : new Date;
                            n.setFullYear(e), D(t.calendar, {instance: this, date: n})
                        }
                    }
                }

                let ye, be, ge, we = (ye = [], be = null, ge = function()
                {
                    be || (be = ee())
                }, {
                    create: function()
                    {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        ge();
                        var t = z(e, r), n = fe(we, be, t);
                        return ye.push(n), V(n), n
                    }, remove: function(e)
                    {
                        var t, n = ye.find((function(t)
                        {
                            return t._id === e
                        }));
                        if(ye.length && n && ((t = n.linkedElement) && (t.onfocus = null), ye.splice(ye.indexOf(n), 1), !ye.length))
                        {
                            var a = be.calendar;
                            a.parentNode.removeChild(a), be = null
                        }
                    }, open: function(e)
                    {
                        var t = ye.find((function(t)
                        {
                            return t._id === e
                        }));
                        (t || be) && be.calendarStates.open(t)
                    }, close: function()
                    {
                        be && be.calendarStates.close()
                    }
                });
                const _e = we
            }
        }, t = {};

        function n(a)
        {
            if(t[a])
            {
                return t[a].exports;
            }
            var r = t[a] = {exports: {}};
            return e[a](r, r.exports, n), r.exports
        }

        return n.d = (e, t) =>
        {
            for(var a in t) n.o(t, a) && !n.o(e, a) && Object.defineProperty(e, a, {enumerable: !0, get: t[a]})
        }, n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), n(422)
    })().default
}));

datapickerLang = {
    'ru': {
        firstWeekday: 1, // ex: 1 accept numbers 0-6;
        customClearBTN: 'Очистить',
        customCancelBTN: 'Отмена',
        customWeekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        customMonths: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    },
    'en': {
        firstWeekday: 0, // ex: 1 accept numbers 0-6;
        customClearBTN: 'Clear',
        customCancelBTN: 'Cancel',
        customWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        customMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
}

function initDatepicker()
{
    document.querySelectorAll(".js-datepicker").forEach((datepicker) =>
    {
        let $elementDate = document.getElementById(datepicker.id).value;

        if($elementDate)
        {
            const [day, month, year] = $elementDate.split(".");
            $selectedDate = new Date(+year, month - 1, +day);
        }
        else
        {
            $selectedDate = new Date();
        }

        MCDatepicker.create({
            el : "#" + datepicker.id,
            bodyType : "modal", // ‘modal’, ‘inline’, or ‘permanent’.
            autoClose : false,
            closeOndblclick : true,
            closeOnBlur : false,
            customOkBTN : "OK",
            customClearBTN : datapickerLang[$locale].customClearBTN,
            customCancelBTN : datapickerLang[$locale].customCancelBTN,
            firstWeekday : datapickerLang[$locale].firstWeekday,
            dateFormat : "DD.MM.YYYY",
            customWeekDays : datapickerLang[$locale].customWeekDays,
            customMonths : datapickerLang[$locale].customMonths,
            selectedDate : $selectedDate == "Invalid Date" ? new Date() : $selectedDate,
        });

        datepicker.classList.remove("js-datepicker");
        datepicker.classList.add("pointer");

    });
}

initDatepicker();
