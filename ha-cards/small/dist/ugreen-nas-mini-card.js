var $e = globalThis, De = $e.ShadowRoot && ($e.ShadyCSS === void 0 || $e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Se = /* @__PURE__ */ Symbol(), ct = /* @__PURE__ */ new WeakMap(), Nt = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (De && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = ct.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && ct.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
}, pr = (e) => new Nt(typeof e == "string" ? e : e + "", void 0, Se), hr = (e, ...t) => new Nt(e.length === 1 ? e[0] : t.reduce((r, n, s) => r + ((i) => {
  if (i._$cssResult$ === !0) return i.cssText;
  if (typeof i == "number") return i;
  throw Error("Value passed to 'css' function must be a 'css' function result: " + i + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[s + 1], e[0]), e, Se), yr = (e, t) => {
  if (De) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const n = document.createElement("style"), s = $e.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = r.cssText, e.appendChild(n);
  }
}, dt = De ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const n of t.cssRules) r += n.cssText;
  return pr(r);
})(e) : e, { is: fr, defineProperty: mr, getOwnPropertyDescriptor: vr, getOwnPropertyNames: _r, getOwnPropertySymbols: $r, getPrototypeOf: gr } = Object, we = globalThis, ut = we.trustedTypes, br = ut ? ut.emptyScript : "", wr = we.reactiveElementPolyfillSupport, se = (e, t) => e, ge = {
  toAttribute(e, t) {
    switch (t) {
      case Boolean:
        e = e ? br : null;
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
}, Oe = (e, t) => !fr(e, t), pt = {
  attribute: !0,
  type: String,
  converter: ge,
  reflect: !1,
  useDefault: !1,
  hasChanged: Oe
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), we.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var q = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = pt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(e, r, t);
      n !== void 0 && mr(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: n, set: s } = vr(this.prototype, e) ?? {
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
    return this.elementProperties.get(e) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(se("elementProperties"))) return;
    const e = gr(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(se("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(se("properties"))) {
      const t = this.properties, r = [..._r(t), ...$r(t)];
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
      for (const n of r) t.unshift(dt(n));
    } else e !== void 0 && t.push(dt(e));
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
    return yr(e, this.constructor.elementStyles), e;
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
      const s = (r.converter?.toAttribute !== void 0 ? r.converter : ge).toAttribute(t, r.type);
      this._$Em = e, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, n = r._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const s = r.getPropertyOptions(n), i = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : ge;
      this._$Em = n;
      const o = i.fromAttribute(t, s.type);
      this[n] = o ?? this._$Ej?.get(n) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, n = !1, s) {
    if (e !== void 0) {
      const i = this.constructor;
      if (n === !1 && (s = this[e]), r ??= i.getPropertyOptions(e), !((r.hasChanged ?? Oe)(s, t) || r.useDefault && r.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(i._$Eu(e, r)))) return;
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
q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, q[se("elementProperties")] = /* @__PURE__ */ new Map(), q[se("finalized")] = /* @__PURE__ */ new Map(), wr?.({ ReactiveElement: q }), (we.reactiveElementVersions ??= []).push("2.1.2");
var je = globalThis, ht = (e) => e, be = je.trustedTypes, yt = be ? be.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Dt = "$lit$", R = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + R, xr = `<${St}>`, j = document, oe = () => j.createComment(""), ae = (e) => e === null || typeof e != "object" && typeof e != "function", He = Array.isArray, Br = (e) => He(e) || typeof e?.[Symbol.iterator] == "function", Ee = `[ 	
\f\r]`, te = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ft = /-->/g, mt = />/g, N = RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, _t = /"/g, Ot = /^(?:script|style|textarea|title)$/i, We = (e) => (t, ...r) => ({
  _$litType$: e,
  strings: t,
  values: r
}), U = We(1), w = We(2), as = We(3), K = /* @__PURE__ */ Symbol.for("lit-noChange"), v = /* @__PURE__ */ Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), D = j.createTreeWalker(j, 129);
function jt(e, t) {
  if (!He(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(t) : t;
}
var Mr = (e, t) => {
  const r = e.length - 1, n = [];
  let s, i = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = te;
  for (let a = 0; a < r; a++) {
    const l = e[a];
    let m, u, p = -1, _ = 0;
    for (; _ < l.length && (o.lastIndex = _, u = o.exec(l), u !== null); ) _ = o.lastIndex, o === te ? u[1] === "!--" ? o = ft : u[1] !== void 0 ? o = mt : u[2] !== void 0 ? (Ot.test(u[2]) && (s = RegExp("</" + u[2], "g")), o = N) : u[3] !== void 0 && (o = N) : o === N ? u[0] === ">" ? (o = s ?? te, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, m = u[1], o = u[3] === void 0 ? N : u[3] === '"' ? _t : vt) : o === _t || o === vt ? o = N : o === ft || o === mt ? o = te : (o = N, s = void 0);
    const B = o === N && e[a + 1].startsWith("/>") ? " " : "";
    i += o === te ? l + xr : p >= 0 ? (n.push(m), l.slice(0, p) + Dt + l.slice(p) + R + B) : l + R + (p === -2 ? a : B);
  }
  return [jt(e, i + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
}, Ue = class Ht {
  constructor({ strings: t, _$litType$: r }, n) {
    let s;
    this.parts = [];
    let i = 0, o = 0;
    const a = t.length - 1, l = this.parts, [m, u] = Mr(t, r);
    if (this.el = Ht.createElement(m, n), D.currentNode = this.el.content, r === 2 || r === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = D.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(Dt)) {
          const _ = u[o++], B = s.getAttribute(p).split(R), A = /([.?@])?(.*)/.exec(_);
          l.push({
            type: 1,
            index: i,
            name: A[2],
            strings: B,
            ctor: A[1] === "." ? Ir : A[1] === "?" ? Cr : A[1] === "@" ? Ar : xe
          }), s.removeAttribute(p);
        } else p.startsWith(R) && (l.push({
          type: 6,
          index: i
        }), s.removeAttribute(p));
        if (Ot.test(s.tagName)) {
          const p = s.textContent.split(R), _ = p.length - 1;
          if (_ > 0) {
            s.textContent = be ? be.emptyScript : "";
            for (let B = 0; B < _; B++) s.append(p[B], oe()), D.nextNode(), l.push({
              type: 2,
              index: ++i
            });
            s.append(p[_], oe());
          }
        }
      } else if (s.nodeType === 8) if (s.data === St) l.push({
        type: 2,
        index: i
      });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(R, p + 1)) !== -1; ) l.push({
          type: 7,
          index: i
        }), p += R.length - 1;
      }
      i++;
    }
  }
  static createElement(t, r) {
    const n = j.createElement("template");
    return n.innerHTML = t, n;
  }
};
function J(e, t, r = e, n) {
  if (t === K) return t;
  let s = n !== void 0 ? r._$Co?.[n] : r._$Cl;
  const i = ae(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== i && (s?._$AO?.(!1), i === void 0 ? s = void 0 : (s = new i(e), s._$AT(e, r, n)), n !== void 0 ? (r._$Co ??= [])[n] = s : r._$Cl = s), s !== void 0 && (t = J(e, s._$AS(e, t.values), s, n)), t;
}
var kr = class {
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
    const { el: { content: t }, parts: r } = this._$AD, n = (e?.creationScope ?? j).importNode(t, !0);
    D.currentNode = n;
    let s = D.nextNode(), i = 0, o = 0, a = r[0];
    for (; a !== void 0; ) {
      if (i === a.index) {
        let l;
        a.type === 2 ? l = new Fe(s, s.nextSibling, this, e) : a.type === 1 ? l = new a.ctor(s, a.name, a.strings, this, e) : a.type === 6 && (l = new Er(s, this, e)), this._$AV.push(l), a = r[++o];
      }
      i !== a?.index && (s = D.nextNode(), i++);
    }
    return D.currentNode = j, n;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}, Fe = class Wt {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, n, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = n, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = J(this, t, r), ae(t) ? t === v || t == null || t === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : t !== this._$AH && t !== K && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Br(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== v && ae(this._$AH) ? this._$AA.nextSibling.data = t : this.T(j.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = Ue.createElement(jt(n.h, n.h[0]), this.options)), n);
    if (this._$AH?._$AD === s) this._$AH.p(r);
    else {
      const i = new kr(s, this), o = i.u(this.options);
      i.p(r), this.T(o), this._$AH = i;
    }
  }
  _$AC(t) {
    let r = $t.get(t.strings);
    return r === void 0 && $t.set(t.strings, r = new Ue(t)), r;
  }
  k(t) {
    He(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let n, s = 0;
    for (const i of t) s === r.length ? r.push(n = new Wt(this.O(oe()), this.O(oe()), this, this.options)) : n = r[s], n._$AI(i), s++;
    s < r.length && (this._$AR(n && n._$AB.nextSibling, s), r.length = s);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const n = ht(t).nextSibling;
      ht(t).remove(), t = n;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}, xe = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, n, s) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = t, this._$AM = n, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(/* @__PURE__ */ new String()), this.strings = r) : this._$AH = v;
  }
  _$AI(e, t = this, r, n) {
    const s = this.strings;
    let i = !1;
    if (s === void 0) e = J(this, e, t, 0), i = !ae(e) || e !== this._$AH && e !== K, i && (this._$AH = e);
    else {
      const o = e;
      let a, l;
      for (e = s[0], a = 0; a < s.length - 1; a++) l = J(this, o[r + a], t, a), l === K && (l = this._$AH[a]), i ||= !ae(l) || l !== this._$AH[a], l === v ? e = v : e !== v && (e += (l ?? "") + s[a + 1]), this._$AH[a] = l;
    }
    i && !n && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}, Ir = class extends xe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}, Cr = class extends xe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}, Ar = class extends xe {
  constructor(e, t, r, n, s) {
    super(e, t, r, n, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = J(this, e, t, 0) ?? v) === K) return;
    const r = this._$AH, n = e === v && r !== v || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, s = e !== v && (r === v || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}, Er = class {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    J(this, e);
  }
};
var Pr = je.litHtmlPolyfillSupport;
Pr?.(Ue, Fe), (je.litHtmlVersions ??= []).push("3.3.2");
var Ur = (e, t, r) => {
  const n = r?.renderBefore ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const i = r?.renderBefore ?? null;
    n._$litPart$ = s = new Fe(t.insertBefore(oe(), i), i, void 0, r ?? {});
  }
  return s._$AI(e), s;
}, Ge = globalThis, ie = class extends q {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ur(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return K;
  }
};
ie._$litElement$ = !0, ie.finalized = !0, Ge.litElementHydrateSupport?.({ LitElement: ie });
var Tr = Ge.litElementPolyfillSupport;
Tr?.({ LitElement: ie });
(Ge.litElementVersions ??= []).push("4.2.2");
var Lr = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
}, Rr = {
  attribute: !0,
  type: String,
  converter: ge,
  reflect: !1,
  hasChanged: Oe
}, zr = (e = Rr, t, r) => {
  const { kind: n, metadata: s } = r;
  let i = globalThis.litPropertyMetadata.get(s);
  if (i === void 0 && globalThis.litPropertyMetadata.set(s, i = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), i.set(r.name, e), n === "accessor") {
    const { name: o } = r;
    return {
      set(a) {
        const l = t.get.call(this);
        t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
      },
      init(a) {
        return a !== void 0 && this.C(o, void 0, e, a), a;
      }
    };
  }
  if (n === "setter") {
    const { name: o } = r;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function Ft(e) {
  return (t, r) => typeof r == "object" ? zr(e, t, r) : ((n, s, i) => {
    const o = s.hasOwnProperty(i);
    return s.constructor.createProperty(i, n), o ? Object.getOwnPropertyDescriptor(s, i) : void 0;
  })(e, t, r);
}
function Be(e) {
  return Ft({
    ...e,
    state: !0,
    attribute: !1
  });
}
var d = {
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
}, Gt = 21, fe = [
  d.green,
  d.cyan,
  d.purple,
  d.softBlue
], Nr = /^sensor\.ugos_exporter_host_(.+?)_cpu_usage_percent$/, Dr = /^sensor\.ugos_exporter_project_(.+?)_cpu_usage_percent$/, Sr = /^sensor\.([a-z0-9_]+)_\1_cpu(?:_|$)/, gt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), X = (e) => {
  let t = gt.get(e);
  return t || (t = {
    prefixEntries: /* @__PURE__ */ new Map(),
    computedResults: /* @__PURE__ */ new Map(),
    resolutionResults: /* @__PURE__ */ new Map(),
    booleanResults: /* @__PURE__ */ new Map()
  }, gt.set(e, t)), t;
}, M = (e) => {
  const t = X(e);
  return t.keys || (t.keys = Object.keys(e)), t.keys;
}, I = (e) => {
  const t = X(e);
  return t.entries || (t.entries = Object.entries(e)), t.entries;
}, ce = (e) => {
  const t = X(e);
  return t.values || (t.values = Object.values(e)), t.values;
}, b = (e, t) => {
  const r = X(e), n = r.prefixEntries.get(t);
  if (n) return n;
  const s = I(e).filter(([i]) => i.startsWith(t));
  return r.prefixEntries.set(t, s), s;
}, C = (e, t, r) => {
  const n = X(e), s = n.computedResults.get(t);
  if (s !== void 0) return s;
  const i = r();
  return n.computedResults.set(t, i), i;
}, x = (e, t, r) => {
  const n = X(e);
  if (n.resolutionResults.has(t)) return n.resolutionResults.get(t);
  const s = r();
  return n.resolutionResults.set(t, s), s;
}, de = (e) => {
  if (!e) return;
  let t = bt.get(e);
  if (!t) {
    const r = typeof e.attributes.friendly_name == "string" ? e.attributes.friendly_name : "", n = typeof e.attributes.unit_of_measurement == "string" ? e.attributes.unit_of_measurement : void 0;
    t = {
      friendlyName: r,
      friendlyNameLower: r.toLowerCase(),
      unit: n
    }, bt.set(e, t);
  }
  return t;
}, wt = () => ({ samples: [] }), Or = (e, t, r) => {
  const n = e?.states;
  if (!n) return null;
  const s = Xr(n, t?.host);
  if (!s) return null;
  const i = `ugos_exporter_host_${s}`, o = L(n, s, "cpu"), a = y(n, o) ?? 0, l = y(n, L(n, s, "load1")) ?? 0, m = y(n, L(n, s, "cpufreq")), u = y(n, L(n, s, "uptime")) ?? 0, p = y(n, L(n, s, "memoryUsedBytes")) ?? 0, _ = y(n, L(n, s, "memoryUsedPercent")) ?? 0, B = y(n, L(n, s, "swapUsedPercent")) ?? 0, A = Qr(p, _, t?.memoryTotalBytes), pe = Zr(n, s, t?.host), z = Jr(n, s), Ze = kt(z, [
    "cpu",
    "package",
    "soc",
    "core",
    "tctl"
  ]), W = un(n, s, i)[0], F = W !== void 0 ? Sn(n, s, i, W) : void 0, er = W !== void 0 ? y(n, Te(n, s, i, W, "current")) : void 0, tr = W !== void 0 ? y(n, Te(n, s, i, W, "max")) : void 0, Ye = kt(z, [
    "gpu",
    "graphics",
    "igpu",
    "intel"
  ]), rr = en(qr(n, s), t?.storageFilesystems), Qe = nn(n, s, i).map((c) => Hr(n, s, pe, c)).filter((c) => c !== null).sort((c, g) => c.name.localeCompare(g.name)), nr = Wr(Kr(n, s), rr, Qe), sr = rn(n), ee = Array.from(new Set(sr)).map((c) => Fr(n, c)).filter((c) => c !== null).sort((c, g) => g.cpuPercent - c.cpuPercent || c.title.localeCompare(g.title)), he = on(n, s, i), ir = an(n, s, i), Ie = tn(ln(Array.from(/* @__PURE__ */ new Set([...he, ...ir])).sort(), t?.networkInterfaces), t?.networkInterfaces), or = Ie.map((c) => he.includes(c) ? Gr(n, s, c, z) : Vr(n, s, c, z)).filter((c) => c !== null).sort((c, g) => c.name.localeCompare(g.name)), et = Ie.filter((c) => he.includes(c)), tt = et.length > 0 ? et : he, rt = tt.reduce((c, g) => c + (y(n, O(n, s, g, "rx")) ?? 0) * 8, 0), nt = tt.reduce((c, g) => c + (y(n, O(n, s, g, "tx")) ?? 0) * 8, 0), Ce = cn(Ie), ye = Object.fromEntries(Ce.map((c) => [c, Vt(n, s, c)])), Ae = (o ? n[o]?.last_updated : void 0) ?? (o ? n[o]?.last_changed : void 0) ?? `${a}:${_}:${F ?? 0}:${rt}:${nt}:${JSON.stringify(ye)}`, G = $n(r, {
    key: Ae,
    timestampLabel: On(Ae),
    cpuPercent: a,
    ramPercent: _,
    gpuPercent: F ?? 0,
    load1: l,
    networkBpsBySlug: ye
  }), st = ve(G.samples.map((c) => c.cpuPercent), a, 12), it = ve(G.samples.map((c) => c.ramPercent), _, 12), ot = ve(G.samples.map((c) => c.gpuPercent), F ?? 0, 12), ar = ve(G.samples.map((c) => c.load1), l, 12), at = gn(G.samples, Ce, ye), lr = Ce.map((c, g) => ({
    key: c,
    label: Je(c),
    color: dn(c, g),
    currentBps: ye[c] ?? 0,
    series: at.map((ur) => ur.totalsByInterface[c] ?? 0)
  })), cr = [
    {
      kind: "cpu",
      title: "CPU",
      accent: d.blue,
      valuePercent: a,
      temperatureCelsius: Ze ?? 0,
      series: st
    },
    {
      kind: "ram",
      title: "RAM",
      accent: d.purple,
      valuePercent: _,
      usedBytes: p,
      totalBytes: A,
      series: it
    },
    ...F !== void 0 ? [{
      kind: "gpu",
      title: "GPU",
      accent: d.green,
      valuePercent: F,
      temperatureCelsius: Ye ?? 0,
      series: ot
    }] : [],
    {
      kind: "system-load",
      title: "System Load",
      accent: d.softBlue,
      value: l,
      statusText: wn(l),
      series: ar
    },
    {
      kind: "network",
      title: "Network",
      accent: d.green,
      downloadBps: rt,
      uploadBps: nt
    }
  ], dr = jr({
    cpuFrequencyMHz: m,
    cpuPercent: a,
    cpuSeries: st,
    cpuTemperature: Ze,
    gpuBusyPercent: F,
    gpuCurrentMHz: er,
    gpuMaxMHz: tr,
    gpuSeries: ot,
    gpuTemperature: Ye,
    load1: l,
    memoryTotalBytes: A,
    memoryUsedBytes: p,
    memoryUsedPercent: _,
    ramSeries: it,
    swapUsedPercent: B,
    uptimeSeconds: u
  }), lt = Bn(s);
  return {
    history: G,
    watchEntityIds: Mn(n, lt, t?.ipEntity),
    watchPrefixes: lt,
    model: {
      deviceInfo: {
        model: t?.deviceModel ?? "UGREEN NAS",
        ugosVersion: t?.ugosVersion ?? "Unavailable",
        hostname: pe,
        ipAddress: Yr(n, t),
        uptimeSeconds: u,
        lastUpdated: jn(Ae)
      },
      hardwareSummary: cr,
      hardwareDetails: dr,
      drives: Qe,
      storagePools: nr,
      dockerProjects: ee,
      dockerTotals: {
        totalContainers: ee.reduce((c, g) => c + g.totalContainers, 0),
        runningContainers: ee.reduce((c, g) => c + g.runningContainers, 0),
        totalProjects: ee.length,
        onlineProjects: ee.filter((c) => c.status === "up").length
      },
      networkInterfaces: or,
      networkTrafficHistory: at,
      networkTrafficLines: lr
    }
  };
}, jr = ({ cpuFrequencyMHz: e, cpuPercent: t, cpuSeries: r, cpuTemperature: n, gpuBusyPercent: s, gpuCurrentMHz: i, gpuMaxMHz: o, gpuSeries: a, gpuTemperature: l, load1: m, memoryTotalBytes: u, memoryUsedBytes: p, memoryUsedPercent: _, ramSeries: B, swapUsedPercent: A, uptimeSeconds: pe }) => {
  const z = [{
    key: "cpu",
    title: "CPU",
    subtitle: "System Processor",
    accent: d.blue,
    utilizationPercent: t,
    series: r,
    detailRows: [
      {
        label: "Load (1m)",
        value: m.toFixed(2)
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
        value: Hn(pe)
      }
    ]
  }, {
    key: "ram",
    title: "RAM",
    subtitle: "System Memory",
    accent: d.purple,
    utilizationPercent: _,
    series: B,
    detailRows: [
      {
        label: "Used",
        value: Ct(p)
      },
      {
        label: "Total",
        value: Ct(u)
      },
      {
        label: "Usage",
        value: `${_.toFixed(_ >= 10 ? 1 : 2)}%`
      },
      {
        label: "Swap Used",
        value: `${A.toFixed(A >= 10 ? 1 : 2)}%`
      }
    ]
  }];
  return s !== void 0 && z.push({
    key: "gpu",
    title: "GPU",
    subtitle: "Integrated Graphics",
    accent: d.green,
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
        value: l !== void 0 ? `${Math.round(l)}°C` : "Unavailable"
      },
      {
        label: "Source",
        value: "UGOS Exporter MQTT"
      }
    ]
  }), z;
}, Hr = (e, t, r, n) => {
  const s = y(e, V(e, t, n, "size"));
  if (s === void 0) return null;
  const i = y(e, V(e, t, n, "temperature")), o = y(e, V(e, t, n, "read")), a = y(e, V(e, t, n, "write")), l = y(e, V(e, t, n, "busy")), m = Le(e, Bt(e, t, n, "model")), u = Ln(Le(e, Bt(e, t, n, "type"))), p = Tn(m), _ = ue(e[V(e, t, n, "size") ?? ""], "Size", r) ?? Zt(n);
  return {
    name: u === "hdd" ? `${p ?? _} ${n.toUpperCase()}` : p ?? _,
    model: u ? u.toUpperCase() : i !== void 0 ? "Physical Disk" : "Disk",
    capacityBytes: s,
    temperatureCelsius: i,
    readBytesPerSecond: o,
    writeBytesPerSecond: a,
    busyPercent: l,
    status: bn(i),
    mediaType: u,
    diskSlug: n,
    deviceModel: p ?? void 0
  };
}, Wr = (e, t, r) => {
  if (e.length === 0) return t.map((s, i) => ({
    name: It(Re(s.slug)),
    layout: s.readOnly ? "Filesystem | Read-only" : "Filesystem",
    status: s.readOnly ? "warning" : "healthy",
    usedBytes: s.usedBytes,
    totalBytes: s.totalBytes,
    accent: fe[i % fe.length]
  }));
  const n = [...t];
  return e.map((s, i) => {
    const o = n.findIndex((p) => Math.abs(p.totalBytes - s.sizeBytes) / Math.max(s.sizeBytes, 1) < 0.05), a = o >= 0 ? n.splice(o, 1)[0] : void 0, l = zn(s, r), m = a ? It(Re(a.slug)) : void 0, u = Rn(s.level);
    return {
      name: l ?? m ?? s.name,
      layout: [u, m].filter(Boolean).join(" | ") || `${s.slug.toUpperCase()} Array`,
      driveCountText: Nn(s.activeDisks, s.totalDisks),
      status: s.degradedDisks > 0 ? "degraded" : a?.readOnly ? "warning" : "healthy",
      usedBytes: a?.usedBytes ?? 0,
      totalBytes: a?.totalBytes ?? s.sizeBytes,
      accent: fe[i % fe.length]
    };
  });
}, Fr = (e, t) => {
  const r = me(e, t, "cpu"), n = y(e, r), s = y(e, me(e, t, "memory")), i = y(e, me(e, t, "total")), o = y(e, me(e, t, "running"));
  return n === void 0 || s === void 0 || i === void 0 || o === void 0 ? null : {
    key: t,
    title: Dn(ue(e[r ?? ""], "CPU", "") ?? t.split("_").filter(Boolean).map(Yt).join(" ")),
    cpuPercent: n,
    memoryBytes: s,
    runningContainers: Math.round(o),
    totalContainers: Math.round(i),
    status: o <= 0 ? "down" : o < i ? "partial" : "up"
  };
}, Gr = (e, t, r, n) => {
  const s = O(e, t, r, "rx"), i = O(e, t, r, "tx"), o = y(e, s), a = y(e, i);
  if (o === void 0 || a === void 0) return null;
  const l = y(e, O(e, t, r, "speed"));
  return {
    name: Je(r),
    status: qe(e[fn(e, t, r) ?? ""]) ? "up" : "down",
    linkSpeedMbps: l ?? void 0,
    temperatureCelsius: qt(n, r),
    downloadBps: o * 8,
    uploadBps: a * 8
  };
}, Vr = (e, t, r, n) => {
  const s = y(e, mn(e, t, r, "speed")), i = vn(e, t, r), o = Vt(e, t, r);
  return s === void 0 && !i ? null : {
    name: Je(r),
    status: qe(e[i ?? ""]) ? "up" : "down",
    linkSpeedMbps: s ?? void 0,
    temperatureCelsius: qt(n, r),
    downloadBps: o / 2,
    uploadBps: o / 2
  };
}, qr = (e, t) => sn(e, t).map((r) => {
  const n = Mt(e, t, r, "used"), s = Mt(e, t, r, "free"), i = y(e, n), o = y(e, s);
  return i === void 0 || o === void 0 ? null : {
    slug: r,
    name: ue(e[n ?? ""], "Used", "") ?? Re(r),
    usedBytes: i,
    freeBytes: o,
    totalBytes: i + o,
    readOnly: qe(e[hn(e, t, r) ?? ""])
  };
}).filter((r) => r !== null).sort((r, n) => r.name.localeCompare(n.name)), Kr = (e, t) => {
  const r = pn(e, t), n = [];
  for (const s of r) {
    const i = re(e, t, s, "size"), o = y(e, i);
    if (o === void 0) continue;
    const a = y(e, re(e, t, s, "degraded")) ?? 0, l = y(e, re(e, t, s, "active")), m = y(e, re(e, t, s, "total")), u = y(e, re(e, t, s, "sync")), p = Le(e, yn(e, t, s, "level"));
    n.push({
      slug: s,
      name: ue(e[i ?? ""], "Size", "") ?? s.toUpperCase(),
      sizeBytes: o,
      degradedDisks: Math.round(a),
      activeDisks: l !== void 0 ? Math.round(l) : void 0,
      totalDisks: m !== void 0 ? Math.round(m) : void 0,
      syncPercent: u,
      level: p
    });
  }
  return n.sort((s, i) => s.name.localeCompare(i.name));
}, Jr = (e, t) => C(e, `temperatures:${t}`, () => {
  const r = [`sensor.ugos_exporter_host_${t}_`, `sensor.${t}_`];
  return I(e).filter(([n, s]) => n.startsWith("sensor.") && r.some((i) => n.startsWith(i)) && (n.endsWith("_temperature_celsius") || T(s, ["temperature"]))).map(([n, s]) => {
    const i = Ve(s.state);
    return i === void 0 ? null : {
      entityId: n,
      label: `${Y(s)} ${n}`.trim().toLowerCase(),
      value: i
    };
  }).filter((n) => n !== null);
}), Xr = (e, t) => C(e, `hostSlug:${t ?? ""}`, () => {
  if (t) {
    const s = P(t);
    if (xn(e, s)) return s;
  }
  const r = Array.from(new Set(M(e).map((s) => Nr.exec(s)?.[1]).filter((s) => !!s))).sort();
  if (r.length === 0) return Array.from(new Set(M(e).map((s) => Sr.exec(s)?.[1]).filter((s) => !!s))).sort()[0] ?? null;
  if (!t) return r[0];
  const n = P(t);
  return r.find((s) => s === n) ?? r[0];
}), Zr = (e, t, r) => ue(e[L(e, t, "cpu") ?? ""], "CPU", "") ?? r?.trim() ?? Zt(t), Yr = (e, t) => {
  if (t?.ipEntity) {
    const r = e[t.ipEntity]?.state;
    if (r && r !== "unknown" && r !== "unavailable") return r;
  }
  return t?.ipAddress?.trim() || "Unavailable";
}, Qr = (e, t, r) => r && r > 0 ? r : t > 0 ? Math.max(e, Math.round(e / (t / 100))) : e, en = (e, t) => {
  if (t && t.length > 0) {
    const n = e.filter((s) => _n(s.slug, s.name, t));
    if (n.length > 0) return n;
  }
  const r = e.filter((n) => n.name !== "/");
  return r.length > 0 ? r : e;
}, tn = (e, t) => {
  if (!t || t.length === 0) return e.filter((s) => s !== "lo");
  const r = t.map((s) => P(s)), n = e.filter((s) => r.includes(P(s)));
  return n.length > 0 ? n : e;
}, rn = (e) => C(e, "projectSlugs", () => {
  const t = M(e).map((n) => Dr.exec(n)?.[1]).filter((n) => !!n), r = b(e, "sensor.compose_project_").map(([, n]) => Jt(n)).filter((n) => !!n);
  return Array.from(/* @__PURE__ */ new Set([...t, ...r])).sort();
}), nn = (e, t, r) => C(e, `diskSlugs:${t}:${r}`, () => {
  const n = Z(e, new RegExp(`^sensor\\.${k(r)}_disk_(.+?)_size_bytes$`)), s = M(e).map((o) => o.match(new RegExp(`^sensor\\.${k(t)}_disk_([^_]+)_`))?.[1]).filter((o) => !!o), i = ce(e).map((o) => Me(o, t, [
    "Size",
    "Busy",
    "Read Throughput",
    "Write Throughput"
  ])).filter((o) => o !== void 0 && An(o));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i
  ])).sort();
}), sn = (e, t) => C(e, `filesystemSlugs:${t}`, () => {
  const r = Z(e, new RegExp(`^sensor\\.ugos_exporter_host_${k(t)}_filesystem_(.+?)_used_bytes$`)), n = M(e).map((i) => i.match(new RegExp(`^sensor\\.${k(t)}_filesystem_([^_]+)_`))?.[1]).filter((i) => !!i), s = ce(e).map((i) => Ke(i, t)).filter((i) => !!i);
  return Array.from(/* @__PURE__ */ new Set([
    ...r,
    ...n,
    ...s
  ])).sort();
}), on = (e, t, r) => C(e, `networkSlugs:${t}:${r}`, () => {
  const n = Z(e, new RegExp(`^sensor\\.${k(r)}_network_(.+?)_rx_bytes_per_second$`)), s = M(e).map((o) => o.match(new RegExp(`^sensor\\.${k(t)}_network_([^_]+)_`))?.[1]).filter((o) => !!o), i = ce(e).map((o) => Me(o, t, [
    "RX Throughput",
    "TX Throughput",
    "Link Speed",
    "Carrier"
  ])).filter((o) => o !== void 0 && Un(o));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i
  ])).sort();
}), an = (e, t, r) => C(e, `bondSlugs:${t}:${r}`, () => {
  const n = Z(e, new RegExp(`^sensor\\.${k(r)}_bond_(.+?)_speed_mbps$`)), s = M(e).map((o) => o.match(new RegExp(`^sensor\\.${k(t)}_bond_([^_]+)_`))?.[1]).filter((o) => !!o), i = ce(e).map((o) => Me(o, t, [
    "Link Speed",
    "Mode",
    "Active Slave",
    "MII Status",
    "Slave Count",
    "Carrier"
  ])).filter((o) => o !== void 0 && Pn(o));
  return Array.from(/* @__PURE__ */ new Set([
    ...n,
    ...s,
    ...i
  ])).sort();
}), ln = (e, t) => {
  if (t && t.length > 0) return e;
  const r = e.filter((n) => /^(bond\d+|eth\d+)$/i.test(n));
  return r.length > 0 ? r : e;
}, cn = (e) => [...e].filter((t) => /^(bond\d+|eth\d+)$/i.test(t)).sort((t, r) => xt(t) - xt(r) || t.localeCompare(r)).slice(0, 3), xt = (e) => {
  const t = e.toLowerCase();
  return t.startsWith("bond") ? 0 : t.startsWith("eth") ? 1 : 2;
}, Vt = (e, t, r) => {
  const n = y(e, O(e, t, r, "rx")), s = y(e, O(e, t, r, "tx"));
  return ((n ?? 0) + (s ?? 0)) * 8;
}, dn = (e, t) => {
  const r = e.toLowerCase();
  return r.startsWith("bond") ? d.cyan : r === "eth0" ? d.good : r === "eth1" ? d.purple : [
    d.softBlue,
    d.green,
    d.blue
  ][t % 3];
}, un = (e, t, r) => C(e, `gpuSlugs:${t}:${r}`, () => {
  const n = Z(e, new RegExp(`^sensor\\.${k(r)}_gpu_(.+?)_current_mhz$`)), s = M(e).map((i) => i.match(new RegExp(`^sensor\\.${k(t)}_gpu_([^_]+)_`))?.[1]).filter((i) => !!i);
  return Array.from(/* @__PURE__ */ new Set([...n, ...s])).sort();
}), pn = (e, t) => C(e, `arraySlugs:${t}`, () => {
  const r = Z(e, new RegExp(`^sensor\\.ugos_exporter_host_${k(t)}_array_(.+?)_size_bytes$`)), n = M(e).map((i) => i.match(new RegExp(`^sensor\\.${k(t)}_array_([^_]+)_`))?.[1]).filter((i) => !!i), s = ce(e).map((i) => Me(i, t, [
    "Size",
    "Degraded Disks",
    "Sync Progress"
  ])).filter((i) => i !== void 0 && En(i));
  return Array.from(/* @__PURE__ */ new Set([
    ...r,
    ...n,
    ...s
  ])).sort();
}), L = (e, t, r) => x(e, `hostMetric:${t}:${r}`, () => {
  const n = {
    cpu: `sensor.ugos_exporter_host_${t}_cpu_usage_percent`,
    load1: `sensor.ugos_exporter_host_${t}_load_1`,
    cpufreq: `sensor.ugos_exporter_host_${t}_cpu_frequency_mhz`,
    memoryUsedBytes: `sensor.ugos_exporter_host_${t}_memory_used_bytes`,
    memoryUsedPercent: `sensor.ugos_exporter_host_${t}_memory_used_percent`,
    swapUsedPercent: `sensor.ugos_exporter_host_${t}_swap_used_percent`,
    uptime: `sensor.ugos_exporter_host_${t}_uptime_seconds`
  };
  if (e[n[r]]) return n[r];
  const s = C(e, `hostRootEntries:${t}`, () => I(e).filter(([i]) => kn(i, t)));
  switch (r) {
    case "cpu":
      return f(s, {
        entityIncludes: ["_cpu"],
        friendlyIncludes: ["cpu"],
        unit: "%"
      });
    case "load1":
      return f(s, {
        entityIncludes: ["load"],
        friendlyIncludes: ["load", "1"],
        unit: void 0
      });
    case "cpufreq":
      return f(s, {
        entityIncludes: ["frequency"],
        friendlyIncludes: ["frequency"],
        unit: "MHz"
      });
    case "memoryUsedBytes":
      return f(s, {
        entityIncludes: ["memory"],
        friendlyIncludes: ["memory", "used"],
        unit: "B"
      });
    case "memoryUsedPercent":
      return f(s, {
        entityIncludes: ["memory"],
        friendlyIncludes: ["memory", "used"],
        unit: "%"
      });
    case "swapUsedPercent":
      return f(s, {
        entityIncludes: ["swap"],
        friendlyIncludes: ["swap", "used"],
        unit: "%"
      });
    case "uptime":
      return f(s, {
        entityIncludes: ["uptime"],
        friendlyIncludes: ["uptime"],
        unit: "s"
      });
  }
}), V = (e, t, r, n) => x(e, `diskMetric:${t}:${r}:${n}`, () => {
  const s = {
    size: `sensor.ugos_exporter_host_${t}_disk_${r}_size_bytes`,
    temperature: `sensor.ugos_exporter_host_${t}_disk_${r}_temperature_celsius`,
    read: `sensor.ugos_exporter_host_${t}_disk_${r}_read_bytes_per_second`,
    write: `sensor.ugos_exporter_host_${t}_disk_${r}_write_bytes_per_second`,
    busy: `sensor.ugos_exporter_host_${t}_disk_${r}_busy_percent`
  };
  if (e[s[n]]) return s[n];
  const i = b(e, `sensor.${t}_disk_${r}_`), o = n === "size" ? {
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
  return i.length > 0 ? f(i, o) : f(I(e).filter(([, a]) => T(a, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), Bt = (e, t, r, n) => x(e, `diskTextMetric:${t}:${r}:${n}`, () => {
  const s = {
    model: `sensor.ugos_exporter_host_${t}_disk_${r}_model`,
    vendor: `sensor.ugos_exporter_host_${t}_disk_${r}_vendor`,
    serial: `sensor.ugos_exporter_host_${t}_disk_${r}_serial`,
    type: `sensor.ugos_exporter_host_${t}_disk_${r}_media_type`
  };
  if (e[s[n]]) return s[n];
  const i = `sensor.${t}_disk_${r}_`, o = n === "type" ? {
    entityIncludes: ["media"],
    friendlyIncludes: ["media"]
  } : {
    entityIncludes: [n],
    friendlyIncludes: [n]
  }, a = b(e, i);
  return a.length > 0 ? f(a, o) : f(I(e).filter(([, l]) => T(l, [r])), {
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), Mt = (e, t, r, n) => x(e, `filesystemMetric:${t}:${r}:${n}`, () => {
  const s = {
    used: `sensor.ugos_exporter_host_${t}_filesystem_${r}_used_bytes`,
    free: `sensor.ugos_exporter_host_${t}_filesystem_${r}_free_bytes`
  };
  if (e[s[n]]) return s[n];
  const i = b(e, `sensor.${t}_filesystem_${r}_`);
  return i.length > 0 ? f(i, {
    entityIncludes: [n],
    friendlyIncludes: [n],
    unit: "B"
  }) : f(I(e).filter(([, o]) => Ke(o, t) === r), {
    entityIncludes: [n],
    friendlyIncludes: [n],
    unit: "B"
  });
}), hn = (e, t, r) => x(e, `filesystemReadonly:${t}:${r}`, () => {
  const n = `binary_sensor.ugos_exporter_host_${t}_filesystem_${r}_read_only`;
  if (e[n]) return n;
  const s = b(e, `binary_sensor.${t}_filesystem_${r}_`);
  return s.length > 0 ? f(s, {
    entityIncludes: ["read"],
    friendlyIncludes: ["read", "only"]
  }) : f(I(e).filter(([, i]) => Ke(i, t) === r), {
    entityIncludes: ["read"],
    friendlyIncludes: ["read", "only"]
  });
}), re = (e, t, r, n) => x(e, `arrayMetric:${t}:${r}:${n}`, () => {
  const s = {
    size: `sensor.ugos_exporter_host_${t}_array_${r}_size_bytes`,
    degraded: `sensor.ugos_exporter_host_${t}_array_${r}_degraded_disks`,
    active: `sensor.ugos_exporter_host_${t}_array_${r}_active_disks`,
    total: `sensor.ugos_exporter_host_${t}_array_${r}_total_disks`,
    sync: `sensor.ugos_exporter_host_${t}_array_${r}_sync_completed_percent`
  };
  if (e[s[n]]) return s[n];
  const i = `sensor.${t}_array_${r}_`, o = n === "size" ? {
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
  }, a = b(e, i);
  return a.length > 0 ? f(a, o) : f(I(e).filter(([, l]) => T(l, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), yn = (e, t, r, n) => x(e, `arrayTextMetric:${t}:${r}:${n}`, () => {
  const s = { level: `sensor.ugos_exporter_host_${t}_array_${r}_level` };
  if (e[s[n]]) return s[n];
  const i = b(e, `sensor.${t}_array_${r}_`);
  return i.length > 0 ? f(i, {
    entityIncludes: ["level"],
    friendlyIncludes: ["level"]
  }) : f(I(e).filter(([, o]) => T(o, [r, "level"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "level"]
  });
}), O = (e, t, r, n) => x(e, `networkMetric:${t}:${r}:${n}`, () => {
  const s = {
    rx: `sensor.ugos_exporter_host_${t}_network_${r}_rx_bytes_per_second`,
    tx: `sensor.ugos_exporter_host_${t}_network_${r}_tx_bytes_per_second`,
    speed: `sensor.ugos_exporter_host_${t}_network_${r}_speed_mbps`
  };
  if (e[s[n]]) return s[n];
  const i = `sensor.${t}_network_${r}_`, o = n === "speed" ? {
    entityIncludes: ["speed"],
    friendlyIncludes: ["link", "speed"],
    unit: "Mbit/s"
  } : {
    entityIncludes: [n],
    friendlyIncludes: [n === "rx" ? "rx" : "tx", "throughput"],
    unit: "B/s"
  }, a = b(e, i);
  return a.length > 0 ? f(a, o) : f(I(e).filter(([, l]) => T(l, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), fn = (e, t, r) => x(e, `networkCarrier:${t}:${r}`, () => {
  const n = `binary_sensor.ugos_exporter_host_${t}_network_${r}_carrier`;
  if (e[n]) return n;
  const s = b(e, `binary_sensor.${t}_network_${r}_`);
  return s.length > 0 ? f(s, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  }) : f(b(e, "binary_sensor.").filter(([, i]) => T(i, [r, "carrier"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "carrier"]
  });
}), mn = (e, t, r, n) => x(e, `bondMetric:${t}:${r}:${n}`, () => {
  const s = {
    speed: `sensor.ugos_exporter_host_${t}_bond_${r}_speed_mbps`,
    mode: `sensor.ugos_exporter_host_${t}_bond_${r}_mode`,
    active_slave: `sensor.ugos_exporter_host_${t}_bond_${r}_active_slave`
  };
  if (e[s[n]]) return s[n];
  const i = `sensor.${t}_bond_${r}_`, o = n === "speed" ? {
    entityIncludes: ["speed"],
    friendlyIncludes: ["link", "speed"],
    unit: "Mbit/s"
  } : n === "mode" ? {
    entityIncludes: ["mode"],
    friendlyIncludes: ["mode"]
  } : {
    entityIncludes: ["active"],
    friendlyIncludes: ["active", "slave"]
  }, a = b(e, i);
  return a.length > 0 ? f(a, o) : f(I(e).filter(([, l]) => T(l, [r])), {
    ...o,
    entityIncludes: [],
    friendlyIncludes: [r, ...o.friendlyIncludes]
  });
}), vn = (e, t, r) => x(e, `bondCarrier:${t}:${r}`, () => {
  const n = `binary_sensor.ugos_exporter_host_${t}_bond_${r}_carrier`;
  if (e[n]) return n;
  const s = b(e, `binary_sensor.${t}_bond_${r}_`);
  return s.length > 0 ? f(s, {
    entityIncludes: ["carrier"],
    friendlyIncludes: ["carrier"]
  }) : f(b(e, "binary_sensor.").filter(([, i]) => T(i, [r, "carrier"])), {
    entityIncludes: [],
    friendlyIncludes: [r, "carrier"]
  });
}), Te = (e, t, r, n, s) => x(e, `gpuMetric:${t}:${r}:${n}:${s}`, () => {
  const i = {
    busy: `sensor.${r}_gpu_${n}_busy_percent`,
    current: `sensor.${r}_gpu_${n}_current_mhz`,
    max: `sensor.${r}_gpu_${n}_max_mhz`
  };
  return e[i[s]] ? i[s] : f(b(e, `sensor.${t}_gpu_${n}_`), s === "busy" ? {
    entityIncludes: ["busy"],
    friendlyIncludes: ["busy"],
    unit: "%"
  } : {
    entityIncludes: [s],
    friendlyIncludes: [s, "frequency"],
    unit: "MHz"
  });
}), me = (e, t, r) => x(e, `projectMetric:${t}:${r}`, () => {
  const n = {
    cpu: `sensor.ugos_exporter_project_${t}_cpu_usage_percent`,
    memory: `sensor.ugos_exporter_project_${t}_memory_usage_bytes`,
    total: `sensor.ugos_exporter_project_${t}_total_containers`,
    running: `sensor.ugos_exporter_project_${t}_running_containers`
  };
  if (e[n[r]]) return n[r];
  const s = b(e, `sensor.compose_project_${t}_`), i = r === "cpu" ? {
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
  return s.length > 0 ? f(s, i) : f(I(e).filter(([, o]) => Jt(o) === t), i);
}), _n = (e, t, r) => {
  const n = P(e), s = P(t);
  return r.some((i) => {
    const o = P(i);
    return o === n || o === s;
  });
}, $n = (e, t) => e.samples.at(-1)?.key === t.key ? e : { samples: [...e.samples, t].slice(-Gt) }, ve = (e, t, r) => {
  if (e.length >= r) return e.slice(-Gt);
  const n = Math.max(r - e.length, 0);
  return [...Array.from({ length: n }, () => t), ...e];
}, gn = (e, t, r) => {
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
}, kt = (e, t) => {
  const r = e.find((n) => t.some((s) => n.label.includes(s)));
  return r ? r.value : e.find((n) => !n.entityId.includes("_disk_"))?.value;
}, qt = (e, t) => {
  const r = t.toLowerCase(), n = e.find((s) => s.label.includes(r) && (s.label.includes("phy temperature") || s.label.includes("mac temperature")));
  return n ? n.value : e.find((s) => s.label.includes(r))?.value;
}, bn = (e) => e === void 0 ? "healthy" : e >= 55 ? "degraded" : e >= 48 ? "warning" : "healthy", wn = (e) => e >= 3 ? "High" : e >= 1 ? "Busy" : "Good", xn = (e, t) => C(e, `hasEntityPrefix:${t}`, () => M(e).some((r) => r.startsWith(`sensor.${t}_`) || r.startsWith(`binary_sensor.${t}_`))), Bn = (e) => [
  `sensor.ugos_exporter_host_${e}_`,
  `binary_sensor.ugos_exporter_host_${e}_`,
  `sensor.${e}_`,
  `binary_sensor.${e}_`,
  "sensor.ugos_exporter_project_",
  "sensor.compose_project_"
], Mn = (e, t, r) => M(e).filter((n) => r !== void 0 && n === r || t.some((s) => n.startsWith(s))).sort(), kn = (e, t) => e.startsWith(`sensor.${t}_`) && ![
  "_disk_",
  "_filesystem_",
  "_network_",
  "_bond_",
  "_gpu_",
  "_array_",
  "_cooling_"
].some((r) => e.includes(r)), f = (e, t) => {
  let r, n = -1;
  e: for (const [s, i] of e) {
    const o = s.toLowerCase(), a = Xt(i), l = Kt(i);
    if (t.unit && l !== t.unit) continue;
    let m = 0;
    for (const u of t.entityIncludes) {
      if (!o.includes(u)) continue e;
      m += 2;
    }
    for (const u of t.friendlyIncludes) {
      if (!a.includes(u)) continue e;
      m += 1;
    }
    (m > n || m === n && r !== void 0 && s.localeCompare(r) < 0 || r === void 0) && (r = s, n = m);
  }
  return r;
}, Z = (e, t) => C(e, `entitySlugs:${t.source}`, () => Array.from(new Set(M(e).map((r) => t.exec(r)?.[1]).filter((r) => !!r))).sort()), y = (e, t) => t ? In(e[t]) : void 0, Le = (e, t) => {
  if (!t) return;
  const r = e[t], n = de(r);
  if (!n) return;
  if (n.textState !== void 0) return n.textState ?? void 0;
  const s = r.state;
  return n.textState = !s || s === "unknown" || s === "unavailable" ? null : s, n.textState ?? void 0;
}, Ve = (e) => {
  if (!e || e === "unknown" || e === "unavailable") return;
  const t = Number(e);
  return Number.isFinite(t) ? t : void 0;
}, In = (e) => {
  const t = de(e);
  if (!(!t || !e))
    return t.parsedNumber !== void 0 || (t.parsedNumber = Ve(e.state) ?? null), t.parsedNumber ?? void 0;
}, qe = (e) => e?.state === "on", Kt = (e) => de(e)?.unit, T = (e, t) => {
  const r = Xt(e);
  return t.every((n) => r.includes(n));
}, Me = (e, t, r) => {
  const n = Y(e);
  if (!n) return;
  const s = Cn(n, t);
  if (!s) return;
  const i = s.toLowerCase();
  for (const o of r) {
    const a = o.toLowerCase();
    if (!i.endsWith(` ${a}`)) continue;
    const l = s.slice(0, s.length - o.length).trim();
    return l ? P(l) : void 0;
  }
}, Ke = (e, t) => {
  const r = Y(e);
  if (!r) return;
  const n = r.toLowerCase(), s = t.replace(/_/g, " ");
  if (!n.includes(s) || !n.includes("/")) return;
  const i = r.match(/(\/[^\s]*)/);
  return i ? P(i[1]) : void 0;
}, Cn = (e, t) => {
  const r = t.replace(/_/g, " ");
  if (e.toLowerCase().startsWith(`${r.toLowerCase()} `)) return e.slice(r.length + 1).trim();
}, An = (e) => /^(sd[a-z]+|hd[a-z]+|vd[a-z]+|xvd[a-z]+|nvme\d+n\d+|mmcblk\d+|loop\d+)$/i.test(e), En = (e) => /^md\d+$/i.test(e), Pn = (e) => /^bond\d+$/i.test(e), Un = (e) => /^(eth\d+|en[a-z0-9]+|eno\d+|ens\d+|enp[a-z0-9]+|wlan\d+|wl[a-z0-9]+|lo)$/i.test(e), Tn = (e) => {
  if (e)
    return e.replace(/\s+/g, " ").trim() || void 0;
}, Ln = (e) => {
  const t = e?.trim().toLowerCase();
  if (t)
    return t === "hdd" || t === "sata" ? "hdd" : t === "nvme" || t === "ssd" ? "nvme" : t;
}, Rn = (e) => {
  const t = e?.trim().toLowerCase();
  if (t)
    return t === "linear" ? "JBOD" : t.toUpperCase();
}, It = (e) => {
  const t = e.match(/^\/volume(\d+)$/i);
  return t ? `Volume ${t[1]}` : e;
}, zn = (e, t) => {
  const r = t.reduce((s, i) => (i.mediaType && (s[i.mediaType] = (s[i.mediaType] ?? 0) + i.capacityBytes), s), {}), n = Object.entries(r).map(([s, i]) => ({
    mediaType: s,
    distance: Math.abs(i - e.sizeBytes) / Math.max(e.sizeBytes, i, 1)
  })).sort((s, i) => s.distance - i.distance)[0];
  if (n)
    return n.mediaType === "hdd" ? "SATA" : n.mediaType.toUpperCase();
}, Nn = (e, t) => {
  if (!(e === void 0 && t === void 0))
    return `Drives ${e ?? t ?? 0}/${t ?? e ?? 0}`;
}, Jt = (e) => {
  const t = Y(e);
  if (!t) return;
  const r = t.replace(/\s+(CPU|Memory|Total Containers|Running Containers)$/i, "").trim();
  return r ? P(r) : void 0;
}, Dn = (e) => {
  const t = e.trim();
  if (!t) return t;
  const r = t.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim(), n = r.split(" ");
  if (n.length % 2 === 0) {
    const s = n.length / 2;
    if (n.slice(0, s).join(" ").toLowerCase() === n.slice(s).join(" ").toLowerCase()) return n.slice(0, s).join(" ");
  }
  return r;
}, Sn = (e, t, r, n) => {
  const s = Object.entries(e).filter(([i, o]) => {
    if (!i.startsWith("sensor.") || Kt(o) !== "%") return !1;
    const a = `${i} ${Y(o)}`.toLowerCase(), l = a.includes(t) || a.includes(t.replace(/_/g, " ")), m = a.includes(n), u = a.includes("busy"), p = a.includes("render/3d") || a.includes("render_3d") || a.includes("blitter") || a.includes("videoenhance") || a.includes("video_enhance") || a.includes("video/") || a.includes("video_");
    return l && m && u && p;
  }).map(([, i]) => Ve(i.state)).filter((i) => i !== void 0);
  return s.length > 0 ? Math.max(...s) : y(e, Te(e, t, r, n, "busy")) ?? 0;
}, ue = (e, t, r) => {
  const n = Y(e);
  if (!n) return null;
  let s = n.trim();
  return t && s.endsWith(` ${t}`) && (s = s.slice(0, -` ${t}`.length)), r && s.startsWith(`${r} `) && (s = s.slice(r.length + 1)), s.startsWith("Compose project ") && (s = s.slice(16)), s.trim() || null;
}, Y = (e) => de(e)?.friendlyName ?? "", Xt = (e) => de(e)?.friendlyNameLower ?? "", Re = (e) => e === "root" ? "/" : `/${e.replace(/_/g, "/")}`, Zt = (e) => e.split("_").filter(Boolean).map(Yt).join(" "), Yt = (e) => e.charAt(0).toUpperCase() + e.slice(1), P = (e) => {
  const t = e.trim().toLowerCase();
  return t ? t === "/" ? "root" : t.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "unknown" : "unknown";
}, k = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), On = (e) => {
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !1
  }).format(t);
}, jn = (e) => {
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
}, Hn = (e) => `${Math.floor(e / 86400)}d ${Math.floor(e % 86400 / 3600)}h ${Math.floor(e % 3600 / 60)}m`, Ct = (e) => {
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
}, Je = (e) => e.trim().toLowerCase(), le = (e) => e * 1024 ** 3, E = (e) => e * 1024 ** 4, h = (e) => e * 1e6, $ = (e) => e * 1e9, S = (e, t) => t.map((r) => Math.max(0, Number((e + r).toFixed(3)))), At = [
  {
    key: "gitea",
    title: "Gitea",
    cpuPercent: 0.3925496609109711,
    memoryBytes: 324 * 1024 ** 2,
    runningContainers: 2,
    totalContainers: 2,
    status: "up"
  },
  {
    key: "go_back_db",
    title: "Go Back DB",
    cpuPercent: 0,
    memoryBytes: 768 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up"
  },
  {
    key: "gorent",
    title: "GoRent",
    cpuPercent: 0,
    memoryBytes: 412 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up"
  },
  {
    key: "home-assistant",
    title: "Home Assistant",
    cpuPercent: 0.10272887844115354,
    memoryBytes: 612 * 1024 ** 2,
    runningContainers: 4,
    totalContainers: 4,
    status: "up"
  },
  {
    key: "jellyfin",
    title: "Jellyfin",
    cpuPercent: 0.009448818897637795,
    memoryBytes: 256 * 1024 ** 2,
    runningContainers: 1,
    totalContainers: 1,
    status: "up"
  },
  {
    key: "kuma_monitoring",
    title: "Kuma Monitoring",
    cpuPercent: 2.976829051619071,
    memoryBytes: 430 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up"
  },
  {
    key: "monitoring",
    title: "Monitoring",
    cpuPercent: 1.8076912575738409,
    memoryBytes: le(1.2),
    runningContainers: 9,
    totalContainers: 9,
    status: "up"
  },
  {
    key: "nas",
    title: "NAS",
    cpuPercent: 0.8259763328145205,
    memoryBytes: 508 * 1024 ** 2,
    runningContainers: 3,
    totalContainers: 3,
    status: "up"
  },
  {
    key: "torrent",
    title: "Torrent",
    cpuPercent: 0.07306297825467073,
    memoryBytes: 184 * 1024 ** 2,
    runningContainers: 2,
    totalContainers: 2,
    status: "up"
  },
  {
    key: "webserver",
    title: "Webserver",
    cpuPercent: 1.123501622902011,
    memoryBytes: 736 * 1024 ** 2,
    runningContainers: 7,
    totalContainers: 7,
    status: "up"
  }
], Wn = (e) => ({
  totalContainers: e.reduce((t, r) => t + r.totalContainers, 0),
  runningContainers: e.reduce((t, r) => t + r.runningContainers, 0),
  totalProjects: e.length,
  onlineProjects: e.filter((t) => t.status === "up").length
}), Xe = [{
  name: "Pool 1",
  layout: "RAID 6 | 6 Drives",
  status: "healthy",
  usedBytes: E(10.2),
  totalBytes: E(40.5),
  accent: d.green
}, {
  name: "Pool 2",
  layout: "RAID 1 | 2 Drives (M.2)",
  status: "healthy",
  usedBytes: E(6.1),
  totalBytes: E(8.2),
  accent: d.purple
}], Fn = Xe.reduce((e, t) => e + t.totalBytes, 0), Gn = Xe.reduce((e, t) => e + t.usedBytes, 0), Vn = [
  {
    kind: "cpu",
    title: "CPU",
    accent: d.blue,
    valuePercent: 18,
    temperatureCelsius: 45,
    series: S(18, [
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
    accent: d.purple,
    valuePercent: 46,
    usedBytes: le(14.6),
    totalBytes: le(32),
    series: S(46, [
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
    accent: d.green,
    valuePercent: 32,
    temperatureCelsius: 48,
    series: S(32, [
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
    accent: d.softBlue,
    value: 0.78,
    statusText: "Good",
    series: S(0.78, [
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
    accent: d.cyan,
    totalBytes: Fn,
    usedBytes: Gn
  },
  {
    kind: "network",
    title: "Network",
    accent: d.green,
    downloadBps: $(1.2),
    uploadBps: h(123)
  }
], qn = [
  {
    key: "cpu",
    title: "CPU",
    subtitle: "Intel Core i5-1235U",
    accent: d.blue,
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
    series: S(18, [
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
    accent: d.purple,
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
    series: S(46, [
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
    accent: d.green,
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
    series: S(32, [
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
], Kn = [
  {
    name: "M.2 1",
    model: "Lexar NM790 1TB SSD",
    capacityBytes: le(931),
    temperatureCelsius: 40,
    status: "healthy"
  },
  {
    name: "M.2 2",
    model: "Lexar NM790 1TB SSD",
    capacityBytes: le(931),
    temperatureCelsius: 41,
    status: "healthy"
  },
  {
    name: "HDD 1",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 36,
    status: "healthy"
  },
  {
    name: "HDD 2",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 37,
    status: "healthy"
  },
  {
    name: "HDD 3",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 36,
    status: "healthy"
  },
  {
    name: "HDD 4",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 37,
    status: "healthy"
  },
  {
    name: "HDD 5",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 36,
    status: "healthy"
  },
  {
    name: "HDD 6",
    model: "Seagate IronWolf 12TB",
    capacityBytes: E(10.9),
    temperatureCelsius: 37,
    status: "healthy"
  }
], _e = [
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: $(1.2),
      eth0: h(430),
      eth1: h(780)
    }
  },
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: $(1.24),
      eth0: h(440),
      eth1: h(800)
    }
  },
  {
    timestampLabel: "14:25",
    totalsByInterface: {
      bond0: $(1.18),
      eth0: h(410),
      eth1: h(770)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: $(1.28),
      eth0: h(455),
      eth1: h(825)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: $(1.31),
      eth0: h(468),
      eth1: h(840)
    }
  },
  {
    timestampLabel: "14:26",
    totalsByInterface: {
      bond0: $(1.27),
      eth0: h(452),
      eth1: h(818)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: $(1.35),
      eth0: h(489),
      eth1: h(861)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: $(1.33),
      eth0: h(474),
      eth1: h(852)
    }
  },
  {
    timestampLabel: "14:27",
    totalsByInterface: {
      bond0: $(1.39),
      eth0: h(495),
      eth1: h(890)
    }
  },
  {
    timestampLabel: "14:28",
    totalsByInterface: {
      bond0: $(1.3),
      eth0: h(462),
      eth1: h(834)
    }
  },
  {
    timestampLabel: "14:28",
    totalsByInterface: {
      bond0: $(1.26),
      eth0: h(448),
      eth1: h(805)
    }
  },
  {
    timestampLabel: "14:29",
    totalsByInterface: {
      bond0: $(1.41),
      eth0: h(508),
      eth1: h(902)
    }
  },
  {
    timestampLabel: "14:29",
    totalsByInterface: {
      bond0: $(1.44),
      eth0: h(516),
      eth1: h(925)
    }
  },
  {
    timestampLabel: "14:30",
    totalsByInterface: {
      bond0: $(1.37),
      eth0: h(492),
      eth1: h(876)
    }
  },
  {
    timestampLabel: "14:30",
    totalsByInterface: {
      bond0: $(1.46),
      eth0: h(521),
      eth1: h(938)
    }
  }
], Jn = {
  deviceInfo: {
    model: "DXP6800 Pro",
    ugosVersion: "1.2.0",
    hostname: "DXP6800PRO",
    ipAddress: "192.168.1.100",
    uptimeSeconds: 1104120,
    lastUpdated: "2026-04-23 20:30"
  },
  hardwareSummary: Vn,
  hardwareDetails: qn,
  drives: Kn,
  storagePools: Xe,
  dockerProjects: At,
  dockerTotals: Wn(At),
  networkInterfaces: [
    {
      name: "bond0",
      status: "up",
      linkSpeedMbps: 5e3,
      temperatureCelsius: 38,
      downloadBps: h(620),
      uploadBps: h(580)
    },
    {
      name: "eth0",
      status: "up",
      linkSpeedMbps: 2500,
      temperatureCelsius: 37,
      downloadBps: h(240),
      uploadBps: h(190)
    },
    {
      name: "eth1",
      status: "up",
      linkSpeedMbps: 2500,
      temperatureCelsius: 39,
      downloadBps: h(380),
      uploadBps: h(400)
    }
  ],
  networkTrafficHistory: _e,
  networkTrafficLines: [
    {
      key: "bond0",
      label: "bond0",
      color: d.cyan,
      currentBps: $(1.46),
      series: _e.map((e) => e.totalsByInterface.bond0)
    },
    {
      key: "eth0",
      label: "eth0",
      color: d.good,
      currentBps: h(521),
      series: _e.map((e) => e.totalsByInterface.eth0)
    },
    {
      key: "eth1",
      label: "eth1",
      color: d.purple,
      currentBps: h(938),
      series: _e.map((e) => e.totalsByInterface.eth1)
    }
  ]
}, Xn = () => ({
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
      accent: d.blue,
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
      accent: d.purple,
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
      accent: d.softBlue,
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
      accent: d.cyan,
      totalBytes: 0,
      usedBytes: 0
    },
    {
      kind: "network",
      title: "Network",
      accent: d.green,
      downloadBps: 0,
      uploadBps: 0
    }
  ],
  hardwareDetails: [{
    key: "cpu",
    title: "CPU",
    subtitle: "No live data",
    accent: d.blue,
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
    accent: d.purple,
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
  networkTrafficLines: []
}), Zn = hr`
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
`, Et = [
  "B",
  "KB",
  "MB",
  "GB",
  "TB",
  "PB"
], Pt = [
  "bps",
  "Kbps",
  "Mbps",
  "Gbps",
  "Tbps"
], ke = (e, t) => new Intl.NumberFormat("en-US", {
  minimumFractionDigits: t,
  maximumFractionDigits: t
}).format(e), Pe = (e, t = 0) => `${ke(e, t)}%`, Yn = (e, t = 1) => {
  if (!Number.isFinite(e) || e <= 0) return "0 B";
  const r = Math.min(Math.floor(Math.log(e) / Math.log(1024)), Et.length - 1);
  return `${ke(e / 1024 ** r, r === 0 ? 0 : t)} ${Et[r]}`;
}, ze = (e) => Yn(e, e >= 1024 ** 4 ? 1 : 0), Ut = (e, t = 1) => {
  if (!Number.isFinite(e) || e <= 0) return "0 bps";
  const r = Math.min(Math.floor(Math.log(e) / Math.log(1e3)), Pt.length - 1);
  return `${ke(e / 1e3 ** r, r === 0 ? 0 : t)} ${Pt[r]}`;
}, Tt = (e) => `${ke(e, 0)}°C`, Qt = (e, t) => `${ze(e)} / ${ze(t)}`, Qn = (e, t) => t > 0 ? e / t * 100 : 0, Lt = (e) => e.kind === "cpu" || e.kind === "gpu", es = (e) => e.kind === "ram", ts = (e) => e.kind === "system-load", ne = (e) => Math.max(0, Math.min(1, e)), rs = (e) => {
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
    const i = ns(s.name, s.layout);
    i && (r[i].totalBytes += s.totalBytes, r[i].usedBytes += s.usedBytes, n.splice(n.indexOf(s), 1));
  }
  for (const s of n) {
    const i = ss(s.totalBytes, t, r);
    r[i].totalBytes += s.totalBytes, r[i].usedBytes += s.usedBytes;
  }
  return r;
}, ns = (e, t) => {
  const r = `${e} ${t}`.toLowerCase();
  return r.includes("nvme") || r.includes("m.2") || r.includes("ssd") ? "nvme" : r.includes("sata") || r.includes("hdd") ? "sata" : null;
}, ss = (e, t, r) => ["nvme", "sata"].filter((n) => t[n] > 0).map((n) => ({
  media: n,
  distance: Math.abs(t[n] - r[n].totalBytes - e)
})).sort((n, s) => n.distance - s.distance)[0]?.media ?? "sata", Rt = (e, t, r, n, s) => {
  const i = n > 0 ? ne(Qn(s, n) / 100) : 0;
  return {
    id: e,
    label: t,
    icon: "database",
    accent: r,
    value: ze(n),
    secondary: n > 0 ? Qt(s, n) : "Unavailable",
    progress: i
  };
}, is = (e) => {
  const t = e.networkInterfaces.map((o) => o.name), r = e.networkInterfaces.reduce((o, a) => o + a.downloadBps, 0), n = e.networkInterfaces.reduce((o, a) => o + a.uploadBps, 0), s = e.networkInterfaces.filter((o) => o.status === "up").length, i = e.networkInterfaces.length;
  return {
    id: "network",
    label: "Network State",
    icon: "network",
    accent: d.softBlue,
    value: i > 0 ? `${s}/${i} Up` : "Unavailable",
    secondary: t.length > 0 ? t.join(" | ") : "No interfaces",
    down: Ut(r),
    up: Ut(n)
  };
}, os = (e) => {
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
}, Ne = (e, t, r) => {
  const n = e.hardwareSummary.filter(Lt).find((u) => u.kind === "cpu"), s = e.hardwareSummary.filter(es).find((u) => u.kind === "ram"), i = e.hardwareSummary.filter(Lt).find((u) => u.kind === "gpu"), o = e.hardwareSummary.filter(ts).find((u) => u.kind === "system-load"), a = os(t), l = rs(e), m = [
    {
      id: "cpu",
      label: "CPU",
      icon: "chip",
      accent: d.blue,
      value: Pe(n?.valuePercent ?? 0),
      secondary: n ? Tt(n.temperatureCelsius) : "Unavailable",
      progress: ne((n?.valuePercent ?? 0) / 100)
    },
    {
      id: "ram",
      label: "RAM",
      icon: "memory",
      accent: d.purple,
      value: Pe(s?.valuePercent ?? 0),
      secondary: s ? Qt(s.usedBytes, s.totalBytes) : "Unavailable",
      progress: ne((s?.valuePercent ?? 0) / 100)
    },
    {
      id: "gpu",
      label: "GPU",
      icon: "gpu",
      accent: d.green,
      value: i ? Pe(i.valuePercent) : "N/A",
      secondary: i ? Tt(i.temperatureCelsius) : "Unavailable",
      progress: ne((i?.valuePercent ?? 0) / 100)
    },
    {
      id: "systemLoad",
      label: "Load",
      icon: "pulse",
      accent: d.softBlue,
      value: o ? o.value.toFixed(2) : "0.00",
      secondary: o?.statusText ?? "Unavailable",
      progress: ne(o ? o.value : 0)
    },
    Rt("nvme", "NVMe Volume", d.cyan, l.nvme.totalBytes, l.nvme.usedBytes),
    Rt("sata", "SATA Volume", d.green, l.sata.totalBytes, l.sata.usedBytes),
    is(e)
  ];
  return {
    title: e.deviceInfo.model,
    statusLabel: a.label,
    statusColor: a.color,
    metricTiles: m
  };
}, zt = (e) => Ne(Jn, "preview", e);
function Q(e, t, r, n) {
  var s = arguments.length, i = s < 3 ? t : n === null ? n = Object.getOwnPropertyDescriptor(t, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(e, t, r, n);
  else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (i = (s < 3 ? o(i) : s > 3 ? o(t, r, i) : o(t, r)) || i);
  return s > 3 && i && Object.defineProperty(t, r, i), i;
}
var H = class extends ie {
  constructor(...t) {
    super(...t), this.config = { type: "custom:ugreen-nas-mini-card" }, this.model = zt(), this.history = wt(), this.dataMode = "preview", this.watchEntityIds = [], this.watchPrefixes = [];
  }
  static {
    this.styles = Zn;
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
    return U`
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
    return U`
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
    return U`
      <article class="tile">
        <div class="tile-body">
          <div class="tile-top">
            ${this.renderIcon(t.icon, `icon icon-${t.icon} accent`)}
            <div class="tile-label">${t.label}</div>
          </div>

          ${t.value ? U`<div class="tile-value">${t.value}</div>` : v}
          ${t.secondary ? U`<div class=${r}>${t.secondary}</div>` : v}

          ${typeof t.progress == "number" ? this.renderProgress(t.progress, t.accent) : v}
          ${t.down || t.up ? this.renderNetworkRows(t.down, t.up) : v}
        </div>
      </article>
    `;
  }
  renderProgress(t, r) {
    return U`
      <div class="progress-bar" aria-hidden="true">
        <div
          class="progress-fill"
          style=${`width:${Math.max(0, Math.min(1, t)) * 100}%; --progress-color:${r}; box-shadow:0 0 10px ${r}55;`}
        ></div>
      </div>
    `;
  }
  renderNetworkRows(t, r) {
    return U`
      <div class="network-lines">
        ${t ? U`
          <div class="traffic-row down">
            ${this.renderArrowDown()}
            <span>${t}</span>
          </div>
        ` : v}
        ${r ? U`
          <div class="traffic-row up">
            ${this.renderArrowUp()}
            <span>${r}</span>
          </div>
        ` : v}
      </div>
    `;
  }
  refreshModel() {
    const t = Or(this._hass, this.config, this.history);
    if (!t) {
      if (this.history = wt(), this.watchEntityIds = [], this.watchPrefixes = [], this._hass?.states) {
        const r = Xn();
        r.deviceInfo = {
          ...r.deviceInfo,
          model: this.config.deviceModel ?? r.deviceInfo.model,
          hostname: this.config.host ?? r.deviceInfo.hostname
        }, this.model = Ne(r, "missing", this.config), this.dataMode = "missing";
      } else
        this.model = zt(this.config), this.dataMode = "preview";
      return;
    }
    this.history = t.history, this.watchEntityIds = t.watchEntityIds, this.watchPrefixes = t.watchPrefixes, this.model = Ne(t.model, "live", this.config), this.dataMode = "live";
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
    return w`
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3v11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M5 11.5 10 16l5-4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  renderArrowUp() {
    return w`
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 17V6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M5 8.5 10 4l5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  renderIcon(t, r) {
    switch (t) {
      case "chip":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"></rect><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3M4 4l2 2M18 18l2 2M20 4l-2 2M4 20l2-2"></path></svg>`;
      case "memory":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="10" rx="2"></rect><path d="M7 10v4M11 10v4M15 10v4M19 10v4M5 19v2M9 19v2M13 19v2M17 19v2"></path></svg>`;
      case "gpu":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="10" rx="2"></rect><circle cx="9" cy="11" r="2.2"></circle><path d="M16 9.5h2M16 12.5h2M8 18h8"></path></svg>`;
      case "pulse":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l2.2-6 4 12 2.2-8H22"></path></svg>`;
      case "database":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"></ellipse><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"></path></svg>`;
      case "network":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="4" rx="1"></rect><rect x="3" y="16" width="4" height="4" rx="1"></rect><rect x="17" y="16" width="4" height="4" rx="1"></rect><path d="M12 7v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"></path></svg>`;
      case "device":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M9 2h6"></path></svg>`;
      case "clock":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6l4 2"></path></svg>`;
      case "monitor":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 17v3"></path></svg>`;
      case "calendar":
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 9h18"></path><path d="M8 14h.01M12 14h.01M16 14h.01"></path></svg>`;
      default:
        return w`<svg class=${r} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle></svg>`;
    }
  }
};
Q([Be()], H.prototype, "config", void 0);
Q([Be()], H.prototype, "model", void 0);
Q([Be()], H.prototype, "history", void 0);
Q([Be()], H.prototype, "dataMode", void 0);
Q([Ft({ attribute: !1 })], H.prototype, "hass", null);
H = Q([Lr("ugreen-nas-mini-card")], H);
