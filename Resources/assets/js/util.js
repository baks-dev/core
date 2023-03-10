/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

window.KTUtilElementDataStore = {}, window.KTUtilElementDataStoreID = 0, window.KTUtilDelegatedEventHandlers = {};

var KTUtil = function () {
    var e = [], t = function () {
        window.addEventListener("resize", (function () {
            KTUtil.throttle(undefined, (function () {
                !function () {
                    for (var t = 0; t < e.length; t++) e[t].call()
                }()
            }), 200)
        }))
    };
    return {
        init: function (e) {
            t()
        }, addResizeHandler: function (t) {
            e.push(t)
        }, removeResizeHandler: function (t) {
            for (var n = 0; n < e.length; n++) t === e[n] && delete e[n]
        }, runResizeHandlers: function () {
            _runResizeHandlers()
        }, resize: function () {
            if ("function" == typeof Event) window.dispatchEvent(new Event("resize")); else {
                var e = window.document.createEvent("UIEvents");
                e.initUIEvent("resize", !0, !1, window, 0), window.dispatchEvent(e)
            }
        }, getURLParam: function (e) {
            var t, n, i = window.location.search.substring(1).split("&");
            for (t = 0; t < i.length; t++) if ((n = i[t].split("="))[0] == e) return unescape(n[1]);
            return null
        }, isMobileDevice: function () {
            var e = this.getViewPort().width < this.getBreakpoint("lg");
            return !1 === e && (e = null != navigator.userAgent.match(/iPad/i)), e
        }, isDesktopDevice: function () {
            return !KTUtil.isMobileDevice()
        }, getViewPort: function () {
            var e = window, t = "inner";
            return "innerWidth" in window || (t = "client", e = document.documentElement || document.body), {
                width: e[t + "Width"],
                height: e[t + "Height"]
            }
        }, isBreakpointUp: function (e) {
            return this.getViewPort().width >= this.getBreakpoint(e)
        }, isBreakpointDown: function (e) {
            return this.getViewPort().width < this.getBreakpoint(e)
        }, getViewportWidth: function () {
            return this.getViewPort().width
        }, getUniqueId: function (e) {
            return e + Math.floor(Math.random() * (new Date).getTime())
        }, getBreakpoint: function (e) {
            var t = this.getCssVariableValue("--bs-" + e);
            return t && (t = parseInt(t.trim())), t
        }, isset: function (e, t) {
            var n;
            if (-1 !== (t = t || "").indexOf("[")) throw new Error("Unsupported object path notation.");
            t = t.split(".");
            do {
                if (void 0 === e) return !1;
                if (n = t.shift(), !e.hasOwnProperty(n)) return !1;
                e = e[n]
            } while (t.length);
            return !0
        }, getHighestZindex: function (e) {
            for (var t, n; e && e !== document;) {
                if (("absolute" === (t = KTUtil.css(e, "position")) || "relative" === t || "fixed" === t) && (n = parseInt(KTUtil.css(e, "z-index")), !isNaN(n) && 0 !== n)) return n;
                e = e.parentNode
            }
            return 1
        }, hasFixedPositionedParent: function (e) {
            for (; e && e !== document;) {
                if ("fixed" === KTUtil.css(e, "position")) return !0;
                e = e.parentNode
            }
            return !1
        }, sleep: function (e) {
            for (var t = (new Date).getTime(), n = 0; n < 1e7 && !((new Date).getTime() - t > e); n++) ;
        }, getRandomInt: function (e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e
        }, isAngularVersion: function () {
            return void 0 !== window.Zone
        }, deepExtend: function (e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                if (n) for (var i in n) n.hasOwnProperty(i) && ("[object Object]" !== Object.prototype.toString.call(n[i]) ? e[i] = n[i] : e[i] = KTUtil.deepExtend(e[i], n[i]))
            }
            return e
        }, extend: function (e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++) if (arguments[t]) for (var n in arguments[t]) arguments[t].hasOwnProperty(n) && (e[n] = arguments[t][n]);
            return e
        }, getBody: function () {
            return document.getElementsByTagName("body")[0]
        }, hasClasses: function (e, t) {
            if (e) {
                for (var n = t.split(" "), i = 0; i < n.length; i++) if (0 == KTUtil.hasClass(e, KTUtil.trim(n[i]))) return !1;
                return !0
            }
        }, hasClass: function (e, t) {
            if (e) return e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)
        }, addClass: function (e, t) {
            if (e && void 0 !== t) {
                var n = t.split(" ");
                if (e.classList) for (var i = 0; i < n.length; i++) n[i] && n[i].length > 0 && e.classList.add(KTUtil.trim(n[i])); else if (!KTUtil.hasClass(e, t)) for (var r = 0; r < n.length; r++) e.className += " " + KTUtil.trim(n[r])
            }
        }, removeClass: function (e, t) {
            if (e && void 0 !== t) {
                var n = t.split(" ");
                if (e.classList) for (var i = 0; i < n.length; i++) e.classList.remove(KTUtil.trim(n[i])); else if (KTUtil.hasClass(e, t)) for (var r = 0; r < n.length; r++) e.className = e.className.replace(new RegExp("\\b" + KTUtil.trim(n[r]) + "\\b", "g"), "")
            }
        }, triggerCustomEvent: function (e, t, n) {
            var i;
            window.CustomEvent ? i = new CustomEvent(t, {detail: n}) : (i = document.createEvent("CustomEvent")).initCustomEvent(t, !0, !0, n), e.dispatchEvent(i)
        }, triggerEvent: function (e, t) {
            var n;
            if (e.ownerDocument) n = e.ownerDocument; else {
                if (9 != e.nodeType) throw new Error("Invalid node passed to fireEvent: " + e.id);
                n = e
            }
            if (e.dispatchEvent) {
                var i = "";
                switch (t) {
                    case"click":
                    case"mouseenter":
                    case"mouseleave":
                    case"mousedown":
                    case"mouseup":
                        i = "MouseEvents";
                        break;
                    case"focus":
                    case"change":
                    case"blur":
                    case"select":
                        i = "HTMLEvents";
                        break;
                    default:
                        throw"fireEvent: Couldn't find an event class for event '" + t + "'."
                }
                var r = "change" != t;
                (o = n.createEvent(i)).initEvent(t, r, !0), o.synthetic = !0, e.dispatchEvent(o, !0)
            } else if (e.fireEvent) {
                var o;
                (o = n.createEventObject()).synthetic = !0, e.fireEvent("on" + t, o)
            }
        }, index: function (e) {
            for (var t = e.parentNode.children, n = 0; n < t.length; n++) if (t[n] == e) return n
        }, trim: function (e) {
            return e.trim()
        }, eventTriggered: function (e) {
            return !!e.currentTarget.dataset.triggered || (e.currentTarget.dataset.triggered = !0, !1)
        }, remove: function (e) {
            e && e.parentNode && e.parentNode.removeChild(e)
        }, find: function (e, t) {
            return null !== e ? e.querySelector(t) : null
        }, findAll: function (e, t) {
            return null !== e ? e.querySelectorAll(t) : null
        }, insertAfter: function (e, t) {
            return t.parentNode.insertBefore(e, t.nextSibling)
        }, parents: function (e, t) {
            for (var n = []; e && e !== document; e = e.parentNode) t ? e.matches(t) && n.push(e) : n.push(e);
            return n
        }, children: function (e, t, n) {
            if (!e || !e.childNodes) return null;
            for (var i = [], r = 0, o = e.childNodes.length; r < o; ++r) 1 == e.childNodes[r].nodeType && KTUtil.matches(e.childNodes[r], t, n) && i.push(e.childNodes[r]);
            return i
        }, child: function (e, t, n) {
            var i = KTUtil.children(e, t, n);
            return i ? i[0] : null
        }, matches: function (e, t, n) {
            var i = Element.prototype,
                r = i.matches || i.webkitMatchesSelector || i.mozMatchesSelector || i.msMatchesSelector || function (e) {
                    return -1 !== [].indexOf.call(document.querySelectorAll(e), this)
                };
            return !(!e || !e.tagName) && r.call(e, t)
        }, data: function (e) {
            return {
                set: function (t, n) {
                    //e && (void 0 === e.customDataTag && (window.KTUtilElementDataStoreID++, e.customDataTag = window.KTUtilElementDataStoreID), void 0 === window.KTUtilElementDataStore[e.customDataTag] && (window.KTUtilElementDataStore[e.customDataTag] = {}), window.KTUtilElementDataStore[e.customDataTag][t] = n)
                }, get: function (t) {
                    if (e) return void 0 === e.customDataTag ? null : this.has(t) ? window.KTUtilElementDataStore[e.customDataTag][t] : null
                }, has: function (t) {
                    return !!e && (void 0 !== e.customDataTag && !(!window.KTUtilElementDataStore[e.customDataTag] || !window.KTUtilElementDataStore[e.customDataTag][t]))
                }, remove: function (t) {
                    e && this.has(t) && delete window.KTUtilElementDataStore[e.customDataTag][t]
                }
            }
        }, outerWidth: function (e, t) {
            var n;
            return !0 === t ? (n = parseFloat(e.offsetWidth), n += parseFloat(KTUtil.css(e, "margin-left")) + parseFloat(KTUtil.css(e, "margin-right")), parseFloat(n)) : n = parseFloat(e.offsetWidth)
        }, offset: function (e) {
            var t, n;
            if (e) return e.getClientRects().length ? (t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset,
                right: window.innerWidth - (e.offsetLeft + e.offsetWidth)
            }) : {top: 0, left: 0}
        }, height: function (e) {
            return KTUtil.css(e, "height")
        }, outerHeight: function (e, t) {
            var n, i = e.offsetHeight;
            return void 0 !== t && !0 === t ? (n = getComputedStyle(e), i += parseInt(n.marginTop) + parseInt(n.marginBottom)) : i
        }, visible: function (e) {
            return !(0 === e.offsetWidth && 0 === e.offsetHeight)
        }, attr: function (e, t, n) {
            if (null != e) return void 0 === n ? e.getAttribute(t) : void e.setAttribute(t, n)
        }, hasAttr: function (e, t) {
            if (null != e) return !!e.getAttribute(t)
        }, removeAttr: function (e, t) {
            null != e && e.removeAttribute(t)
        }, animate: function (e, t, n, i, r, o) {
            var a = {};
            if (a.linear = function (e, t, n, i) {
                return n * e / i + t
            }, r = a.linear, "number" == typeof e && "number" == typeof t && "number" == typeof n && "function" == typeof i) {
                "function" != typeof o && (o = function () {
                });
                var l = window.requestAnimationFrame || function (e) {
                    window.setTimeout(e, 20)
                }, s = t - e;
                i(e);
                var u = window.performance && window.performance.now ? window.performance.now() : +new Date;
                l((function a(d) {
                    var c = (d || +new Date) - u;
                    c >= 0 && i(r(c, e, s, n)), c >= 0 && c >= n ? (i(t), o()) : l(a)
                }))
            }
        }, actualCss: function (e, t, n) {
            var i, r = "";
            if (e instanceof HTMLElement != !1) return e.getAttribute("kt-hidden-" + t) && !1 !== n ? parseFloat(e.getAttribute("kt-hidden-" + t)) : (r = e.style.cssText, e.style.cssText = "position: absolute; visibility: hidden; display: block;", "width" == t ? i = e.offsetWidth : "height" == t && (i = e.offsetHeight), e.style.cssText = r, e.setAttribute("kt-hidden-" + t, i), parseFloat(i))
        }, actualHeight: function (e, t) {
            return KTUtil.actualCss(e, "height", t)
        }, actualWidth: function (e, t) {
            return KTUtil.actualCss(e, "width", t)
        }, getScroll: function (e, t) {
            return t = "scroll" + t, e == window || e == document ? self["scrollTop" == t ? "pageYOffset" : "pageXOffset"] || browserSupportsBoxModel && document.documentElement[t] || document.body[t] : e[t]
        }, css: function (e, t, n, i) {
            if (e) if (void 0 !== n) !0 === i ? e.style.setProperty(t, n, "important") : e.style[t] = n; else {
                var r = (e.ownerDocument || document).defaultView;
                if (r && r.getComputedStyle) return t = t.replace(/([A-Z])/g, "-$1").toLowerCase(), r.getComputedStyle(e, null).getPropertyValue(t);
                if (e.currentStyle) return t = t.replace(/\-(\w)/g, (function (e, t) {
                    return t.toUpperCase()
                })), n = e.currentStyle[t], /^\d+(em|pt|%|ex)?$/i.test(n) ? function (t) {
                    var n = e.style.left, i = e.runtimeStyle.left;
                    return e.runtimeStyle.left = e.currentStyle.left, e.style.left = t || 0, t = e.style.pixelLeft + "px", e.style.left = n, e.runtimeStyle.left = i, t
                }(n) : n
            }
        }, slide: function (e, t, n, i, r) {
            if (!(!e || "up" == t && !1 === KTUtil.visible(e) || "down" == t && !0 === KTUtil.visible(e))) {
                n = n || 600;
                var o = KTUtil.actualHeight(e), a = !1, l = !1;
                KTUtil.css(e, "padding-top") && !0 !== KTUtil.data(e).has("slide-padding-top") && KTUtil.data(e).set("slide-padding-top", KTUtil.css(e, "padding-top")), KTUtil.css(e, "padding-bottom") && !0 !== KTUtil.data(e).has("slide-padding-bottom") && KTUtil.data(e).set("slide-padding-bottom", KTUtil.css(e, "padding-bottom")), KTUtil.data(e).has("slide-padding-top") && (a = parseInt(KTUtil.data(e).get("slide-padding-top"))), KTUtil.data(e).has("slide-padding-bottom") && (l = parseInt(KTUtil.data(e).get("slide-padding-bottom"))), "up" == t ? (e.style.cssText = "display: block; overflow: hidden;", a && KTUtil.animate(0, a, n, (function (t) {
                    e.style.paddingTop = a - t + "px"
                }), "linear"), l && KTUtil.animate(0, l, n, (function (t) {
                    e.style.paddingBottom = l - t + "px"
                }), "linear"), KTUtil.animate(0, o, n, (function (t) {
                    e.style.height = o - t + "px"
                }), "linear", (function () {
                    e.style.height = "", e.style.display = "none", "function" == typeof i && i()
                }))) : "down" == t && (e.style.cssText = "display: block; overflow: hidden;", a && KTUtil.animate(0, a, n, (function (t) {
                    e.style.paddingTop = t + "px"
                }), "linear", (function () {
                    e.style.paddingTop = ""
                })), l && KTUtil.animate(0, l, n, (function (t) {
                    e.style.paddingBottom = t + "px"
                }), "linear", (function () {
                    e.style.paddingBottom = ""
                })), KTUtil.animate(0, o, n, (function (t) {
                    e.style.height = t + "px"
                }), "linear", (function () {
                    e.style.height = "", e.style.display = "", e.style.overflow = "", "function" == typeof i && i()
                })))
            }
        }, slideUp: function (e, t, n) {
            KTUtil.slide(e, "up", t, n)
        }, slideDown: function (e, t, n) {
            KTUtil.slide(e, "down", t, n)
        }, show: function (e, t) {
            void 0 !== e && (e.style.display = t || "block")
        }, hide: function (e) {
            void 0 !== e && (e.style.display = "none")
        }, addEvent: function (e, t, n, i) {
            null != e && e.addEventListener(t, n)
        }, removeEvent: function (e, t, n) {
            null !== e && e.removeEventListener(t, n)
        }, on: function (e, t, n, i) {
            if (null !== e) {
                var r = KTUtil.getUniqueId("event");
                return window.KTUtilDelegatedEventHandlers[r] = function (n) {
                    for (var r = e.querySelectorAll(t), o = n.target; o && o !== e;) {
                        for (var a = 0, l = r.length; a < l; a++) o === r[a] && i.call(o, n);
                        o = o.parentNode
                    }
                }, KTUtil.addEvent(e, n, window.KTUtilDelegatedEventHandlers[r]), r
            }
        }, off: function (e, t, n) {
            e && window.KTUtilDelegatedEventHandlers[n] && (KTUtil.removeEvent(e, t, window.KTUtilDelegatedEventHandlers[n]), delete window.KTUtilDelegatedEventHandlers[n])
        }, one: function (e, t, n) {
            e.addEventListener(t, (function t(i) {
                return i.target && i.target.removeEventListener && i.target.removeEventListener(i.type, t), e && e.removeEventListener && i.currentTarget.removeEventListener(i.type, t), n(i)
            }))
        }, hash: function (e) {
            var t, n = 0;
            if (0 === e.length) return n;
            for (t = 0; t < e.length; t++) n = (n << 5) - n + e.charCodeAt(t), n |= 0;
            return n
        }, animateClass: function (e, t, n) {
            var i, r = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "mozAnimationEnd",
                WebkitAnimation: "webkitAnimationEnd",
                msAnimation: "msAnimationEnd"
            };
            for (var o in r) void 0 !== e.style[o] && (i = r[o]);
            KTUtil.addClass(e, t), KTUtil.one(e, i, (function () {
                KTUtil.removeClass(e, t)
            })), n && KTUtil.one(e, i, n)
        }, transitionEnd: function (e, t) {
            var n, i = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "mozTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "msTransitionEnd"
            };
            for (var r in i) void 0 !== e.style[r] && (n = i[r]);
            KTUtil.one(e, n, t)
        }, animationEnd: function (e, t) {
            var n, i = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "mozAnimationEnd",
                WebkitAnimation: "webkitAnimationEnd",
                msAnimation: "msAnimationEnd"
            };
            for (var r in i) void 0 !== e.style[r] && (n = i[r]);
            KTUtil.one(e, n, t)
        }, animateDelay: function (e, t) {
            for (var n = ["webkit-", "moz-", "ms-", "o-", ""], i = 0; i < n.length; i++) KTUtil.css(e, n[i] + "animation-delay", t)
        }, animateDuration: function (e, t) {
            for (var n = ["webkit-", "moz-", "ms-", "o-", ""], i = 0; i < n.length; i++) KTUtil.css(e, n[i] + "animation-duration", t)
        }, scrollTo: function (e, t, n) {
            n = n || 500;
            var i, r, o = e ? KTUtil.offset(e).top : 0;
            t && (o -= t), i = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0, r = o, KTUtil.animate(i, r, n, (function (e) {
                document.documentElement.scrollTop = e, document.body.parentNode.scrollTop = e, document.body.scrollTop = e
            }))
        }, scrollTop: function (e, t) {
            KTUtil.scrollTo(null, e, t)
        }, isArray: function (e) {
            return e && Array.isArray(e)
        }, isEmpty: function (e) {
            for (var t in e) if (e.hasOwnProperty(t)) return !1;
            return !0
        }, numberString: function (e) {
            for (var t = (e += "").split("."), n = t[0], i = t.length > 1 ? "." + t[1] : "", r = /(\d+)(\d{3})/; r.test(n);) n = n.replace(r, "$1,$2");
            return n + i
        }, isRTL: function () {
            return "rtl" === document.querySelector("html").getAttribute("direction")
        }, snakeToCamel: function (e) {
            return e.replace(/(\-\w)/g, (function (e) {
                return e[1].toUpperCase()
            }))
        }, filterBoolean: function (e) {
            return !0 === e || "true" === e || !1 !== e && "false" !== e && e
        }, setHTML: function (e, t) {
            e.innerHTML = t
        }, getHTML: function (e) {
            if (e) return e.innerHTML
        }, getDocumentHeight: function () {
            var e = document.body, t = document.documentElement;
            return Math.max(e.scrollHeight, e.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight)
        }, getScrollTop: function () {
            return (document.scrollingElement || document.documentElement).scrollTop
        }, colorLighten: function (e, t) {
            const n = function (e, t) {
                let n = parseInt(e, 16) + t, i = n > 255 ? 255 : n;
                return i = i.toString(16).length > 1 ? i.toString(16) : `0${i.toString(16)}`, i
            };
            return e = e.indexOf("#") >= 0 ? e.substring(1, e.length) : e, t = parseInt(255 * t / 100), `#${n(e.substring(0, 2), t)}${n(e.substring(2, 4), t)}${n(e.substring(4, 6), t)}`
        }, colorDarken: function (e, t) {
            const n = function (e, t) {
                let n = parseInt(e, 16) - t, i = n < 0 ? 0 : n;
                return i = i.toString(16).length > 1 ? i.toString(16) : `0${i.toString(16)}`, i
            };
            return e = e.indexOf("#") >= 0 ? e.substring(1, e.length) : e, t = parseInt(255 * t / 100), `#${n(e.substring(0, 2), t)}${n(e.substring(2, 4), t)}${n(e.substring(4, 6), t)}`
        }, throttle: function (e, t, n) {
            e || (e = setTimeout((function () {
                t(), e = void 0
            }), n))
        }, debounce: function (e, t, n) {
            clearTimeout(e), e = setTimeout(t, n)
        }, parseJson: function (e) {
            if ("string" == typeof e) {
                var t = (e = e.replace(/'/g, '"')).replace(/(\w+:)|(\w+ :)/g, (function (e) {
                    return '"' + e.substring(0, e.length - 1) + '":'
                }));
                try {
                    e = JSON.parse(t)
                } catch (e) {
                }
            }
            return e
        }, getResponsiveValue: function (e, t) {
            var n, i = this.getViewPort().width;
            if ("object" == typeof (e = KTUtil.parseJson(e))) {
                var r, o, a = -1;
                for (var l in e) (o = "default" === l ? 0 : this.getBreakpoint(l) ? this.getBreakpoint(l) : parseInt(l)) <= i && o > a && (r = l, a = o);
                n = r ? e[r] : e
            } else n = e;
            return n
        }, each: function (e, t) {
            return [].slice.call(e).map(t)
        }, getSelectorMatchValue: function (e) {
            var t = null;
            if ("object" == typeof (e = KTUtil.parseJson(e))) {
                if (void 0 !== e.match) {
                    var n = Object.keys(e.match)[0];
                    e = Object.values(e.match)[0], null !== document.querySelector(n) && (t = e)
                }
            } else t = e;
            return t
        }, getConditionalValue: function (e) {
            e = KTUtil.parseJson(e);
            var t = KTUtil.getResponsiveValue(e);
            return null !== t && void 0 !== t.match && (t = KTUtil.getSelectorMatchValue(t)), null === t && null !== e && void 0 !== e.default && (t = e.default), t
        }, getCssVariableValue: function (e) {
            var t = getComputedStyle(document.documentElement).getPropertyValue(e);
            return t && t.length > 0 && (t = t.trim()), t
        }, isInViewport: function (e) {
            var t = e.getBoundingClientRect();
            return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth)
        }, onDOMContentLoaded: function (e) {
            "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : e()
        }, inIframe: function () {
            try {
                return window.self !== window.top
            } catch (e) {
                return !0
            }
        }, isHexColor: e => /^#[0-9A-F]{6}$/i.test(e)
    }
}();