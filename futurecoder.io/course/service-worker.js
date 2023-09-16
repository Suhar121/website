(() => {
  var e = {
      184: (e) => {
        self,
          (e.exports = (() => {
            "use strict";
            var e = {
                d: (t, s) => {
                  for (var n in s)
                    e.o(s, n) &&
                      !e.o(t, n) &&
                      Object.defineProperty(t, n, {
                        enumerable: !0,
                        get: s[n],
                      });
                },
                o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
                r: (e) => {
                  "undefined" != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                      value: "Module",
                    }),
                    Object.defineProperty(e, "__esModule", { value: !0 });
                },
              },
              t = {};
            e.r(t),
              e.d(t, {
                isServiceWorkerRequest: () => a,
                serviceWorkerFetchListener: () => i,
                asyncSleep: () => o,
                ServiceWorkerError: () => c,
                writeMessageAtomics: () => h,
                writeMessageServiceWorker: () => l,
                writeMessage: () => u,
                makeChannel: () => d,
                makeAtomicsChannel: () => f,
                makeServiceWorkerChannel: () => p,
                readMessage: () => y,
                syncSleep: () => m,
                uuidv4: () => w,
              });
            var s = function (e, t, s, n) {
              return new (s || (s = Promise))(function (r, a) {
                function i(e) {
                  try {
                    c(n.next(e));
                  } catch (e) {
                    a(e);
                  }
                }
                function o(e) {
                  try {
                    c(n.throw(e));
                  } catch (e) {
                    a(e);
                  }
                }
                function c(e) {
                  var t;
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof s
                        ? t
                        : new s(function (e) {
                            e(t);
                          })).then(i, o);
                }
                c((n = n.apply(e, t || [])).next());
              });
            };
            const n = "__SyncMessageServiceWorkerInput__",
              r = "__sync-message-v2__";
            function a(e) {
              return "string" != typeof e && (e = e.request.url), e.includes(n);
            }
            function i() {
              const e = {},
                t = {};
              return (n) => {
                const { url: i } = n.request;
                return (
                  !!a(i) &&
                  (n.respondWith(
                    (function () {
                      return s(this, void 0, void 0, function* () {
                        function s(e) {
                          const t = { message: e, version: r };
                          return new Response(JSON.stringify(t), {
                            status: 200,
                          });
                        }
                        if (i.endsWith("/read")) {
                          const { messageId: r, timeout: a } =
                              yield n.request.json(),
                            i = e[r];
                          return i
                            ? (delete e[r], s(i))
                            : yield new Promise((e) => {
                                (t[r] = e),
                                  setTimeout(function () {
                                    delete t[r],
                                      e(new Response("", { status: 408 }));
                                  }, a);
                              });
                        }
                        if (i.endsWith("/write")) {
                          const { message: r, messageId: a } =
                              yield n.request.json(),
                            i = t[a];
                          return (
                            i ? (i(s(r)), delete t[a]) : (e[a] = r),
                            s({ early: !i })
                          );
                        }
                        if (i.endsWith("/version"))
                          return new Response(r, { status: 200 });
                      });
                    })()
                  ),
                  !0)
                );
              };
            }
            function o(e) {
              return new Promise((t) => setTimeout(t, e));
            }
            class c extends Error {
              constructor(e, t) {
                super(
                  `Received status ${t} from ${e}. Ensure the service worker is registered and active.`
                ),
                  (this.url = e),
                  (this.status = t),
                  (this.type = "ServiceWorkerError"),
                  Object.setPrototypeOf(this, c.prototype);
              }
            }
            function h(e, t) {
              const s = new TextEncoder().encode(JSON.stringify(t)),
                { data: n, meta: r } = e;
              if (s.length > n.length)
                throw new Error(
                  "Message is too big, increase bufferSize when making channel."
                );
              n.set(s, 0),
                Atomics.store(r, 0, s.length),
                Atomics.store(r, 1, 1),
                Atomics.notify(r, 1);
            }
            function l(e, t, n) {
              return s(this, void 0, void 0, function* () {
                yield navigator.serviceWorker.ready;
                const s = e.baseUrl + "/write",
                  a = Date.now();
                for (;;) {
                  const i = { message: t, messageId: n },
                    h = yield fetch(s, {
                      method: "POST",
                      body: JSON.stringify(i),
                    });
                  if (200 === h.status && (yield h.json()).version === r)
                    return;
                  if (!(Date.now() - a < e.timeout)) throw new c(s, h.status);
                  yield o(100);
                }
              });
            }
            function u(e, t, n) {
              return s(this, void 0, void 0, function* () {
                "atomics" === e.type ? h(e, t) : yield l(e, t, n);
              });
            }
            function d() {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return "undefined" != typeof SharedArrayBuffer
                ? f(e.atomics)
                : "serviceWorker" in navigator
                ? p(e.serviceWorker)
                : null;
            }
            function f() {
              let { bufferSize: e } =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return {
                type: "atomics",
                data: new Uint8Array(new SharedArrayBuffer(e || 131072)),
                meta: new Int32Array(
                  new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT)
                ),
              };
            }
            function p() {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return {
                type: "serviceWorker",
                baseUrl: (e.scope || "/") + n,
                timeout: e.timeout || 5e3,
              };
            }
            function g(e, t) {
              return e > 0 ? +e : t;
            }
            function y(e, t) {
              let {
                checkInterrupt: s,
                checkTimeout: n,
                timeout: a,
              } = arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
              const i = performance.now();
              n = g(n, s ? 100 : 5e3);
              const o = g(a, Number.POSITIVE_INFINITY);
              let h;
              if ("atomics" === e.type) {
                const { data: t, meta: s } = e;
                h = () => {
                  if ("timed-out" === Atomics.wait(s, 1, 0, n)) return null;
                  {
                    const e = Atomics.exchange(s, 0, 0),
                      n = t.slice(0, e);
                    Atomics.store(s, 1, 0);
                    const r = new TextDecoder().decode(n);
                    return JSON.parse(r);
                  }
                };
              } else
                h = () => {
                  const s = new XMLHttpRequest(),
                    a = e.baseUrl + "/read";
                  s.open("POST", a, !1);
                  const o = { messageId: t, timeout: n };
                  s.send(JSON.stringify(o));
                  const { status: h } = s;
                  if (408 === h) return null;
                  if (200 === h) {
                    const e = JSON.parse(s.responseText);
                    return e.version !== r ? null : e.message;
                  }
                  if (performance.now() - i < e.timeout) return null;
                  throw new c(a, h);
                };
              for (;;) {
                const e = o - (performance.now() - i);
                if (e <= 0) return null;
                n = Math.min(n, e);
                const t = h();
                if (null !== t) return t;
                if (null == s ? void 0 : s()) return null;
              }
            }
            function m(e, t) {
              if ((e = g(e, 0)))
                if ("undefined" != typeof SharedArrayBuffer) {
                  const t = new Int32Array(
                    new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
                  );
                  (t[0] = 0), Atomics.wait(t, 0, 0, e);
                } else y(t, `sleep ${e} ${w()}`, { timeout: e });
            }
            let w;
            return (
              (w =
                "randomUUID" in crypto
                  ? function () {
                      return crypto.randomUUID();
                    }
                  : function () {
                      return "10000000-1000-4000-8000-100000000000".replace(
                        /[018]/g,
                        (e) => {
                          const t = Number(e);
                          return (
                            t ^
                            (crypto.getRandomValues(new Uint8Array(1))[0] &
                              (15 >> (t / 4)))
                          ).toString(16);
                        }
                      );
                    }),
              t
            );
          })());
      },
      900: () => {
        "use strict";
        try {
          self["workbox:cacheable-response:6.5.3"] && _();
        } catch (e) {}
      },
      923: () => {
        "use strict";
        try {
          self["workbox:core:6.5.3"] && _();
        } catch (e) {}
      },
      190: () => {
        "use strict";
        try {
          self["workbox:expiration:6.5.3"] && _();
        } catch (e) {}
      },
      437: () => {
        "use strict";
        try {
          self["workbox:precaching:6.5.3"] && _();
        } catch (e) {}
      },
      185: () => {
        "use strict";
        try {
          self["workbox:routing:6.5.3"] && _();
        } catch (e) {}
      },
      833: () => {
        "use strict";
        try {
          self["workbox:strategies:6.5.3"] && _();
        } catch (e) {}
      },
    },
    t = {};
  function s(n) {
    var r = t[n];
    if (void 0 !== r) return r.exports;
    var a = (t[n] = { exports: {} });
    return e[n](a, a.exports, s), a.exports;
  }
  (() => {
    "use strict";
    var e = s(184);
    s(923);
    const t = function (e) {
      let t = e;
      for (
        var s = arguments.length, n = new Array(s > 1 ? s - 1 : 0), r = 1;
        r < s;
        r++
      )
        n[r - 1] = arguments[r];
      return n.length > 0 && (t += ` :: ${JSON.stringify(n)}`), t;
    };
    class n extends Error {
      constructor(e, s) {
        super(t(e, s)), (this.name = e), (this.details = s);
      }
    }
    const r = new Set();
    const a = {
        googleAnalytics: "googleAnalytics",
        precache: "precache-v2",
        prefix: "workbox",
        runtime: "runtime",
        suffix: "undefined" !== typeof registration ? registration.scope : "",
      },
      i = (e) =>
        [a.prefix, e, a.suffix].filter((e) => e && e.length > 0).join("-"),
      o = (e) => e || i(a.precache),
      c = (e) => e || i(a.runtime);
    function h(e, t) {
      const s = new URL(e);
      for (const n of t) s.searchParams.delete(n);
      return s.href;
    }
    let l;
    function u(e) {
      e.then(() => {});
    }
    class d {
      constructor() {
        this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        });
      }
    }
    const f = (e) =>
      new URL(String(e), location.href).href.replace(
        new RegExp(`^${location.origin}`),
        ""
      );
    function p(e, t) {
      const s = t();
      return e.waitUntil(s), s;
    }
    async function g(e, t) {
      let s = null;
      if (e.url) {
        s = new URL(e.url).origin;
      }
      if (s !== self.location.origin)
        throw new n("cross-origin-copy-response", { origin: s });
      const r = e.clone(),
        a = {
          headers: new Headers(r.headers),
          status: r.status,
          statusText: r.statusText,
        },
        i = t ? t(a) : a,
        o = (function () {
          if (void 0 === l) {
            const t = new Response("");
            if ("body" in t)
              try {
                new Response(t.body), (l = !0);
              } catch (e) {
                l = !1;
              }
            l = !1;
          }
          return l;
        })()
          ? r.body
          : await r.blob();
      return new Response(o, i);
    }
    let y, m;
    const w = new WeakMap(),
      _ = new WeakMap(),
      v = new WeakMap(),
      b = new WeakMap(),
      R = new WeakMap();
    let x = {
      get(e, t, s) {
        if (e instanceof IDBTransaction) {
          if ("done" === t) return _.get(e);
          if ("objectStoreNames" === t) return e.objectStoreNames || v.get(e);
          if ("store" === t)
            return s.objectStoreNames[1]
              ? void 0
              : s.objectStore(s.objectStoreNames[0]);
        }
        return k(e[t]);
      },
      set: (e, t, s) => ((e[t] = s), !0),
      has: (e, t) =>
        (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
        t in e,
    };
    function C(e) {
      return e !== IDBDatabase.prototype.transaction ||
        "objectStoreNames" in IDBTransaction.prototype
        ? (
            m ||
            (m = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(e)
          ? function () {
              for (
                var t = arguments.length, s = new Array(t), n = 0;
                n < t;
                n++
              )
                s[n] = arguments[n];
              return e.apply(L(this), s), k(w.get(this));
            }
          : function () {
              for (
                var t = arguments.length, s = new Array(t), n = 0;
                n < t;
                n++
              )
                s[n] = arguments[n];
              return k(e.apply(L(this), s));
            }
        : function (t) {
            for (
              var s = arguments.length, n = new Array(s > 1 ? s - 1 : 0), r = 1;
              r < s;
              r++
            )
              n[r - 1] = arguments[r];
            const a = e.call(L(this), t, ...n);
            return v.set(a, t.sort ? t.sort() : [t]), k(a);
          };
    }
    function E(e) {
      return "function" === typeof e
        ? C(e)
        : (e instanceof IDBTransaction &&
            (function (e) {
              if (_.has(e)) return;
              const t = new Promise((t, s) => {
                const n = () => {
                    e.removeEventListener("complete", r),
                      e.removeEventListener("error", a),
                      e.removeEventListener("abort", a);
                  },
                  r = () => {
                    t(), n();
                  },
                  a = () => {
                    s(e.error || new DOMException("AbortError", "AbortError")),
                      n();
                  };
                e.addEventListener("complete", r),
                  e.addEventListener("error", a),
                  e.addEventListener("abort", a);
              });
              _.set(e, t);
            })(e),
          (t = e),
          (
            y ||
            (y = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
          ).some((e) => t instanceof e)
            ? new Proxy(e, x)
            : e);
      var t;
    }
    function k(e) {
      if (e instanceof IDBRequest)
        return (function (e) {
          const t = new Promise((t, s) => {
            const n = () => {
                e.removeEventListener("success", r),
                  e.removeEventListener("error", a);
              },
              r = () => {
                t(k(e.result)), n();
              },
              a = () => {
                s(e.error), n();
              };
            e.addEventListener("success", r), e.addEventListener("error", a);
          });
          return (
            t
              .then((t) => {
                t instanceof IDBCursor && w.set(t, e);
              })
              .catch(() => {}),
            R.set(t, e),
            t
          );
        })(e);
      if (b.has(e)) return b.get(e);
      const t = E(e);
      return t !== e && (b.set(e, t), R.set(t, e)), t;
    }
    const L = (e) => R.get(e);
    const T = ["get", "getKey", "getAll", "getAllKeys", "count"],
      U = ["put", "add", "delete", "clear"],
      S = new Map();
    function q(e, t) {
      if (!(e instanceof IDBDatabase) || t in e || "string" !== typeof t)
        return;
      if (S.get(t)) return S.get(t);
      const s = t.replace(/FromIndex$/, ""),
        n = t !== s,
        r = U.includes(s);
      if (
        !(s in (n ? IDBIndex : IDBObjectStore).prototype) ||
        (!r && !T.includes(s))
      )
        return;
      const a = async function (e) {
        const t = this.transaction(e, r ? "readwrite" : "readonly");
        let a = t.store;
        for (
          var i = arguments.length, o = new Array(i > 1 ? i - 1 : 0), c = 1;
          c < i;
          c++
        )
          o[c - 1] = arguments[c];
        return (
          n && (a = a.index(o.shift())),
          (await Promise.all([a[s](...o), r && t.done]))[0]
        );
      };
      return S.set(t, a), a;
    }
    x = ((e) => ({
      ...e,
      get: (t, s, n) => q(t, s) || e.get(t, s, n),
      has: (t, s) => !!q(t, s) || e.has(t, s),
    }))(x);
    s(190);
    const D = "cache-entries",
      N = (e) => {
        const t = new URL(e, location.href);
        return (t.hash = ""), t.href;
      };
    class I {
      constructor(e) {
        (this._db = null), (this._cacheName = e);
      }
      _upgradeDb(e) {
        const t = e.createObjectStore(D, { keyPath: "id" });
        t.createIndex("cacheName", "cacheName", { unique: !1 }),
          t.createIndex("timestamp", "timestamp", { unique: !1 });
      }
      _upgradeDbAndDeleteOldDbs(e) {
        this._upgradeDb(e),
          this._cacheName &&
            (function (e) {
              let { blocked: t } =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              const s = indexedDB.deleteDatabase(e);
              t && s.addEventListener("blocked", (e) => t(e.oldVersion, e)),
                k(s).then(() => {});
            })(this._cacheName);
      }
      async setTimestamp(e, t) {
        const s = {
            url: (e = N(e)),
            timestamp: t,
            cacheName: this._cacheName,
            id: this._getId(e),
          },
          n = (await this.getDb()).transaction(D, "readwrite", {
            durability: "relaxed",
          });
        await n.store.put(s), await n.done;
      }
      async getTimestamp(e) {
        const t = await this.getDb(),
          s = await t.get(D, this._getId(e));
        return null === s || void 0 === s ? void 0 : s.timestamp;
      }
      async expireEntries(e, t) {
        const s = await this.getDb();
        let n = await s
          .transaction(D)
          .store.index("timestamp")
          .openCursor(null, "prev");
        const r = [];
        let a = 0;
        for (; n; ) {
          const s = n.value;
          s.cacheName === this._cacheName &&
            ((e && s.timestamp < e) || (t && a >= t) ? r.push(n.value) : a++),
            (n = await n.continue());
        }
        const i = [];
        for (const o of r) await s.delete(D, o.id), i.push(o.url);
        return i;
      }
      _getId(e) {
        return this._cacheName + "|" + N(e);
      }
      async getDb() {
        return (
          this._db ||
            (this._db = await (function (e, t) {
              let {
                blocked: s,
                upgrade: n,
                blocking: r,
                terminated: a,
              } = arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
              const i = indexedDB.open(e, t),
                o = k(i);
              return (
                n &&
                  i.addEventListener("upgradeneeded", (e) => {
                    n(
                      k(i.result),
                      e.oldVersion,
                      e.newVersion,
                      k(i.transaction),
                      e
                    );
                  }),
                s &&
                  i.addEventListener("blocked", (e) =>
                    s(e.oldVersion, e.newVersion, e)
                  ),
                o
                  .then((e) => {
                    a && e.addEventListener("close", () => a()),
                      r &&
                        e.addEventListener("versionchange", (e) =>
                          r(e.oldVersion, e.newVersion, e)
                        );
                  })
                  .catch(() => {}),
                o
              );
            })("workbox-expiration", 1, {
              upgrade: this._upgradeDbAndDeleteOldDbs.bind(this),
            })),
          this._db
        );
      }
    }
    class A {
      constructor(e) {
        let t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        (this._isRunning = !1),
          (this._rerunRequested = !1),
          (this._maxEntries = t.maxEntries),
          (this._maxAgeSeconds = t.maxAgeSeconds),
          (this._matchOptions = t.matchOptions),
          (this._cacheName = e),
          (this._timestampModel = new I(e));
      }
      async expireEntries() {
        if (this._isRunning) return void (this._rerunRequested = !0);
        this._isRunning = !0;
        const e = this._maxAgeSeconds
            ? Date.now() - 1e3 * this._maxAgeSeconds
            : 0,
          t = await this._timestampModel.expireEntries(e, this._maxEntries),
          s = await self.caches.open(this._cacheName);
        for (const n of t) await s.delete(n, this._matchOptions);
        (this._isRunning = !1),
          this._rerunRequested &&
            ((this._rerunRequested = !1), u(this.expireEntries()));
      }
      async updateTimestamp(e) {
        await this._timestampModel.setTimestamp(e, Date.now());
      }
      async isURLExpired(e) {
        if (this._maxAgeSeconds) {
          const t = await this._timestampModel.getTimestamp(e),
            s = Date.now() - 1e3 * this._maxAgeSeconds;
          return void 0 === t || t < s;
        }
        return !1;
      }
      async delete() {
        (this._rerunRequested = !1),
          await this._timestampModel.expireEntries(1 / 0);
      }
    }
    class M {
      constructor() {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        (this.cachedResponseWillBeUsed = async (e) => {
          let { event: t, request: s, cacheName: n, cachedResponse: r } = e;
          if (!r) return null;
          const a = this._isResponseDateFresh(r),
            i = this._getCacheExpiration(n);
          u(i.expireEntries());
          const o = i.updateTimestamp(s.url);
          if (t)
            try {
              t.waitUntil(o);
            } catch (c) {
              0;
            }
          return a ? r : null;
        }),
          (this.cacheDidUpdate = async (e) => {
            let { cacheName: t, request: s } = e;
            const n = this._getCacheExpiration(t);
            await n.updateTimestamp(s.url), await n.expireEntries();
          }),
          (this._config = e),
          (this._maxAgeSeconds = e.maxAgeSeconds),
          (this._cacheExpirations = new Map()),
          e.purgeOnQuotaError &&
            (function (e) {
              r.add(e);
            })(() => this.deleteCacheAndMetadata());
      }
      _getCacheExpiration(e) {
        if (e === c()) throw new n("expire-custom-caches-only");
        let t = this._cacheExpirations.get(e);
        return (
          t || ((t = new A(e, this._config)), this._cacheExpirations.set(e, t)),
          t
        );
      }
      _isResponseDateFresh(e) {
        if (!this._maxAgeSeconds) return !0;
        const t = this._getDateHeaderTimestamp(e);
        if (null === t) return !0;
        return t >= Date.now() - 1e3 * this._maxAgeSeconds;
      }
      _getDateHeaderTimestamp(e) {
        if (!e.headers.has("date")) return null;
        const t = e.headers.get("date"),
          s = new Date(t).getTime();
        return isNaN(s) ? null : s;
      }
      async deleteCacheAndMetadata() {
        for (const [e, t] of this._cacheExpirations)
          await self.caches.delete(e), await t.delete();
        this._cacheExpirations = new Map();
      }
    }
    s(437);
    function O(e) {
      if (!e) throw new n("add-to-cache-list-unexpected-type", { entry: e });
      if ("string" === typeof e) {
        const t = new URL(e, location.href);
        return { cacheKey: t.href, url: t.href };
      }
      const { revision: t, url: s } = e;
      if (!s) throw new n("add-to-cache-list-unexpected-type", { entry: e });
      if (!t) {
        const e = new URL(s, location.href);
        return { cacheKey: e.href, url: e.href };
      }
      const r = new URL(s, location.href),
        a = new URL(s, location.href);
      return (
        r.searchParams.set("__WB_REVISION__", t),
        { cacheKey: r.href, url: a.href }
      );
    }
    class P {
      constructor() {
        (this.updatedURLs = []),
          (this.notUpdatedURLs = []),
          (this.handlerWillStart = async (e) => {
            let { request: t, state: s } = e;
            s && (s.originalRequest = t);
          }),
          (this.cachedResponseWillBeUsed = async (e) => {
            let { event: t, state: s, cachedResponse: n } = e;
            if (
              "install" === t.type &&
              s &&
              s.originalRequest &&
              s.originalRequest instanceof Request
            ) {
              const e = s.originalRequest.url;
              n ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
            }
            return n;
          });
      }
    }
    class W {
      constructor(e) {
        let { precacheController: t } = e;
        (this.cacheKeyWillBeUsed = async (e) => {
          let { request: t, params: s } = e;
          const n =
            (null === s || void 0 === s ? void 0 : s.cacheKey) ||
            this._precacheController.getCacheKeyForURL(t.url);
          return n ? new Request(n, { headers: t.headers }) : t;
        }),
          (this._precacheController = t);
      }
    }
    s(833);
    function K(e) {
      return "string" === typeof e ? new Request(e) : e;
    }
    class B {
      constructor(e, t) {
        (this._cacheKeys = {}),
          Object.assign(this, t),
          (this.event = t.event),
          (this._strategy = e),
          (this._handlerDeferred = new d()),
          (this._extendLifetimePromises = []),
          (this._plugins = [...e.plugins]),
          (this._pluginStateMap = new Map());
        for (const s of this._plugins) this._pluginStateMap.set(s, {});
        this.event.waitUntil(this._handlerDeferred.promise);
      }
      async fetch(e) {
        const { event: t } = this;
        let s = K(e);
        if (
          "navigate" === s.mode &&
          t instanceof FetchEvent &&
          t.preloadResponse
        ) {
          const e = await t.preloadResponse;
          if (e) return e;
        }
        const r = this.hasCallback("fetchDidFail") ? s.clone() : null;
        try {
          for (const e of this.iterateCallbacks("requestWillFetch"))
            s = await e({ request: s.clone(), event: t });
        } catch (i) {
          if (i instanceof Error)
            throw new n("plugin-error-request-will-fetch", {
              thrownErrorMessage: i.message,
            });
        }
        const a = s.clone();
        try {
          let e;
          e = await fetch(
            s,
            "navigate" === s.mode ? void 0 : this._strategy.fetchOptions
          );
          for (const s of this.iterateCallbacks("fetchDidSucceed"))
            e = await s({ event: t, request: a, response: e });
          return e;
        } catch (o) {
          throw (
            (r &&
              (await this.runCallbacks("fetchDidFail", {
                error: o,
                event: t,
                originalRequest: r.clone(),
                request: a.clone(),
              })),
            o)
          );
        }
      }
      async fetchAndCachePut(e) {
        const t = await this.fetch(e),
          s = t.clone();
        return this.waitUntil(this.cachePut(e, s)), t;
      }
      async cacheMatch(e) {
        const t = K(e);
        let s;
        const { cacheName: n, matchOptions: r } = this._strategy,
          a = await this.getCacheKey(t, "read"),
          i = Object.assign(Object.assign({}, r), { cacheName: n });
        s = await caches.match(a, i);
        for (const o of this.iterateCallbacks("cachedResponseWillBeUsed"))
          s =
            (await o({
              cacheName: n,
              matchOptions: r,
              cachedResponse: s,
              request: a,
              event: this.event,
            })) || void 0;
        return s;
      }
      async cachePut(e, t) {
        const s = K(e);
        var a;
        await ((a = 0), new Promise((e) => setTimeout(e, a)));
        const i = await this.getCacheKey(s, "write");
        if (!t) throw new n("cache-put-with-no-response", { url: f(i.url) });
        const o = await this._ensureResponseSafeToCache(t);
        if (!o) return !1;
        const { cacheName: c, matchOptions: l } = this._strategy,
          u = await self.caches.open(c),
          d = this.hasCallback("cacheDidUpdate"),
          p = d
            ? await (async function (e, t, s, n) {
                const r = h(t.url, s);
                if (t.url === r) return e.match(t, n);
                const a = Object.assign(Object.assign({}, n), {
                    ignoreSearch: !0,
                  }),
                  i = await e.keys(t, a);
                for (const o of i) if (r === h(o.url, s)) return e.match(o, n);
              })(u, i.clone(), ["__WB_REVISION__"], l)
            : null;
        try {
          await u.put(i, d ? o.clone() : o);
        } catch (g) {
          if (g instanceof Error)
            throw (
              ("QuotaExceededError" === g.name &&
                (await (async function () {
                  for (const e of r) await e();
                })()),
              g)
            );
        }
        for (const n of this.iterateCallbacks("cacheDidUpdate"))
          await n({
            cacheName: c,
            oldResponse: p,
            newResponse: o.clone(),
            request: i,
            event: this.event,
          });
        return !0;
      }
      async getCacheKey(e, t) {
        const s = `${e.url} | ${t}`;
        if (!this._cacheKeys[s]) {
          let n = e;
          for (const e of this.iterateCallbacks("cacheKeyWillBeUsed"))
            n = K(
              await e({
                mode: t,
                request: n,
                event: this.event,
                params: this.params,
              })
            );
          this._cacheKeys[s] = n;
        }
        return this._cacheKeys[s];
      }
      hasCallback(e) {
        for (const t of this._strategy.plugins) if (e in t) return !0;
        return !1;
      }
      async runCallbacks(e, t) {
        for (const s of this.iterateCallbacks(e)) await s(t);
      }
      *iterateCallbacks(e) {
        for (const t of this._strategy.plugins)
          if ("function" === typeof t[e]) {
            const s = this._pluginStateMap.get(t),
              n = (n) => {
                const r = Object.assign(Object.assign({}, n), { state: s });
                return t[e](r);
              };
            yield n;
          }
      }
      waitUntil(e) {
        return this._extendLifetimePromises.push(e), e;
      }
      async doneWaiting() {
        let e;
        for (; (e = this._extendLifetimePromises.shift()); ) await e;
      }
      destroy() {
        this._handlerDeferred.resolve(null);
      }
      async _ensureResponseSafeToCache(e) {
        let t = e,
          s = !1;
        for (const n of this.iterateCallbacks("cacheWillUpdate"))
          if (
            ((t =
              (await n({
                request: this.request,
                response: t,
                event: this.event,
              })) || void 0),
            (s = !0),
            !t)
          )
            break;
        return s || (t && 200 !== t.status && (t = void 0)), t;
      }
    }
    class j {
      constructor() {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        (this.cacheName = c(e.cacheName)),
          (this.plugins = e.plugins || []),
          (this.fetchOptions = e.fetchOptions),
          (this.matchOptions = e.matchOptions);
      }
      handle(e) {
        const [t] = this.handleAll(e);
        return t;
      }
      handleAll(e) {
        e instanceof FetchEvent && (e = { event: e, request: e.request });
        const t = e.event,
          s =
            "string" === typeof e.request ? new Request(e.request) : e.request,
          n = "params" in e ? e.params : void 0,
          r = new B(this, { event: t, request: s, params: n }),
          a = this._getResponse(r, s, t);
        return [a, this._awaitComplete(a, r, s, t)];
      }
      async _getResponse(e, t, s) {
        let r;
        await e.runCallbacks("handlerWillStart", { event: s, request: t });
        try {
          if (((r = await this._handle(t, e)), !r || "error" === r.type))
            throw new n("no-response", { url: t.url });
        } catch (a) {
          if (a instanceof Error)
            for (const n of e.iterateCallbacks("handlerDidError"))
              if (((r = await n({ error: a, event: s, request: t })), r)) break;
          if (!r) throw a;
        }
        for (const n of e.iterateCallbacks("handlerWillRespond"))
          r = await n({ event: s, request: t, response: r });
        return r;
      }
      async _awaitComplete(e, t, s, n) {
        let r, a;
        try {
          r = await e;
        } catch (a) {}
        try {
          await t.runCallbacks("handlerDidRespond", {
            event: n,
            request: s,
            response: r,
          }),
            await t.doneWaiting();
        } catch (i) {
          i instanceof Error && (a = i);
        }
        if (
          (await t.runCallbacks("handlerDidComplete", {
            event: n,
            request: s,
            response: r,
            error: a,
          }),
          t.destroy(),
          a)
        )
          throw a;
      }
    }
    class F extends j {
      constructor() {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        (e.cacheName = o(e.cacheName)),
          super(e),
          (this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
          this.plugins.push(F.copyRedirectedCacheableResponsesPlugin);
      }
      async _handle(e, t) {
        const s = await t.cacheMatch(e);
        return (
          s ||
          (t.event && "install" === t.event.type
            ? await this._handleInstall(e, t)
            : await this._handleFetch(e, t))
        );
      }
      async _handleFetch(e, t) {
        let s;
        const r = t.params || {};
        if (!this._fallbackToNetwork)
          throw new n("missing-precache-entry", {
            cacheName: this.cacheName,
            url: e.url,
          });
        {
          0;
          const n = r.integrity,
            a = e.integrity,
            i = !a || a === n;
          if (
            ((s = await t.fetch(
              new Request(e, {
                integrity: "no-cors" !== e.mode ? a || n : void 0,
              })
            )),
            n && i && "no-cors" !== e.mode)
          ) {
            this._useDefaultCacheabilityPluginIfNeeded();
            await t.cachePut(e, s.clone());
            0;
          }
        }
        return s;
      }
      async _handleInstall(e, t) {
        this._useDefaultCacheabilityPluginIfNeeded();
        const s = await t.fetch(e);
        if (!(await t.cachePut(e, s.clone())))
          throw new n("bad-precaching-response", {
            url: e.url,
            status: s.status,
          });
        return s;
      }
      _useDefaultCacheabilityPluginIfNeeded() {
        let e = null,
          t = 0;
        for (const [s, n] of this.plugins.entries())
          n !== F.copyRedirectedCacheableResponsesPlugin &&
            (n === F.defaultPrecacheCacheabilityPlugin && (e = s),
            n.cacheWillUpdate && t++);
        0 === t
          ? this.plugins.push(F.defaultPrecacheCacheabilityPlugin)
          : t > 1 && null !== e && this.plugins.splice(e, 1);
      }
    }
    (F.defaultPrecacheCacheabilityPlugin = {
      async cacheWillUpdate(e) {
        let { response: t } = e;
        return !t || t.status >= 400 ? null : t;
      },
    }),
      (F.copyRedirectedCacheableResponsesPlugin = {
        async cacheWillUpdate(e) {
          let { response: t } = e;
          return t.redirected ? await g(t) : t;
        },
      });
    class H {
      constructor() {
        let {
          cacheName: e,
          plugins: t = [],
          fallbackToNetwork: s = !0,
        } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        (this._urlsToCacheKeys = new Map()),
          (this._urlsToCacheModes = new Map()),
          (this._cacheKeysToIntegrities = new Map()),
          (this._strategy = new F({
            cacheName: o(e),
            plugins: [...t, new W({ precacheController: this })],
            fallbackToNetwork: s,
          })),
          (this.install = this.install.bind(this)),
          (this.activate = this.activate.bind(this));
      }
      get strategy() {
        return this._strategy;
      }
      precache(e) {
        this.addToCacheList(e),
          this._installAndActiveListenersAdded ||
            (self.addEventListener("install", this.install),
            self.addEventListener("activate", this.activate),
            (this._installAndActiveListenersAdded = !0));
      }
      addToCacheList(e) {
        const t = [];
        for (const s of e) {
          "string" === typeof s
            ? t.push(s)
            : s && void 0 === s.revision && t.push(s.url);
          const { cacheKey: e, url: r } = O(s),
            a = "string" !== typeof s && s.revision ? "reload" : "default";
          if (
            this._urlsToCacheKeys.has(r) &&
            this._urlsToCacheKeys.get(r) !== e
          )
            throw new n("add-to-cache-list-conflicting-entries", {
              firstEntry: this._urlsToCacheKeys.get(r),
              secondEntry: e,
            });
          if ("string" !== typeof s && s.integrity) {
            if (
              this._cacheKeysToIntegrities.has(e) &&
              this._cacheKeysToIntegrities.get(e) !== s.integrity
            )
              throw new n("add-to-cache-list-conflicting-integrities", {
                url: r,
              });
            this._cacheKeysToIntegrities.set(e, s.integrity);
          }
          if (
            (this._urlsToCacheKeys.set(r, e),
            this._urlsToCacheModes.set(r, a),
            t.length > 0)
          ) {
            const e = `Workbox is precaching URLs without revision info: ${t.join(
              ", "
            )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
            console.warn(e);
          }
        }
      }
      install(e) {
        return p(e, async () => {
          const t = new P();
          this.strategy.plugins.push(t);
          for (const [r, a] of this._urlsToCacheKeys) {
            const t = this._cacheKeysToIntegrities.get(a),
              s = this._urlsToCacheModes.get(r),
              n = new Request(r, {
                integrity: t,
                cache: s,
                credentials: "same-origin",
              });
            await Promise.all(
              this.strategy.handleAll({
                params: { cacheKey: a },
                request: n,
                event: e,
              })
            );
          }
          const { updatedURLs: s, notUpdatedURLs: n } = t;
          return { updatedURLs: s, notUpdatedURLs: n };
        });
      }
      activate(e) {
        return p(e, async () => {
          const e = await self.caches.open(this.strategy.cacheName),
            t = await e.keys(),
            s = new Set(this._urlsToCacheKeys.values()),
            n = [];
          for (const r of t) s.has(r.url) || (await e.delete(r), n.push(r.url));
          return { deletedURLs: n };
        });
      }
      getURLsToCacheKeys() {
        return this._urlsToCacheKeys;
      }
      getCachedURLs() {
        return [...this._urlsToCacheKeys.keys()];
      }
      getCacheKeyForURL(e) {
        const t = new URL(e, location.href);
        return this._urlsToCacheKeys.get(t.href);
      }
      getIntegrityForCacheKey(e) {
        return this._cacheKeysToIntegrities.get(e);
      }
      async matchPrecache(e) {
        const t = e instanceof Request ? e.url : e,
          s = this.getCacheKeyForURL(t);
        if (s) {
          return (await self.caches.open(this.strategy.cacheName)).match(s);
        }
      }
      createHandlerBoundToURL(e) {
        const t = this.getCacheKeyForURL(e);
        if (!t) throw new n("non-precached-url", { url: e });
        return (s) => (
          (s.request = new Request(e)),
          (s.params = Object.assign({ cacheKey: t }, s.params)),
          this.strategy.handle(s)
        );
      }
    }
    let V;
    const $ = () => (V || (V = new H()), V);
    s(185);
    const J = (e) => (e && "object" === typeof e ? e : { handle: e });
    class Y {
      constructor(e, t) {
        let s =
          arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : "GET";
        (this.handler = J(t)), (this.match = e), (this.method = s);
      }
      setCatchHandler(e) {
        this.catchHandler = J(e);
      }
    }
    class z extends Y {
      constructor(e, t, s) {
        super(
          (t) => {
            let { url: s } = t;
            const n = e.exec(s.href);
            if (n && (s.origin === location.origin || 0 === n.index))
              return n.slice(1);
          },
          t,
          s
        );
      }
    }
    class G {
      constructor() {
        (this._routes = new Map()), (this._defaultHandlerMap = new Map());
      }
      get routes() {
        return this._routes;
      }
      addFetchListener() {
        self.addEventListener("fetch", (e) => {
          const { request: t } = e,
            s = this.handleRequest({ request: t, event: e });
          s && e.respondWith(s);
        });
      }
      addCacheListener() {
        self.addEventListener("message", (e) => {
          if (e.data && "CACHE_URLS" === e.data.type) {
            const { payload: t } = e.data;
            0;
            const s = Promise.all(
              t.urlsToCache.map((t) => {
                "string" === typeof t && (t = [t]);
                const s = new Request(...t);
                return this.handleRequest({ request: s, event: e });
              })
            );
            e.waitUntil(s),
              e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
          }
        });
      }
      handleRequest(e) {
        let { request: t, event: s } = e;
        const n = new URL(t.url, location.href);
        if (!n.protocol.startsWith("http")) return void 0;
        const r = n.origin === location.origin,
          { params: a, route: i } = this.findMatchingRoute({
            event: s,
            request: t,
            sameOrigin: r,
            url: n,
          });
        let o = i && i.handler;
        const c = t.method;
        if (
          (!o &&
            this._defaultHandlerMap.has(c) &&
            (o = this._defaultHandlerMap.get(c)),
          !o)
        )
          return void 0;
        let h;
        try {
          h = o.handle({ url: n, request: t, event: s, params: a });
        } catch (u) {
          h = Promise.reject(u);
        }
        const l = i && i.catchHandler;
        return (
          h instanceof Promise &&
            (this._catchHandler || l) &&
            (h = h.catch(async (e) => {
              if (l) {
                0;
                try {
                  return await l.handle({
                    url: n,
                    request: t,
                    event: s,
                    params: a,
                  });
                } catch (r) {
                  r instanceof Error && (e = r);
                }
              }
              if (this._catchHandler)
                return this._catchHandler.handle({
                  url: n,
                  request: t,
                  event: s,
                });
              throw e;
            })),
          h
        );
      }
      findMatchingRoute(e) {
        let { url: t, sameOrigin: s, request: n, event: r } = e;
        const a = this._routes.get(n.method) || [];
        for (const i of a) {
          let e;
          const a = i.match({ url: t, sameOrigin: s, request: n, event: r });
          if (a)
            return (
              (e = a),
              ((Array.isArray(e) && 0 === e.length) ||
                (a.constructor === Object && 0 === Object.keys(a).length) ||
                "boolean" === typeof a) &&
                (e = void 0),
              { route: i, params: e }
            );
        }
        return {};
      }
      setDefaultHandler(e) {
        let t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "GET";
        this._defaultHandlerMap.set(t, J(e));
      }
      setCatchHandler(e) {
        this._catchHandler = J(e);
      }
      registerRoute(e) {
        this._routes.has(e.method) || this._routes.set(e.method, []),
          this._routes.get(e.method).push(e);
      }
      unregisterRoute(e) {
        if (!this._routes.has(e.method))
          throw new n("unregister-route-but-not-found-with-method", {
            method: e.method,
          });
        const t = this._routes.get(e.method).indexOf(e);
        if (!(t > -1)) throw new n("unregister-route-route-not-registered");
        this._routes.get(e.method).splice(t, 1);
      }
    }
    let Q;
    const X = () => (
      Q || ((Q = new G()), Q.addFetchListener(), Q.addCacheListener()), Q
    );
    function Z(e, t, s) {
      let r;
      if ("string" === typeof e) {
        const n = new URL(e, location.href);
        0;
        r = new Y(
          (e) => {
            let { url: t } = e;
            return t.href === n.href;
          },
          t,
          s
        );
      } else if (e instanceof RegExp) r = new z(e, t, s);
      else if ("function" === typeof e) r = new Y(e, t, s);
      else {
        if (!(e instanceof Y))
          throw new n("unsupported-route-type", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
            paramName: "capture",
          });
        r = e;
      }
      return X().registerRoute(r), r;
    }
    function ee(e) {
      let t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
      for (const s of [...e.searchParams.keys()])
        t.some((e) => e.test(s)) && e.searchParams.delete(s);
      return e;
    }
    class te extends Y {
      constructor(e, t) {
        super((s) => {
          let { request: n } = s;
          const r = e.getURLsToCacheKeys();
          for (const a of (function (e) {
            let {
              ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/],
              directoryIndex: s = "index.html",
              cleanURLs: n = !0,
              urlManipulation: r,
            } = arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : {};
            return (function* () {
              const a = new URL(e, location.href);
              (a.hash = ""), yield a.href;
              const i = ee(a, t);
              if ((yield i.href, s && i.pathname.endsWith("/"))) {
                const e = new URL(i.href);
                (e.pathname += s), yield e.href;
              }
              if (n) {
                const e = new URL(i.href);
                (e.pathname += ".html"), yield e.href;
              }
              if (r) {
                const e = r({ url: a });
                for (const t of e) yield t.href;
              }
            })();
          })(n.url, t)) {
            const t = r.get(a);
            if (t) {
              return { cacheKey: t, integrity: e.getIntegrityForCacheKey(t) };
            }
          }
        }, e.strategy);
      }
    }
    const se = {
      cacheWillUpdate: async (e) => {
        let { response: t } = e;
        return 200 === t.status || 0 === t.status ? t : null;
      },
    };
    class ne extends j {
      constructor() {
        super(
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        ),
          this.plugins.some((e) => "cacheWillUpdate" in e) ||
            this.plugins.unshift(se);
      }
      async _handle(e, t) {
        const s = t.fetchAndCachePut(e).catch(() => {});
        t.waitUntil(s);
        let r,
          a = await t.cacheMatch(e);
        if (a) 0;
        else {
          0;
          try {
            a = await s;
          } catch (i) {
            i instanceof Error && (r = i);
          }
        }
        if (!a) throw new n("no-response", { url: e.url, error: r });
        return a;
      }
    }
    var re;
    s(900);
    class ae {
      constructor() {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        (this._statuses = e.statuses), (this._headers = e.headers);
      }
      isResponseCacheable(e) {
        let t = !0;
        return (
          this._statuses && (t = this._statuses.includes(e.status)),
          this._headers &&
            t &&
            (t = Object.keys(this._headers).some(
              (t) => e.headers.get(t) === this._headers[t]
            )),
          t
        );
      }
    }
    class ie {
      constructor(e) {
        (this.cacheWillUpdate = async (e) => {
          let { response: t } = e;
          return this._cacheableResponse.isResponseCacheable(t) ? t : null;
        }),
          (this._cacheableResponse = new ae(e));
      }
    }
    addEventListener("fetch", (0, e.serviceWorkerFetchListener)()),
      self.addEventListener("activate", () => self.clients.claim()),
      self.skipWaiting(),
      (function (e) {
        $().precache(e);
      })([
        {
          revision: "1187b7c42e50513bcb80da251c3bacef",
          url: "/course/index.html",
        },
        { revision: null, url: "/course/static/css/main.339e26f9.css" },
        {
          revision: null,
          url: "/course/static/js/359.a433d9df.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/359.b2fdd3e9.chunk.js" },
        { revision: null, url: "/course/static/js/401.4d4011da.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/401.e622d557.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/406.262f1451.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/406.f169b0bb.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/488.009c6315.chunk.js" },
        { revision: null, url: "/course/static/js/50.d66f06a3.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/50.d66f06a3.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/617.2ca7179f.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/617.f9b1c8c4.chunk.worker.js",
        },
        {
          revision: null,
          url: "/course/static/js/652.e1f0fdc0.chunk.worker.js",
        },
        {
          revision: null,
          url: "/course/static/js/772.8b60771e.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/772.ab50fe4d.chunk.js" },
        { revision: null, url: "/course/static/js/949.d34f35c1.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/949.d34f35c1.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/950.c84eec8f.chunk.js" },
        {
          revision: null,
          url: "/course/static/js/950.ee422f8c.chunk.worker.js",
        },
        { revision: null, url: "/course/static/js/Worker.ad257f77.worker.js" },
        { revision: null, url: "/course/static/js/main.b864744e.js" },
        {
          revision: null,
          url: "/course/static/media/language.01e9858166e0111e3375.png",
        },
        {
          revision: null,
          url: "/course/static/media/pages.json.5e48284b7e67d08614cc.load_by_url",
        },
        {
          revision: null,
          url: "/course/static/media/python_core.tar.0a92dd5d662dd90e9e53.load_by_url",
        },
      ]),
      (function (e) {
        const t = $();
        Z(new te(t, e));
      })(re),
      Z((e) => {
        let { url: t } = e;
        const s = t.toString();
        return (
          s.startsWith("https://cdn.jsdelivr.net/") ||
          s.startsWith("https://pyodide-cdn2.iodide.io") ||
          s.startsWith("https://futurecoder-io--") ||
          t.hostname.endsWith("futurecoder.io") ||
          t.hostname.includes("localhost") ||
          t.hostname.includes("127.0.0.1")
        );
      }, new ne({ cacheName: "everything", plugins: [new M({ maxEntries: 30 }), new ie({ statuses: [0,
              200] })] }));
  })();
})();
//# sourceMappingURL=service-worker.js.map
