var Ue = globalThis, et = Ue.ShadowRoot && (Ue.ShadyCSS === void 0 || Ue.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = /* @__PURE__ */ Symbol(), Ct = /* @__PURE__ */ new WeakMap(), ir = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (et && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Ct.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Ct.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}, jr = (e) => new ir(typeof e == "string" ? e : e + "", void 0, tt), Dr = (e, ...t) => new ir(e.length === 1 ? e[0] : t.reduce((r, n, s) => r + ((i) => {
  if (i._$cssResult$ === !0) return i.cssText;
  if (typeof i == "number") return i;
  throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[s + 1], e[0]), e, tt), Or = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const n = document.createElement("style"), s = Ue.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = r.cssText, e.appendChild(n);
  }
}, Mt = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const n of t.cssRules) r += n.cssText;
  return jr(r);
})(e) : e, { is: Sr, defineProperty: Wr, getOwnPropertyDescriptor: Fr, getOwnPropertyNames: Gr, getOwnPropertySymbols: qr, getPrototypeOf: Vr } = Object, Re = globalThis, It = Re.trustedTypes, Kr = It ? It.emptyScript : "", Xr = Re.reactiveElementPolyfillSupport, fe = (e, t) => e, Te = {
  toAttribute(e, t) {
    switch (t) {
      case Boolean:
        e = e ? Kr : null;
        break;
      case Object:
      case Array:
        e = e == null ? e : JSON.stringify(e);
    }
    return e;
  },
  fromAttribute(e, t) {
    let r = e;
    switch (t) {
      case Boolean:
        r = e !== null;
        break;
      case Number:
        r = e === null ? null : Number(e);
        break;
      case Object:
      case Array:
        try {
          r = JSON.parse(e);
        } catch {
          r = null;
        }
    }
    return r;
  }
}, rt = (e, t) => !Sr(e, t), Et = {
  attribute: !0,
  type: String,
  converter: Te,
  reflect: !1,
  useDefault: !1,
  hasChanged: rt
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Re.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var ie = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Et) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && Wr(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: s } = Fr(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(i) {
        this[t] = i;
      }
    };
    return {
      get: n,
      set(i) {
        const o = n?.call(this);
        s?.call(this, i), this.requestUpdate(e, o, r);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Et;
  }
  static _$Ei() {
    if (this.hasOwnProperty(fe("elementProperties"))) return;
    const e = Vr(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(fe("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(fe("properties"))) {
      const t = this.properties, r = [...Gr(t), ...qr(t)];
      for (const n of r) this.createProperty(n, t[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, n] of t) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const n = this._$Eu(t, r);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const n of r) t.unshift(Mt(n));
    } else e !== void 0 && t.push(Mt(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Or(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, r);
    if (n !== void 0 && r.reflect === !0) {
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : Te).toAttribute(t, r.type);
      this._$Em = e, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const s = r.getPropertyOptions(n), i = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : Te;
      this._$Em = n;
      const o = i.fromAttribute(t, s.type);
      this[n] = o ?? this._$Ej?.get(n) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, n = !1, s) {
    if (e !== void 0) {
      const i = this.constructor;
      if (n === !1 && (s = this[e]), r ??= i.getPropertyOptions(e), !((r.hasChanged ?? rt)(s, t) || r.useDefault && r.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(i._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: n, wrapped: s }, i) {
    r && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, i ?? t ?? this[e]), s !== !0 || i !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, s] of r) {
        const { wrapped: i } = s, o = this[n];
        i !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, s, o);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
ie.elementStyles = [], ie.shadowRootOptions = { mode: "open" }, ie[fe("elementProperties")] = /* @__PURE__ */ new Map(), ie[fe("finalized")] = /* @__PURE__ */ new Map(), Xr?.({ ReactiveElement: ie }), (Re.reactiveElementVersions ??= []).push("2.1.2");
var nt = globalThis, At = (e) => e, Le = nt.trustedTypes, Ut = Le ? Le.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, or = "$lit$", K = `lit$${Math.random().toFixed(9).slice(2)}$`, ar = "?" + K, Jr = `<${ar}>`, Q = document, be = () => Q.createComment(""), $e = (e) => e === null || typeof e != "object" && typeof e != "function", st = Array.isArray, Zr = (e) => st(e) || typeof e?.[Symbol.iterator] == "function", qe = `[ 	
\f\r]`, he = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zt = /-->/g, Tt = />/g, X = RegExp(`>|${qe}(?:([^\\s"'>=/]+)(${qe}*=${qe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Lt = /'/g, Rt = /"/g, cr = /^(?:script|style|textarea|title)$/i, it = (e) => (t, ...r) => ({
  _$litType$: e,
  strings: t,
  values: r
}), W = it(1), z = it(2), li = it(3), oe = /* @__PURE__ */ Symbol.for("lit-noChange"), k = /* @__PURE__ */ Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), J = Q.createTreeWalker(Q, 129);
function lr(e, t) {
  if (!st(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ut !== void 0 ? Ut.createHTML(t) : t;
}
var Yr = (e, t) => {
  const r = e.length - 1, n = [];
  let s, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = he;
  for (let a = 0; a < r; a++) {
    const c = e[a];
    let d, l, u = -1, $ = 0;
    for (; $ < c.length && (o.lastIndex = $, l = o.exec(c), l !== null); ) $ = o.lastIndex, o === he ? l[1] === "!--" ? o = zt : l[1] !== void 0 ? o = Tt : l[2] !== void 0 ? (cr.test(l[2]) && (s = RegExp("</" + l[2], "g")), o = X) : l[3] !== void 0 && (o = X) : o === X ? l[0] === ">" ? (o = s ?? he, u = -1) : l[1] === void 0 ? u = -2 : (u = o.lastIndex - l[2].length, d = l[1], o = l[3] === void 0 ? X : l[3] === '"' ? Rt : Lt) : o === Rt || o === Lt ? o = X : o === zt || o === Tt ? o = he : (o = X, s = void 0);
    const b = o === X && e[a + 1].startsWith("/>") ? " " : "";
    i += o === he ? c + Jr : u >= 0 ? (n.push(d), c.slice(0, u) + or + c.slice(u) + K + b) : c + K + (u === -2 ? a : b);
  }
  return [lr(e, i + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
}, Ke = class dr {
  constructor({ strings: t, _$litType$: r }, n) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const a = t.length - 1, c = this.parts, [d, l] = Yr(t, r);
    if (this.el = dr.createElement(d, n), J.currentNode = this.el.content, r === 2 || r === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = J.nextNode()) !== null && c.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(or)) {
          const $ = l[o++], b = s.getAttribute(u).split(K), f = /([.?@])?(.*)/.exec($);
          c.push({
            type: 1,
            index: i,
            name: f[2],
            strings: b,
            ctor: f[1] === "." ? en : f[1] === "?" ? tn : f[1] === "@" ? rn : Ne
          }), s.removeAttribute(u);
        } else u.startsWith(K) && (c.push({
          type: 6,
          index: i
        }), s.removeAttribute(u));
        if (cr.test(s.tagName)) {
          const u = s.textContent.split(K), $ = u.length - 1;
          if ($ > 0) {
            s.textContent = Le ? Le.emptyScript : "";
            for (let b = 0; b < $; b++) s.append(u[b], be()), J.nextNode(), c.push({
              type: 2,
              index: ++i
            });
            s.append(u[$], be());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ar) c.push({
        type: 2,
        index: i
      });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(K, u + 1)) !== -1; ) c.push({
          type: 7,
          index: i
        }), u += K.length - 1;
      }
      i++;
    }
  }
  static createElement(t, r) {
    const n = Q.createElement("template");
    return n.innerHTML = t, n;
  }
};
function ae(e, t, r = e, n) {
  if (t === oe) return t;
  let s = n !== void 0 ? r._$Co?.[n] : r._$Cl;
  const i = $e(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== i && (s?._$AO?.(!1), i === void 0 ? s = void 0 : (s = new i(e), s._$AT(e, r, n)), n !== void 0 ? (r._$Co ??= [])[n] = s : r._$Cl = s), s !== void 0 && (t = ae(e, s._$AS(e, t.values), s, n)), t;
}
var Qr = class {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, n = (e?.creationScope ?? Q).importNode(t, !0);
    J.currentNode = n;
    let s = J.nextNode(), i = 0, o = 0, a = r[0];
    for (; a !== void 0; ) {
      if (i === a.index) {
        let c;
        a.type === 2 ? c = new ot(s, s.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (c = new nn(s, this, e)), this._$AV.push(c), a = r[++o];
      }
      i !== a?.index && (s = J.nextNode(), i++);
    }
    return J.currentNode = Q, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}, ot = class ur {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, n, s) {
    this.type = 2, this._$AH = k, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = n, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && t?.nodeType === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = ae(this, t, r), $e(t) ? t === k || t == null || t === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : t !== this._$AH && t !== oe && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zr(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== k && $e(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Q.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Ke.createElement(lr(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(r);
    else {
      const i = new Qr(s, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let r = Nt.get(t.strings);
    return r === void 0 && Nt.set(t.strings, r = new Ke(t)), r;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let n, s = 0;
    for (const i of t) s === r.length ? r.push(n = new ur(this.O(be()), this.O(be()), this, this.options)) : n = r[s], n._$AI(i), s++;
    s < r.length && (this._$AR(n && n._$AB.nextSibling, s), r.length = s);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const n = At(t).nextSibling;
      At(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}, Ne = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, n, s) {
    this.type = 1, this._$AH = k, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(/* @__PURE__ */ new String()), this.strings = r) : this._$AH = k;
  }
  _$AI(e, t = this, r, n) {
    const s = this.strings;
    let i = !1;
    if (s === void 0) e = ae(this, e, t, 0), i = !$e(e) || e !== this._$AH && e !== oe, i && (this._$AH = e);
    else {
      const o = e;
      let a, c;
      for (e = s[0], a = 0; a < s.length - 1; a++) c = ae(this, o[r + a], t, a), c === oe && (c = this._$AH[a]), i ||= !$e(c) || c !== this._$AH[a], c === k ? e = k : e !== k && (e += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    i && !n && this.j(e);
  }
  j(e) {
    e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}, en = class extends Ne {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === k ? void 0 : e;
  }
}, tn = class extends Ne {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== k);
  }
}, rn = class extends Ne {
  constructor(e, t, r, n, s) {
    super(e, t, r, n, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ae(this, e, t, 0) ?? k) === oe) return;
    const r = this._$AH, n = e === k && r !== k || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== k && (r === k || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}, nn = class {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ae(this, e);
  }
};
var sn = nt.litHtmlPolyfillSupport;
sn?.(Ke, ot), (nt.litHtmlVersions ??= []).push("3.3.2");
var on = (e, t, r) => {
  const n = r?.renderBefore ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const i = r?.renderBefore ?? null;
    n._$litPart$ = s = new ot(t.insertBefore(be(), i), i, void 0, r ?? {});
  }
  return s._$AI(e), s;
}, at = globalThis, ve = class extends ie {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = on(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return oe;
  }
};
ve._$litElement$ = !0, ve.finalized = !0, at.litElementHydrateSupport?.({ LitElement: ve });
var an = at.litElementPolyfillSupport;
an?.({ LitElement: ve });
(at.litElementVersions ??= []).push("4.2.2");
var cn = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
}, ln = {
  attribute: !0,
  type: String,
  converter: Te,
  reflect: !1,
  hasChanged: rt
}, dn = (e = ln, t, r) => {
  const { kind: n, metadata: s } = r;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), i.set(r.name, e), n === "accessor") {
    const { name: o } = r;
    return {
      set(a) {
        const c = t.get.call(this);
        t.set.call(this, a), this.requestUpdate(o, c, e, !0, a);
      },
      init(a) {
        return a !== void 0 && this.C(o, void 0, e, a), a;
      }
    };
  }
  if (n === "setter") {
    const { name: o } = r;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function pr(e) {
  return (t, r) => typeof r == "object" ? dn(e, t, r) : ((n, s, i) => {
    const o = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, n), o ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(e, t, r);
}
function He(e) {
  return pr({
    ...e,
    state: !0,
    attribute: !1
  });
}
var m = {
  panelTop: "rgba(18, 45, 80, 0.42)",
  panelBottom: "rgba(5, 14, 28, 0.96)",
  panelSolid: "rgba(10, 23, 44, 0.92)",
  border: "rgba(61, 126, 216, 0.35)",
  borderStrong: "rgba(61, 185, 255, 0.55)",
  textMain: "#e8f1ff",
  textSoft: "#9fb4d7",
  good: "#69eb57",
  green: "#69eb57",
  purple: "#b26cff",
  cyan: "#17ebff",
  blue: "#2aa7ff",
  softBlue: "#7ea2ff",
  yellow: "#ffd84d",
  danger: "#ff6b7d",
  shellTop: "rgba(7, 18, 35, 0.98)",
  shellBottom: "rgba(2, 11, 24, 0.98)"
}, mr = 21, Me = [
  m.green,
  m.cyan,
  m.purple,
  m.softBlue
], un = /^sensor\.ugos_bridge_host_(.+?)_cpu_usage_percent$/, pn = /^sensor\.ugos_bridge_project_(.+?)_cpu_usage_percent$/, mn = /^sensor\.([a-z0-9_]+)_\1_cpu(?:_|$)/, yn = /^(?:sensor|binary_sensor)\.ugos_bridge_host_(.+?)_(?:array|bond|disk|filesystem|gpu|network)_/, _n = /^(?:sensor|binary_sensor)\.([a-z0-9_]+)_(?:array|bond|disk|filesystem|gpu|network)_[a-z0-9][a-z0-9_]*_[a-z0-9_]+(?:_\d+)?$/, hn = /^(?:sensor|binary_sensor)\.ugos_bridge_container_(.+?)_(cpu_usage_percent|memory_usage_bytes|running)$/, gn = /^sensor\.ugos_bridge_process_(.+?)_(process_count|cpu_usage_percent|memory_usage_bytes|cpu_time_seconds)$/, Xe = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), le = (e) => {
  let t = Xe.get(e);
  return t || (t = {
    prefixEntries: /* @__PURE__ */ new Map(),
    computedResults: /* @__PURE__ */ new Map(),
    resolutionResults: /* @__PURE__ */ new Map(),
    booleanResults: /* @__PURE__ */ new Map()
  }, Xe.set(e, t)), t;
}, L = (e) => {
  const t = le(e);
  return t.keys || (t.keys = Object.keys(e)), t.keys;
}, M = (e) => {
  const t = le(e);
  return t.entries || (t.entries = Object.entries(e)), t.entries;
}, S = (e) => {
  const t = le(e);
  return t.values || (t.values = Object.values(e)), t.values;
}, we = (e, t) => {
  const r = le(e), n = r.prefixEntries.get(t);
  if (n) return n;
  const s = M(e).filter(([i]) => i.startsWith(t));
  return r.prefixEntries.set(t, s), s;
}, N = (e, t) => Array.from(new Map(t.flatMap((r) => we(e, r))).entries()), H = (e, t) => t.find((r) => hr(e[r])), j = (e, t, r, n = "sensor.") => {
  const s = B(r);
  return M(e).filter(([i, o]) => {
    if (!i.startsWith(n)) return !1;
    const a = i.toLowerCase();
    return B(w(o, "name") ?? "") === s || a.includes(`_${t}_${s}_`) || a.includes(`ugos_bridge_${t}_${s}_`);
  });
}, v = (e, t) => R(e, t) ?? R(e, {
  ...t,
  unit: void 0
}), A = (e, t, r) => {
  const n = le(e), s = n.computedResults.get(t);
  if (s !== void 0) return s;
  const i = r();
  return n.computedResults.set(t, i), i;
}, U = (e, t, r) => {
  const n = le(e);
  if (n.resolutionResults.has(t)) return n.resolutionResults.get(t);
  const s = r();
  return n.resolutionResults.set(t, s), s;
}, Be = (e) => {
  if (!e) return;
  let t = Ht.get(e);
  const r = typeof e.attributes.friendly_name == "string" ? e.attributes.friendly_name : "", n = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
  return !t || t.friendlyName !== r || t.unit !== n ? (t = {
    friendlyName: r,
    friendlyNameLower: r.toLowerCase(),
    state: e.state,
    unit: n
  }, Ht.set(e, t)) : t.state !== e.state && (t.state = e.state, t.parsedNumber = void 0, t.textState = void 0), t;
}, jt = () => ({ samples: [] }), fn = (e, t, r) => {
  const n = e?.states;
  if (!n) return null;
  Xe.delete(n);
  const s = Hn(n, t?.host);
  if (!s) return null;
  const i = `ugos_bridge_host_${s}`, o = V(n, s, "cpu"), a = V(n, s, "memoryUsedBytes"), c = g(n, o) ?? 0, d = g(n, V(n, s, "load1")) ?? 0, l = g(n, V(n, s, "cpufreq")), u = g(n, V(n, s, "uptime")) ?? 0, $ = g(n, a) ?? 0, b = g(n, V(n, s, "memoryUsedPercent")) ?? 0, f = g(n, V(n, s, "swapUsedPercent")) ?? 0, me = On($, b, t?.memoryTotalBytes), ye = jn(n, s, t?.host), wr = Cn(n, o), Br = Mn(n, a, me, $), kr = An(n), xe = Nn(n, s), yt = Wt(xe, [
    "cpu",
    "package",
    "soc",
    "core",
    "tctl"
  ]), D = Yn(n, s, i)[0], _t = D !== void 0 ? ze(n, s, i, D, "busy") : void 0, Oe = D !== void 0 ? ze(n, s, i, D, "current") : void 0, Se = D !== void 0 ? ze(n, s, i, D, "max") : void 0, re = D !== void 0 ? Ms(n, s, i, D) : void 0, xr = D !== void 0 ? g(n, Oe) : void 0, Pr = D !== void 0 ? g(n, Se) : void 0, ht = Wt(xe, [
    "gpu",
    "graphics",
    "igpu",
    "intel"
  ]), Cr = In(n, _t ?? Oe ?? Se), Mr = En(n, _t ?? Oe ?? Se), Ir = Sn(Ln(n, s), t?.storageFilesystems), gt = Gn(n, s, i).map((p) => bn(n, s, ye, p)).filter((p) => p !== null).sort((p, I) => p.name.localeCompare(I.name)), Er = $n(Rn(n, s), Ir, gt), Ar = Fn(n), _e = Array.from(new Set(Ar)).map((p) => wn(n, p)).filter((p) => p !== null).sort((p, I) => I.cpuPercent - p.cpuPercent || p.title.localeCompare(I.title)), Pe = Vn(n, s, i), Ur = Kn(n, s, i), We = Wn(Xn(Array.from(/* @__PURE__ */ new Set([...Pe, ...Ur])).sort(), t?.networkInterfaces), t?.networkInterfaces), zr = We.map((p) => Pe.includes(p) ? zn(n, s, p, xe) : Tn(n, s, p, xe)).filter((p) => p !== null).sort((p, I) => p.name.localeCompare(I.name)), ft = We.filter((p) => Pe.includes(p)), vt = ft.length > 0 ? ft : Pe, bt = vt.reduce((p, I) => p + (g(n, Y(n, s, I, "rx")) ?? 0) * 8, 0), $t = vt.reduce((p, I) => p + (g(n, Y(n, s, I, "tx")) ?? 0) * 8, 0), Fe = Jn(We), Ce = Object.fromEntries(Fe.map((p) => [p, yr(n, s, p)])), Ge = (o ? n[o]?.last_updated : void 0) ?? (o ? n[o]?.last_changed : void 0) ?? `${c}:${b}:${re ?? 0}:${bt}:${$t}:${JSON.stringify(Ce)}`, ne = as(r, {
    key: Ge,
    timestampLabel: Ns(Ge),
    cpuPercent: c,
    ramPercent: b,
    gpuPercent: re ?? 0,
    load1: d,
    networkBpsBySlug: Ce
  }), wt = Ee(ne.samples.map((p) => p.cpuPercent), c, 12), Bt = Ee(ne.samples.map((p) => p.ramPercent), b, 12), kt = Ee(ne.samples.map((p) => p.gpuPercent), re ?? 0, 12), Tr = Ee(ne.samples.map((p) => p.load1), d, 12), xt = cs(ne.samples, Fe, Ce), Lr = Fe.map((p, I) => ({
    key: p,
    label: pt(p),
    color: Zn(p, I),
    currentBps: Ce[p] ?? 0,
    series: xt.map((Hr) => Hr.totalsByInterface[p] ?? 0)
  })), Rr = [
    {
      kind: "cpu",
      title: "CPU",
      accent: m.blue,
      valuePercent: c,
      temperatureCelsius: yt ?? 0,
      series: wt
    },
    {
      kind: "ram",
      title: "RAM",
      accent: m.purple,
      valuePercent: b,
      usedBytes: $,
      totalBytes: me,
      series: Bt
    },
    ...re !== void 0 ? [{
      kind: "gpu",
      title: "GPU",
      accent: m.green,
      valuePercent: re,
      temperatureCelsius: ht ?? 0,
      series: kt
    }] : [],
    {
      kind: "system-load",
      title: "System Load",
      accent: m.softBlue,
      value: d,
      statusText: ds(d),
      series: Tr
    },
    {
      kind: "network",
      title: "Network",
      accent: m.green,
      downloadBps: bt,
      uploadBps: $t
    }
  ], Nr = vn({
    cpuFrequencyMHz: l,
    cpuPercent: c,
    cpuSeries: wt,
    cpuTemperature: yt,
    gpuBusyPercent: re,
    gpuCurrentMHz: xr,
    gpuMaxMHz: Pr,
    gpuSeries: kt,
    gpuTemperature: ht,
    load1: d,
    memoryTotalBytes: me,
    memoryUsedBytes: $,
    memoryUsedPercent: b,
    ramSeries: Bt,
    swapUsedPercent: f,
    uptimeSeconds: u
  }), Pt = ys(s);
  return {
    history: ne,
    watchEntityIds: _s(n, Pt, t?.ipEntity),
    watchPrefixes: Pt,
    model: {
      deviceInfo: {
        model: t?.deviceModel ?? "UGREEN NAS",
        ugosVersion: t?.ugosVersion ?? "Unavailable",
        hostname: ye,
        ipAddress: Dn(n, t),
        uptimeSeconds: u,
        lastUpdated: Hs(Ge)
      },
      hardwareSummary: Rr,
      hardwareDetails: Nr,
      drives: gt,
      storagePools: Er,
      dockerProjects: _e,
      dockerTotals: {
        totalContainers: _e.reduce((p, I) => p + I.totalContainers, 0),
        runningContainers: _e.reduce((p, I) => p + I.runningContainers, 0),
        totalProjects: _e.length,
        onlineProjects: _e.filter((p) => p.status === "up").length
      },
      networkInterfaces: zr,
      networkTrafficHistory: xt,
      networkTrafficLines: Lr,
      cpuCores: wr,
      ramBreakdown: Br,
      gpuEngines: Cr,
      gpuStats: Mr,
      topProcesses: kr
    }
  };
}, vn = ({ cpuFrequencyMHz: e, cpuPercent: t, cpuSeries: r, cpuTemperature: n, gpuBusyPercent: s, gpuCurrentMHz: i, gpuMaxMHz: o, gpuSeries: a, gpuTemperature: c, load1: d, memoryTotalBytes: l, memoryUsedBytes: u, memoryUsedPercent: $, ramSeries: b, swapUsedPercent: f, uptimeSeconds: me }) => {
  const ye = [{
    key: "cpu",
    title: "CPU",
    subtitle: "System Processor",
    accent: m.blue,
    utilizationPercent: t,
    series: r,
    detailRows: [
      {
        label: "Load (1m)",
        value: d.toFixed(2)
      },
      {
        label: "Frequency",
        value: e ? `${Math.round(e)} MHz` : "Unavailable"
      },
      {
        label: "Temperature",
        value: n !== void 0 ? `${Math.round(n)}°C` : "Unavailable"
      },
      {
        label: "Uptime",
        value: js(me)
      }
    ]
  }, {
    key: "ram",
    title: "RAM",
    subtitle: "System Memory",
    accent: m.purple,
    utilizationPercent: $,
    series: b,
    detailRows: [
      {
        label: "Used",
        value: Jt(u)
      },
      {
        label: "Total",
        value: Jt(l)
      },
      {
        label: "Usage",
        value: `${$.toFixed($ >= 10 ? 1 : 2)}%`
      },
      {
        label: "Swap Used",
        value: `${f.toFixed(f >= 10 ? 1 : 2)}%`
      }
    ]
  }];
  return s !== void 0 && ye.push({
    key: "gpu",
    title: "GPU",
    subtitle: "Integrated Graphics",
    accent: m.green,
    utilizationPercent: s,
    series: a,
    detailRows: [
      {
        label: "Current",
        value: i ? `${Math.round(i)} MHz` : "Unavailable"
      },
      {
        label: "Max",
        value: o ? `${Math.round(o)} MHz` : "Unavailable"
      },
      {
        label: "Temperature",
        value: c !== void 0 ? `${Math.round(c)}°C` : "Unavailable"
      },
      {
        label: "Source",
        value: "UGOS Bridge MQTT"
      }
    ]
  }), ye;
}, bn = (e, t, r, n) => {
  const s = g(e, se(e, t, n, "size")), i = g(e, se(e, t, n, "temperature")), o = g(e, se(e, t, n, "read")), a = g(e, se(e, t, n, "write")), c = g(e, se(e, t, n, "busy")), d = Je(e, Ot(e, t, n, "model")), l = Bs(Je(e, Ot(e, t, n, "type")));
  if (s === void 0 && i === void 0 && o === void 0 && a === void 0 && c === void 0 && d === void 0 && l === void 0) return null;
  const u = ws(d), $ = F(e[se(e, t, n, "size") ?? ""], "Size", r) ?? ce(n);
  return {
    name: l === "hdd" ? `${u ?? $} ${n.toUpperCase()}` : u ?? $,
    model: l ? l.toUpperCase() : i !== void 0 ? "Physical Disk" : "Disk",
    capacityBytes: s ?? 0,
    temperatureCelsius: i,
    readBytesPerSecond: o,
    writeBytesPerSecond: a,
    busyPercent: c,
    status: ls(i),
    mediaType: l,
    diskSlug: n,
    deviceModel: u ?? void 0
  };
}, $n = (e, t, r) => {
  if (e.length === 0) return t.map((s, i) => ({
    key: s.slug,
    name: Kt(Ze(s.slug)),
    layout: s.readOnly ? "Filesystem | Read-only" : "Filesystem",
    status: s.readOnly ? "warning" : "healthy",
    usedBytes: s.usedBytes,
    totalBytes: s.totalBytes,
    accent: Me[i % Me.length]
  }));
  const n = [...t];
  return e.map((s, i) => {
    const o = n.findIndex((b) => Math.abs(b.totalBytes - s.sizeBytes) / Math.max(s.sizeBytes, 1) < 0.05), a = o >= 0 ? n.splice(o, 1)[0] : void 0, c = xs(s, r), d = a ? Kt(Ze(a.slug)) : void 0, l = ks(s.level), u = Un(s.members, r), $ = u.length === 0 && e.length === 1 ? r.map((b) => b.diskSlug).filter((b) => !!b) : u;
    return {
      key: s.slug,
      name: c ?? d ?? s.name,
      layout: [l, d].filter(Boolean).join(" | ") || `${s.slug.toUpperCase()} Array`,
      driveCountText: Ps(s.activeDisks, s.totalDisks),
      status: s.degradedDisks > 0 ? "degraded" : a?.readOnly ? "warning" : "healthy",
      usedBytes: a?.usedBytes ?? 0,
      totalBytes: a?.totalBytes ?? s.sizeBytes,
      accent: Me[i % Me.length],
      driveSlugs: $
    };
  });
}, wn = (e, t) => {
  const r = is(e, t), n = Ie(e, t, "cpu"), s = e[r ?? ""], i = _(s, "cpu_usage_percent") ?? g(e, n), o = _(s, "memory_usage_bytes") ?? g(e, Ie(e, t, "memory")), a = _(s, "total_containers") ?? g(e, Ie(e, t, "total")), c = _(s, "running_containers") ?? g(e, Ie(e, t, "running"));
  if (i === void 0 || o === void 0 || a === void 0 || c === void 0) return null;
  const d = Bn(t, xn(e, t, r ?? n)), l = kn(t, o, d);
  return {
    key: t,
    title: Cs(w(s, "project") ?? F(s, "CPU", "") ?? F(e[n ?? ""], "CPU", "") ?? t.split("_").filter(Boolean).map(ut).join(" ")),
    cpuPercent: i,
    memoryBytes: l,
    runningContainers: Math.round(c),
    totalContainers: Math.round(a),
    status: c <= 0 ? "down" : c < a ? "partial" : "up",
    containers: d
  };
}, Bn = (e, t) => e !== "virtual_machines" ? t : t.map((r) => r.running ? r : {
  ...r,
  memoryBytes: 0
}), kn = (e, t, r) => e !== "virtual_machines" || r.length === 0 ? t : r.reduce((n, s) => n + (s.running ? s.memoryBytes : 0), 0), xn = (e, t, r) => {
  const n = de(e[r ?? ""], "containers");
  if (n.length > 0) return n.map((i, o) => Pn(i, t, o)).filter((i) => i !== null).sort((i, o) => Number(o.running) - Number(i.running) || o.cpuPercent - i.cpuPercent || o.memoryBytes - i.memoryBytes || i.name.localeCompare(o.name));
  const s = /* @__PURE__ */ new Map();
  for (const [i, o] of M(e)) {
    const a = w(o, "container"), c = ke(w(o, "project")), d = w(o, "image"), l = w(o, "status"), u = w(o, "state"), $ = gr(o, "running");
    if (!(a || d !== void 0 || l !== void 0 || u !== void 0 || $ !== void 0 || _(o, "memory_current_bytes") !== void 0 || _(o, "memory_limit_bytes") !== void 0 || hn.test(i))) continue;
    const b = B(a ?? w(o, "container_id") ?? i), f = s.get(b) ?? { key: b };
    f.projectSlug = f.projectSlug ?? c ?? Ls(b, o, t), f.name = f.name ?? a ?? F(o, "", "") ?? ce(b), f.image = f.image ?? d ?? "Unknown", f.status = f.status ?? l ?? "Unavailable", f.state = f.state ?? u ?? zs(o), f.memoryCurrentBytes = f.memoryCurrentBytes ?? _(o, "memory_current_bytes"), f.memoryLimitBytes = f.memoryLimitBytes ?? _(o, "memory_limit_bytes"), f.cpuPercent = _(o, "cpu_usage_percent") ?? f.cpuPercent ?? 0, f.memoryBytes = _(o, "memory_usage_bytes") ?? f.memoryBytes ?? 0, f.running = $ ?? Ts(o, f.state) ?? f.running, s.set(b, f);
  }
  return Array.from(s.values()).filter((i) => i.projectSlug === t || Rs(i, t)).map((i) => ({
    key: i.key,
    name: i.name ?? ce(i.key),
    image: i.image ?? "Unknown",
    status: i.status ?? "Unavailable",
    state: i.state ?? "unknown",
    running: i.running ?? !1,
    cpuPercent: i.cpuPercent ?? 0,
    memoryBytes: i.memoryBytes ?? 0,
    memoryCurrentBytes: i.memoryCurrentBytes,
    memoryLimitBytes: i.memoryLimitBytes
  })).sort((i, o) => Number(o.running) - Number(i.running) || o.cpuPercent - i.cpuPercent || o.memoryBytes - i.memoryBytes || i.name.localeCompare(o.name));
}, Pn = (e, t, r) => {
  const n = ke(E(e, [
    "project_slug",
    "project",
    "ProjectSlug",
    "Project"
  ]));
  if (n !== void 0 && n !== t) return null;
  const s = E(e, [
    "name",
    "container",
    "Name",
    "Container"
  ]), i = E(e, [
    "container_slug",
    "key",
    "ContainerSlug",
    "Key"
  ]) ?? B(s ?? E(e, ["container_id", "ContainerID"]) ?? `container_${r}`);
  return {
    key: i,
    name: s ?? ce(i),
    image: E(e, ["image", "Image"]) ?? "Unknown",
    status: E(e, ["status", "Status"]) ?? "Unavailable",
    state: E(e, ["state", "State"]) ?? "unknown",
    running: vs(e, ["running", "Running"]) ?? E(e, ["state", "State"])?.toLowerCase() === "running",
    cpuPercent: T(e, [
      "cpu_usage_percent",
      "cpuPercent",
      "CPUUsagePercent",
      "CPUPercent"
    ]) ?? 0,
    memoryBytes: T(e, [
      "memory_usage_bytes",
      "memoryBytes",
      "MemoryUsageBytes",
      "MemoryBytes"
    ]) ?? 0,
    memoryCurrentBytes: T(e, [
      "memory_current_bytes",
      "memoryCurrentBytes",
      "MemoryCurrentBytes"
    ]),
    memoryLimitBytes: T(e, [
      "memory_limit_bytes",
      "memoryLimitBytes",
      "MemoryLimitBytes"
    ])
  };
}, Cn = (e, t) => {
  const r = [];
  return de(e[t ?? ""], "cpu_cores").forEach((n, s) => {
    const i = E(n, ["name"]) ?? `cpu${s}`, o = T(n, ["usage_percent", "UsagePercent"]);
    o !== void 0 && r.push({
      key: B(i) || `cpu_${s}`,
      name: Is(i),
      usagePercent: o,
      currentMHz: T(n, ["current_mhz", "CurrentMHz"]),
      minMHz: T(n, ["min_mhz", "MinMHz"]),
      maxMHz: T(n, ["max_mhz", "MaxMHz"]),
      governor: E(n, ["governor", "Governor"])
    });
  }), r.sort(Es);
}, Mn = (e, t, r, n) => {
  const s = e[t ?? ""], i = _(s, "memory_total_bytes") ?? r, o = _(s, "memory_used_bytes") ?? n, a = _(s, "memory_buffers_bytes"), c = _(s, "memory_cached_bytes"), d = _(s, "swap_used_bytes"), l = _(s, "swap_total_bytes");
  return [
    {
      key: "total",
      label: "Total",
      valueBytes: i
    },
    {
      key: "used",
      label: "Used",
      valueBytes: o,
      totalBytes: i
    },
    ...a !== void 0 ? [{
      key: "buffers",
      label: "Buffers",
      valueBytes: a,
      totalBytes: i
    }] : [],
    ...c !== void 0 ? [{
      key: "cached",
      label: "Cached",
      valueBytes: c,
      totalBytes: i
    }] : [],
    ...d !== void 0 ? [{
      key: "swap_used",
      label: "Swap Used",
      valueBytes: d,
      totalBytes: l
    }] : [],
    ...l !== void 0 ? [{
      key: "swap_total",
      label: "Swap Total",
      valueBytes: l
    }] : []
  ];
}, In = (e, t) => {
  const r = [];
  return de(e[t ?? ""], "engines").forEach((n, s) => {
    const i = E(n, ["name", "Name"]), o = T(n, ["busy_percent", "BusyPercent"]);
    !i || o === void 0 || r.push({
      key: B(i) || `engine_${s}`,
      label: As(i),
      busyPercent: o,
      semaPercent: T(n, ["sema_percent", "SemaPercent"]),
      waitPercent: T(n, ["wait_percent", "WaitPercent"])
    });
  }), r.sort((n, s) => s.busyPercent - n.busyPercent || n.label.localeCompare(s.label));
}, En = (e, t) => {
  const r = [];
  return de(e[t ?? ""], "stats").forEach((n, s) => {
    const i = T(n, ["value", "Value"]);
    if (i === void 0) return;
    const o = E(n, ["key", "Key"]) ?? `stat_${s}`;
    r.push({
      key: o,
      label: E(n, ["label", "Label"]) ?? Us(o),
      value: i,
      unit: E(n, ["unit", "Unit"])
    });
  }), r;
}, An = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const [r, n] of M(e)) {
    const s = w(n, "name"), i = _(n, "process_count"), o = _(n, "cpu_time_seconds"), a = _(n, "cpu_usage_percent"), c = _(n, "memory_usage_bytes");
    if (!(i !== void 0 || o !== void 0 || s !== void 0 && dt(n).includes("process") && a !== void 0 && c !== void 0 || gn.test(r))) continue;
    const d = B(s ?? r), l = t.get(d) ?? {
      key: d,
      name: s ?? F(n, "", "") ?? ce(d),
      processCount: 0,
      cpuPercent: 0,
      memoryBytes: 0
    };
    l.name = s ?? l.name, l.processCount = Math.round(i ?? l.processCount), l.cpuPercent = a ?? l.cpuPercent, l.memoryBytes = c ?? l.memoryBytes, l.cpuTimeSeconds = o ?? l.cpuTimeSeconds, t.set(d, l);
  }
  return Array.from(t.values()).sort((r, n) => n.cpuPercent - r.cpuPercent || n.memoryBytes - r.memoryBytes || n.processCount - r.processCount || r.name.localeCompare(n.name)).slice(0, 10);
}, Un = (e, t) => {
  if (e.length === 0) return [];
  const r = /* @__PURE__ */ new Map();
  return t.map((n) => n.diskSlug).filter((n) => !!n).forEach((n) => {
    for (const s of Xt(n)) r.set(s, n);
  }), Array.from(new Set(e.flatMap((n) => Xt(n)).map((n) => r.get(n)).filter((n) => !!n)));
}, zn = (e, t, r, n) => {
  const s = Y(e, t, r, "rx"), i = Y(e, t, r, "tx"), o = g(e, s), a = g(e, i), c = g(e, Y(e, t, r, "speed")), d = rs(e, t, r);
  return o === void 0 && a === void 0 && c === void 0 && !d ? null : {
    name: pt(r),
    status: ct(e[d ?? ""]) ? "up" : "down",
    linkSpeedMbps: c ?? void 0,
    temperatureCelsius: _r(n, r),
    downloadBps: (o ?? 0) * 8,
    uploadBps: (a ?? 0) * 8
  };
}, Tn = (e, t, r, n) => {
  const s = g(e, ns(e, t, r, "speed")), i = ss(e, t, r), o = yr(e, t, r);
  return s === void 0 && !i ? null : {
    name: pt(r),
    status: ct(e[i ?? ""]) ? "up" : "down",
    linkSpeedMbps: s ?? void 0,
    temperatureCelsius: _r(n, r),
    downloadBps: o / 2,
    uploadBps: o / 2
  };
}, Ln = (e, t) => qn(e, t).map((r) => {
  const n = St(e, t, r, "used"), s = St(e, t, r, "free"), i = g(e, n), o = g(e, s);
  return i === void 0 || o === void 0 ? null : {
    slug: r,
    name: F(e[n ?? ""], "Used", "") ?? Ze(r),
    usedBytes: i,
    freeBytes: o,
    totalBytes: i + o,
    readOnly: ct(e[es(e, t, r) ?? ""])
  };
}).filter((r) => r !== null).sort((r, n) => r.name.localeCompare(n.name)), Rn = (e, t) => {
  const r = Qn(e, t), n = [];
  for (const s of r) {
    const i = q(e, t, s, "size"), o = g(e, i), a = g(e, q(e, t, s, "degraded")) ?? 0, c = g(e, q(e, t, s, "active")), d = g(e, q(e, t, s, "total")), l = g(e, q(e, t, s, "sync")), u = ts(e, t, s, "level"), $ = Je(e, u);
    if (o === void 0 && c === void 0 && d === void 0 && l === void 0 && $ === void 0) continue;
    const b = fs([
      e[i ?? ""],
      e[u ?? ""],
      e[q(e, t, s, "active") ?? ""],
      e[q(e, t, s, "total") ?? ""],
      e[q(e, t, s, "degraded") ?? ""]
    ], "members");
    n.push({
      slug: s,
      name: F(e[i ?? ""], "Size", "") ?? F(e[u ?? ""], "Level", "") ?? s.toUpperCase(),
      sizeBytes: o ?? 0,
      degradedDisks: Math.round(a),
      activeDisks: c !== void 0 ? Math.round(c) : void 0,
      totalDisks: d !== void 0 ? Math.round(d) : void 0,
      syncPercent: l,
      level: $,
      members: b
    });
  }
  return n.sort((s, i) => s.name.localeCompare(i.name));
}, Nn = (e, t) => A(e, `temperatures:${t}`, () => {
  const r = [
    `sensor.ugos_bridge_host_${t}_`,
    `sensor.${t}_`,
    "sensor.ugos_bridge_disk_",
    "sensor.ugos_bridge_gpu_"
  ];
  return M(e).filter(([n, s]) => n.startsWith("sensor.") && r.some((i) => n.startsWith(i)) && (n.endsWith("_temperature_celsius") || G(s, ["temperature"]))).map(([n, s]) => {
    const i = ee(s.state);
    return i === void 0 ? null : {
      entityId: n,
      label: `${ue(s)} ${n}`.trim().toLowerCase(),
      value: i
    };
  }).filter((n) => n !== null);
}), Hn = (e, t) => A(e, `hostSlug:${t ?? ""}`, () => {
  if (t) {
    const s = B(t);
    if (us(e, s) || ps(e, s)) return s;
  }
  const r = ms(e);
  if (r.length === 0) return null;
  if (!t) return r[0];
  const n = B(t);
  return r.find((s) => s === n) ?? r[0];
}), jn = (e, t, r) => F(e[V(e, t, "cpu") ?? ""], "CPU", "") ?? r?.trim() ?? ce(t), Dn = (e, t) => {
  if (t?.ipEntity) {
    const r = e[t.ipEntity]?.state;
    if (r && r !== "unknown" && r !== "unavailable") return r;
  }
  return t?.ipAddress?.trim() || "Unavailable";
}, On = (e, t, r) => r && r > 0 ? r : t > 0 ? Math.max(e, Math.round(e / (t / 100))) : e, Sn = (e, t) => {
  if (t && t.length > 0) {
    const n = e.filter((s) => os(s.slug, s.name, t));
    if (n.length > 0) return n;
  }
  const r = e.filter((n) => n.name !== "/");
  return r.length > 0 ? r : e;
}, Wn = (e, t) => {
  if (!t || t.length === 0) return e.filter((s) => s !== "lo");
  const r = t.map((s) => B(s)), n = e.filter((s) => r.includes(B(s)));
  return n.length > 0 ? n : e;
}, Fn = (e) => A(e, "projectSlugs", () => {
  const t = L(e).map((s) => pn.exec(s)?.[1]).filter((s) => !!s), r = we(e, "sensor.compose_project_").map(([, s]) => vr(s)).filter((s) => !!s), n = M(e).filter(([s, i]) => s.startsWith("sensor.") && (_(i, "total_containers") !== void 0 || _(i, "running_containers") !== void 0 || de(i, "containers").length > 0)).map(([, s]) => ke(w(s, "project_slug") ?? w(s, "project"))).filter((s) => !!s);
  return Array.from(/* @__PURE__ */ new Set([
    ...t,
    ...r,
    ...n
  ])).sort();
}), Gn = (e, t, r) => A(e, `diskSlugs:${t}:${r}`, () => {
  const n = [
    ...P(e, new RegExp(`^sensor\\.${C(r)}_disk_(.+?)_size_bytes$`)),
    ...P(e, /^sensor\.ugos_bridge_disk_(.+?)_size_bytes$/),
    ...P(e, new RegExp(`^sensor\\.${C(r)}_disk_(.+?)_(?:size_bytes|read_bytes_per_second|write_bytes_per_second|busy_percent|model|vendor|serial|media_type)(?:_\\d+)?$`))
  ], s = L(e).map((a) => a.match(new RegExp(`^sensor\\.${C(t)}_disk_([^_]+)_`))?.[1]).filter((a) => !!a), i = S(e).map((a) => je(a, t, [
    "Size",
    "Busy",
    "Read Throughput",
    "Write Throughput"
  ])).filter((a) => a !== void 0 && Ft(a)), o = S(e).filter((a) => _(a, "size_bytes") !== void 0 || _(a, "read_bytes_per_second") !== void 0 || _(a, "write_bytes_per_second") !== void 0).map((a) => B(w(a, "name") ?? "")).filter((a) => Ft(a));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i,
    ...o
  ])).sort();
}), qn = (e, t) => A(e, `filesystemSlugs:${t}`, () => {
  const r = [
    ...P(e, new RegExp(`^sensor\\.ugos_bridge_host_${C(t)}_filesystem_(.+?)_used_bytes$`)),
    ...P(e, /^sensor\.ugos_bridge_filesystem_(.+?)_used_bytes$/),
    ...P(e, new RegExp(`^(?:sensor|binary_sensor)\\.ugos_bridge_host_${C(t)}_filesystem_(.+?)_(?:used_bytes|free_bytes|used_percent|read_only)(?:_\\d+)?$`))
  ], n = L(e).map((o) => o.match(new RegExp(`^sensor\\.${C(t)}_filesystem_([^_]+)_`))?.[1]).filter((o) => !!o), s = S(e).map((o) => lt(o, t)).filter((o) => !!o), i = S(e).filter((o) => _(o, "used_bytes") !== void 0 || _(o, "free_bytes") !== void 0).map((o) => B(w(o, "name") ?? "")).filter((o) => !!o);
  return Array.from(/* @__PURE__ */ new Set([
    ...r,
    ...n,
    ...s,
    ...i
  ])).sort();
}), Vn = (e, t, r) => A(e, `networkSlugs:${t}:${r}`, () => {
  const n = [
    ...P(e, new RegExp(`^sensor\\.${C(r)}_network_(.+?)_rx_bytes_per_second$`)),
    ...P(e, /^sensor\.ugos_bridge_network_(.+?)_rx_bytes_per_second$/),
    ...P(e, new RegExp(`^(?:sensor|binary_sensor)\\.${C(r)}_network_(.+?)_(?:rx_bytes_per_second|tx_bytes_per_second|speed_mbps|carrier)(?:_\\d+)?$`))
  ], s = L(e).map((a) => a.match(new RegExp(`^sensor\\.${C(t)}_network_([^_]+)_`))?.[1]).filter((a) => !!a), i = S(e).map((a) => je(a, t, [
    "RX Throughput",
    "TX Throughput",
    "Link Speed",
    "Carrier"
  ])).filter((a) => a !== void 0 && Vt(a)), o = S(e).filter((a) => _(a, "rx_bytes_per_second") !== void 0 || _(a, "tx_bytes_per_second") !== void 0 || _(a, "speed_mbps") !== void 0).map((a) => B(w(a, "name") ?? "")).filter((a) => Vt(a));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i,
    ...o
  ])).sort();
}), Kn = (e, t, r) => A(e, `bondSlugs:${t}:${r}`, () => {
  const n = [
    ...P(e, new RegExp(`^sensor\\.${C(r)}_bond_(.+?)_speed_mbps$`)),
    ...P(e, /^sensor\.ugos_bridge_bond_(.+?)_speed_mbps$/),
    ...P(e, new RegExp(`^(?:sensor|binary_sensor)\\.${C(r)}_bond_(.+?)_(?:speed_mbps|mode|active_slave|mii_status|slave_count|carrier)(?:_\\d+)?$`))
  ], s = L(e).map((a) => a.match(new RegExp(`^sensor\\.${C(t)}_bond_([^_]+)_`))?.[1]).filter((a) => !!a), i = S(e).map((a) => je(a, t, [
    "Link Speed",
    "Mode",
    "Active Slave",
    "MII Status",
    "Slave Count",
    "Carrier"
  ])).filter((a) => a !== void 0 && qt(a)), o = S(e).filter((a) => w(a, "mode") !== void 0 || w(a, "active_slave") !== void 0 || _(a, "speed_mbps") !== void 0).map((a) => B(w(a, "name") ?? "")).filter((a) => qt(a));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i,
    ...o
  ])).sort();
}), Xn = (e, t) => {
  if (t && t.length > 0) return e;
  const r = e.filter((n) => /^(bond\d+|eth\d+)$/i.test(n));
  return r.length > 0 ? r : e;
}, Jn = (e) => [...e].filter((t) => /^(bond\d+|eth\d+)$/i.test(t)).sort((t, r) => Dt(t) - Dt(r) || t.localeCompare(r)).slice(0, 3), Dt = (e) => {
  const t = e.toLowerCase();
  return t.startsWith("bond") ? 0 : t.startsWith("eth") ? 1 : 2;
}, yr = (e, t, r) => {
  const n = g(e, Y(e, t, r, "rx")), s = g(e, Y(e, t, r, "tx"));
  return ((n ?? 0) + (s ?? 0)) * 8;
}, Zn = (e, t) => {
  const r = e.toLowerCase();
  return r.startsWith("bond") ? m.cyan : r === "eth0" ? m.good : r === "eth1" ? m.purple : [
    m.softBlue,
    m.green,
    m.blue
  ][t % 3];
}, Yn = (e, t, r) => A(e, `gpuSlugs:${t}:${r}`, () => {
  const n = [...P(e, new RegExp(`^sensor\\.${C(r)}_gpu_(.+?)_current_mhz$`)), ...P(e, /^sensor\.ugos_bridge_gpu_(.+?)_current_mhz$/)], s = L(e).map((i) => i.match(new RegExp(`^sensor\\.${C(t)}_gpu_([^_]+)_`))?.[1]).filter((i) => !!i);
  return Array.from(/* @__PURE__ */ new Set([...n, ...s])).sort();
}), Qn = (e, t) => A(e, `arraySlugs:${t}`, () => {
  const r = [
    ...P(e, new RegExp(`^sensor\\.ugos_bridge_host_${C(t)}_array_(.+?)_size_bytes$`)),
    ...P(e, /^sensor\.ugos_bridge_array_(.+?)_size_bytes$/),
    ...P(e, new RegExp(`^(?:sensor|binary_sensor)\\.ugos_bridge_host_${C(t)}_array_(.+?)_(?:size_bytes|degraded_disks|active_disks|total_disks|sync_completed_percent|level|degraded)(?:_\\d+)?$`))
  ], n = L(e).map((o) => o.match(new RegExp(`^sensor\\.${C(t)}_array_([^_]+)_`))?.[1]).filter((o) => !!o), s = S(e).map((o) => je(o, t, [
    "Size",
    "Degraded Disks",
    "Sync Progress"
  ])).filter((o) => o !== void 0 && Gt(o)), i = S(e).filter((o) => _(o, "size_bytes") !== void 0 || w(o, "level") !== void 0 || _(o, "degraded_disks") !== void 0).map((o) => B(w(o, "name") ?? "")).filter((o) => Gt(o));
  return Array.from(/* @__PURE__ */ new Set([
    ...r,
    ...n,
    ...s,
    ...i
  ])).sort();
}), V = (e, t, r) => U(e, `hostMetric:${t}:${r}`, () => {
  const n = {
    cpu: `sensor.ugos_bridge_host_${t}_cpu_usage_percent`,
    load1: `sensor.ugos_bridge_host_${t}_load_1`,
    cpufreq: `sensor.ugos_bridge_host_${t}_cpu_frequency_mhz`,
    memoryUsedBytes: `sensor.ugos_bridge_host_${t}_memory_used_bytes`,
    memoryUsedPercent: `sensor.ugos_bridge_host_${t}_memory_used_percent`,
    swapUsedPercent: `sensor.ugos_bridge_host_${t}_swap_used_percent`,
    uptime: `sensor.ugos_bridge_host_${t}_uptime_seconds`
  };
  if (e[n[r]]) return n[r];
  const s = A(e, `hostRootEntries:${t}`, () => M(e).filter(([i]) => hs(i, t)));
  switch (r) {
    case "cpu":
      return R(s, {
        entityIncludes: ["_cpu"],
        friendlyIncludes: ["cpu"],
        unit: "%"
      });
    case "load1":
      return R(s, {
        entityIncludes: ["load"],
        friendlyIncludes: ["load", "1"],
        unit: void 0
      });
    case "cpufreq":
      return R(s, {
        entityIncludes: ["frequency"],
        friendlyIncludes: ["frequency"],
        unit: "MHz"
      });
    case "memoryUsedBytes":
      return R(s, {
        entityIncludes: ["memory"],
        friendlyIncludes: ["memory", "used"],
        unit: "B"
      });
    case "memoryUsedPercent":
      return R(s, {
        entityIncludes: ["memory"],
        friendlyIncludes: ["memory", "used"],
        unit: "%"
      });
    case "swapUsedPercent":
      return R(s, {
        entityIncludes: ["swap"],
        friendlyIncludes: ["swap", "used"],
        unit: "%"
      });
    case "uptime":
      return R(s, {
        entityIncludes: ["uptime"],
        friendlyIncludes: ["uptime"],
        unit: "s"
      });
  }
}), se = (e, t, r, n) => U(e, `diskMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    size: [`sensor.ugos_bridge_host_${t}_disk_${r}_size_bytes`, `sensor.ugos_bridge_disk_${r}_size_bytes`],
    temperature: [`sensor.ugos_bridge_host_${t}_disk_${r}_temperature_celsius`, `sensor.ugos_bridge_disk_${r}_temperature_celsius`],
    read: [`sensor.ugos_bridge_host_${t}_disk_${r}_read_bytes_per_second`, `sensor.ugos_bridge_disk_${r}_read_bytes_per_second`],
    write: [`sensor.ugos_bridge_host_${t}_disk_${r}_write_bytes_per_second`, `sensor.ugos_bridge_disk_${r}_write_bytes_per_second`],
    busy: [`sensor.ugos_bridge_host_${t}_disk_${r}_busy_percent`, `sensor.ugos_bridge_disk_${r}_busy_percent`]
  }[n]);
  if (s) return s;
  const i = N(e, [
    `sensor.ugos_bridge_host_${t}_disk_${r}_`,
    `sensor.${t}_disk_${r}_`,
    `sensor.ugos_bridge_disk_${r}_`
  ]), o = n === "size" ? {
    entityIncludes: ["size"],
    friendlyIncludes: ["size"],
    unit: "B"
  } : n === "temperature" ? {
    entityIncludes: ["temperature"],
    friendlyIncludes: ["temperature"],
    unit: "°C"
  } : n === "busy" ? {
    entityIncludes: ["busy"],
    friendlyIncludes: ["busy"],
    unit: "%"
  } : {
    entityIncludes: [n === "read" ? "read" : "write"],
    friendlyIncludes: [n === "read" ? "read" : "write", "throughput"],
    unit: "B/s"
  };
  if (i.length > 0) return v(i, o);
  const a = j(e, "disk", r);
  return a.length > 0 ? v(a, o) : v(M(e).filter(([, c]) => G(c, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), Ot = (e, t, r, n) => U(e, `diskTextMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    model: [`sensor.ugos_bridge_host_${t}_disk_${r}_model`, `sensor.ugos_bridge_disk_${r}_model`],
    vendor: [`sensor.ugos_bridge_host_${t}_disk_${r}_vendor`, `sensor.ugos_bridge_disk_${r}_vendor`],
    serial: [`sensor.ugos_bridge_host_${t}_disk_${r}_serial`, `sensor.ugos_bridge_disk_${r}_serial`],
    type: [`sensor.ugos_bridge_host_${t}_disk_${r}_media_type`, `sensor.ugos_bridge_disk_${r}_media_type`]
  }[n]);
  if (s) return s;
  const i = [
    `sensor.ugos_bridge_host_${t}_disk_${r}_`,
    `sensor.${t}_disk_${r}_`,
    `sensor.ugos_bridge_disk_${r}_`
  ], o = n === "type" ? {
    entityIncludes: ["media"],
    friendlyIncludes: ["media"]
  } : {
    entityIncludes: [n],
    friendlyIncludes: [n]
  }, a = N(e, i);
  if (a.length > 0) return v(a, o);
  const c = j(e, "disk", r);
  return c.length > 0 ? v(c, o) : v(M(e).filter(([, d]) => G(d, [r])), {
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), St = (e, t, r, n) => U(e, `filesystemMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    used: [`sensor.ugos_bridge_host_${t}_filesystem_${r}_used_bytes`, `sensor.ugos_bridge_filesystem_${r}_used_bytes`],
    free: [`sensor.ugos_bridge_host_${t}_filesystem_${r}_free_bytes`, `sensor.ugos_bridge_filesystem_${r}_free_bytes`]
  }[n]);
  if (s) return s;
  const i = N(e, [
    `sensor.ugos_bridge_host_${t}_filesystem_${r}_`,
    `sensor.${t}_filesystem_${r}_`,
    `sensor.ugos_bridge_filesystem_${r}_`
  ]);
  if (i.length > 0) return v(i, {
    entityIncludes: [n],
    friendlyIncludes: [n],
    unit: "B"
  });
  const o = j(e, "filesystem", r);
  return o.length > 0 ? v(o, {
    entityIncludes: [n],
    friendlyIncludes: [n],
    unit: "B"
  }) : v(M(e).filter(([, a]) => lt(a, t) === r), {
    entityIncludes: [n],
    friendlyIncludes: [n],
    unit: "B"
  });
}), es = (e, t, r) => U(e, `filesystemReadonly:${t}:${r}`, () => {
  const n = H(e, [`binary_sensor.ugos_bridge_host_${t}_filesystem_${r}_read_only`, `binary_sensor.ugos_bridge_filesystem_${r}_read_only`]);
  if (n) return n;
  const s = N(e, [
    `binary_sensor.ugos_bridge_host_${t}_filesystem_${r}_`,
    `binary_sensor.${t}_filesystem_${r}_`,
    `binary_sensor.ugos_bridge_filesystem_${r}_`
  ]);
  if (s.length > 0) return v(s, {
    entityIncludes: ["read"],
    friendlyIncludes: ["read", "only"]
  });
  const i = j(e, "filesystem", r, "binary_sensor.");
  return i.length > 0 ? v(i, {
    entityIncludes: ["read"],
    friendlyIncludes: ["read", "only"]
  }) : v(M(e).filter(([, o]) => lt(o, t) === r), {
    entityIncludes: ["read"],
    friendlyIncludes: ["read", "only"]
  });
}), q = (e, t, r, n) => U(e, `arrayMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    size: [`sensor.ugos_bridge_host_${t}_array_${r}_size_bytes`, `sensor.ugos_bridge_array_${r}_size_bytes`],
    degraded: [`sensor.ugos_bridge_host_${t}_array_${r}_degraded_disks`, `sensor.ugos_bridge_array_${r}_degraded_disks`],
    active: [`sensor.ugos_bridge_host_${t}_array_${r}_active_disks`, `sensor.ugos_bridge_array_${r}_active_disks`],
    total: [`sensor.ugos_bridge_host_${t}_array_${r}_total_disks`, `sensor.ugos_bridge_array_${r}_total_disks`],
    sync: [`sensor.ugos_bridge_host_${t}_array_${r}_sync_completed_percent`, `sensor.ugos_bridge_array_${r}_sync_completed_percent`]
  }[n]);
  if (s) return s;
  const i = [
    `sensor.ugos_bridge_host_${t}_array_${r}_`,
    `sensor.${t}_array_${r}_`,
    `sensor.ugos_bridge_array_${r}_`
  ], o = n === "size" ? {
    entityIncludes: ["size"],
    friendlyIncludes: ["size"],
    unit: "B"
  } : n === "degraded" ? {
    entityIncludes: ["degraded"],
    friendlyIncludes: ["degraded"]
  } : n === "active" ? {
    entityIncludes: ["active"],
    friendlyIncludes: ["active", "disks"]
  } : n === "total" ? {
    entityIncludes: ["total"],
    friendlyIncludes: ["total", "disks"]
  } : {
    entityIncludes: ["sync"],
    friendlyIncludes: ["sync"],
    unit: "%"
  }, a = N(e, i);
  if (a.length > 0) return v(a, o);
  const c = j(e, "array", r);
  return c.length > 0 ? v(c, o) : v(M(e).filter(([, d]) => G(d, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), ts = (e, t, r, n) => U(e, `arrayTextMetric:${t}:${r}:${n}`, () => {
  const s = H(e, { level: [`sensor.ugos_bridge_host_${t}_array_${r}_level`, `sensor.ugos_bridge_array_${r}_level`] }[n]);
  if (s) return s;
  const i = N(e, [
    `sensor.ugos_bridge_host_${t}_array_${r}_`,
    `sensor.${t}_array_${r}_`,
    `sensor.ugos_bridge_array_${r}_`
  ]);
  if (i.length > 0) return v(i, {
    entityIncludes: ["level"],
    friendlyIncludes: ["level"]
  });
  const o = j(e, "array", r);
  return o.length > 0 ? v(o, {
    entityIncludes: ["level"],
    friendlyIncludes: ["level"]
  }) : v(M(e).filter(([, a]) => G(a, [r, "level"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "level"]
  });
}), Y = (e, t, r, n) => U(e, `networkMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    rx: [`sensor.ugos_bridge_host_${t}_network_${r}_rx_bytes_per_second`, `sensor.ugos_bridge_network_${r}_rx_bytes_per_second`],
    tx: [`sensor.ugos_bridge_host_${t}_network_${r}_tx_bytes_per_second`, `sensor.ugos_bridge_network_${r}_tx_bytes_per_second`],
    speed: [`sensor.ugos_bridge_host_${t}_network_${r}_speed_mbps`, `sensor.ugos_bridge_network_${r}_speed_mbps`]
  }[n]);
  if (s) return s;
  const i = [
    `sensor.ugos_bridge_host_${t}_network_${r}_`,
    `sensor.${t}_network_${r}_`,
    `sensor.ugos_bridge_network_${r}_`
  ], o = n === "speed" ? {
    entityIncludes: ["speed"],
    friendlyIncludes: ["link", "speed"],
    unit: "Mbit/s"
  } : {
    entityIncludes: [n],
    friendlyIncludes: [n === "rx" ? "rx" : "tx", "throughput"],
    unit: "B/s"
  }, a = N(e, i);
  if (a.length > 0) return v(a, o);
  const c = j(e, "network", r);
  return c.length > 0 ? v(c, o) : v(M(e).filter(([, d]) => G(d, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), rs = (e, t, r) => U(e, `networkCarrier:${t}:${r}`, () => {
  const n = H(e, [`binary_sensor.ugos_bridge_host_${t}_network_${r}_carrier`, `binary_sensor.ugos_bridge_network_${r}_carrier`]);
  if (n) return n;
  const s = N(e, [
    `binary_sensor.ugos_bridge_host_${t}_network_${r}_`,
    `binary_sensor.${t}_network_${r}_`,
    `binary_sensor.ugos_bridge_network_${r}_`
  ]);
  if (s.length > 0) return v(s, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  });
  const i = j(e, "network", r, "binary_sensor.");
  return i.length > 0 ? v(i, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  }) : v(we(e, "binary_sensor.").filter(([, o]) => G(o, [r, "carrier"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "carrier"]
  });
}), ns = (e, t, r, n) => U(e, `bondMetric:${t}:${r}:${n}`, () => {
  const s = H(e, {
    speed: [`sensor.ugos_bridge_host_${t}_bond_${r}_speed_mbps`, `sensor.ugos_bridge_bond_${r}_speed_mbps`],
    mode: [`sensor.ugos_bridge_host_${t}_bond_${r}_mode`, `sensor.ugos_bridge_bond_${r}_mode`],
    active_slave: [`sensor.ugos_bridge_host_${t}_bond_${r}_active_slave`, `sensor.ugos_bridge_bond_${r}_active_slave`]
  }[n]);
  if (s) return s;
  const i = [
    `sensor.ugos_bridge_host_${t}_bond_${r}_`,
    `sensor.${t}_bond_${r}_`,
    `sensor.ugos_bridge_bond_${r}_`
  ], o = n === "speed" ? {
    entityIncludes: ["speed"],
    friendlyIncludes: ["link", "speed"],
    unit: "Mbit/s"
  } : n === "mode" ? {
    entityIncludes: ["mode"],
    friendlyIncludes: ["mode"]
  } : {
    entityIncludes: ["active"],
    friendlyIncludes: ["active", "slave"]
  }, a = N(e, i);
  if (a.length > 0) return v(a, o);
  const c = j(e, "bond", r);
  return c.length > 0 ? v(c, o) : v(M(e).filter(([, d]) => G(d, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), ss = (e, t, r) => U(e, `bondCarrier:${t}:${r}`, () => {
  const n = H(e, [`binary_sensor.ugos_bridge_host_${t}_bond_${r}_carrier`, `binary_sensor.ugos_bridge_bond_${r}_carrier`]);
  if (n) return n;
  const s = N(e, [
    `binary_sensor.ugos_bridge_host_${t}_bond_${r}_`,
    `binary_sensor.${t}_bond_${r}_`,
    `binary_sensor.ugos_bridge_bond_${r}_`
  ]);
  if (s.length > 0) return v(s, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  });
  const i = j(e, "bond", r, "binary_sensor.");
  return i.length > 0 ? v(i, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  }) : v(we(e, "binary_sensor.").filter(([, o]) => G(o, [r, "carrier"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "carrier"]
  });
}), ze = (e, t, r, n, s) => U(e, `gpuMetric:${t}:${r}:${n}:${s}`, () => {
  const i = H(e, {
    busy: [`sensor.${r}_gpu_${n}_busy_percent`, `sensor.ugos_bridge_gpu_${n}_busy_percent`],
    current: [`sensor.${r}_gpu_${n}_current_mhz`, `sensor.ugos_bridge_gpu_${n}_current_mhz`],
    max: [`sensor.${r}_gpu_${n}_max_mhz`, `sensor.ugos_bridge_gpu_${n}_max_mhz`]
  }[s]);
  if (i) return i;
  const o = N(e, [
    `sensor.${r}_gpu_${n}_`,
    `sensor.${t}_gpu_${n}_`,
    `sensor.ugos_bridge_gpu_${n}_`
  ]), a = s === "busy" ? {
    entityIncludes: ["busy"],
    friendlyIncludes: ["busy"],
    unit: "%"
  } : {
    entityIncludes: [s],
    friendlyIncludes: [s, "frequency"],
    unit: "MHz"
  };
  return v(o, a) ?? v(j(e, "gpu", n), a);
}), Ie = (e, t, r) => U(e, `projectMetric:${t}:${r}`, () => {
  const n = {
    cpu: `sensor.ugos_bridge_project_${t}_cpu_usage_percent`,
    memory: `sensor.ugos_bridge_project_${t}_memory_usage_bytes`,
    total: `sensor.ugos_bridge_project_${t}_total_containers`,
    running: `sensor.ugos_bridge_project_${t}_running_containers`
  };
  if (e[n[r]]) return n[r];
  const s = we(e, `sensor.compose_project_${t}_`), i = r === "cpu" ? {
    entityIncludes: ["cpu"],
    friendlyIncludes: ["cpu"],
    unit: "%"
  } : r === "memory" ? {
    entityIncludes: ["memory"],
    friendlyIncludes: ["memory"],
    unit: "B"
  } : r === "total" ? {
    entityIncludes: ["total"],
    friendlyIncludes: ["total", "containers"]
  } : {
    entityIncludes: ["running"],
    friendlyIncludes: ["running", "containers"]
  };
  return s.length > 0 ? R(s, i) : R(M(e).filter(([, o]) => vr(o) === t), i);
}), is = (e, t) => U(e, `projectPayload:${t}`, () => {
  let r, n = -1;
  for (const [s, i] of M(e)) {
    if (!s.startsWith("sensor.") || ke(w(i, "project_slug") ?? w(i, "project")) !== t) continue;
    let o = 0;
    de(i, "containers").length > 0 && (o += 8), _(i, "total_containers") !== void 0 && (o += 4), _(i, "running_containers") !== void 0 && (o += 3), _(i, "memory_usage_bytes") !== void 0 && (o += 2), _(i, "cpu_usage_percent") !== void 0 && (o += 2), s.startsWith("sensor.compose_project_") && (o += 3), s.startsWith("sensor.ugos_bridge_project_") && (o += 3), (o > n || o === n && r !== void 0 && s.localeCompare(r) < 0 || r === void 0) && (r = s, n = o);
  }
  return r;
}), os = (e, t, r) => {
  const n = B(e), s = B(t);
  return r.some((i) => {
    const o = B(i);
    return o === n || o === s;
  });
}, as = (e, t) => e.samples.at(-1)?.key === t.key ? e : { samples: [...e.samples, t].slice(-mr) }, Ee = (e, t, r) => {
  if (e.length >= r) return e.slice(-mr);
  const n = Math.max(r - e.length, 0);
  return [...Array.from({ length: n }, () => t), ...e];
}, cs = (e, t, r) => {
  const n = e.length > 0 ? e : [{
    key: "initial",
    timestampLabel: "",
    cpuPercent: 0,
    ramPercent: 0,
    gpuPercent: 0,
    load1: 0,
    networkBpsBySlug: r
  }], s = Math.max(5 - n.length, 0);
  return [...Array.from({ length: s }, () => n[0]), ...n].map((i) => ({
    timestampLabel: i.timestampLabel,
    totalsByInterface: Object.fromEntries(t.map((o) => [o, i.networkBpsBySlug[o] ?? 0]))
  }));
}, Wt = (e, t) => {
  const r = e.find((n) => t.some((s) => n.label.includes(s)));
  return r ? r.value : e.find((n) => !n.entityId.includes("_disk_"))?.value;
}, _r = (e, t) => {
  const r = t.toLowerCase(), n = e.find((s) => s.label.includes(r) && (s.label.includes("phy temperature") || s.label.includes("mac temperature")));
  return n ? n.value : e.find((s) => s.label.includes(r))?.value;
}, ls = (e) => e === void 0 ? "healthy" : e >= 55 ? "degraded" : e >= 48 ? "warning" : "healthy", ds = (e) => e >= 3 ? "High" : e >= 1 ? "Busy" : "Good", us = (e, t) => A(e, `hasEntityPrefix:${t}`, () => L(e).some((r) => r.startsWith(`sensor.${t}_`) || r.startsWith(`binary_sensor.${t}_`))), ps = (e, t) => A(e, `hasBridgeHostEntityPrefix:${t}`, () => L(e).some((r) => r.startsWith(`sensor.ugos_bridge_host_${t}_`) || r.startsWith(`binary_sensor.ugos_bridge_host_${t}_`))), ms = (e) => A(e, "hostSlugCandidates", () => {
  const t = /* @__PURE__ */ new Map(), r = (n, s) => {
    n === void 0 || n.startsWith("ugos_bridge_") || t.set(n, (t.get(n) ?? 0) + s);
  };
  for (const n of L(e))
    r(un.exec(n)?.[1], 1e3), r(yn.exec(n)?.[1], 500), r(mn.exec(n)?.[1], 100), r(_n.exec(n)?.[1], 1);
  return Array.from(t.entries()).sort(([n, s], [i, o]) => o - s || n.localeCompare(i)).map(([n]) => n);
}), ys = (e) => [
  `sensor.ugos_bridge_host_${e}_`,
  `binary_sensor.ugos_bridge_host_${e}_`,
  `sensor.${e}_`,
  `binary_sensor.${e}_`,
  "sensor.ugos_bridge_disk_",
  "sensor.ugos_bridge_filesystem_",
  "binary_sensor.ugos_bridge_filesystem_",
  "sensor.ugos_bridge_network_",
  "binary_sensor.ugos_bridge_network_",
  "sensor.ugos_bridge_bond_",
  "binary_sensor.ugos_bridge_bond_",
  "sensor.ugos_bridge_array_",
  "binary_sensor.ugos_bridge_array_",
  "sensor.ugos_bridge_gpu_",
  "sensor.ugos_bridge_project_",
  "sensor.compose_project_",
  "sensor.ugos_bridge_container_",
  "binary_sensor.ugos_bridge_container_",
  "sensor.ugos_bridge_vm_",
  "binary_sensor.ugos_bridge_vm_",
  "sensor.ugos_bridge_process_"
], _s = (e, t, r) => L(e).filter((n) => {
  if (r !== void 0 && n === r || t.some((i) => n.startsWith(i))) return !0;
  const s = e[n];
  return w(s, "container") !== void 0 || w(s, "project") !== void 0 || _(s, "process_count") !== void 0 || _(s, "cpu_time_seconds") !== void 0;
}).sort(), hs = (e, t) => e.startsWith(`sensor.${t}_`) && ![
  "_disk_",
  "_filesystem_",
  "_network_",
  "_bond_",
  "_gpu_",
  "_array_",
  "_cooling_"
].some((r) => e.includes(r)), R = (e, t) => {
  let r, n = -1;
  e: for (const [s, i] of e) {
    const o = s.toLowerCase(), a = dt(i), c = fr(i), d = hr(i);
    if (t.unit && c !== t.unit) continue;
    let l = d ? 100 : -100;
    for (const u of t.entityIncludes) {
      if (!o.includes(u)) continue e;
      l += 2;
    }
    for (const u of t.friendlyIncludes) {
      if (!a.includes(u)) continue e;
      l += 1;
    }
    (l > n || l === n && r !== void 0 && s.localeCompare(r) < 0 || r === void 0) && (r = s, n = l);
  }
  return r;
}, P = (e, t) => A(e, `entitySlugs:${t.source}`, () => Array.from(new Set(L(e).map((r) => t.exec(r)?.[1]).filter((r) => !!r))).sort()), hr = (e) => e !== void 0 && e.state !== "unknown" && e.state !== "unavailable", g = (e, t) => t ? bs(e[t]) : void 0, Je = (e, t) => {
  if (!t) return;
  const r = e[t], n = Be(r);
  if (!n) return;
  if (n.textState !== void 0) return n.textState ?? void 0;
  const s = r.state;
  return n.textState = !s || s === "unknown" || s === "unavailable" ? null : s, n.textState ?? void 0;
}, w = (e, t) => {
  const r = e?.attributes[t];
  return typeof r == "string" && r.trim() !== "" ? r : void 0;
}, _ = (e, t) => {
  const r = e?.attributes[t];
  if (typeof r == "number" && Number.isFinite(r)) return r;
  if (typeof r == "string") return ee(r);
}, gr = (e, t) => {
  const r = e?.attributes[t];
  if (typeof r == "boolean") return r;
  if (typeof r == "number") return r !== 0;
  if (typeof r == "string") {
    const n = r.trim().toLowerCase();
    if (n === "1" || n === "true" || n === "on" || n === "running") return !0;
    if (n === "0" || n === "false" || n === "off" || n === "stopped") return !1;
  }
}, gs = (e, t) => {
  const r = e?.attributes[t];
  return Array.isArray(r) ? r.filter((n) => typeof n == "string" && n.trim() !== "") : [];
}, fs = (e, t) => {
  for (const r of e) {
    const n = gs(r, t);
    if (n.length > 0) return n;
  }
  return [];
}, de = (e, t) => {
  const r = e?.attributes[t];
  return Array.isArray(r) ? r.filter((n) => typeof n == "object" && n !== null) : [];
}, E = (e, t) => {
  for (const r of t) {
    const n = e[r];
    if (typeof n == "string" && n.trim() !== "") return n;
  }
}, vs = (e, t) => {
  for (const r of t) {
    const n = e[r];
    if (typeof n == "boolean") return n;
    if (typeof n == "number") return n !== 0;
    if (typeof n == "string") {
      const s = n.trim().toLowerCase();
      if (s === "1" || s === "true" || s === "on" || s === "running") return !0;
      if (s === "0" || s === "false" || s === "off" || s === "stopped") return !1;
    }
  }
}, T = (e, t) => {
  for (const r of t) {
    const n = e[r];
    if (typeof n == "number" && Number.isFinite(n)) return n;
    if (typeof n == "string") {
      const s = ee(n);
      if (s !== void 0) return s;
    }
  }
}, ee = (e) => {
  if (!e || e === "unknown" || e === "unavailable") return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, bs = (e) => {
  const t = Be(e);
  if (!(!t || !e))
    return t.parsedNumber !== void 0 || (t.parsedNumber = ee(e.state) ?? null), t.parsedNumber ?? void 0;
}, ct = (e) => e?.state === "on", fr = (e) => Be(e)?.unit, G = (e, t) => {
  const r = dt(e);
  return t.every((n) => r.includes(n));
}, je = (e, t, r) => {
  const n = ue(e);
  if (!n) return;
  const s = $s(n, t);
  if (!s) return;
  const i = s.toLowerCase();
  for (const o of r) {
    const a = o.toLowerCase();
    if (!i.endsWith(` ${a}`)) continue;
    const c = s.slice(0, s.length - o.length).trim();
    return c ? B(c) : void 0;
  }
}, lt = (e, t) => {
  const r = ue(e);
  if (!r) return;
  const n = r.toLowerCase(), s = t.replace(/_/g, " ");
  if (!n.includes(s) || !n.includes("/")) return;
  const i = r.match(/(\/[^\s]*)/);
  return i ? B(i[1]) : void 0;
}, $s = (e, t) => {
  const r = t.replace(/_/g, " ");
  if (e.toLowerCase().startsWith(`${r.toLowerCase()} `)) return e.slice(r.length + 1).trim();
}, Ft = (e) => /^(sd[a-z]+|hd[a-z]+|vd[a-z]+|xvd[a-z]+|nvme\d+n\d+|mmcblk\d+|loop\d+)$/i.test(e), Gt = (e) => /^md\d+$/i.test(e), qt = (e) => /^bond\d+$/i.test(e), Vt = (e) => /^(eth\d+|en[a-z0-9]+|eno\d+|ens\d+|enp[a-z0-9]+|wlan\d+|wl[a-z0-9]+|lo)$/i.test(e), ws = (e) => {
  if (e)
    return e.replace(/\s+/g, " ").trim() || void 0;
}, Bs = (e) => {
  const t = e?.trim().toLowerCase();
  if (t)
    return t === "hdd" || t === "sata" ? "hdd" : t === "nvme" || t === "ssd" ? "nvme" : t;
}, ks = (e) => {
  const t = e?.trim().toLowerCase();
  if (t)
    return t === "linear" ? "JBOD" : t.toUpperCase();
}, Kt = (e) => {
  const t = e.match(/^\/volume(\d+)$/i);
  return t ? `Volume ${t[1]}` : e;
}, xs = (e, t) => {
  const r = t.reduce((s, i) => (i.mediaType && (s[i.mediaType] = (s[i.mediaType] ?? 0) + i.capacityBytes), s), {}), n = Object.entries(r).map(([s, i]) => ({
    mediaType: s,
    distance: Math.abs(i - e.sizeBytes) / Math.max(e.sizeBytes, i, 1)
  })).sort((s, i) => s.distance - i.distance)[0];
  if (n)
    return n.mediaType === "hdd" ? "SATA" : n.mediaType.toUpperCase();
}, Ps = (e, t) => {
  if (!(e === void 0 && t === void 0))
    return `Drives ${e ?? t ?? 0}/${t ?? e ?? 0}`;
}, vr = (e) => {
  const t = ue(e);
  if (!t) return;
  const r = t.replace(/^(compose|docker)\s+project\s+/i, "").replace(/\s+(CPU|Memory|Total Containers|Running Containers)$/i, "").trim();
  if (!r) return;
  const n = r.split(/\s+/).filter((s, i, o) => i === 0 || s.toLowerCase() !== o[i - 1]?.toLowerCase()).join(" ");
  return n ? B(n) : void 0;
}, Cs = (e) => {
  const t = e.trim();
  if (!t) return t;
  const r = t.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim(), n = r.split(" ");
  if (n.length % 2 === 0) {
    const s = n.length / 2;
    if (n.slice(0, s).join(" ").toLowerCase() === n.slice(s).join(" ").toLowerCase()) return n.slice(0, s).join(" ");
  }
  return r;
}, Ms = (e, t, r, n) => {
  const s = Object.entries(e).filter(([i, o]) => {
    if (!i.startsWith("sensor.") || fr(o) !== "%") return !1;
    const a = `${i} ${ue(o)}`.toLowerCase(), c = a.includes(t) || a.includes(t.replace(/_/g, " ")), d = a.includes(n), l = a.includes("busy"), u = a.includes("render/3d") || a.includes("render_3d") || a.includes("blitter") || a.includes("videoenhance") || a.includes("video_enhance") || a.includes("video/") || a.includes("video_");
    return c && d && l && u;
  }).map(([, i]) => ee(i.state)).filter((i) => i !== void 0);
  return s.length > 0 ? Math.max(...s) : g(e, ze(e, t, r, n, "busy")) ?? 0;
}, F = (e, t, r) => {
  const n = ue(e);
  if (!n) return null;
  let s = n.trim();
  return t && s.endsWith(` ${t}`) && (s = s.slice(0, -` ${t}`.length)), r && s.startsWith(`${r} `) && (s = s.slice(r.length + 1)), s.startsWith("Compose project ") && (s = s.slice(16)), s.trim() || null;
}, ue = (e) => Be(e)?.friendlyName ?? "", dt = (e) => Be(e)?.friendlyNameLower ?? "", Is = (e) => {
  const t = e.match(/^cpu\s*(\d+)$/i);
  return t ? `Core ${t[1]}` : e.replace(/\s+/g, " ").trim();
}, Es = (e, t) => (ee(e.key.replace(/[^\d]/g, "")) ?? Number.MAX_SAFE_INTEGER) - (ee(t.key.replace(/[^\d]/g, "")) ?? Number.MAX_SAFE_INTEGER) || e.name.localeCompare(t.name), As = (e) => {
  const t = e.replace(/\/\d+$/g, "").replace(/\/3d/gi, "").replace(/\s+/g, "");
  return /^render/i.test(t) ? "Render" : /^blitter/i.test(t) ? "Blitter" : /^videoenhance/i.test(t) ? "VideoEnhance" : /^video/i.test(t) ? "Video" : e.replace(/\/\d+$/g, "").trim();
}, Us = (e) => e.split("_").filter(Boolean).map((t) => t === "imc" ? "IMC" : t === "rc6" ? "RC6" : t === "mhz" ? "MHz" : t === "mib" ? "MiB" : ut(t)).join(" "), ke = (e) => {
  if (!e) return;
  const t = B(e);
  return t === "unknown" ? void 0 : t;
}, zs = (e) => {
  const t = String(e?.state ?? "").trim().toLowerCase();
  return t ? t === "1" || t === "on" ? "running" : t === "0" || t === "off" ? "stopped" : t : "unknown";
}, Ts = (e, t) => {
  const r = gr(e, "running");
  if (r !== void 0) return r;
  const n = String(e?.state ?? t ?? "").trim().toLowerCase();
  if (n === "1" || n === "on" || n === "running") return !0;
  if (n === "0" || n === "off" || n === "stopped" || n === "exited") return !1;
}, Ls = (e, t, r) => {
  const n = ke(w(t, "project"));
  return n || ([
    e,
    w(t, "container") ?? "",
    w(t, "image") ?? ""
  ].some((s) => br(s, r)) ? r : void 0);
}, Rs = (e, t) => [
  e.key,
  e.name ?? "",
  e.image ?? ""
].some((r) => br(r, t)), br = (e, t) => {
  const r = e.trim().toLowerCase();
  if (!r) return !1;
  const n = t.trim().toLowerCase(), s = n.replace(/[^a-z0-9]+/g, ""), i = r.replace(/[^a-z0-9]+/g, "");
  return r === n || i === s ? !0 : Array.from(/* @__PURE__ */ new Set([
    n,
    n.replace(/-/g, "_"),
    n.replace(/_/g, "-"),
    ...n.split(/[_-]+/g).filter((o) => o.length >= 4)
  ])).some((o) => {
    const a = o.replace(/[^a-z0-9]+/g, "");
    return a ? r.startsWith(`${o}_`) || r.startsWith(`${o}-`) || r.endsWith(`_${o}`) || r.endsWith(`-${o}`) || r.includes(`_${o}_`) || r.includes(`-${o}-`) || i.includes(a) : !1;
  });
}, Xt = (e) => {
  const t = e.trim().toLowerCase();
  if (!t) return [];
  const r = /* @__PURE__ */ new Set(), n = (o) => {
    const a = B(o);
    a && a !== "unknown" && r.add(a);
  }, s = t.replace(/\[[^\]]+\]/g, "").replace(/^.*\//g, "").trim();
  if (!s) return [];
  n(s);
  const i = [s];
  for (; i.length > 0; ) {
    const o = i.pop() ?? "";
    for (const a of [
      /^(.+)-part\d+$/,
      /^(nvme\d+n\d+)p\d+$/,
      /^(mmcblk\d+)p\d+$/,
      /^([a-z]+[a-z0-9]*)\d+$/
    ]) {
      const c = o.match(a);
      if (!c?.[1]) continue;
      const d = B(c[1]);
      r.has(d) || (n(c[1]), i.push(c[1]));
    }
  }
  return Array.from(r);
}, Ze = (e) => e === "root" ? "/" : `/${e.replace(/_/g, "/")}`, ce = (e) => e.split("_").filter(Boolean).map(ut).join(" "), ut = (e) => e.charAt(0).toUpperCase() + e.slice(1), B = (e) => {
  const t = e.trim().toLowerCase();
  return t ? t === "/" ? "root" : t.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown" : "unknown";
}, C = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Ns = (e) => {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }).format(t);
}, Hs = (e) => {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "Unavailable" : new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1
  }).format(t);
}, js = (e) => `${Math.floor(e / 86400)}d ${Math.floor(e % 86400 / 3600)}h ${Math.floor(e % 3600 / 60)}m`, Jt = (e) => {
  const t = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
    "PB"
  ];
  if (!Number.isFinite(e) || e <= 0) return "0 B";
  const r = Math.min(Math.floor(Math.log(e) / Math.log(1024)), t.length - 1), n = e / 1024 ** r, s = r === 0 ? 0 : r >= 4 ? 1 : 0;
  return `${n.toLocaleString("en-US", {
    minimumFractionDigits: s,
    maximumFractionDigits: s
  })} ${t[r]}`;
}, pt = (e) => e.trim().toLowerCase(), h = (e) => e * 1024 ** 3, O = (e) => e * 1024 ** 4, y = (e) => e * 1e6, x = (e) => e * 1e9, Z = (e, t) => t.map((r) => Math.max(0, Number((e + r).toFixed(3)))), Zt = [
  {
    key: "gitea",
    title: "Gitea",
    cpuPercent: 0.3925496609109711,
    memoryBytes: 324 * 1024 ** 2,
    runningContainers: 2,
    totalContainers: 2,
    status: "up",
    containers: [{
      key: "gitea",
      name: "gitea",
      image: "gitea/gitea:latest",
      status: "Up 5 days",
      state: "running",
      running: !0,
      cpuPercent: 0.21,
      memoryBytes: 218 * 1024 ** 2,
      memoryLimitBytes: h(2)
    }, {
      key: "cloudflared_gitea",
      name: "cloudflared_gitea",
      image: "cloudflare/cloudflared:latest",
      status: "Up 5 days",
      state: "running",
      running: !0,
      cpuPercent: 0.18,
      memoryBytes: 106 * 1024 ** 2,
      memoryLimitBytes: h(1)
    }]
  },
  {
    key: "go_back_db",
    title: "Go Back DB",
    cpuPercent: 0,
    memoryBytes: 768 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up",
    containers: [
      {
        key: "go_back_db_app",
        name: "go_back_db_app",
        image: "ghcr.io/example/go-back-db-app:latest",
        status: "Up 9 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 256 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "go_back_db_front",
        name: "go_back_db_front",
        image: "ghcr.io/example/go-back-db-front:latest",
        status: "Up 9 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 188 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "go_back_db_postgres",
        name: "go_back_db_postgres",
        image: "postgres:16",
        status: "Up 9 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 324 * 1024 ** 2,
        memoryLimitBytes: h(2)
      }
    ]
  },
  {
    key: "gorent",
    title: "GoRent",
    cpuPercent: 0,
    memoryBytes: 412 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up",
    containers: [
      {
        key: "gorent-backend",
        name: "gorent-backend",
        image: "ghcr.io/example/gorent-backend:latest",
        status: "Up 3 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 178 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "gorent-frontend",
        name: "gorent-frontend",
        image: "ghcr.io/example/gorent-frontend:latest",
        status: "Up 3 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 94 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "gorent-postgres",
        name: "gorent-postgres",
        image: "postgres:16",
        status: "Up 3 days",
        state: "running",
        running: !0,
        cpuPercent: 0,
        memoryBytes: 140 * 1024 ** 2,
        memoryLimitBytes: h(2)
      }
    ]
  },
  {
    key: "home-assistant",
    title: "Home Assistant",
    cpuPercent: 0.10272887844115354,
    memoryBytes: 612 * 1024 ** 2,
    runningContainers: 4,
    totalContainers: 4,
    status: "up",
    containers: [
      {
        key: "homeassistant",
        name: "homeassistant",
        image: "ghcr.io/home-assistant/home-assistant:stable",
        status: "Up 14 days",
        state: "running",
        running: !0,
        cpuPercent: 0.08,
        memoryBytes: 356 * 1024 ** 2,
        memoryLimitBytes: h(3)
      },
      {
        key: "go2rtc",
        name: "go2rtc",
        image: "alexxit/go2rtc:latest",
        status: "Up 14 days",
        state: "running",
        running: !0,
        cpuPercent: 0.01,
        memoryBytes: 88 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "mosquitto",
        name: "mosquitto",
        image: "eclipse-mosquitto:2",
        status: "Up 14 days",
        state: "running",
        running: !0,
        cpuPercent: 0.01,
        memoryBytes: 52 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "ugos-bridge",
        name: "ugos-bridge",
        image: "rcooler/ugos-bridge:latest",
        status: "Up 14 days",
        state: "running",
        running: !0,
        cpuPercent: 0.01,
        memoryBytes: 116 * 1024 ** 2,
        memoryLimitBytes: h(1)
      }
    ]
  },
  {
    key: "virtual_machines",
    title: "Virtual machines",
    cpuPercent: 3.4,
    memoryBytes: h(5.8),
    runningContainers: 2,
    totalContainers: 3,
    status: "partial",
    containers: [
      {
        key: "ugos-vm-win11",
        name: "Windows 11",
        image: "Win11_24H2_English_x64",
        status: "Running",
        state: "running",
        running: !0,
        cpuPercent: 2.7,
        memoryBytes: h(4.1),
        memoryLimitBytes: h(8)
      },
      {
        key: "ugos-vm-ubuntu",
        name: "Ubuntu Server",
        image: "ubuntu-24.04.2-live-server-amd64",
        status: "Running",
        state: "running",
        running: !0,
        cpuPercent: 0.7,
        memoryBytes: h(1.7),
        memoryLimitBytes: h(4)
      },
      {
        key: "ugos-vm-test",
        name: "Test Lab",
        image: "debian-12.10.0-amd64-netinst",
        status: "Shutoff",
        state: "shutoff",
        running: !1,
        cpuPercent: 0,
        memoryBytes: 0,
        memoryLimitBytes: h(2)
      }
    ]
  },
  {
    key: "jellyfin",
    title: "Jellyfin",
    cpuPercent: 0.009448818897637795,
    memoryBytes: 256 * 1024 ** 2,
    runningContainers: 1,
    totalContainers: 1,
    status: "up",
    containers: [{
      key: "jellyfin-app-1",
      name: "jellyfin-app-1",
      image: "jellyfin/jellyfin:latest",
      status: "Up 11 days",
      state: "running",
      running: !0,
      cpuPercent: 0.01,
      memoryBytes: 256 * 1024 ** 2,
      memoryLimitBytes: h(4)
    }]
  },
  {
    key: "kuma_monitoring",
    title: "Kuma Monitoring",
    cpuPercent: 2.976829051619071,
    memoryBytes: 430 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up",
    containers: [
      {
        key: "uptime-kuma",
        name: "uptime-kuma",
        image: "louislam/uptime-kuma:latest",
        status: "Up 8 days",
        state: "running",
        running: !0,
        cpuPercent: 2.64,
        memoryBytes: 284 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "cloudflared_kuma",
        name: "cloudflared_kuma",
        image: "cloudflare/cloudflared:latest",
        status: "Up 8 days",
        state: "running",
        running: !0,
        cpuPercent: 0.14,
        memoryBytes: 76 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "kuma_vpn",
        name: "kuma_vpn",
        image: "qmcgaw/gluetun:latest",
        status: "Up 8 days",
        state: "running",
        running: !0,
        cpuPercent: 0.19,
        memoryBytes: 70 * 1024 ** 2,
        memoryLimitBytes: h(1)
      }
    ]
  },
  {
    key: "monitoring",
    title: "Monitoring",
    cpuPercent: 1.8076912575738409,
    memoryBytes: h(1.2),
    runningContainers: 9,
    totalContainers: 9,
    status: "up",
    containers: [
      {
        key: "grafana",
        name: "grafana",
        image: "grafana/grafana:latest",
        status: "Up 6 days",
        state: "running",
        running: !0,
        cpuPercent: 0.52,
        memoryBytes: 298 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "prometheus",
        name: "prometheus",
        image: "prom/prometheus:latest",
        status: "Up 6 days",
        state: "running",
        running: !0,
        cpuPercent: 0.41,
        memoryBytes: 356 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "loki",
        name: "loki",
        image: "grafana/loki:latest",
        status: "Up 6 days",
        state: "running",
        running: !0,
        cpuPercent: 0.18,
        memoryBytes: 184 * 1024 ** 2,
        memoryLimitBytes: h(2)
      }
    ]
  },
  {
    key: "nas",
    title: "NAS",
    cpuPercent: 0.8259763328145205,
    memoryBytes: 508 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up",
    containers: [
      {
        key: "nas-node-prom-bridge",
        name: "nas-node-prom-bridge",
        image: "ghcr.io/example/nas-node-prom-bridge:latest",
        status: "Up 20 days",
        state: "running",
        running: !0,
        cpuPercent: 0.31,
        memoryBytes: 188 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "cloudflared_nas",
        name: "cloudflared_nas",
        image: "cloudflare/cloudflared:latest",
        status: "Up 20 days",
        state: "running",
        running: !0,
        cpuPercent: 0.21,
        memoryBytes: 94 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "jinko_exporter",
        name: "jinko_exporter",
        image: "ghcr.io/example/jinko-exporter:latest",
        status: "Up 20 days",
        state: "running",
        running: !0,
        cpuPercent: 0.31,
        memoryBytes: 226 * 1024 ** 2,
        memoryLimitBytes: h(1)
      }
    ]
  },
  {
    key: "torrent",
    title: "Torrent",
    cpuPercent: 0.07306297825467073,
    memoryBytes: 184 * 1024 ** 2,
    runningContainers: 2,
    totalContainers: 2,
    status: "up",
    containers: [{
      key: "qbittorrent",
      name: "qbittorrent",
      image: "lscr.io/linuxserver/qbittorrent:latest",
      status: "Up 12 days",
      state: "running",
      running: !0,
      cpuPercent: 0.05,
      memoryBytes: 128 * 1024 ** 2,
      memoryLimitBytes: h(2)
    }, {
      key: "qbittorrent_gluetun",
      name: "qbittorrent_gluetun",
      image: "qmcgaw/gluetun:latest",
      status: "Up 12 days",
      state: "running",
      running: !0,
      cpuPercent: 0.02,
      memoryBytes: 56 * 1024 ** 2,
      memoryLimitBytes: h(1)
    }]
  },
  {
    key: "webserver",
    title: "Webserver",
    cpuPercent: 1.123501622902011,
    memoryBytes: 736 * 1024 ** 2,
    runningContainers: 7,
    totalContainers: 7,
    status: "up",
    containers: [
      {
        key: "nginx",
        name: "nginx",
        image: "nginx:stable",
        status: "Up 17 days",
        state: "running",
        running: !0,
        cpuPercent: 0.31,
        memoryBytes: 146 * 1024 ** 2,
        memoryLimitBytes: h(1)
      },
      {
        key: "nginx-proxy-manager",
        name: "nginx-proxy-manager",
        image: "jc21/nginx-proxy-manager:latest",
        status: "Up 17 days",
        state: "running",
        running: !0,
        cpuPercent: 0.49,
        memoryBytes: 308 * 1024 ** 2,
        memoryLimitBytes: h(2)
      },
      {
        key: "php84",
        name: "php84",
        image: "php:8.4-fpm",
        status: "Up 17 days",
        state: "running",
        running: !0,
        cpuPercent: 0.32,
        memoryBytes: 282 * 1024 ** 2,
        memoryLimitBytes: h(2)
      }
    ]
  }
], Ds = (e) => ({
  totalContainers: e.reduce((t, r) => t + r.totalContainers, 0),
  runningContainers: e.reduce((t, r) => t + r.runningContainers, 0),
  totalProjects: e.length,
  onlineProjects: e.filter((t) => t.status === "up").length
}), mt = [{
  name: "Pool 1",
  layout: "RAID 6 | 6 Drives",
  status: "healthy",
  usedBytes: O(10.2),
  totalBytes: O(40.5),
  accent: m.green,
  key: "pool_1",
  driveSlugs: [
    "sda",
    "sdb",
    "sdc",
    "sdd",
    "sde",
    "sdf"
  ]
}, {
  name: "Pool 2",
  layout: "RAID 1 | 2 Drives (M.2)",
  status: "healthy",
  usedBytes: O(6.1),
  totalBytes: O(8.2),
  accent: m.purple,
  key: "pool_2",
  driveSlugs: ["nvme0n1", "nvme1n1"]
}], Os = mt.reduce((e, t) => e + t.totalBytes, 0), Ss = mt.reduce((e, t) => e + t.usedBytes, 0), Ws = [
  {
    kind: "cpu",
    title: "CPU",
    accent: m.blue,
    valuePercent: 18,
    temperatureCelsius: 45,
    series: Z(18, [
      -2.2,
      -1.8,
      0.3,
      -0.4,
      1.7,
      -0.9,
      2.8,
      -2.1,
      1.2,
      0.4
    ])
  },
  {
    kind: "ram",
    title: "RAM",
    accent: m.purple,
    valuePercent: 46,
    usedBytes: h(14.6),
    totalBytes: h(32),
    series: Z(46, [
      -2.1,
      -0.5,
      1.1,
      -1.4,
      -2.2,
      1.8,
      1.4,
      0.2,
      -1.1,
      1
    ])
  },
  {
    kind: "gpu",
    title: "GPU",
    accent: m.green,
    valuePercent: 32,
    temperatureCelsius: 48,
    series: Z(32, [
      -1.5,
      -1.1,
      0.2,
      2,
      1.3,
      0.4,
      -0.8,
      1.1,
      0.2,
      -1.9
    ])
  },
  {
    kind: "system-load",
    title: "System Load",
    accent: m.softBlue,
    value: 0.78,
    statusText: "Good",
    series: Z(0.78, [
      -0.12,
      -0.08,
      0.04,
      -0.03,
      0.06,
      0.09,
      -0.04,
      0.05,
      -0.02,
      0.07
    ])
  },
  {
    kind: "total-storage",
    title: "Total Storage",
    accent: m.cyan,
    totalBytes: Os,
    usedBytes: Ss
  },
  {
    kind: "network",
    title: "Network",
    accent: m.green,
    downloadBps: x(1.2),
    uploadBps: y(123)
  }
], Fs = [
  {
    key: "cpu",
    title: "CPU",
    subtitle: "Intel Core i5-1235U",
    accent: m.blue,
    utilizationPercent: 18,
    detailRows: [
      {
        label: "Cores / Threads",
        value: "10 / 12"
      },
      {
        label: "Base / Boost",
        value: "1.3 / 4.4 GHz"
      },
      {
        label: "Temperature",
        value: "45°C"
      },
      {
        label: "Power Usage",
        value: "18 W"
      }
    ],
    series: Z(18, [
      -2.5,
      -1.8,
      0.1,
      -0.6,
      1.9,
      0.4,
      2.8,
      -1.9,
      1.2,
      3.3,
      -0.8,
      -1.6,
      0.7,
      -0.9,
      0,
      1.9,
      -2.4,
      0.9,
      0.1,
      1.8,
      -0.7
    ])
  },
  {
    key: "ram",
    title: "RAM",
    subtitle: "32 GB DDR5",
    accent: m.purple,
    utilizationPercent: 46,
    detailRows: [
      {
        label: "Used",
        value: "14.6 GB"
      },
      {
        label: "Total",
        value: "32 GB"
      },
      {
        label: "Type",
        value: "DDR5"
      },
      {
        label: "Speed",
        value: "4800 MT/s"
      }
    ],
    series: Z(46, [
      -2.1,
      -1.1,
      0.9,
      0.1,
      -1.1,
      -2.1,
      -1.2,
      2.1,
      0.3,
      1.2,
      2.9,
      1.1,
      2.1,
      -1,
      0.2,
      1,
      2,
      -1.9,
      -1.1,
      0.2,
      1
    ])
  },
  {
    key: "gpu",
    title: "GPU",
    subtitle: "Intel Iris Xe",
    accent: m.green,
    utilizationPercent: 32,
    detailRows: [
      {
        label: "VRAM Used",
        value: "1.6 GB"
      },
      {
        label: "VRAM Total",
        value: "8.0 GB"
      },
      {
        label: "Temperature",
        value: "48°C"
      },
      {
        label: "Power Usage",
        value: "15 W"
      }
    ],
    series: Z(32, [
      -3.8,
      -2,
      -1,
      1.1,
      -1,
      -2,
      2.1,
      3.8,
      1,
      0.2,
      2,
      -1,
      -3,
      -2,
      1.2,
      3.1,
      2,
      0.1,
      -1,
      1,
      -2
    ])
  }
], Gs = [
  {
    name: "M.2 1",
    model: "Lexar NM790 1TB SSD",
    capacityBytes: h(931),
    temperatureCelsius: 40,
    status: "healthy",
    diskSlug: "nvme0n1"
  },
  {
    name: "M.2 2",
    model: "Lexar NM790 1TB SSD",
    capacityBytes: h(931),
    temperatureCelsius: 41,
    status: "healthy",
    diskSlug: "nvme1n1"
  },
  {
    name: "HDD 1",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 36,
    status: "healthy",
    diskSlug: "sda"
  },
  {
    name: "HDD 2",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 37,
    status: "healthy",
    diskSlug: "sdb"
  },
  {
    name: "HDD 3",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 36,
    status: "healthy",
    diskSlug: "sdc"
  },
  {
    name: "HDD 4",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 37,
    status: "healthy",
    diskSlug: "sdd"
  },
  {
    name: "HDD 5",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 36,
    status: "healthy",
    diskSlug: "sde"
  },
  {
    name: "HDD 6",
    model: "Seagate IronWolf 12TB",
    capacityBytes: O(10.9),
    temperatureCelsius: 37,
    status: "healthy",
    diskSlug: "sdf"
  }
], qs = [
  {
    key: "cpu0",
    name: "CPU 0",
    usagePercent: 15.7,
    currentMHz: 1298,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu1",
    name: "CPU 1",
    usagePercent: 17,
    currentMHz: 1302,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu2",
    name: "CPU 2",
    usagePercent: 17.7,
    currentMHz: 1295,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu3",
    name: "CPU 3",
    usagePercent: 17.4,
    currentMHz: 1288,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu4",
    name: "CPU 4",
    usagePercent: 21.8,
    currentMHz: 1882,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu5",
    name: "CPU 5",
    usagePercent: 23.8,
    currentMHz: 1900,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu6",
    name: "CPU 6",
    usagePercent: 23.9,
    currentMHz: 1896,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu7",
    name: "CPU 7",
    usagePercent: 21.7,
    currentMHz: 1874,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu8",
    name: "CPU 8",
    usagePercent: 21.8,
    currentMHz: 1871,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu9",
    name: "CPU 9",
    usagePercent: 21.7,
    currentMHz: 1865,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu10",
    name: "CPU 10",
    usagePercent: 21.3,
    currentMHz: 1852,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  },
  {
    key: "cpu11",
    name: "CPU 11",
    usagePercent: 20.8,
    currentMHz: 1836,
    minMHz: 400,
    maxMHz: 4400,
    governor: "powersave"
  }
], Vs = [
  {
    key: "total",
    label: "Total",
    valueBytes: 62.5 * 1024 ** 3
  },
  {
    key: "used",
    label: "Used",
    valueBytes: 13.7 * 1024 ** 3,
    totalBytes: 62.5 * 1024 ** 3
  },
  {
    key: "buffers",
    label: "Buffers",
    valueBytes: 1.04 * 1024 ** 3,
    totalBytes: 62.5 * 1024 ** 3
  },
  {
    key: "cached",
    label: "Cached",
    valueBytes: 47.2 * 1024 ** 3,
    totalBytes: 62.5 * 1024 ** 3
  },
  {
    key: "swap-used",
    label: "Swap Used",
    valueBytes: 2.63 * 1024 ** 3,
    totalBytes: 37.3 * 1024 ** 3
  },
  {
    key: "swap-total",
    label: "Swap Total",
    valueBytes: 37.3 * 1024 ** 3
  }
], Ks = [
  {
    key: "blitter",
    label: "Blitter",
    busyPercent: 4.2,
    semaPercent: 0.3,
    waitPercent: 0.8
  },
  {
    key: "render",
    label: "Render",
    busyPercent: 32,
    semaPercent: 1.5,
    waitPercent: 3.2
  },
  {
    key: "video",
    label: "Video",
    busyPercent: 18.6,
    semaPercent: 0.6,
    waitPercent: 1.1
  },
  {
    key: "video-enhance",
    label: "VideoEnhance",
    busyPercent: 7.9,
    semaPercent: 0.1,
    waitPercent: 0.4
  }
], Xs = [
  {
    key: "frequency_actual_mhz",
    label: "Actual Frequency",
    value: 0,
    unit: "MHz"
  },
  {
    key: "frequency_requested_mhz",
    label: "Requested Frequency",
    value: 0,
    unit: "MHz"
  },
  {
    key: "imc_bandwidth_reads_mib_per_second",
    label: "IMC Reads",
    value: 0,
    unit: "MiB/s"
  },
  {
    key: "imc_bandwidth_writes_mib_per_second",
    label: "IMC Writes",
    value: 0,
    unit: "MiB/s"
  },
  {
    key: "interrupts_per_second",
    label: "Interrupts",
    value: 0,
    unit: "/s"
  },
  {
    key: "period_milliseconds",
    label: "Sample Period",
    value: 16.9,
    unit: "ms"
  },
  {
    key: "power_gpu_watts",
    label: "GPU Power",
    value: 0,
    unit: "W"
  },
  {
    key: "power_package_watts",
    label: "Package Power",
    value: 17.4,
    unit: "W"
  },
  {
    key: "rc6_percent",
    label: "RC6",
    value: 100,
    unit: "%"
  }
], Js = [
  {
    key: "taskmgr_serv",
    name: "Taskmgr Serv",
    processCount: 1,
    cpuPercent: 5.24,
    memoryBytes: 49 * 1024 ** 2,
    cpuTimeSeconds: 1251.18
  },
  {
    key: "embyserver",
    name: "EmbyServer",
    processCount: 1,
    cpuPercent: 4.67,
    memoryBytes: 612 * 1024 ** 2,
    cpuTimeSeconds: 18324.3
  },
  {
    key: "dockerd",
    name: "dockerd",
    processCount: 1,
    cpuPercent: 2.82,
    memoryBytes: 184 * 1024 ** 2,
    cpuTimeSeconds: 5932.8
  },
  {
    key: "containerd",
    name: "containerd",
    processCount: 1,
    cpuPercent: 2.09,
    memoryBytes: 132 * 1024 ** 2,
    cpuTimeSeconds: 4301.2
  },
  {
    key: "postgres",
    name: "postgres",
    processCount: 4,
    cpuPercent: 1.81,
    memoryBytes: 318 * 1024 ** 2,
    cpuTimeSeconds: 7022.6
  },
  {
    key: "nginx",
    name: "nginx",
    processCount: 6,
    cpuPercent: 1.26,
    memoryBytes: 144 * 1024 ** 2,
    cpuTimeSeconds: 1288.4
  },
  {
    key: "python3",
    name: "python3",
    processCount: 2,
    cpuPercent: 0.96,
    memoryBytes: 228 * 1024 ** 2,
    cpuTimeSeconds: 2311.9
  },
  {
    key: "smbd",
    name: "smbd",
    processCount: 3,
    cpuPercent: 0.63,
    memoryBytes: 96 * 1024 ** 2,
    cpuTimeSeconds: 418.5
  },
  {
    key: "redis-server",
    name: "redis-server",
    processCount: 1,
    cpuPercent: 0.31,
    memoryBytes: 48 * 1024 ** 2,
    cpuTimeSeconds: 702.2
  },
  {
    key: "prometheus",
    name: "prometheus",
    processCount: 1,
    cpuPercent: 0.22,
    memoryBytes: 354 * 1024 ** 2,
    cpuTimeSeconds: 1550.7
  }
], Ae = [
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: x(1.2),
      eth0: y(430),
      eth1: y(780)
    }
  },
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: x(1.24),
      eth0: y(440),
      eth1: y(800)
    }
  },
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: x(1.18),
      eth0: y(410),
      eth1: y(770)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: x(1.28),
      eth0: y(455),
      eth1: y(825)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: x(1.31),
      eth0: y(468),
      eth1: y(840)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: x(1.27),
      eth0: y(452),
      eth1: y(818)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: x(1.35),
      eth0: y(489),
      eth1: y(861)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: x(1.33),
      eth0: y(474),
      eth1: y(852)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: x(1.39),
      eth0: y(495),
      eth1: y(890)
    }
  },
  {
    timestampLabel: "14:28",
    totalsByInterface: {
      bond0: x(1.3),
      eth0: y(462),
      eth1: y(834)
    }
  },
  {
    timestampLabel: "14:28",
    totalsByInterface: {
      bond0: x(1.26),
      eth0: y(448),
      eth1: y(805)
    }
  },
  {
    timestampLabel: "14:29",
    totalsByInterface: {
      bond0: x(1.41),
      eth0: y(508),
      eth1: y(902)
    }
  },
  {
    timestampLabel: "14:29",
    totalsByInterface: {
      bond0: x(1.44),
      eth0: y(516),
      eth1: y(925)
    }
  },
  {
    timestampLabel: "14:30",
    totalsByInterface: {
      bond0: x(1.37),
      eth0: y(492),
      eth1: y(876)
    }
  },
  {
    timestampLabel: "14:30",
    totalsByInterface: {
      bond0: x(1.46),
      eth0: y(521),
      eth1: y(938)
    }
  }
], Zs = {
  deviceInfo: {
    model: "DXP6800 Pro",
    ugosVersion: "1.2.0",
    hostname: "DXP6800PRO",
    ipAddress: "192.168.1.100",
    uptimeSeconds: 1104120,
    lastUpdated: "2026-04-23 20:30"
  },
  hardwareSummary: Ws,
  hardwareDetails: Fs,
  drives: Gs,
  storagePools: mt,
  dockerProjects: Zt,
  dockerTotals: Ds(Zt),
  networkInterfaces: [
    {
      name: "bond0",
      status: "up",
      linkSpeedMbps: 5e3,
      temperatureCelsius: 38,
      downloadBps: y(620),
      uploadBps: y(580)
    },
    {
      name: "eth0",
      status: "up",
      linkSpeedMbps: 2500,
      temperatureCelsius: 37,
      downloadBps: y(240),
      uploadBps: y(190)
    },
    {
      name: "eth1",
      status: "up",
      linkSpeedMbps: 2500,
      temperatureCelsius: 39,
      downloadBps: y(380),
      uploadBps: y(400)
    }
  ],
  networkTrafficHistory: Ae,
  networkTrafficLines: [
    {
      key: "bond0",
      label: "bond0",
      color: m.cyan,
      currentBps: x(1.46),
      series: Ae.map((e) => e.totalsByInterface.bond0)
    },
    {
      key: "eth0",
      label: "eth0",
      color: m.good,
      currentBps: y(521),
      series: Ae.map((e) => e.totalsByInterface.eth0)
    },
    {
      key: "eth1",
      label: "eth1",
      color: m.purple,
      currentBps: y(938),
      series: Ae.map((e) => e.totalsByInterface.eth1)
    }
  ],
  cpuCores: qs,
  ramBreakdown: Vs,
  gpuEngines: Ks,
  gpuStats: Xs,
  topProcesses: Js
}, Ys = () => ({
  deviceInfo: {
    model: "UGREEN NAS",
    ugosVersion: "Unavailable",
    hostname: "Unavailable",
    ipAddress: "Unavailable",
    uptimeSeconds: 0,
    lastUpdated: "Unavailable"
  },
  hardwareSummary: [
    {
      kind: "cpu",
      title: "CPU",
      accent: m.blue,
      valuePercent: 0,
      temperatureCelsius: 0,
      series: [
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      kind: "ram",
      title: "RAM",
      accent: m.purple,
      valuePercent: 0,
      usedBytes: 0,
      totalBytes: 0,
      series: [
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      kind: "system-load",
      title: "System Load",
      accent: m.softBlue,
      value: 0,
      statusText: "Unavailable",
      series: [
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    {
      kind: "total-storage",
      title: "Total Storage",
      accent: m.cyan,
      totalBytes: 0,
      usedBytes: 0
    },
    {
      kind: "network",
      title: "Network",
      accent: m.green,
      downloadBps: 0,
      uploadBps: 0
    }
  ],
  hardwareDetails: [{
    key: "cpu",
    title: "CPU",
    subtitle: "No live data",
    accent: m.blue,
    utilizationPercent: 0,
    series: [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    detailRows: [
      {
        label: "Load (1m)",
        value: "Unavailable"
      },
      {
        label: "Frequency",
        value: "Unavailable"
      },
      {
        label: "Temperature",
        value: "Unavailable"
      },
      {
        label: "Uptime",
        value: "Unavailable"
      }
    ]
  }, {
    key: "ram",
    title: "RAM",
    subtitle: "No live data",
    accent: m.purple,
    utilizationPercent: 0,
    series: [
      0,
      0,
      0,
      0,
      0,
      0
    ],
    detailRows: [
      {
        label: "Used",
        value: "Unavailable"
      },
      {
        label: "Total",
        value: "Unavailable"
      },
      {
        label: "Usage",
        value: "Unavailable"
      },
      {
        label: "Swap Used",
        value: "Unavailable"
      }
    ]
  }],
  drives: [],
  storagePools: [],
  dockerProjects: [],
  dockerTotals: {
    totalContainers: 0,
    runningContainers: 0,
    totalProjects: 0,
    onlineProjects: 0
  },
  networkInterfaces: [],
  networkTrafficHistory: [
    {
      timestampLabel: "",
      totalsByInterface: {}
    },
    {
      timestampLabel: "",
      totalsByInterface: {}
    },
    {
      timestampLabel: "",
      totalsByInterface: {}
    },
    {
      timestampLabel: "",
      totalsByInterface: {}
    },
    {
      timestampLabel: "",
      totalsByInterface: {}
    }
  ],
  networkTrafficLines: [],
  cpuCores: [],
  ramBreakdown: [],
  gpuEngines: [],
  gpuStats: [],
  topProcesses: []
}), Qs = Dr`
  :host {
    --ugreen-bg: #030b17;
    --ugreen-panel: #071424;
    --ugreen-panel-2: #091a2d;
    --ugreen-border: rgba(18, 52, 83, 0.78);
    --ugreen-text: #edf4ff;
    --ugreen-text-dim: #9fb4d1;
    --ugreen-blue: #1bb7ff;
    --ugreen-soft-blue: #72a3ff;
    --ugreen-purple: #ba57ff;
    --ugreen-green: #5cff57;
    --ugreen-yellow: #ffd84d;
    --ugreen-network-down: #5dff59;
    --ugreen-network-up: #b04cff;
    --ugreen-shadow: 0 0 0 1px rgba(14, 79, 122, 0.32), 0 12px 28px rgba(0, 0, 0, 0.26);
    display: block;
  }

  ha-card {
    background:
      radial-gradient(circle at 10% 0%, rgba(11, 98, 167, 0.15), transparent 38%),
      linear-gradient(180deg, #041122 0%, #020b17 100%);
    color: var(--ugreen-text);
    border-radius: 18px;
    border: 1px solid rgba(26, 124, 188, 0.42);
    box-shadow: var(--ugreen-shadow);
    overflow: hidden;
  }

  .card-shell {
    padding: 12px;
  }

  .tile {
    background: linear-gradient(180deg, rgba(7, 20, 36, 0.96) 0%, rgba(5, 16, 29, 0.96) 100%);
    border: 1px solid var(--ugreen-border);
    border-radius: 14px;
    box-shadow: inset 0 0 0 1px rgba(30, 102, 158, 0.1);
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .tile {
    min-width: 0;
    min-height: 118px;
    padding: 11px;
    display: block;
  }

  .tile-identity {
    background:
      radial-gradient(circle at 0% 0%, rgba(17, 183, 255, 0.16), transparent 48%),
      linear-gradient(180deg, rgba(7, 20, 36, 0.98) 0%, rgba(5, 16, 29, 0.96) 100%);
  }

  .tile-body {
    min-height: 94px;
    height: 100%;
    display: grid;
    grid-template-rows: auto 28px 32px auto auto;
    align-content: start;
  }

  .tile-body-identity {
    grid-template-rows: auto 40px 24px auto auto;
  }

  .tile-top {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    margin-bottom: 8px;
  }

  .tile-label {
    min-width: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tile-value {
    font-size: 22px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.03em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: start;
  }

  .tile-title {
    font-size: 18px;
    line-height: 1.15;
  }

  .tile-secondary {
    font-size: 12px;
    line-height: 1.25;
    color: var(--ugreen-text-dim);
    min-height: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: start;
  }

  .tile-secondary.success {
    color: var(--ugreen-green);
  }

  .tile-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
    min-height: 15px;
    align-self: start;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    box-shadow: 0 0 10px currentColor;
  }

  .network-lines {
    display: grid;
    gap: 5px;
    min-height: 29px;
  }

  .traffic-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    min-width: 0;
  }

  .traffic-row span {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .traffic-row.down {
    color: var(--ugreen-network-down);
  }

  .traffic-row.up {
    color: var(--ugreen-network-up);
  }

  .progress-bar {
    height: 6px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(33, 57, 94, 0.9), rgba(26, 44, 72, 0.9));
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--progress-color, #63db45), var(--progress-color, #5bd45b));
  }

  .icon {
    width: 14px;
    height: 14px;
    flex: 0 0 14px;
    color: var(--ugreen-soft-blue);
  }

  .icon.accent {
    filter: drop-shadow(0 0 6px currentColor);
  }

  .icon-chip { color: var(--ugreen-soft-blue); }
  .icon-memory { color: var(--ugreen-purple); }
  .icon-gpu { color: var(--ugreen-green); }
  .icon-pulse,
  .icon-database,
  .icon-network,
  .icon-device,
  .icon-clock,
  .icon-monitor,
  .icon-calendar { color: var(--ugreen-soft-blue); }

  @media (max-width: 600px) {
    .card-shell {
      padding: 10px;
    }

    .tile {
      min-height: 104px;
      padding: 9px;
    }

    .tile-value {
      font-size: 18px;
    }

    .tile-title {
      font-size: 15px;
    }

    .tile-label,
    .tile-secondary,
    .tile-status,
    .traffic-row {
      font-size: 10px;
    }
  }
`, Yt = [
  "B",
  "KB",
  "MB",
  "GB",
  "TB",
  "PB"
], Qt = [
  "bps",
  "Kbps",
  "Mbps",
  "Gbps",
  "Tbps"
], De = (e, t) => new Intl.NumberFormat("en-US", {
  minimumFractionDigits: t,
  maximumFractionDigits: t
}).format(e), Ve = (e, t = 0) => `${De(e, t)}%`, ei = (e, t = 1) => {
  if (!Number.isFinite(e) || e <= 0) return "0 B";
  const r = Math.min(Math.floor(Math.log(e) / Math.log(1024)), Yt.length - 1);
  return `${De(e / 1024 ** r, r === 0 ? 0 : t)} ${Yt[r]}`;
}, Ye = (e) => ei(e, e >= 1024 ** 4 ? 1 : 0), er = (e, t = 1) => {
  if (!Number.isFinite(e) || e <= 0) return "0 bps";
  const r = Math.min(Math.floor(Math.log(e) / Math.log(1e3)), Qt.length - 1);
  return `${De(e / 1e3 ** r, r === 0 ? 0 : t)} ${Qt[r]}`;
}, tr = (e) => `${De(e, 0)}°C`, $r = (e, t) => `${Ye(e)} / ${Ye(t)}`, ti = (e, t) => t > 0 ? e / t * 100 : 0, rr = (e) => e.kind === "cpu" || e.kind === "gpu", ri = (e) => e.kind === "ram", ni = (e) => e.kind === "system-load", ge = (e) => Math.max(0, Math.min(1, e)), si = (e) => {
  const t = e.drives.reduce((s, i) => (i.mediaType === "nvme" ? s.nvme += i.capacityBytes : i.mediaType === "hdd" && (s.sata += i.capacityBytes), s), {
    nvme: 0,
    sata: 0
  }), r = {
    nvme: {
      totalBytes: 0,
      usedBytes: 0
    },
    sata: {
      totalBytes: 0,
      usedBytes: 0
    }
  }, n = [...e.storagePools];
  for (const s of e.storagePools) {
    const i = ii(s.name, s.layout);
    i && (r[i].totalBytes += s.totalBytes, r[i].usedBytes += s.usedBytes, n.splice(n.indexOf(s), 1));
  }
  for (const s of n) {
    const i = oi(s.totalBytes, t, r);
    r[i].totalBytes += s.totalBytes, r[i].usedBytes += s.usedBytes;
  }
  return r;
}, ii = (e, t) => {
  const r = `${e} ${t}`.toLowerCase();
  return r.includes("nvme") || r.includes("m.2") || r.includes("ssd") ? "nvme" : r.includes("sata") || r.includes("hdd") ? "sata" : null;
}, oi = (e, t, r) => ["nvme", "sata"].filter((n) => t[n] > 0).map((n) => ({
  media: n,
  distance: Math.abs(t[n] - r[n].totalBytes - e)
})).sort((n, s) => n.distance - s.distance)[0]?.media ?? "sata", nr = (e, t, r, n, s) => {
  const i = n > 0 ? ge(ti(s, n) / 100) : 0;
  return {
    id: e,
    label: t,
    icon: "database",
    accent: r,
    value: Ye(n),
    secondary: n > 0 ? $r(s, n) : "Unavailable",
    progress: i
  };
}, ai = (e) => {
  const t = e.networkInterfaces.map((o) => o.name), r = e.networkInterfaces.reduce((o, a) => o + a.downloadBps, 0), n = e.networkInterfaces.reduce((o, a) => o + a.uploadBps, 0), s = e.networkInterfaces.filter((o) => o.status === "up").length, i = e.networkInterfaces.length;
  return {
    id: "network",
    label: "Network State",
    icon: "network",
    accent: m.softBlue,
    value: i > 0 ? `${s}/${i} Up` : "Unavailable",
    secondary: t.length > 0 ? t.join(" | ") : "No interfaces",
    down: er(r),
    up: er(n)
  };
}, ci = (e) => {
  switch (e) {
    case "live":
      return {
        label: "Online",
        color: "var(--ugreen-green)"
      };
    case "missing":
      return {
        label: "No Data",
        color: "#ffd84d"
      };
    default:
      return {
        label: "Preview",
        color: "var(--ugreen-soft-blue)"
      };
  }
}, Qe = (e, t, r) => {
  const n = e.hardwareSummary.filter(rr).find((l) => l.kind === "cpu"), s = e.hardwareSummary.filter(ri).find((l) => l.kind === "ram"), i = e.hardwareSummary.filter(rr).find((l) => l.kind === "gpu"), o = e.hardwareSummary.filter(ni).find((l) => l.kind === "system-load"), a = ci(t), c = si(e), d = [
    {
      id: "cpu",
      label: "CPU",
      icon: "chip",
      accent: m.blue,
      value: Ve(n?.valuePercent ?? 0),
      secondary: n ? tr(n.temperatureCelsius) : "Unavailable",
      progress: ge((n?.valuePercent ?? 0) / 100)
    },
    {
      id: "ram",
      label: "RAM",
      icon: "memory",
      accent: m.purple,
      value: Ve(s?.valuePercent ?? 0),
      secondary: s ? $r(s.usedBytes, s.totalBytes) : "Unavailable",
      progress: ge((s?.valuePercent ?? 0) / 100)
    },
    {
      id: "gpu",
      label: "GPU",
      icon: "gpu",
      accent: m.green,
      value: i ? Ve(i.valuePercent) : "N/A",
      secondary: i ? tr(i.temperatureCelsius) : "Unavailable",
      progress: ge((i?.valuePercent ?? 0) / 100)
    },
    {
      id: "systemLoad",
      label: "Load",
      icon: "pulse",
      accent: m.softBlue,
      value: o ? o.value.toFixed(2) : "0.00",
      secondary: o?.statusText ?? "Unavailable",
      progress: ge(o ? o.value : 0)
    },
    nr("nvme", "NVMe Volume", m.cyan, c.nvme.totalBytes, c.nvme.usedBytes),
    nr("sata", "SATA Volume", m.green, c.sata.totalBytes, c.sata.usedBytes),
    ai(e)
  ];
  return {
    title: e.deviceInfo.model,
    statusLabel: a.label,
    statusColor: a.color,
    metricTiles: d
  };
}, sr = (e) => Qe(Zs, "preview", e);
function pe(e, t, r, n) {
  var s = arguments.length, i = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(e, t, r, n);
  else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (i = (s < 3 ? o(i) : s > 3 ? o(t, r, i) : o(t, r)) || i);
  return s > 3 && i && Object.defineProperty(t, r, i), i;
}
var te = class extends ve {
  constructor(...t) {
    super(...t), this.config = { type: "custom:ugreen-nas-mini-card" }, this.model = sr(), this.history = jt(), this.dataMode = "preview", this.watchEntityIds = [], this.watchPrefixes = [];
  }
  static {
    this.styles = Qs;
  }
  set hass(t) {
    const r = this._hass;
    if (!this.shouldRefreshForHassUpdate(r, t)) {
      this._hass = t;
      return;
    }
    this._hass = t, this.requestUpdate("hass", r), this.refreshModel();
  }
  get hass() {
    return this._hass;
  }
  setConfig(t) {
    if (!t || typeof t != "object") throw new Error("Invalid configuration");
    this.config = {
      title: "UGREEN NAS",
      ...t
    }, this.refreshModel();
  }
  getCardSize() {
    return 2;
  }
  render() {
    return W`
      <ha-card>
        <div class="card-shell">
          <section class="metrics">
            ${this.renderIdentityTile()}
            ${this.model.metricTiles.map((t) => this.renderMetricTile(t))}
          </section>
        </div>
      </ha-card>
    `;
  }
  renderIdentityTile() {
    return W`
      <article class="tile tile-identity">
        <div class="tile-body tile-body-identity">
          <div class="tile-top">
            ${this.renderIcon("device", "icon icon-device accent")}
            <div class="tile-label">System</div>
          </div>
          <div class="tile-value tile-title">${this.model.title}</div>
          <div class="tile-status" style=${`color:${this.model.statusColor}`}>
            <span class="status-dot"></span>
            <span>${this.model.statusLabel}</span>
          </div>
        </div>
        ${this.renderProgress(this.model.statusLabel === "Online" ? 1 : this.model.statusLabel === "No Data" ? 0.45 : 0.7, this.model.statusColor)}
      </article>
    `;
  }
  renderMetricTile(t) {
    const r = t.id === "cpu" || t.id === "gpu" || t.id === "systemLoad" ? "tile-secondary success" : "tile-secondary";
    return W`
      <article class="tile">
        <div class="tile-body">
          <div class="tile-top">
            ${this.renderIcon(t.icon, `icon icon-${t.icon} accent`)}
            <div class="tile-label">${t.label}</div>
          </div>

          ${t.value ? W`<div class="tile-value">${t.value}</div>` : k}
          ${t.secondary ? W`<div class=${r}>${t.secondary}</div>` : k}

          ${typeof t.progress == "number" ? this.renderProgress(t.progress, t.accent) : k}
          ${t.down || t.up ? this.renderNetworkRows(t.down, t.up) : k}
        </div>
      </article>
    `;
  }
  renderProgress(t, r) {
    return W`
      <div class="progress-bar" aria-hidden="true">
        <div
          class="progress-fill"
          style=${`width:${Math.max(0, Math.min(1, t)) * 100}%; --progress-color:${r}; box-shadow:0 0 10px ${r}55;`}
        ></div>
      </div>
    `;
  }
  renderNetworkRows(t, r) {
    return W`
      <div class="network-lines">
        ${t ? W`
          <div class="traffic-row down">
            ${this.renderArrowDown()}
            <span>${t}</span>
          </div>
        ` : k}
        ${r ? W`
          <div class="traffic-row up">
            ${this.renderArrowUp()}
            <span>${r}</span>
          </div>
        ` : k}
      </div>
    `;
  }
  refreshModel() {
    const t = fn(this._hass, this.config, this.history);
    if (!t) {
      if (this.history = jt(), this.watchEntityIds = [], this.watchPrefixes = [], this._hass?.states) {
        const r = Ys();
        r.deviceInfo = {
          ...r.deviceInfo,
          model: this.config.deviceModel ?? r.deviceInfo.model,
          hostname: this.config.host ?? r.deviceInfo.hostname
        }, this.model = Qe(r, "missing", this.config), this.dataMode = "missing";
      } else
        this.model = sr(this.config), this.dataMode = "preview";
      return;
    }
    this.history = t.history, this.watchEntityIds = t.watchEntityIds, this.watchPrefixes = t.watchPrefixes, this.model = Qe(t.model, "live", this.config), this.dataMode = "live";
  }
  shouldRefreshForHassUpdate(t, r) {
    const n = t?.states, s = r?.states;
    return !n || !s || this.watchEntityIds.length === 0 && this.watchPrefixes.length === 0 || this.countWatchedEntities(n) !== this.countWatchedEntities(s) ? !0 : this.watchEntityIds.some((i) => n[i] !== s[i]);
  }
  countWatchedEntities(t) {
    let r = 0;
    for (const n of Object.keys(t)) this.watchPrefixes.some((s) => n.startsWith(s)) && (r += 1);
    return r;
  }
  renderArrowDown() {
    return z`
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3v11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M5 11.5 10 16l5-4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  renderArrowUp() {
    return z`
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 17V6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M5 8.5 10 4l5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  renderIcon(t, r) {
    switch (t) {
      case "chip":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"></rect><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3M4 4l2 2M18 18l2 2M20 4l-2 2M4 20l2-2"></path></svg>`;
      case "memory":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="2"></rect><path d="M7 10v4M11 10v4M15 10v4M19 10v4M5 19v2M9 19v2M13 19v2M17 19v2"></path></svg>`;
      case "gpu":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="10" rx="2"></rect><circle cx="9" cy="11" r="2.2"></circle><path d="M16 9.5h2M16 12.5h2M8 18h8"></path></svg>`;
      case "pulse":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2.2-6 4 12 2.2-8H22"></path></svg>`;
      case "database":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"></ellipse><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path></svg>`;
      case "network":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="4" rx="1"></rect><rect x="3" y="16" width="4" height="4" rx="1"></rect><rect x="17" y="16" width="4" height="4" rx="1"></rect><path d="M12 7v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"></path></svg>`;
      case "device":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M9 2h6"></path></svg>`;
      case "clock":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>`;
      case "monitor":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 17v3"></path></svg>`;
      case "calendar":
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 9h18"></path><path d="M8 14h.01M12 14h.01M16 14h.01"></path></svg>`;
      default:
        return z`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle></svg>`;
    }
  }
};
pe([He()], te.prototype, "config", void 0);
pe([He()], te.prototype, "model", void 0);
pe([He()], te.prototype, "history", void 0);
pe([He()], te.prototype, "dataMode", void 0);
pe([pr({ attribute: !1 })], te.prototype, "hass", null);
te = pe([cn("ugreen-nas-mini-card")], te);
