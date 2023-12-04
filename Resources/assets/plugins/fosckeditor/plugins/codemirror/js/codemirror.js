(function (b, a) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = a() : typeof define === "function" && define.amd ? define("codemirror.js", a) : (b = b || self, b.CodeMirror = a())
}(this, (function () {
    var ez = navigator.userAgent;
    var eK = navigator.platform;
    var cP = /gecko\/\d/i.test(ez);
    var fs = /MSIE \d/.test(ez);
    var b3 = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ez);
    var c3 = /Edge\/(\d+)/.exec(ez);
    var ef = fs || b3 || c3;
    var n = ef && (fs ? document.documentMode || 6 : +(c3 || b3)[1]);
    var dt = !c3 && /WebKit\//.test(ez);
    var ei = dt && /Qt\/\d+\.\d+/.test(ez);
    var dJ = !c3 && /Chrome\//.test(ez);
    var eB = /Opera\//.test(ez);
    var aM = /Apple Computer/.test(navigator.vendor);
    var dB = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(ez);
    var ge = /PhantomJS/.test(ez);
    var fM = aM && (/Mobile\/\w+/.test(ez) || navigator.maxTouchPoints > 2);
    var aX = /Android/.test(ez);
    var eQ = fM || aX || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(ez);
    var ct = fM || /Mac/.test(eK);
    var gx = /\bCrOS\b/.test(ez);
    var a0 = /win/i.test(eK);
    var ba = eB && ez.match(/Version\/(\d*\.\d*)/);
    if (ba) {
        ba = Number(ba[1])
    }
    if (ba && ba >= 15) {
        eB = false;
        dt = true
    }
    var cb = ct && (ei || eB && (ba == null || ba < 12.11));
    var g9 = cP || (ef && n >= 9);

    function X(i) {
        return new RegExp("(^|\\s)" + i + "(?:$|\\s)\\s*")
    }

    var h = function (hl, i) {
        var hm = hl.className;
        var hk = X(i).exec(hm);
        if (hk) {
            var hn = hm.slice(hk.index + hk[0].length);
            hl.className = hm.slice(0, hk.index) + (hn ? hk[1] + hn : "")
        }
    };

    function eA(hk) {
        for (var i = hk.childNodes.length; i > 0; --i) {
            hk.removeChild(hk.firstChild)
        }
        return hk
    }

    function cd(i, hk) {
        return eA(i).appendChild(hk)
    }

    function g0(hk, ho, hn, hm) {
        var hp = document.createElement(hk);
        if (hn) {
            hp.className = hn
        }
        if (hm) {
            hp.style.cssText = hm
        }
        if (typeof ho == "string") {
            hp.appendChild(document.createTextNode(ho))
        } else {
            if (ho) {
                for (var hl = 0; hl < ho.length; ++hl) {
                    hp.appendChild(ho[hl])
                }
            }
        }
        return hp
    }

    function g6(i, hm, hl, hk) {
        var hn = g0(i, hm, hl, hk);
        hn.setAttribute("role", "presentation");
        return hn
    }

    var cM;
    if (document.createRange) {
        cM = function (hm, hn, hk, i) {
            var hl = document.createRange();
            hl.setEnd(i || hm, hk);
            hl.setStart(hm, hn);
            return hl
        }
    } else {
        cM = function (hl, hn, i) {
            var hk = document.body.createTextRange();
            try {
                hk.moveToElementText(hl.parentNode)
            } catch (hm) {
                return hk
            }
            hk.collapse(true);
            hk.moveEnd("character", i);
            hk.moveStart("character", hn);
            return hk
        }
    }

    function ha(i, hk) {
        if (hk.nodeType == 3) {
            hk = hk.parentNode
        }
        if (i.contains) {
            return i.contains(hk)
        }
        do {
            if (hk.nodeType == 11) {
                hk = hk.host
            }
            if (hk == i) {
                return true
            }
        } while (hk = hk.parentNode)
    }

    function ej() {
        var i;
        try {
            i = document.activeElement
        } catch (hk) {
            i = document.body || null
        }
        while (i && i.shadowRoot && i.shadowRoot.activeElement) {
            i = i.shadowRoot.activeElement
        }
        return i
    }

    function gn(hk, i) {
        var hl = hk.className;
        if (!X(i).test(hl)) {
            hk.className += (hl ? " " : "") + i
        }
    }

    function gN(hm, hk) {
        var hl = hm.split(" ");
        for (var hn = 0; hn < hl.length; hn++) {
            if (hl[hn] && !X(hl[hn]).test(hk)) {
                hk += " " + hl[hn]
            }
        }
        return hk
    }

    var eg = function (i) {
        i.select()
    };
    if (fM) {
        eg = function (i) {
            i.selectionStart = 0;
            i.selectionEnd = i.value.length
        }
    } else {
        if (ef) {
            eg = function (hk) {
                try {
                    hk.select()
                } catch (i) {
                }
            }
        }
    }

    function cW(hk) {
        var i = Array.prototype.slice.call(arguments, 1);
        return function () {
            return hk.apply(null, i)
        }
    }

    function aY(hl, hk, i) {
        if (!hk) {
            hk = {}
        }
        for (var hm in hl) {
            if (hl.hasOwnProperty(hm) && (i !== false || !hk.hasOwnProperty(hm))) {
                hk[hm] = hl[hm]
            }
        }
        return hk
    }

    function cc(hn, hl, hp, hq, hm) {
        if (hl == null) {
            hl = hn.search(/[^\s\u00a0]/);
            if (hl == -1) {
                hl = hn.length
            }
        }
        for (var ho = hq || 0, hr = hm || 0; ;) {
            var hk = hn.indexOf("\t", ho);
            if (hk < 0 || hk >= hl) {
                return hr + (hl - ho)
            }
            hr += hk - ho;
            hr += hp - (hr % hp);
            ho = hk + 1
        }
    }

    var hj = function () {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = cW(this.onTimeout, this)
    };
    hj.prototype.onTimeout = function (i) {
        i.id = 0;
        if (i.time <= +new Date) {
            i.f()
        } else {
            setTimeout(i.handler, i.time - +new Date)
        }
    };
    hj.prototype.set = function (i, hk) {
        this.f = hk;
        var hl = +new Date + i;
        if (!this.id || hl < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, i);
            this.time = hl
        }
    };

    function dP(hm, hk) {
        for (var hl = 0; hl < hm.length; ++hl) {
            if (hm[hl] == hk) {
                return hl
            }
        }
        return -1
    }

    var ed = 50;
    var cy = {
        toString: function () {
            return "CodeMirror.Pass"
        }
    };
    var ag = {scroll: false}, R = {origin: "*mouse"}, dp = {origin: "+move"};

    function e2(hn, hm, ho) {
        for (var hp = 0, hl = 0; ;) {
            var hk = hn.indexOf("\t", hp);
            if (hk == -1) {
                hk = hn.length
            }
            var i = hk - hp;
            if (hk == hn.length || hl + i >= hm) {
                return hp + Math.min(i, hm - hl)
            }
            hl += hk - hp;
            hl += ho - (hl % ho);
            hp = hk + 1;
            if (hl >= hm) {
                return hp
            }
        }
    }

    var bb = [""];

    function cQ(i) {
        while (bb.length <= i) {
            bb.push(gt(bb) + " ")
        }
        return bb[i]
    }

    function gt(i) {
        return i[i.length - 1]
    }

    function ce(hn, hm) {
        var hk = [];
        for (var hl = 0; hl < hn.length; hl++) {
            hk[hl] = hm(hn[hl], hl)
        }
        return hk
    }

    function cw(hn, hk, hl) {
        var hm = 0, i = hl(hk);
        while (hm < hn.length && hl(hn[hm]) <= i) {
            hm++
        }
        hn.splice(hm, 0, hk)
    }

    function gO() {
    }

    function cK(hl, i) {
        var hk;
        if (Object.create) {
            hk = Object.create(hl)
        } else {
            gO.prototype = hl;
            hk = new gO()
        }
        if (i) {
            aY(i, hk)
        }
        return hk
    }

    var bo = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;

    function gq(i) {
        return /\w/.test(i) || i > "\x80" && (i.toUpperCase() != i.toLowerCase() || bo.test(i))
    }

    function c1(i, hk) {
        if (!hk) {
            return gq(i)
        }
        if (hk.source.indexOf("\\w") > -1 && gq(i)) {
            return true
        }
        return hk.test(i)
    }

    function fE(i) {
        for (var hk in i) {
            if (i.hasOwnProperty(hk) && i[hk]) {
                return false
            }
        }
        return true
    }

    var fr = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;

    function f9(i) {
        return i.charCodeAt(0) >= 768 && fr.test(i)
    }

    function eU(hk, hl, i) {
        while ((i < 0 ? hl > 0 : hl < hk.length) && f9(hk.charAt(hl))) {
            hl += i
        }
        return hl
    }

    function cN(i, ho, hn) {
        var hl = ho > hn ? -1 : 1;
        for (; ;) {
            if (ho == hn) {
                return ho
            }
            var hm = (ho + hn) / 2, hk = hl < 0 ? Math.ceil(hm) : Math.floor(hm);
            if (hk == ho) {
                return i(hk) ? ho : hn
            }
            if (i(hk)) {
                hn = hk
            } else {
                ho = hk + hl
            }
        }
    }

    function eE(hk, hq, hp, ho) {
        if (!hk) {
            return ho(hq, hp, "ltr", 0)
        }
        var hn = false;
        for (var hm = 0; hm < hk.length; ++hm) {
            var hl = hk[hm];
            if (hl.from < hp && hl.to > hq || hq == hp && hl.to == hq) {
                ho(Math.max(hl.from, hq), Math.min(hl.to, hp), hl.level == 1 ? "rtl" : "ltr", hm);
                hn = true
            }
        }
        if (!hn) {
            ho(hq, hp, "ltr")
        }
    }

    var fO = null;

    function aR(hk, hm, ho) {
        var hn;
        fO = null;
        for (var hl = 0; hl < hk.length; ++hl) {
            var hp = hk[hl];
            if (hp.from < hm && hp.to > hm) {
                return hl
            }
            if (hp.to == hm) {
                if (hp.from != hp.to && ho == "before") {
                    hn = hl
                } else {
                    fO = hl
                }
            }
            if (hp.from == hm) {
                if (hp.from != hp.to && ho != "before") {
                    hn = hl
                } else {
                    fO = hl
                }
            }
        }
        return hn != null ? hn : fO
    }

    var bu = (function () {
        var hp = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var hn = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";

        function hm(hs) {
            if (hs <= 247) {
                return hp.charAt(hs)
            } else {
                if (1424 <= hs && hs <= 1524) {
                    return "R"
                } else {
                    if (1536 <= hs && hs <= 1785) {
                        return hn.charAt(hs - 1536)
                    } else {
                        if (1774 <= hs && hs <= 2220) {
                            return "r"
                        } else {
                            if (8192 <= hs && hs <= 8203) {
                                return "w"
                            } else {
                                if (hs == 8204) {
                                    return "b"
                                } else {
                                    return "L"
                                }
                            }
                        }
                    }
                }
            }
        }

        var i = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var hr = /[stwN]/, hl = /[LRr]/, hk = /[Lb1n]/, ho = /[1n]/;

        function hq(hu, ht, hs) {
            this.level = hu;
            this.from = ht;
            this.to = hs
        }

        return function (hP, hv) {
            var hE = hv == "ltr" ? "L" : "R";
            if (hP.length == 0 || hv == "ltr" && !i.test(hP)) {
                return false
            }
            var hy = hP.length, hZ = [];
            for (var h2 = 0; h2 < hy; ++h2) {
                hZ.push(hm(hP.charCodeAt(h2)))
            }
            for (var hM = 0, hL = hE; hM < hy; ++hM) {
                var h3 = hZ[hM];
                if (h3 == "m") {
                    hZ[hM] = hL
                } else {
                    hL = h3
                }
            }
            for (var hK = 0, hu = hE; hK < hy; ++hK) {
                var hY = hZ[hK];
                if (hY == "1" && hu == "r") {
                    hZ[hK] = "n"
                } else {
                    if (hl.test(hY)) {
                        hu = hY;
                        if (hY == "r") {
                            hZ[hK] = "R"
                        }
                    }
                }
            }
            for (var hJ = 1, ht = hZ[0]; hJ < hy - 1; ++hJ) {
                var hW = hZ[hJ];
                if (hW == "+" && ht == "1" && hZ[hJ + 1] == "1") {
                    hZ[hJ] = "1"
                } else {
                    if (hW == "," && ht == hZ[hJ + 1] && (ht == "1" || ht == "n")) {
                        hZ[hJ] = ht
                    }
                }
                ht = hW
            }
            for (var hI = 0; hI < hy; ++hI) {
                var hV = hZ[hI];
                if (hV == ",") {
                    hZ[hI] = "N"
                } else {
                    if (hV == "%") {
                        var hx = (void 0);
                        for (hx = hI + 1; hx < hy && hZ[hx] == "%"; ++hx) {
                        }
                        var hC = (hI && hZ[hI - 1] == "!") || (hx < hy && hZ[hx] == "1") ? "1" : "N";
                        for (var h1 = hI; h1 < hx; ++h1) {
                            hZ[h1] = hC
                        }
                        hI = hx - 1
                    }
                }
            }
            for (var hH = 0, hB = hE; hH < hy; ++hH) {
                var hT = hZ[hH];
                if (hB == "L" && hT == "1") {
                    hZ[hH] = "L"
                } else {
                    if (hl.test(hT)) {
                        hB = hT
                    }
                }
            }
            for (var hG = 0; hG < hy; ++hG) {
                if (hr.test(hZ[hG])) {
                    var hQ = (void 0);
                    for (hQ = hG + 1; hQ < hy && hr.test(hZ[hQ]); ++hQ) {
                    }
                    var hS = (hG ? hZ[hG - 1] : hE) == "L";
                    var hU = (hQ < hy ? hZ[hQ] : hE) == "L";
                    var hO = hS == hU ? (hS ? "L" : "R") : hE;
                    for (var hA = hG; hA < hQ; ++hA) {
                        hZ[hA] = hO
                    }
                    hG = hQ - 1
                }
            }
            var hR = [], h0;
            for (var hF = 0; hF < hy;) {
                if (hk.test(hZ[hF])) {
                    var hD = hF;
                    for (++hF; hF < hy && hk.test(hZ[hF]); ++hF) {
                    }
                    hR.push(new hq(0, hD, hF))
                } else {
                    var hN = hF, hs = hR.length, hX = hv == "rtl" ? 1 : 0;
                    for (++hF; hF < hy && hZ[hF] != "L"; ++hF) {
                    }
                    for (var hz = hN; hz < hF;) {
                        if (ho.test(hZ[hz])) {
                            if (hN < hz) {
                                hR.splice(hs, 0, new hq(1, hN, hz));
                                hs += hX
                            }
                            var hw = hz;
                            for (++hz; hz < hF && ho.test(hZ[hz]); ++hz) {
                            }
                            hR.splice(hs, 0, new hq(2, hw, hz));
                            hs += hX;
                            hN = hz
                        } else {
                            ++hz
                        }
                    }
                    if (hN < hF) {
                        hR.splice(hs, 0, new hq(1, hN, hF))
                    }
                }
            }
            if (hv == "ltr") {
                if (hR[0].level == 1 && (h0 = hP.match(/^\s+/))) {
                    hR[0].from = h0[0].length;
                    hR.unshift(new hq(0, 0, h0[0].length))
                }
                if (gt(hR).level == 1 && (h0 = hP.match(/\s+$/))) {
                    gt(hR).to -= h0[0].length;
                    hR.push(new hq(0, hy - h0[0].length, hy))
                }
            }
            return hv == "rtl" ? hR.reverse() : hR
        }
    })();

    function a(hk, hl) {
        var i = hk.order;
        if (i == null) {
            i = hk.order = bu(hk.text, hl)
        }
        return i
    }

    var fR = [];
    var ci = function (hl, i, hk) {
        if (hl.addEventListener) {
            hl.addEventListener(i, hk, false)
        } else {
            if (hl.attachEvent) {
                hl.attachEvent("on" + i, hk)
            } else {
                var hm = hl._handlers || (hl._handlers = {});
                hm[i] = (hm[i] || fR).concat(hk)
            }
        }
    };

    function eW(hk, i) {
        return hk._handlers && hk._handlers[i] || fR
    }

    function eP(hn, hl, hm) {
        if (hn.removeEventListener) {
            hn.removeEventListener(hl, hm, false)
        } else {
            if (hn.detachEvent) {
                hn.detachEvent("on" + hl, hm)
            } else {
                var ho = hn._handlers, i = ho && ho[hl];
                if (i) {
                    var hk = dP(i, hm);
                    if (hk > -1) {
                        ho[hl] = i.slice(0, hk).concat(i.slice(hk + 1))
                    }
                }
            }
        }
    }

    function aN(ho, hn) {
        var hk = eW(ho, hn);
        if (!hk.length) {
            return
        }
        var hl = Array.prototype.slice.call(arguments, 2);
        for (var hm = 0; hm < hk.length; ++hm) {
            hk[hm].apply(null, hl)
        }
    }

    function a2(i, hl, hk) {
        if (typeof hl == "string") {
            hl = {
                type: hl, preventDefault: function () {
                    this.defaultPrevented = true
                }
            }
        }
        aN(i, hk || hl.type, i, hl);
        return b5(hl) || hl.codemirrorIgnore
    }

    function aa(hl) {
        var hk = hl._handlers && hl._handlers.cursorActivity;
        if (!hk) {
            return
        }
        var hn = hl.curOp.cursorActivityHandlers || (hl.curOp.cursorActivityHandlers = []);
        for (var hm = 0; hm < hk.length; ++hm) {
            if (dP(hn, hk[hm]) == -1) {
                hn.push(hk[hm])
            }
        }
    }

    function f5(hk, i) {
        return eW(hk, i).length > 0
    }

    function bS(i) {
        i.prototype.on = function (hk, hl) {
            ci(this, hk, hl)
        };
        i.prototype.off = function (hk, hl) {
            eP(this, hk, hl)
        }
    }

    function c7(i) {
        if (i.preventDefault) {
            i.preventDefault()
        } else {
            i.returnValue = false
        }
    }

    function dX(i) {
        if (i.stopPropagation) {
            i.stopPropagation()
        } else {
            i.cancelBubble = true
        }
    }

    function b5(i) {
        return i.defaultPrevented != null ? i.defaultPrevented : i.returnValue == false
    }

    function e3(i) {
        c7(i);
        dX(i)
    }

    function Q(i) {
        return i.target || i.srcElement
    }

    function gE(hk) {
        var i = hk.which;
        if (i == null) {
            if (hk.button & 1) {
                i = 1
            } else {
                if (hk.button & 2) {
                    i = 3
                } else {
                    if (hk.button & 4) {
                        i = 2
                    }
                }
            }
        }
        if (ct && hk.ctrlKey && i == 1) {
            i = 3
        }
        return i
    }

    var ft = function () {
        if (ef && n < 9) {
            return false
        }
        var i = g0("div");
        return "draggable" in i || "dragDrop" in i
    }();
    var gC;

    function bE(i) {
        if (gC == null) {
            var hl = g0("span", "\u200b");
            cd(i, g0("span", [hl, document.createTextNode("x")]));
            if (i.firstChild.offsetHeight != 0) {
                gC = hl.offsetWidth <= 1 && hl.offsetHeight > 2 && !(ef && n < 8)
            }
        }
        var hk = gC ? g0("span", "\u200b") : g0("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        hk.setAttribute("cm-text", "");
        return hk
    }

    var gD;

    function b8(hm) {
        if (gD != null) {
            return gD
        }
        var i = cd(hm, document.createTextNode("A\u062eA"));
        var hl = cM(i, 0, 1).getBoundingClientRect();
        var hk = cM(i, 1, 2).getBoundingClientRect();
        eA(hm);
        if (!hl || hl.left == hl.right) {
            return false
        }
        return gD = (hk.right - hl.right < 3)
    }

    var gJ = "\n\nb".split(/\n/).length != 3 ? function (ho) {
        var hp = 0, i = [], hn = ho.length;
        while (hp <= hn) {
            var hm = ho.indexOf("\n", hp);
            if (hm == -1) {
                hm = ho.length
            }
            var hl = ho.slice(hp, ho.charAt(hm - 1) == "\r" ? hm - 1 : hm);
            var hk = hl.indexOf("\r");
            if (hk != -1) {
                i.push(hl.slice(0, hk));
                hp += hk + 1
            } else {
                i.push(hl);
                hp = hm + 1
            }
        }
        return i
    } : function (i) {
        return i.split(/\r\n?|\n/)
    };
    var bK = window.getSelection ? function (hk) {
        try {
            return hk.selectionStart != hk.selectionEnd
        } catch (i) {
            return false
        }
    } : function (hl) {
        var i;
        try {
            i = hl.ownerDocument.selection.createRange()
        } catch (hk) {
        }
        if (!i || i.parentElement() != hl) {
            return false
        }
        return i.compareEndPoints("StartToEnd", i) != 0
    };
    var dG = (function () {
        var i = g0("div");
        if ("oncopy" in i) {
            return true
        }
        i.setAttribute("oncopy", "return;");
        return typeof i.oncopy == "function"
    })();
    var fS = null;

    function aV(hk) {
        if (fS != null) {
            return fS
        }
        var hl = cd(hk, g0("span", "x"));
        var hm = hl.getBoundingClientRect();
        var i = cM(hl, 0, 1).getBoundingClientRect();
        return fS = Math.abs(hm.left - i.left) > 1
    }

    var dZ = {}, a3 = {};

    function e6(i, hk) {
        if (arguments.length > 2) {
            hk.dependencies = Array.prototype.slice.call(arguments, 2)
        }
        dZ[i] = hk
    }

    function bD(hk, i) {
        a3[hk] = i
    }

    function hb(i) {
        if (typeof i == "string" && a3.hasOwnProperty(i)) {
            i = a3[i]
        } else {
            if (i && typeof i.name == "string" && a3.hasOwnProperty(i.name)) {
                var hk = a3[i.name];
                if (typeof hk == "string") {
                    hk = {name: hk}
                }
                i = cK(hk, i);
                i.name = hk.name
            } else {
                if (typeof i == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(i)) {
                    return hb("application/xml")
                } else {
                    if (typeof i == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(i)) {
                        return hb("application/json")
                    }
                }
            }
        }
        if (typeof i == "string") {
            return {name: i}
        } else {
            return i || {name: "null"}
        }
    }

    function gm(hl, hk) {
        hk = hb(hk);
        var hn = dZ[hk.name];
        if (!hn) {
            return gm(hl, "text/plain")
        }
        var ho = hn(hl, hk);
        if (dW.hasOwnProperty(hk.name)) {
            var hm = dW[hk.name];
            for (var hp in hm) {
                if (!hm.hasOwnProperty(hp)) {
                    continue
                }
                if (ho.hasOwnProperty(hp)) {
                    ho["_" + hp] = ho[hp]
                }
                ho[hp] = hm[hp]
            }
        }
        ho.name = hk.name;
        if (hk.helperType) {
            ho.helperType = hk.helperType
        }
        if (hk.modeProps) {
            for (var i in hk.modeProps) {
                ho[i] = hk.modeProps[i]
            }
        }
        return ho
    }

    var dW = {};

    function fj(hl, hk) {
        var i = dW.hasOwnProperty(hl) ? dW[hl] : (dW[hl] = {});
        aY(hk, i)
    }

    function cp(hm, i) {
        if (i === true) {
            return i
        }
        if (hm.copyState) {
            return hm.copyState(i)
        }
        var hl = {};
        for (var hn in i) {
            var hk = i[hn];
            if (hk instanceof Array) {
                hk = hk.concat([])
            }
            hl[hn] = hk
        }
        return hl
    }

    function g7(hl, i) {
        var hk;
        while (hl.innerMode) {
            hk = hl.innerMode(i);
            if (!hk || hk.mode == hl) {
                break
            }
            i = hk.state;
            hl = hk.mode
        }
        return hk || {mode: hl, state: i}
    }

    function cm(hl, hk, i) {
        return hl.startState ? hl.startState(hk, i) : true
    }

    var fD = function (i, hl, hk) {
        this.pos = this.start = 0;
        this.string = i;
        this.tabSize = hl || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = hk
    };
    fD.prototype.eol = function () {
        return this.pos >= this.string.length
    };
    fD.prototype.sol = function () {
        return this.pos == this.lineStart
    };
    fD.prototype.peek = function () {
        return this.string.charAt(this.pos) || undefined
    };
    fD.prototype.next = function () {
        if (this.pos < this.string.length) {
            return this.string.charAt(this.pos++)
        }
    };
    fD.prototype.eat = function (i) {
        var hl = this.string.charAt(this.pos);
        var hk;
        if (typeof i == "string") {
            hk = hl == i
        } else {
            hk = hl && (i.test ? i.test(hl) : i(hl))
        }
        if (hk) {
            ++this.pos;
            return hl
        }
    };
    fD.prototype.eatWhile = function (i) {
        var hk = this.pos;
        while (this.eat(i)) {
        }
        return this.pos > hk
    };
    fD.prototype.eatSpace = function () {
        var i = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
            ++this.pos
        }
        return this.pos > i
    };
    fD.prototype.skipToEnd = function () {
        this.pos = this.string.length
    };
    fD.prototype.skipTo = function (i) {
        var hk = this.string.indexOf(i, this.pos);
        if (hk > -1) {
            this.pos = hk;
            return true
        }
    };
    fD.prototype.backUp = function (i) {
        this.pos -= i
    };
    fD.prototype.column = function () {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = cc(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start
        }
        return this.lastColumnValue - (this.lineStart ? cc(this.string, this.lineStart, this.tabSize) : 0)
    };
    fD.prototype.indentation = function () {
        return cc(this.string, null, this.tabSize) - (this.lineStart ? cc(this.string, this.lineStart, this.tabSize) : 0)
    };
    fD.prototype.match = function (hn, hk, i) {
        if (typeof hn == "string") {
            var ho = function (hp) {
                return i ? hp.toLowerCase() : hp
            };
            var hm = this.string.substr(this.pos, hn.length);
            if (ho(hm) == ho(hn)) {
                if (hk !== false) {
                    this.pos += hn.length
                }
                return true
            }
        } else {
            var hl = this.string.slice(this.pos).match(hn);
            if (hl && hl.index > 0) {
                return null
            }
            if (hl && hk !== false) {
                this.pos += hl[0].length
            }
            return hl
        }
    };
    fD.prototype.current = function () {
        return this.string.slice(this.start, this.pos)
    };
    fD.prototype.hideFirstChars = function (hk, i) {
        this.lineStart += hk;
        try {
            return i()
        } finally {
            this.lineStart -= hk
        }
    };
    fD.prototype.lookAhead = function (hk) {
        var i = this.lineOracle;
        return i && i.lookAhead(hk)
    };
    fD.prototype.baseToken = function () {
        var i = this.lineOracle;
        return i && i.baseToken(this.pos)
    };

    function f0(hn, hp) {
        hp -= hn.first;
        if (hp < 0 || hp >= hn.size) {
            throw new Error("There is no line " + (hp + hn.first) + " in the document.")
        }
        var hk = hn;
        while (!hk.lines) {
            for (var hl = 0; ; ++hl) {
                var ho = hk.children[hl], hm = ho.chunkSize();
                if (hp < hm) {
                    hk = ho;
                    break
                }
                hp -= hm
            }
        }
        return hk.lines[hp]
    }

    function g2(hl, hn, i) {
        var hk = [], hm = hn.line;
        hl.iter(hn.line, i.line + 1, function (ho) {
            var hp = ho.text;
            if (hm == i.line) {
                hp = hp.slice(0, i.ch)
            }
            if (hm == hn.line) {
                hp = hp.slice(hn.ch)
            }
            hk.push(hp);
            ++hm
        });
        return hk
    }

    function be(hk, hm, hl) {
        var i = [];
        hk.iter(hm, hl, function (hn) {
            i.push(hn.text)
        });
        return i
    }

    function g5(hk, i) {
        var hl = i - hk.height;
        if (hl) {
            for (var hm = hk; hm; hm = hm.parent) {
                hm.height += hl
            }
        }
    }

    function b7(hk) {
        if (hk.parent == null) {
            return null
        }
        var ho = hk.parent, hn = dP(ho.lines, hk);
        for (var hl = ho.parent; hl; ho = hl, hl = hl.parent) {
            for (var hm = 0; ; ++hm) {
                if (hl.children[hm] == ho) {
                    break
                }
                hn += hl.children[hm].chunkSize()
            }
        }
        return hn + ho.first
    }

    function b0(hq, hp) {
        var hn = hq.first;
        outer:do {
            for (var hm = 0; hm < hq.children.length; ++hm) {
                var hl = hq.children[hm], hk = hl.height;
                if (hp < hk) {
                    hq = hl;
                    continue outer
                }
                hp -= hk;
                hn += hl.chunkSize()
            }
            return hn
        } while (!hq.lines);
        var ho = 0;
        for (; ho < hq.lines.length; ++ho) {
            var hs = hq.lines[ho], hr = hs.height;
            if (hp < hr) {
                break
            }
            hp -= hr
        }
        return hn + ho
    }

    function cv(hk, i) {
        return i >= hk.first && i < hk.first + hk.size
    }

    function e5(hk, hl) {
        return String(hk.lineNumberFormatter(hl + hk.firstLineNumber))
    }

    function ab(i, hk, hl) {
        if (hl === void 0) {
            hl = null
        }
        if (!(this instanceof ab)) {
            return new ab(i, hk, hl)
        }
        this.line = i;
        this.ch = hk;
        this.sticky = hl
    }

    function cD(hk, i) {
        return hk.line - i.line || hk.ch - i.ch
    }

    function ac(hk, i) {
        return hk.sticky == i.sticky && cD(hk, i) == 0
    }

    function cG(i) {
        return ab(i.line, i.ch)
    }

    function bQ(hk, i) {
        return cD(hk, i) < 0 ? i : hk
    }

    function aA(hk, i) {
        return cD(hk, i) < 0 ? hk : i
    }

    function dy(i, hk) {
        return Math.max(i.first, Math.min(hk, i.first + i.size - 1))
    }

    function gy(hk, hl) {
        if (hl.line < hk.first) {
            return ab(hk.first, 0)
        }
        var i = hk.first + hk.size - 1;
        if (hl.line > i) {
            return ab(i, f0(hk, i).text.length)
        }
        return gc(hl, f0(hk, hl.line).text.length)
    }

    function gc(hl, hk) {
        var i = hl.ch;
        if (i == null || i > hk) {
            return ab(hl.line, hk)
        } else {
            if (i < 0) {
                return ab(hl.line, 0)
            } else {
                return hl
            }
        }
    }

    function ey(hm, hn) {
        var hk = [];
        for (var hl = 0; hl < hn.length; hl++) {
            hk[hl] = gy(hm, hn[hl])
        }
        return hk
    }

    var aP = function (hk, i) {
        this.state = hk;
        this.lookAhead = i
    };
    var af = function (hm, hl, i, hk) {
        this.state = hl;
        this.doc = hm;
        this.line = i;
        this.maxLookAhead = hk || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1
    };
    af.prototype.lookAhead = function (hk) {
        var i = this.doc.getLine(this.line + hk);
        if (i != null && hk > this.maxLookAhead) {
            this.maxLookAhead = hk
        }
        return i
    };
    af.prototype.baseToken = function (hk) {
        if (!this.baseTokens) {
            return null
        }
        while (this.baseTokens[this.baseTokenPos] <= hk) {
            this.baseTokenPos += 2
        }
        var i = this.baseTokens[this.baseTokenPos + 1];
        return {type: i && i.replace(/( |^)overlay .*/, ""), size: this.baseTokens[this.baseTokenPos] - hk}
    };
    af.prototype.nextLine = function () {
        this.line++;
        if (this.maxLookAhead > 0) {
            this.maxLookAhead--
        }
    };
    af.fromSaved = function (hl, hk, i) {
        if (hk instanceof aP) {
            return new af(hl, cp(hl.mode, hk.state), i, hk.lookAhead)
        } else {
            return new af(hl, cp(hl.mode, hk), i)
        }
    };
    af.prototype.save = function (hk) {
        var i = hk !== false ? cp(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new aP(i, this.maxLookAhead) : i
    };

    function gk(hp, hr, hk, hn) {
        var hq = [hp.state.modeGen], hm = {};
        y(hp, hr.text, hp.doc.mode, hk, function (hs, ht) {
            return hq.push(hs, ht)
        }, hm, hn);
        var i = hk.state;
        var ho = function (hv) {
            hk.baseTokens = hq;
            var ht = hp.state.overlays[hv], hu = 1, hs = 0;
            hk.state = true;
            y(hp, hr.text, ht.mode, hk, function (hw, hy) {
                var hA = hu;
                while (hs < hw) {
                    var hx = hq[hu];
                    if (hx > hw) {
                        hq.splice(hu, 1, hw, hq[hu + 1], hx)
                    }
                    hu += 2;
                    hs = Math.min(hw, hx)
                }
                if (!hy) {
                    return
                }
                if (ht.opaque) {
                    hq.splice(hA, hu - hA, hw, "overlay " + hy);
                    hu = hA + 2
                } else {
                    for (; hA < hu; hA += 2) {
                        var hz = hq[hA + 1];
                        hq[hA + 1] = (hz ? hz + " " : "") + "overlay " + hy
                    }
                }
            }, hm);
            hk.state = i;
            hk.baseTokens = null;
            hk.baseTokenPos = 1
        };
        for (var hl = 0; hl < hp.state.overlays.length; ++hl) {
            ho(hl)
        }
        return {styles: hq, classes: hm.bgClass || hm.textClass ? hm : null}
    }

    function dC(hk, hm, ho) {
        if (!hm.styles || hm.styles[0] != hk.state.modeGen) {
            var hn = fH(hk, b7(hm));
            var hl = hm.text.length > hk.options.maxHighlightLength && cp(hk.doc.mode, hn.state);
            var i = gk(hk, hm, hn);
            if (hl) {
                hn.state = hl
            }
            hm.stateAfter = hn.save(!hl);
            hm.styles = i.styles;
            if (i.classes) {
                hm.styleClasses = i.classes
            } else {
                if (hm.styleClasses) {
                    hm.styleClasses = null
                }
            }
            if (ho === hk.doc.highlightFrontier) {
                hk.doc.modeFrontier = Math.max(hk.doc.modeFrontier, ++hk.doc.highlightFrontier)
            }
        }
        return hm.styles
    }

    function fH(i, hq, hk) {
        var ho = i.doc, hn = i.display;
        if (!ho.mode.startState) {
            return new af(ho, true, hq)
        }
        var hp = cZ(i, hq, hk);
        var hm = hp > ho.first && f0(ho, hp - 1).stateAfter;
        var hl = hm ? af.fromSaved(ho, hm, hp) : new af(ho, cm(ho.mode), hp);
        ho.iter(hp, hq, function (hr) {
            d3(i, hr.text, hl);
            var hs = hl.line;
            hr.stateAfter = hs == hq - 1 || hs % 5 == 0 || hs >= hn.viewFrom && hs < hn.viewTo ? hl.save() : null;
            hl.nextLine()
        });
        if (hk) {
            ho.modeFrontier = hl.line
        }
        return hl
    }

    function d3(i, ho, hl, hk) {
        var hn = i.doc.mode;
        var hm = new fD(ho, i.options.tabSize, hl);
        hm.start = hm.pos = hk || 0;
        if (ho == "") {
            ga(hn, hl.state)
        }
        while (!hm.eol()) {
            fh(hn, hm, hl.state);
            hm.start = hm.pos
        }
    }

    function ga(hl, hk) {
        if (hl.blankLine) {
            return hl.blankLine(hk)
        }
        if (!hl.innerMode) {
            return
        }
        var i = g7(hl, hk);
        if (i.mode.blankLine) {
            return i.mode.blankLine(i.state)
        }
    }

    function fh(hp, ho, hn, hk) {
        for (var hl = 0; hl < 10; hl++) {
            if (hk) {
                hk[0] = g7(hp, hn).mode
            }
            var hm = hp.token(ho, hn);
            if (ho.pos > ho.start) {
                return hm
            }
        }
        throw new Error("Mode " + hp.name + " failed to advance stream.")
    }

    var dF = function (hl, i, hk) {
        this.start = hl.start;
        this.end = hl.pos;
        this.string = hl.current();
        this.type = i || null;
        this.state = hk
    };

    function cR(hr, hp, hm, hl) {
        var hq = hr.doc, hn = hq.mode, i;
        hp = gy(hq, hp);
        var ht = f0(hq, hp.line), hk = fH(hr, hp.line, hm);
        var hs = new fD(ht.text, hr.options.tabSize, hk), ho;
        if (hl) {
            ho = []
        }
        while ((hl || hs.pos < hp.ch) && !hs.eol()) {
            hs.start = hs.pos;
            i = fh(hn, hs, hk.state);
            if (hl) {
                ho.push(new dF(hs, i, cp(hq.mode, hk.state)))
            }
        }
        return hl ? ho : new dF(hs, i, hk.state)
    }

    function dQ(hl, hk) {
        if (hl) {
            for (; ;) {
                var i = hl.match(/(?:^|\s+)line-(background-)?(\S+)/);
                if (!i) {
                    break
                }
                hl = hl.slice(0, i.index) + hl.slice(i.index + i[0].length);
                var hm = i[1] ? "bgClass" : "textClass";
                if (hk[hm] == null) {
                    hk[hm] = i[2]
                } else {
                    if (!(new RegExp("(?:^|\\s)" + i[2] + "(?:$|\\s)")).test(hk[hm])) {
                        hk[hm] += " " + i[2]
                    }
                }
            }
        }
        return hl
    }

    function y(ht, hv, ho, hl, hp, hm, hn) {
        var hk = ho.flattenSpans;
        if (hk == null) {
            hk = ht.options.flattenSpans
        }
        var hr = 0, hq = null;
        var hu = new fD(hv, ht.options.tabSize, hl), i;
        var hx = ht.options.addModeClass && [null];
        if (hv == "") {
            dQ(ga(ho, hl.state), hm)
        }
        while (!hu.eol()) {
            if (hu.pos > ht.options.maxHighlightLength) {
                hk = false;
                if (hn) {
                    d3(ht, hv, hl, hu.pos)
                }
                hu.pos = hv.length;
                i = null
            } else {
                i = dQ(fh(ho, hu, hl.state, hx), hm)
            }
            if (hx) {
                var hw = hx[0].name;
                if (hw) {
                    i = "m-" + (i ? hw + " " + i : hw)
                }
            }
            if (!hk || hq != i) {
                while (hr < hu.start) {
                    hr = Math.min(hu.start, hr + 5000);
                    hp(hr, hq)
                }
                hq = i
            }
            hu.start = hu.pos
        }
        while (hr < hu.pos) {
            var hs = Math.min(hu.pos, hr + 5000);
            hp(hs, hq);
            hr = hs
        }
    }

    function cZ(hq, hk, hn) {
        var hl, ho, hp = hq.doc;
        var hm = hn ? -1 : hk - (hq.doc.mode.innerMode ? 1000 : 100);
        for (var ht = hk; ht > hm; --ht) {
            if (ht <= hp.first) {
                return hp.first
            }
            var hs = f0(hp, ht - 1), i = hs.stateAfter;
            if (i && (!hn || ht + (i instanceof aP ? i.lookAhead : 0) <= hp.modeFrontier)) {
                return ht
            }
            var hr = cc(hs.text, null, hq.options.tabSize);
            if (ho == null || hl > hr) {
                ho = ht - 1;
                hl = hr
            }
        }
        return ho
    }

    function hd(hl, hn) {
        hl.modeFrontier = Math.min(hl.modeFrontier, hn);
        if (hl.highlightFrontier < hn - 10) {
            return
        }
        var hm = hl.first;
        for (var i = hn - 1; i > hm; i--) {
            var hk = f0(hl, i).stateAfter;
            if (hk && (!(hk instanceof aP) || i + hk.lookAhead < hn)) {
                hm = i + 1;
                break
            }
        }
        hl.highlightFrontier = Math.min(hl.highlightFrontier, hm)
    }

    var he = false, bj = false;

    function gl() {
        he = true
    }

    function bP() {
        bj = true
    }

    function eT(i, hl, hk) {
        this.marker = i;
        this.from = hl;
        this.to = hk
    }

    function fV(hm, hk) {
        if (hm) {
            for (var hl = 0; hl < hm.length; ++hl) {
                var hn = hm[hl];
                if (hn.marker == hk) {
                    return hn
                }
            }
        }
    }

    function fp(hl, hm) {
        var hn;
        for (var hk = 0; hk < hl.length; ++hk) {
            if (hl[hk] != hm) {
                (hn || (hn = [])).push(hl[hk])
            }
        }
        return hn
    }

    function cB(i, hk) {
        i.markedSpans = i.markedSpans ? i.markedSpans.concat([hk]) : [hk];
        hk.marker.attachLine(i)
    }

    function a1(hl, hm, hq) {
        var hr;
        if (hl) {
            for (var ho = 0; ho < hl.length; ++ho) {
                var hs = hl[ho], hp = hs.marker;
                var hk = hs.from == null || (hp.inclusiveLeft ? hs.from <= hm : hs.from < hm);
                if (hk || hs.from == hm && hp.type == "bookmark" && (!hq || !hs.marker.insertLeft)) {
                    var hn = hs.to == null || (hp.inclusiveRight ? hs.to >= hm : hs.to > hm);
                    (hr || (hr = [])).push(new eT(hp, hs.from, hn ? null : hs.to))
                }
            }
        }
        return hr
    }

    function aK(hl, hn, hq) {
        var hr;
        if (hl) {
            for (var ho = 0; ho < hl.length; ++ho) {
                var hs = hl[ho], hp = hs.marker;
                var hm = hs.to == null || (hp.inclusiveRight ? hs.to >= hn : hs.to > hn);
                if (hm || hs.from == hn && hp.type == "bookmark" && (!hq || hs.marker.insertLeft)) {
                    var hk = hs.from == null || (hp.inclusiveLeft ? hs.from <= hn : hs.from < hn);
                    (hr || (hr = [])).push(new eT(hp, hk ? null : hs.from - hn, hs.to == null ? null : hs.to - hn))
                }
            }
        }
        return hr
    }

    function eV(hF, hv) {
        if (hv.full) {
            return null
        }
        var hm = cv(hF, hv.from.line) && f0(hF, hv.from.line).markedSpans;
        var ht = cv(hF, hv.to.line) && f0(hF, hv.to.line).markedSpans;
        if (!hm && !ht) {
            return null
        }
        var hs = hv.from.ch, hA = hv.to.ch, hx = cD(hv.from, hv.to) == 0;
        var hr = a1(hm, hs, hx);
        var hu = aK(ht, hA, hx);
        var hy = hv.text.length == 1, hp = gt(hv.text).length + (hy ? hs : 0);
        if (hr) {
            for (var hD = 0; hD < hr.length; ++hD) {
                var hC = hr[hD];
                if (hC.to == null) {
                    var hw = fV(hu, hC.marker);
                    if (!hw) {
                        hC.to = hs
                    } else {
                        if (hy) {
                            hC.to = hw.to == null ? null : hw.to + hp
                        }
                    }
                }
            }
        }
        if (hu) {
            for (var hq = 0; hq < hu.length; ++hq) {
                var hB = hu[hq];
                if (hB.to != null) {
                    hB.to += hp
                }
                if (hB.from == null) {
                    var hl = fV(hr, hB.marker);
                    if (!hl) {
                        hB.from = hp;
                        if (hy) {
                            (hr || (hr = [])).push(hB)
                        }
                    }
                } else {
                    hB.from += hp;
                    if (hy) {
                        (hr || (hr = [])).push(hB)
                    }
                }
            }
        }
        if (hr) {
            hr = t(hr)
        }
        if (hu && hu != hr) {
            hu = t(hu)
        }
        var hE = [hr];
        if (!hy) {
            var hz = hv.text.length - 2, hk;
            if (hz > 0 && hr) {
                for (var ho = 0; ho < hr.length; ++ho) {
                    if (hr[ho].to == null) {
                        (hk || (hk = [])).push(new eT(hr[ho].marker, null, null))
                    }
                }
            }
            for (var hn = 0; hn < hz; ++hn) {
                hE.push(hk)
            }
            hE.push(hu)
        }
        return hE
    }

    function t(hl) {
        for (var hk = 0; hk < hl.length; ++hk) {
            var hm = hl[hk];
            if (hm.from != null && hm.from == hm.to && hm.marker.clearWhenEmpty !== false) {
                hl.splice(hk--, 1)
            }
        }
        if (!hl.length) {
            return null
        }
        return hl
    }

    function da(hw, hu, hv) {
        var ho = null;
        hw.iter(hu.line, hv.line + 1, function (hx) {
            if (hx.markedSpans) {
                for (var hy = 0; hy < hx.markedSpans.length; ++hy) {
                    var hz = hx.markedSpans[hy].marker;
                    if (hz.readOnly && (!ho || dP(ho, hz) == -1)) {
                        (ho || (ho = [])).push(hz)
                    }
                }
            }
        });
        if (!ho) {
            return null
        }
        var hp = [{from: hu, to: hv}];
        for (var hq = 0; hq < ho.length; ++hq) {
            var hr = ho[hq], hm = hr.find(0);
            for (var hn = 0; hn < hp.length; ++hn) {
                var hl = hp[hn];
                if (cD(hl.to, hm.from) < 0 || cD(hl.from, hm.to) > 0) {
                    continue
                }
                var ht = [hn, 1], hk = cD(hl.from, hm.from), hs = cD(hl.to, hm.to);
                if (hk < 0 || !hr.inclusiveLeft && !hk) {
                    ht.push({from: hl.from, to: hm.from})
                }
                if (hs > 0 || !hr.inclusiveRight && !hs) {
                    ht.push({from: hm.to, to: hl.to})
                }
                hp.splice.apply(hp, ht);
                hn += ht.length - 3
            }
        }
        return hp
    }

    function g8(hk) {
        var hm = hk.markedSpans;
        if (!hm) {
            return
        }
        for (var hl = 0; hl < hm.length; ++hl) {
            hm[hl].marker.detachLine(hk)
        }
        hk.markedSpans = null
    }

    function dw(hk, hm) {
        if (!hm) {
            return
        }
        for (var hl = 0; hl < hm.length; ++hl) {
            hm[hl].marker.attachLine(hk)
        }
        hk.markedSpans = hm
    }

    function x(i) {
        return i.inclusiveLeft ? -1 : 0
    }

    function ch(i) {
        return i.inclusiveRight ? 1 : 0
    }

    function en(hm, hk) {
        var ho = hm.lines.length - hk.lines.length;
        if (ho != 0) {
            return ho
        }
        var hl = hm.find(), hp = hk.find();
        var i = cD(hl.from, hp.from) || x(hm) - x(hk);
        if (i) {
            return -i
        }
        var hn = cD(hl.to, hp.to) || ch(hm) - ch(hk);
        if (hn) {
            return hn
        }
        return hk.id - hm.id
    }

    function bi(hl, hp) {
        var hk = bj && hl.markedSpans, ho;
        if (hk) {
            for (var hn = (void 0), hm = 0; hm < hk.length; ++hm) {
                hn = hk[hm];
                if (hn.marker.collapsed && (hp ? hn.from : hn.to) == null && (!ho || en(ho, hn.marker) < 0)) {
                    ho = hn.marker
                }
            }
        }
        return ho
    }

    function fy(i) {
        return bi(i, true)
    }

    function e9(i) {
        return bi(i, false)
    }

    function cC(hl, hn) {
        var hk = bj && hl.markedSpans, hp;
        if (hk) {
            for (var hm = 0; hm < hk.length; ++hm) {
                var ho = hk[hm];
                if (ho.marker.collapsed && (ho.from == null || ho.from < hn) && (ho.to == null || ho.to > hn) && (!hp || en(hp, ho.marker) < 0)) {
                    hp = ho.marker
                }
            }
        }
        return hp
    }

    function B(hs, hm, hq, hr, ho) {
        var hv = f0(hs, hm);
        var hk = bj && hv.markedSpans;
        if (hk) {
            for (var hn = 0; hn < hk.length; ++hn) {
                var hl = hk[hn];
                if (!hl.marker.collapsed) {
                    continue
                }
                var hu = hl.marker.find(0);
                var ht = cD(hu.from, hq) || x(hl.marker) - x(ho);
                var hp = cD(hu.to, hr) || ch(hl.marker) - ch(ho);
                if (ht >= 0 && hp <= 0 || ht <= 0 && hp >= 0) {
                    continue
                }
                if (ht <= 0 && (hl.marker.inclusiveRight && ho.inclusiveLeft ? cD(hu.to, hq) >= 0 : cD(hu.to, hq) > 0) || ht >= 0 && (hl.marker.inclusiveRight && ho.inclusiveLeft ? cD(hu.from, hr) <= 0 : cD(hu.from, hr) < 0)) {
                    return true
                }
            }
        }
    }

    function A(hk) {
        var i;
        while (i = fy(hk)) {
            hk = i.find(-1, true).line
        }
        return hk
    }

    function cJ(hk) {
        var i;
        while (i = e9(hk)) {
            hk = i.find(1, true).line
        }
        return hk
    }

    function g(hl) {
        var i, hk;
        while (i = e9(hl)) {
            hl = i.find(1, true).line;
            (hk || (hk = [])).push(hl)
        }
        return hk
    }

    function a7(hm, hk) {
        var i = f0(hm, hk), hl = A(i);
        if (i == hl) {
            return hk
        }
        return b7(hl)
    }

    function eC(hm, hl) {
        if (hl > hm.lastLine()) {
            return hl
        }
        var hk = f0(hm, hl), i;
        if (!gg(hm, hk)) {
            return hl
        }
        while (i = e9(hk)) {
            hk = i.find(1, true).line
        }
        return b7(hk) + 1
    }

    function gg(ho, hl) {
        var hk = bj && hl.markedSpans;
        if (hk) {
            for (var hn = (void 0), hm = 0; hm < hk.length; ++hm) {
                hn = hk[hm];
                if (!hn.marker.collapsed) {
                    continue
                }
                if (hn.from == null) {
                    return true
                }
                if (hn.marker.widgetNode) {
                    continue
                }
                if (hn.from == 0 && hn.marker.inclusiveLeft && Y(ho, hl, hn)) {
                    return true
                }
            }
        }
    }

    function Y(hp, hl, hn) {
        if (hn.to == null) {
            var hk = hn.marker.find(1, true);
            return Y(hp, hk.line, fV(hk.line.markedSpans, hn.marker))
        }
        if (hn.marker.inclusiveRight && hn.to == hl.text.length) {
            return true
        }
        for (var ho = (void 0), hm = 0; hm < hl.markedSpans.length; ++hm) {
            ho = hl.markedSpans[hm];
            if (ho.marker.collapsed && !ho.marker.widgetNode && ho.from == hn.to && (ho.to == null || ho.to != hn.from) && (ho.marker.inclusiveLeft || hn.marker.inclusiveRight) && Y(hp, hl, ho)) {
                return true
            }
        }
    }

    function b6(hm) {
        hm = A(hm);
        var ho = 0, hl = hm.parent;
        for (var hn = 0; hn < hl.lines.length; ++hn) {
            var hk = hl.lines[hn];
            if (hk == hm) {
                break
            } else {
                ho += hk.height
            }
        }
        for (var hp = hl.parent; hp; hl = hp, hp = hl.parent) {
            for (var hr = 0; hr < hp.children.length; ++hr) {
                var hq = hp.children[hr];
                if (hq == hl) {
                    break
                } else {
                    ho += hq.height
                }
            }
        }
        return ho
    }

    function eY(hl) {
        if (hl.height == 0) {
            return 0
        }
        var hk = hl.text.length, i, ho = hl;
        while (i = fy(ho)) {
            var hm = i.find(0, true);
            ho = hm.from.line;
            hk += hm.from.ch - hm.to.ch
        }
        ho = hl;
        while (i = e9(ho)) {
            var hn = i.find(0, true);
            hk -= ho.text.length - hn.from.ch;
            ho = hn.to.line;
            hk += ho.text.length - hn.to.ch
        }
        return hk
    }

    function f(i) {
        var hl = i.display, hk = i.doc;
        hl.maxLine = f0(hk, hk.first);
        hl.maxLineLength = eY(hl.maxLine);
        hl.maxLineChanged = true;
        hk.iter(function (hn) {
            var hm = eY(hn);
            if (hm > hl.maxLineLength) {
                hl.maxLineLength = hm;
                hl.maxLine = hn
            }
        })
    }

    var g4 = function (hl, hk, i) {
        this.text = hl;
        dw(this, hk);
        this.height = i ? i(this) : 1
    };
    g4.prototype.lineNo = function () {
        return b7(this)
    };
    bS(g4);

    function eZ(hk, hn, hl, i) {
        hk.text = hn;
        if (hk.stateAfter) {
            hk.stateAfter = null
        }
        if (hk.styles) {
            hk.styles = null
        }
        if (hk.order != null) {
            hk.order = null
        }
        g8(hk);
        dw(hk, hl);
        var hm = i ? i(hk) : 1;
        if (hm != hk.height) {
            g5(hk, hm)
        }
    }

    function bU(i) {
        i.parent = null;
        g8(i)
    }

    var et = {}, co = {};

    function fG(hl, hk) {
        if (!hl || /^\s*$/.test(hl)) {
            return null
        }
        var i = hk.addModeClass ? co : et;
        return i[hl] || (i[hl] = hl.replace(/\S+/g, "cm-$&"))
    }

    function fB(hq, hp) {
        var ho = g6("span", null, null, dt ? "padding-right: .1px" : null);
        var hn = {
            pre: g6("pre", [ho], "CodeMirror-line"),
            content: ho,
            col: 0,
            pos: 0,
            cm: hq,
            trailingSpace: false,
            splitSpaces: hq.getOption("lineWrapping")
        };
        hp.measure = {};
        for (var hm = 0; hm <= (hp.rest ? hp.rest.length : 0); hm++) {
            var hs = hm ? hp.rest[hm - 1] : hp.line, hl = (void 0);
            hn.pos = 0;
            hn.addToken = v;
            if (b8(hq.display.measure) && (hl = a(hs, hq.doc.direction))) {
                hn.addToken = Z(hn.addToken, hl)
            }
            hn.map = [];
            var hk = hp != hq.display.externalMeasured && b7(hs);
            bF(hs, hn, dC(hq, hs, hk));
            if (hs.styleClasses) {
                if (hs.styleClasses.bgClass) {
                    hn.bgClass = gN(hs.styleClasses.bgClass, hn.bgClass || "")
                }
                if (hs.styleClasses.textClass) {
                    hn.textClass = gN(hs.styleClasses.textClass, hn.textClass || "")
                }
            }
            if (hn.map.length == 0) {
                hn.map.push(0, 0, hn.content.appendChild(bE(hq.display.measure)))
            }
            if (hm == 0) {
                hp.measure.map = hn.map;
                hp.measure.cache = {}
            } else {
                (hp.measure.maps || (hp.measure.maps = [])).push(hn.map);
                (hp.measure.caches || (hp.measure.caches = [])).push({})
            }
        }
        if (dt) {
            var hr = hn.content.lastChild;
            if (/\bcm-tab\b/.test(hr.className) || (hr.querySelector && hr.querySelector(".cm-tab"))) {
                hn.content.className = "cm-tab-wrap-hack"
            }
        }
        aN(hq, "renderLine", hq, hp.line, hn.pre);
        if (hn.pre.className) {
            hn.textClass = gN(hn.pre.className, hn.textClass || "")
        }
        return hn
    }

    function fZ(hk) {
        var i = g0("span", "\u2022", "cm-invalidchar");
        i.title = "\\u" + hk.charCodeAt(0).toString(16);
        i.setAttribute("aria-label", i.title);
        return i
    }

    function v(hw, hq, hB, hy, ht, hp, ho) {
        if (!hq) {
            return
        }
        var hA = hw.splitSpaces ? c6(hq, hw.trailingSpace) : hq;
        var i = hw.cm.state.specialChars, hk = false;
        var hz;
        if (!i.test(hq)) {
            hw.col += hq.length;
            hz = document.createTextNode(hA);
            hw.map.push(hw.pos, hw.pos + hq.length, hz);
            if (ef && n < 9) {
                hk = true
            }
            hw.pos += hq.length
        } else {
            hz = document.createDocumentFragment();
            var hm = 0;
            while (true) {
                i.lastIndex = hm;
                var hx = i.exec(hq);
                var hD = hx ? hx.index - hm : hq.length - hm;
                if (hD) {
                    var hs = document.createTextNode(hA.slice(hm, hm + hD));
                    if (ef && n < 9) {
                        hz.appendChild(g0("span", [hs]))
                    } else {
                        hz.appendChild(hs)
                    }
                    hw.map.push(hw.pos, hw.pos + hD, hs);
                    hw.col += hD;
                    hw.pos += hD
                }
                if (!hx) {
                    break
                }
                hm += hD + 1;
                var hC = (void 0);
                if (hx[0] == "\t") {
                    var hu = hw.cm.options.tabSize, hr = hu - hw.col % hu;
                    hC = hz.appendChild(g0("span", cQ(hr), "cm-tab"));
                    hC.setAttribute("role", "presentation");
                    hC.setAttribute("cm-text", "\t");
                    hw.col += hr
                } else {
                    if (hx[0] == "\r" || hx[0] == "\n") {
                        hC = hz.appendChild(g0("span", hx[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                        hC.setAttribute("cm-text", hx[0]);
                        hw.col += 1
                    } else {
                        hC = hw.cm.options.specialCharPlaceholder(hx[0]);
                        hC.setAttribute("cm-text", hx[0]);
                        if (ef && n < 9) {
                            hz.appendChild(g0("span", [hC]))
                        } else {
                            hz.appendChild(hC)
                        }
                        hw.col += 1
                    }
                }
                hw.map.push(hw.pos, hw.pos + 1, hC);
                hw.pos++
            }
        }
        hw.trailingSpace = hA.charCodeAt(hq.length - 1) == 32;
        if (hB || hy || ht || hk || hp || ho) {
            var hl = hB || "";
            if (hy) {
                hl += hy
            }
            if (ht) {
                hl += ht
            }
            var hn = g0("span", [hz], hl, hp);
            if (ho) {
                for (var hv in ho) {
                    if (ho.hasOwnProperty(hv) && hv != "style" && hv != "class") {
                        hn.setAttribute(hv, ho[hv])
                    }
                }
            }
            return hw.content.appendChild(hn)
        }
        hw.content.appendChild(hz)
    }

    function c6(hp, ho) {
        if (hp.length > 1 && !/  /.test(hp)) {
            return hp
        }
        var hl = ho, hk = "";
        for (var hm = 0; hm < hp.length; hm++) {
            var hn = hp.charAt(hm);
            if (hn == " " && hl && (hm == hp.length - 1 || hp.charCodeAt(hm + 1) == 32)) {
                hn = "\u00a0"
            }
            hk += hn;
            hl = hn == " "
        }
        return hk
    }

    function Z(hk, i) {
        return function (ht, hu, hl, hq, hv, hs, hp) {
            hl = hl ? hl + " cm-force-border" : "cm-force-border";
            var hm = ht.pos, ho = hm + hu.length;
            for (; ;) {
                var hn = (void 0);
                for (var hr = 0; hr < i.length; hr++) {
                    hn = i[hr];
                    if (hn.to > hm && hn.from <= hm) {
                        break
                    }
                }
                if (hn.to >= ho) {
                    return hk(ht, hu, hl, hq, hv, hs, hp)
                }
                hk(ht, hu.slice(0, hn.to - hm), hl, hq, null, hs, hp);
                hq = null;
                hu = hu.slice(hn.to - hm);
                hm = hn.to
            }
        }
    }

    function ak(hk, hm, i, hl) {
        var hn = !hl && i.widgetNode;
        if (hn) {
            hk.map.push(hk.pos, hk.pos + hm, hn)
        }
        if (!hl && hk.cm.display.input.needsContentAttribute) {
            if (!hn) {
                hn = hk.content.appendChild(document.createElement("span"))
            }
            hn.setAttribute("cm-marker", i.id)
        }
        if (hn) {
            hk.cm.display.input.setUneditable(hn);
            hk.content.appendChild(hn)
        }
        hk.pos += hm;
        hk.trailingSpace = false
    }

    function bF(hw, hE, hv) {
        var hp = hw.markedSpans, ht = hw.text, hB = 0;
        if (!hp) {
            for (var hq = 1; hq < hv.length; hq += 2) {
                hE.addToken(hE, ht.slice(hB, hB = hv[hq]), fG(hv[hq + 1], hE.cm.options))
            }
            return
        }
        var hI = ht.length, ho = 0, hH = 1, hz = "", hJ, hx;
        var hN = 0, hk, hM, hA, hm, hs;
        for (; ;) {
            if (hN == ho) {
                hk = hM = hA = hx = "";
                hs = null;
                hm = null;
                hN = Infinity;
                var hr = [], hu = (void 0);
                for (var hF = 0; hF < hp.length; ++hF) {
                    var hG = hp[hF], hD = hG.marker;
                    if (hD.type == "bookmark" && hG.from == ho && hD.widgetNode) {
                        hr.push(hD)
                    } else {
                        if (hG.from <= ho && (hG.to == null || hG.to > ho || hD.collapsed && hG.to == ho && hG.from == ho)) {
                            if (hG.to != null && hG.to != ho && hN > hG.to) {
                                hN = hG.to;
                                hM = ""
                            }
                            if (hD.className) {
                                hk += " " + hD.className
                            }
                            if (hD.css) {
                                hx = (hx ? hx + ";" : "") + hD.css
                            }
                            if (hD.startStyle && hG.from == ho) {
                                hA += " " + hD.startStyle
                            }
                            if (hD.endStyle && hG.to == hN) {
                                (hu || (hu = [])).push(hD.endStyle, hG.to)
                            }
                            if (hD.title) {
                                (hs || (hs = {})).title = hD.title
                            }
                            if (hD.attributes) {
                                for (var hC in hD.attributes) {
                                    (hs || (hs = {}))[hC] = hD.attributes[hC]
                                }
                            }
                            if (hD.collapsed && (!hm || en(hm.marker, hD) < 0)) {
                                hm = hG
                            }
                        } else {
                            if (hG.from > ho && hN > hG.from) {
                                hN = hG.from
                            }
                        }
                    }
                }
                if (hu) {
                    for (var hL = 0; hL < hu.length; hL += 2) {
                        if (hu[hL + 1] == hN) {
                            hM += " " + hu[hL]
                        }
                    }
                }
                if (!hm || hm.from == ho) {
                    for (var hK = 0; hK < hr.length; ++hK) {
                        ak(hE, 0, hr[hK])
                    }
                }
                if (hm && (hm.from || 0) == ho) {
                    ak(hE, (hm.to == null ? hI + 1 : hm.to) - ho, hm.marker, hm.from == null);
                    if (hm.to == null) {
                        return
                    }
                    if (hm.to == ho) {
                        hm = false
                    }
                }
            }
            if (ho >= hI) {
                break
            }
            var hy = Math.min(hI, hN);
            while (true) {
                if (hz) {
                    var hl = ho + hz.length;
                    if (!hm) {
                        var hn = hl > hy ? hz.slice(0, hy - ho) : hz;
                        hE.addToken(hE, hn, hJ ? hJ + hk : hk, hA, ho + hn.length == hN ? hM : "", hx, hs)
                    }
                    if (hl >= hy) {
                        hz = hz.slice(hy - ho);
                        ho = hy;
                        break
                    }
                    ho = hl;
                    hA = ""
                }
                hz = ht.slice(hB, hB = hv[hH++]);
                hJ = fG(hv[hH++], hE.cm.options)
            }
        }
    }

    function bN(hl, i, hk) {
        this.line = i;
        this.rest = g(i);
        this.size = this.rest ? b7(gt(this.rest)) - hk + 1 : 1;
        this.node = this.text = null;
        this.hidden = gg(hl, i)
    }

    function fF(i, hp, ho) {
        var hn = [], hl;
        for (var hm = hp; hm < ho; hm = hl) {
            var hk = new bN(i.doc, f0(i.doc, hm), hm);
            hl = hm + hk.size;
            hn.push(hk)
        }
        return hn
    }

    var bH = null;

    function fc(i) {
        if (bH) {
            bH.ops.push(i)
        } else {
            i.ownsGroup = bH = {ops: [i], delayedCallbacks: []}
        }
    }

    function dm(hn) {
        var hm = hn.delayedCallbacks, hl = 0;
        do {
            for (; hl < hm.length; hl++) {
                hm[hl].call(null)
            }
            for (var hk = 0; hk < hn.ops.length; hk++) {
                var ho = hn.ops[hk];
                if (ho.cursorActivityHandlers) {
                    while (ho.cursorActivityCalled < ho.cursorActivityHandlers.length) {
                        ho.cursorActivityHandlers[ho.cursorActivityCalled++].call(null, ho.cm)
                    }
                }
            }
        } while (hl < hm.length)
    }

    function cj(hl, hk) {
        var i = hl.ownsGroup;
        if (!i) {
            return
        }
        try {
            dm(i)
        } finally {
            bH = null;
            hk(i)
        }
    }

    var bR = null;

    function al(hq, ho) {
        var hk = eW(hq, ho);
        if (!hk.length) {
            return
        }
        var hm = Array.prototype.slice.call(arguments, 2), hp;
        if (bH) {
            hp = bH.delayedCallbacks
        } else {
            if (bR) {
                hp = bR
            } else {
                hp = bR = [];
                setTimeout(aW, 0)
            }
        }
        var hl = function (hr) {
            hp.push(function () {
                return hk[hr].apply(null, hm)
            })
        };
        for (var hn = 0; hn < hk.length; ++hn) {
            hl(hn)
        }
    }

    function aW() {
        var hk = bR;
        bR = null;
        for (var hl = 0; hl < hk.length; ++hl) {
            hk[hl]()
        }
    }

    function ai(i, hl, hn, ho) {
        for (var hk = 0; hk < hl.changes.length; hk++) {
            var hm = hl.changes[hk];
            if (hm == "text") {
                f6(i, hl)
            } else {
                if (hm == "gutter") {
                    dM(i, hl, hn, ho)
                } else {
                    if (hm == "class") {
                        ea(i, hl)
                    } else {
                        if (hm == "widget") {
                            aw(i, hl, ho)
                        }
                    }
                }
            }
        }
        hl.changes = null
    }

    function gv(i) {
        if (i.node == i.text) {
            i.node = g0("div", null, null, "position: relative");
            if (i.text.parentNode) {
                i.text.parentNode.replaceChild(i.node, i.text)
            }
            i.node.appendChild(i.text);
            if (ef && n < 8) {
                i.node.style.zIndex = 2
            }
        }
        return i.node
    }

    function e8(i, hl) {
        var hk = hl.bgClass ? hl.bgClass + " " + (hl.line.bgClass || "") : hl.line.bgClass;
        if (hk) {
            hk += " CodeMirror-linebackground"
        }
        if (hl.background) {
            if (hk) {
                hl.background.className = hk
            } else {
                hl.background.parentNode.removeChild(hl.background);
                hl.background = null
            }
        } else {
            if (hk) {
                var hm = gv(hl);
                hl.background = hm.insertBefore(g0("div", null, hk), hm.firstChild);
                i.display.input.setUneditable(hl.background)
            }
        }
    }

    function es(i, hk) {
        var hl = i.display.externalMeasured;
        if (hl && hl.line == hk.line) {
            i.display.externalMeasured = null;
            hk.measure = hl.measure;
            return hl.built
        }
        return fB(i, hk)
    }

    function f6(i, hm) {
        var hk = hm.text.className;
        var hl = es(i, hm);
        if (hm.text == hm.node) {
            hm.node = hl.pre
        }
        hm.text.parentNode.replaceChild(hl.pre, hm.text);
        hm.text = hl.pre;
        if (hl.bgClass != hm.bgClass || hl.textClass != hm.textClass) {
            hm.bgClass = hl.bgClass;
            hm.textClass = hl.textClass;
            ea(i, hm)
        } else {
            if (hk) {
                hm.text.className = hk
            }
        }
    }

    function ea(hk, hl) {
        e8(hk, hl);
        if (hl.line.wrapClass) {
            gv(hl).className = hl.line.wrapClass
        } else {
            if (hl.node != hl.text) {
                hl.node.className = ""
            }
        }
        var i = hl.textClass ? hl.textClass + " " + (hl.line.textClass || "") : hl.line.textClass;
        hl.text.className = i || ""
    }

    function dM(hr, hp, ho, hq) {
        if (hp.gutter) {
            hp.node.removeChild(hp.gutter);
            hp.gutter = null
        }
        if (hp.gutterBackground) {
            hp.node.removeChild(hp.gutterBackground);
            hp.gutterBackground = null
        }
        if (hp.line.gutterClass) {
            var hk = gv(hp);
            hp.gutterBackground = g0("div", null, "CodeMirror-gutter-background " + hp.line.gutterClass, ("left: " + (hr.options.fixedGutter ? hq.fixedPos : -hq.gutterTotalWidth) + "px; width: " + (hq.gutterTotalWidth) + "px"));
            hr.display.input.setUneditable(hp.gutterBackground);
            hk.insertBefore(hp.gutterBackground, hp.text)
        }
        var hm = hp.line.gutterMarkers;
        if (hr.options.lineNumbers || hm) {
            var hs = gv(hp);
            var hn = hp.gutter = g0("div", null, "CodeMirror-gutter-wrapper", ("left: " + (hr.options.fixedGutter ? hq.fixedPos : -hq.gutterTotalWidth) + "px"));
            hr.display.input.setUneditable(hn);
            hs.insertBefore(hn, hp.text);
            if (hp.line.gutterClass) {
                hn.className += " " + hp.line.gutterClass
            }
            if (hr.options.lineNumbers && (!hm || !hm["CodeMirror-linenumbers"])) {
                hp.lineNumber = hn.appendChild(g0("div", e5(hr.options, ho), "CodeMirror-linenumber CodeMirror-gutter-elt", ("left: " + (hq.gutterLeft["CodeMirror-linenumbers"]) + "px; width: " + (hr.display.lineNumInnerWidth) + "px")))
            }
            if (hm) {
                for (var hl = 0; hl < hr.display.gutterSpecs.length; ++hl) {
                    var i = hr.display.gutterSpecs[hl].className, ht = hm.hasOwnProperty(i) && hm[i];
                    if (ht) {
                        hn.appendChild(g0("div", [ht], "CodeMirror-gutter-elt", ("left: " + (hq.gutterLeft[i]) + "px; width: " + (hq.gutterWidth[i]) + "px")))
                    }
                }
            }
        }
    }

    function aw(i, hl, ho) {
        if (hl.alignable) {
            hl.alignable = null
        }
        var hk = X("CodeMirror-linewidget");
        for (var hn = hl.node.firstChild, hm = (void 0); hn; hn = hm) {
            hm = hn.nextSibling;
            if (hk.test(hn.className)) {
                hl.node.removeChild(hn)
            }
        }
        gd(i, hl, ho)
    }

    function aO(i, hl, hm, hn) {
        var hk = es(i, hl);
        hl.text = hl.node = hk.pre;
        if (hk.bgClass) {
            hl.bgClass = hk.bgClass
        }
        if (hk.textClass) {
            hl.textClass = hk.textClass
        }
        ea(i, hl);
        dM(i, hl, hm, hn);
        gd(i, hl, hn);
        return hl.node
    }

    function gd(hk, hm, hn) {
        g3(hk, hm.line, hm, hn, true);
        if (hm.rest) {
            for (var hl = 0; hl < hm.rest.length; hl++) {
                g3(hk, hm.rest[hl], hm, hn, false)
            }
        }
    }

    function g3(hs, ht, hp, hr, hn) {
        if (!ht.widgets) {
            return
        }
        var hk = gv(hp);
        for (var hm = 0, hq = ht.widgets; hm < hq.length; ++hm) {
            var ho = hq[hm],
                hl = g0("div", [ho.node], "CodeMirror-linewidget" + (ho.className ? " " + ho.className : ""));
            if (!ho.handleMouseEvents) {
                hl.setAttribute("cm-ignore-events", "true")
            }
            bY(ho, hl, hp, hr);
            hs.display.input.setUneditable(hl);
            if (hn && ho.above) {
                hk.insertBefore(hl, hp.gutter || hp.text)
            } else {
                hk.appendChild(hl)
            }
            al(ho, "redraw")
        }
    }

    function bY(hm, hl, i, hn) {
        if (hm.noHScroll) {
            (i.alignable || (i.alignable = [])).push(hl);
            var hk = hn.wrapperWidth;
            hl.style.left = hn.fixedPos + "px";
            if (!hm.coverGutter) {
                hk -= hn.gutterTotalWidth;
                hl.style.paddingLeft = hn.gutterTotalWidth + "px"
            }
            hl.style.width = hk + "px"
        }
        if (hm.coverGutter) {
            hl.style.zIndex = 5;
            hl.style.position = "relative";
            if (!hm.noHScroll) {
                hl.style.marginLeft = -hn.gutterTotalWidth + "px"
            }
        }
    }

    function dr(hl) {
        if (hl.height != null) {
            return hl.height
        }
        var i = hl.doc.cm;
        if (!i) {
            return 0
        }
        if (!ha(document.body, hl.node)) {
            var hk = "position: relative;";
            if (hl.coverGutter) {
                hk += "margin-left: -" + i.display.gutters.offsetWidth + "px;"
            }
            if (hl.noHScroll) {
                hk += "width: " + i.display.wrapper.clientWidth + "px;"
            }
            cd(i.display.measure, g0("div", [hl.node], null, hk))
        }
        return hl.height = hl.node.parentNode.offsetHeight
    }

    function bn(hk, i) {
        for (var hl = Q(i); hl != hk.wrapper; hl = hl.parentNode) {
            if (!hl || (hl.nodeType == 1 && hl.getAttribute("cm-ignore-events") == "true") || (hl.parentNode == hk.sizer && hl != hk.mover)) {
                return true
            }
        }
    }

    function fU(i) {
        return i.lineSpace.offsetTop
    }

    function b1(i) {
        return i.mover.offsetHeight - i.lineSpace.offsetHeight
    }

    function fQ(hm) {
        if (hm.cachedPaddingH) {
            return hm.cachedPaddingH
        }
        var hl = cd(hm.measure, g0("pre", "x", "CodeMirror-line-like"));
        var i = window.getComputedStyle ? window.getComputedStyle(hl) : hl.currentStyle;
        var hk = {left: parseInt(i.paddingLeft), right: parseInt(i.paddingRight)};
        if (!isNaN(hk.left) && !isNaN(hk.right)) {
            hm.cachedPaddingH = hk
        }
        return hk
    }

    function dl(i) {
        return ed - i.display.nativeBarWidth
    }

    function dS(i) {
        return i.display.scroller.clientWidth - dl(i) - i.display.barWidth
    }

    function dn(i) {
        return i.display.scroller.clientHeight - dl(i) - i.display.barHeight
    }

    function cF(hr, hn, hq) {
        var hm = hr.options.lineWrapping;
        var ho = hm && dS(hr);
        if (!hn.measure.heights || hm && hn.measure.width != ho) {
            var hp = hn.measure.heights = [];
            if (hm) {
                hn.measure.width = ho;
                var ht = hn.text.firstChild.getClientRects();
                for (var hk = 0; hk < ht.length - 1; hk++) {
                    var hs = ht[hk], hl = ht[hk + 1];
                    if (Math.abs(hs.bottom - hl.bottom) > 2) {
                        hp.push((hs.bottom + hl.top) / 2 - hq.top)
                    }
                }
            }
            hp.push(hq.bottom - hq.top)
        }
    }

    function cU(hm, hk, hn) {
        if (hm.line == hk) {
            return {map: hm.measure.map, cache: hm.measure.cache}
        }
        for (var hl = 0; hl < hm.rest.length; hl++) {
            if (hm.rest[hl] == hk) {
                return {map: hm.measure.maps[hl], cache: hm.measure.caches[hl]}
            }
        }
        for (var ho = 0; ho < hm.rest.length; ho++) {
            if (b7(hm.rest[ho]) > hn) {
                return {map: hm.measure.maps[ho], cache: hm.measure.caches[ho], before: true}
            }
        }
    }

    function dv(i, hl) {
        hl = A(hl);
        var hn = b7(hl);
        var hk = i.display.externalMeasured = new bN(i.doc, hl, hn);
        hk.lineN = hn;
        var hm = hk.built = fB(i, hk);
        hk.text = hm.pre;
        cd(i.display.lineMeasure, hm.pre);
        return hk
    }

    function eR(i, hk, hm, hl) {
        return G(i, bh(i, hk), hm, hl)
    }

    function fX(i, hl) {
        if (hl >= i.display.viewFrom && hl < i.display.viewTo) {
            return i.display.view[dY(i, hl)]
        }
        var hk = i.display.externalMeasured;
        if (hk && hl >= hk.lineN && hl < hk.lineN + hk.size) {
            return hk
        }
    }

    function bh(i, hl) {
        var hm = b7(hl);
        var hk = fX(i, hm);
        if (hk && !hk.text) {
            hk = null
        } else {
            if (hk && hk.changes) {
                ai(i, hk, hm, fY(i));
                i.curOp.forceUpdate = true
            }
        }
        if (!hk) {
            hk = dv(i, hl)
        }
        var hn = cU(hk, hl, hm);
        return {line: hl, view: hk, rect: null, map: hn.map, cache: hn.cache, before: hn.before, hasHeights: false}
    }

    function G(i, hp, hn, hk, hm) {
        if (hp.before) {
            hn = -1
        }
        var hl = hn + (hk || ""), ho;
        if (hp.cache.hasOwnProperty(hl)) {
            ho = hp.cache[hl]
        } else {
            if (!hp.rect) {
                hp.rect = hp.view.text.getBoundingClientRect()
            }
            if (!hp.hasHeights) {
                cF(i, hp.view, hp.rect);
                hp.hasHeights = true
            }
            ho = l(i, hp, hn, hk);
            if (!ho.bogus) {
                hp.cache[hl] = ho
            }
        }
        return {left: ho.left, right: ho.right, top: hm ? ho.rtop : ho.top, bottom: hm ? ho.rbottom : ho.bottom}
    }

    var fg = {left: 0, right: 0, top: 0, bottom: 0};

    function aU(hl, hk, hr) {
        var hn, hm, hp, hs, ho, ht;
        for (var hq = 0; hq < hl.length; hq += 3) {
            ho = hl[hq];
            ht = hl[hq + 1];
            if (hk < ho) {
                hm = 0;
                hp = 1;
                hs = "left"
            } else {
                if (hk < ht) {
                    hm = hk - ho;
                    hp = hm + 1
                } else {
                    if (hq == hl.length - 3 || hk == ht && hl[hq + 3] > hk) {
                        hp = ht - ho;
                        hm = hp - 1;
                        if (hk >= ht) {
                            hs = "right"
                        }
                    }
                }
            }
            if (hm != null) {
                hn = hl[hq + 2];
                if (ho == ht && hr == (hn.insertLeft ? "left" : "right")) {
                    hs = hr
                }
                if (hr == "left" && hm == 0) {
                    while (hq && hl[hq - 2] == hl[hq - 3] && hl[hq - 1].insertLeft) {
                        hn = hl[(hq -= 3) + 2];
                        hs = "left"
                    }
                }
                if (hr == "right" && hm == ht - ho) {
                    while (hq < hl.length - 3 && hl[hq + 3] == hl[hq + 4] && !hl[hq + 5].insertLeft) {
                        hn = hl[(hq += 3) + 2];
                        hs = "right"
                    }
                }
                break
            }
        }
        return {node: hn, start: hm, end: hp, collapse: hs, coverStart: ho, coverEnd: ht}
    }

    function fC(hl, hk) {
        var hn = fg;
        if (hk == "left") {
            for (var hm = 0; hm < hl.length; hm++) {
                if ((hn = hl[hm]).left != hn.right) {
                    break
                }
            }
        } else {
            for (var ho = hl.length - 1; ho >= 0; ho--) {
                if ((hn = hl[ho]).left != hn.right) {
                    break
                }
            }
        }
        return hn
    }

    function l(hs, hC, hv, hp) {
        var ht = aU(hC.map, hv, hp);
        var hA = ht.node, ho = ht.start, hn = ht.end, hk = ht.collapse;
        var hl;
        if (hA.nodeType == 3) {
            for (var hq = 0; hq < 4; hq++) {
                while (ho && f9(hC.line.text.charAt(ht.coverStart + ho))) {
                    --ho
                }
                while (ht.coverStart + hn < ht.coverEnd && f9(hC.line.text.charAt(ht.coverStart + hn))) {
                    ++hn
                }
                if (ef && n < 9 && ho == 0 && hn == ht.coverEnd - ht.coverStart) {
                    hl = hA.parentNode.getBoundingClientRect()
                } else {
                    hl = fC(cM(hA, ho, hn).getClientRects(), hp)
                }
                if (hl.left || hl.right || ho == 0) {
                    break
                }
                hn = ho;
                ho = ho - 1;
                hk = "right"
            }
            if (ef && n < 11) {
                hl = fw(hs.display.measure, hl)
            }
        } else {
            if (ho > 0) {
                hk = hp = "right"
            }
            var hm;
            if (hs.options.lineWrapping && (hm = hA.getClientRects()).length > 1) {
                hl = hm[hp == "right" ? hm.length - 1 : 0]
            } else {
                hl = hA.getBoundingClientRect()
            }
        }
        if (ef && n < 9 && !ho && (!hl || !hl.left && !hl.right)) {
            var hr = hA.parentNode.getClientRects()[0];
            if (hr) {
                hl = {left: hr.left, right: hr.left + d7(hs.display), top: hr.top, bottom: hr.bottom}
            } else {
                hl = fg
            }
        }
        var hy = hl.top - hC.rect.top, hw = hl.bottom - hC.rect.top;
        var hE = (hy + hw) / 2;
        var hD = hC.view.measure.heights;
        var hB = 0;
        for (; hB < hD.length - 1; hB++) {
            if (hE < hD[hB]) {
                break
            }
        }
        var hz = hB ? hD[hB - 1] : 0, hx = hD[hB];
        var hu = {
            left: (hk == "right" ? hl.right : hl.left) - hC.rect.left,
            right: (hk == "left" ? hl.left : hl.right) - hC.rect.left,
            top: hz,
            bottom: hx
        };
        if (!hl.left && !hl.right) {
            hu.bogus = true
        }
        if (!hs.options.singleCursorHeightPerLine) {
            hu.rtop = hy;
            hu.rbottom = hw
        }
        return hu
    }

    function fw(hl, hm) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !aV(hl)) {
            return hm
        }
        var hk = screen.logicalXDPI / screen.deviceXDPI;
        var i = screen.logicalYDPI / screen.deviceYDPI;
        return {left: hm.left * hk, right: hm.right * hk, top: hm.top * i, bottom: hm.bottom * i}
    }

    function aD(hl) {
        if (hl.measure) {
            hl.measure.cache = {};
            hl.measure.heights = null;
            if (hl.rest) {
                for (var hk = 0; hk < hl.rest.length; hk++) {
                    hl.measure.caches[hk] = {}
                }
            }
        }
    }

    function aZ(hk) {
        hk.display.externalMeasure = null;
        eA(hk.display.lineMeasure);
        for (var hl = 0; hl < hk.display.view.length; hl++) {
            aD(hk.display.view[hl])
        }
    }

    function aq(i) {
        aZ(i);
        i.display.cachedCharWidth = i.display.cachedTextHeight = i.display.cachedPaddingH = null;
        if (!i.options.lineWrapping) {
            i.display.maxLineChanged = true
        }
        i.display.lineNumChars = null
    }

    function cV() {
        if (dJ && aX) {
            return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft))
        }
        return window.pageXOffset || (document.documentElement || document.body).scrollLeft
    }

    function cT() {
        if (dJ && aX) {
            return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop))
        }
        return window.pageYOffset || (document.documentElement || document.body).scrollTop
    }

    function ee(hl) {
        var hk = 0;
        if (hl.widgets) {
            for (var hm = 0; hm < hl.widgets.length; ++hm) {
                if (hl.widgets[hm].above) {
                    hk += dr(hl.widgets[hm])
                }
            }
        }
        return hk
    }

    function fz(hp, hm, ho, hk, hl) {
        if (!hl) {
            var hq = ee(hm);
            ho.top += hq;
            ho.bottom += hq
        }
        if (hk == "line") {
            return ho
        }
        if (!hk) {
            hk = "local"
        }
        var hn = b6(hm);
        if (hk == "local") {
            hn += fU(hp.display)
        } else {
            hn -= hp.display.viewOffset
        }
        if (hk == "page" || hk == "window") {
            var i = hp.display.lineSpace.getBoundingClientRect();
            hn += i.top + (hk == "window" ? 0 : cT());
            var hr = i.left + (hk == "window" ? 0 : cV());
            ho.left += hr;
            ho.right += hr
        }
        ho.top += hn;
        ho.bottom += hn;
        return ho
    }

    function hf(hk, hn, hl) {
        if (hl == "div") {
            return hn
        }
        var hp = hn.left, ho = hn.top;
        if (hl == "page") {
            hp -= cV();
            ho -= cT()
        } else {
            if (hl == "local" || !hl) {
                var hm = hk.display.sizer.getBoundingClientRect();
                hp += hm.left;
                ho += hm.top
            }
        }
        var i = hk.display.lineSpace.getBoundingClientRect();
        return {left: hp - i.left, top: ho - i.top}
    }

    function dc(i, hn, hm, hl, hk) {
        if (!hl) {
            hl = f0(i.doc, hn.line)
        }
        return fz(i, hl, eR(i, hl, hn.ch, hk), hm)
    }

    function er(hu, hs, hl, hp, hw, hq) {
        hp = hp || f0(hu.doc, hs.line);
        if (!hw) {
            hw = bh(hu, hp)
        }

        function hn(hz, hy) {
            var hx = G(hu, hw, hz, hy ? "right" : "left", hq);
            if (hy) {
                hx.left = hx.right
            } else {
                hx.right = hx.left
            }
            return fz(hu, hp, hx, hl)
        }

        var ho = a(hp, hu.doc.direction), i = hs.ch, ht = hs.sticky;
        if (i >= hp.text.length) {
            i = hp.text.length;
            ht = "before"
        } else {
            if (i <= 0) {
                i = 0;
                ht = "after"
            }
        }
        if (!ho) {
            return hn(ht == "before" ? i - 1 : i, ht == "before")
        }

        function hv(hA, hx, hB) {
            var hy = ho[hx], hz = hy.level == 1;
            return hn(hB ? hA - 1 : hA, hz != hB)
        }

        var hk = aR(ho, i, ht);
        var hr = fO;
        var hm = hv(i, hk, ht == "before");
        if (hr != null) {
            hm.other = hv(i, hr, ht != "before")
        }
        return hm
    }

    function eb(i, hn) {
        var hm = 0;
        hn = gy(i.doc, hn);
        if (!i.options.lineWrapping) {
            hm = d7(i.display) * hn.ch
        }
        var hk = f0(i.doc, hn.line);
        var hl = b6(hk) + fU(i.display);
        return {left: hm, right: hm, top: hl, bottom: hl + hk.height}
    }

    function gY(i, hk, hm, hl, ho) {
        var hn = ab(i, hk, hm);
        hn.xRel = ho;
        if (hl) {
            hn.outside = hl
        }
        return hn
    }

    function gG(hq, ho, hn) {
        var hp = hq.doc;
        hn += hq.display.viewOffset;
        if (hn < 0) {
            return gY(hp.first, 0, null, -1, -1)
        }
        var hm = b0(hp, hn), hr = hp.first + hp.size - 1;
        if (hm > hr) {
            return gY(hp.first + hp.size - 1, f0(hp, hr).text.length, null, 1, 1)
        }
        if (ho < 0) {
            ho = 0
        }
        var hl = f0(hp, hm);
        for (; ;) {
            var hs = ds(hq, hl, hm, ho, hn);
            var hk = cC(hl, hs.ch + (hs.xRel > 0 || hs.outside > 0 ? 1 : 0));
            if (!hk) {
                return hs
            }
            var i = hk.find(1);
            if (i.line == hm) {
                return i
            }
            hl = f0(hp, hm = i.line)
        }
    }

    function bC(i, hl, hn, ho) {
        ho -= ee(hl);
        var hk = hl.text.length;
        var hm = cN(function (hp) {
            return G(i, hn, hp - 1).bottom <= ho
        }, hk, 0);
        hk = cN(function (hp) {
            return G(i, hn, hp).top > ho
        }, hm, hk);
        return {begin: hm, end: hk}
    }

    function bA(i, hk, hm, hn) {
        if (!hm) {
            hm = bh(i, hk)
        }
        var hl = fz(i, hk, G(i, hm, hn), "line").top;
        return bC(i, hk, hm, hl)
    }

    function az(hk, i, hm, hl) {
        return hk.bottom <= hm ? false : hk.top > hm ? true : (hl ? hk.left : hk.right) > i
    }

    function ds(hm, hk, hq, hp, ho) {
        ho -= b6(hk);
        var hu = bh(hm, hk);
        var hD = ee(hk);
        var hB = 0, hl = hk.text.length, hy = true;
        var hw = a(hk, hm.doc.direction);
        if (hw) {
            var hv = (hm.options.lineWrapping ? gV : gA)(hm, hk, hq, hu, hw, hp, ho);
            hy = hv.level != 1;
            hB = hy ? hv.from : hv.to - 1;
            hl = hy ? hv.to : hv.from - 1
        }
        var hn = null, hs = null;
        var ht = cN(function (hE) {
            var hF = G(hm, hu, hE);
            hF.top += hD;
            hF.bottom += hD;
            if (!az(hF, hp, ho, false)) {
                return false
            }
            if (hF.top <= ho && hF.left <= hp) {
                hn = hE;
                hs = hF
            }
            return true
        }, hB, hl);
        var i, hC, hA = false;
        if (hs) {
            var hz = hp - hs.left < hs.right - hp, hr = hz == hy;
            ht = hn + (hr ? 0 : 1);
            hC = hr ? "after" : "before";
            i = hz ? hs.left : hs.right
        } else {
            if (!hy && (ht == hl || ht == hB)) {
                ht++
            }
            hC = ht == 0 ? "after" : ht == hk.text.length ? "before" : (G(hm, hu, ht - (hy ? 1 : 0)).bottom + hD <= ho) == hy ? "after" : "before";
            var hx = er(hm, ab(hq, ht, hC), "line", hk, hu);
            i = hx.left;
            hA = ho < hx.top ? -1 : ho >= hx.bottom ? 1 : 0
        }
        ht = eU(hk.text, ht, 1);
        return gY(hq, ht, hC, hA, hp - i)
    }

    function gA(hs, ho, hn, ht, hm, hr, hq) {
        var hp = cN(function (hw) {
            var hu = hm[hw], hv = hu.level != 1;
            return az(er(hs, ab(hn, hv ? hu.to : hu.from, hv ? "before" : "after"), "line", ho, ht), hr, hq, true)
        }, 0, hm.length - 1);
        var hl = hm[hp];
        if (hp > 0) {
            var hk = hl.level != 1;
            var i = er(hs, ab(hn, hk ? hl.from : hl.to, hk ? "after" : "before"), "line", ho, ht);
            if (az(i, hr, hq, true) && i.top > hq) {
                hl = hm[hp - 1]
            }
        }
        return hl
    }

    function gV(hx, hs, hv, hA, hp, hw, hu) {
        var ho = bC(hx, hs, hA, hu);
        var hn = ho.begin;
        var hq = ho.end;
        if (/\s/.test(hs.text.charAt(hq - 1))) {
            hq--
        }
        var hm = null, hy = null;
        for (var hr = 0; hr < hp.length; hr++) {
            var hk = hp[hr];
            if (hk.from >= hq || hk.to <= hn) {
                continue
            }
            var hl = hk.level != 1;
            var hz = G(hx, hA, hl ? Math.min(hq, hk.to) - 1 : Math.max(hn, hk.from)).right;
            var ht = hz < hw ? hw - hz + 1000000000 : hz - hw;
            if (!hm || hy > ht) {
                hm = hk;
                hy = ht
            }
        }
        if (!hm) {
            hm = hp[hp.length - 1]
        }
        if (hm.from < hn) {
            hm = {from: hn, to: hm.to, level: hm.level}
        }
        if (hm.to > hq) {
            hm = {from: hm.from, to: hq, level: hm.level}
        }
        return hm
    }

    var aQ;

    function a9(hm) {
        if (hm.cachedTextHeight != null) {
            return hm.cachedTextHeight
        }
        if (aQ == null) {
            aQ = g0("pre", null, "CodeMirror-line-like");
            for (var hl = 0; hl < 49; ++hl) {
                aQ.appendChild(document.createTextNode("x"));
                aQ.appendChild(g0("br"))
            }
            aQ.appendChild(document.createTextNode("x"))
        }
        cd(hm.measure, aQ);
        var hk = aQ.offsetHeight / 50;
        if (hk > 3) {
            hm.cachedTextHeight = hk
        }
        eA(hm.measure);
        return hk || 1
    }

    function d7(hn) {
        if (hn.cachedCharWidth != null) {
            return hn.cachedCharWidth
        }
        var i = g0("span", "xxxxxxxxxx");
        var hm = g0("pre", [i], "CodeMirror-line-like");
        cd(hn.measure, hm);
        var hl = i.getBoundingClientRect(), hk = (hl.right - hl.left) / 10;
        if (hk > 2) {
            hn.cachedCharWidth = hk
        }
        return hk || 10
    }

    function fY(hk) {
        var hp = hk.display, hn = {}, hm = {};
        var ho = hp.gutters.clientLeft;
        for (var hr = hp.gutters.firstChild, hl = 0; hr; hr = hr.nextSibling, ++hl) {
            var hq = hk.display.gutterSpecs[hl].className;
            hn[hq] = hr.offsetLeft + hr.clientLeft + ho;
            hm[hq] = hr.clientWidth
        }
        return {
            fixedPos: ev(hp),
            gutterTotalWidth: hp.gutters.offsetWidth,
            gutterLeft: hn,
            gutterWidth: hm,
            wrapperWidth: hp.wrapper.clientWidth
        }
    }

    function ev(i) {
        return i.scroller.getBoundingClientRect().left - i.sizer.getBoundingClientRect().left
    }

    function bq(i) {
        var hl = a9(i.display), hk = i.options.lineWrapping;
        var hm = hk && Math.max(5, i.display.scroller.clientWidth / d7(i.display) - 3);
        return function (ho) {
            if (gg(i.doc, ho)) {
                return 0
            }
            var hn = 0;
            if (ho.widgets) {
                for (var hp = 0; hp < ho.widgets.length; hp++) {
                    if (ho.widgets[hp].height) {
                        hn += ho.widgets[hp].height
                    }
                }
            }
            if (hk) {
                return hn + (Math.ceil(ho.text.length / hm) || 1) * hl
            } else {
                return hn + hl
            }
        }
    }

    function ae(i) {
        var hl = i.doc, hk = bq(i);
        hl.iter(function (hm) {
            var hn = hk(hm);
            if (hn != hm.height) {
                g5(hm, hn)
            }
        })
    }

    function cO(ht, ho, hl, hm) {
        var hp = ht.display;
        if (!hl && Q(ho).getAttribute("cm-not-content") == "true") {
            return null
        }
        var hs, hq, i = hp.lineSpace.getBoundingClientRect();
        try {
            hs = ho.clientX - i.left;
            hq = ho.clientY - i.top
        } catch (hk) {
            return null
        }
        var hr = gG(ht, hs, hq), hu;
        if (hm && hr.xRel > 0 && (hu = f0(ht.doc, hr.line).text).length == hr.ch) {
            var hn = cc(hu, hu.length, ht.options.tabSize) - hu.length;
            hr = ab(hr.line, Math.max(0, Math.round((hs - fQ(ht.display).left) / d7(ht.display)) - hn))
        }
        return hr
    }

    function dY(hk, hn) {
        if (hn >= hk.display.viewTo) {
            return null
        }
        hn -= hk.display.viewFrom;
        if (hn < 0) {
            return null
        }
        var hl = hk.display.view;
        for (var hm = 0; hm < hl.length; hm++) {
            hn -= hl[hm].size;
            if (hn < 0) {
                return hm
            }
        }
    }

    function ao(hr, hp, hq, hs) {
        if (hp == null) {
            hp = hr.doc.first
        }
        if (hq == null) {
            hq = hr.doc.first + hr.doc.size
        }
        if (!hs) {
            hs = 0
        }
        var hm = hr.display;
        if (hs && hq < hm.viewTo && (hm.updateLineNumbers == null || hm.updateLineNumbers > hp)) {
            hm.updateLineNumbers = hp
        }
        hr.curOp.viewChanged = true;
        if (hp >= hm.viewTo) {
            if (bj && a7(hr.doc, hp) < hm.viewTo) {
                fa(hr)
            }
        } else {
            if (hq <= hm.viewFrom) {
                if (bj && eC(hr.doc, hq + hs) > hm.viewFrom) {
                    fa(hr)
                } else {
                    hm.viewFrom += hs;
                    hm.viewTo += hs
                }
            } else {
                if (hp <= hm.viewFrom && hq >= hm.viewTo) {
                    fa(hr)
                } else {
                    if (hp <= hm.viewFrom) {
                        var ho = dL(hr, hq, hq + hs, 1);
                        if (ho) {
                            hm.view = hm.view.slice(ho.index);
                            hm.viewFrom = ho.lineN;
                            hm.viewTo += hs
                        } else {
                            fa(hr)
                        }
                    } else {
                        if (hq >= hm.viewTo) {
                            var hk = dL(hr, hp, hp, -1);
                            if (hk) {
                                hm.view = hm.view.slice(0, hk.index);
                                hm.viewTo = hk.lineN
                            } else {
                                fa(hr)
                            }
                        } else {
                            var hn = dL(hr, hp, hp, -1);
                            var hl = dL(hr, hq, hq + hs, 1);
                            if (hn && hl) {
                                hm.view = hm.view.slice(0, hn.index).concat(fF(hr, hn.lineN, hl.lineN)).concat(hm.view.slice(hl.index));
                                hm.viewTo += hs
                            } else {
                                fa(hr)
                            }
                        }
                    }
                }
            }
        }
        var i = hm.externalMeasured;
        if (i) {
            if (hq < i.lineN) {
                i.lineN += hs
            } else {
                if (hp < i.lineN + i.size) {
                    hm.externalMeasured = null
                }
            }
        }
    }

    function W(hk, hl, ho) {
        hk.curOp.viewChanged = true;
        var hp = hk.display, hn = hk.display.externalMeasured;
        if (hn && hl >= hn.lineN && hl < hn.lineN + hn.size) {
            hp.externalMeasured = null
        }
        if (hl < hp.viewFrom || hl >= hp.viewTo) {
            return
        }
        var hm = hp.view[dY(hk, hl)];
        if (hm.node == null) {
            return
        }
        var i = hm.changes || (hm.changes = []);
        if (dP(i, ho) == -1) {
            i.push(ho)
        }
    }

    function fa(i) {
        i.display.viewFrom = i.display.viewTo = i.doc.first;
        i.display.view = [];
        i.display.viewOffset = 0
    }

    function dL(hs, hm, ho, hl) {
        var hp = dY(hs, hm), hr, hq = hs.display.view;
        if (!bj || ho == hs.doc.first + hs.doc.size) {
            return {index: hp, lineN: ho}
        }
        var hk = hs.display.viewFrom;
        for (var hn = 0; hn < hp; hn++) {
            hk += hq[hn].size
        }
        if (hk != hm) {
            if (hl > 0) {
                if (hp == hq.length - 1) {
                    return null
                }
                hr = (hk + hq[hp].size) - hm;
                hp++
            } else {
                hr = hk - hm
            }
            hm += hr;
            ho += hr
        }
        while (a7(hs.doc, ho) != ho) {
            if (hp == (hl < 0 ? 0 : hq.length - 1)) {
                return null
            }
            ho += hl * hq[hp - (hl < 0 ? 1 : 0)].size;
            hp += hl
        }
        return {index: hp, lineN: ho}
    }

    function dk(i, hn, hm) {
        var hl = i.display, hk = hl.view;
        if (hk.length == 0 || hn >= hl.viewTo || hm <= hl.viewFrom) {
            hl.view = fF(i, hn, hm);
            hl.viewFrom = hn
        } else {
            if (hl.viewFrom > hn) {
                hl.view = fF(i, hn, hl.viewFrom).concat(hl.view)
            } else {
                if (hl.viewFrom < hn) {
                    hl.view = hl.view.slice(dY(i, hn))
                }
            }
            hl.viewFrom = hn;
            if (hl.viewTo < hm) {
                hl.view = hl.view.concat(fF(i, hl.viewTo, hm))
            } else {
                if (hl.viewTo > hm) {
                    hl.view = hl.view.slice(0, dY(i, hm))
                }
            }
        }
        hl.viewTo = hm
    }

    function dI(hk) {
        var hl = hk.display.view, ho = 0;
        for (var hn = 0; hn < hl.length; hn++) {
            var hm = hl[hn];
            if (!hm.hidden && (!hm.node || hm.changes)) {
                ++ho
            }
        }
        return ho
    }

    function bV(i) {
        i.display.input.showSelection(i.display.input.prepareSelection())
    }

    function gw(hr, hk) {
        if (hk === void 0) {
            hk = true
        }
        var hq = hr.doc, hs = {};
        var hp = hs.cursors = document.createDocumentFragment();
        var hl = hs.selection = document.createDocumentFragment();
        for (var hn = 0; hn < hq.sel.ranges.length; hn++) {
            if (!hk && hn == hq.sel.primIndex) {
                continue
            }
            var ho = hq.sel.ranges[hn];
            if (ho.from().line >= hr.display.viewTo || ho.to().line < hr.display.viewFrom) {
                continue
            }
            var hm = ho.empty();
            if (hm || hr.options.showCursorWhenSelecting) {
                D(hr, ho.head, hp)
            }
            if (!hm) {
                bW(hr, ho, hl)
            }
        }
        return hs
    }

    function D(i, hm, hl) {
        var ho = er(i, hm, "div", null, null, !i.options.singleCursorHeightPerLine);
        var hn = hl.appendChild(g0("div", "\u00a0", "CodeMirror-cursor"));
        hn.style.left = ho.left + "px";
        hn.style.top = ho.top + "px";
        hn.style.height = Math.max(0, ho.bottom - ho.top) * i.options.cursorHeight + "px";
        if (ho.other) {
            var hk = hl.appendChild(g0("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            hk.style.display = "";
            hk.style.left = ho.other.left + "px";
            hk.style.top = ho.other.top + "px";
            hk.style.height = (ho.other.bottom - ho.other.top) * 0.85 + "px"
        }
    }

    function gQ(hk, i) {
        return hk.top - i.top || hk.left - i.left
    }

    function bW(ho, hu, hp) {
        var hx = ho.display, hB = ho.doc;
        var i = document.createDocumentFragment();
        var ht = fQ(ho.display), hm = ht.left;
        var hy = Math.max(hx.sizerWidth, dS(ho) - hx.sizer.offsetLeft) - ht.right;
        var hn = hB.direction == "ltr";

        function hv(hF, hE, hD, hC) {
            if (hE < 0) {
                hE = 0
            }
            hE = Math.round(hE);
            hC = Math.round(hC);
            i.appendChild(g0("div", null, "CodeMirror-selected", ("position: absolute; left: " + hF + "px;\n                             top: " + hE + "px; width: " + (hD == null ? hy - hF : hD) + "px;\n                             height: " + (hC - hE) + "px")))
        }

        function hk(hL, hD, hK) {
            var hH = f0(hB, hL);
            var hI = hH.text.length;
            var hC, hG;

            function hJ(hN, hM) {
                return dc(ho, ab(hL, hN), "div", hH, hM)
            }

            function hE(hR, hM, hN) {
                var hP = bA(ho, hH, null, hR);
                var hQ = (hM == "ltr") == (hN == "after") ? "left" : "right";
                var hO = hN == "after" ? hP.begin : hP.end - (/\s/.test(hH.text.charAt(hP.end - 1)) ? 2 : 1);
                return hJ(hO, hQ)[hQ]
            }

            var hF = a(hH, hB.direction);
            eE(hF, hD || 0, hK == null ? hI : hK, function (hX, hM, hS, h0) {
                var h3 = hS == "ltr";
                var hY = hJ(hX, h3 ? "left" : "right");
                var hW = hJ(hM - 1, h3 ? "right" : "left");
                var h2 = hD == null && hX == 0, hZ = hK == null && hM == hI;
                var hO = h0 == 0, hQ = !hF || h0 == hF.length - 1;
                if (hW.top - hY.top <= 3) {
                    var hP = (hn ? h2 : hZ) && hO;
                    var hR = (hn ? hZ : h2) && hQ;
                    var hN = hP ? hm : (h3 ? hY : hW).left;
                    var h4 = hR ? hy : (h3 ? hW : hY).right;
                    hv(hN, hY.top, h4 - hN, hY.bottom)
                } else {
                    var hU, hT, h1, hV;
                    if (h3) {
                        hU = hn && h2 && hO ? hm : hY.left;
                        hT = hn ? hy : hE(hX, hS, "before");
                        h1 = hn ? hm : hE(hM, hS, "after");
                        hV = hn && hZ && hQ ? hy : hW.right
                    } else {
                        hU = !hn ? hm : hE(hX, hS, "before");
                        hT = !hn && h2 && hO ? hy : hY.right;
                        h1 = !hn && hZ && hQ ? hm : hW.left;
                        hV = !hn ? hy : hE(hM, hS, "after")
                    }
                    hv(hU, hY.top, hT - hU, hY.bottom);
                    if (hY.bottom < hW.top) {
                        hv(hm, hY.bottom, null, hW.top)
                    }
                    hv(h1, hW.top, hV - h1, hW.bottom)
                }
                if (!hC || gQ(hY, hC) < 0) {
                    hC = hY
                }
                if (gQ(hW, hC) < 0) {
                    hC = hW
                }
                if (!hG || gQ(hY, hG) < 0) {
                    hG = hY
                }
                if (gQ(hW, hG) < 0) {
                    hG = hW
                }
            });
            return {start: hC, end: hG}
        }

        var hA = hu.from(), hz = hu.to();
        if (hA.line == hz.line) {
            hk(hA.line, hA.ch, hz.ch)
        } else {
            var hl = f0(hB, hA.line), hr = f0(hB, hz.line);
            var hq = A(hl) == A(hr);
            var hs = hk(hA.line, hA.ch, hq ? hl.text.length + 1 : null).end;
            var hw = hk(hz.line, hq ? 0 : null, hz.ch).start;
            if (hq) {
                if (hs.top < hw.top - 2) {
                    hv(hs.right, hs.top, null, hs.bottom);
                    hv(hm, hw.top, hw.left, hw.bottom)
                } else {
                    hv(hs.right, hs.top, hw.left - hs.right, hs.bottom)
                }
            }
            if (hs.bottom < hw.top) {
                hv(hm, hs.bottom, null, hw.top)
            }
        }
        hp.appendChild(i)
    }

    function r(i) {
        if (!i.state.focused) {
            return
        }
        var hl = i.display;
        clearInterval(hl.blinker);
        var hk = true;
        hl.cursorDiv.style.visibility = "";
        if (i.options.cursorBlinkRate > 0) {
            hl.blinker = setInterval(function () {
                if (!i.hasFocus()) {
                    a6(i)
                }
                hl.cursorDiv.style.visibility = (hk = !hk) ? "" : "hidden"
            }, i.options.cursorBlinkRate)
        } else {
            if (i.options.cursorBlinkRate < 0) {
                hl.cursorDiv.style.visibility = "hidden"
            }
        }
    }

    function u(i) {
        if (!i.hasFocus()) {
            i.display.input.focus();
            if (!i.state.focused) {
                c2(i)
            }
        }
    }

    function ar(i) {
        i.state.delayingBlurEvent = true;
        setTimeout(function () {
            if (i.state.delayingBlurEvent) {
                i.state.delayingBlurEvent = false;
                if (i.state.focused) {
                    a6(i)
                }
            }
        }, 100)
    }

    function c2(i, hk) {
        if (i.state.delayingBlurEvent && !i.state.draggingText) {
            i.state.delayingBlurEvent = false
        }
        if (i.options.readOnly == "nocursor") {
            return
        }
        if (!i.state.focused) {
            aN(i, "focus", i, hk);
            i.state.focused = true;
            gn(i.display.wrapper, "CodeMirror-focused");
            if (!i.curOp && i.display.selForContextMenu != i.doc.sel) {
                i.display.input.reset();
                if (dt) {
                    setTimeout(function () {
                        return i.display.input.reset(true)
                    }, 20)
                }
            }
            i.display.input.receivedFocus()
        }
        r(i)
    }

    function a6(i, hk) {
        if (i.state.delayingBlurEvent) {
            return
        }
        if (i.state.focused) {
            aN(i, "blur", i, hk);
            i.state.focused = false;
            h(i.display.wrapper, "CodeMirror-focused")
        }
        clearInterval(i.display.blinker);
        setTimeout(function () {
            if (!i.state.focused) {
                i.display.shift = false
            }
        }, 150)
    }

    function bl(hu) {
        var hs = hu.display;
        var hm = hs.lineDiv.offsetTop;
        for (var hn = 0; hn < hs.view.length; hn++) {
            var hv = hs.view[hn], hp = hu.options.lineWrapping;
            var hw = (void 0), hk = 0;
            if (hv.hidden) {
                continue
            }
            if (ef && n < 8) {
                var hr = hv.node.offsetTop + hv.node.offsetHeight;
                hw = hr - hm;
                hm = hr
            } else {
                var ho = hv.node.getBoundingClientRect();
                hw = ho.bottom - ho.top;
                if (!hp && hv.text.firstChild) {
                    hk = hv.text.firstChild.getBoundingClientRect().right - ho.left - 1
                }
            }
            var ht = hv.line.height - hw;
            if (ht > 0.005 || ht < -0.005) {
                g5(hv.line, hw);
                cx(hv.line);
                if (hv.rest) {
                    for (var hl = 0; hl < hv.rest.length; hl++) {
                        cx(hv.rest[hl])
                    }
                }
            }
            if (hk > hu.display.sizerWidth) {
                var hq = Math.ceil(hk / d7(hu.display));
                if (hq > hu.display.maxLineLength) {
                    hu.display.maxLineLength = hq;
                    hu.display.maxLine = hv.line;
                    hu.display.maxLineChanged = true
                }
            }
        }
    }

    function cx(hl) {
        if (hl.widgets) {
            for (var hm = 0; hm < hl.widgets.length; ++hm) {
                var hk = hl.widgets[hm], hn = hk.node.parentNode;
                if (hn) {
                    hk.height = hn.offsetHeight
                }
            }
        }
    }

    function cs(hm, hq, hl) {
        var hn = hl && hl.top != null ? Math.max(0, hl.top) : hm.scroller.scrollTop;
        hn = Math.floor(hn - fU(hm));
        var i = hl && hl.bottom != null ? hl.bottom : hn + hm.wrapper.clientHeight;
        var ho = b0(hq, hn), hp = b0(hq, i);
        if (hl && hl.ensure) {
            var hk = hl.ensure.from.line, hr = hl.ensure.to.line;
            if (hk < ho) {
                ho = hk;
                hp = b0(hq, b6(f0(hq, hk)) + hm.wrapper.clientHeight)
            } else {
                if (Math.min(hr, hq.lastLine()) >= hp) {
                    ho = b0(hq, b6(f0(hq, hr)) - hm.wrapper.clientHeight);
                    hp = hr
                }
            }
        }
        return {from: ho, to: Math.max(hp, ho + 1)}
    }

    function eF(hk, hm) {
        if (a2(hk, "scrollCursorIntoView")) {
            return
        }
        var ho = hk.display, hl = ho.sizer.getBoundingClientRect(), i = null;
        if (hm.top + hl.top < 0) {
            i = true
        } else {
            if (hm.bottom + hl.top > (window.innerHeight || document.documentElement.clientHeight)) {
                i = false
            }
        }
        if (i != null && !ge) {
            var hn = g0("div", "\u200b", null, ("position: absolute;\n                         top: " + (hm.top - ho.viewOffset - fU(hk.display)) + "px;\n                         height: " + (hm.bottom - hm.top + dl(hk) + ho.barHeight) + "px;\n                         left: " + (hm.left) + "px; width: " + (Math.max(2, hm.right - hm.left)) + "px;"));
            hk.display.lineSpace.appendChild(hn);
            hn.scrollIntoView(i);
            hk.display.lineSpace.removeChild(hn)
        }
    }

    function H(hu, hr, hn, hm) {
        if (hm == null) {
            hm = 0
        }
        var hs;
        if (!hu.options.lineWrapping && hr == hn) {
            hr = hr.ch ? ab(hr.line, hr.sticky == "before" ? hr.ch - 1 : hr.ch, "after") : hr;
            hn = hr.sticky == "before" ? ab(hr.line, hr.ch + 1, "before") : hr
        }
        for (var ho = 0; ho < 5; ho++) {
            var hp = false;
            var ht = er(hu, hr);
            var i = !hn || hn == hr ? ht : er(hu, hn);
            hs = {
                left: Math.min(ht.left, i.left),
                top: Math.min(ht.top, i.top) - hm,
                right: Math.max(ht.left, i.left),
                bottom: Math.max(ht.bottom, i.bottom) + hm
            };
            var hl = M(hu, hs);
            var hq = hu.doc.scrollTop, hk = hu.doc.scrollLeft;
            if (hl.scrollTop != null) {
                C(hu, hl.scrollTop);
                if (Math.abs(hu.doc.scrollTop - hq) > 1) {
                    hp = true
                }
            }
            if (hl.scrollLeft != null) {
                bX(hu, hl.scrollLeft);
                if (Math.abs(hu.doc.scrollLeft - hk) > 1) {
                    hp = true
                }
            }
            if (!hp) {
                break
            }
        }
        return hs
    }

    function I(i, hk) {
        var hl = M(i, hk);
        if (hl.scrollTop != null) {
            C(i, hl.scrollTop)
        }
        if (hl.scrollLeft != null) {
            bX(i, hl.scrollLeft)
        }
    }

    function M(hs, hr) {
        var hp = hs.display, hn = a9(hs.display);
        if (hr.top < 0) {
            hr.top = 0
        }
        var hl = hs.curOp && hs.curOp.scrollTop != null ? hs.curOp.scrollTop : hp.scroller.scrollTop;
        var hv = dn(hs), hx = {};
        if (hr.bottom - hr.top > hv) {
            hr.bottom = hr.top + hv
        }
        var hk = hs.doc.height + b1(hp);
        var i = hr.top < hn, ho = hr.bottom > hk - hn;
        if (hr.top < hl) {
            hx.scrollTop = i ? 0 : hr.top
        } else {
            if (hr.bottom > hl + hv) {
                var hq = Math.min(hr.top, (ho ? hk : hr.bottom) - hv);
                if (hq != hl) {
                    hx.scrollTop = hq
                }
            }
        }
        var hu = hs.options.fixedGutter ? 0 : hp.gutters.offsetWidth;
        var hw = hs.curOp && hs.curOp.scrollLeft != null ? hs.curOp.scrollLeft : hp.scroller.scrollLeft - hu;
        var ht = dS(hs) - hp.gutters.offsetWidth;
        var hm = hr.right - hr.left > ht;
        if (hm) {
            hr.right = hr.left + ht
        }
        if (hr.left < 10) {
            hx.scrollLeft = 0
        } else {
            if (hr.left < hw) {
                hx.scrollLeft = Math.max(0, hr.left + hu - (hm ? 0 : 10))
            } else {
                if (hr.right > ht + hw - 3) {
                    hx.scrollLeft = hr.right + (hm ? 0 : 10) - ht
                }
            }
        }
        return hx
    }

    function c9(i, hk) {
        if (hk == null) {
            return
        }
        gp(i);
        i.curOp.scrollTop = (i.curOp.scrollTop == null ? i.doc.scrollTop : i.curOp.scrollTop) + hk
    }

    function gs(i) {
        gp(i);
        var hk = i.getCursor();
        i.curOp.scrollToPos = {from: hk, to: hk, margin: i.options.cursorScrollMargin}
    }

    function fu(hk, i, hl) {
        if (i != null || hl != null) {
            gp(hk)
        }
        if (i != null) {
            hk.curOp.scrollLeft = i
        }
        if (hl != null) {
            hk.curOp.scrollTop = hl
        }
    }

    function cA(i, hk) {
        gp(i);
        i.curOp.scrollToPos = hk
    }

    function gp(i) {
        var hk = i.curOp.scrollToPos;
        if (hk) {
            i.curOp.scrollToPos = null;
            var hm = eb(i, hk.from), hl = eb(i, hk.to);
            ca(i, hm, hl, hk.margin)
        }
    }

    function ca(i, hn, hm, hl) {
        var hk = M(i, {
            left: Math.min(hn.left, hm.left),
            top: Math.min(hn.top, hm.top) - hl,
            right: Math.max(hn.right, hm.right),
            bottom: Math.max(hn.bottom, hm.bottom) + hl
        });
        fu(i, hk.scrollLeft, hk.scrollTop)
    }

    function C(i, hk) {
        if (Math.abs(i.doc.scrollTop - hk) < 2) {
            return
        }
        if (!cP) {
            eq(i, {top: hk})
        }
        T(i, hk, true);
        if (cP) {
            eq(i)
        }
        eO(i, 100)
    }

    function T(i, hl, hk) {
        hl = Math.max(0, Math.min(i.display.scroller.scrollHeight - i.display.scroller.clientHeight, hl));
        if (i.display.scroller.scrollTop == hl && !hk) {
            return
        }
        i.doc.scrollTop = hl;
        i.display.scrollbars.setScrollTop(hl);
        if (i.display.scroller.scrollTop != hl) {
            i.display.scroller.scrollTop = hl
        }
    }

    function bX(i, hm, hl, hk) {
        hm = Math.max(0, Math.min(hm, i.display.scroller.scrollWidth - i.display.scroller.clientWidth));
        if ((hl ? hm == i.doc.scrollLeft : Math.abs(i.doc.scrollLeft - hm) < 2) && !hk) {
            return
        }
        i.doc.scrollLeft = hm;
        fk(i);
        if (i.display.scroller.scrollLeft != hm) {
            i.display.scroller.scrollLeft = hm
        }
        i.display.scrollbars.setScrollLeft(hm)
    }

    function d5(i) {
        var hm = i.display, hl = hm.gutters.offsetWidth;
        var hk = Math.round(i.doc.height + b1(i.display));
        return {
            clientHeight: hm.scroller.clientHeight,
            viewHeight: hm.wrapper.clientHeight,
            scrollWidth: hm.scroller.scrollWidth,
            clientWidth: hm.scroller.clientWidth,
            viewWidth: hm.wrapper.clientWidth,
            barLeft: i.options.fixedGutter ? hl : 0,
            docHeight: hk,
            scrollHeight: hk + dl(i) + hm.barHeight,
            nativeBarWidth: hm.nativeBarWidth,
            gutterWidth: hl
        }
    }

    var dR = function (hl, hk, i) {
        this.cm = i;
        var hm = this.vert = g0("div", [g0("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
        var hn = this.horiz = g0("div", [g0("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        hm.tabIndex = hn.tabIndex = -1;
        hl(hm);
        hl(hn);
        ci(hm, "scroll", function () {
            if (hm.clientHeight) {
                hk(hm.scrollTop, "vertical")
            }
        });
        ci(hn, "scroll", function () {
            if (hn.clientWidth) {
                hk(hn.scrollLeft, "horizontal")
            }
        });
        this.checkedZeroWidth = false;
        if (ef && n < 8) {
            this.horiz.style.minHeight = this.vert.style.minWidth = "18px"
        }
    };
    dR.prototype.update = function (hm) {
        var hn = hm.scrollWidth > hm.clientWidth + 1;
        var hl = hm.scrollHeight > hm.clientHeight + 1;
        var ho = hm.nativeBarWidth;
        if (hl) {
            this.vert.style.display = "block";
            this.vert.style.bottom = hn ? ho + "px" : "0";
            var hk = hm.viewHeight - (hn ? ho : 0);
            this.vert.firstChild.style.height = Math.max(0, hm.scrollHeight - hm.clientHeight + hk) + "px"
        } else {
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0"
        }
        if (hn) {
            this.horiz.style.display = "block";
            this.horiz.style.right = hl ? ho + "px" : "0";
            this.horiz.style.left = hm.barLeft + "px";
            var i = hm.viewWidth - hm.barLeft - (hl ? ho : 0);
            this.horiz.firstChild.style.width = Math.max(0, hm.scrollWidth - hm.clientWidth + i) + "px"
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0"
        }
        if (!this.checkedZeroWidth && hm.clientHeight > 0) {
            if (ho == 0) {
                this.zeroWidthHack()
            }
            this.checkedZeroWidth = true
        }
        return {right: hl ? ho : 0, bottom: hn ? ho : 0}
    };
    dR.prototype.setScrollLeft = function (i) {
        if (this.horiz.scrollLeft != i) {
            this.horiz.scrollLeft = i
        }
        if (this.disableHoriz) {
            this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz")
        }
    };
    dR.prototype.setScrollTop = function (i) {
        if (this.vert.scrollTop != i) {
            this.vert.scrollTop = i
        }
        if (this.disableVert) {
            this.enableZeroWidthBar(this.vert, this.disableVert, "vert")
        }
    };
    dR.prototype.zeroWidthHack = function () {
        var i = ct && !dB ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = i;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new hj;
        this.disableVert = new hj
    };
    dR.prototype.enableZeroWidthBar = function (hl, i, hk) {
        hl.style.pointerEvents = "auto";

        function hm() {
            var ho = hl.getBoundingClientRect();
            var hn = hk == "vert" ? document.elementFromPoint(ho.right - 1, (ho.top + ho.bottom) / 2) : document.elementFromPoint((ho.right + ho.left) / 2, ho.bottom - 1);
            if (hn != hl) {
                hl.style.pointerEvents = "none"
            } else {
                i.set(1000, hm)
            }
        }

        i.set(1000, hm)
    };
    dR.prototype.clear = function () {
        var i = this.horiz.parentNode;
        i.removeChild(this.horiz);
        i.removeChild(this.vert)
    };
    var fP = function () {
    };
    fP.prototype.update = function () {
        return {bottom: 0, right: 0}
    };
    fP.prototype.setScrollLeft = function () {
    };
    fP.prototype.setScrollTop = function () {
    };
    fP.prototype.clear = function () {
    };

    function fJ(hm, ho) {
        if (!ho) {
            ho = d5(hm)
        }
        var hl = hm.display.barWidth, hk = hm.display.barHeight;
        a5(hm, ho);
        for (var hn = 0; hn < 4 && hl != hm.display.barWidth || hk != hm.display.barHeight; hn++) {
            if (hl != hm.display.barWidth && hm.options.lineWrapping) {
                bl(hm)
            }
            a5(hm, d5(hm));
            hl = hm.display.barWidth;
            hk = hm.display.barHeight
        }
    }

    function a5(i, hk) {
        var hm = i.display;
        var hl = hm.scrollbars.update(hk);
        hm.sizer.style.paddingRight = (hm.barWidth = hl.right) + "px";
        hm.sizer.style.paddingBottom = (hm.barHeight = hl.bottom) + "px";
        hm.heightForcer.style.borderBottom = hl.bottom + "px solid transparent";
        if (hl.right && hl.bottom) {
            hm.scrollbarFiller.style.display = "block";
            hm.scrollbarFiller.style.height = hl.bottom + "px";
            hm.scrollbarFiller.style.width = hl.right + "px"
        } else {
            hm.scrollbarFiller.style.display = ""
        }
        if (hl.bottom && i.options.coverGutterNextToScrollbar && i.options.fixedGutter) {
            hm.gutterFiller.style.display = "block";
            hm.gutterFiller.style.height = hl.bottom + "px";
            hm.gutterFiller.style.width = hk.gutterWidth + "px"
        } else {
            hm.gutterFiller.style.display = ""
        }
    }

    var bz = {"native": dR, "null": fP};

    function aL(i) {
        if (i.display.scrollbars) {
            i.display.scrollbars.clear();
            if (i.display.scrollbars.addClass) {
                h(i.display.wrapper, i.display.scrollbars.addClass)
            }
        }
        i.display.scrollbars = new bz[i.options.scrollbarStyle](function (hk) {
            i.display.wrapper.insertBefore(hk, i.display.scrollbarFiller);
            ci(hk, "mousedown", function () {
                if (i.state.focused) {
                    setTimeout(function () {
                        return i.display.input.focus()
                    }, 0)
                }
            });
            hk.setAttribute("cm-not-content", "true")
        }, function (hl, hk) {
            if (hk == "horizontal") {
                bX(i, hl)
            } else {
                C(i, hl)
            }
        }, i);
        if (i.display.scrollbars.addClass) {
            gn(i.display.wrapper, i.display.scrollbars.addClass)
        }
    }

    var eJ = 0;

    function db(i) {
        i.curOp = {
            cm: i,
            viewChanged: false,
            startHeight: i.doc.height,
            forceUpdate: false,
            updateInput: 0,
            typing: false,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: false,
            updateMaxLine: false,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: false,
            id: ++eJ
        };
        fc(i.curOp)
    }

    function av(i) {
        var hk = i.curOp;
        if (hk) {
            cj(hk, function (hm) {
                for (var hl = 0; hl < hm.ops.length; hl++) {
                    hm.ops[hl].cm.curOp = null
                }
                de(hm)
            })
        }
    }

    function de(hp) {
        var hl = hp.ops;
        for (var hk = 0; hk < hl.length; hk++) {
            cr(hl[hk])
        }
        for (var hq = 0; hq < hl.length; hq++) {
            ay(hl[hq])
        }
        for (var ho = 0; ho < hl.length; ho++) {
            cn(hl[ho])
        }
        for (var hn = 0; hn < hl.length; hn++) {
            ax(hl[hn])
        }
        for (var hm = 0; hm < hl.length; hm++) {
            fL(hl[hm])
        }
    }

    function cr(hl) {
        var i = hl.cm, hk = i.display;
        O(i);
        if (hl.updateMaxLine) {
            f(i)
        }
        hl.mustUpdate = hl.viewChanged || hl.forceUpdate || hl.scrollTop != null || hl.scrollToPos && (hl.scrollToPos.from.line < hk.viewFrom || hl.scrollToPos.to.line >= hk.viewTo) || hk.maxLineChanged && i.options.lineWrapping;
        hl.update = hl.mustUpdate && new aT(i, hl.mustUpdate && {
            top: hl.scrollTop,
            ensure: hl.scrollToPos
        }, hl.forceUpdate)
    }

    function ay(i) {
        i.updatedDisplay = i.mustUpdate && F(i.cm, i.update)
    }

    function cn(hl) {
        var i = hl.cm, hk = i.display;
        if (hl.updatedDisplay) {
            bl(i)
        }
        hl.barMeasure = d5(i);
        if (hk.maxLineChanged && !i.options.lineWrapping) {
            hl.adjustWidthTo = eR(i, hk.maxLine, hk.maxLine.text.length).left + 3;
            i.display.sizerWidth = hl.adjustWidthTo;
            hl.barMeasure.scrollWidth = Math.max(hk.scroller.clientWidth, hk.sizer.offsetLeft + hl.adjustWidthTo + dl(i) + i.display.barWidth);
            hl.maxScrollLeft = Math.max(0, hk.sizer.offsetLeft + hl.adjustWidthTo - dS(i))
        }
        if (hl.updatedDisplay || hl.selectionChanged) {
            hl.preparedSelection = hk.input.prepareSelection()
        }
    }

    function ax(hl) {
        var i = hl.cm;
        if (hl.adjustWidthTo != null) {
            i.display.sizer.style.minWidth = hl.adjustWidthTo + "px";
            if (hl.maxScrollLeft < i.doc.scrollLeft) {
                bX(i, Math.min(i.display.scroller.scrollLeft, hl.maxScrollLeft), true)
            }
            i.display.maxLineChanged = false
        }
        var hk = hl.focus && hl.focus == ej();
        if (hl.preparedSelection) {
            i.display.input.showSelection(hl.preparedSelection, hk)
        }
        if (hl.updatedDisplay || hl.startHeight != i.doc.height) {
            fJ(i, hl.barMeasure)
        }
        if (hl.updatedDisplay) {
            d4(i, hl.barMeasure)
        }
        if (hl.selectionChanged) {
            r(i)
        }
        if (i.state.focused && hl.updateInput) {
            i.display.input.reset(hl.typing)
        }
        if (hk) {
            u(hl.cm)
        }
    }

    function fL(hn) {
        var hs = hn.cm, hp = hs.display, hr = hs.doc;
        if (hn.updatedDisplay) {
            cI(hs, hn.update)
        }
        if (hp.wheelStartX != null && (hn.scrollTop != null || hn.scrollLeft != null || hn.scrollToPos)) {
            hp.wheelStartX = hp.wheelStartY = null
        }
        if (hn.scrollTop != null) {
            T(hs, hn.scrollTop, hn.forceScroll)
        }
        if (hn.scrollLeft != null) {
            bX(hs, hn.scrollLeft, true, true)
        }
        if (hn.scrollToPos) {
            var hq = H(hs, gy(hr, hn.scrollToPos.from), gy(hr, hn.scrollToPos.to), hn.scrollToPos.margin);
            eF(hs, hq)
        }
        var ho = hn.maybeHiddenMarkers, hk = hn.maybeUnhiddenMarkers;
        if (ho) {
            for (var hm = 0; hm < ho.length; ++hm) {
                if (!ho[hm].lines.length) {
                    aN(ho[hm], "hide")
                }
            }
        }
        if (hk) {
            for (var hl = 0; hl < hk.length; ++hl) {
                if (hk[hl].lines.length) {
                    aN(hk[hl], "unhide")
                }
            }
        }
        if (hp.wrapper.offsetHeight) {
            hr.scrollTop = hs.display.scroller.scrollTop
        }
        if (hn.changeObjs) {
            aN(hs, "changes", hs, hn.changeObjs)
        }
        if (hn.update) {
            hn.update.finish()
        }
    }

    function df(i, hk) {
        if (i.curOp) {
            return hk()
        }
        db(i);
        try {
            return hk()
        } finally {
            av(i)
        }
    }

    function du(i, hk) {
        return function () {
            if (i.curOp) {
                return hk.apply(i, arguments)
            }
            db(i);
            try {
                return hk.apply(i, arguments)
            } finally {
                av(i)
            }
        }
    }

    function dE(i) {
        return function () {
            if (this.curOp) {
                return i.apply(this, arguments)
            }
            db(this);
            try {
                return i.apply(this, arguments)
            } finally {
                av(this)
            }
        }
    }

    function c5(i) {
        return function () {
            var hk = this.cm;
            if (!hk || hk.curOp) {
                return i.apply(this, arguments)
            }
            db(hk);
            try {
                return i.apply(this, arguments)
            } finally {
                av(hk)
            }
        }
    }

    function eO(i, hk) {
        if (i.doc.highlightFrontier < i.display.viewTo) {
            i.state.highlight.set(hk, cW(dj, i))
        }
    }

    function dj(i) {
        var hn = i.doc;
        if (hn.highlightFrontier >= i.display.viewTo) {
            return
        }
        var hl = +new Date + i.options.workTime;
        var hm = fH(i, hn.highlightFrontier);
        var hk = [];
        hn.iter(hm.line, Math.min(hn.first + hn.size, i.display.viewTo + 500), function (hp) {
            if (hm.line >= i.display.viewFrom) {
                var hs = hp.styles;
                var ho = hp.text.length > i.options.maxHighlightLength ? cp(hn.mode, hm.state) : null;
                var hu = gk(i, hp, hm, true);
                if (ho) {
                    hm.state = ho
                }
                hp.styles = hu.styles;
                var hr = hp.styleClasses, ht = hu.classes;
                if (ht) {
                    hp.styleClasses = ht
                } else {
                    if (hr) {
                        hp.styleClasses = null
                    }
                }
                var hv = !hs || hs.length != hp.styles.length || hr != ht && (!hr || !ht || hr.bgClass != ht.bgClass || hr.textClass != ht.textClass);
                for (var hq = 0; !hv && hq < hs.length; ++hq) {
                    hv = hs[hq] != hp.styles[hq]
                }
                if (hv) {
                    hk.push(hm.line)
                }
                hp.stateAfter = hm.save();
                hm.nextLine()
            } else {
                if (hp.text.length <= i.options.maxHighlightLength) {
                    d3(i, hp.text, hm)
                }
                hp.stateAfter = hm.line % 5 == 0 ? hm.save() : null;
                hm.nextLine()
            }
            if (+new Date > hl) {
                eO(i, i.options.workDelay);
                return true
            }
        });
        hn.highlightFrontier = hm.line;
        hn.modeFrontier = Math.max(hn.modeFrontier, hm.line);
        if (hk.length) {
            df(i, function () {
                for (var ho = 0; ho < hk.length; ho++) {
                    W(i, hk[ho], "text")
                }
            })
        }
    }

    var aT = function (hk, i, hl) {
        var hm = hk.display;
        this.viewport = i;
        this.visible = cs(hm, hk.doc, i);
        this.editorIsHidden = !hm.wrapper.offsetWidth;
        this.wrapperHeight = hm.wrapper.clientHeight;
        this.wrapperWidth = hm.wrapper.clientWidth;
        this.oldDisplayWidth = dS(hk);
        this.force = hl;
        this.dims = fY(hk);
        this.events = []
    };
    aT.prototype.signal = function (hk, i) {
        if (f5(hk, i)) {
            this.events.push(arguments)
        }
    };
    aT.prototype.finish = function () {
        for (var hk = 0; hk < this.events.length; hk++) {
            aN.apply(null, this.events[hk])
        }
    };

    function O(i) {
        var hk = i.display;
        if (!hk.scrollbarsClipped && hk.scroller.offsetWidth) {
            hk.nativeBarWidth = hk.scroller.offsetWidth - hk.scroller.clientWidth;
            hk.heightForcer.style.height = dl(i) + "px";
            hk.sizer.style.marginBottom = -hk.nativeBarWidth + "px";
            hk.sizer.style.borderRightWidth = dl(i) + "px";
            hk.scrollbarsClipped = true
        }
    }

    function bB(hk) {
        if (hk.hasFocus()) {
            return null
        }
        var hm = ej();
        if (!hm || !ha(hk.display.lineDiv, hm)) {
            return null
        }
        var i = {activeElt: hm};
        if (window.getSelection) {
            var hl = window.getSelection();
            if (hl.anchorNode && hl.extend && ha(hk.display.lineDiv, hl.anchorNode)) {
                i.anchorNode = hl.anchorNode;
                i.anchorOffset = hl.anchorOffset;
                i.focusNode = hl.focusNode;
                i.focusOffset = hl.focusOffset
            }
        }
        return i
    }

    function j(hk) {
        if (!hk || !hk.activeElt || hk.activeElt == ej()) {
            return
        }
        hk.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(hk.activeElt.nodeName) && hk.anchorNode && ha(document.body, hk.anchorNode) && ha(document.body, hk.focusNode)) {
            var hl = window.getSelection(), i = document.createRange();
            i.setEnd(hk.anchorNode, hk.anchorOffset);
            i.collapse(false);
            hl.removeAllRanges();
            hl.addRange(i);
            hl.extend(hk.focusNode, hk.focusOffset)
        }
    }

    function F(hs, hm) {
        var hn = hs.display, hr = hs.doc;
        if (hm.editorIsHidden) {
            fa(hs);
            return false
        }
        if (!hm.force && hm.visible.from >= hn.viewFrom && hm.visible.to <= hn.viewTo && (hn.updateLineNumbers == null || hn.updateLineNumbers >= hn.viewTo) && hn.renderedView == hn.view && dI(hs) == 0) {
            return false
        }
        if (eD(hs)) {
            fa(hs);
            hm.dims = fY(hs)
        }
        var hl = hr.first + hr.size;
        var hp = Math.max(hm.visible.from - hs.options.viewportMargin, hr.first);
        var hq = Math.min(hl, hm.visible.to + hs.options.viewportMargin);
        if (hn.viewFrom < hp && hp - hn.viewFrom < 20) {
            hp = Math.max(hr.first, hn.viewFrom)
        }
        if (hn.viewTo > hq && hn.viewTo - hq < 20) {
            hq = Math.min(hl, hn.viewTo)
        }
        if (bj) {
            hp = a7(hs.doc, hp);
            hq = eC(hs.doc, hq)
        }
        var hk = hp != hn.viewFrom || hq != hn.viewTo || hn.lastWrapHeight != hm.wrapperHeight || hn.lastWrapWidth != hm.wrapperWidth;
        dk(hs, hp, hq);
        hn.viewOffset = b6(f0(hs.doc, hn.viewFrom));
        hs.display.mover.style.top = hn.viewOffset + "px";
        var i = dI(hs);
        if (!hk && i == 0 && !hm.force && hn.renderedView == hn.view && (hn.updateLineNumbers == null || hn.updateLineNumbers >= hn.viewTo)) {
            return false
        }
        var ho = bB(hs);
        if (i > 4) {
            hn.lineDiv.style.display = "none"
        }
        cL(hs, hn.updateLineNumbers, hm.dims);
        if (i > 4) {
            hn.lineDiv.style.display = ""
        }
        hn.renderedView = hn.view;
        j(ho);
        eA(hn.cursorDiv);
        eA(hn.selectionDiv);
        hn.gutters.style.height = hn.sizer.style.minHeight = 0;
        if (hk) {
            hn.lastWrapHeight = hm.wrapperHeight;
            hn.lastWrapWidth = hm.wrapperWidth;
            eO(hs, 400)
        }
        hn.updateLineNumbers = null;
        return true
    }

    function cI(hk, hn) {
        var i = hn.viewport;
        for (var hm = true; ; hm = false) {
            if (!hm || !hk.options.lineWrapping || hn.oldDisplayWidth == dS(hk)) {
                if (i && i.top != null) {
                    i = {top: Math.min(hk.doc.height + b1(hk.display) - dn(hk), i.top)}
                }
                hn.visible = cs(hk.display, hk.doc, i);
                if (hn.visible.from >= hk.display.viewFrom && hn.visible.to <= hk.display.viewTo) {
                    break
                }
            } else {
                if (hm) {
                    hn.visible = cs(hk.display, hk.doc, i)
                }
            }
            if (!F(hk, hn)) {
                break
            }
            bl(hk);
            var hl = d5(hk);
            bV(hk);
            fJ(hk, hl);
            d4(hk, hl);
            hn.force = false
        }
        hn.signal(hk, "update", hk);
        if (hk.display.viewFrom != hk.display.reportedViewFrom || hk.display.viewTo != hk.display.reportedViewTo) {
            hn.signal(hk, "viewportChange", hk, hk.display.viewFrom, hk.display.viewTo);
            hk.display.reportedViewFrom = hk.display.viewFrom;
            hk.display.reportedViewTo = hk.display.viewTo
        }
    }

    function eq(hk, i) {
        var hm = new aT(hk, i);
        if (F(hk, hm)) {
            bl(hk);
            cI(hk, hm);
            var hl = d5(hk);
            bV(hk);
            fJ(hk, hl);
            d4(hk, hl);
            hm.finish()
        }
    }

    function cL(hv, hm, hu) {
        var hr = hv.display, hx = hv.options.lineNumbers;
        var hk = hr.lineDiv, hw = hk.firstChild;

        function hq(hy) {
            var i = hy.nextSibling;
            if (dt && ct && hv.display.currentWheelTarget == hy) {
                hy.style.display = "none"
            } else {
                hy.parentNode.removeChild(hy)
            }
            return i
        }

        var hs = hr.view, hp = hr.viewFrom;
        for (var hn = 0; hn < hs.length; hn++) {
            var ho = hs[hn];
            if (ho.hidden) {
            } else {
                if (!ho.node || ho.node.parentNode != hk) {
                    var hl = aO(hv, ho, hp, hu);
                    hk.insertBefore(hl, hw)
                } else {
                    while (hw != ho.node) {
                        hw = hq(hw)
                    }
                    var ht = hx && hm != null && hm <= hp && ho.lineNumber;
                    if (ho.changes) {
                        if (dP(ho.changes, "gutter") > -1) {
                            ht = false
                        }
                        ai(hv, ho, hp, hu)
                    }
                    if (ht) {
                        eA(ho.lineNumber);
                        ho.lineNumber.appendChild(document.createTextNode(e5(hv.options, hp)))
                    }
                    hw = ho.node.nextSibling
                }
            }
            hp += ho.size
        }
        while (hw) {
            hw = hq(hw)
        }
    }

    function dx(hk) {
        var i = hk.gutters.offsetWidth;
        hk.sizer.style.marginLeft = i + "px"
    }

    function d4(i, hk) {
        i.display.sizer.style.minHeight = hk.docHeight + "px";
        i.display.heightForcer.style.top = hk.docHeight + "px";
        i.display.gutters.style.height = (hk.docHeight + i.display.barHeight + dl(i)) + "px"
    }

    function fk(hs) {
        var hq = hs.display, hr = hq.view;
        if (!hq.alignWidgets && (!hq.gutters.firstChild || !hs.options.fixedGutter)) {
            return
        }
        var ho = ev(hq) - hq.scroller.scrollLeft + hs.doc.scrollLeft;
        var hk = hq.gutters.offsetWidth, hl = ho + "px";
        for (var hn = 0; hn < hr.length; hn++) {
            if (!hr[hn].hidden) {
                if (hs.options.fixedGutter) {
                    if (hr[hn].gutter) {
                        hr[hn].gutter.style.left = hl
                    }
                    if (hr[hn].gutterBackground) {
                        hr[hn].gutterBackground.style.left = hl
                    }
                }
                var hp = hr[hn].alignable;
                if (hp) {
                    for (var hm = 0; hm < hp.length; hm++) {
                        hp[hm].style.left = hl
                    }
                }
            }
        }
        if (hs.options.fixedGutter) {
            hq.gutters.style.left = (ho + hk) + "px"
        }
    }

    function eD(i) {
        if (!i.options.lineNumbers) {
            return false
        }
        var ho = i.doc, hk = e5(i.options, ho.first + ho.size - 1), hn = i.display;
        if (hk.length != hn.lineNumChars) {
            var hp = hn.measure.appendChild(g0("div", [g0("div", hk)], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var hl = hp.firstChild.offsetWidth, hm = hp.offsetWidth - hl;
            hn.lineGutter.style.width = "";
            hn.lineNumInnerWidth = Math.max(hl, hn.lineGutter.offsetWidth - hm) + 1;
            hn.lineNumWidth = hn.lineNumInnerWidth + hm;
            hn.lineNumChars = hn.lineNumInnerWidth ? hk.length : -1;
            hn.lineGutter.style.width = hn.lineNumWidth + "px";
            dx(i.display);
            return true
        }
        return false
    }

    function bd(hn, hl) {
        var hk = [], hm = false;
        for (var hp = 0; hp < hn.length; hp++) {
            var ho = hn[hp], hq = null;
            if (typeof ho != "string") {
                hq = ho.style;
                ho = ho.className
            }
            if (ho == "CodeMirror-linenumbers") {
                if (!hl) {
                    continue
                } else {
                    hm = true
                }
            }
            hk.push({className: ho, style: hq})
        }
        if (hl && !hm) {
            hk.push({className: "CodeMirror-linenumbers", style: null})
        }
        return hk
    }

    function m(hp) {
        var hk = hp.gutters, hr = hp.gutterSpecs;
        eA(hk);
        hp.lineGutter = null;
        for (var hl = 0; hl < hr.length; ++hl) {
            var ho = hr[hl];
            var hn = ho.className;
            var hm = ho.style;
            var hq = hk.appendChild(g0("div", null, "CodeMirror-gutter " + hn));
            if (hm) {
                hq.style.cssText = hm
            }
            if (hn == "CodeMirror-linenumbers") {
                hp.lineGutter = hq;
                hq.style.width = (hp.lineNumWidth || 1) + "px"
            }
        }
        hk.style.display = hr.length ? "" : "none";
        dx(hp)
    }

    function eM(i) {
        m(i.display);
        ao(i);
        fk(i)
    }

    function fo(hk, hn, hl, hm) {
        var ho = this;
        this.input = hl;
        ho.scrollbarFiller = g0("div", null, "CodeMirror-scrollbar-filler");
        ho.scrollbarFiller.setAttribute("cm-not-content", "true");
        ho.gutterFiller = g0("div", null, "CodeMirror-gutter-filler");
        ho.gutterFiller.setAttribute("cm-not-content", "true");
        ho.lineDiv = g6("div", null, "CodeMirror-code");
        ho.selectionDiv = g0("div", null, null, "position: relative; z-index: 1");
        ho.cursorDiv = g0("div", null, "CodeMirror-cursors");
        ho.measure = g0("div", null, "CodeMirror-measure");
        ho.lineMeasure = g0("div", null, "CodeMirror-measure");
        ho.lineSpace = g6("div", [ho.measure, ho.lineMeasure, ho.selectionDiv, ho.cursorDiv, ho.lineDiv], null, "position: relative; outline: none");
        var i = g6("div", [ho.lineSpace], "CodeMirror-lines");
        ho.mover = g0("div", [i], null, "position: relative");
        ho.sizer = g0("div", [ho.mover], "CodeMirror-sizer");
        ho.sizerWidth = null;
        ho.heightForcer = g0("div", null, null, "position: absolute; height: " + ed + "px; width: 1px;");
        ho.gutters = g0("div", null, "CodeMirror-gutters");
        ho.lineGutter = null;
        ho.scroller = g0("div", [ho.sizer, ho.heightForcer, ho.gutters], "CodeMirror-scroll");
        ho.scroller.setAttribute("tabIndex", "-1");
        ho.wrapper = g0("div", [ho.scrollbarFiller, ho.gutterFiller, ho.scroller], "CodeMirror");
        if (ef && n < 8) {
            ho.gutters.style.zIndex = -1;
            ho.scroller.style.paddingRight = 0
        }
        if (!dt && !(cP && eQ)) {
            ho.scroller.draggable = true
        }
        if (hk) {
            if (hk.appendChild) {
                hk.appendChild(ho.wrapper)
            } else {
                hk(ho.wrapper)
            }
        }
        ho.viewFrom = ho.viewTo = hn.first;
        ho.reportedViewFrom = ho.reportedViewTo = hn.first;
        ho.view = [];
        ho.renderedView = null;
        ho.externalMeasured = null;
        ho.viewOffset = 0;
        ho.lastWrapHeight = ho.lastWrapWidth = 0;
        ho.updateLineNumbers = null;
        ho.nativeBarWidth = ho.barHeight = ho.barWidth = 0;
        ho.scrollbarsClipped = false;
        ho.lineNumWidth = ho.lineNumInnerWidth = ho.lineNumChars = null;
        ho.alignWidgets = false;
        ho.cachedCharWidth = ho.cachedTextHeight = ho.cachedPaddingH = null;
        ho.maxLine = null;
        ho.maxLineLength = 0;
        ho.maxLineChanged = false;
        ho.wheelDX = ho.wheelDY = ho.wheelStartX = ho.wheelStartY = null;
        ho.shift = false;
        ho.selForContextMenu = null;
        ho.activeTouch = null;
        ho.gutterSpecs = bd(hm.gutters, hm.lineNumbers);
        m(ho);
        hl.init(ho)
    }

    var f7 = 0, cE = null;
    if (ef) {
        cE = -0.53
    } else {
        if (cP) {
            cE = 15
        } else {
            if (dJ) {
                cE = -0.7
            } else {
                if (aM) {
                    cE = -1 / 3
                }
            }
        }
    }

    function di(hl) {
        var hk = hl.wheelDeltaX, i = hl.wheelDeltaY;
        if (hk == null && hl.detail && hl.axis == hl.HORIZONTAL_AXIS) {
            hk = hl.detail
        }
        if (i == null && hl.detail && hl.axis == hl.VERTICAL_AXIS) {
            i = hl.detail
        } else {
            if (i == null) {
                i = hl.wheelDelta
            }
        }
        return {x: hk, y: i}
    }

    function aI(i) {
        var hk = di(i);
        hk.x *= cE;
        hk.y *= cE;
        return hk
    }

    function c(hu, ho) {
        var hw = di(ho), hy = hw.x, hx = hw.y;
        var hq = hu.display, ht = hq.scroller;
        var hn = ht.scrollWidth > ht.clientWidth;
        var hm = ht.scrollHeight > ht.clientHeight;
        if (!(hy && hn || hx && hm)) {
            return
        }
        if (hx && ct && dt) {
            outer:for (var hv = ho.target, hs = hq.view; hv != ht; hv = hv.parentNode) {
                for (var hl = 0; hl < hs.length; hl++) {
                    if (hs[hl].node == hv) {
                        hu.display.currentWheelTarget = hv;
                        break outer
                    }
                }
            }
        }
        if (hy && !cP && !eB && cE != null) {
            if (hx && hm) {
                C(hu, Math.max(0, ht.scrollTop + hx * cE))
            }
            bX(hu, Math.max(0, ht.scrollLeft + hy * cE));
            if (!hx || (hx && hm)) {
                c7(ho)
            }
            hq.wheelStartX = null;
            return
        }
        if (hx && cE != null) {
            var hk = hx * cE;
            var hr = hu.doc.scrollTop, hp = hr + hq.wrapper.clientHeight;
            if (hk < 0) {
                hr = Math.max(0, hr + hk - 50)
            } else {
                hp = Math.min(hu.doc.height, hp + hk + 50)
            }
            eq(hu, {top: hr, bottom: hp})
        }
        if (f7 < 20) {
            if (hq.wheelStartX == null) {
                hq.wheelStartX = ht.scrollLeft;
                hq.wheelStartY = ht.scrollTop;
                hq.wheelDX = hy;
                hq.wheelDY = hx;
                setTimeout(function () {
                    if (hq.wheelStartX == null) {
                        return
                    }
                    var i = ht.scrollLeft - hq.wheelStartX;
                    var hA = ht.scrollTop - hq.wheelStartY;
                    var hz = (hA && hq.wheelDY && hA / hq.wheelDY) || (i && hq.wheelDX && i / hq.wheelDX);
                    hq.wheelStartX = hq.wheelStartY = null;
                    if (!hz) {
                        return
                    }
                    cE = (cE * f7 + hz) / (f7 + 1);
                    ++f7
                }, 200)
            } else {
                hq.wheelDX += hy;
                hq.wheelDY += hx
            }
        }
    }

    var gZ = function (i, hk) {
        this.ranges = i;
        this.primIndex = hk
    };
    gZ.prototype.primary = function () {
        return this.ranges[this.primIndex]
    };
    gZ.prototype.equals = function (hk) {
        if (hk == this) {
            return true
        }
        if (hk.primIndex != this.primIndex || hk.ranges.length != this.ranges.length) {
            return false
        }
        for (var hm = 0; hm < this.ranges.length; hm++) {
            var hl = this.ranges[hm], hn = hk.ranges[hm];
            if (!ac(hl.anchor, hn.anchor) || !ac(hl.head, hn.head)) {
                return false
            }
        }
        return true
    };
    gZ.prototype.deepCopy = function () {
        var hk = [];
        for (var hl = 0; hl < this.ranges.length; hl++) {
            hk[hl] = new eu(cG(this.ranges[hl].anchor), cG(this.ranges[hl].head))
        }
        return new gZ(hk, this.primIndex)
    };
    gZ.prototype.somethingSelected = function () {
        for (var hk = 0; hk < this.ranges.length; hk++) {
            if (!this.ranges[hk].empty()) {
                return true
            }
        }
        return false
    };
    gZ.prototype.contains = function (hn, hk) {
        if (!hk) {
            hk = hn
        }
        for (var hm = 0; hm < this.ranges.length; hm++) {
            var hl = this.ranges[hm];
            if (cD(hk, hl.from()) >= 0 && cD(hn, hl.to()) <= 0) {
                return hm
            }
        }
        return -1
    };
    var eu = function (i, hk) {
        this.anchor = i;
        this.head = hk
    };
    eu.prototype.from = function () {
        return aA(this.anchor, this.head)
    };
    eu.prototype.to = function () {
        return bQ(this.anchor, this.head)
    };
    eu.prototype.empty = function () {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
    };

    function cX(hu, hk, ht) {
        var hp = hu && hu.options.selectionsMayTouch;
        var hm = hk[ht];
        hk.sort(function (hw, i) {
            return cD(hw.from(), i.from())
        });
        ht = dP(hk, hm);
        for (var ho = 1; ho < hk.length; ho++) {
            var hv = hk[ho], hl = hk[ho - 1];
            var hs = cD(hl.to(), hv.from());
            if (hp && !hv.empty() ? hs > 0 : hs >= 0) {
                var hr = aA(hl.from(), hv.from()), hq = bQ(hl.to(), hv.to());
                var hn = hl.empty() ? hv.from() == hv.head : hl.from() == hl.head;
                if (ho <= ht) {
                    --ht
                }
                hk.splice(--ho, 2, new eu(hn ? hq : hr, hn ? hr : hq))
            }
        }
        return new gZ(hk, ht)
    }

    function fA(i, hk) {
        return new gZ([new eu(i, hk || i)], 0)
    }

    function dq(i) {
        if (!i.text) {
            return i.to
        }
        return ab(i.from.line + i.text.length - 1, gt(i.text).length + (i.text.length == 1 ? i.from.ch : 0))
    }

    function cl(hm, hl) {
        if (cD(hm, hl.from) < 0) {
            return hm
        }
        if (cD(hm, hl.to) <= 0) {
            return dq(hl)
        }
        var i = hm.line + hl.text.length - (hl.to.line - hl.from.line) - 1, hk = hm.ch;
        if (hm.line == hl.to.line) {
            hk += dq(hl).ch - hl.to.ch
        }
        return ab(i, hk)
    }

    function f4(hn, ho) {
        var hl = [];
        for (var hm = 0; hm < hn.sel.ranges.length; hm++) {
            var hk = hn.sel.ranges[hm];
            hl.push(new eu(cl(hk.anchor, ho), cl(hk.head, ho)))
        }
        return cX(hn.cm, hl, hn.sel.primIndex)
    }

    function bM(hl, hk, i) {
        if (hl.line == hk.line) {
            return ab(i.line, hl.ch - hk.ch + i.ch)
        } else {
            return ab(i.line + (hl.line - hk.line), hl.ch)
        }
    }

    function am(hu, hr, hl) {
        var hm = [];
        var hk = ab(hu.first, 0), hv = hk;
        for (var ho = 0; ho < hr.length; ho++) {
            var hq = hr[ho];
            var ht = bM(hq.from, hk, hv);
            var hs = bM(dq(hq), hk, hv);
            hk = hq.to;
            hv = hs;
            if (hl == "around") {
                var hp = hu.sel.ranges[ho], hn = cD(hp.head, hp.anchor) < 0;
                hm[ho] = new eu(hn ? hs : ht, hn ? ht : hs)
            } else {
                hm[ho] = new eu(ht, ht)
            }
        }
        return new gZ(hm, hu.sel.primIndex)
    }

    function bJ(i) {
        i.doc.mode = gm(i.options, i.doc.modeOption);
        eX(i)
    }

    function eX(i) {
        i.doc.iter(function (hk) {
            if (hk.stateAfter) {
                hk.stateAfter = null
            }
            if (hk.styles) {
                hk.styles = null
            }
        });
        i.doc.modeFrontier = i.doc.highlightFrontier = i.doc.first;
        eO(i, 100);
        i.state.modeGen++;
        if (i.curOp) {
            ao(i)
        }
    }

    function eo(i, hk) {
        return hk.from.ch == 0 && hk.to.ch == 0 && gt(hk.text) == "" && (!i.cm || i.cm.options.wholeLineUpdateBefore)
    }

    function gj(hA, ht, hn, hr) {
        function hm(hB) {
            return hn ? hn[hB] : null
        }

        function hs(hB, hD, hC) {
            eZ(hB, hD, hC, hr);
            al(hB, "change", hB, ht)
        }

        function hx(hE, hC) {
            var hB = [];
            for (var hD = hE; hD < hC; ++hD) {
                hB.push(new g4(hv[hD], hm(hD), hr))
            }
            return hB
        }

        var hy = ht.from, hk = ht.to, hv = ht.text;
        var hu = f0(hA, hy.line), i = f0(hA, hk.line);
        var hl = gt(hv), hz = hm(hv.length - 1), hw = hk.line - hy.line;
        if (ht.full) {
            hA.insert(0, hx(0, hv.length));
            hA.remove(hv.length, hA.size - hv.length)
        } else {
            if (eo(hA, ht)) {
                var hq = hx(0, hv.length - 1);
                hs(i, i.text, hz);
                if (hw) {
                    hA.remove(hy.line, hw)
                }
                if (hq.length) {
                    hA.insert(hy.line, hq)
                }
            } else {
                if (hu == i) {
                    if (hv.length == 1) {
                        hs(hu, hu.text.slice(0, hy.ch) + hl + hu.text.slice(hk.ch), hz)
                    } else {
                        var hp = hx(1, hv.length - 1);
                        hp.push(new g4(hl + hu.text.slice(hk.ch), hz, hr));
                        hs(hu, hu.text.slice(0, hy.ch) + hv[0], hm(0));
                        hA.insert(hy.line + 1, hp)
                    }
                } else {
                    if (hv.length == 1) {
                        hs(hu, hu.text.slice(0, hy.ch) + hv[0] + i.text.slice(hk.ch), hm(0));
                        hA.remove(hy.line + 1, hw)
                    } else {
                        hs(hu, hu.text.slice(0, hy.ch) + hv[0], hm(0));
                        hs(i, hl + i.text.slice(hk.ch), hz);
                        var ho = hx(1, hv.length - 1);
                        if (hw > 1) {
                            hA.remove(hy.line + 1, hw - 1)
                        }
                        hA.insert(hy.line + 1, ho)
                    }
                }
            }
        }
        al(hA, "change", hA, ht)
    }

    function eG(hm, hl, hk) {
        function i(hs, hq, ho) {
            if (hs.linked) {
                for (var hp = 0; hp < hs.linked.length; ++hp) {
                    var hn = hs.linked[hp];
                    if (hn.doc == hq) {
                        continue
                    }
                    var hr = ho && hn.sharedHist;
                    if (hk && !hr) {
                        continue
                    }
                    hl(hn.doc, hr);
                    i(hn.doc, hs, hr)
                }
            }
        }

        i(hm, null, true)
    }

    function eL(i, hk) {
        if (hk.cm) {
            throw new Error("This document is already in use.")
        }
        i.doc = hk;
        hk.cm = i;
        ae(i);
        bJ(i);
        E(i);
        if (!i.options.lineWrapping) {
            f(i)
        }
        i.options.mode = hk.modeOption;
        ao(i)
    }

    function E(i) {
        (i.doc.direction == "rtl" ? gn : h)(i.display.lineDiv, "CodeMirror-rtl")
    }

    function ex(i) {
        df(i, function () {
            E(i);
            ao(i)
        })
    }

    function gM(i) {
        this.done = [];
        this.undone = [];
        this.undoDepth = Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = i || 1
    }

    function d2(i, hl) {
        var hk = {from: cG(hl.from), to: dq(hl), text: g2(i, hl.from, hl.to)};
        ck(i, hk, hl.from.line, hl.to.line + 1);
        eG(i, function (hm) {
            return ck(hm, hk, hl.from.line, hl.to.line + 1)
        }, true);
        return hk
    }

    function go(hk) {
        while (hk.length) {
            var i = gt(hk);
            if (i.ranges) {
                hk.pop()
            } else {
                break
            }
        }
    }

    function fv(hk, i) {
        if (i) {
            go(hk.done);
            return gt(hk.done)
        } else {
            if (hk.done.length && !gt(hk.done).ranges) {
                return gt(hk.done)
            } else {
                if (hk.done.length > 1 && !hk.done[hk.done.length - 2].ranges) {
                    hk.done.pop();
                    return gt(hk.done)
                }
            }
        }
    }

    function gB(hp, hn, i, hm) {
        var hl = hp.history;
        hl.undone.length = 0;
        var hk = +new Date, hq;
        var hr;
        if ((hl.lastOp == hm || hl.lastOrigin == hn.origin && hn.origin && ((hn.origin.charAt(0) == "+" && hl.lastModTime > hk - (hp.cm ? hp.cm.options.historyEventDelay : 500)) || hn.origin.charAt(0) == "*")) && (hq = fv(hl, hl.lastOp == hm))) {
            hr = gt(hq.changes);
            if (cD(hn.from, hn.to) == 0 && cD(hn.from, hr.to) == 0) {
                hr.to = dq(hn)
            } else {
                hq.changes.push(d2(hp, hn))
            }
        } else {
            var ho = gt(hl.done);
            if (!ho || !ho.ranges) {
                dh(hp.sel, hl.done)
            }
            hq = {changes: [d2(hp, hn)], generation: hl.generation};
            hl.done.push(hq);
            while (hl.done.length > hl.undoDepth) {
                hl.done.shift();
                if (!hl.done[0].ranges) {
                    hl.done.shift()
                }
            }
        }
        hl.done.push(i);
        hl.generation = ++hl.maxGeneration;
        hl.lastModTime = hl.lastSelTime = hk;
        hl.lastOp = hl.lastSelOp = hm;
        hl.lastOrigin = hl.lastSelOrigin = hn.origin;
        if (!hr) {
            aN(hp, "historyAdded")
        }
    }

    function bT(hn, i, hl, hm) {
        var hk = i.charAt(0);
        return hk == "*" || hk == "+" && hl.ranges.length == hm.ranges.length && hl.somethingSelected() == hm.somethingSelected() && new Date - hn.history.lastSelTime <= (hn.cm ? hn.cm.options.historyEventDelay : 500)
    }

    function hc(ho, hm, i, hl) {
        var hn = ho.history, hk = hl && hl.origin;
        if (i == hn.lastSelOp || (hk && hn.lastSelOrigin == hk && (hn.lastModTime == hn.lastSelTime && hn.lastOrigin == hk || bT(ho, hk, gt(hn.done), hm)))) {
            hn.done[hn.done.length - 1] = hm
        } else {
            dh(hm, hn.done)
        }
        hn.lastSelTime = +new Date;
        hn.lastSelOrigin = hk;
        hn.lastSelOp = i;
        if (hl && hl.clearRedo !== false) {
            go(hn.undone)
        }
    }

    function dh(hk, i) {
        var hl = gt(i);
        if (!(hl && hl.ranges && hl.equals(hk))) {
            i.push(hk)
        }
    }

    function ck(hk, ho, hn, hm) {
        var i = ho["spans_" + hk.id], hl = 0;
        hk.iter(Math.max(hk.first, hn), Math.min(hk.first + hk.size, hm), function (hp) {
            if (hp.markedSpans) {
                (i || (i = ho["spans_" + hk.id] = {}))[hl] = hp.markedSpans
            }
            ++hl
        })
    }

    function bx(hm) {
        if (!hm) {
            return null
        }
        var hk;
        for (var hl = 0; hl < hm.length; ++hl) {
            if (hm[hl].marker.explicitlyCleared) {
                if (!hk) {
                    hk = hm.slice(0, hl)
                }
            } else {
                if (hk) {
                    hk.push(hm[hl])
                }
            }
        }
        return !hk ? hm : hk.length ? hk : null
    }

    function cq(hn, ho) {
        var hm = ho["spans_" + hn.id];
        if (!hm) {
            return null
        }
        var hk = [];
        for (var hl = 0; hl < ho.text.length; ++hl) {
            hk.push(bx(hm[hl]))
        }
        return hk
    }

    function eI(hs, hq) {
        var hk = cq(hs, hq);
        var ht = eV(hs, hq);
        if (!hk) {
            return ht
        }
        if (!ht) {
            return hk
        }
        for (var hn = 0; hn < hk.length; ++hn) {
            var ho = hk[hn], hp = ht[hn];
            if (ho && hp) {
                spans:for (var hm = 0; hm < hp.length; ++hm) {
                    var hr = hp[hm];
                    for (var hl = 0; hl < ho.length; ++hl) {
                        if (ho[hl].marker == hr.marker) {
                            continue spans
                        }
                    }
                    ho.push(hr)
                }
            } else {
                if (hp) {
                    hk[hn] = hp
                }
            }
        }
        return hk
    }

    function b9(hv, hn, hu) {
        var hl = [];
        for (var hq = 0; hq < hv.length; ++hq) {
            var hm = hv[hq];
            if (hm.ranges) {
                hl.push(hu ? gZ.prototype.deepCopy.call(hm) : hm);
                continue
            }
            var hs = hm.changes, ht = [];
            hl.push({changes: ht});
            for (var hp = 0; hp < hs.length; ++hp) {
                var hr = hs[hp], ho = (void 0);
                ht.push({from: hr.from, to: hr.to, text: hr.text});
                if (hn) {
                    for (var hk in hr) {
                        if (ho = hk.match(/^spans_(\d+)$/)) {
                            if (dP(hn, Number(ho[1])) > -1) {
                                gt(ht)[hk] = hr[hk];
                                delete hr[hk]
                            }
                        }
                    }
                }
            }
        }
        return hl
    }

    function gf(hk, hn, i, ho) {
        if (ho) {
            var hm = hk.anchor;
            if (i) {
                var hl = cD(hn, hm) < 0;
                if (hl != (cD(i, hm) < 0)) {
                    hm = hn;
                    hn = i
                } else {
                    if (hl != (cD(hn, i) < 0)) {
                        hn = i
                    }
                }
            }
            return new eu(hm, hn)
        } else {
            return new eu(i || hn, hn)
        }
    }

    function gS(hm, hl, i, hk, hn) {
        if (hn == null) {
            hn = hm.cm && (hm.cm.display.shift || hm.extend)
        }
        cf(hm, new gZ([gf(hm.sel.primary(), hl, i, hn)], 0), hk)
    }

    function aE(hp, ho, hm) {
        var hl = [];
        var hq = hp.cm && (hp.cm.display.shift || hp.extend);
        for (var hn = 0; hn < hp.sel.ranges.length; hn++) {
            hl[hn] = gf(hp.sel.ranges[hn], ho[hn], null, hq)
        }
        var hk = cX(hp.cm, hl, hp.sel.primIndex);
        cf(hp, hk, hm)
    }

    function e(ho, hn, hl, hm) {
        var hk = ho.sel.ranges.slice(0);
        hk[hn] = hl;
        cf(ho, cX(ho.cm, hk, ho.sel.primIndex), hm)
    }

    function K(hm, hk, hl, i) {
        cf(hm, fA(hk, hl), i)
    }

    function b(hm, hk, i) {
        var hl = {
            ranges: hk.ranges, update: function (hn) {
                this.ranges = [];
                for (var ho = 0; ho < hn.length; ho++) {
                    this.ranges[ho] = new eu(gy(hm, hn[ho].anchor), gy(hm, hn[ho].head))
                }
            }, origin: i && i.origin
        };
        aN(hm, "beforeSelectionChange", hm, hl);
        if (hm.cm) {
            aN(hm.cm, "beforeSelectionChange", hm.cm, hl)
        }
        if (hl.ranges != hk.ranges) {
            return cX(hm.cm, hl.ranges, hl.ranges.length - 1)
        } else {
            return hk
        }
    }

    function fT(hn, hm, hk) {
        var i = hn.history.done, hl = gt(i);
        if (hl && hl.ranges) {
            i[i.length - 1] = hm;
            e1(hn, hm, hk)
        } else {
            cf(hn, hm, hk)
        }
    }

    function cf(hl, hk, i) {
        e1(hl, hk, i);
        hc(hl, hl.sel, hl.cm ? hl.cm.curOp.id : NaN, i)
    }

    function e1(hm, hl, hk) {
        if (f5(hm, "beforeSelectionChange") || hm.cm && f5(hm.cm, "beforeSelectionChange")) {
            hl = b(hm, hl, hk)
        }
        var i = hk && hk.bias || (cD(hl.primary().head, hm.sel.primary().head) < 0 ? -1 : 1);
        dD(hm, q(hm, hl, i, true));
        if (!(hk && hk.scroll === false) && hm.cm) {
            gs(hm.cm)
        }
    }

    function dD(hk, i) {
        if (i.equals(hk.sel)) {
            return
        }
        hk.sel = i;
        if (hk.cm) {
            hk.cm.curOp.updateInput = 1;
            hk.cm.curOp.selectionChanged = true;
            aa(hk.cm)
        }
        al(hk, "cursorActivity", hk)
    }

    function fb(i) {
        dD(i, q(i, i.sel, null, false))
    }

    function q(ht, hk, hq, hr) {
        var hn;
        for (var ho = 0; ho < hk.ranges.length; ho++) {
            var hp = hk.ranges[ho];
            var hl = hk.ranges.length == ht.sel.ranges.length && ht.sel.ranges[ho];
            var hs = cg(ht, hp.anchor, hl && hl.anchor, hq, hr);
            var hm = cg(ht, hp.head, hl && hl.head, hq, hr);
            if (hn || hs != hp.anchor || hm != hp.head) {
                if (!hn) {
                    hn = hk.ranges.slice(0, ho)
                }
                hn[ho] = new eu(hs, hm)
            }
        }
        return hn ? cX(ht.cm, hn, hk.primIndex) : hk
    }

    function fq(hw, ht, ho, hn, hr) {
        var hx = f0(hw, ht.line);
        if (hx.markedSpans) {
            for (var hp = 0; hp < hx.markedSpans.length; ++hp) {
                var hl = hx.markedSpans[hp], hm = hl.marker;
                var hk = ("selectLeft" in hm) ? !hm.selectLeft : hm.inclusiveLeft;
                var hv = ("selectRight" in hm) ? !hm.selectRight : hm.inclusiveRight;
                if ((hl.from == null || (hk ? hl.from <= ht.ch : hl.from < ht.ch)) && (hl.to == null || (hv ? hl.to >= ht.ch : hl.to > ht.ch))) {
                    if (hr) {
                        aN(hm, "beforeCursorEnter");
                        if (hm.explicitlyCleared) {
                            if (!hx.markedSpans) {
                                break
                            } else {
                                --hp;
                                continue
                            }
                        }
                    }
                    if (!hm.atomic) {
                        continue
                    }
                    if (ho) {
                        var hs = hm.find(hn < 0 ? 1 : -1), hu = (void 0);
                        if (hn < 0 ? hv : hk) {
                            hs = hg(hw, hs, -hn, hs && hs.line == ht.line ? hx : null)
                        }
                        if (hs && hs.line == ht.line && (hu = cD(hs, ho)) && (hn < 0 ? hu < 0 : hu > 0)) {
                            return fq(hw, hs, ht, hn, hr)
                        }
                    }
                    var hq = hm.find(hn < 0 ? -1 : 1);
                    if (hn < 0 ? hk : hv) {
                        hq = hg(hw, hq, hn, hq.line == ht.line ? hx : null)
                    }
                    return hq ? fq(hw, hq, ht, hn, hr) : null
                }
            }
        }
        return ht
    }

    function cg(ho, hp, hm, hk, i) {
        var hl = hk || 1;
        var hn = fq(ho, hp, hm, hl, i) || (!i && fq(ho, hp, hm, hl, true)) || fq(ho, hp, hm, -hl, i) || (!i && fq(ho, hp, hm, -hl, true));
        if (!hn) {
            ho.cantEdit = true;
            return ab(ho.first, 0)
        }
        return hn
    }

    function hg(hl, hm, hk, i) {
        if (hk < 0 && hm.ch == 0) {
            if (hm.line > hl.first) {
                return gy(hl, ab(hm.line - 1))
            } else {
                return null
            }
        } else {
            if (hk > 0 && hm.ch == (i || f0(hl, hm.line)).text.length) {
                if (hm.line < hl.first + hl.size - 1) {
                    return ab(hm.line + 1, 0)
                } else {
                    return null
                }
            } else {
                return new ab(hm.line, hm.ch + hk)
            }
        }
    }

    function au(i) {
        i.setSelection(ab(i.firstLine(), 0), ab(i.lastLine()), ag)
    }

    function em(hk, hm, hl) {
        var i = {
            canceled: false, from: hm.from, to: hm.to, text: hm.text, origin: hm.origin, cancel: function () {
                return i.canceled = true
            }
        };
        if (hl) {
            i.update = function (hq, hp, ho, hn) {
                if (hq) {
                    i.from = gy(hk, hq)
                }
                if (hp) {
                    i.to = gy(hk, hp)
                }
                if (ho) {
                    i.text = ho
                }
                if (hn !== undefined) {
                    i.origin = hn
                }
            }
        }
        aN(hk, "beforeChange", hk, i);
        if (hk.cm) {
            aN(hk.cm, "beforeChange", hk.cm, i)
        }
        if (i.canceled) {
            if (hk.cm) {
                hk.cm.curOp.updateInput = 2
            }
            return null
        }
        return {from: i.from, to: i.to, text: i.text, origin: i.origin}
    }

    function bs(hn, ho, hm) {
        if (hn.cm) {
            if (!hn.cm.curOp) {
                return du(hn.cm, bs)(hn, ho, hm)
            }
            if (hn.cm.state.suppressEdits) {
                return
            }
        }
        if (f5(hn, "beforeChange") || hn.cm && f5(hn.cm, "beforeChange")) {
            ho = em(hn, ho, true);
            if (!ho) {
                return
            }
        }
        var hl = he && !hm && da(hn, ho.from, ho.to);
        if (hl) {
            for (var hk = hl.length - 1; hk >= 0; --hk) {
                P(hn, {from: hl[hk].from, to: hl[hk].to, text: hk ? [""] : ho.text, origin: ho.origin})
            }
        } else {
            P(hn, ho)
        }
    }

    function P(hl, hm) {
        if (hm.text.length == 1 && hm.text[0] == "" && cD(hm.from, hm.to) == 0) {
            return
        }
        var hk = f4(hl, hm);
        gB(hl, hm, hk, hl.cm ? hl.cm.curOp.id : NaN);
        eN(hl, hm, hk, eV(hl, hm));
        var i = [];
        eG(hl, function (ho, hn) {
            if (!hn && dP(i, ho.history) == -1) {
                d8(ho.history, hm);
                i.push(ho.history)
            }
            eN(ho, hm, null, eV(ho, hm))
        })
    }

    function cu(hx, hu, hy) {
        var hv = hx.cm && hx.cm.state.suppressEdits;
        if (hv && !hy) {
            return
        }
        var ht = hx.history, hl, hn = hx.sel;
        var hk = hu == "undo" ? ht.done : ht.undone, hw = hu == "undo" ? ht.undone : ht.done;
        var hq = 0;
        for (; hq < hk.length; hq++) {
            hl = hk[hq];
            if (hy ? hl.ranges && !hl.equals(hx.sel) : !hl.ranges) {
                break
            }
        }
        if (hq == hk.length) {
            return
        }
        ht.lastOrigin = ht.lastSelOrigin = null;
        for (; ;) {
            hl = hk.pop();
            if (hl.ranges) {
                dh(hl, hw);
                if (hy && !hl.equals(hx.sel)) {
                    cf(hx, hl, {clearRedo: false});
                    return
                }
                hn = hl
            } else {
                if (hv) {
                    hk.push(hl);
                    return
                } else {
                    break
                }
            }
        }
        var hs = [];
        dh(hn, hw);
        hw.push({changes: hs, generation: ht.generation});
        ht.generation = hl.generation || ++ht.maxGeneration;
        var hm = f5(hx, "beforeChange") || hx.cm && f5(hx.cm, "beforeChange");
        var hr = function (hz) {
            var hC = hl.changes[hz];
            hC.origin = hu;
            if (hm && !em(hx, hC, false)) {
                hk.length = 0;
                return {}
            }
            hs.push(d2(hx, hC));
            var hB = hz ? f4(hx, hC) : gt(hk);
            eN(hx, hC, hB, eI(hx, hC));
            if (!hz && hx.cm) {
                hx.cm.scrollIntoView({from: hC.from, to: dq(hC)})
            }
            var hA = [];
            eG(hx, function (hD, i) {
                if (!i && dP(hA, hD.history) == -1) {
                    d8(hD.history, hC);
                    hA.push(hD.history)
                }
                eN(hD, hC, null, eI(hD, hC))
            })
        };
        for (var ho = hl.changes.length - 1; ho >= 0; --ho) {
            var hp = hr(ho);
            if (hp) {
                return hp.v
            }
        }
    }

    function f8(hk, hm) {
        if (hm == 0) {
            return
        }
        hk.first += hm;
        hk.sel = new gZ(ce(hk.sel.ranges, function (hn) {
            return new eu(ab(hn.anchor.line + hm, hn.anchor.ch), ab(hn.head.line + hm, hn.head.ch))
        }), hk.sel.primIndex);
        if (hk.cm) {
            ao(hk.cm, hk.first, hk.first - hm, hm);
            for (var hl = hk.cm.display, i = hl.viewFrom; i < hl.viewTo; i++) {
                W(hk.cm, i, "gutter")
            }
        }
    }

    function eN(hn, ho, hm, hk) {
        if (hn.cm && !hn.cm.curOp) {
            return du(hn.cm, eN)(hn, ho, hm, hk)
        }
        if (ho.to.line < hn.first) {
            f8(hn, ho.text.length - 1 - (ho.to.line - ho.from.line));
            return
        }
        if (ho.from.line > hn.lastLine()) {
            return
        }
        if (ho.from.line < hn.first) {
            var i = ho.text.length - 1 - (hn.first - ho.from.line);
            f8(hn, i);
            ho = {from: ab(hn.first, 0), to: ab(ho.to.line + i, ho.to.ch), text: [gt(ho.text)], origin: ho.origin}
        }
        var hl = hn.lastLine();
        if (ho.to.line > hl) {
            ho = {from: ho.from, to: ab(hl, f0(hn, hl).text.length), text: [ho.text[0]], origin: ho.origin}
        }
        ho.removed = g2(hn, ho.from, ho.to);
        if (!hm) {
            hm = f4(hn, ho)
        }
        if (hn.cm) {
            aS(hn.cm, ho, hk)
        } else {
            gj(hn, ho, hk)
        }
        e1(hn, hm, ag);
        if (hn.cantEdit && cg(hn, ab(hn.firstLine(), 0))) {
            hn.cantEdit = false
        }
    }

    function aS(hu, hq, ho) {
        var ht = hu.doc, hp = hu.display, hr = hq.from, hs = hq.to;
        var i = false, hn = hr.line;
        if (!hu.options.lineWrapping) {
            hn = b7(A(f0(ht, hr.line)));
            ht.iter(hn, hs.line + 1, function (hw) {
                if (hw == hp.maxLine) {
                    i = true;
                    return true
                }
            })
        }
        if (ht.sel.contains(hq.from, hq.to) > -1) {
            aa(hu)
        }
        gj(ht, hq, ho, bq(hu));
        if (!hu.options.lineWrapping) {
            ht.iter(hn, hr.line + hq.text.length, function (hx) {
                var hw = eY(hx);
                if (hw > hp.maxLineLength) {
                    hp.maxLine = hx;
                    hp.maxLineLength = hw;
                    hp.maxLineChanged = true;
                    i = false
                }
            });
            if (i) {
                hu.curOp.updateMaxLine = true
            }
        }
        hd(ht, hr.line);
        eO(hu, 400);
        var hv = hq.text.length - (hs.line - hr.line) - 1;
        if (hq.full) {
            ao(hu)
        } else {
            if (hr.line == hs.line && hq.text.length == 1 && !eo(hu.doc, hq)) {
                W(hu, hr.line, "text")
            } else {
                ao(hu, hr.line, hs.line + 1, hv)
            }
        }
        var hl = f5(hu, "changes"), hm = f5(hu, "change");
        if (hm || hl) {
            var hk = {from: hr, to: hs, text: hq.text, removed: hq.removed, origin: hq.origin};
            if (hm) {
                al(hu, "change", hu, hk)
            }
            if (hl) {
                (hu.curOp.changeObjs || (hu.curOp.changeObjs = [])).push(hk)
            }
        }
        hu.display.selForContextMenu = null
    }

    function bc(hm, hl, ho, hn, hk) {
        var i;
        if (!hn) {
            hn = ho
        }
        if (cD(hn, ho) < 0) {
            (i = [hn, ho], ho = i[0], hn = i[1])
        }
        if (typeof hl == "string") {
            hl = hm.splitLines(hl)
        }
        bs(hm, {from: ho, to: hn, text: hl, origin: hk})
    }

    function N(hm, hl, hk, i) {
        if (hk < hm.line) {
            hm.line += i
        } else {
            if (hl < hm.line) {
                hm.line = hl;
                hm.ch = 0
            }
        }
    }

    function f2(ho, hq, hr, hs) {
        for (var hn = 0; hn < ho.length; ++hn) {
            var hk = ho[hn], hp = true;
            if (hk.ranges) {
                if (!hk.copied) {
                    hk = ho[hn] = hk.deepCopy();
                    hk.copied = true
                }
                for (var hm = 0; hm < hk.ranges.length; hm++) {
                    N(hk.ranges[hm].anchor, hq, hr, hs);
                    N(hk.ranges[hm].head, hq, hr, hs)
                }
                continue
            }
            for (var hl = 0; hl < hk.changes.length; ++hl) {
                var ht = hk.changes[hl];
                if (hr < ht.from.line) {
                    ht.from = ab(ht.from.line + hs, ht.from.ch);
                    ht.to = ab(ht.to.line + hs, ht.to.ch)
                } else {
                    if (hq <= ht.to.line) {
                        hp = false;
                        break
                    }
                }
            }
            if (!hp) {
                ho.splice(0, hn + 1);
                hn = 0
            }
        }
    }

    function d8(hk, hn) {
        var hm = hn.from.line, hl = hn.to.line, i = hn.text.length - (hl - hm) - 1;
        f2(hk.done, hm, hl, i);
        f2(hk.undone, hm, hl, i)
    }

    function fe(hm, hl, i, ho) {
        var hn = hl, hk = hl;
        if (typeof hl == "number") {
            hk = f0(hm, dy(hm, hl))
        } else {
            hn = b7(hl)
        }
        if (hn == null) {
            return null
        }
        if (ho(hk, hn) && hm.cm) {
            W(hm.cm, hn, i)
        }
        return hk
    }

    function fK(hl) {
        this.lines = hl;
        this.parent = null;
        var hk = 0;
        for (var hm = 0; hm < hl.length; ++hm) {
            hl[hm].parent = this;
            hk += hl[hm].height
        }
        this.height = hk
    }

    fK.prototype = {
        chunkSize: function () {
            return this.lines.length
        }, removeInner: function (hk, ho) {
            for (var hm = hk, hn = hk + ho; hm < hn; ++hm) {
                var hl = this.lines[hm];
                this.height -= hl.height;
                bU(hl);
                al(hl, "delete")
            }
            this.lines.splice(hk, ho)
        }, collapse: function (i) {
            i.push.apply(i, this.lines)
        }, insertInner: function (hl, hm, hk) {
            this.height += hk;
            this.lines = this.lines.slice(0, hl).concat(hm).concat(this.lines.slice(hl));
            for (var hn = 0; hn < hm.length; ++hn) {
                hm[hn].parent = this
            }
        }, iterN: function (i, hm, hl) {
            for (var hk = i + hm; i < hk; ++i) {
                if (hl(this.lines[i])) {
                    return true
                }
            }
        }
    };

    function gi(hn) {
        this.children = hn;
        var hm = 0, hk = 0;
        for (var hl = 0; hl < hn.length; ++hl) {
            var ho = hn[hl];
            hm += ho.chunkSize();
            hk += ho.height;
            ho.parent = this
        }
        this.size = hm;
        this.height = hk;
        this.parent = null
    }

    gi.prototype = {
        chunkSize: function () {
            return this.size
        }, removeInner: function (hk, hr) {
            this.size -= hr;
            for (var hm = 0; hm < this.children.length; ++hm) {
                var hq = this.children[hm], ho = hq.chunkSize();
                if (hk < ho) {
                    var hn = Math.min(hr, ho - hk), hp = hq.height;
                    hq.removeInner(hk, hn);
                    this.height -= hp - hq.height;
                    if (ho == hn) {
                        this.children.splice(hm--, 1);
                        hq.parent = null
                    }
                    if ((hr -= hn) == 0) {
                        break
                    }
                    hk = 0
                } else {
                    hk -= ho
                }
            }
            if (this.size - hr < 25 && (this.children.length > 1 || !(this.children[0] instanceof fK))) {
                var hl = [];
                this.collapse(hl);
                this.children = [new fK(hl)];
                this.children[0].parent = this
            }
        }, collapse: function (hk) {
            for (var hl = 0; hl < this.children.length; ++hl) {
                this.children[hl].collapse(hk)
            }
        }, insertInner: function (hl, hs, hr) {
            this.size += hs.length;
            this.height += hr;
            for (var hn = 0; hn < this.children.length; ++hn) {
                var hk = this.children[hn], hp = hk.chunkSize();
                if (hl <= hp) {
                    hk.insertInner(hl, hs, hr);
                    if (hk.lines && hk.lines.length > 50) {
                        var hm = hk.lines.length % 25 + 25;
                        for (var hq = hm; hq < hk.lines.length;) {
                            var ho = new fK(hk.lines.slice(hq, hq += 25));
                            hk.height -= ho.height;
                            this.children.splice(++hn, 0, ho);
                            ho.parent = this
                        }
                        hk.lines = hk.lines.slice(0, hm);
                        this.maybeSpill()
                    }
                    break
                }
                hl -= hp
            }
        }, maybeSpill: function () {
            if (this.children.length <= 10) {
                return
            }
            var hm = this;
            do {
                var hk = hm.children.splice(hm.children.length - 5, 5);
                var hl = new gi(hk);
                if (!hm.parent) {
                    var hn = new gi(hm.children);
                    hn.parent = hm;
                    hm.children = [hn, hl];
                    hm = hn
                } else {
                    hm.size -= hl.size;
                    hm.height -= hl.height;
                    var i = dP(hm.parent.children, hm);
                    hm.parent.children.splice(i + 1, 0, hl)
                }
                hl.parent = hm.parent
            } while (hm.children.length > 10);
            hm.parent.maybeSpill()
        }, iterN: function (hk, hq, hp) {
            for (var hl = 0; hl < this.children.length; ++hl) {
                var ho = this.children[hl], hn = ho.chunkSize();
                if (hk < hn) {
                    var hm = Math.min(hq, hn - hk);
                    if (ho.iterN(hk, hm, hp)) {
                        return true
                    }
                    if ((hq -= hm) == 0) {
                        break
                    }
                    hk = 0
                } else {
                    hk -= hn
                }
            }
        }
    };
    var d6 = function (hm, hl, i) {
        if (i) {
            for (var hk in i) {
                if (i.hasOwnProperty(hk)) {
                    this[hk] = i[hk]
                }
            }
        }
        this.doc = hm;
        this.node = hl
    };
    d6.prototype.clear = function () {
        var hl = this.doc.cm, hn = this.line.widgets, hm = this.line, hp = b7(hm);
        if (hp == null || !hn) {
            return
        }
        for (var ho = 0; ho < hn.length; ++ho) {
            if (hn[ho] == this) {
                hn.splice(ho--, 1)
            }
        }
        if (!hn.length) {
            hm.widgets = null
        }
        var hk = dr(this);
        g5(hm, Math.max(0, hm.height - hk));
        if (hl) {
            df(hl, function () {
                ew(hl, hm, -hk);
                W(hl, hp, "widget")
            });
            al(hl, "lineWidgetCleared", hl, this, hp)
        }
    };
    d6.prototype.changed = function () {
        var hn = this;
        var hk = this.height, i = this.doc.cm, hl = this.line;
        this.height = null;
        var hm = dr(this) - hk;
        if (!hm) {
            return
        }
        if (!gg(this.doc, hl)) {
            g5(hl, hl.height + hm)
        }
        if (i) {
            df(i, function () {
                i.curOp.forceUpdate = true;
                ew(i, hl, hm);
                al(i, "lineWidgetChanged", i, hn, b7(hl))
            })
        }
    };
    bS(d6);

    function ew(i, hk, hl) {
        if (b6(hk) < ((i.curOp && i.curOp.scrollTop) || i.doc.scrollTop)) {
            c9(i, hl)
        }
    }

    function bZ(ho, hn, hl, hk) {
        var hm = new d6(ho, hl, hk);
        var i = ho.cm;
        if (i && hm.noHScroll) {
            i.display.alignWidgets = true
        }
        fe(ho, hn, "widget", function (hq) {
            var hr = hq.widgets || (hq.widgets = []);
            if (hm.insertAt == null) {
                hr.push(hm)
            } else {
                hr.splice(Math.min(hr.length, Math.max(0, hm.insertAt)), 0, hm)
            }
            hm.line = hq;
            if (i && !gg(ho, hq)) {
                var hp = b6(hq) < ho.scrollTop;
                g5(hq, hq.height + dr(hm));
                if (hp) {
                    c9(i, hm.height)
                }
                i.curOp.forceUpdate = true
            }
            return true
        });
        if (i) {
            al(i, "lineWidgetAdded", i, hm, typeof hn == "number" ? hn : b7(hn))
        }
        return hm
    }

    var bg = 0;
    var V = function (hk, i) {
        this.lines = [];
        this.type = i;
        this.doc = hk;
        this.id = ++bg
    };
    V.prototype.clear = function () {
        if (this.explicitlyCleared) {
            return
        }
        var hs = this.doc.cm, hm = hs && !hs.curOp;
        if (hm) {
            db(hs)
        }
        if (f5(this, "clear")) {
            var ht = this.find();
            if (ht) {
                al(this, "clear", ht.from, ht.to)
            }
        }
        var hn = null, hq = null;
        for (var ho = 0; ho < this.lines.length; ++ho) {
            var hu = this.lines[ho];
            var hr = fV(hu.markedSpans, this);
            if (hs && !this.collapsed) {
                W(hs, b7(hu), "text")
            } else {
                if (hs) {
                    if (hr.to != null) {
                        hq = b7(hu)
                    }
                    if (hr.from != null) {
                        hn = b7(hu)
                    }
                }
            }
            hu.markedSpans = fp(hu.markedSpans, hr);
            if (hr.from == null && this.collapsed && !gg(this.doc, hu) && hs) {
                g5(hu, a9(hs.display))
            }
        }
        if (hs && this.collapsed && !hs.options.lineWrapping) {
            for (var hl = 0; hl < this.lines.length; ++hl) {
                var hk = A(this.lines[hl]), hp = eY(hk);
                if (hp > hs.display.maxLineLength) {
                    hs.display.maxLine = hk;
                    hs.display.maxLineLength = hp;
                    hs.display.maxLineChanged = true
                }
            }
        }
        if (hn != null && hs && this.collapsed) {
            ao(hs, hn, hq + 1)
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (hs) {
                fb(hs.doc)
            }
        }
        if (hs) {
            al(hs, "markerCleared", hs, this, hn, hq)
        }
        if (hm) {
            av(hs)
        }
        if (this.parent) {
            this.parent.clear()
        }
    };
    V.prototype.find = function (hn, hl) {
        if (hn == null && this.type == "bookmark") {
            hn = 1
        }
        var hq, hp;
        for (var hm = 0; hm < this.lines.length; ++hm) {
            var hk = this.lines[hm];
            var ho = fV(hk.markedSpans, this);
            if (ho.from != null) {
                hq = ab(hl ? hk : b7(hk), ho.from);
                if (hn == -1) {
                    return hq
                }
            }
            if (ho.to != null) {
                hp = ab(hl ? hk : b7(hk), ho.to);
                if (hn == 1) {
                    return hp
                }
            }
        }
        return hq && {from: hq, to: hp}
    };
    V.prototype.changed = function () {
        var hm = this;
        var hl = this.find(-1, true), hk = this, i = this.doc.cm;
        if (!hl || !i) {
            return
        }
        df(i, function () {
            var ho = hl.line, hp = b7(hl.line);
            var hn = fX(i, hp);
            if (hn) {
                aD(hn);
                i.curOp.selectionChanged = i.curOp.forceUpdate = true
            }
            i.curOp.updateMaxLine = true;
            if (!gg(hk.doc, ho) && hk.height != null) {
                var hr = hk.height;
                hk.height = null;
                var hq = dr(hk) - hr;
                if (hq) {
                    g5(ho, ho.height + hq)
                }
            }
            al(i, "markerChanged", i, hm)
        })
    };
    V.prototype.attachLine = function (i) {
        if (!this.lines.length && this.doc.cm) {
            var hk = this.doc.cm.curOp;
            if (!hk.maybeHiddenMarkers || dP(hk.maybeHiddenMarkers, this) == -1) {
                (hk.maybeUnhiddenMarkers || (hk.maybeUnhiddenMarkers = [])).push(this)
            }
        }
        this.lines.push(i)
    };
    V.prototype.detachLine = function (i) {
        this.lines.splice(dP(this.lines, i), 1);
        if (!this.lines.length && this.doc.cm) {
            var hk = this.doc.cm.curOp;
            (hk.maybeHiddenMarkers || (hk.maybeHiddenMarkers = [])).push(this)
        }
    };
    bS(V);

    function fl(hs, hq, hr, hu, ho) {
        if (hu && hu.shared) {
            return S(hs, hq, hr, hu, ho)
        }
        if (hs.cm && !hs.cm.curOp) {
            return du(hs.cm, fl)(hs, hq, hr, hu, ho)
        }
        var hn = new V(hs, ho), ht = cD(hq, hr);
        if (hu) {
            aY(hu, hn, false)
        }
        if (ht > 0 || ht == 0 && hn.clearWhenEmpty !== false) {
            return hn
        }
        if (hn.replacedWith) {
            hn.collapsed = true;
            hn.widgetNode = g6("span", [hn.replacedWith], "CodeMirror-widget");
            if (!hu.handleMouseEvents) {
                hn.widgetNode.setAttribute("cm-ignore-events", "true")
            }
            if (hu.insertLeft) {
                hn.widgetNode.insertLeft = true
            }
        }
        if (hn.collapsed) {
            if (B(hs, hq.line, hq, hr, hn) || hq.line != hr.line && B(hs, hr.line, hq, hr, hn)) {
                throw new Error("Inserting collapsed marker partially overlapping an existing one")
            }
            bP()
        }
        if (hn.addToHistory) {
            gB(hs, {from: hq, to: hr, origin: "markText"}, hs.sel, NaN)
        }
        var hl = hq.line, hp = hs.cm, hk;
        hs.iter(hl, hr.line + 1, function (i) {
            if (hp && hn.collapsed && !hp.options.lineWrapping && A(i) == hp.display.maxLine) {
                hk = true
            }
            if (hn.collapsed && hl != hq.line) {
                g5(i, 0)
            }
            cB(i, new eT(hn, hl == hq.line ? hq.ch : null, hl == hr.line ? hr.ch : null));
            ++hl
        });
        if (hn.collapsed) {
            hs.iter(hq.line, hr.line + 1, function (i) {
                if (gg(hs, i)) {
                    g5(i, 0)
                }
            })
        }
        if (hn.clearOnEnter) {
            ci(hn, "beforeCursorEnter", function () {
                return hn.clear()
            })
        }
        if (hn.readOnly) {
            gl();
            if (hs.history.done.length || hs.history.undone.length) {
                hs.clearHistory()
            }
        }
        if (hn.collapsed) {
            hn.id = ++bg;
            hn.atomic = true
        }
        if (hp) {
            if (hk) {
                hp.curOp.updateMaxLine = true
            }
            if (hn.collapsed) {
                ao(hp, hq.line, hr.line + 1)
            } else {
                if (hn.className || hn.startStyle || hn.endStyle || hn.css || hn.attributes || hn.title) {
                    for (var hm = hq.line; hm <= hr.line; hm++) {
                        W(hp, hm, "text")
                    }
                }
            }
            if (hn.atomic) {
                fb(hp.doc)
            }
            al(hp, "markerAdded", hp, hn)
        }
        return hn
    }

    var z = function (hm, hl) {
        this.markers = hm;
        this.primary = hl;
        for (var hk = 0; hk < hm.length; ++hk) {
            hm[hk].parent = this
        }
    };
    z.prototype.clear = function () {
        if (this.explicitlyCleared) {
            return
        }
        this.explicitlyCleared = true;
        for (var hk = 0; hk < this.markers.length; ++hk) {
            this.markers[hk].clear()
        }
        al(this, "clear")
    };
    z.prototype.find = function (hk, i) {
        return this.primary.find(hk, i)
    };
    bS(z);

    function S(hn, hq, hp, i, hl) {
        i = aY(i);
        i.shared = false;
        var ho = [fl(hn, hq, hp, i, hl)], hk = ho[0];
        var hm = i.widgetNode;
        eG(hn, function (hs) {
            if (hm) {
                i.widgetNode = hm.cloneNode(true)
            }
            ho.push(fl(hs, gy(hs, hq), gy(hs, hp), i, hl));
            for (var hr = 0; hr < hs.linked.length; ++hr) {
                if (hs.linked[hr].isParent) {
                    return
                }
            }
            hk = gt(ho)
        });
        return new z(ho, hk)
    }

    function fx(i) {
        return i.findMarks(ab(i.first, 0), i.clipPos(ab(i.lastLine())), function (hk) {
            return hk.parent
        })
    }

    function d9(hp, hq) {
        for (var hn = 0; hn < hq.length; hn++) {
            var hl = hq[hn], hr = hl.find();
            var hk = hp.clipPos(hr.from), ho = hp.clipPos(hr.to);
            if (cD(hk, ho)) {
                var hm = fl(hp, hk, ho, hl.primary, hl.primary.type);
                hl.markers.push(hm);
                hm.parent = hl
            }
        }
    }

    function e0(hm) {
        var hk = function (hp) {
            var hn = hm[hp], hr = [hn.primary.doc];
            eG(hn.primary.doc, function (i) {
                return hr.push(i)
            });
            for (var ho = 0; ho < hn.markers.length; ho++) {
                var hq = hn.markers[ho];
                if (dP(hr, hq.doc) == -1) {
                    hq.parent = null;
                    hn.markers.splice(ho--, 1)
                }
            }
        };
        for (var hl = 0; hl < hm.length; hl++) {
            hk(hl)
        }
    }

    var cS = 0;
    var aC = function (hn, hm, i, hl, hk) {
        if (!(this instanceof aC)) {
            return new aC(hn, hm, i, hl, hk)
        }
        if (i == null) {
            i = 0
        }
        gi.call(this, [new fK([new g4("", null)])]);
        this.first = i;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = i;
        var ho = ab(i, 0);
        this.sel = fA(ho);
        this.history = new gM(null);
        this.id = ++cS;
        this.modeOption = hm;
        this.lineSep = hl;
        this.direction = (hk == "rtl") ? "rtl" : "ltr";
        this.extend = false;
        if (typeof hn == "string") {
            hn = this.splitLines(hn)
        }
        gj(this, {from: ho, to: ho, text: hn});
        cf(this, fA(ho), ag)
    };
    aC.prototype = cK(gi.prototype, {
        constructor: aC, iter: function (hl, hk, i) {
            if (i) {
                this.iterN(hl - this.first, hk - hl, i)
            } else {
                this.iterN(this.first, this.first + this.size, hl)
            }
        }, insert: function (hl, hm) {
            var hk = 0;
            for (var hn = 0; hn < hm.length; ++hn) {
                hk += hm[hn].height
            }
            this.insertInner(hl - this.first, hm, hk)
        }, remove: function (i, hk) {
            this.removeInner(i - this.first, hk)
        }, getValue: function (hk) {
            var i = be(this, this.first, this.first + this.size);
            if (hk === false) {
                return i
            }
            return i.join(hk || this.lineSeparator())
        }, setValue: c5(function (hk) {
            var hl = ab(this.first, 0), i = this.first + this.size - 1;
            bs(this, {
                from: hl,
                to: ab(i, f0(this, i).text.length),
                text: this.splitLines(hk),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) {
                fu(this.cm, 0, 0)
            }
            cf(this, fA(hl), ag)
        }), replaceRange: function (hk, hm, hl, i) {
            hm = gy(this, hm);
            hl = hl ? gy(this, hl) : hm;
            bc(this, hk, hm, hl, i)
        }, getRange: function (hm, hl, hk) {
            var i = g2(this, gy(this, hm), gy(this, hl));
            if (hk === false) {
                return i
            }
            return i.join(hk || this.lineSeparator())
        }, getLine: function (hk) {
            var i = this.getLineHandle(hk);
            return i && i.text
        }, getLineHandle: function (i) {
            if (cv(this, i)) {
                return f0(this, i)
            }
        }, getLineNumber: function (i) {
            return b7(i)
        }, getLineHandleVisualStart: function (i) {
            if (typeof i == "number") {
                i = f0(this, i)
            }
            return A(i)
        }, lineCount: function () {
            return this.size
        }, firstLine: function () {
            return this.first
        }, lastLine: function () {
            return this.first + this.size - 1
        }, clipPos: function (i) {
            return gy(this, i)
        }, getCursor: function (hl) {
            var i = this.sel.primary(), hk;
            if (hl == null || hl == "head") {
                hk = i.head
            } else {
                if (hl == "anchor") {
                    hk = i.anchor
                } else {
                    if (hl == "end" || hl == "to" || hl === false) {
                        hk = i.to()
                    } else {
                        hk = i.from()
                    }
                }
            }
            return hk
        }, listSelections: function () {
            return this.sel.ranges
        }, somethingSelected: function () {
            return this.sel.somethingSelected()
        }, setCursor: c5(function (i, hl, hk) {
            K(this, gy(this, typeof i == "number" ? ab(i, hl || 0) : i), null, hk)
        }), setSelection: c5(function (hk, hl, i) {
            K(this, gy(this, hk), gy(this, hl || hk), i)
        }), extendSelection: c5(function (hl, i, hk) {
            gS(this, gy(this, hl), i && gy(this, i), hk)
        }), extendSelections: c5(function (hk, i) {
            aE(this, ey(this, hk), i)
        }), extendSelectionsBy: c5(function (hl, i) {
            var hk = ce(this.sel.ranges, hl);
            aE(this, ey(this, hk), i)
        }), setSelections: c5(function (hk, ho, hm) {
            if (!hk.length) {
                return
            }
            var hl = [];
            for (var hn = 0; hn < hk.length; hn++) {
                hl[hn] = new eu(gy(this, hk[hn].anchor), gy(this, hk[hn].head))
            }
            if (ho == null) {
                ho = Math.min(hk.length - 1, this.sel.primIndex)
            }
            cf(this, cX(this.cm, hl, ho), hm)
        }), addSelection: c5(function (hl, hm, hk) {
            var i = this.sel.ranges.slice(0);
            i.push(new eu(gy(this, hl), gy(this, hm || hl)));
            cf(this, cX(this.cm, i, i.length - 1), hk)
        }), getSelection: function (ho) {
            var hl = this.sel.ranges, hk;
            for (var hm = 0; hm < hl.length; hm++) {
                var hn = g2(this, hl[hm].from(), hl[hm].to());
                hk = hk ? hk.concat(hn) : hn
            }
            if (ho === false) {
                return hk
            } else {
                return hk.join(ho || this.lineSeparator())
            }
        }, getSelections: function (ho) {
            var hn = [], hk = this.sel.ranges;
            for (var hl = 0; hl < hk.length; hl++) {
                var hm = g2(this, hk[hl].from(), hk[hl].to());
                if (ho !== false) {
                    hm = hm.join(ho || this.lineSeparator())
                }
                hn[hl] = hm
            }
            return hn
        }, replaceSelection: function (hm, ho, hk) {
            var hn = [];
            for (var hl = 0; hl < this.sel.ranges.length; hl++) {
                hn[hl] = hm
            }
            this.replaceSelections(hn, ho, hk || "+input")
        }, replaceSelections: c5(function (hk, hq, hs) {
            var hr = [], hn = this.sel;
            for (var ho = 0; ho < hn.ranges.length; ho++) {
                var hp = hn.ranges[ho];
                hr[ho] = {from: hp.from(), to: hp.to(), text: this.splitLines(hk[ho]), origin: hs}
            }
            var hl = hq && hq != "end" && am(this, hr, hq);
            for (var hm = hr.length - 1; hm >= 0; hm--) {
                bs(this, hr[hm])
            }
            if (hl) {
                fT(this, hl)
            } else {
                if (this.cm) {
                    gs(this.cm)
                }
            }
        }), undo: c5(function () {
            cu(this, "undo")
        }), redo: c5(function () {
            cu(this, "redo")
        }), undoSelection: c5(function () {
            cu(this, "undo", true)
        }), redoSelection: c5(function () {
            cu(this, "redo", true)
        }), setExtending: function (i) {
            this.extend = i
        }, getExtending: function () {
            return this.extend
        }, historySize: function () {
            var hn = this.history, hk = 0, hm = 0;
            for (var hl = 0; hl < hn.done.length; hl++) {
                if (!hn.done[hl].ranges) {
                    ++hk
                }
            }
            for (var ho = 0; ho < hn.undone.length; ho++) {
                if (!hn.undone[ho].ranges) {
                    ++hm
                }
            }
            return {undo: hk, redo: hm}
        }, clearHistory: function () {
            var i = this;
            this.history = new gM(this.history.maxGeneration);
            eG(this, function (hk) {
                return hk.history = i.history
            }, true)
        }, markClean: function () {
            this.cleanGeneration = this.changeGeneration(true)
        }, changeGeneration: function (i) {
            if (i) {
                this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null
            }
            return this.history.generation
        }, isClean: function (i) {
            return this.history.generation == (i || this.cleanGeneration)
        }, getHistory: function () {
            return {done: b9(this.history.done), undone: b9(this.history.undone)}
        }, setHistory: function (hk) {
            var i = this.history = new gM(this.history.maxGeneration);
            i.done = b9(hk.done.slice(0), null, true);
            i.undone = b9(hk.undone.slice(0), null, true)
        }, setGutterMarker: c5(function (i, hk, hl) {
            return fe(this, i, "gutter", function (hm) {
                var hn = hm.gutterMarkers || (hm.gutterMarkers = {});
                hn[hk] = hl;
                if (!hl && fE(hn)) {
                    hm.gutterMarkers = null
                }
                return true
            })
        }), clearGutter: c5(function (i) {
            var hk = this;
            this.iter(function (hl) {
                if (hl.gutterMarkers && hl.gutterMarkers[i]) {
                    fe(hk, hl, "gutter", function () {
                        hl.gutterMarkers[i] = null;
                        if (fE(hl.gutterMarkers)) {
                            hl.gutterMarkers = null
                        }
                        return true
                    })
                }
            })
        }), lineInfo: function (i) {
            var hk;
            if (typeof i == "number") {
                if (!cv(this, i)) {
                    return null
                }
                hk = i;
                i = f0(this, i);
                if (!i) {
                    return null
                }
            } else {
                hk = b7(i);
                if (hk == null) {
                    return null
                }
            }
            return {
                line: hk,
                handle: i,
                text: i.text,
                gutterMarkers: i.gutterMarkers,
                textClass: i.textClass,
                bgClass: i.bgClass,
                wrapClass: i.wrapClass,
                widgets: i.widgets
            }
        }, addLineClass: c5(function (hl, hk, i) {
            return fe(this, hl, hk == "gutter" ? "gutter" : "class", function (hm) {
                var hn = hk == "text" ? "textClass" : hk == "background" ? "bgClass" : hk == "gutter" ? "gutterClass" : "wrapClass";
                if (!hm[hn]) {
                    hm[hn] = i
                } else {
                    if (X(i).test(hm[hn])) {
                        return false
                    } else {
                        hm[hn] += " " + i
                    }
                }
                return true
            })
        }), removeLineClass: c5(function (hl, hk, i) {
            return fe(this, hl, hk == "gutter" ? "gutter" : "class", function (hn) {
                var hq = hk == "text" ? "textClass" : hk == "background" ? "bgClass" : hk == "gutter" ? "gutterClass" : "wrapClass";
                var hp = hn[hq];
                if (!hp) {
                    return false
                } else {
                    if (i == null) {
                        hn[hq] = null
                    } else {
                        var ho = hp.match(X(i));
                        if (!ho) {
                            return false
                        }
                        var hm = ho.index + ho[0].length;
                        hn[hq] = hp.slice(0, ho.index) + (!ho.index || hm == hp.length ? "" : " ") + hp.slice(hm) || null
                    }
                }
                return true
            })
        }), addLineWidget: c5(function (hl, hk, i) {
            return bZ(this, hl, hk, i)
        }), removeLineWidget: function (i) {
            i.clear()
        }, markText: function (hl, hk, i) {
            return fl(this, gy(this, hl), gy(this, hk), i, i && i.type || "range")
        }, setBookmark: function (hl, i) {
            var hk = {
                replacedWith: i && (i.nodeType == null ? i.widget : i),
                insertLeft: i && i.insertLeft,
                clearWhenEmpty: false,
                shared: i && i.shared,
                handleMouseEvents: i && i.handleMouseEvents
            };
            hl = gy(this, hl);
            return fl(this, hl, hl, hk, "bookmark")
        }, findMarksAt: function (ho) {
            ho = gy(this, ho);
            var hn = [], hl = f0(this, ho.line).markedSpans;
            if (hl) {
                for (var hk = 0; hk < hl.length; ++hk) {
                    var hm = hl[hk];
                    if ((hm.from == null || hm.from <= ho.ch) && (hm.to == null || hm.to >= ho.ch)) {
                        hn.push(hm.marker.parent || hm.marker)
                    }
                }
            }
            return hn
        }, findMarks: function (hn, hm, i) {
            hn = gy(this, hn);
            hm = gy(this, hm);
            var hk = [], hl = hn.line;
            this.iter(hn.line, hm.line + 1, function (ho) {
                var hq = ho.markedSpans;
                if (hq) {
                    for (var hp = 0; hp < hq.length; hp++) {
                        var hr = hq[hp];
                        if (!(hr.to != null && hl == hn.line && hn.ch >= hr.to || hr.from == null && hl != hn.line || hr.from != null && hl == hm.line && hr.from >= hm.ch) && (!i || i(hr.marker))) {
                            hk.push(hr.marker.parent || hr.marker)
                        }
                    }
                }
                ++hl
            });
            return hk
        }, getAllMarks: function () {
            var i = [];
            this.iter(function (hl) {
                var hk = hl.markedSpans;
                if (hk) {
                    for (var hm = 0; hm < hk.length; ++hm) {
                        if (hk[hm].from != null) {
                            i.push(hk[hm].marker)
                        }
                    }
                }
            });
            return i
        }, posFromIndex: function (hl) {
            var i, hm = this.first, hk = this.lineSeparator().length;
            this.iter(function (hn) {
                var ho = hn.text.length + hk;
                if (ho > hl) {
                    i = hl;
                    return true
                }
                hl -= ho;
                ++hm
            });
            return gy(this, ab(hm, i))
        }, indexFromPos: function (hl) {
            hl = gy(this, hl);
            var i = hl.ch;
            if (hl.line < this.first || hl.ch < 0) {
                return 0
            }
            var hk = this.lineSeparator().length;
            this.iter(this.first, hl.line, function (hm) {
                i += hm.text.length + hk
            });
            return i
        }, copy: function (i) {
            var hk = new aC(be(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            hk.scrollTop = this.scrollTop;
            hk.scrollLeft = this.scrollLeft;
            hk.sel = this.sel;
            hk.extend = false;
            if (i) {
                hk.history.undoDepth = this.history.undoDepth;
                hk.setHistory(this.getHistory())
            }
            return hk
        }, linkedDoc: function (i) {
            if (!i) {
                i = {}
            }
            var hm = this.first, hl = this.first + this.size;
            if (i.from != null && i.from > hm) {
                hm = i.from
            }
            if (i.to != null && i.to < hl) {
                hl = i.to
            }
            var hk = new aC(be(this, hm, hl), i.mode || this.modeOption, hm, this.lineSep, this.direction);
            if (i.sharedHist) {
                hk.history = this.history
            }
            (this.linked || (this.linked = [])).push({doc: hk, sharedHist: i.sharedHist});
            hk.linked = [{doc: this, isParent: true, sharedHist: i.sharedHist}];
            d9(hk, fx(this));
            return hk
        }, unlinkDoc: function (hl) {
            if (hl instanceof L) {
                hl = hl.doc
            }
            if (this.linked) {
                for (var hm = 0; hm < this.linked.length; ++hm) {
                    var hn = this.linked[hm];
                    if (hn.doc != hl) {
                        continue
                    }
                    this.linked.splice(hm, 1);
                    hl.unlinkDoc(this);
                    e0(fx(this));
                    break
                }
            }
            if (hl.history == this.history) {
                var hk = [hl.id];
                eG(hl, function (i) {
                    return hk.push(i.id)
                }, true);
                hl.history = new gM(null);
                hl.history.done = b9(this.history.done, hk);
                hl.history.undone = b9(this.history.undone, hk)
            }
        }, iterLinkedDocs: function (i) {
            eG(this, i)
        }, getMode: function () {
            return this.mode
        }, getEditor: function () {
            return this.cm
        }, splitLines: function (i) {
            if (this.lineSep) {
                return i.split(this.lineSep)
            }
            return gJ(i)
        }, lineSeparator: function () {
            return this.lineSep || "\n"
        }, setDirection: c5(function (i) {
            if (i != "rtl") {
                i = "ltr"
            }
            if (i == this.direction) {
                return
            }
            this.direction = i;
            this.iter(function (hk) {
                return hk.order = null
            });
            if (this.cm) {
                ex(this.cm)
            }
        })
    });
    aC.prototype.eachLine = aC.prototype.iter;
    var an = 0;

    function bw(ht) {
        var hv = this;
        dH(hv);
        if (a2(hv, ht) || bn(hv.display, ht)) {
            return
        }
        c7(ht);
        if (ef) {
            an = +new Date
        }
        var hu = cO(hv, ht, true), hl = ht.dataTransfer.files;
        if (!hu || hv.isReadOnly()) {
            return
        }
        if (hl && hl.length && window.FileReader && window.File) {
            var hp = hl.length, hx = Array(hp), hm = 0;
            var hn = function () {
                if (++hm == hp) {
                    du(hv, function () {
                        hu = gy(hv.doc, hu);
                        var i = {
                            from: hu, to: hu, text: hv.doc.splitLines(hx.filter(function (hy) {
                                return hy != null
                            }).join(hv.doc.lineSeparator())), origin: "paste"
                        };
                        bs(hv.doc, i);
                        fT(hv.doc, fA(gy(hv.doc, hu), gy(hv.doc, dq(i))))
                    })()
                }
            };
            var hw = function (hA, hz) {
                if (hv.options.allowDropFileTypes && dP(hv.options.allowDropFileTypes, hA.type) == -1) {
                    hn();
                    return
                }
                var hy = new FileReader;
                hy.onerror = function () {
                    return hn()
                };
                hy.onload = function () {
                    var i = hy.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(i)) {
                        hn();
                        return
                    }
                    hx[hz] = i;
                    hn()
                };
                hy.readAsText(hA)
            };
            for (var hs = 0; hs < hl.length; hs++) {
                hw(hl[hs], hs)
            }
        } else {
            if (hv.state.draggingText && hv.doc.sel.contains(hu) > -1) {
                hv.state.draggingText(ht);
                setTimeout(function () {
                    return hv.display.input.focus()
                }, 20);
                return
            }
            try {
                var hk = ht.dataTransfer.getData("Text");
                if (hk) {
                    var hr;
                    if (hv.state.draggingText && !hv.state.draggingText.copy) {
                        hr = hv.listSelections()
                    }
                    e1(hv.doc, fA(hu, hu));
                    if (hr) {
                        for (var ho = 0; ho < hr.length; ++ho) {
                            bc(hv.doc, "", hr[ho].anchor, hr[ho].head, "drag")
                        }
                    }
                    hv.replaceSelection(hk, "around", "paste");
                    hv.display.input.focus()
                }
            } catch (hq) {
            }
        }
    }

    function U(i, hl) {
        if (ef && (!i.state.draggingText || +new Date - an < 100)) {
            e3(hl);
            return
        }
        if (a2(i, hl) || bn(i.display, hl)) {
            return
        }
        hl.dataTransfer.setData("Text", i.getSelection());
        hl.dataTransfer.effectAllowed = "copyMove";
        if (hl.dataTransfer.setDragImage && !aM) {
            var hk = g0("img", null, null, "position: fixed; left: 0; top: 0;");
            hk.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (eB) {
                hk.width = hk.height = 1;
                i.display.wrapper.appendChild(hk);
                hk._top = hk.offsetTop
            }
            hl.dataTransfer.setDragImage(hk, 0, 0);
            if (eB) {
                hk.parentNode.removeChild(hk)
            }
        }
    }

    function hh(i, hk) {
        var hm = cO(i, hk);
        if (!hm) {
            return
        }
        var hl = document.createDocumentFragment();
        D(i, hm, hl);
        if (!i.display.dragCursor) {
            i.display.dragCursor = g0("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            i.display.lineSpace.insertBefore(i.display.dragCursor, i.display.cursorDiv)
        }
        cd(i.display.dragCursor, hl)
    }

    function dH(i) {
        if (i.display.dragCursor) {
            i.display.lineSpace.removeChild(i.display.dragCursor);
            i.display.dragCursor = null
        }
    }

    function aJ(ho) {
        if (!document.getElementsByClassName) {
            return
        }
        var hn = document.getElementsByClassName("CodeMirror"), hm = [];
        for (var hl = 0; hl < hn.length; hl++) {
            var hk = hn[hl].CodeMirror;
            if (hk) {
                hm.push(hk)
            }
        }
        if (hm.length) {
            hm[0].operation(function () {
                for (var hp = 0; hp < hm.length; hp++) {
                    ho(hm[hp])
                }
            })
        }
    }

    var c4 = false;

    function bv() {
        if (c4) {
            return
        }
        gr();
        c4 = true
    }

    function gr() {
        var i;
        ci(window, "resize", function () {
            if (i == null) {
                i = setTimeout(function () {
                    i = null;
                    aJ(a4)
                }, 100)
            }
        });
        ci(window, "blur", function () {
            return aJ(a6)
        })
    }

    function a4(i) {
        var hk = i.display;
        hk.cachedCharWidth = hk.cachedTextHeight = hk.cachedPaddingH = null;
        hk.scrollbarsClipped = false;
        i.setSize()
    }

    var f1 = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
    };
    for (var gh = 0; gh < 10; gh++) {
        f1[gh + 48] = f1[gh + 96] = String(gh)
    }
    for (var gL = 65; gL <= 90; gL++) {
        f1[gL] = String.fromCharCode(gL)
    }
    for (var gK = 1; gK <= 12; gK++) {
        f1[gK + 111] = f1[gK + 63235] = "F" + gK
    }
    var fW = {};
    fW.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharAfter",
        Backspace: "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite",
        Esc: "singleSelection"
    };
    fW.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        fallthrough: "basic"
    };
    fW.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-D": "delWordAfter",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
    };
    fW.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        fallthrough: ["basic", "emacsy"]
    };
    fW["default"] = ct ? fW.macDefault : fW.pcDefault;

    function d0(hl) {
        var hr = hl.split(/-(?!$)/);
        hl = hr[hr.length - 1];
        var hq, hp, hk, ho;
        for (var hn = 0; hn < hr.length - 1; hn++) {
            var hm = hr[hn];
            if (/^(cmd|meta|m)$/i.test(hm)) {
                ho = true
            } else {
                if (/^a(lt)?$/i.test(hm)) {
                    hq = true
                } else {
                    if (/^(c|ctrl|control)$/i.test(hm)) {
                        hp = true
                    } else {
                        if (/^s(hift)?$/i.test(hm)) {
                            hk = true
                        } else {
                            throw new Error("Unrecognized modifier name: " + hm)
                        }
                    }
                }
            }
        }
        if (hq) {
            hl = "Alt-" + hl
        }
        if (hp) {
            hl = "Ctrl-" + hl
        }
        if (ho) {
            hl = "Cmd-" + hl
        }
        if (hk) {
            hl = "Shift-" + hl
        }
        return hl
    }

    function c8(hr) {
        var hl = {};
        for (var hq in hr) {
            if (hr.hasOwnProperty(hq)) {
                var hs = hr[hq];
                if (/^(name|fallthrough|(de|at)tach)$/.test(hq)) {
                    continue
                }
                if (hs == "...") {
                    delete hr[hq];
                    continue
                }
                var ht = ce(hq.split(" "), d0);
                for (var hp = 0; hp < ht.length; hp++) {
                    var hn = (void 0), hm = (void 0);
                    if (hp == ht.length - 1) {
                        hm = ht.join(" ");
                        hn = hs
                    } else {
                        hm = ht.slice(0, hp + 1).join(" ");
                        hn = "..."
                    }
                    var ho = hl[hm];
                    if (!ho) {
                        hl[hm] = hn
                    } else {
                        if (ho != hn) {
                            throw new Error("Inconsistent bindings for " + hm)
                        }
                    }
                }
                delete hr[hq]
            }
        }
        for (var hk in hl) {
            hr[hk] = hl[hk]
        }
        return hr
    }

    function k(hn, hq, hp, hm) {
        hq = gR(hq);
        var ho = hq.call ? hq.call(hn, hm) : hq[hn];
        if (ho === false) {
            return "nothing"
        }
        if (ho === "...") {
            return "multi"
        }
        if (ho != null && hp(ho)) {
            return "handled"
        }
        if (hq.fallthrough) {
            if (Object.prototype.toString.call(hq.fallthrough) != "[object Array]") {
                return k(hn, hq.fallthrough, hp, hm)
            }
            for (var hl = 0; hl < hq.fallthrough.length; hl++) {
                var hk = k(hn, hq.fallthrough[hl], hp, hm);
                if (hk) {
                    return hk
                }
            }
        }
    }

    function ff(hk) {
        var i = typeof hk == "string" ? hk : f1[hk.keyCode];
        return i == "Ctrl" || i == "Alt" || i == "Shift" || i == "Mod"
    }

    function gU(i, hk, hm) {
        var hl = i;
        if (hk.altKey && hl != "Alt") {
            i = "Alt-" + i
        }
        if ((cb ? hk.metaKey : hk.ctrlKey) && hl != "Ctrl") {
            i = "Ctrl-" + i
        }
        if ((cb ? hk.ctrlKey : hk.metaKey) && hl != "Mod") {
            i = "Cmd-" + i
        }
        if (!hm && hk.shiftKey && hl != "Shift") {
            i = "Shift-" + i
        }
        return i
    }

    function gb(hk, hl) {
        if (eB && hk.keyCode == 34 && hk["char"]) {
            return false
        }
        var i = f1[hk.keyCode];
        if (i == null || hk.altGraphKey) {
            return false
        }
        if (hk.keyCode == 3 && hk.code) {
            i = hk.code
        }
        return gU(i, hk, hl)
    }

    function gR(i) {
        return typeof i == "string" ? fW[i] : i
    }

    function fI(hk, hq) {
        var hl = hk.doc.sel.ranges, ho = [];
        for (var hn = 0; hn < hl.length; hn++) {
            var hm = hq(hl[hn]);
            while (ho.length && cD(hm.from, gt(ho).to) <= 0) {
                var hp = ho.pop();
                if (cD(hp.from, hm.from) < 0) {
                    hm.from = hp.from;
                    break
                }
            }
            ho.push(hm)
        }
        df(hk, function () {
            for (var hr = ho.length - 1; hr >= 0; hr--) {
                bc(hk.doc, "", ho[hr].from, ho[hr].to, "+delete")
            }
            gs(hk)
        })
    }

    function bG(i, hl, hk) {
        var hm = eU(i.text, hl + hk, hk);
        return hm < 0 || hm > i.text.length ? null : hm
    }

    function ap(i, hm, hk) {
        var hl = bG(i, hm.ch, hk);
        return hl == null ? null : new ab(hm.line, hl, hk < 0 ? "after" : "before")
    }

    function fd(hk, hs, hp, ho, hm) {
        if (hk) {
            if (hs.doc.direction == "rtl") {
                hm = -hm
            }
            var hn = a(hp, hs.doc.direction);
            if (hn) {
                var hl = hm < 0 ? gt(hn) : hn[0];
                var hu = (hm < 0) == (hl.level == 1);
                var hr = hu ? "after" : "before";
                var i;
                if (hl.level > 0 || hs.doc.direction == "rtl") {
                    var hq = bh(hs, hp);
                    i = hm < 0 ? hp.text.length - 1 : 0;
                    var ht = G(hs, hq, i).top;
                    i = cN(function (hv) {
                        return G(hs, hq, hv).top == ht
                    }, (hm < 0) == (hl.level == 1) ? hl.from : hl.to - 1, i);
                    if (hr == "before") {
                        i = bG(hp, i, 1)
                    }
                } else {
                    i = hm < 0 ? hl.to : hl.from
                }
                return new ab(ho, i, hr)
            }
        }
        return new ab(ho, hm < 0 ? hp.text.length : 0, hm < 0 ? "before" : "after")
    }

    function w(hu, hz, hn, hq) {
        var hw = a(hz, hu.doc.direction);
        if (!hw) {
            return ap(hz, hn, hq)
        }
        if (hn.ch >= hz.text.length) {
            hn.ch = hz.text.length;
            hn.sticky = "before"
        } else {
            if (hn.ch <= 0) {
                hn.ch = 0;
                hn.sticky = "after"
            }
        }
        var hm = aR(hw, hn.ch, hn.sticky), ho = hw[hm];
        if (hu.doc.direction == "ltr" && ho.level % 2 == 0 && (hq > 0 ? ho.to > hn.ch : ho.from < hn.ch)) {
            return ap(hz, hn, hq)
        }
        var hx = function (hB, hA) {
            return bG(hz, hB instanceof ab ? hB.ch : hB, hA)
        };
        var hr;
        var hv = function (hA) {
            if (!hu.options.lineWrapping) {
                return {begin: 0, end: hz.text.length}
            }
            hr = hr || bh(hu, hz);
            return bA(hu, hz, hr, hA)
        };
        var hp = hv(hn.sticky == "before" ? hx(hn, -1) : hn.ch);
        if (hu.doc.direction == "rtl" || ho.level == 1) {
            var hy = (ho.level == 1) == (hq < 0);
            var hk = hx(hn, hy ? 1 : -1);
            if (hk != null && (!hy ? hk >= ho.from && hk >= hp.begin : hk <= ho.to && hk <= hp.end)) {
                var ht = hy ? "before" : "after";
                return new ab(hn.line, hk, ht)
            }
        }
        var hl = function (hA, hD, hG) {
            var hC = function (hI, hH) {
                return hH ? new ab(hn.line, hx(hI, 1), "before") : new ab(hn.line, hI, "after")
            };
            for (; hA >= 0 && hA < hw.length; hA += hD) {
                var hB = hw[hA];
                var hE = (hD > 0) == (hB.level != 1);
                var hF = hE ? hG.begin : hx(hG.end, -1);
                if (hB.from <= hF && hF < hB.to) {
                    return hC(hF, hE)
                }
                hF = hE ? hB.from : hx(hB.to, -1);
                if (hG.begin <= hF && hF < hG.end) {
                    return hC(hF, hE)
                }
            }
        };
        var hs = hl(hm + hq, hq, hp);
        if (hs) {
            return hs
        }
        var i = hq > 0 ? hp.end : hx(hp.begin, -1);
        if (i != null && !(hq > 0 && i == hz.text.length)) {
            hs = hl(hq > 0 ? 0 : hw.length - 1, hq, hv(i));
            if (hs) {
                return hs
            }
        }
        return null
    }

    var fi = {
        selectAll: au, singleSelection: function (i) {
            return i.setSelection(i.getCursor("anchor"), i.getCursor("head"), ag)
        }, killLine: function (i) {
            return fI(i, function (hl) {
                if (hl.empty()) {
                    var hk = f0(i.doc, hl.head.line).text.length;
                    if (hl.head.ch == hk && hl.head.line < i.lastLine()) {
                        return {from: hl.head, to: ab(hl.head.line + 1, 0)}
                    } else {
                        return {from: hl.head, to: ab(hl.head.line, hk)}
                    }
                } else {
                    return {from: hl.from(), to: hl.to()}
                }
            })
        }, deleteLine: function (i) {
            return fI(i, function (hk) {
                return ({from: ab(hk.from().line, 0), to: gy(i.doc, ab(hk.to().line + 1, 0))})
            })
        }, delLineLeft: function (i) {
            return fI(i, function (hk) {
                return ({from: ab(hk.from().line, 0), to: hk.from()})
            })
        }, delWrappedLineLeft: function (i) {
            return fI(i, function (hk) {
                var hm = i.charCoords(hk.head, "div").top + 5;
                var hl = i.coordsChar({left: 0, top: hm}, "div");
                return {from: hl, to: hk.from()}
            })
        }, delWrappedLineRight: function (i) {
            return fI(i, function (hk) {
                var hm = i.charCoords(hk.head, "div").top + 5;
                var hl = i.coordsChar({left: i.display.lineDiv.offsetWidth + 100, top: hm}, "div");
                return {from: hk.from(), to: hl}
            })
        }, undo: function (i) {
            return i.undo()
        }, redo: function (i) {
            return i.redo()
        }, undoSelection: function (i) {
            return i.undoSelection()
        }, redoSelection: function (i) {
            return i.redoSelection()
        }, goDocStart: function (i) {
            return i.extendSelection(ab(i.firstLine(), 0))
        }, goDocEnd: function (i) {
            return i.extendSelection(ab(i.lastLine()))
        }, goLineStart: function (i) {
            return i.extendSelectionsBy(function (hk) {
                return bL(i, hk.head.line)
            }, {origin: "+move", bias: 1})
        }, goLineStartSmart: function (i) {
            return i.extendSelectionsBy(function (hk) {
                return ec(i, hk.head)
            }, {origin: "+move", bias: 1})
        }, goLineEnd: function (i) {
            return i.extendSelectionsBy(function (hk) {
                return el(i, hk.head.line)
            }, {origin: "+move", bias: -1})
        }, goLineRight: function (i) {
            return i.extendSelectionsBy(function (hk) {
                var hl = i.cursorCoords(hk.head, "div").top + 5;
                return i.coordsChar({left: i.display.lineDiv.offsetWidth + 100, top: hl}, "div")
            }, dp)
        }, goLineLeft: function (i) {
            return i.extendSelectionsBy(function (hk) {
                var hl = i.cursorCoords(hk.head, "div").top + 5;
                return i.coordsChar({left: 0, top: hl}, "div")
            }, dp)
        }, goLineLeftSmart: function (i) {
            return i.extendSelectionsBy(function (hk) {
                var hl = i.cursorCoords(hk.head, "div").top + 5;
                var hm = i.coordsChar({left: 0, top: hl}, "div");
                if (hm.ch < i.getLine(hm.line).search(/\S/)) {
                    return ec(i, hk.head)
                }
                return hm
            }, dp)
        }, goLineUp: function (i) {
            return i.moveV(-1, "line")
        }, goLineDown: function (i) {
            return i.moveV(1, "line")
        }, goPageUp: function (i) {
            return i.moveV(-1, "page")
        }, goPageDown: function (i) {
            return i.moveV(1, "page")
        }, goCharLeft: function (i) {
            return i.moveH(-1, "char")
        }, goCharRight: function (i) {
            return i.moveH(1, "char")
        }, goColumnLeft: function (i) {
            return i.moveH(-1, "column")
        }, goColumnRight: function (i) {
            return i.moveH(1, "column")
        }, goWordLeft: function (i) {
            return i.moveH(-1, "word")
        }, goGroupRight: function (i) {
            return i.moveH(1, "group")
        }, goGroupLeft: function (i) {
            return i.moveH(-1, "group")
        }, goWordRight: function (i) {
            return i.moveH(1, "word")
        }, delCharBefore: function (i) {
            return i.deleteH(-1, "codepoint")
        }, delCharAfter: function (i) {
            return i.deleteH(1, "char")
        }, delWordBefore: function (i) {
            return i.deleteH(-1, "word")
        }, delWordAfter: function (i) {
            return i.deleteH(1, "word")
        }, delGroupBefore: function (i) {
            return i.deleteH(-1, "group")
        }, delGroupAfter: function (i) {
            return i.deleteH(1, "group")
        }, indentAuto: function (i) {
            return i.indentSelection("smart")
        }, indentMore: function (i) {
            return i.indentSelection("add")
        }, indentLess: function (i) {
            return i.indentSelection("subtract")
        /*}, insertTab: function (i) {
            return i.replaceSelection("\t")*/
        }, insertSoftTab: function (hk) {
            var hm = [], hl = hk.listSelections(), hp = hk.options.tabSize;
            for (var ho = 0; ho < hl.length; ho++) {
                var hq = hl[ho].from();
                var hn = cc(hk.getLine(hq.line), hq.ch, hp);
                hm.push(cQ(hp - hn % hp))
            }
            hk.replaceSelections(hm)
        }, defaultTab: function (i) {
            if (i.somethingSelected()) {
                i.indentSelection("add")
            } else {
                i.execCommand("insertTab")
            }
        }, transposeChars: function (i) {
            return df(i, function () {
                var hm = i.listSelections(), hl = [];
                for (var hn = 0; hn < hm.length; hn++) {
                    if (!hm[hn].empty()) {
                        continue
                    }
                    var hp = hm[hn].head, hk = f0(i.doc, hp.line).text;
                    if (hk) {
                        if (hp.ch == hk.length) {
                            hp = new ab(hp.line, hp.ch - 1)
                        }
                        if (hp.ch > 0) {
                            hp = new ab(hp.line, hp.ch + 1);
                            i.replaceRange(hk.charAt(hp.ch - 1) + hk.charAt(hp.ch - 2), ab(hp.line, hp.ch - 2), hp, "+transpose")
                        } else {
                            if (hp.line > i.doc.first) {
                                var ho = f0(i.doc, hp.line - 1).text;
                                if (ho) {
                                    hp = new ab(hp.line, 1);
                                    i.replaceRange(hk.charAt(0) + i.doc.lineSeparator() + ho.charAt(ho.length - 1), ab(hp.line - 1, ho.length - 1), hp, "+transpose")
                                }
                            }
                        }
                    }
                    hl.push(new eu(hp, hp))
                }
                i.setSelections(hl)
            })
        }, newlineAndIndent: function (i) {
            return df(i, function () {
                var hk = i.listSelections();
                for (var hl = hk.length - 1; hl >= 0; hl--) {
                    i.replaceRange(i.doc.lineSeparator(), hk[hl].anchor, hk[hl].head, "+input")
                }
                hk = i.listSelections();
                for (var hm = 0; hm < hk.length; hm++) {
                    i.indentLine(hk[hm].from().line, null, true)
                }
                gs(i)
            })
        }, openLine: function (i) {
            return i.replaceSelection("\n", "start")
        }, toggleOverwrite: function (i) {
            return i.toggleOverwrite()
        }
    };

    function bL(i, hl) {
        var hk = f0(i.doc, hl);
        var hm = A(hk);
        if (hm != hk) {
            hl = b7(hm)
        }
        return fd(true, i, hm, hl, 1)
    }

    function el(i, hl) {
        var hk = f0(i.doc, hl);
        var hm = cJ(hk);
        if (hm != hk) {
            hl = b7(hm)
        }
        return fd(true, i, hk, hl, -1)
    }

    function ec(hk, hp) {
        var ho = bL(hk, hp.line);
        var hl = f0(hk.doc, ho.line);
        var i = a(hl, hk.doc.direction);
        if (!i || i[0].level == 0) {
            var hn = Math.max(ho.ch, hl.text.search(/\S/));
            var hm = hp.line == ho.line && hp.ch <= hn && hp.ch;
            return ab(ho.line, hm ? 0 : hn, ho.sticky)
        }
        return ho
    }

    function gI(hk, hn, i) {
        if (typeof hn == "string") {
            hn = fi[hn];
            if (!hn) {
                return false
            }
        }
        hk.display.input.ensurePolled();
        var hm = hk.display.shift, hl = false;
        try {
            if (hk.isReadOnly()) {
                hk.state.suppressEdits = true
            }
            if (i) {
                hk.display.shift = false
            }
            hl = hn(hk) != cy
        } finally {
            hk.display.shift = hm;
            hk.state.suppressEdits = false
        }
        return hl
    }

    function eH(hl, hm, ho) {
        for (var hn = 0; hn < hl.state.keyMaps.length; hn++) {
            var hk = k(hm, hl.state.keyMaps[hn], ho, hl);
            if (hk) {
                return hk
            }
        }
        return (hl.options.extraKeys && k(hm, hl.options.extraKeys, ho, hl)) || k(hm, hl.options.keyMap, ho, hl)
    }

    var eh = new hj;

    function bp(i, hl, hn, hm) {
        var hk = i.state.keySeq;
        if (hk) {
            if (ff(hl)) {
                return "handled"
            }
            if (/\'$/.test(hl)) {
                i.state.keySeq = null
            } else {
                eh.set(50, function () {
                    if (i.state.keySeq == hk) {
                        i.state.keySeq = null;
                        i.display.input.reset()
                    }
                })
            }
            if (cH(i, hk + " " + hl, hn, hm)) {
                return true
            }
        }
        return cH(i, hl, hn, hm)
    }

    function cH(hk, hl, hn, hm) {
        var i = eH(hk, hl, hm);
        if (i == "multi") {
            hk.state.keySeq = hl
        }
        if (i == "handled") {
            al(hk, "keyHandled", hk, hl, hn)
        }
        if (i == "handled" || i == "multi") {
            c7(hn);
            r(hk)
        }
        return !!i
    }

    function f3(i, hl) {
        var hk = gb(hl, true);
        if (!hk) {
            return false
        }
        if (hl.shiftKey && !i.state.keySeq) {
            return bp(i, "Shift-" + hk, hl, function (hm) {
                return gI(i, hm, true)
            }) || bp(i, hk, hl, function (hm) {
                if (typeof hm == "string" ? /^go[A-Z]/.test(hm) : hm.motion) {
                    return gI(i, hm)
                }
            })
        } else {
            return bp(i, hk, hl, function (hm) {
                return gI(i, hm)
            })
        }
    }

    function eS(i, hl, hk) {
        return bp(i, "'" + hk + "'", hl, function (hm) {
            return gI(i, hm, true)
        })
    }

    var dV = null;

    function s(hm) {
        var i = this;
        if (hm.target && hm.target != i.display.input.getField()) {
            return
        }
        i.curOp.focus = ej();
        if (a2(i, hm)) {
            return
        }
        if (ef && n < 11 && hm.keyCode == 27) {
            hm.returnValue = false
        }
        var hk = hm.keyCode;
        i.display.shift = hk == 16 || hm.shiftKey;
        var hl = f3(i, hm);
        if (eB) {
            dV = hl ? hk : null;
            if (!hl && hk == 88 && !dG && (ct ? hm.metaKey : hm.ctrlKey)) {
                i.replaceSelection("", null, "cut")
            }
        }
        if (cP && !ct && !hl && hk == 46 && hm.shiftKey && !hm.ctrlKey && document.execCommand) {
            document.execCommand("cut")
        }
        if (hk == 18 && !/\bCodeMirror-crosshair\b/.test(i.display.lineDiv.className)) {
            aB(i)
        }
    }

    function aB(hk) {
        var hl = hk.display.lineDiv;
        gn(hl, "CodeMirror-crosshair");

        function i(hm) {
            if (hm.keyCode == 18 || !hm.altKey) {
                h(hl, "CodeMirror-crosshair");
                eP(document, "keyup", i);
                eP(document, "mouseover", i)
            }
        }

        ci(document, "keyup", i);
        ci(document, "mouseover", i)
    }

    function bt(i) {
        if (i.keyCode == 16) {
            this.doc.sel.shift = false
        }
        a2(this, i)
    }

    function cY(hn) {
        var i = this;
        if (hn.target && hn.target != i.display.input.getField()) {
            return
        }
        if (bn(i.display, hn) || a2(i, hn) || hn.ctrlKey && !hn.altKey || ct && hn.metaKey) {
            return
        }
        var hm = hn.keyCode, hk = hn.charCode;
        if (eB && hm == dV) {
            dV = null;
            c7(hn);
            return
        }
        if ((eB && (!hn.which || hn.which < 10)) && f3(i, hn)) {
            return
        }
        var hl = String.fromCharCode(hk == null ? hm : hk);
        if (hl == "\x08") {
            return
        }
        if (eS(i, hn, hl)) {
            return
        }
        i.display.input.onKeyPress(hn)
    }

    var dz = 400;
    var dT = function (hk, hl, i) {
        this.time = hk;
        this.pos = hl;
        this.button = i
    };
    dT.prototype.compare = function (hk, hl, i) {
        return this.time + dz > hk && cD(hl, this.pos) == 0 && i == this.button
    };
    var dU, dK;

    function J(hl, hk) {
        var i = +new Date;
        if (dK && dK.compare(i, hl, hk)) {
            dU = dK = null;
            return "triple"
        } else {
            if (dU && dU.compare(i, hl, hk)) {
                dK = new dT(i, hl, hk);
                dU = null;
                return "double"
            } else {
                dU = new dT(i, hl, hk);
                dK = null;
                return "single"
            }
        }
    }

    function e7(hn) {
        var i = this, hm = i.display;
        if (a2(i, hn) || hm.activeTouch && hm.input.supportsTouch()) {
            return
        }
        hm.input.ensurePolled();
        hm.shift = hn.shiftKey;
        if (bn(hm, hn)) {
            if (!dt) {
                hm.scroller.draggable = false;
                setTimeout(function () {
                    return hm.scroller.draggable = true
                }, 100)
            }
            return
        }
        if (o(i, hn)) {
            return
        }
        var ho = cO(i, hn), hk = gE(hn), hl = ho ? J(ho, hk) : "single";
        window.focus();
        if (hk == 1 && i.state.selectingText) {
            i.state.selectingText(hn)
        }
        if (ho && dd(i, hk, ho, hl, hn)) {
            return
        }
        if (hk == 1) {
            if (ho) {
                aF(i, ho, hl, hn)
            } else {
                if (Q(hn) == hm.scroller) {
                    c7(hn)
                }
            }
        } else {
            if (hk == 2) {
                if (ho) {
                    gS(i.doc, ho)
                }
                setTimeout(function () {
                    return hm.input.focus()
                }, 20)
            } else {
                if (hk == 3) {
                    if (g9) {
                        i.display.input.onContextMenu(hn)
                    } else {
                        ar(i)
                    }
                }
            }
        }
    }

    function dd(i, hl, ho, hn, hm) {
        var hk = "Click";
        if (hn == "double") {
            hk = "Double" + hk
        } else {
            if (hn == "triple") {
                hk = "Triple" + hk
            }
        }
        hk = (hl == 1 ? "Left" : hl == 2 ? "Middle" : "Right") + hk;
        return bp(i, gU(hk, hm), hm, function (hq) {
            if (typeof hq == "string") {
                hq = fi[hq]
            }
            if (!hq) {
                return false
            }
            var hp = false;
            try {
                if (i.isReadOnly()) {
                    i.state.suppressEdits = true
                }
                hp = hq(i, ho) != cy
            } finally {
                i.state.suppressEdits = false
            }
            return hp
        })
    }

    function b2(i, ho, hm) {
        var hk = i.getOption("configureMouse");
        var hn = hk ? hk(i, ho, hm) : {};
        if (hn.unit == null) {
            var hl = gx ? hm.shiftKey && hm.metaKey : hm.altKey;
            hn.unit = hl ? "rectangle" : ho == "single" ? "char" : ho == "double" ? "word" : "line"
        }
        if (hn.extend == null || i.doc.extend) {
            hn.extend = i.doc.extend || hm.shiftKey
        }
        if (hn.addNew == null) {
            hn.addNew = ct ? hm.metaKey : hm.ctrlKey
        }
        if (hn.moveOnDrag == null) {
            hn.moveOnDrag = !(ct ? hm.altKey : hm.ctrlKey)
        }
        return hn
    }

    function aF(i, hp, ho, hm) {
        if (ef) {
            setTimeout(cW(u, i), 0)
        } else {
            i.curOp.focus = ej()
        }
        var hl = b2(i, ho, hm);
        var hn = i.doc.sel, hk;
        if (i.options.dragDrop && ft && !i.isReadOnly() && ho == "single" && (hk = hn.contains(hp)) > -1 && (cD((hk = hn.ranges[hk]).from(), hp) < 0 || hp.xRel > 0) && (cD(hk.to(), hp) > 0 || hp.xRel < 0)) {
            bf(i, hm, hp, hl)
        } else {
            p(i, hm, hp, hl)
        }
    }

    function bf(hq, i, hn, hk) {
        var hm = hq.display, ho = false;
        var hl = du(hq, function (hs) {
            if (dt) {
                hm.scroller.draggable = false
            }
            hq.state.draggingText = false;
            if (hq.state.delayingBlurEvent) {
                if (hq.hasFocus()) {
                    hq.state.delayingBlurEvent = false
                } else {
                    ar(hq)
                }
            }
            eP(hm.wrapper.ownerDocument, "mouseup", hl);
            eP(hm.wrapper.ownerDocument, "mousemove", hr);
            eP(hm.scroller, "dragstart", hp);
            eP(hm.scroller, "drop", hl);
            if (!ho) {
                c7(hs);
                if (!hk.addNew) {
                    gS(hq.doc, hn, null, null, hk.extend)
                }
                if ((dt && !aM) || ef && n == 9) {
                    setTimeout(function () {
                        hm.wrapper.ownerDocument.body.focus({preventScroll: true});
                        hm.input.focus()
                    }, 20)
                } else {
                    hm.input.focus()
                }
            }
        });
        var hr = function (hs) {
            ho = ho || Math.abs(i.clientX - hs.clientX) + Math.abs(i.clientY - hs.clientY) >= 10
        };
        var hp = function () {
            return ho = true
        };
        if (dt) {
            hm.scroller.draggable = true
        }
        hq.state.draggingText = hl;
        hl.copy = !hk.moveOnDrag;
        ci(hm.wrapper.ownerDocument, "mouseup", hl);
        ci(hm.wrapper.ownerDocument, "mousemove", hr);
        ci(hm.scroller, "dragstart", hp);
        ci(hm.scroller, "drop", hl);
        hq.state.delayingBlurEvent = true;
        setTimeout(function () {
            return hm.input.focus()
        }, 20);
        if (hm.scroller.dragDrop) {
            hm.scroller.dragDrop()
        }
    }

    function ep(hk, hm, hl) {
        if (hl == "char") {
            return new eu(hm, hm)
        }
        if (hl == "word") {
            return hk.findWordAt(hm)
        }
        if (hl == "line") {
            return new eu(ab(hm.line, 0), gy(hk.doc, ab(hm.line + 1, 0)))
        }
        var i = hl(hk, hm);
        return new eu(i.from, i.to)
    }

    function p(hm, hy, hl, hq) {
        if (ef) {
            ar(hm)
        }
        var hx = hm.display, hB = hm.doc;
        c7(hy);
        var hk, hA, hn = hB.sel, i = hn.ranges;
        if (hq.addNew && !hq.extend) {
            hA = hB.sel.contains(hl);
            if (hA > -1) {
                hk = i[hA]
            } else {
                hk = new eu(hl, hl)
            }
        } else {
            hk = hB.sel.primary();
            hA = hB.sel.primIndex
        }
        if (hq.unit == "rectangle") {
            if (!hq.addNew) {
                hk = new eu(hl, hl)
            }
            hl = cO(hm, hy, true, true);
            hA = -1
        } else {
            var hr = ep(hm, hl, hq.unit);
            if (hq.extend) {
                hk = gf(hk, hr.anchor, hr.head, hq.extend)
            } else {
                hk = hr
            }
        }
        if (!hq.addNew) {
            hA = 0;
            cf(hB, new gZ([hk], 0), R);
            hn = hB.sel
        } else {
            if (hA == -1) {
                hA = i.length;
                cf(hB, cX(hm, i.concat([hk]), hA), {scroll: false, origin: "*mouse"})
            } else {
                if (i.length > 1 && i[hA].empty() && hq.unit == "char" && !hq.extend) {
                    cf(hB, cX(hm, i.slice(0, hA).concat(i.slice(hA + 1)), 0), {scroll: false, origin: "*mouse"});
                    hn = hB.sel
                } else {
                    e(hB, hA, hk, R)
                }
            }
        }
        var hw = hl;

        function hv(hN) {
            if (cD(hw, hN) == 0) {
                return
            }
            hw = hN;
            if (hq.unit == "rectangle") {
                var hE = [], hK = hm.options.tabSize;
                var hD = cc(f0(hB, hl.line).text, hl.ch, hK);
                var hQ = cc(f0(hB, hN.line).text, hN.ch, hK);
                var hF = Math.min(hD, hQ), hO = Math.max(hD, hQ);
                for (var hR = Math.min(hl.line, hN.line), hH = Math.min(hm.lastLine(), Math.max(hl.line, hN.line)); hR <= hH; hR++) {
                    var hP = f0(hB, hR).text, hG = e2(hP, hF, hK);
                    if (hF == hO) {
                        hE.push(new eu(ab(hR, hG), ab(hR, hG)))
                    } else {
                        if (hP.length > hG) {
                            hE.push(new eu(ab(hR, hG), ab(hR, e2(hP, hO, hK))))
                        }
                    }
                }
                if (!hE.length) {
                    hE.push(new eu(hl, hl))
                }
                cf(hB, cX(hm, hn.ranges.slice(0, hA).concat(hE), hA), {origin: "*mouse", scroll: false});
                hm.scrollIntoView(hN)
            } else {
                var hL = hk;
                var hJ = ep(hm, hN, hq.unit);
                var hI = hL.anchor, hM;
                if (cD(hJ.anchor, hI) > 0) {
                    hM = hJ.head;
                    hI = aA(hL.from(), hJ.anchor)
                } else {
                    hM = hJ.anchor;
                    hI = bQ(hL.to(), hJ.head)
                }
                var hC = hn.ranges.slice(0);
                hC[hA] = at(hm, new eu(gy(hB, hI), hM));
                cf(hB, cX(hm, hC, hA), R)
            }
        }

        var ht = hx.wrapper.getBoundingClientRect();
        var ho = 0;

        function hz(hE) {
            var hC = ++ho;
            var hG = cO(hm, hE, true, hq.unit == "rectangle");
            if (!hG) {
                return
            }
            if (cD(hG, hw) != 0) {
                hm.curOp.focus = ej();
                hv(hG);
                var hF = cs(hx, hB);
                if (hG.line >= hF.to || hG.line < hF.from) {
                    setTimeout(du(hm, function () {
                        if (ho == hC) {
                            hz(hE)
                        }
                    }), 150)
                }
            } else {
                var hD = hE.clientY < ht.top ? -20 : hE.clientY > ht.bottom ? 20 : 0;
                if (hD) {
                    setTimeout(du(hm, function () {
                        if (ho != hC) {
                            return
                        }
                        hx.scroller.scrollTop += hD;
                        hz(hE)
                    }), 50)
                }
            }
        }

        function hs(hC) {
            hm.state.selectingText = false;
            ho = Infinity;
            if (hC) {
                c7(hC);
                hx.input.focus()
            }
            eP(hx.wrapper.ownerDocument, "mousemove", hu);
            eP(hx.wrapper.ownerDocument, "mouseup", hp);
            hB.history.lastSelOrigin = null
        }

        var hu = du(hm, function (hC) {
            if (hC.buttons === 0 || !gE(hC)) {
                hs(hC)
            } else {
                hz(hC)
            }
        });
        var hp = du(hm, hs);
        hm.state.selectingText = hp;
        ci(hx.wrapper.ownerDocument, "mousemove", hu);
        ci(hx.wrapper.ownerDocument, "mouseup", hp)
    }

    function at(hy, hr) {
        var hq = hr.anchor;
        var hv = hr.head;
        var hu = f0(hy.doc, hq.line);
        if (cD(hq, hv) == 0 && hq.sticky == hv.sticky) {
            return hr
        }
        var hn = a(hu);
        if (!hn) {
            return hr
        }
        var ht = aR(hn, hq.ch, hq.sticky), hl = hn[ht];
        if (hl.from != hq.ch && hl.to != hq.ch) {
            return hr
        }
        var hk = ht + ((hl.from == hq.ch) == (hl.level != 1) ? 0 : 1);
        if (hk == 0 || hk == hn.length) {
            return hr
        }
        var hs;
        if (hv.line != hq.line) {
            hs = (hv.line - hq.line) * (hy.doc.direction == "ltr" ? 1 : -1) > 0
        } else {
            var hp = aR(hn, hv.ch, hv.sticky);
            var hm = hp - ht || (hv.ch - hq.ch) * (hl.level == 1 ? -1 : 1);
            if (hp == hk - 1 || hp == hk) {
                hs = hm < 0
            } else {
                hs = hm > 0
            }
        }
        var ho = hn[hk + (hs ? -1 : 0)];
        var hx = hs == (ho.level == 1);
        var i = hx ? ho.from : ho.to, hw = hx ? "after" : "before";
        return hq.ch == i && hq.sticky == hw ? hr : new eu(new ab(hq.line, i, hw), hv)
    }

    function hi(hv, hr, ht, hu) {
        var hl, hk;
        if (hr.touches) {
            hl = hr.touches[0].clientX;
            hk = hr.touches[0].clientY
        } else {
            try {
                hl = hr.clientX;
                hk = hr.clientY
            } catch (hn) {
                return false
            }
        }
        if (hl >= Math.floor(hv.display.gutters.getBoundingClientRect().right)) {
            return false
        }
        if (hu) {
            c7(hr)
        }
        var hs = hv.display;
        var hq = hs.lineDiv.getBoundingClientRect();
        if (hk > hq.bottom || !f5(hv, ht)) {
            return b5(hr)
        }
        hk -= hq.top - hs.viewOffset;
        for (var ho = 0; ho < hv.display.gutterSpecs.length; ++ho) {
            var hp = hs.gutters.childNodes[ho];
            if (hp && hp.getBoundingClientRect().right >= hl) {
                var hw = b0(hv.doc, hk);
                var hm = hv.display.gutterSpecs[ho];
                aN(hv, ht, hv, hw, hm.className, hr);
                return b5(hr)
            }
        }
    }

    function o(i, hk) {
        return hi(i, hk, "gutterClick", true)
    }

    function aG(i, hk) {
        if (bn(i.display, hk) || dN(i, hk)) {
            return
        }
        if (a2(i, hk, "contextmenu")) {
            return
        }
        if (!g9) {
            i.display.input.onContextMenu(hk)
        }
    }

    function dN(i, hk) {
        if (!f5(i, "gutterContextMenu")) {
            return false
        }
        return hi(i, hk, "gutterContextMenu", false)
    }

    function dg(i) {
        i.display.wrapper.className = i.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + i.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        aq(i)
    }

    var cz = {
        toString: function () {
            return "CodeMirror.Init"
        }
    };
    var fN = {};
    var br = {};

    function fn(i) {
        var hl = i.optionHandlers;

        function hk(hm, hp, ho, hn) {
            i.defaults[hm] = hp;
            if (ho) {
                hl[hm] = hn ? function (hq, hs, hr) {
                    if (hr != cz) {
                        ho(hq, hs, hr)
                    }
                } : ho
            }
        }

        i.defineOption = hk;
        i.Init = cz;
        hk("value", "", function (hm, hn) {
            return hm.setValue(hn)
        }, true);
        hk("mode", null, function (hm, hn) {
            hm.doc.modeOption = hn;
            bJ(hm)
        }, true);
        hk("indentUnit", 2, bJ, true);
        hk("indentWithTabs", false);
        hk("smartIndent", true);
        hk("tabSize", 4, function (hm) {
            eX(hm);
            aq(hm);
            ao(hm)
        }, true);
        hk("lineSeparator", null, function (hm, hp) {
            hm.doc.lineSep = hp;
            if (!hp) {
                return
            }
            var ho = [], hq = hm.doc.first;
            hm.doc.iter(function (hr) {
                for (var ht = 0; ;) {
                    var hs = hr.text.indexOf(hp, ht);
                    if (hs == -1) {
                        break
                    }
                    ht = hs + hp.length;
                    ho.push(ab(hq, hs))
                }
                hq++
            });
            for (var hn = ho.length - 1; hn >= 0; hn--) {
                bc(hm.doc, hp, ho[hn], ab(ho[hn].line, ho[hn].ch + hp.length))
            }
        });
        hk("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200c\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function (hm, ho, hn) {
            hm.state.specialChars = new RegExp(ho.source + (ho.test("\t") ? "" : "|\t"), "g");
            if (hn != cz) {
                hm.refresh()
            }
        });
        hk("specialCharPlaceholder", fZ, function (hm) {
            return hm.refresh()
        }, true);
        hk("electricChars", true);
        hk("inputStyle", eQ ? "contenteditable" : "textarea", function () {
            throw new Error("inputStyle can not (yet) be changed in a running editor")
        }, true);
        hk("spellcheck", false, function (hm, hn) {
            return hm.getInputField().spellcheck = hn
        }, true);
        hk("autocorrect", false, function (hm, hn) {
            return hm.getInputField().autocorrect = hn
        }, true);
        hk("autocapitalize", false, function (hm, hn) {
            return hm.getInputField().autocapitalize = hn
        }, true);
        hk("rtlMoveVisually", !a0);
        hk("wholeLineUpdateBefore", true);
        hk("theme", "default", function (hm) {
            dg(hm);
            eM(hm)
        }, true);
        hk("keyMap", "default", function (hm, hq, hn) {
            var ho = gR(hq);
            var hp = hn != cz && gR(hn);
            if (hp && hp.detach) {
                hp.detach(hm, ho)
            }
            if (ho.attach) {
                ho.attach(hm, hp || null)
            }
        });
        hk("extraKeys", null);
        hk("configureMouse", null);
        hk("lineWrapping", false, fm, true);
        hk("gutters", [], function (hm, hn) {
            hm.display.gutterSpecs = bd(hn, hm.options.lineNumbers);
            eM(hm)
        }, true);
        hk("fixedGutter", true, function (hm, hn) {
            hm.display.gutters.style.left = hn ? ev(hm.display) + "px" : "0";
            hm.refresh()
        }, true);
        hk("coverGutterNextToScrollbar", false, function (hm) {
            return fJ(hm)
        }, true);
        hk("scrollbarStyle", "native", function (hm) {
            aL(hm);
            fJ(hm);
            hm.display.scrollbars.setScrollTop(hm.doc.scrollTop);
            hm.display.scrollbars.setScrollLeft(hm.doc.scrollLeft)
        }, true);
        hk("lineNumbers", false, function (hm, hn) {
            hm.display.gutterSpecs = bd(hm.options.gutters, hn);
            eM(hm)
        }, true);
        hk("firstLineNumber", 1, eM, true);
        hk("lineNumberFormatter", function (hm) {
            return hm
        }, eM, true);
        hk("showCursorWhenSelecting", false, bV, true);
        hk("resetSelectionOnContextMenu", true);
        hk("lineWiseCopyCut", true);
        hk("pasteLinesPerSelection", true);
        hk("selectionsMayTouch", false);
        hk("readOnly", false, function (hm, hn) {
            if (hn == "nocursor") {
                a6(hm);
                hm.display.input.blur()
            }
            hm.display.input.readOnlyChanged(hn)
        });
        hk("screenReaderLabel", null, function (hm, hn) {
            hn = (hn === "") ? null : hn;
            hm.display.input.screenReaderLabelChanged(hn)
        });
        hk("disableInput", false, function (hm, hn) {
            if (!hn) {
                hm.display.input.reset()
            }
        }, true);
        hk("dragDrop", true, gX);
        hk("allowDropFileTypes", null);
        hk("cursorBlinkRate", 530);
        hk("cursorScrollMargin", 0);
        hk("cursorHeight", 1, bV, true);
        hk("singleCursorHeightPerLine", true, bV, true);
        hk("workTime", 100);
        hk("workDelay", 100);
        hk("flattenSpans", true, eX, true);
        hk("addModeClass", false, eX, true);
        hk("pollInterval", 100);
        hk("undoDepth", 200, function (hm, hn) {
            return hm.doc.history.undoDepth = hn
        });
        hk("historyEventDelay", 1250);
        hk("viewportMargin", 10, function (hm) {
            return hm.refresh()
        }, true);
        hk("maxHighlightLength", 10000, eX, true);
        hk("moveInputWithCursor", true, function (hm, hn) {
            if (!hn) {
                hm.display.input.resetPosition()
            }
        });
        hk("tabindex", null, function (hm, hn) {
            return hm.display.input.getField().tabIndex = hn || ""
        });
        hk("autofocus", null);
        hk("direction", "ltr", function (hm, hn) {
            return hm.doc.setDirection(hn)
        }, true);
        hk("phrases", null)
    }

    function gX(hk, hn, hl) {
        var ho = hl && hl != cz;
        if (!hn != !ho) {
            var hm = hk.display.dragFunctions;
            var i = hn ? ci : eP;
            i(hk.display.scroller, "dragstart", hm.start);
            i(hk.display.scroller, "dragenter", hm.enter);
            i(hk.display.scroller, "dragover", hm.over);
            i(hk.display.scroller, "dragleave", hm.leave);
            i(hk.display.scroller, "drop", hm.drop)
        }
    }

    function fm(i) {
        if (i.options.lineWrapping) {
            gn(i.display.wrapper, "CodeMirror-wrap");
            i.display.sizer.style.minWidth = "";
            i.display.sizerWidth = null
        } else {
            h(i.display.wrapper, "CodeMirror-wrap");
            f(i)
        }
        ae(i);
        ao(i);
        aq(i);
        setTimeout(function () {
            return fJ(i)
        }, 100)
    }

    function L(hk, hm) {
        var hr = this;
        if (!(this instanceof L)) {
            return new L(hk, hm)
        }
        this.options = hm = hm ? aY(hm) : {};
        aY(fN, hm, false);
        var hq = hm.value;
        if (typeof hq == "string") {
            hq = new aC(hq, hm.mode, null, hm.lineSeparator, hm.direction)
        } else {
            if (hm.mode) {
                hq.modeOption = hm.mode
            }
        }
        this.doc = hq;
        var hl = new L.inputStyles[hm.inputStyle](this);
        var hp = this.display = new fo(hk, hq, hl, hm);
        hp.wrapper.CodeMirror = this;
        dg(this);
        if (hm.lineWrapping) {
            this.display.wrapper.className += " CodeMirror-wrap"
        }
        aL(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: false,
            draggingText: false,
            highlight: new hj(),
            keySeq: null,
            specialChars: null
        };
        if (hm.autofocus && !eQ) {
            hp.input.focus()
        }
        if (ef && n < 11) {
            setTimeout(function () {
                return hr.display.input.reset(true)
            }, 20)
        }
        gH(this);
        bv();
        db(this);
        this.curOp.forceUpdate = true;
        eL(this, hq);
        if ((hm.autofocus && !eQ) || this.hasFocus()) {
            setTimeout(function () {
                if (hr.hasFocus() && !hr.state.focused) {
                    c2(hr)
                }
            }, 20)
        } else {
            a6(this)
        }
        for (var ho in br) {
            if (br.hasOwnProperty(ho)) {
                br[ho](this, hm[ho], cz)
            }
        }
        eD(this);
        if (hm.finishInit) {
            hm.finishInit(this)
        }
        for (var hn = 0; hn < bk.length; ++hn) {
            bk[hn](this)
        }
        av(this);
        if (dt && hm.lineWrapping && getComputedStyle(hp.lineDiv).textRendering == "optimizelegibility") {
            hp.lineDiv.style.textRendering = "auto"
        }
    }

    L.defaults = fN;
    L.optionHandlers = br;

    function gH(hk) {
        var ho = hk.display;
        ci(ho.scroller, "mousedown", du(hk, e7));
        if (ef && n < 11) {
            ci(ho.scroller, "dblclick", du(hk, function (hs) {
                if (a2(hk, hs)) {
                    return
                }
                var ht = cO(hk, hs);
                if (!ht || o(hk, hs) || bn(hk.display, hs)) {
                    return
                }
                c7(hs);
                var hr = hk.findWordAt(ht);
                gS(hk.doc, hr.anchor, hr.head)
            }))
        } else {
            ci(ho.scroller, "dblclick", function (hr) {
                return a2(hk, hr) || c7(hr)
            })
        }
        ci(ho.scroller, "contextmenu", function (hr) {
            return aG(hk, hr)
        });
        ci(ho.input.getField(), "contextmenu", function (hr) {
            if (!ho.scroller.contains(hr.target)) {
                aG(hk, hr)
            }
        });
        var hq, i = {end: 0};

        function hp() {
            if (ho.activeTouch) {
                hq = setTimeout(function () {
                    return ho.activeTouch = null
                }, 1000);
                i = ho.activeTouch;
                i.end = +new Date
            }
        }

        function hm(hr) {
            if (hr.touches.length != 1) {
                return false
            }
            var hs = hr.touches[0];
            return hs.radiusX <= 1 && hs.radiusY <= 1
        }

        function hl(hu, hr) {
            if (hr.left == null) {
                return true
            }
            var ht = hr.left - hu.left, hs = hr.top - hu.top;
            return ht * ht + hs * hs > 20 * 20
        }

        ci(ho.scroller, "touchstart", function (hs) {
            if (!a2(hk, hs) && !hm(hs) && !o(hk, hs)) {
                ho.input.ensurePolled();
                clearTimeout(hq);
                var hr = +new Date;
                ho.activeTouch = {start: hr, moved: false, prev: hr - i.end <= 300 ? i : null};
                if (hs.touches.length == 1) {
                    ho.activeTouch.left = hs.touches[0].pageX;
                    ho.activeTouch.top = hs.touches[0].pageY
                }
            }
        });
        ci(ho.scroller, "touchmove", function () {
            if (ho.activeTouch) {
                ho.activeTouch.moved = true
            }
        });
        ci(ho.scroller, "touchend", function (hs) {
            var hu = ho.activeTouch;
            if (hu && !bn(ho, hs) && hu.left != null && !hu.moved && new Date - hu.start < 300) {
                var ht = hk.coordsChar(ho.activeTouch, "page"), hr;
                if (!hu.prev || hl(hu, hu.prev)) {
                    hr = new eu(ht, ht)
                } else {
                    if (!hu.prev.prev || hl(hu, hu.prev.prev)) {
                        hr = hk.findWordAt(ht)
                    } else {
                        hr = new eu(ab(ht.line, 0), gy(hk.doc, ab(ht.line + 1, 0)))
                    }
                }
                hk.setSelection(hr.anchor, hr.head);
                hk.focus();
                c7(hs)
            }
            hp()
        });
        ci(ho.scroller, "touchcancel", hp);
        ci(ho.scroller, "scroll", function () {
            if (ho.scroller.clientHeight) {
                C(hk, ho.scroller.scrollTop);
                bX(hk, ho.scroller.scrollLeft, true);
                aN(hk, "scroll", hk)
            }
        });
        ci(ho.scroller, "mousewheel", function (hr) {
            return c(hk, hr)
        });
        ci(ho.scroller, "DOMMouseScroll", function (hr) {
            return c(hk, hr)
        });
        ci(ho.wrapper, "scroll", function () {
            return ho.wrapper.scrollTop = ho.wrapper.scrollLeft = 0
        });
        ho.dragFunctions = {
            enter: function (hr) {
                if (!a2(hk, hr)) {
                    e3(hr)
                }
            }, over: function (hr) {
                if (!a2(hk, hr)) {
                    hh(hk, hr);
                    e3(hr)
                }
            }, start: function (hr) {
                return U(hk, hr)
            }, drop: du(hk, bw), leave: function (hr) {
                if (!a2(hk, hr)) {
                    dH(hk)
                }
            }
        };
        var hn = ho.input.getField();


        // Переменная itemsArray является примером «базы данных».
        var itemsArray = [
            {
                id: ' div ',
                name: '<div></div>',
                type: 'feature'
            },
            {
                id: ' span ',
                name: '<span></span>',
                type: 'feature'
            }
        ];


        ci(hn, "keyup", function (hr) {

            //console.log(hr.key);
            //console.log(left);
            //console.log(match);

                /** BAKS.DEV  *************************************************** **/

                if(hr.keyCode == 9) {

                    var text = this.value;
                    text = text.split(".");
                    text = text.map(function(a){return a.trim()})

                    switch (text[0]) {

                        /** CLASS  *************************************************** **/
                        case 'class':
                            this.value = this.value.replace("class", "class=''");
                            break;

                        /** STYLE  *************************************************** **/
                        case 'style':
                            this.value = this.value.replace("style", "style=''");
                            break;

                        /** STYLE  *************************************************** **/
                        case 'id':
                            this.value = this.value.replace("id", "id=''");
                            this.setSelectionRange(this.value.length, this.value.length);
                            break;
                            
                        /** ARTICLE  *************************************************** **/
                        case 'comment':
                            this.value = this.value.replace("comment", "<!-- Комментарий -->");
                            break;

                        /** ARTICLE  *************************************************** **/
                        case 'article':
                            this.value = this.value.replace("article", "<article><h1>Заголовок1</h1></article>");
                            break;
                            
                        /** SCRIPT  *************************************************** **/
                        case 'script':
                            this.value = this.value.replace("script", "<script type='text/javascript'>Значение</script>");
                            break;

                        /** SELECT  *************************************************** **/
                        case 'select':
                            this.value = this.value.replace("select", "<select name='text'>\r" +
                                "<option disabled>Выберите из списка...</option>\r" +
                                "<option value='1'>Значение1</option>\r" +
                                "</select>");
                            break;
                            
                        /** OPTION  *************************************************** **/
                        case 'option':
                            this.value = this.value.replace("option", "<option value='text'>Значение</option>");
                            break;


                        /** TABLE  *************************************************** **/
                        case 'table':
                            this.value = this.value.replace("table", "<table>\r" +
                                "<thead>\r" +
                                "<tr><th>Колонка1</th><th>Колонка2</th></tr>\r" +
                                "</thead>\r" +
                                "<tbody>\r" +
                                "<tr><td>Значение1</td><td>Значение2</td></tr>\r" +
                                "</tbody>\r" +
                                "</table>");
                            break;


                        /** TR  *************************************************** **/
                        case 'tr':
                            if(text[1] === undefined) this.value = this.value.replace("tr", "<tr></tr>");
                            else if(text[1] == "td") this.value = this.value.replace("tr.td", "<tr>\r" +
                            "<td>Значение</td>\r" +
                            "</tr>");
                            else if(text[1] == "th") this.value = this.value.replace("tr.th", "<tr>\r" +
                            "<th>Колонка1</th>\r" +
                            "</tr>");
                            break;


                        /** TD  *************************************************** **/
                        case 'td':
                            this.value = this.value.replace("td", "<td></td>");
                            break;

                        /** TH  *************************************************** **/
                        case 'th':
                            this.value = this.value.replace("th", "<th></th>");
                            break;

                        /** UL  *************************************************** **/
                        case 'ul':
                            if(text[1] === undefined)this.value = this.value.replace("ul", "<ul class=''><li>элемент</li></ul>");
                            else if(text[1] == "class") this.value = this.value.replace("ul.class", "<ul class=''><li>элемент</li></ul>");
                            else if(text[1] == "style") this.value = this.value.replace("ul.style", "<ul style=''><li>элемент</li></ul>");
                            else this.value = this.value = this.value.replace('ul', "<ul class='"+text[1]+"'><li>элемент</li></ul>");
                            break;

                        /** LI  *************************************************** **/
                        case 'li':
                            this.value = this.value.replace("li", "<li>элемент</li>");
                            break;
                            
                        /** TEXAREA  *************************************************** **/
                        case 'textarea':
                            if(text[1] === undefined)this.value = this.value.replace("textarea", "<textarea rows='10' cols='45' name='text'></textarea>");
                            else if(text[1] === "class") this.value = this.value.replace("textarea.class", "<textarea  rows='10' cols='45' name='text' class=''></textarea>");
                            else if(text[1] === "style") this.value = this.value.replace("textarea.style", "<textarea rows='10' cols='45' name='text' style=''></textarea>");
                            else this.value = this.value.replace("textarea."+text[1], "<textarea rows='10' cols='45' name='text' class='"+text[1]+"'></textarea>");
                            break;

                        /** INPUT  *************************************************** **/
                        case 'input':
                            if(text[1] === undefined)this.value = this.value.replace("input", "<input type='button|checkbox|file|hidden|image|password|radio|reset|submit|text' name='' value=''/>");
                            else if(text[1] === "class") this.value = this.value.replace("input.class", "<input type='button|checkbox|file|hidden|image|password|radio|reset|submit|text' name='' value='' class=''/>");
                            else if(text[1] === "style") this.value = this.value.replace("input.style", "<input type='button|checkbox|file|hidden|image|password|radio|reset|submit|text' name='' value='' style=''/>");
                            else this.value = this.value.replace("input."+text[1], "<input type='button|checkbox|file|hidden|image|password|radio|reset|submit|text' name='' value='' class='"+text[1]+"'/>");
                            break;

                        case 'text':
                            this.value = this.value.replace("text", "<input type='text' name='' value='' />");

                        case 'checkbox':
                            this.value = this.value.replace("checkbox", "<input type='checkbox' name='' value='' />");

                       case 'file':
                            this.value = this.value.replace("file", "<input type='file' name='' value='' />");

                       case 'hidden':
                            this.value = this.value.replace("hidden", "<input type='hidden' name='' value='' />");

                       case 'pass':
                            this.value = this.value.replace("pass", "<input type='password' name='' value='' />");

                       case 'radio':
                            this.value = this.value.replace("radio", "<input type='radio' name='' value='' />");

                       case 'reset':
                            this.value = this.value.replace("radio", "<input type='reset' name='' value='' />");

                       case 'submit':
                            this.value = this.value.replace("submit", "<input type='submit' name='' value='' />");



                            

                        /** FORM  *************************************************** **/
                        case 'form':
                            this.value = this.value.replace("form", "<form name='' action='' method='POST|GET' enctype='application/x-www-form-urlencoded | multipart/form-data | text/plain'></form>");
                            break;

                        /** TITLE  *************************************************** **/
                        case 'title':
                            this.value = this.value.replace("title", "<title></title>");
                            break;

                        /** META  *************************************************** **/
                        case 'meta':
                            this.value = this.value.replace("meta", "<meta charset='' name='GENERATOR' content=''></meta>");
                            break;


                        /** BTN  *************************************************** **/
                        case 'btn':
                            if(text[1] === undefined)this.value = this.value.replace("btn", "<btn></btn>");
                            else if(text[1] == "class") this.value = this.value.replace("btn.class", "<button type='submit|button|reset' class=''></button>");
                            else if(text[1] == "style") this.value = this.value.replace("btn.style", "<button type='submit|button|reset' style=''></button>");
                            else this.value = this.value.replace("btn."+text[1], "<button type='submit|button|reset' class='"+text[1]+"'></button>");
                            break;
                            


                        /** STRONG  *************************************************** **/

                        case 'strong':
                            if(text[1] === undefined)this.value = this.value.replace("strong", "<strong></strong>");
                            else if(text[1] == "class") this.value = this.value.replace("strong.class", "<strong class=''></strong>");
                            else if(text[1] == "style") this.value = this.value.replace("strong.style", "<strong style=''></strong>");
                            else this.value = this.value.replace("strong."+text[1], "<strong class='"+text[1]+"'></strong>");
                            break;

                        /** HREF  *************************************************** **/
                        case 'a':
                            if(text[1] === undefined)this.value = this.value.replace("a", "<a href='#' title='Title'>Ссылка</a>");
                            else if(text[1] == "class") this.value = this.value.replace("a.class", "<a href='#' title='Title' class=''>Ссылка</a>");
                            else if(text[1] == "style") this.value = this.value.replace("a.style", "<a href='#'  style=''>Ссылка</a>");
                            else this.value = this.value.replace("a."+text[1], "<a href='#' title='Title' class='"+text[1]+"'>Ссылка</a>");
                            break;

                        /** IMG  *************************************************** **/
                        case 'img':
                            if(text[1] === undefined)this.value = this.value.replace("img", "<img src='#' alt='Alt' title='Title' />");
                            else if(text[1] == "class") this.value = this.value.replace("img.class", "<img src='#' alt='Alt' title='Title' class='Class' />");
                            else if(text[1] == "style") this.value = this.value.replace("img.style", "<img src='#' alt='Alt' title='Title' style='' />");
                            else this.value = this.value.replace("img."+text[1], "<img src='#' alt='Alt' title='Title' class='"+text[1]+"' />");
                            break;

                        /** H1  *************************************************** **/
                        case 'h1':
                            if(text[1] === undefined)this.value = this.value.replace("h1", "<h1>Заголовок1</h1>");
                            else if(text[1] == "class") this.value = this.value.replace("h1.class", "<h1 class=''>Заголовок1</h1>");
                            else if(text[1] == "style") this.value = this.value.replace("h1.style", "<h1 style=''>Заголовок1</h1>");
                            else this.value = this.value.replace("h1."+text[1], "<h1 class='"+text[1]+"'>Заголовок1</h1>");
                            break;

                        /** H2  *************************************************** **/

                        case 'h2':
                            if(text[1] === undefined)this.value = this.value.replace("h2 ", "<h2>Заголовок2</h2>");
                            else if(text[1] == "class") this.value = this.value.replace("h2.class", "<h2 class=''>Заголовок2</h2>");
                            else if(text[1] == "style") this.value = this.value.replace("h2.style", "<h2 style=''>Заголовок2</h2>");
                            else this.value = this.value.replace("h2."+text[1], "<h2 class='"+text[1]+"'>Заголовок2</h2>");
                            break;

                        /** H3  *************************************************** **/
                        case 'h3':
                            if(text[1] === undefined)this.value = this.value.replace("h3", "<h3>Заголовок3</h3>");
                            else if(text[1] == "class") this.value = this.value.replace("h3.class", "<h3 class=''>Заголовок3</h3>");
                            else if(text[1] == "style") this.value = this.value.replace("h3.style", "<h3 style=''>Заголовок3</h3>");
                            else this.value = this.value.replace("h3."+text[1], "<h3 class='"+text[1]+"'>Заголовок3</h3>");
                            break;

                        /** H4  *************************************************** **/
                        case 'h4':
                            if(text[1] === undefined)this.value = this.value.replace("h4 ", "<h4>Заголовок4</h4>");
                            else if(text[1] == "class") this.value = this.value.replace("h4.class", "<h4 class=''>Заголовок4</h4>");
                            else if(text[1] == "style") this.value = this.value.replace("h4.style", "<h4 style=''>Заголовок4</h4>");
                            else this.value = this.value.replace("h4."+text[1], "<h4 class='"+text[1]+"'>Заголовок4</h4>");
                            break;


                        /** H5  *************************************************** **/
                        case 'h5':
                            if(text[1] === undefined)this.value = this.value.replace("h5", "<h5>Заголовок5</h5>");
                            else if(text[1] == "class") this.value = this.value.replace("h5.class", "<h5 class=''>Заголовок5</h5>");
                            else if(text[1] == "style") this.value = this.value.replace("h5.style", "<h5 style=''>Заголовок5</h5>");
                            else this.value = this.value.replace("h5."+text[1], "<h5 class='"+text[1]+"'>Заголовок5</h5>");
                            break;

                        /** H6  *************************************************** **/
                        case 'h6':
                            if(text[1] === undefined)this.value = this.value.replace("h6", "<h6>Заголовок6</h6>");
                            else if(text[1] == "class") this.value = this.value.replace("h6.class", "<h6 class=''>Заголовок6</h6>");
                            else if(text[1] == "style") this.value = this.value.replace("h6.style", "<h6 style=''>Заголовок6</h6>");
                            else this.value = this.value.replace("h6."+text[1], "<h6 class='"+text[1]+"'>Заголовок6</h6>");
                            break;


                        /** HR  *************************************************** **/
                        case 'hr':
                            this.value = this.value.replace("hr", "<hr/>");
                            break;

                        /** BR  *************************************************** **/
                        case 'br':
                            this.value = this.value.replace("br", "<br/>");
                            break;

                        /** P  *************************************************** **/
                        case 'p':
                            if(text[1] === undefined) this.value = this.value.replace("p", "<p>&nbsp;</p>");
                            else if(text[1] == "class") this.value = this.value.replace("p.class", "<p class=''></p>");
                            else if(text[1] == "style") this.value = this.value.replace("p.style", "<p style=''></p>");
                            else this.value = this.value.replace("p."+text[1], "<p class='"+text[1]+"'></p>");
                            break;

                        /** SPAN  *************************************************** **/
                        case 'span':
                            if(text[1] === undefined) this.value = this.value.replace("span", "<span></span>");
                            else if(text[1] == "class") this.value = this.value.replace("span.class", "<span class=''></span>");
                            else if(text[1] == "style") this.value = this.value.replace("span.style", "<span style=''></span>");
                            else this.value = this.value.replace("span."+text[1], "<span class='"+text[1]+"'></span>");
                            break;

                        /** DIV  *************************************************** **/
                        /*case 'div ':
                            this.value = this.value.replace("div ", "<div></div>");
                            break;*/
                        case 'div':
                            if(text[1] === undefined) this.value = this.value.replace("div", "<div></div>");
                            else if(text[1] == "class") this.value = this.value.replace("div.class", "<div class=''></div>");
                            else if(text[1] == "style") this.value = this.value.replace("div.style", "<div style=''></div>");
                            else this.value = this.value.replace("div."+text[1], "<div class='"+text[1]+"'></div>");
                            break;
                        default:
                            this.value = this.value+'\t'
                            //return true;
                    }
                }


            return bt.call(hk, hr)
        });



        ci(hn, "keydown", du(hk, s));
        ci(hn, "keypress", du(hk, cY));
        ci(hn, "focus", function (hr) {
            return c2(hk, hr)
        });
        ci(hn, "blur", function (hr) {
            return a6(hk, hr)
        })
    }

    var bk = [];
    L.defineInitHook = function (i) {
        return bk.push(i)
    };

    function aj(hz, ho, hy, hm) {
        var hx = hz.doc, hl;
        if (hy == null) {
            hy = "add"
        }
        if (hy == "smart") {
            if (!hx.mode.indent) {
                hy = "prev"
            } else {
                hl = fH(hz, ho).state
            }
        }
        var hs = hz.options.tabSize;
        var hA = f0(hx, ho), hr = cc(hA.text, null, hs);
        if (hA.stateAfter) {
            hA.stateAfter = null
        }
        var hk = hA.text.match(/^\s*/)[0], hv;
        if (!hm && !/\S/.test(hA.text)) {
            hv = 0;
            hy = "not"
        } else {
            if (hy == "smart") {
                hv = hx.mode.indent(hl, hA.text.slice(hk.length), hA.text);
                if (hv == cy || hv > 150) {
                    if (!hm) {
                        return
                    }
                    hy = "prev"
                }
            }
        }
        if (hy == "prev") {
            if (ho > hx.first) {
                hv = cc(f0(hx, ho - 1).text, null, hs)
            } else {
                hv = 0
            }
        } else {
            if (hy == "add") {
                hv = hr + hz.options.indentUnit
            } else {
                if (hy == "subtract") {
                    hv = hr - hz.options.indentUnit
                } else {
                    if (typeof hy == "number") {
                        hv = hr + hy
                    }
                }
            }
        }
        hv = Math.max(0, hv);
        var hw = "", hu = 0;
        if (hz.options.indentWithTabs) {
            for (var hp = Math.floor(hv / hs); hp; --hp) {
                hu += hs;
                hw += "\t"
            }
        }
        if (hu < hv) {
            hw += cQ(hv - hu)
        }
        if (hw != hk) {
            bc(hx, hw, ab(ho, 0), ab(ho, hk.length), "+input");
            hA.stateAfter = null;
            return true
        } else {
            for (var hn = 0; hn < hx.sel.ranges.length; hn++) {
                var hq = hx.sel.ranges[hn];
                if (hq.head.line == ho && hq.head.ch < hk.length) {
                    var ht = ab(ho, hk.length);
                    e(hx, hn, new eu(ht, ht));
                    break
                }
            }
        }
    }

    var by = null;

    function dA(i) {
        by = i
    }

    function gT(hz, hp, hn, hm, hy) {
        var hx = hz.doc;
        hz.display.shift = false;
        if (!hm) {
            hm = hx.sel
        }
        var hA = +new Date - 200;
        var ho = hy == "paste" || hz.state.pasteIncoming > hA;
        var hs = gJ(hp), hk = null;
        if (ho && hm.ranges.length > 1) {
            if (by && by.text.join("\n") == hp) {
                if (hm.ranges.length % by.text.length == 0) {
                    hk = [];
                    for (var hq = 0; hq < by.text.length; hq++) {
                        hk.push(hx.splitLines(by.text[hq]))
                    }
                }
            } else {
                if (hs.length == hm.ranges.length && hz.options.pasteLinesPerSelection) {
                    hk = ce(hs, function (i) {
                        return [i]
                    })
                }
            }
        }
        var ht = hz.curOp.updateInput;
        for (var hl = hm.ranges.length - 1; hl >= 0; hl--) {
            var hr = hm.ranges[hl];
            var hw = hr.from(), hv = hr.to();
            if (hr.empty()) {
                if (hn && hn > 0) {
                    hw = ab(hw.line, hw.ch - hn)
                } else {
                    if (hz.state.overwrite && !ho) {
                        hv = ab(hv.line, Math.min(f0(hx, hv.line).text.length, hv.ch + gt(hs).length))
                    } else {
                        if (ho && by && by.lineWise && by.text.join("\n") == hs.join("\n")) {
                            hw = hv = ab(hw.line, 0)
                        }
                    }
                }
            }
            var hu = {
                from: hw,
                to: hv,
                text: hk ? hk[hl % hk.length] : hs,
                origin: hy || (ho ? "paste" : hz.state.cutIncoming > hA ? "cut" : "+input")
            };
            bs(hz.doc, hu);
            al(hz, "inputRead", hz, hu)
        }
        if (hp && !ho) {
            gP(hz, hp)
        }
        gs(hz);
        if (hz.curOp.updateInput < 2) {
            hz.curOp.updateInput = ht
        }
        hz.curOp.typing = true;
        hz.state.pasteIncoming = hz.state.cutIncoming = -1
    }

    function bm(hl, i) {
        var hk = hl.clipboardData && hl.clipboardData.getData("Text");
        if (hk) {
            hl.preventDefault();
            if (!i.isReadOnly() && !i.options.disableInput) {
                df(i, function () {
                    return gT(i, hk, 0, null, "paste")
                })
            }
            return true
        }
    }

    function gP(hk, ho) {
        if (!hk.options.electricChars || !hk.options.smartIndent) {
            return
        }
        var hp = hk.doc.sel;
        for (var hn = hp.ranges.length - 1; hn >= 0; hn--) {
            var hl = hp.ranges[hn];
            if (hl.head.ch > 100 || (hn && hp.ranges[hn - 1].head.line == hl.head.line)) {
                continue
            }
            var hq = hk.getModeAt(hl.head);
            var hr = false;
            if (hq.electricChars) {
                for (var hm = 0; hm < hq.electricChars.length; hm++) {
                    if (ho.indexOf(hq.electricChars.charAt(hm)) > -1) {
                        hr = aj(hk, hl.head.line, "smart");
                        break
                    }
                }
            } else {
                if (hq.electricInput) {
                    if (hq.electricInput.test(f0(hk.doc, hl.head.line).text.slice(0, hl.head.ch))) {
                        hr = aj(hk, hl.head.line, "smart")
                    }
                }
            }
            if (hr) {
                al(hk, "electricInput", hk, hl.head.line)
            }
        }
    }

    function dO(hk) {
        var hp = [], hm = [];
        for (var hn = 0; hn < hk.doc.sel.ranges.length; hn++) {
            var hl = hk.doc.sel.ranges[hn].head.line;
            var ho = {anchor: ab(hl, 0), head: ab(hl + 1, 0)};
            hm.push(ho);
            hp.push(hk.getRange(ho.anchor, ho.head))
        }
        return {text: hp, ranges: hm}
    }

    function gF(hm, hk, i, hl) {
        hm.setAttribute("autocorrect", i ? "" : "off");
        hm.setAttribute("autocapitalize", hl ? "" : "off");
        hm.setAttribute("spellcheck", !!hk)
    }

    function a8() {
        var i = g0("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none");
        var hk = g0("div", [i], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (dt) {
            i.style.width = "1000px"
        } else {
            i.setAttribute("wrap", "off")
        }
        if (fM) {
            i.style.border = "1px solid black"
        }
        gF(i);
        return hk
    }

    function ek(i) {
        var hk = i.optionHandlers;
        var hl = i.helpers = {};
        i.prototype = {
            constructor: i,
            focus: function () {
                window.focus();
                this.display.input.focus()
            },
            setOption: function (ho, hp) {
                var hn = this.options, hm = hn[ho];
                if (hn[ho] == hp && ho != "mode") {
                    return
                }
                hn[ho] = hp;
                if (hk.hasOwnProperty(ho)) {
                    du(this, hk[ho])(this, hp, hm)
                }
                aN(this, "optionChange", this, ho)
            },
            getOption: function (hm) {
                return this.options[hm]
            },
            getDoc: function () {
                return this.doc
            },
            addKeyMap: function (hn, hm) {
                this.state.keyMaps[hm ? "push" : "unshift"](gR(hn))
            },
            removeKeyMap: function (hn) {
                var ho = this.state.keyMaps;
                for (var hm = 0; hm < ho.length; ++hm) {
                    if (ho[hm] == hn || ho[hm].name == hn) {
                        ho.splice(hm, 1);
                        return true
                    }
                }
            },
            addOverlay: dE(function (hm, hn) {
                var ho = hm.token ? hm : i.getMode(this.options, hm);
                if (ho.startState) {
                    throw new Error("Overlays may not be stateful.")
                }
                cw(this.state.overlays, {
                    mode: ho,
                    modeSpec: hm,
                    opaque: hn && hn.opaque,
                    priority: (hn && hn.priority) || 0
                }, function (hp) {
                    return hp.priority
                });
                this.state.modeGen++;
                ao(this)
            }),
            removeOverlay: dE(function (hm) {
                var ho = this.state.overlays;
                for (var hn = 0; hn < ho.length; ++hn) {
                    var hp = ho[hn].modeSpec;
                    if (hp == hm || typeof hm == "string" && hp.name == hm) {
                        ho.splice(hn, 1);
                        this.state.modeGen++;
                        ao(this);
                        return
                    }
                }
            }),
            indentLine: dE(function (ho, hm, hn) {
                if (typeof hm != "string" && typeof hm != "number") {
                    if (hm == null) {
                        hm = this.options.smartIndent ? "smart" : "prev"
                    } else {
                        hm = hm ? "add" : "subtract"
                    }
                }
                if (cv(this.doc, ho)) {
                    aj(this, ho, hm, hn)
                }
            }),
            indentSelection: dE(function (hv) {
                var hm = this.doc.sel.ranges, hp = -1;
                for (var hr = 0; hr < hm.length; hr++) {
                    var hs = hm[hr];
                    if (!hs.empty()) {
                        var ht = hs.from(), hu = hs.to();
                        var hn = Math.max(hp, ht.line);
                        hp = Math.min(this.lastLine(), hu.line - (hu.ch ? 0 : 1)) + 1;
                        for (var hq = hn; hq < hp; ++hq) {
                            aj(this, hq, hv)
                        }
                        var ho = this.doc.sel.ranges;
                        if (ht.ch == 0 && hm.length == ho.length && ho[hr].from().ch > 0) {
                            e(this.doc, hr, new eu(ht, ho[hr].to()), ag)
                        }
                    } else {
                        if (hs.head.line > hp) {
                            aj(this, hs.head.line, hv, true);
                            hp = hs.head.line;
                            if (hr == this.doc.sel.primIndex) {
                                gs(this)
                            }
                        }
                    }
                }
            }),
            getTokenAt: function (hn, hm) {
                return cR(this, hn, hm)
            },
            getLineTokens: function (hn, hm) {
                return cR(this, ab(hn), hm, true)
            },
            getTokenTypeAt: function (ht) {
                ht = gy(this.doc, ht);
                var hp = dC(this, f0(this.doc, ht.line));
                var hr = 0, hs = (hp.length - 1) / 2, ho = ht.ch;
                var hn;
                if (ho == 0) {
                    hn = hp[2]
                } else {
                    for (; ;) {
                        var hm = (hr + hs) >> 1;
                        if ((hm ? hp[hm * 2 - 1] : 0) >= ho) {
                            hs = hm
                        } else {
                            if (hp[hm * 2 + 1] < ho) {
                                hr = hm + 1
                            } else {
                                hn = hp[hm * 2 + 2];
                                break
                            }
                        }
                    }
                }
                var hq = hn ? hn.indexOf("overlay ") : -1;
                return hq < 0 ? hn : hq == 0 ? null : hn.slice(0, hq - 1)
            },
            getModeAt: function (hn) {
                var hm = this.doc.mode;
                if (!hm.innerMode) {
                    return hm
                }
                return i.innerMode(hm, this.getTokenAt(hn).state).mode
            },
            getHelper: function (hn, hm) {
                return this.getHelpers(hn, hm)[0]
            },
            getHelpers: function (hs, hr) {
                var hu = [];
                if (!hl.hasOwnProperty(hr)) {
                    return hu
                }
                var ho = hl[hr], hq = this.getModeAt(hs);
                if (typeof hq[hr] == "string") {
                    if (ho[hq[hr]]) {
                        hu.push(ho[hq[hr]])
                    }
                } else {
                    if (hq[hr]) {
                        for (var hp = 0; hp < hq[hr].length; hp++) {
                            var hn = ho[hq[hr][hp]];
                            if (hn) {
                                hu.push(hn)
                            }
                        }
                    } else {
                        if (hq.helperType && ho[hq.helperType]) {
                            hu.push(ho[hq.helperType])
                        } else {
                            if (ho[hq.name]) {
                                hu.push(ho[hq.name])
                            }
                        }
                    }
                }
                for (var hm = 0; hm < ho._global.length; hm++) {
                    var ht = ho._global[hm];
                    if (ht.pred(hq, this) && dP(hu, ht.val) == -1) {
                        hu.push(ht.val)
                    }
                }
                return hu
            },
            getStateAfter: function (hn, hm) {
                var ho = this.doc;
                hn = dy(ho, hn == null ? ho.first + ho.size - 1 : hn);
                return fH(this, hn + 1, hm).state
            },
            cursorCoords: function (hp, hn) {
                var ho, hm = this.doc.sel.primary();
                if (hp == null) {
                    ho = hm.head
                } else {
                    if (typeof hp == "object") {
                        ho = gy(this.doc, hp)
                    } else {
                        ho = hp ? hm.from() : hm.to()
                    }
                }
                return er(this, ho, hn || "page")
            },
            charCoords: function (hn, hm) {
                return dc(this, gy(this.doc, hn), hm || "page")
            },
            coordsChar: function (hm, hn) {
                hm = hf(this, hm, hn || "page");
                return gG(this, hm.left, hm.top)
            },
            lineAtHeight: function (hm, hn) {
                hm = hf(this, {top: hm, left: 0}, hn || "page").top;
                return b0(this.doc, hm + this.display.viewOffset)
            },
            heightAtLine: function (hn, hr, hq) {
                var hm = false, ho;
                if (typeof hn == "number") {
                    var hp = this.doc.first + this.doc.size - 1;
                    if (hn < this.doc.first) {
                        hn = this.doc.first
                    } else {
                        if (hn > hp) {
                            hn = hp;
                            hm = true
                        }
                    }
                    ho = f0(this.doc, hn)
                } else {
                    ho = hn
                }
                return fz(this, ho, {top: 0, left: 0}, hr || "page", hq || hm).top + (hm ? this.doc.height - b6(ho) : 0)
            },
            defaultTextHeight: function () {
                return a9(this.display)
            },
            defaultCharWidth: function () {
                return d7(this.display)
            },
            getViewport: function () {
                return {from: this.display.viewFrom, to: this.display.viewTo}
            },
            addWidget: function (hr, ho, ht, hp, hv) {
                var hq = this.display;
                hr = er(this, gy(this.doc, hr));
                var hs = hr.bottom, hn = hr.left;
                ho.style.position = "absolute";
                ho.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(ho);
                hq.sizer.appendChild(ho);
                if (hp == "over") {
                    hs = hr.top
                } else {
                    if (hp == "above" || hp == "near") {
                        var hm = Math.max(hq.wrapper.clientHeight, this.doc.height),
                            hu = Math.max(hq.sizer.clientWidth, hq.lineSpace.clientWidth);
                        if ((hp == "above" || hr.bottom + ho.offsetHeight > hm) && hr.top > ho.offsetHeight) {
                            hs = hr.top - ho.offsetHeight
                        } else {
                            if (hr.bottom + ho.offsetHeight <= hm) {
                                hs = hr.bottom
                            }
                        }
                        if (hn + ho.offsetWidth > hu) {
                            hn = hu - ho.offsetWidth
                        }
                    }
                }
                ho.style.top = hs + "px";
                ho.style.left = ho.style.right = "";
                if (hv == "right") {
                    hn = hq.sizer.clientWidth - ho.offsetWidth;
                    ho.style.right = "0px"
                } else {
                    if (hv == "left") {
                        hn = 0
                    } else {
                        if (hv == "middle") {
                            hn = (hq.sizer.clientWidth - ho.offsetWidth) / 2
                        }
                    }
                    ho.style.left = hn + "px"
                }
                if (ht) {
                    I(this, {left: hn, top: hs, right: hn + ho.offsetWidth, bottom: hs + ho.offsetHeight})
                }
            },
            triggerOnKeyDown: dE(s),
            triggerOnKeyPress: dE(cY),
            triggerOnKeyUp: bt,
            triggerOnMouseDown: dE(e7),
            execCommand: function (hm) {
                if (fi.hasOwnProperty(hm)) {
                    return fi[hm].call(null, this)
                }
            },
            triggerElectric: dE(function (hm) {
                gP(this, hm)
            }),
            findPosH: function (hs, hp, hq, hn) {
                var hm = 1;
                if (hp < 0) {
                    hm = -1;
                    hp = -hp
                }
                var hr = gy(this.doc, hs);
                for (var ho = 0; ho < hp; ++ho) {
                    hr = bO(this.doc, hr, hm, hq, hn);
                    if (hr.hitSide) {
                        break
                    }
                }
                return hr
            },
            moveH: dE(function (hm, hn) {
                var ho = this;
                this.extendSelectionsBy(function (hp) {
                    if (ho.display.shift || ho.doc.extend || hp.empty()) {
                        return bO(ho.doc, hp.head, hm, hn, ho.options.rtlMoveVisually)
                    } else {
                        return hm < 0 ? hp.from() : hp.to()
                    }
                }, dp)
            }),
            deleteH: dE(function (hm, hn) {
                var ho = this.doc.sel, hp = this.doc;
                if (ho.somethingSelected()) {
                    hp.replaceSelection("", null, "+delete")
                } else {
                    fI(this, function (hr) {
                        var hq = bO(hp, hr.head, hm, hn, false);
                        return hm < 0 ? {from: hq, to: hr.head} : {from: hr.head, to: hq}
                    })
                }
            }),
            findPosV: function (hr, ho, hs, hu) {
                var hm = 1, hq = hu;
                if (ho < 0) {
                    hm = -1;
                    ho = -ho
                }
                var ht = gy(this.doc, hr);
                for (var hn = 0; hn < ho; ++hn) {
                    var hp = er(this, ht, "div");
                    if (hq == null) {
                        hq = hp.left
                    } else {
                        hp.left = hq
                    }
                    ht = bI(this, hp, hm, hs);
                    if (ht.hitSide) {
                        break
                    }
                }
                return ht
            },
            moveV: dE(function (hm, ho) {
                var hs = this;
                var hq = this.doc, hp = [];
                var hr = !this.display.shift && !hq.extend && hq.sel.somethingSelected();
                hq.extendSelectionsBy(function (ht) {
                    if (hr) {
                        return hm < 0 ? ht.from() : ht.to()
                    }
                    var hv = er(hs, ht.head, "div");
                    if (ht.goalColumn != null) {
                        hv.left = ht.goalColumn
                    }
                    hp.push(hv.left);
                    var hu = bI(hs, hv, hm, ho);
                    if (ho == "page" && ht == hq.sel.primary()) {
                        c9(hs, dc(hs, hu, "div").top - hv.top)
                    }
                    return hu
                }, dp);
                if (hp.length) {
                    for (var hn = 0; hn < hq.sel.ranges.length; hn++) {
                        hq.sel.ranges[hn].goalColumn = hp[hn]
                    }
                }
            }),
            findWordAt: function (ht) {
                var hr = this.doc, hp = f0(hr, ht.line).text;
                var hs = ht.ch, ho = ht.ch;
                if (hp) {
                    var hq = this.getHelper(ht, "wordChars");
                    if ((ht.sticky == "before" || ho == hp.length) && hs) {
                        --hs
                    } else {
                        ++ho
                    }
                    var hn = hp.charAt(hs);
                    var hm = c1(hn, hq) ? function (hu) {
                        return c1(hu, hq)
                    } : /\s/.test(hn) ? function (hu) {
                        return /\s/.test(hu)
                    } : function (hu) {
                        return (!/\s/.test(hu) && !c1(hu))
                    };
                    while (hs > 0 && hm(hp.charAt(hs - 1))) {
                        --hs
                    }
                    while (ho < hp.length && hm(hp.charAt(ho))) {
                        ++ho
                    }
                }
                return new eu(ab(ht.line, hs), ab(ht.line, ho))
            },
            toggleOverwrite: function (hm) {
                if (hm != null && hm == this.state.overwrite) {
                    return
                }
                if (this.state.overwrite = !this.state.overwrite) {
                    gn(this.display.cursorDiv, "CodeMirror-overwrite")
                } else {
                    h(this.display.cursorDiv, "CodeMirror-overwrite")
                }
                aN(this, "overwriteToggle", this, this.state.overwrite)
            },
            hasFocus: function () {
                return this.display.input.getField() == ej()
            },
            isReadOnly: function () {
                return !!(this.options.readOnly || this.doc.cantEdit)
            },
            scrollTo: dE(function (hm, hn) {
                fu(this, hm, hn)
            }),
            getScrollInfo: function () {
                var hm = this.display.scroller;
                return {
                    left: hm.scrollLeft,
                    top: hm.scrollTop,
                    height: hm.scrollHeight - dl(this) - this.display.barHeight,
                    width: hm.scrollWidth - dl(this) - this.display.barWidth,
                    clientHeight: dn(this),
                    clientWidth: dS(this)
                }
            },
            scrollIntoView: dE(function (hm, hn) {
                if (hm == null) {
                    hm = {from: this.doc.sel.primary().head, to: null};
                    if (hn == null) {
                        hn = this.options.cursorScrollMargin
                    }
                } else {
                    if (typeof hm == "number") {
                        hm = {from: ab(hm, 0), to: null}
                    } else {
                        if (hm.from == null) {
                            hm = {from: hm, to: null}
                        }
                    }
                }
                if (!hm.to) {
                    hm.to = hm.from
                }
                hm.margin = hn || 0;
                if (hm.from.line != null) {
                    cA(this, hm)
                } else {
                    ca(this, hm.from, hm.to, hm.margin)
                }
            }),
            setSize: dE(function (ho, hm) {
                var hq = this;
                var hn = function (hr) {
                    return typeof hr == "number" || /^\d+$/.test(String(hr)) ? hr + "px" : hr
                };
                if (ho != null) {
                    this.display.wrapper.style.width = hn(ho)
                }
                if (hm != null) {
                    this.display.wrapper.style.height = hn(hm)
                }
                if (this.options.lineWrapping) {
                    aZ(this)
                }
                var hp = this.display.viewFrom;
                this.doc.iter(hp, this.display.viewTo, function (hr) {
                    if (hr.widgets) {
                        for (var hs = 0; hs < hr.widgets.length; hs++) {
                            if (hr.widgets[hs].noHScroll) {
                                W(hq, hp, "widget");
                                break
                            }
                        }
                    }
                    ++hp
                });
                this.curOp.forceUpdate = true;
                aN(this, "refresh", this)
            }),
            operation: function (hm) {
                return df(this, hm)
            },
            startOperation: function () {
                return db(this)
            },
            endOperation: function () {
                return av(this)
            },
            refresh: dE(function () {
                var hm = this.display.cachedTextHeight;
                ao(this);
                this.curOp.forceUpdate = true;
                aq(this);
                fu(this, this.doc.scrollLeft, this.doc.scrollTop);
                dx(this.display);
                if (hm == null || Math.abs(hm - a9(this.display)) > 0.5 || this.options.lineWrapping) {
                    ae(this)
                }
                aN(this, "refresh", this)
            }),
            swapDoc: dE(function (hn) {
                var hm = this.doc;
                hm.cm = null;
                if (this.state.selectingText) {
                    this.state.selectingText()
                }
                eL(this, hn);
                aq(this);
                this.display.input.reset();
                fu(this, hn.scrollLeft, hn.scrollTop);
                this.curOp.forceScroll = true;
                al(this, "swapDoc", this, hm);
                return hm
            }),
            phrase: function (hn) {
                var hm = this.options.phrases;
                return hm && Object.prototype.hasOwnProperty.call(hm, hn) ? hm[hn] : hn
            },
            getInputField: function () {
                return this.display.input.getField()
            },
            getWrapperElement: function () {
                return this.display.wrapper
            },
            getScrollerElement: function () {
                return this.display.scroller
            },
            getGutterElement: function () {
                return this.display.gutters
            }
        };
        bS(i);
        i.registerHelper = function (hn, hm, ho) {
            if (!hl.hasOwnProperty(hn)) {
                hl[hn] = i[hn] = {_global: []}
            }
            hl[hn][hm] = ho
        };
        i.registerGlobalHelper = function (ho, hn, hm, hp) {
            i.registerHelper(ho, hn, hp);
            hl[ho]._global.push({pred: hm, val: hp})
        }
    }

    function bO(hA, ho, hu, ht, hq) {
        var hv = ho;
        var hz = hu;
        var hk = f0(hA, ho.line);
        var hn = hq && hA.direction == "rtl" ? -hu : hu;

        function hy() {
            var hB = ho.line + hn;
            if (hB < hA.first || hB >= hA.first + hA.size) {
                return false
            }
            ho = new ab(hB, ho.ch, ho.sticky);
            return hk = f0(hA, hB)
        }

        function hx(hD) {
            var hC;
            if (ht == "codepoint") {
                var hB = hk.text.charCodeAt(ho.ch + (ht > 0 ? 0 : -1));
                if (isNaN(hB)) {
                    hC = null
                } else {
                    var hE = hu > 0 ? hB >= 55296 && hB < 56320 : hB >= 56320 && hB < 57343;
                    hC = new ab(ho.line, Math.max(0, Math.min(hk.text.length, ho.ch + hu * (hE ? 2 : 1))), -hu)
                }
            } else {
                if (hq) {
                    hC = w(hA.cm, hk, ho, hu)
                } else {
                    hC = ap(hk, ho, hu)
                }
            }
            if (hC == null) {
                if (!hD && hy()) {
                    ho = fd(hq, hA.cm, hk, ho.line, hn)
                } else {
                    return false
                }
            } else {
                ho = hC
            }
            return true
        }

        if (ht == "char" || ht == "codepoint") {
            hx()
        } else {
            if (ht == "column") {
                hx(true)
            } else {
                if (ht == "word" || ht == "group") {
                    var hw = null, hr = ht == "group";
                    var i = hA.cm && hA.cm.getHelper(ho, "wordChars");
                    for (var hp = true; ; hp = false) {
                        if (hu < 0 && !hx(!hp)) {
                            break
                        }
                        var hl = hk.text.charAt(ho.ch) || "\n";
                        var hm = c1(hl, i) ? "w" : hr && hl == "\n" ? "n" : !hr || /\s/.test(hl) ? null : "p";
                        if (hr && !hp && !hm) {
                            hm = "s"
                        }
                        if (hw && hw != hm) {
                            if (hu < 0) {
                                hu = 1;
                                hx();
                                ho.sticky = "after"
                            }
                            break
                        }
                        if (hm) {
                            hw = hm
                        }
                        if (hu > 0 && !hx(!hp)) {
                            break
                        }
                    }
                }
            }
        }
        var hs = cg(hA, ho, hv, hz, true);
        if (ac(hv, hs)) {
            hs.hitSide = true
        }
        return hs
    }

    function bI(hs, hn, hk, hr) {
        var hq = hs.doc, hp = hn.left, ho;
        if (hr == "page") {
            var hm = Math.min(hs.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
            var i = Math.max(hm - 0.5 * a9(hs.display), 3);
            ho = (hk > 0 ? hn.bottom : hn.top) + hk * i
        } else {
            if (hr == "line") {
                ho = hk > 0 ? hn.bottom + 3 : hn.top - 3
            }
        }
        var hl;
        for (; ;) {
            hl = gG(hs, hp, ho);
            if (!hl.outside) {
                break
            }
            if (hk < 0 ? ho <= 0 : ho >= hq.height) {
                hl.hitSide = true;
                break
            }
            ho += hk * 5
        }
        return hl
    }

    var d1 = function (i) {
        this.cm = i;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new hj();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null
    };
    d1.prototype.init = function (hm) {
        var hp = this;
        var hl = this, i = hl.cm;
        var ho = hl.div = hm.lineDiv;
        gF(ho, i.options.spellcheck, i.options.autocorrect, i.options.autocapitalize);

        function hn(hr) {
            for (var hq = hr.target; hq; hq = hq.parentNode) {
                if (hq == ho) {
                    return true
                }
                if (/\bCodeMirror-(?:line)?widget\b/.test(hq.className)) {
                    break
                }
            }
            return false
        }

        ci(ho, "paste", function (hq) {
            if (!hn(hq) || a2(i, hq) || bm(hq, i)) {
                return
            }
            if (n <= 11) {
                setTimeout(du(i, function () {
                    return hp.updateFromDOM()
                }), 20)
            }
        });
        ci(ho, "compositionstart", function (hq) {
            hp.composing = {data: hq.data, done: false}
        });
        ci(ho, "compositionupdate", function (hq) {
            if (!hp.composing) {
                hp.composing = {data: hq.data, done: false}
            }
        });
        ci(ho, "compositionend", function (hq) {
            if (hp.composing) {
                if (hq.data != hp.composing.data) {
                    hp.readFromDOMSoon()
                }
                hp.composing.done = true
            }
        });
        ci(ho, "touchstart", function () {
            return hl.forceCompositionEnd()
        });
        ci(ho, "input", function () {
            if (!hp.composing) {
                hp.readFromDOMSoon()
            }
        });

        function hk(hu) {
            if (!hn(hu) || a2(i, hu)) {
                return
            }
            if (i.somethingSelected()) {
                dA({lineWise: false, text: i.getSelections()});
                if (hu.type == "cut") {
                    i.replaceSelection("", null, "cut")
                }
            } else {
                if (!i.options.lineWiseCopyCut) {
                    return
                } else {
                    var hr = dO(i);
                    dA({lineWise: true, text: hr.text});
                    if (hu.type == "cut") {
                        i.operation(function () {
                            i.setSelections(hr.ranges, 0, ag);
                            i.replaceSelection("", null, "cut")
                        })
                    }
                }
            }
            if (hu.clipboardData) {
                hu.clipboardData.clearData();
                var ht = by.text.join("\n");
                hu.clipboardData.setData("Text", ht);
                if (hu.clipboardData.getData("Text") == ht) {
                    hu.preventDefault();
                    return
                }
            }
            var hs = a8(), hv = hs.firstChild;
            i.display.lineSpace.insertBefore(hs, i.display.lineSpace.firstChild);
            hv.value = by.text.join("\n");
            var hq = document.activeElement;
            eg(hv);
            setTimeout(function () {
                i.display.lineSpace.removeChild(hs);
                hq.focus();
                if (hq == ho) {
                    hl.showPrimarySelection()
                }
            }, 50)
        }

        ci(ho, "copy", hk);
        ci(ho, "cut", hk)
    };
    d1.prototype.screenReaderLabelChanged = function (i) {
        if (i) {
            this.div.setAttribute("aria-label", i)
        } else {
            this.div.removeAttribute("aria-label")
        }
    };
    d1.prototype.prepareSelection = function () {
        var i = gw(this.cm, false);
        i.focus = document.activeElement == this.div;
        return i
    };
    d1.prototype.showSelection = function (hk, i) {
        if (!hk || !this.cm.display.view.length) {
            return
        }
        if (hk.focus || i) {
            this.showPrimarySelection()
        }
        this.showMultipleSelections(hk)
    };
    d1.prototype.getSelection = function () {
        return this.cm.display.wrapper.ownerDocument.getSelection()
    };
    d1.prototype.showPrimarySelection = function () {
        var hn = this.getSelection(), hx = this.cm, hq = hx.doc.sel.primary();
        var hv = hq.from(), hw = hq.to();
        if (hx.display.viewTo == hx.display.viewFrom || hv.line >= hx.display.viewTo || hw.line < hx.display.viewFrom) {
            hn.removeAllRanges();
            return
        }
        var ho = aH(hx, hn.anchorNode, hn.anchorOffset);
        var hs = aH(hx, hn.focusNode, hn.focusOffset);
        if (ho && !ho.bad && hs && !hs.bad && cD(aA(ho, hs), hv) == 0 && cD(bQ(ho, hs), hw) == 0) {
            return
        }
        var hu = hx.display.view;
        var hm = (hv.line >= hx.display.viewFrom && c0(hx, hv)) || {node: hu[0].measure.map[2], offset: 0};
        var hr = hw.line < hx.display.viewTo && c0(hx, hw);
        if (!hr) {
            var hl = hu[hu.length - 1].measure;
            var hk = hl.maps ? hl.maps[hl.maps.length - 1] : hl.map;
            hr = {node: hk[hk.length - 1], offset: hk[hk.length - 2] - hk[hk.length - 3]}
        }
        if (!hm || !hr) {
            hn.removeAllRanges();
            return
        }
        var hp = hn.rangeCount && hn.getRangeAt(0), i;
        try {
            i = cM(hm.node, hm.offset, hr.offset, hr.node)
        } catch (ht) {
        }
        if (i) {
            if (!cP && hx.state.focused) {
                hn.collapse(hm.node, hm.offset);
                if (!i.collapsed) {
                    hn.removeAllRanges();
                    hn.addRange(i)
                }
            } else {
                hn.removeAllRanges();
                hn.addRange(i)
            }
            if (hp && hn.anchorNode == null) {
                hn.addRange(hp)
            } else {
                if (cP) {
                    this.startGracePeriod()
                }
            }
        }
        this.rememberSelection()
    };
    d1.prototype.startGracePeriod = function () {
        var i = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function () {
            i.gracePeriod = false;
            if (i.selectionChanged()) {
                i.cm.operation(function () {
                    return i.cm.curOp.selectionChanged = true
                })
            }
        }, 20)
    };
    d1.prototype.showMultipleSelections = function (i) {
        cd(this.cm.display.cursorDiv, i.cursors);
        cd(this.cm.display.selectionDiv, i.selection)
    };
    d1.prototype.rememberSelection = function () {
        var i = this.getSelection();
        this.lastAnchorNode = i.anchorNode;
        this.lastAnchorOffset = i.anchorOffset;
        this.lastFocusNode = i.focusNode;
        this.lastFocusOffset = i.focusOffset
    };
    d1.prototype.selectionInEditor = function () {
        var hk = this.getSelection();
        if (!hk.rangeCount) {
            return false
        }
        var i = hk.getRangeAt(0).commonAncestorContainer;
        return ha(this.div, i)
    };
    d1.prototype.focus = function () {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || document.activeElement != this.div) {
                this.showSelection(this.prepareSelection(), true)
            }
            this.div.focus()
        }
    };
    d1.prototype.blur = function () {
        this.div.blur()
    };
    d1.prototype.getField = function () {
        return this.div
    };
    d1.prototype.supportsTouch = function () {
        return true
    };
    d1.prototype.receivedFocus = function () {
        var i = this;
        if (this.selectionInEditor()) {
            this.pollSelection()
        } else {
            df(this.cm, function () {
                return i.cm.curOp.selectionChanged = true
            })
        }

        function hk() {
            if (i.cm.state.focused) {
                i.pollSelection();
                i.polling.set(i.cm.options.pollInterval, hk)
            }
        }

        this.polling.set(this.cm.options.pollInterval, hk)
    };
    d1.prototype.selectionChanged = function () {
        var i = this.getSelection();
        return i.anchorNode != this.lastAnchorNode || i.anchorOffset != this.lastAnchorOffset || i.focusNode != this.lastFocusNode || i.focusOffset != this.lastFocusOffset
    };
    d1.prototype.pollSelection = function () {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
            return
        }
        var hm = this.getSelection(), i = this.cm;
        if (aX && dJ && this.cm.display.gutterSpecs.length && g1(hm.anchorNode)) {
            this.cm.triggerOnKeyDown({type: "keydown", keyCode: 8, preventDefault: Math.abs});
            this.blur();
            this.focus();
            return
        }
        if (this.composing) {
            return
        }
        this.rememberSelection();
        var hk = aH(i, hm.anchorNode, hm.anchorOffset);
        var hl = aH(i, hm.focusNode, hm.focusOffset);
        if (hk && hl) {
            df(i, function () {
                cf(i.doc, fA(hk, hl), ag);
                if (hk.bad || hl.bad) {
                    i.curOp.selectionChanged = true
                }
            })
        }
    };
    d1.prototype.pollContent = function () {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null
        }
        var ht = this.cm, hD = ht.display, hB = ht.doc.sel.primary();
        var hC = hB.from(), hn = hB.to();
        if (hC.ch == 0 && hC.line > ht.firstLine()) {
            hC = ab(hC.line - 1, f0(ht.doc, hC.line - 1).length)
        }
        if (hn.ch == f0(ht.doc, hn.line).text.length && hn.line < ht.lastLine()) {
            hn = ab(hn.line + 1, 0)
        }
        if (hC.line < hD.viewFrom || hn.line > hD.viewTo - 1) {
            return false
        }
        var hq, ho, hs;
        if (hC.line == hD.viewFrom || (hq = dY(ht, hC.line)) == 0) {
            ho = b7(hD.view[0].line);
            hs = hD.view[0].node
        } else {
            ho = b7(hD.view[hq].line);
            hs = hD.view[hq - 1].node.nextSibling
        }
        var hA = dY(ht, hn.line);
        var hv, hy;
        if (hA == hD.view.length - 1) {
            hv = hD.viewTo - 1;
            hy = hD.lineDiv.lastChild
        } else {
            hv = b7(hD.view[hA + 1].line) - 1;
            hy = hD.view[hA + 1].node.previousSibling
        }
        if (!hs) {
            return false
        }
        var hE = ht.doc.splitLines(gW(ht, hs, hy, ho, hv));
        var hx = g2(ht.doc, ab(ho, 0), ab(hv, f0(ht.doc, hv).text.length));
        while (hE.length > 1 && hx.length > 1) {
            if (gt(hE) == gt(hx)) {
                hE.pop();
                hx.pop();
                hv--
            } else {
                if (hE[0] == hx[0]) {
                    hE.shift();
                    hx.shift();
                    ho++
                } else {
                    break
                }
            }
        }
        var hz = 0, hl = 0;
        var hu = hE[0], hk = hx[0], i = Math.min(hu.length, hk.length);
        while (hz < i && hu.charCodeAt(hz) == hk.charCodeAt(hz)) {
            ++hz
        }
        var hr = gt(hE), hF = gt(hx);
        var hm = Math.min(hr.length - (hE.length == 1 ? hz : 0), hF.length - (hx.length == 1 ? hz : 0));
        while (hl < hm && hr.charCodeAt(hr.length - hl - 1) == hF.charCodeAt(hF.length - hl - 1)) {
            ++hl
        }
        if (hE.length == 1 && hx.length == 1 && ho == hC.line) {
            while (hz && hz > hC.ch && hr.charCodeAt(hr.length - hl - 1) == hF.charCodeAt(hF.length - hl - 1)) {
                hz--;
                hl++
            }
        }
        hE[hE.length - 1] = hr.slice(0, hr.length - hl).replace(/^\u200b+/, "");
        hE[0] = hE[0].slice(hz).replace(/\u200b+$/, "");
        var hp = ab(ho, hz);
        var hw = ab(hv, hx.length ? gt(hx).length - hl : 0);
        if (hE.length > 1 || hE[0] || cD(hp, hw)) {
            bc(ht.doc, hE, hp, hw, "+input");
            return true
        }
    };
    d1.prototype.ensurePolled = function () {
        this.forceCompositionEnd()
    };
    d1.prototype.reset = function () {
        this.forceCompositionEnd()
    };
    d1.prototype.forceCompositionEnd = function () {
        if (!this.composing) {
            return
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus()
    };
    d1.prototype.readFromDOMSoon = function () {
        var i = this;
        if (this.readDOMTimeout != null) {
            return
        }
        this.readDOMTimeout = setTimeout(function () {
            i.readDOMTimeout = null;
            if (i.composing) {
                if (i.composing.done) {
                    i.composing = null
                } else {
                    return
                }
            }
            i.updateFromDOM()
        }, 80)
    };
    d1.prototype.updateFromDOM = function () {
        var i = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
            df(this.cm, function () {
                return ao(i.cm)
            })
        }
    };
    d1.prototype.setUneditable = function (i) {
        i.contentEditable = "false"
    };
    d1.prototype.onKeyPress = function (i) {
        if (i.charCode == 0 || this.composing) {
            return
        }
        i.preventDefault();
        if (!this.cm.isReadOnly()) {
            du(this.cm, gT)(this.cm, String.fromCharCode(i.charCode == null ? i.keyCode : i.charCode), 0)
        }
    };
    d1.prototype.readOnlyChanged = function (i) {
        this.div.contentEditable = String(i != "nocursor")
    };
    d1.prototype.onContextMenu = function () {
    };
    d1.prototype.resetPosition = function () {
    };
    d1.prototype.needsContentAttribute = true;

    function c0(hp, hn) {
        var ho = fX(hp, hn.line);
        if (!ho || ho.hidden) {
            return null
        }
        var hr = f0(hp.doc, hn.line);
        var hk = cU(ho, hr, hn.line);
        var hl = a(hr, hp.doc.direction), hm = "left";
        if (hl) {
            var i = aR(hl, hn.ch);
            hm = i % 2 ? "right" : "left"
        }
        var hq = aU(hk.map, hn.ch, hm);
        hq.offset = hq.collapse == "right" ? hq.end : hq.start;
        return hq
    }

    function g1(hk) {
        for (var i = hk; i; i = i.parentNode) {
            if (/CodeMirror-gutter-wrapper/.test(i.className)) {
                return true
            }
        }
        return false
    }

    function e4(hk, i) {
        if (i) {
            hk.bad = true
        }
        return hk
    }

    function gW(hs, hq, hr, hm, hk) {
        var hu = "", hl = false, i = hs.doc.lineSeparator(), hn = false;

        function ho(hw) {
            return function (hx) {
                return hx.id == hw
            }
        }

        function hv() {
            if (hl) {
                hu += i;
                if (hn) {
                    hu += i
                }
                hl = hn = false
            }
        }

        function ht(hw) {
            if (hw) {
                hv();
                hu += hw
            }
        }

        function hp(hB) {
            if (hB.nodeType == 1) {
                var hy = hB.getAttribute("cm-text");
                if (hy) {
                    ht(hy);
                    return
                }
                var hA = hB.getAttribute("cm-marker"), hx;
                if (hA) {
                    var hC = hs.findMarks(ab(hm, 0), ab(hk + 1, 0), ho(+hA));
                    if (hC.length && (hx = hC[0].find(0))) {
                        ht(g2(hs.doc, hx.from, hx.to).join(i))
                    }
                    return
                }
                if (hB.getAttribute("contenteditable") == "false") {
                    return
                }
                var hw = /^(pre|div|p|li|table|br)$/i.test(hB.nodeName);
                if (!/^br$/i.test(hB.nodeName) && hB.textContent.length == 0) {
                    return
                }
                if (hw) {
                    hv()
                }
                for (var hz = 0; hz < hB.childNodes.length; hz++) {
                    hp(hB.childNodes[hz])
                }
                if (/^(pre|p)$/i.test(hB.nodeName)) {
                    hn = true
                }
                if (hw) {
                    hl = true
                }
            } else {
                if (hB.nodeType == 3) {
                    ht(hB.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "))
                }
            }
        }

        for (; ;) {
            hp(hq);
            if (hq == hr) {
                break
            }
            hq = hq.nextSibling;
            hn = false
        }
        return hu
    }

    function aH(hk, hn, hp) {
        var ho;
        if (hn == hk.display.lineDiv) {
            ho = hk.display.lineDiv.childNodes[hp];
            if (!ho) {
                return e4(hk.clipPos(ab(hk.display.viewTo - 1)), true)
            }
            hn = null;
            hp = 0
        } else {
            for (ho = hn; ; ho = ho.parentNode) {
                if (!ho || ho == hk.display.lineDiv) {
                    return null
                }
                if (ho.parentNode && ho.parentNode == hk.display.lineDiv) {
                    break
                }
            }
        }
        for (var hm = 0; hm < hk.display.view.length; hm++) {
            var hl = hk.display.view[hm];
            if (hl.node == ho) {
                return ah(hl, hn, hp)
            }
        }
    }

    function ah(hs, ho, hq) {
        var hl = hs.text.firstChild, hn = false;
        if (!ho || !ha(hl, ho)) {
            return e4(ab(b7(hs.line), 0), true)
        }
        if (ho == hl) {
            hn = true;
            ho = hl.childNodes[hq];
            hq = 0;
            if (!ho) {
                var hy = hs.rest ? gt(hs.rest) : hs.line;
                return e4(ab(b7(hy), hy.text.length), hn)
            }
        }
        var hp = ho.nodeType == 3 ? ho : null, hw = ho;
        if (!hp && ho.childNodes.length == 1 && ho.firstChild.nodeType == 3) {
            hp = ho.firstChild;
            if (hq) {
                hq = hp.nodeValue.length
            }
        }
        while (hw.parentNode != hl) {
            hw = hw.parentNode
        }
        var hk = hs.measure, hu = hk.maps;

        function hr(hB, hG, hD) {
            for (var hF = -1; hF < (hu ? hu.length : 0); hF++) {
                var hA = hF < 0 ? hk.map : hu[hF];
                for (var hE = 0; hE < hA.length; hE += 3) {
                    var hC = hA[hE + 2];
                    if (hC == hB || hC == hG) {
                        var hH = b7(hF < 0 ? hs.line : hs.rest[hF]);
                        var hz = hA[hE] + hD;
                        if (hD < 0 || hC != hB) {
                            hz = hA[hE + (hD ? 1 : 0)]
                        }
                        return ab(hH, hz)
                    }
                }
            }
        }

        var hx = hr(hp, hw, hq);
        if (hx) {
            return e4(hx, hn)
        }
        for (var i = hw.nextSibling, ht = hp ? hp.nodeValue.length - hq : 0; i; i = i.nextSibling) {
            hx = hr(i, i.firstChild, 0);
            if (hx) {
                return e4(ab(hx.line, hx.ch - ht), hn)
            } else {
                ht += i.textContent.length
            }
        }
        for (var hv = hw.previousSibling, hm = hq; hv; hv = hv.previousSibling) {
            hx = hr(hv, hv.firstChild, -1);
            if (hx) {
                return e4(ab(hx.line, hx.ch + hm), hn)
            } else {
                hm += hv.textContent.length
            }
        }
    }

    var ad = function (i) {
        this.cm = i;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new hj();
        this.hasSelection = false;
        this.composing = null
    };
    ad.prototype.init = function (hl) {
        var ho = this;
        var hk = this, i = this.cm;
        this.createField(hl);
        var hm = this.textarea;
        hl.wrapper.insertBefore(this.wrapper, hl.wrapper.firstChild);
        if (fM) {
            hm.style.width = "0px"
        }
        ci(hm, "input", function () {
            if (ef && n >= 9 && ho.hasSelection) {
                ho.hasSelection = null
            }
            hk.poll()
        });
        ci(hm, "paste", function (hp) {
            if (a2(i, hp) || bm(hp, i)) {
                return
            }
            i.state.pasteIncoming = +new Date;
            hk.fastPoll()
        });

        function hn(hq) {
            if (a2(i, hq)) {
                return
            }
            if (i.somethingSelected()) {
                dA({lineWise: false, text: i.getSelections()})
            } else {
                if (!i.options.lineWiseCopyCut) {
                    return
                } else {
                    var hp = dO(i);
                    dA({lineWise: true, text: hp.text});
                    if (hq.type == "cut") {
                        i.setSelections(hp.ranges, null, ag)
                    } else {
                        hk.prevInput = "";
                        hm.value = hp.text.join("\n");
                        eg(hm)
                    }
                }
            }
            if (hq.type == "cut") {
                i.state.cutIncoming = +new Date
            }
        }

        ci(hm, "cut", hn);
        ci(hm, "copy", hn);
        ci(hl.scroller, "paste", function (hq) {
            if (bn(hl, hq) || a2(i, hq)) {
                return
            }
            if (!hm.dispatchEvent) {
                i.state.pasteIncoming = +new Date;
                hk.focus();
                return
            }
            var hp = new Event("paste");
            hp.clipboardData = hq.clipboardData;
            hm.dispatchEvent(hp)
        });
        ci(hl.lineSpace, "selectstart", function (hp) {
            if (!bn(hl, hp)) {
                c7(hp)
            }
        });
        ci(hm, "compositionstart", function () {
            var hp = i.getCursor("from");
            if (hk.composing) {
                hk.composing.range.clear()
            }
            hk.composing = {start: hp, range: i.markText(hp, i.getCursor("to"), {className: "CodeMirror-composing"})}
        });
        ci(hm, "compositionend", function () {
            if (hk.composing) {
                hk.poll();
                hk.composing.range.clear();
                hk.composing = null
            }
        })
    };
    ad.prototype.createField = function (i) {
        this.wrapper = a8();
        this.textarea = this.wrapper.firstChild
    };
    ad.prototype.screenReaderLabelChanged = function (i) {
        if (i) {
            this.textarea.setAttribute("aria-label", i)
        } else {
            this.textarea.removeAttribute("aria-label")
        }
    };
    ad.prototype.prepareSelection = function () {
        var hk = this.cm, ho = hk.display, hn = hk.doc;
        var i = gw(hk);
        if (hk.options.moveInputWithCursor) {
            var hp = er(hk, hn.sel.primary().head, "div");
            var hl = ho.wrapper.getBoundingClientRect(), hm = ho.lineDiv.getBoundingClientRect();
            i.teTop = Math.max(0, Math.min(ho.wrapper.clientHeight - 10, hp.top + hm.top - hl.top));
            i.teLeft = Math.max(0, Math.min(ho.wrapper.clientWidth - 10, hp.left + hm.left - hl.left))
        }
        return i
    };
    ad.prototype.showSelection = function (hl) {
        var i = this.cm, hk = i.display;
        cd(hk.cursorDiv, hl.cursors);
        cd(hk.selectionDiv, hl.selection);
        if (hl.teTop != null) {
            this.wrapper.style.top = hl.teTop + "px";
            this.wrapper.style.left = hl.teLeft + "px"
        }
    };
    ad.prototype.reset = function (hk) {
        if (this.contextMenuPending || this.composing) {
            return
        }
        var i = this.cm;
        if (i.somethingSelected()) {
            this.prevInput = "";
            var hl = i.getSelection();
            this.textarea.value = hl;
            if (i.state.focused) {
                eg(this.textarea)
            }
            if (ef && n >= 9) {
                this.hasSelection = hl
            }
        } else {
            if (!hk) {
                this.prevInput = this.textarea.value = "";
                if (ef && n >= 9) {
                    this.hasSelection = null
                }
            }
        }
    };
    ad.prototype.getField = function () {
        return this.textarea
    };
    ad.prototype.supportsTouch = function () {
        return false
    };
    ad.prototype.focus = function () {
        if (this.cm.options.readOnly != "nocursor" && (!eQ || ej() != this.textarea)) {
            try {
                this.textarea.focus()
            } catch (i) {
            }
        }
    };
    ad.prototype.blur = function () {
        this.textarea.blur()
    };
    ad.prototype.resetPosition = function () {
        this.wrapper.style.top = this.wrapper.style.left = 0
    };
    ad.prototype.receivedFocus = function () {
        this.slowPoll()
    };
    ad.prototype.slowPoll = function () {
        var i = this;
        if (this.pollingFast) {
            return
        }
        this.polling.set(this.cm.options.pollInterval, function () {
            i.poll();
            if (i.cm.state.focused) {
                i.slowPoll()
            }
        })
    };
    ad.prototype.fastPoll = function () {
        var hk = false, i = this;
        i.pollingFast = true;

        function hl() {
            var hm = i.poll();
            if (!hm && !hk) {
                hk = true;
                i.polling.set(60, hl)
            } else {
                i.pollingFast = false;
                i.slowPoll()
            }
        }

        i.polling.set(20, hl)
    };
    ad.prototype.poll = function () {
        var hq = this;
        var i = this.cm, hl = this.textarea, hm = this.prevInput;
        if (this.contextMenuPending || !i.state.focused || (bK(hl) && !hm && !this.composing) || i.isReadOnly() || i.options.disableInput || i.state.keySeq) {
            return false
        }
        var ho = hl.value;
        if (ho == hm && !i.somethingSelected()) {
            return false
        }
        if (ef && n >= 9 && this.hasSelection === ho || ct && /[\uf700-\uf7ff]/.test(ho)) {
            i.display.input.reset();
            return false
        }
        if (i.doc.sel == i.display.selForContextMenu) {
            var hn = ho.charCodeAt(0);
            if (hn == 8203 && !hm) {
                hm = "\u200b"
            }
            if (hn == 8666) {
                this.reset();
                return this.cm.execCommand("undo")
            }
        }
        var hp = 0, hk = Math.min(hm.length, ho.length);
        while (hp < hk && hm.charCodeAt(hp) == ho.charCodeAt(hp)) {
            ++hp
        }
        df(i, function () {
            gT(i, ho.slice(hp), hm.length - hp, null, hq.composing ? "*compose" : null);
            if (ho.length > 1000 || ho.indexOf("\n") > -1) {
                hl.value = hq.prevInput = ""
            } else {
                hq.prevInput = ho
            }
            if (hq.composing) {
                hq.composing.range.clear();
                hq.composing.range = i.markText(hq.composing.start, i.getCursor("to"), {className: "CodeMirror-composing"})
            }
        });
        return true
    };
    ad.prototype.ensurePolled = function () {
        if (this.pollingFast && this.poll()) {
            this.pollingFast = false
        }
    };
    ad.prototype.onKeyPress = function () {

        if (ef && n >= 9) {
            this.hasSelection = null
        }
        this.fastPoll()
    };
    ad.prototype.onContextMenu = function (ho) {
        var ht = this, hu = ht.cm, hq = hu.display, hk = ht.textarea;
        if (ht.contextMenuPending) {
            ht.contextMenuPending()
        }
        var hs = cO(hu, ho), i = hq.scroller.scrollTop;
        if (!hs || eB) {
            return
        }
        var hn = hu.options.resetSelectionOnContextMenu;
        if (hn && hu.doc.sel.contains(hs) == -1) {
            du(hu, cf)(hu.doc, fA(hs), ag)
        }
        var hp = hk.style.cssText, hx = ht.wrapper.style.cssText;
        var hw = ht.wrapper.offsetParent.getBoundingClientRect();
        ht.wrapper.style.cssText = "position: static";
        hk.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (ho.clientY - hw.top - 5) + "px; left: " + (ho.clientX - hw.left - 5) + "px;\n      z-index: 1000; background: " + (ef ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var hv;
        if (dt) {
            hv = window.scrollY
        }
        hq.input.focus();
        if (dt) {
            window.scrollTo(null, hv)
        }
        hq.input.reset();
        if (!hu.somethingSelected()) {
            hk.value = ht.prevInput = " "
        }
        ht.contextMenuPending = hr;
        hq.selForContextMenu = hu.doc.sel;
        clearTimeout(hq.detectingSelectAll);

        function hm() {
            if (hk.selectionStart != null) {
                var hy = hu.somethingSelected();
                var hz = "\u200b" + (hy ? hk.value : "");
                hk.value = "\u21da";
                hk.value = hz;
                ht.prevInput = hy ? "" : "\u200b";
                hk.selectionStart = 1;
                hk.selectionEnd = hz.length;
                hq.selForContextMenu = hu.doc.sel
            }
        }

        function hr() {
            if (ht.contextMenuPending != hr) {
                return
            }
            ht.contextMenuPending = false;
            ht.wrapper.style.cssText = hx;
            hk.style.cssText = hp;
            if (ef && n < 9) {
                hq.scrollbars.setScrollTop(hq.scroller.scrollTop = i)
            }
            if (hk.selectionStart != null) {
                if (!ef || (ef && n < 9)) {
                    hm()
                }
                var hy = 0, hz = function () {
                    if (hq.selForContextMenu == hu.doc.sel && hk.selectionStart == 0 && hk.selectionEnd > 0 && ht.prevInput == "\u200b") {
                        du(hu, au)(hu)
                    } else {
                        if (hy++ < 10) {
                            hq.detectingSelectAll = setTimeout(hz, 500)
                        } else {
                            hq.selForContextMenu = null;
                            hq.input.reset()
                        }
                    }
                };
                hq.detectingSelectAll = setTimeout(hz, 200)
            }
        }

        if (ef && n >= 9) {
            hm()
        }
        if (g9) {
            e3(ho);
            var hl = function () {
                eP(window, "mouseup", hl);
                setTimeout(hr, 20)
            };
            ci(window, "mouseup", hl)
        } else {
            setTimeout(hr, 50)
        }
    };
    ad.prototype.readOnlyChanged = function (i) {
        if (!i) {
            this.reset()
        }
        this.textarea.disabled = i == "nocursor";
        this.textarea.readOnly = !!i
    };
    ad.prototype.setUneditable = function () {
    };
    ad.prototype.needsContentAttribute = false;

    function gu(hq, hr) {
        hr = hr ? aY(hr) : {};
        hr.value = hq.value;
        if (!hr.tabindex && hq.tabIndex) {
            hr.tabindex = hq.tabIndex
        }
        if (!hr.placeholder && hq.placeholder) {
            hr.placeholder = hq.placeholder
        }
        if (hr.autofocus == null) {
            var i = ej();
            hr.autofocus = i == hq || hq.getAttribute("autofocus") != null && i == document.body
        }

        function hn() {
            hq.value = hp.getValue()
        }

        var ho;
        if (hq.form) {
            ci(hq.form, "submit", hn);
            if (!hr.leaveSubmitMethodAlone) {
                var hk = hq.form;
                ho = hk.submit;
                try {
                    var hm = hk.submit = function () {
                        hn();
                        hk.submit = ho;
                        hk.submit();
                        hk.submit = hm
                    }
                } catch (hl) {
                }
            }
        }
        hr.finishInit = function (hs) {
            hs.save = hn;
            hs.getTextArea = function () {
                return hq
            };
            hs.toTextArea = function () {
                hs.toTextArea = isNaN;
                hn();
                hq.parentNode.removeChild(hs.getWrapperElement());
                hq.style.display = "";
                if (hq.form) {
                    eP(hq.form, "submit", hn);
                    if (!hr.leaveSubmitMethodAlone && typeof hq.form.submit == "function") {
                        hq.form.submit = ho
                    }
                }
            }
        };
        hq.style.display = "none";
        var hp = L(function (hs) {
            return hq.parentNode.insertBefore(hs, hq.nextSibling)
        }, hr);
        return hp
    }

    function gz(i) {
        i.off = eP;
        i.on = ci;
        i.wheelEventPixels = aI;
        i.Doc = aC;
        i.splitLines = gJ;
        i.countColumn = cc;
        i.findColumn = e2;
        i.isWordChar = gq;
        i.Pass = cy;
        i.signal = aN;
        i.Line = g4;
        i.changeEnd = dq;
        i.scrollbarModel = bz;
        i.Pos = ab;
        i.cmpPos = cD;
        i.modes = dZ;
        i.mimeModes = a3;
        i.resolveMode = hb;
        i.getMode = gm;
        i.modeExtensions = dW;
        i.extendMode = fj;
        i.copyState = cp;
        i.startState = cm;
        i.innerMode = g7;
        i.commands = fi;
        i.keyMap = fW;
        i.keyName = gb;
        i.isModifierKey = ff;
        i.lookupKey = k;
        i.normalizeKeyMap = c8;
        i.StringStream = fD;
        i.SharedTextMarker = z;
        i.TextMarker = V;
        i.LineWidget = d6;
        i.e_preventDefault = c7;
        i.e_stopPropagation = dX;
        i.e_stop = e3;
        i.addClass = gn;
        i.contains = ha;
        i.rmClass = h;
        i.keyNames = f1
    }

    fn(L);
    ek(L);
    var d = "iter insert remove copy getEditor constructor".split(" ");
    for (var b4 in aC.prototype) {
        if (aC.prototype.hasOwnProperty(b4) && dP(d, b4) < 0) {
            L.prototype[b4] = (function (i) {
                return function () {
                    return i.apply(this.doc, arguments)
                }
            })(aC.prototype[b4])
        }
    }
    bS(aC);
    L.inputStyles = {textarea: ad, contenteditable: d1};
    L.defineMode = function (i) {
        if (!L.defaults.mode && i != "null") {
            L.defaults.mode = i
        }
        e6.apply(this, arguments)
    };
    L.defineMIME = bD;
    L.defineMode("null", function () {
        return ({
            token: function (i) {
                return i.skipToEnd()
            }
        })
    });
    L.defineMIME("text/plain", "null");
    L.defineExtension = function (i, hk) {
        L.prototype[i] = hk
    };
    L.defineDocExtension = function (i, hk) {
        aC.prototype[i] = hk
    };
    L.fromTextArea = gu;
    gz(L);
    L.version = "5.59.1";
    return L
})));
(function (a) {
    "function" == typeof a.define && a.define("core", ["codemirror.js"], function (b) {
        a.CodeMirror = b
    })
})(this);