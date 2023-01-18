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

var KTPasswordMeter = function (e, t) {
    var n = this;
    if (e) {
        var i = {
            minLength: 8,
            checkUppercase: !0,
            checkLowercase: !0,
            checkDigit: !0,
            checkChar: !0,
            scoreHighlightClass: "active"
        }, r = function () {
            n.options = KTUtil.deepExtend({}, i, t), n.score = 0, n.checkSteps = 5, n.element = e, n.inputElement = n.element.querySelector("input[type]"), n.visibilityElement = n.element.querySelector('[data-password-meter-control="visibility"]'), n.highlightElement = n.element.querySelector('[data-password-meter-control="highlight"]'), n.element.setAttribute("data-kt-password-meter", "true"), o(), KTUtil.data(n.element).set("password-meter", n)
        }, o = function () {
            n.inputElement.addEventListener("input", (function () {
                a()
            })), n.visibilityElement && n.visibilityElement.addEventListener("click", (function () {
                p()
            }))
        }, a = function () {
            var e = 0, t = m();
            !0 === l() && (e += t), !0 === n.options.checkUppercase && !0 === s() && (e += t), !0 === n.options.checkLowercase && !0 === u() && (e += t), !0 === n.options.checkDigit && !0 === d() && (e += t), !0 === n.options.checkChar && !0 === c() && (e += t), n.score = e, f()
        }, l = function () {
            return n.inputElement.value.length >= n.options.minLength
        }, s = function () {
            return /[a-z]/.test(n.inputElement.value)
        }, u = function () {
            return /[A-Z]/.test(n.inputElement.value)
        }, d = function () {
            return /[0-9]/.test(n.inputElement.value)
        }, c = function () {
            return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(n.inputElement.value)
        }, m = function () {
            var e = 1;
            return !0 === n.options.checkUppercase && e++, !0 === n.options.checkLowercase && e++, !0 === n.options.checkDigit && e++, !0 === n.options.checkChar && e++, n.checkSteps = e, 100 / n.checkSteps
        }, f = function () {
            var e = [].slice.call(n.highlightElement.querySelectorAll("div")), t = e.length, i = 0, r = m(), o = g();
            e.map((function (e) {
                i++, r * i * (n.checkSteps / t) <= o ? e.classList.add("active") : e.classList.remove("active")
            }))
        }, p = function () {
            var e = n.visibilityElement.querySelector("i:not(.d-none), .svg-icon:not(.d-none)"),
                t = n.visibilityElement.querySelector("i.d-none, .svg-icon.d-none");
            "password" === n.inputElement.getAttribute("type").toLowerCase() ? n.inputElement.setAttribute("type", "text") : n.inputElement.setAttribute("type", "password"), e.classList.add("d-none"), t.classList.remove("d-none"), n.inputElement.focus()
        }, g = function () {
            return n.score
        };
        !0 === KTUtil.data(e).has("password-meter") ? n = KTUtil.data(e).get("password-meter") : r(), n.check = function () {
            return a()
        }, n.getScore = function () {
            return g()
        }, n.reset = function () {
            return n.score = 0, void f()
        }, n.destroy = function () {
            KTUtil.data(n.element).remove("password-meter")
        }
    }
};


let passwordMeter = document.body.querySelectorAll('[data-password-meter="true"]');
if (passwordMeter && passwordMeter.length > 0) { for (let n = 0, i = passwordMeter.length; n < i; n++) {
    new KTPasswordMeter(passwordMeter[n])
} }


// KTPasswordMeter.getInstance = function (e) {
//     return null !== e && KTUtil.data(e).has("password-meter") ? KTUtil.data(e).get("password-meter") : null
// }, KTPasswordMeter.createInstances = function (e = "[data-kt-password-meter]") {
//     var t = document.body.querySelectorAll(e);
//     if (t && t.length > 0) for (var n = 0, i = t.length; n < i; n++) new KTPasswordMeter(t[n])
// }, KTPasswordMeter.init = function () {
//     KTPasswordMeter.createInstances()
// }, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", KTPasswordMeter.init) : KTPasswordMeter.init(), "undefined" != typeof module && void 0 !== module.exports && (module.exports = KTPasswordMeter);
//
