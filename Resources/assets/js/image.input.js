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

var KTEventHandler = function () {
    var e = {}, t = function (t, n, i, r) {
        var o = KTUtil.getUniqueId("event");
        KTUtil.data(t).set(n, o), e[n] || (e[n] = {}), e[n][o] = {name: n, callback: i, one: r, fired: !1}
    };
    return {
        trigger: function (t, n, i, r) {
            return function (t, n, i, r) {
                if (!0 === KTUtil.data(t).has(n)) {
                    var o = KTUtil.data(t).get(n);
                    if (e[n] && e[n][o]) {
                        var a = e[n][o];
                        if (a.name === n) {
                            if (1 != a.one) return a.callback.call(this, i, r);
                            if (0 == a.fired) return e[n][o].fired = !0, a.callback.call(this, i, r)
                        }
                    }
                }
                return null
            }(t, n, i, r)
        }, on: function (e, n, i) {
            return t(e, n, i)
        }, one: function (e, n, i) {
            return t(e, n, i, !0)
        }, off: function (t, n) {
            return function (t, n) {
                var i = KTUtil.data(t).get(n);
                e[n] && e[n][i] && delete e[n][i]
            }(t, n)
        }, debug: function () {
            for (var t in e) e.hasOwnProperty(t) && console.log(t)
        }
    }
}();
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTEventHandler);

var KTImageInput = function (e, t) {
    var n = this;
    if (null != e) {
        var i = {}, r = function () {
            n.options = KTUtil.deepExtend({}, i, t), n.uid = KTUtil.getUniqueId("image-input"), n.element = e, n.inputElement = KTUtil.find(e, 'input[type="file"]'), n.wrapperElement = KTUtil.find(e, ".image-input-wrapper"), n.cancelElement = KTUtil.find(e, '[data-kt-image-input-action="cancel"]'), n.removeElement = KTUtil.find(e, '[data-kt-image-input-action="remove"]'), n.hiddenElement = KTUtil.find(e, 'input[type="hidden"]'), n.src = KTUtil.css(n.wrapperElement, "backgroundImage"), n.element.setAttribute("data-kt-image-input", "true"), o(), KTUtil.data(n.element).set("image-input", n)
        }, o = function () {
            KTUtil.addEvent(n.inputElement, "change", a), KTUtil.addEvent(n.cancelElement, "click", l), KTUtil.addEvent(n.removeElement, "click", s)
        }, a = function (e) {
            if (e.preventDefault(), null !== n.inputElement && n.inputElement.files && n.inputElement.files[0]) {
                if (!1 === KTEventHandler.trigger(n.element, "kt.imageinput.change", n)) return;
                var t = new FileReader;
                t.onload = function (e) {
                    KTUtil.css(n.wrapperElement, "background-image", "url(" + e.target.result + ")")
                }, t.readAsDataURL(n.inputElement.files[0]), n.element.classList.add("image-input-changed"), n.element.classList.remove("image-input-empty"), KTEventHandler.trigger(n.element, "kt.imageinput.changed", n)
            }
        }, l = function (e) {
            e.preventDefault(), !1 !== KTEventHandler.trigger(n.element, "kt.imageinput.cancel", n) && (n.element.classList.remove("image-input-changed"), n.element.classList.remove("image-input-empty"), "none" === n.src ? (KTUtil.css(n.wrapperElement, "background-image", ""), n.element.classList.add("image-input-empty")) : KTUtil.css(n.wrapperElement, "background-image", n.src), n.inputElement.value = "", null !== n.hiddenElement && (n.hiddenElement.value = "0"), KTEventHandler.trigger(n.element, "kt.imageinput.canceled", n))
        }, s = function (e) {
            e.preventDefault(), !1 !== KTEventHandler.trigger(n.element, "kt.imageinput.remove", n) && (n.element.classList.remove("image-input-changed"), n.element.classList.add("image-input-empty"), KTUtil.css(n.wrapperElement, "background-image", "none"), n.inputElement.value = "", null !== n.hiddenElement && (n.hiddenElement.value = "1"), KTEventHandler.trigger(n.element, "kt.imageinput.removed", n))
        };
        !0 === KTUtil.data(e).has("image-input") ? n = KTUtil.data(e).get("image-input") : r(), n.getInputElement = function () {
            return n.inputElement
        }, n.goElement = function () {
            return n.element
        }, n.destroy = function () {
            KTUtil.data(n.element).remove("image-input")
        }, n.on = function (e, t) {
            return KTEventHandler.on(n.element, e, t)
        }, n.one = function (e, t) {
            return KTEventHandler.one(n.element, e, t)
        }, n.off = function (e) {
            return KTEventHandler.off(n.element, e)
        }, n.trigger = function (e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTImageInput.getInstance = function (e) {
    return null !== e && KTUtil.data(e).has("image-input") ? KTUtil.data(e).get("image-input") : null
}, KTImageInput.createInstances = function (e = "[data-kt-image-input]") {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) new KTImageInput(t[n])
}, KTImageInput.init = function () {
    KTImageInput.createInstances()
}, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", KTImageInput.init) : KTImageInput.init(), "undefined" != typeof module && void 0 !== module.exports && (module.exports = KTImageInput);
