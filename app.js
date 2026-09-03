/* Sikai – Lern-Engine v2 (Gamification: Reise, XP, Streak, SRS, Story) */
"use strict";

const APP_VERSION = "26";

const $ = (sel, root = document) => root.querySelector(sel);
const view = $("#view");
const player = $("#player");

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* Privatmodus */ } }
};

const state = {
  script: ["dev", "both", "tr"].indexOf(store.get("sikai_script", "both")) > -1 ? store.get("sikai_script") : "both",
  sound: store.get("sikai_sound", "on"),
  haptic: store.get("sikai_haptic", "on"),
  lang: detectLang(),
  theme: (function () {
    const ut = new URLSearchParams(location.search).get("theme");
    if (ut === "dark" || ut === "light") return ut;
    return store.get("sikai_theme", window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  })()
};

/* ---------- Sprache (Deutsch / Englisch) ----------
   UI-Strings: t("key") -> [de, en] aus data/i18n.js
   Inhalt: G({de,en}) fuer Feldpaare, TX(obj,"text") fuer text/textEn-Suffixe.
   Fortschritt (XP, SRS, Szenen) haengt an IDs und bleibt beim Umschalten erhalten. */
function langHasProgress() {
  return Object.keys(localStorage).some(k => /^sikai_(xp|srs|daily|done_|group_|tiprot)/.test(k));
}
function detectLang() {
  const saved = store.get("sikai_lang", null);
  if (saved === "de" || saved === "en") return saved;
  return langHasProgress() ? "de" : "en"; // Bestandsnutzer waren deutsch, Neustart default en
}
function applyLang(l) {
  if (l !== "de" && l !== "en") return;
  state.lang = l;
  store.set("sikai_lang", l);
  refreshStaticChrome();
  updateHeaderStats();
  renderHome();
  toast(t("lang-switched"));
}
/* Statische Chrome-Teile (index.html) nachziehen: Titel, html-lang, Script-Umschalter */
function refreshStaticChrome() {
  document.title = t("doc-title");
  document.documentElement.lang = state.lang;
  document.querySelectorAll("#scriptToggle [data-i18n]").forEach(b => { b.textContent = t(b.dataset.i18n); });
  const xp = $("#xpPill"), st = $("#streakPill"), th = $("#themeBtn"), tg = $("#scriptToggle");
  if (xp) xp.title = t("pill-xp");
  if (st) st.title = t("pill-streak");
  if (th) { th.title = t("theme-toggle"); th.setAttribute("aria-label", t("theme-aria")); }
  if (tg) tg.setAttribute("aria-label", t("set-script"));
}
function t(key, vars) {
  const e = window.I18N && window.I18N[key];
  let s = Array.isArray(e) ? (state.lang === "en" && e[1] != null ? e[1] : e[0]) : key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}
function G(o) { // Feldpaar {de, en}
  if (!o) return o;
  return state.lang === "en" && o.en != null ? o.en : o.de;
}
function TX(o, base) { // Suffixpaar text/textEn, title/titleEn, why/whyEn ...
  if (!o) return o;
  return state.lang === "en" && o[base + "En"] != null ? o[base + "En"] : o[base];
}
/* Erststart: Sprachwahl, wenn noch gar nichts gespeichert ist (nicht in Demo-Ansichten) */
function maybeShowLangPicker() {
  if (store.get("sikai_lang", null) !== null) return;
  if (langHasProgress()) return;
  if (new URLSearchParams(location.search).get("demo")) return;
  const back = document.createElement("div");
  back.className = "modal-backdrop";
  back.innerHTML = `
    <div class="modal lang-picker" role="dialog" aria-modal="true" aria-label="Language">
      <div class="lp-title">Choose your language</div>
      <div class="lp-sub">Sikai teaches Nepali – pick the language you learn with.</div>
      <div class="lp-row">
        <button class="btn btn-primary" data-lang-pick="en">English</button>
        <button class="btn btn-ghost" data-lang-pick="de">Deutsch</button>
      </div>
    </div>`;
  document.body.appendChild(back);
  back.querySelectorAll("[data-lang-pick]").forEach(b => b.addEventListener("click", () => {
    const l = b.dataset.langPick;
    store.set("sikai_lang", l);
    state.lang = l;
    back.remove();
    refreshStaticChrome();
    renderHome();
    updateHeaderStats();
  }));
}

/* ---------- Helfer ---------- */

const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Lokales Datum (nicht UTC!) – sonst flippt der Lerntag zur falschen Stunde
const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const allItems = () => LESSONS[0].groups.flatMap(g => g.items);
const itemById = id => allItems().find(i => i.id === id);
const playId = (id, btn) => playItem({ id }, btn);

function neTr(item, cls = "") {
  return `<span class="ne dev ${cls}">${esc(item.ne)}</span><span class="tr inline ${cls}">${esc(item.tr)}</span>`;
}
function both(item) {
  return `<span class="dev">${esc(item.ne)}</span> <span style="color:var(--ink-faint);font-style:italic">${esc(item.tr)}</span>`;
}

/* ---------- Devanagari-Transliteration fuer Freitext ---------- */
const DEV_MAP = {
  "\u0905":"a","\u0906":"aa","\u0907":"i","\u0908":"ii","\u0909":"u","\u090A":"uu",
  "\u090F":"e","\u0910":"ai","\u0913":"o","\u0914":"au","\u0915":"k","\u0916":"kh",
  "\u0917":"g","\u0918":"gh","\u0919":"ng","\u091A":"ch","\u091B":"chh","\u091C":"j",
  "\u091D":"jh","\u091F":"t","\u0920":"th","\u0921":"d","\u0922":"dh","\u0923":"n",
  "\u0924":"t","\u0925":"th","\u0926":"d","\u0927":"dh","\u0928":"n","\u092A":"p",
  "\u092B":"ph","\u092C":"b","\u092D":"bh","\u092E":"m","\u092F":"y","\u0930":"r",
  "\u0932":"l","\u0935":"v","\u0936":"sh","\u0937":"sh","\u0938":"s","\u0939":"h",
  "\u093E":"aa","\u093F":"i","\u0940":"ii","\u0941":"u","\u0942":"uu",
  "\u0943":"ri","\u0947":"e","\u0948":"ai","\u094B":"o","\u094C":"au",
  "\u094D":"", "\u0901":"n","\u0902":"n","\u0903":"h","\u0964":"."
};
const DEV_RE = /[\u0900-\u097F]+/g;

function translitDev(txt) {
  const CONS = new Set("कखगघङचछजझटठडढणतथदधनपफबभमयरलवशषसह");
  const MATRA = new Set("ािीुूृेैोौ");
  const VIRAMA = "्";
  let out = "";
  const chars = [...txt];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const val = DEV_MAP[c];
    if (val === undefined) { out += c; continue; }
    if (CONS.has(c)) {
      const next = chars[i + 1] || "";
      if (next === VIRAMA) { out += val; i++; }
      else if (MATRA.has(next)) { out += val + DEV_MAP[next]; i++; }
      else { out += val + "a"; }
    } else { out += val; }
  }
  return out;
}

// Freitext mit gemischtem Devanagari: Devanagari + Umschrift dahinter
function neTrText(txt) {
  if (!txt) return "";
  const t = esc(txt);
  return t.replace(/<span/g, "<\u200bspan").replace(/[\u0900-\u097F\u0964]+/g, (m, off, str) => {
    // Bereits vorhandene Klammer-Umschrift dahinter? Dann nicht noch einmal transliterieren
    if (/^\s*\(/.test(str.slice(off + m.length))) return m;
    return `<span class="dev">${m}</span> <i style="color:var(--ink-faint)">(${translitDev(m)})</i>`;
  }).replace(/<\u200bspan/g, "<span");
}

/* ---------- Icons (Inline-SVG, Palette-Farben) ---------- */

const ICONS = {
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /> <path d="M16 9a5 5 0 0 1 0 6" /> <path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg>',
  muted: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /> <line x1="22" x2="16" y1="9" y2="15" /> <line x1="16" x2="22" y1="9" y2="15" /></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18" /> <path d="m6 6 12 12" /></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" /></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /> <path d="M12 2v2" /> <path d="M12 20v2" /> <path d="m4.93 4.93 1.41 1.41" /> <path d="m17.66 17.66 1.41 1.41" /> <path d="M2 12h2" /> <path d="M20 12h2" /> <path d="m6.34 17.66-1.41 1.41" /> <path d="m19.07 4.93-1.41 1.41" /></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>',
  map_pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" /></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /> <path d="M3 3v5h5" /> <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /> <path d="M16 16h5v5" /></svg>',
  heart_handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" /></svg>',
  message_circle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" /></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /> <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" /></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /> <circle cx="7" cy="17" r="2" /> <path d="M9 17h6" /> <circle cx="17" cy="17" r="2" /></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" /></svg>',
  calendar_check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v3" /> <path d="M16 2v3" /> <rect x="3" y="3" width="18" height="18" rx="2" /> <path d="M3 9h18" /> <path d="m9 15 2 2 4-4" /></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /> <circle cx="12" cy="12" r="6" /> <circle cx="12" cy="12" r="2" /></svg>',
  _unused_compare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3 4 7l4 4" /> <path d="M4 7h16" /> <path d="m16 21 4-4-4-4" /> <path d="M20 17H4" /></svg>',
  type: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16" /> <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" /> <path d="M9 20h6" /></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  speech: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.8 10.9c-1 .4-2-.7-1.4-1.6L9 6.5"/><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  mountain_snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /> <path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" /></svg>',
  smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /> <path d="M12 18h.01" /></svg>',
  wifi_off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h.01" /> <path d="M8.5 16.429a5 5 0 0 1 7 0" /> <path d="M5 12.859a10 10 0 0 1 5.17-2.69" /> <path d="M19 12.859a10 10 0 0 1-2.007-1.523" /> <path d="M2 8.82a15 15 0 0 1 4.177-2.643" /> <path d="M22 8.82a15 15 0 0 0-11.288-3.764" /> <path d="m2 2 20 20" /></svg>',
  maximize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3" /> <path d="M21 8V5a2 2 0 0 0-2-2h-3" /> <path d="M3 16v3a2 2 0 0 0 2 2h3" /> <path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>',
  flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" /></svg>'
};

/* ---------- Audio & Feedback ---------- */

function playItem(item, btn, retry) {
  document.querySelectorAll(".audio-btn.playing").forEach(b => b.classList.remove("playing"));
  if (state.sound !== "on") return;
  if (btn) btn.classList.add("playing");
  player.src = `audio/${item.id}.mp3`;
  player.play().catch(err => {
    console.warn("Audio-Fehler:", item.id, err && err.name);
    if (!retry) {
      // Einmal nachladen und erneut versuchen (Netzwerk-Race)
      setTimeout(() => {
        player.load();
        playItem(item, btn, true);
      }, 300);
    } else if (btn) {
      btn.classList.remove("playing");
    }
  });
  player.onended = () => btn && btn.classList.remove("playing");
}

let audioCtx = null;
function blip(kind) {
  if (state.sound !== "on") return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    if (kind === "good") {
      const o1 = audioCtx.createOscillator(), o2 = audioCtx.createOscillator();
      o1.frequency.value = 523; o2.frequency.value = 784;
      o1.connect(gain); o2.connect(gain);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o1.start(t); o1.stop(t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.45);
    } else {
      const o = audioCtx.createOscillator();
      o.type = "square"; o.frequency.value = 165;
      o.connect(gain);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.25);
    }
  } catch { /* kein WebAudio */ }
}

function toggleSound() {
  state.sound = state.sound === "on" ? "off" : "on";
  store.set("sikai_sound", state.sound);
  if (state.sound === "off") player.pause();
  const sb = $("#soundBtn");
  if (sb) sb.innerHTML = state.sound === "on" ? ICONS.speaker : ICONS.muted;
}

function buzz(kind) {
  if (state.haptic !== "on") return;
  if (navigator.vibrate) navigator.vibrate(kind === "good" ? 35 : [60, 40, 60]);
}

/* ---------- Gamification: XP, Streak, SRS, Challenge ---------- */

const DAY = 86400000;

function getXp() { return store.get("sikai_xp", 0); }

/* Tagesstatistik für das Tagesziel (lokales Datum!) */
function dailyData() {
  const d = store.get("sikai_daily", null);
  const t = todayStr();
  const fresh = () => ({ date: t, xp: 0, sessions: 0, correct: 0, scene: false, review: false, goalBonus: false, sceneTitle: "" });
  return d && d.date === t ? Object.assign(fresh(), d) : fresh();
}
function saveDaily(dd) { store.set("sikai_daily", dd); }

function addXp(n, label) {
  store.set("sikai_xp", getXp() + n);
  const dd = dailyData();
  dd.xp += n;
  saveDaily(dd);
  updateHeaderStats();
  toast(`+${n} XP${label ? " · " + label : ""}`);
}

let toastTimer = null;
function toast(text) {
  let el = $("#xpToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "xpToast";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 1600);
}

function streakData() { return store.get("sikai_streak", { count: 0, last: null }); }

const dateStr = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
// „gestern“ im LOKALEN Kalender berechnen (nicht UTC-versetzt)
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dateStr(d); };

function streakCold() { // Teller kalt, wenn der letzte Tag nicht heute/gestern war
  const { last } = streakData();
  if (!last) return false;
  const today = new Date(todayStr());
  const lastD = new Date(last);
  return (today - lastD) / DAY > 1.5;
}

function completeStreakDay() {
  const s = streakData();
  const today = todayStr();
  if (s.last === today) return;
  s.count = s.last === yesterdayStr() ? s.count + 1 : 1;
  s.last = today;
  store.set("sikai_streak", s);
}

/* SRS: „Erinnerungen auffrischen“ – Intervalldoppelung bei Erfolg, Reset bei Fehler */
function srsAll() { return store.get("sikai_srs", {}); }

function srsAnswer(id, firstTryCorrect) {
  const srs = srsAll();
  const rec = srs[id] || { s: 0, due: 0 };
  if (firstTryCorrect) {
    rec.s = Math.min(rec.s + 1, 6);
    rec.due = Date.now() + Math.pow(2, rec.s) * DAY;
  } else {
    rec.s = 0;
    rec.due = Date.now();
  }
  srs[id] = rec;
  store.set("sikai_srs", srs);
}

function srsSeed(ids) { // nach einer Session: neue Items morgen auffrischbar
  const srs = srsAll();
  ids.forEach(id => { if (!srs[id]) srs[id] = { s: 1, due: Date.now() + DAY }; });
  store.set("sikai_srs", srs);
}

function srsDueIds() {
  const srs = srsAll();
  const now = Date.now();
  const open = new Set(unlockedItems().map(i => i.id));
  return Object.keys(srs).filter(id => srs[id].due <= now && itemById(id) && open.has(id))
    .sort((a, b) => srs[a].due - srs[b].due);
}

/* Tagesziel: die nächste ungemachte Szene der Reise (Kapitel-Reihenfolge) */
function nextSceneDef() {
  const list = chapterList();
  for (let ci = 0; ci < list.length; ci++) {
    const sc = list[ci].scenes.find(s => store.get("sikai_done_" + s.id, 0) === 0);
    if (sc) return { scene: sc, ci };
  }
  return null;
}

/* Beschriftung der Wiederholungs-Aufgabe: fällige Wörter, sonst Fallback */
function reviewTaskLabel() {
  const due = srsDueIds().length;
  if (due) return t("review-due", { n: due, w: due === 1 ? t("unit-word") : t("unit-words") });
  const learned = Object.keys(srsAll()).filter(id => itemById(id)).length;
  if (learned) return t("review-none-due");
  return t("review-first-words");
}

/* Tages-Challenge: ehrliches Zwei-Klick-Ritual (+10 XP) */
function challengeToday() {
  const pool = CHALLENGES;
  const day = Math.floor(Date.now() / DAY);
  return pool[day % pool.length];
}
function challengeDoneToday() {
  return store.get("sikai_challenge", null) === todayStr();
}
function bindChallengeBtn(btn) {
  let armed = false;
  btn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      btn.textContent = t("challenge-arm");
      setTimeout(() => { if (!challengeDoneToday() && btn.isConnected) { armed = false; btn.textContent = t("challenge-open"); } }, 8000);
      return;
    }
    if (challengeDoneToday()) return;
    store.set("sikai_challenge", todayStr());
    addXp(10, t("xp-challenge"));
    renderHome();
  });
}

/* Gruppen-Fortschritt */
function groupDoneCount(gid) { return store.get("sikai_group_" + gid, 0); }
function bumpGroup(gid) { store.set("sikai_group_" + gid, groupDoneCount(gid) + 1); }

/* ---------- Theme & Schrift ---------- */

function applyTheme(mode) {
  state.theme = mode;
  store.set("sikai_theme", mode);
  document.documentElement.dataset.theme = mode;
}

function applyScript(mode) {
  if (["dev", "both", "tr"].indexOf(mode) === -1) return; // z.B. Klick aus einer fremden .seg
  state.script = mode;
  store.set("sikai_script", mode);
  document.body.className = "script-" + mode;
  document.querySelectorAll("#scriptToggle button").forEach(b =>
    b.classList.toggle("active", b.dataset.script === mode));
}

/* ---------- Kopfzeile ---------- */

function updateHeaderStats() {
  const xp = $("#xpPill");
  if (xp) xp.innerHTML = `${ICONS.star} ${getXp()}`;
  const st = $("#streakPill");
  if (st) st.innerHTML = `${ICONS.flame} ${streakData().count}`;
}

function bindHeader() {
  $("#scriptToggle").addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (btn) applyScript(btn.dataset.script);
  });
  $("#themeBtn").addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
    $("#themeBtn").innerHTML = state.theme === "dark" ? ICONS.sun : ICONS.moon;
  });
}

/* ---------- PWA: Offline-Speicher & App-Installation ---------- */

const pwa = { supported: "serviceWorker" in navigator && /^https?:$/.test(location.protocol), status: "init", done: 0, total: 0, failed: 0, prompt: null };
let pwaReloadArmed = false;

function isStandaloneApp() {
  return matchMedia("(display-mode: standalone), (display-mode: minimal-ui)").matches || navigator.standalone === true;
}
function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function initPwa() {
  if (!pwa.supported) { pwa.status = "unsupported"; return; }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    pwa.prompt = e;
    refreshPwaCards();
    const go = $("#installGo");
    if (go) go.hidden = false; // Banner ist offen, Button jetzt aktivierbar
  });
  window.addEventListener("appinstalled", () => {
    pwa.prompt = null;
    store.set("sikai_install_hint_done", true);
    hideInstallHint(false);
    refreshPwaCards();
  });

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-install]");
    if (!btn || !pwa.prompt) return;
    pwa.prompt.prompt();
    await pwa.prompt.userChoice.catch(() => ({}));
    pwa.prompt = null;
    refreshPwaCards();
  });

  navigator.serviceWorker.addEventListener("message", (e) => {
    const d = e.data || {};
    if (d.type === "sikai-cache-progress") { pwa.status = "loading"; pwa.done = d.done; pwa.total = d.total; pwa.failed = d.failed; }
    else if (d.type === "sikai-cache-ready") { pwa.status = "ready"; pwa.done = d.done; pwa.total = d.total; pwa.failed = 0; }
    else if (d.type === "sikai-cache-failed") { pwa.status = "failed"; pwa.done = d.done; pwa.total = d.total; pwa.failed = d.failed; }
    else if (d.type === "sikai-cache-status") {
      pwa.total = d.total;
      pwa.done = Math.min(d.cached, d.total);
      pwa.status = d.installing ? "loading" : (d.cached >= d.total ? "ready" : "failed");
    }
    refreshPwaCards();
  });

  navigator.serviceWorker.register("sw.js").then((reg) => {
    reg.addEventListener("updatefound", () => {
      const w = reg.installing;
      if (!w) return;
      w.addEventListener("statechange", () => {
        if (w.state === "installed" && navigator.serviceWorker.controller) showUpdateBar(w);
      });
    });
    // Update wurde evtl. gefunden, bevor unser Lauscher hing: wartenden Worker direkt melden
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
    navigator.serviceWorker.controller && reg.active && setTimeout(askSwStatus, 300);
    // Installierte App im Hintergrund prueft sonst nie auf Updates (Browser nur bei Navigation)
    setInterval(() => reg.update().catch(() => {}), 3600e3);
  }).catch(() => { pwa.status = "regerror"; refreshPwaCards(); });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (pwaReloadArmed) location.reload();
  });

  maybeShowInstallHint();
}

function askSwStatus() {
  navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage({ type: "sikai-get-status" });
}

/* Install-Hinweis beim ersten Oeffnen (nicht in App, nicht nach Wegklicken, nicht in Demo-Ansichten) */
function maybeShowInstallHint() {
  if (!pwa.supported || isStandaloneApp()) return;
  if (store.get("sikai_install_hint_done", false)) return;
  if (new URLSearchParams(location.search).get("demo")) return;
  setTimeout(() => {
    if ($("#updateBar") || $("#installBar")) return;
    if (isStandaloneApp() || store.get("sikai_install_hint_done", false)) return;
    showInstallHint();
  }, 1600);
}

function showInstallHint() {
  const bar = document.createElement("div");
  bar.id = "installBar";
  const ios = isIos();
  bar.innerHTML = `
    <span>${ios ? t("installbar-ios") : t("installbar")}</span>
    ${ios ? "" : `<button class="btn btn-primary btn-sm" id="installGo" ${pwa.prompt ? "" : "hidden"}>${ICONS.smartphone} ${t("installbar-btn")}</button>`}
    <button class="ib-close" id="installClose" aria-label="${t("close-hint")}">${ICONS.close}</button>`;
  document.body.appendChild(bar);
  const revealBar = () => bar.classList.add("show");
  requestAnimationFrame(revealBar);
  setTimeout(revealBar, 350); // Fallback, falls rAF im Hintergrund-Pane pausiert
  $("#installClose", bar).addEventListener("click", () => hideInstallHint(true));
  const go = $("#installGo", bar);
  if (go) go.addEventListener("click", async () => {
    if (!pwa.prompt) return;
    pwa.prompt.prompt();
    await pwa.prompt.userChoice.catch(() => ({}));
    pwa.prompt = null;
    hideInstallHint(true);
    refreshPwaCards();
  });
}

function hideInstallHint(save) {
  const bar = $("#installBar");
  if (!bar) return;
  bar.classList.remove("show");
  if (save) store.set("sikai_install_hint_done", true);
  setTimeout(() => bar.remove(), 300);
}

function showUpdateBar(worker) {
  let bar = $("#updateBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "updateBar";
    document.body.appendChild(bar);
  }
  const revealUpdate = () => bar.classList.add("show");
  bar.innerHTML = `<span>${t("updatebar")}</span>
    <button class="btn btn-primary btn-sm" id="updateReload">${t("updatebar-btn")}</button>`;
  requestAnimationFrame(revealUpdate);
  setTimeout(revealUpdate, 350); // Fallback, falls rAF im Hintergrund-Pane pausiert
  $("#updateReload").addEventListener("click", () => {
    pwaReloadArmed = true;
    $("#updateBar").classList.remove("show");
    if (worker.state === "redundant") { location.reload(); return; } // Wettrennen verloren: direkt neu laden
    worker.postMessage({ type: "sikai-skip-waiting" });
  });
}

function pwaRowsHtml() {
  if (!pwa.supported) return "";
  const standalone = isStandaloneApp();
  return `
  <div class="set-kicker">${t("set-app-offline")}</div>
  ${standalone ? "" : `<div class="set-row">
    <div class="set-info"><b>${t("set-install")}</b><small id="installHint"></small></div>
    <button class="btn btn-ghost btn-sm" id="installBtn" data-install hidden>${ICONS.smartphone} ${t("installbar-btn")}</button>
  </div>`}
  <div class="set-row">
    <div class="set-info"><b>${t("set-offline")}</b><small id="offlineHint"></small><div class="off-bar" id="offlineBar" hidden><i></i></div></div>
    <span class="off-badge" id="offlineBadge"></span>
  </div>`;
}

function refreshPwaCards() {
  const hint = $("#installHint");
  const btn = $("#installBtn");
  const offHint = $("#offlineHint");
  const offBar = $("#offlineBar");
  const offBadge = $("#offlineBadge");
  if (!offHint) return; // Einstellungen nicht offen

  if (btn) {
    if (pwa.prompt) {
      btn.hidden = false;
      hint.textContent = t("off-installed-tile");
    } else if (isStandaloneApp()) {
      btn.hidden = true;
      hint.textContent = t("off-running");
    } else if (isIos()) {
      btn.hidden = true;
      hint.textContent = t("off-ios");
    } else {
      btn.hidden = true;
      hint.textContent = t("off-browsermenu");
    }
  }

  if (pwa.status === "ready") {
    offHint.textContent = t("off-ready", { n: pwa.total || t("off-all") });
    offBar.hidden = true;
    offBadge.textContent = t("off-badge-ready");
    offBadge.className = "off-badge ok";
  } else if (pwa.status === "loading") {
    offHint.textContent = t("off-loading", { a: pwa.done, b: pwa.total });
    offBar.hidden = false;
    offBar.firstElementChild.style.width = (pwa.total ? Math.round(pwa.done / pwa.total * 100) : 5) + "%";
    offBadge.textContent = "";
    offBadge.className = "off-badge";
  } else if (pwa.status === "failed") {
    offHint.textContent = t("off-failed");
    offBar.hidden = true;
    offBadge.textContent = t("off-badge-part");
    offBadge.className = "off-badge part";
  } else if (pwa.status === "regerror") {
    offHint.textContent = t("off-regerror");
    offBar.hidden = true;
    offBadge.textContent = t("off-badge-error");
    offBadge.className = "off-badge part";
  } else {
    offHint.textContent = t("off-initial");
    offBar.hidden = true;
    offBadge.textContent = "";
    offBadge.className = "off-badge";
  }
}

/* ---------- Einstellungen ---------- */

function settingsHtml() {
  const words = Object.keys(srsAll()).length;
  const mastered = LESSONS[0].groups.reduce((n, g) => n + groupDoneCount(g.id), 0)
    + store.get("sikai_done_letters", 0) + store.get("sikai_done_detective", 0) + store.get("sikai_done_story", 0);
  return `
  <div class="set-head">
    <span class="kicker">${t("set-title")}</span>
    <button class="icon-btn" id="settingsClose" aria-label="${t("set-close")}">${ICONS.close}</button>
  </div>
  <div class="set-kicker">${t("set-display")}</div>
  <div class="set-row"><span>${t("set-lang")}</span>
    <div class="seg seg-lang" role="group" aria-label="${t("set-lang")}">
      <button data-langpick="de" class="${state.lang === "de" ? "active" : ""}">Deutsch</button>
      <button data-langpick="en" class="${state.lang === "en" ? "active" : ""}">English</button>
    </div>
  </div>
  <div class="set-row"><span>${t("set-dark")}</span><button class="switch ${state.theme === "dark" ? "on" : ""}" data-set="theme" aria-label="${t("set-dark")}"><span></span></button></div>
  <div class="set-row"><span>${t("set-sound")}</span><button class="switch ${state.sound === "on" ? "on" : ""}" data-set="sound" aria-label="${t("set-sound")}"><span></span></button></div>
  <div class="set-row"><span>${t("set-haptic")}</span><button class="switch ${state.haptic === "on" ? "on" : ""}" data-set="haptic" aria-label="${t("set-haptic")}"><span></span></button></div>
  <div class="set-row"><span>${t("set-script")}</span>
    <div class="seg" role="group" aria-label="${t("set-script")}">
      <button data-script="dev" class="${state.script === "dev" ? "active" : ""}">देवनागरी</button>
      <button data-script="both" class="${state.script === "both" ? "active" : ""}">${t("set-script-both")}</button>
      <button data-script="tr" class="${state.script === "tr" ? "active" : ""}">${t("set-script-tr")}</button>
    </div>
  </div>
  <div class="set-kicker">${t("set-progress")}</div>
  <div class="set-stats">
    <div><b>${getXp()}</b><small>XP</small></div>
    <div><b>${streakData().count}</b><small>${t("set-stat-streak")}</small></div>
    <div><b>${words}</b><small>${t("set-stat-words")}</small></div>
    <div><b>${mastered}</b><small>${t("set-stat-mastered")}</small></div>
  </div>
  ${pwaRowsHtml()}
  <div class="set-kicker">${t("set-reset")}</div>
  <div class="set-row">
    <div class="set-info"><b>${t("set-reset-vocab")}</b><small>${t("set-reset-vocab-sub")}</small></div>
    <button class="btn btn-ghost btn-sm" id="resetVocabBtn">${t("set-reset-btn")}</button>
  </div>
  <div class="set-row">
    <div class="set-info"><b>${t("set-reset-all")}</b><small>${t("set-reset-all-sub")}</small></div>
    <button class="btn btn-danger btn-sm" id="resetAllBtn">${t("set-reset-all-btn")}</button>
  </div>
  <p class="set-protect">${t("set-protect")}</p>
  <p class="set-note">${t("set-note", { v: APP_VERSION })}</p>`;
}

function armReset(btn, armedText, fn) {
  if (!btn) return;
  let armed = false;
  const orig = btn.textContent;
  btn.addEventListener("click", () => {
    if (!armed) {
      armed = true;
      btn.textContent = armedText;
      btn.classList.add("armed");
      setTimeout(() => {
        if (btn.isConnected && armed) { armed = false; btn.textContent = orig; btn.classList.remove("armed"); }
      }, 8000);
      return;
    }
    fn();
  });
}

function wireSettings(root, close) {
  root.querySelectorAll("[data-set]").forEach(sw => sw.addEventListener("click", () => {
    const k = sw.dataset.set;
    if (k === "theme") {
      applyTheme(state.theme === "dark" ? "light" : "dark");
      sw.classList.toggle("on", state.theme === "dark");
      $("#themeBtn").innerHTML = state.theme === "dark" ? ICONS.sun : ICONS.moon;
    }
    if (k === "sound") { toggleSound(); sw.classList.toggle("on", state.sound === "on"); }
    if (k === "haptic") {
      state.haptic = state.haptic === "on" ? "off" : "on";
      store.set("sikai_haptic", state.haptic);
      sw.classList.toggle("on", state.haptic === "on");
    }
  }));
  root.querySelectorAll(".seg:not(.seg-lang) button").forEach(b => b.addEventListener("click", () => {
    applyScript(b.dataset.script);
    root.querySelectorAll(".seg:not(.seg-lang) button").forEach(x => x.classList.toggle("active", x === b));
  }));
  root.querySelectorAll(".seg-lang button").forEach(b => b.addEventListener("click", () => {
    root.querySelectorAll(".seg-lang button").forEach(x => x.classList.toggle("active", x === b));
  }));
  root.querySelectorAll(".seg-lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.langpick && b.dataset.langpick !== state.lang) applyLang(b.dataset.langpick);
  }));
  armReset($("#resetVocabBtn", root), t("reset-vocab-arm"), () => {
    ["sikai_srs"].concat(LESSONS[0].groups.map(g => "sikai_group_" + g.id))
      .forEach(k => localStorage.removeItem(k));
    close();
    renderHome();
    toast(t("reset-vocab-done"));
  });
  armReset($("#resetAllBtn", root), t("reset-all-arm"), () => {
    const toastAlt = t("reset-all-done"); // Toast noch in der bisherigen Sprache
    Object.keys(localStorage).filter(k => k.indexOf("sikai_") === 0).forEach(k => localStorage.removeItem(k));
    state.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    state.script = "both"; state.sound = "on"; state.haptic = "on"; state.lang = "en";
    applyTheme(state.theme); applyScript(state.script);
    $("#themeBtn").innerHTML = state.theme === "dark" ? ICONS.sun : ICONS.moon;
    updateHeaderStats();
    close();
    renderHome();
    maybeShowLangPicker();
    toast(toastAlt);
  });
}

/* ---------- Startseite: Die Nepal-Reise ---------- */

function plateHtml() {
  const { count } = streakData();
  const cold = streakCold();
  const segs = Math.min(count, 7);
  let platesegs = "";
  for (let i = 0; i < 7; i++) {
    const filled = i < segs && !cold;
    platesegs += `<span class="bhat ${filled ? "full" : ""} ${cold ? "cold" : ""}"></span>`;
  }
  return `
    <div class="plate ${cold ? "cold" : ""}" title="${t("plate-title", { n: count, dw: state.lang === "en" ? "day" : (count === 1 ? t("unit-day") : t("unit-days")) })}">
      <div class="dal"></div>
      <div class="bhat-row">${platesegs}</div>
      <div class="plate-label">${cold ? t("plate-cold") : count === 0 ? t("plate-first") : t("plate-streak", { n: count, dw: state.lang === "en" ? "day" : (count === 1 ? t("unit-day") : t("unit-days")) })}</div>
    </div>`;
}

function trailHtml() {
  const xp = getXp();
  return JOURNEY.stops.map((s, i) => {
    const done = stopDone(s, xp);
    const next = !done && (i === 0 || stopDone(JOURNEY.stops[i - 1], xp));
    const cp = stopChapterProgress(s);
    const prog = next ? Math.round(cp.done / cp.total * 100) : 0; // Balken = Kapitel-Szenen, nie Alt-XP
    return `
      <div class="stop ${done ? "done" : ""} ${next ? "next" : ""} ${!done && !next ? "locked" : ""}">
        <div class="stop-dot">${done ? ICONS.check : (i + 1)}</div>
        <div class="stop-body">
          <div class="stop-name">${esc(s.name)} <span class="stop-sub-inline">${esc(s.xp === 0 && !done ? t("trail-arrival") : TX(s, "sub"))}</span></div>
          ${next ? `<div class="progress-track slim"><div class="progress-fill" style="width:${prog}%"></div></div>` : ""}
        </div>
        <div class="stop-xp">${done ? t("trail-reached") : next ? esc(t("trail-scene", { a: Math.min(cp.done + 1, cp.total), b: cp.total })) : esc(t("trail-chapter", { n: CHAPTER_FOR[s.id] + 1 }))}</div>
      </div>`;
  }).join("");
}

/* ---------- Die Nepal-Karte (illustrierte Flat-Vector-Reisekarte) ----------
   Stil-Vorbild: illustrierte Travel-Maps (warmes Creme-Land, Teal-Route,
   Schneegipfel, gezeichnete Wahrzeichen, Wolken/Sonne/Deko). Prinzip bleibt:
   NUMMERN statt Namen, eine durchgehende Catmull-Rom-Route, Fortschritt als
   Terracotta-Overlay auf der Teal-Straße (pathLength-Trick). */

const MAP_STOPS = {
  kathmandu: [216, 150], thamel: [196, 130], swayambhu: [182, 174],
  bhaktapur: [246, 164], nagarkot: [268, 132], pokhara: [124, 118],
  lumbini: [136, 206], chitwan: [210, 206], everest: [348, 112]
};
const MAP_LAND = [[64,88],[110,66],[158,58],[214,66],[262,56],[316,50],[368,62],[404,88],[408,124],[388,152],[348,176],[300,192],[250,214],[196,228],[132,228],[84,216],[58,178],[48,132]];
/* Route = Stopps + unsichtbare Zwischenpunkte (Zahlen), damit der Weg natürlich windet */
const MAP_ROUTE = ["kathmandu", "thamel", "swayambhu", "bhaktapur", "nagarkot", [224,104], [172,106], "pokhara", [98,172], "lumbini", [172,226], "chitwan", [288,196], [338,164], "everest"];

/* Catmull-Rom-Spline -> weicher Pfad (offene Route) */
function routePath(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
/* Catmull-Rom geschlossen -> organische Landeskontur */
function landPath(pts) {
  const n = pts.length;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d + " Z";
}

/* --- Mini-Wahrzeichen (lokale Farben, Grundlinie ca. y=+8) --- */
function pineTree(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <line x1="0" y1="8" x2="0" y2="4.5" stroke="var(--map-trunk)" stroke-width="1.6"/>
    <path d="M 0 -6.5 L 2.8 -2 L 1.4 -2 L 3.8 3.4 L -3.8 3.4 L -1.4 -2 L -2.8 -2 Z" fill="var(--map-tree2)" stroke="var(--map-route)" stroke-width="0.6" stroke-linejoin="round"/>
  </g>`;
}
function roundTree(x, y, s, autumn) {
  const c1 = autumn ? "#E8A54B" : "var(--map-tree)", c2 = autumn ? "#D98C3A" : "var(--map-tree2)";
  return `<g transform="translate(${x},${y}) scale(${s})">
    <line x1="0" y1="8" x2="0" y2="3.5" stroke="var(--map-trunk)" stroke-width="1.8"/>
    <circle cx="-1.8" cy="-0.5" r="4.4" fill="${c1}" stroke="var(--map-route)" stroke-width="0.6"/>
    <circle cx="2.2" cy="-1.6" r="3.6" fill="${c2}" stroke="var(--map-route)" stroke-width="0.6"/>
    <circle cx="0.4" cy="-4.4" r="3.2" fill="${c1}" stroke="var(--map-route)" stroke-width="0.6"/>
  </g>`;
}
function pagodaIcon(x, y) { // Kathmandu: dreistöckige Pagode
  return `<g transform="translate(${x},${y}) scale(1.18)">
    <rect x="-7.5" y="7.4" width="15" height="2.4" rx="1.2" fill="#C9BFA4"/>
    <rect x="-2.6" y="1.5" width="5.2" height="6" fill="#F7EFD8" stroke="#9E4629" stroke-width="0.9"/>
    <path d="M -8.5 2.2 L 0 -1.4 L 8.5 2.2 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M -7 -1.9 L 0 -5 L 7 -1.9 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M -5 -5.9 L 0 -8.6 L 5 -5.9 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8" stroke-linejoin="round"/>
    <line x1="0" y1="-8.6" x2="0" y2="-10.6" stroke="#9E4629" stroke-width="1"/>
    <circle cx="0" cy="-11.2" r="1.1" fill="#E0A83C"/>
  </g>`;
}
function housesIcon(x, y) { // Thamel: zwei Häuser + Gebetsfahnen
  return `<g transform="translate(${x},${y}) scale(1.12)">
    <path d="M 1.5 8 L 1.5 1.5 L 6.5 -1.5 L 11.5 1.5 L 11.5 8 Z" fill="#F7EFD8" stroke="#9E4629" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="M 0 1.5 L 6.5 -2.8 L 13 1.5 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8" stroke-linejoin="round"/>
    <rect x="5.6" y="3.6" width="2.6" height="4.4" fill="#9E4629"/>
    <path d="M -11.5 8 L -11.5 2 L -6.5 -1 L -1.5 2 L -1.5 8 Z" fill="#F2E3C8" stroke="#9E4629" stroke-width="0.9" stroke-linejoin="round"/>
    <path d="M -13 2 L -6.5 -2.3 L 0 2 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M -13.5 -6.5 Q -8 -9.5 -2.5 -6.5" fill="none" stroke="#8B887C" stroke-width="0.7"/>
    <path d="M -12 -6.9 L -9.4 -5.9 L -11.8 -4.9 Z" fill="#3E7FA6"/>
    <path d="M -8.6 -7.6 L -6 -6.6 L -8.4 -5.6 Z" fill="#F7F5EC"/>
    <path d="M -5 -8.2 L -2.4 -7.2 L -4.8 -6.2 Z" fill="#C05B3C"/>
    <path d="M -1.6 -7.4 L 1 -6.4 L -1.4 -5.4 Z" fill="#5F8A4E"/>
  </g>`;
}
function stupaIcon(x, y) { // Swayambhunath: Stupa auf dem Hügel
  return `<g transform="translate(${x},${y}) scale(1.15)">
    <path d="M -13 8 Q 0 0.5 13 8 Z" fill="var(--map-hill)" stroke="#CDBB84" stroke-width="0.7"/>
    <path d="M -6 6.5 A 6 6 0 0 1 6 6.5 Z" fill="#F8F5EC" stroke="#C9C2AF" stroke-width="0.8"/>
    <rect x="-3.2" y="0" width="6.4" height="2.2" rx="0.7" fill="#E0A83C"/>
    <path d="M -1.7 0 L 0 -5.6 L 1.7 0 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
    <circle cx="0" cy="-6.2" r="0.9" fill="#C05B3C"/>
    <path d="M 0.8 -6 L 4.4 -5.1 L 0.8 -4.2 Z" fill="#3E7FA6"/>
  </g>`;
}
function gateIcon(x, y) { // Bhaktapur: rotes Tor
  return `<g transform="translate(${x},${y}) scale(1.15)">
    <rect x="-8.5" y="2.5" width="3.2" height="5.8" fill="#B4593B" stroke="#8E3E2B" stroke-width="0.8"/>
    <rect x="5.3" y="2.5" width="3.2" height="5.8" fill="#B4593B" stroke="#8E3E2B" stroke-width="0.8"/>
    <rect x="-9.5" y="-0.2" width="19" height="2.9" rx="0.9" fill="#B4593B" stroke="#8E3E2B" stroke-width="0.8"/>
    <path d="M -7.5 -0.2 L 0 -5.2 L 7.5 -0.2 Z" fill="#C05B3C" stroke="#8E3E2B" stroke-width="0.8" stroke-linejoin="round"/>
    <rect x="-1.3" y="-7.6" width="2.6" height="2.6" rx="0.5" fill="#D06A48" stroke="#8E3E2B" stroke-width="0.7"/>
  </g>`;
}
function viewpointIcon(x, y) { // Nagarkot: Ridge mit Sonnenaufgang + Kiefern
  return `<g transform="translate(${x},${y})">
    <circle cx="2.5" cy="-3.5" r="3.6" fill="#F2C14E"/>
    <path d="M -12 8 Q 0 -1 12 8 Z" fill="var(--map-hill)" stroke="#CDBB84" stroke-width="0.7"/>
    ${pineTree(-7, 5.5, 0.72)}
    ${pineTree(6.5, 4.5, 0.62)}
  </g>`;
}
function bodhiIcon(x, y) { // Lumbini: Bodhi-Baum + Schrein
  return `<g transform="translate(${x},${y}) scale(1.12)">
    <line x1="-1" y1="8" x2="-1" y2="1.5" stroke="var(--map-trunk)" stroke-width="1.8"/>
    <circle cx="-4.4" cy="-1.8" r="4.8" fill="var(--map-tree)"/>
    <circle cx="2.6" cy="-2.4" r="5.2" fill="var(--map-tree2)"/>
    <circle cx="-0.8" cy="-5.6" r="3.9" fill="var(--map-tree)"/>
    <rect x="5" y="3.4" width="5.4" height="4.8" rx="0.6" fill="#E0A83C" stroke="#B9871F" stroke-width="0.7"/>
    <circle cx="7.7" cy="1.6" r="1.1" fill="#E0A83C" stroke="#B9871F" stroke-width="0.7"/>
  </g>`;
}
function rhinoIcon(x, y) { // Chitwan: Nashorn zwischen Bäumen
  return `<g transform="translate(${x},${y}) scale(1.15)">
    ${roundTree(-11.5, 3.5, 0.78)}
    ${roundTree(11.5, 2.5, 0.7)}
    <path d="M -7 6 L -7 1.5 Q -7 -2.4 -3 -2.8 L 3.6 -2.8 Q 6.2 -2.5 6.8 -0.8 L 6.8 6 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M 6.9 -1.9 L 9.6 -3 L 6.9 -0.6 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="0.6" stroke-linejoin="round"/>
    <line x1="-4.5" y1="6" x2="-4.5" y2="8.2" stroke="#6E6E66" stroke-width="1.4"/>
    <line x1="3.6" y1="6" x2="3.6" y2="8.2" stroke="#6E6E66" stroke-width="1.4"/>
    <circle cx="-6.6" cy="-2.4" r="0.8" fill="#6E6E66"/>
  </g>`;
}
function tentIcon(x, y) { // Everest Base Camp: Zelt
  return `<g transform="translate(${x},${y})">
    <path d="M -6 7.5 L 0 -4.5 L 6 7.5 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.8" stroke-linejoin="round"/>
    <path d="M -1.7 7.5 L 0 4.2 L 1.7 7.5 Z" fill="#B9871F"/>
  </g>`;
}
function tinyHouse(x, y, c) {
  return `<g transform="translate(${x},${y})">
    <rect x="-4.5" y="-1" width="9" height="6" fill="${c}" stroke="#9E4629" stroke-width="0.7"/>
    <path d="M -5.8 -1 L 0 -4.6 L 5.8 -1 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.7" stroke-linejoin="round"/>
  </g>`;
}
function yakIcon(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect x="-6" y="-4" width="12" height="6" rx="3" fill="#8A6A44" stroke="#5C4326" stroke-width="0.7"/>
    <rect x="4.6" y="-5.4" width="4.6" height="4.2" rx="1.6" fill="#8A6A44" stroke="#5C4326" stroke-width="0.7"/>
    <path d="M 6 -5.4 q 1.4 -2.4 2.8 -1" fill="none" stroke="#F2E3C8" stroke-width="1" stroke-linecap="round"/>
    <rect x="-3.4" y="-6.8" width="6.8" height="3" rx="1.2" fill="#C05B3C" stroke="#9E4629" stroke-width="0.6"/>
    <line x1="-3.6" y1="2" x2="-3.6" y2="4.4" stroke="#5C4326" stroke-width="1.1"/>
    <line x1="3.6" y1="2" x2="3.6" y2="4.4" stroke="#5C4326" stroke-width="1.1"/>
  </g>`;
}
function flagString(x1, y1, x2, y2) { // Gebetsfahnen-Schnur mit Durchhang
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 7;
  const cols = ["#3E7FA6", "#F7F5EC", "#C05B3C", "#5F8A4E", "#F2C14E"];
  let s = `<line x1="${x1}" y1="${y1 - 4}" x2="${x1}" y2="${y1 + 2}" class="flagpole"/>
    <line x1="${x2}" y1="${y2 - 4}" x2="${x2}" y2="${y2 + 2}" class="flagpole"/>
    <path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" class="flag-line"/>`;
  for (let i = 0; i < 5; i++) {
    const t = 0.12 + i * 0.19, it = 1 - t;
    const qx = (it * it * x1 + 2 * it * t * mx + t * t * x2).toFixed(1);
    const qy = (it * it * y1 + 2 * it * t * my + t * t * y2).toFixed(1);
    s += `<path d="M ${qx - 2.1} ${qy} L ${Number(qx) + 2.1} ${qy} L ${qx} ${Number(qy) + 3.8} Z" fill="${cols[i]}"/>`;
  }
  return s;
}

/* --- Szenen-Grafiken: Illustrationen im Stil der Landkarte --- */
function sceneArt(kind) {
  const parts = {
    airport: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="52" width="120" height="18" class="sa-ground"/>
      <path d="M 8 60 L 112 60" class="sa-runway-dash"/>
      <rect x="14" y="18" width="9" height="34" rx="2" fill="#E8E3D2" stroke="var(--map-route)" stroke-width="0.8"/>
      <rect x="9.5" y="10" width="18" height="10" rx="2.5" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8"/>
      <rect x="12.5" y="12.5" width="3" height="3" fill="#F2C14E"/><rect x="17.5" y="12.5" width="3" height="3" fill="#F2C14E"/><rect x="22.5" y="12.5" width="3" height="3" fill="#F2C14E"/>
      <line x1="18.5" y1="10" x2="18.5" y2="4" stroke="#8B887C" stroke-width="1"/>
      <circle cx="18.5" cy="3.2" r="1.2" fill="#C05B3C"/>
      <g transform="translate(74,30)">
        <path d="M -22 8 Q -20 -2 -8 -3 L 14 -3 Q 24 -2 26 4 Q 20 9 6 9 L -14 9 Q -20 9 -22 8 Z" fill="#F7F5EC" stroke="var(--map-route)" stroke-width="0.9"/>
        <path d="M 12 -2.6 L 22 -9 L 26 -8.4 L 20 -2.4 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.6"/>
        <path d="M -4 -3 L 2 -10 L 6 -9.5 L 3 -3 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.6"/>
        <circle cx="-12" cy="9" r="3.4" fill="#3A3A34" stroke="#C9C2AF" stroke-width="0.8"/>
        <circle cx="12" cy="9" r="3.4" fill="#3A3A34" stroke="#C9C2AF" stroke-width="0.8"/>
        <circle cx="-8" cy="0" r="0.8" fill="#8FB5C0"/><circle cx="-4" cy="0" r="0.8" fill="#8FB5C0"/><circle cx="0" cy="0" r="0.8" fill="#8FB5C0"/><circle cx="4" cy="0" r="0.8" fill="#8FB5C0"/><circle cx="8" cy="0" r="0.8" fill="#8FB5C0"/>
      </g>`,
    money: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <rect x="18" y="30" width="60" height="18" rx="2" fill="#C05B3C" stroke="#9E4629" stroke-width="0.9"/>
      <rect x="13" y="24" width="70" height="8" rx="2" fill="#D06A48" stroke="#9E4629" stroke-width="0.8"/>
      <text x="48" y="30.5" class="sa-dev sa-sign">रु</text>
      <rect x="14" y="47" width="6" height="8" fill="#9E4629"/><rect x="76" y="47" width="6" height="8" fill="#9E4629"/>
      <g transform="translate(86,40) rotate(-8)">
        <rect x="0" y="0" width="26" height="14" rx="2" fill="#7FA05C" stroke="#55793F" stroke-width="0.8"/>
        <circle cx="13" cy="7" r="4" fill="none" stroke="#F2E3C8" stroke-width="0.9"/>
      </g>
      <g transform="translate(80,50) rotate(6)">
        <rect x="0" y="0" width="26" height="14" rx="2" fill="#8FB071" stroke="#55793F" stroke-width="0.8"/>
        <circle cx="13" cy="7" r="4" fill="none" stroke="#F2E3C8" stroke-width="0.9"/>
      </g>
      <circle cx="40" cy="52" r="4.4" fill="#F2C14E" stroke="#D9A63B" stroke-width="0.8"/>
      <circle cx="48" cy="53.4" r="4.4" fill="#E8B23C" stroke="#D9A63B" stroke-width="0.8"/>
      <circle cx="44" cy="48.4" r="4.4" fill="#F5CB60" stroke="#D9A63B" stroke-width="0.8"/>`,
    directions: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="42" width="120" height="28" class="sa-ground"/>
      <path d="M -4 68 C 30 52 90 52 124 68 L 124 72 L -4 72 Z" fill="#5E5A4E"/>
      <path d="M 10 62.5 q 12 -3 24 0 M 44 59.5 q 12 -3 24 0 M 78 59.5 q 12 -3 24 0" fill="none" stroke="#F2E3C8" stroke-width="1.1"/>
      <line x1="46" y1="16" x2="46" y2="44" stroke="#8A6A44" stroke-width="2"/>
      <path d="M 46 18 L 20 18 L 20 10 L 46 12 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.7"/>
      <path d="M 46 26 L 74 26 L 74 18 L 46 20 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.7"/>
      <g transform="translate(92,36)"><path d="M 0 8 L 0 4 L 3 1 L 6 4 L 6 8 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.6"/></g>
      <circle cx="10" cy="40" r="4.6" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.6"/>
      <line x1="10" y1="45" x2="10" y2="50" stroke="var(--map-trunk)" stroke-width="1.4"/>`,
    taxi: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="50" width="120" height="20" class="sa-ground"/>
      <rect x="0" y="56" width="120" height="14" fill="#5E5A4E"/>
      <path d="M 12 62.5 q 12 -3 24 0 M 46 62.5 q 12 -3 24 0 M 80 62.5 q 12 -3 24 0" fill="none" stroke="#F2E3C8" stroke-width="1.1"/>
      <g transform="translate(44,28)">
        <path d="M -26 22 L -24 12 Q -22 8 -16 7 L -8 6 L -2 -2 Q 0 -5 5 -5 L 16 -5 Q 21 -5 23 -1 L 26 7 L 27 12 Q 28 18 24 22 Z" fill="#D06A48" stroke="#9E4629" stroke-width="1"/>
        <path d="M -8 6 L -3 -1.6 L 5 -1.6 L 8 6 Z" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="-6" y="-9.5" width="12" height="4.5" rx="1.2" fill="#F2C14E" stroke="#B9871F" stroke-width="0.7"/>
        <text x="0" y="-6.4" class="sa-taxi">TAXI</text>
        <circle cx="-14" cy="22" r="4.6" fill="#3A3A34" stroke="#C9C2AF" stroke-width="1"/>
        <circle cx="14" cy="22" r="4.6" fill="#3A3A34" stroke="#C9C2AF" stroke-width="1"/>
        <circle cx="-14" cy="22" r="1.7" fill="#C9C2AF"/><circle cx="14" cy="22" r="1.7" fill="#C9C2AF"/>
        <circle cx="-19" cy="12" r="1.3" fill="#F2C14E"/><circle cx="19" cy="12" r="1.3" fill="#F2C14E"/>
      </g>
      <g transform="translate(96,40)">
        <rect x="-6" y="4" width="12" height="9" rx="1.5" fill="#8A6A44" stroke="#5C4326" stroke-width="0.8"/>
        <line x1="0" y1="4" x2="0" y2="-4" stroke="#5C4326" stroke-width="1"/>
        <path d="M -5 -4 L 5 -4 L 3.4 -8 L -3.4 -8 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.6"/>
      </g>`,
    cafe: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <rect x="16" y="26" width="66" height="24" rx="3" fill="#F2E3C8" stroke="var(--map-route)" stroke-width="1"/>
      <path d="M 13 26 L 49 14 L 85 26 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.9"/>
      <rect x="22" y="32" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
      <rect x="36" y="32" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
      <rect x="50" y="32" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
      <rect x="64" y="32" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
      <circle cx="49" cy="11" r="2.2" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
      <line x1="49" y1="9" x2="49" y2="6" stroke="#B9871F" stroke-width="0.8"/>
      <g transform="translate(92,40)">
        <ellipse cx="0" cy="0" rx="13" ry="4.5" fill="#F7F5EC" stroke="var(--map-route)" stroke-width="0.8"/>
        <rect x="-9" y="-6.5" width="18" height="6.5" rx="2" fill="#FFF" stroke="var(--map-route)" stroke-width="0.8"/>
        <path d="M -9 -6.5 q 4.5 -3 9 0 q 4.5 3 9 0" fill="none" stroke="#C9C2AF" stroke-width="0.7"/>
        <path d="M 0 6 q -4 6 -9 6" fill="none" stroke="#8FB5C0" stroke-width="1.1" opacity=".7"/>
      </g>
      <g transform="translate(30,58)">
        <rect x="-8" y="-1" width="16" height="2.6" rx="1.2" fill="#8A6A44"/>
        <rect x="-6" y="-6" width="12" height="5" rx="1" fill="#D06A48" stroke="#9E4629" stroke-width="0.6"/>
      </g>`,
    bazar: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <line x1="20" y1="6" x2="20" y2="44" stroke="#8A6A44" stroke-width="2"/>
      <line x1="92" y1="6" x2="92" y2="44" stroke="#8A6A44" stroke-width="2"/>
      <path d="M 16 10 L 56 10 L 52 18 L 20 18 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8"/>
      <path d="M 56 10 L 96 10 L 96 18 L 52 18 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.8"/>
      <path d="M 24 10 q 4 4 8 0 q 4 -4 8 0 q 4 4 8 0" fill="none" stroke="#F2E3C8" stroke-width="1"/>
      <path d="M 64 10 q 4 4 8 0 q 4 -4 8 0 q 4 4 8 0" fill="none" stroke="#F2E3C8" stroke-width="1"/>
      <rect x="22" y="30" width="68" height="16" rx="2" fill="#F2E3C8" stroke="var(--map-route)" stroke-width="0.9"/>
      <circle cx="34" cy="36" r="3.4" fill="#E8A54B" stroke="#B9871F" stroke-width="0.7"/>
      <circle cx="43" cy="38" r="3" fill="#D98C3A" stroke="#B9871F" stroke-width="0.7"/>
      <rect x="52" y="32" width="12" height="8" rx="1.5" fill="#7FA05C" stroke="#55793F" stroke-width="0.7"/>
      <rect x="68" y="33" width="14" height="4" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.6"/>
      <rect x="68" y="39" width="14" height="4" rx="1" fill="#C05B3C" stroke="#9E4629" stroke-width="0.6"/>
      <circle cx="100" cy="46" r="4.4" fill="#F2C14E" stroke="#D9A63B" stroke-width="0.8"/>
      <circle cx="108" cy="49" r="4.4" fill="#E8B23C" stroke="#D9A63B" stroke-width="0.8"/>`,
    stupa: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="48" width="120" height="22" class="sa-ground"/>
      <path d="M 0 60 L 120 60" class="sa-runway-dash"/>
      <path d="M 34 58 L 50 44 L 66 58 Z" fill="var(--map-hill)" stroke="#CDBB84" stroke-width="0.7"/>
      <path d="M 60 58 L 76 46 L 94 58 Z" fill="var(--map-hill)" stroke="#CDBB84" stroke-width="0.7"/>
      <g transform="translate(55,20)">
        <path d="M -13 22 Q 0 14 13 22 Z" fill="var(--map-hill)" stroke="#CDBB84" stroke-width="0.7"/>
        <path d="M -11 21 A 11 11 0 0 1 11 21 Z" fill="#F8F5EC" stroke="#C9C2AF" stroke-width="0.9"/>
        <rect x="-5.5" y="4" width="11" height="4" rx="1.2" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
        <path d="M -2.6 4 L 0 -9 L 2.6 4 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
        <circle cx="0" cy="-9.8" r="1.4" fill="#C05B3C"/>
        <path d="M 1.2 -9.4 L 6.4 -8 L 1.2 -6.6 Z" fill="#3E7FA6"/>
        <rect x="-6.5" y="-1.5" width="13" height="3.4" rx="1" fill="#C05B3C" stroke="#9E4629" stroke-width="0.5"/>
        <path d="M -3.2 -0.6 q 3.2 1.6 6.4 0" fill="none" stroke="#F2E3C8" stroke-width="0.6"/>
        <path d="M -3.2 1 q 3.2 1.6 6.4 0" fill="none" stroke="#F2E3C8" stroke-width="0.6"/>
      </g>
      <g transform="translate(88,36)">
        <circle cx="0" cy="-1" r="3.2" fill="#8A6A44"/>
        <ellipse cx="0" cy="3" rx="4.5" ry="3" fill="#8A6A44"/>
        <path d="M -3.4 -3.4 q -1.4 -2.4 -2.8 -1" fill="none" stroke="#F2E3C8" stroke-width="0.8"/>
        <path d="M 3.4 -3.4 q 1.4 -2.4 2.8 -1" fill="none" stroke="#F2E3C8" stroke-width="0.8"/>
        <line x1="-2.6" y1="6" x2="-2.6" y2="9" stroke="#5C4326" stroke-width="1"/>
        <line x1="2.6" y1="6" x2="2.6" y2="9" stroke="#5C4326" stroke-width="1"/>
      </g>
      <path d="M 18 12 q 2.4 -2.8 4.8 0 M 22.8 12 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>
      <path d="M 14 30 L 14 46 M 22 30 L 22 46 M 30 30 L 30 46" stroke="#F2C14E" stroke-width="0.9"/>
      <path d="M 14 30 Q 22 26 30 30" fill="none" stroke="#8B887C" stroke-width="0.5"/>
      <path d="M 13 31 L 17 30.4 L 16.6 33.4 Z" fill="#C05B3C"/>
      <path d="M 22 27.6 L 26 27.2 L 25.6 30 Z" fill="#F7F5EC"/>
      <path d="M 31 30.4 L 35 31.4 L 34 34 Z" fill="#5F8A4E"/>`,
    oldtown: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="48" width="120" height="22" class="sa-ground"/>
      <g transform="translate(28,10)">
        <rect x="0" y="10" width="30" height="40" rx="2" fill="#E8B48E" stroke="#9E4629" stroke-width="0.9"/>
        <path d="M -3 10 L 15 0 L 33 10 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.9"/>
        <rect x="4" y="18" width="7" height="7" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.6"/>
        <rect x="19" y="18" width="7" height="7" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.6"/>
        <rect x="4" y="30" width="7" height="7" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.6"/>
        <rect x="19" y="30" width="7" height="7" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.6"/>
        <rect x="11" y="34" width="9" height="16" rx="1.5" fill="#9E4629"/>
      </g>
      <g transform="translate(70,14)">
        <rect x="-4" y="0" width="8" height="38" fill="#E8B48E" stroke="#9E4629" stroke-width="0.8"/>
        <rect x="16" y="0" width="8" height="38" fill="#E8B48E" stroke="#9E4629" stroke-width="0.8"/>
        <rect x="-8" y="-5" width="36" height="6" rx="1.5" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8"/>
        <path d="M -6 -5 L 10 -14 L 26 -5 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.8"/>
        <rect x="-2" y="-20" width="4" height="7" rx="1" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
      </g>
      <g transform="translate(98,44)">
        <circle cx="0" cy="4" r="5.5" fill="none" stroke="#8A6A44" stroke-width="1.4"/>
        <path d="M -4 4 q 4 -2 8 0" fill="none" stroke="#8A6A44" stroke-width="0.9"/>
        <circle cx="0" cy="-3" r="2.6" fill="#8A6A44"/>
      </g>
      <circle cx="14" cy="46" r="4.2" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.6"/>
      <line x1="14" y1="50" x2="14" y2="55" stroke="var(--map-trunk)" stroke-width="1.3"/>`,
    sunset: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <circle cx="84" cy="20" r="9" fill="#F2C14E" opacity=".85"/>
      <path d="M 60 30 q 4 -5 8 0 M 70 26 q 4 -5 8 0" fill="none" stroke="#F2E3C8" stroke-width="1" opacity=".8"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <path d="M 8 48 L 30 34 L 52 48 Z" fill="#C4A484" stroke="#9E8468" stroke-width="0.7"/>
      <path d="M 26 48 L 52 30 L 78 48 Z" fill="#D9B77E" stroke="#B99B62" stroke-width="0.7"/>
      <path d="M 58 48 L 82 33 L 106 48 Z" fill="#C4A484" stroke="#9E8468" stroke-width="0.7"/>
      <path d="M 44 36 L 52 30 L 56 34 L 50 38 Z" fill="#FFF"/>
      <g transform="translate(22,34)">
        <rect x="0" y="6" width="16" height="14" rx="1.5" fill="#F2E3C8" stroke="var(--map-route)" stroke-width="0.8"/>
        <path d="M -2 6 L 8 0 L 18 6 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.7"/>
        <rect x="4" y="10" width="4" height="4" rx="0.6" fill="#F2C14E"/>
        <rect x="10" y="10" width="4" height="4" rx="0.6" fill="#F2C14E"/>
      </g>
      <g transform="translate(44,38)">
        <rect x="0" y="8" width="12" height="12" rx="1.5" fill="#E8B48E" stroke="#9E4629" stroke-width="0.7"/>
        <path d="M -2 8 L 6 2 L 14 8 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.6"/>
        <line x1="6" y1="2" x2="6" y2="-2" stroke="#9E4629" stroke-width="0.8"/>
        <path d="M 6 -2 L 10 -1 L 6 0 Z" fill="#E0A83C"/>
      </g>`,
    sunrise: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <circle cx="62" cy="34" r="10" fill="#F2C14E" opacity=".9"/>
      <path d="M 40 38 q 4 -5 8 0 M 74 34 q 4 -5 8 0" fill="none" stroke="#F2E3C8" stroke-width="1"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <path d="M -2 48 L 24 28 L 50 48 Z" fill="#D9B77E" stroke="#B99B62" stroke-width="0.7"/>
      <path d="M 18 48 L 48 24 L 78 48 Z" fill="#C4A484" stroke="#9E8468" stroke-width="0.7"/>
      <path d="M 34 48 L 66 22 L 98 48 Z" fill="#E5C896" stroke="#C4A484" stroke-width="0.7"/>
      <path d="M 44 34 L 48 24 L 54 30 L 58 20 L 62 32 L 66 27 L 70 36 Z" fill="#FFF"/>
      <g transform="translate(16,36)">
        <circle cx="0" cy="0" r="2.6" fill="#8A6A44"/>
        <path d="M -3 3 L 0 12 L 3 3 Z" fill="#C05B3C"/>
        <circle cx="9" cy="0.4" r="2.6" fill="#8A6A44"/>
        <path d="M 6 3.4 L 9 12.4 L 12 3.4 Z" fill="#8FB5C0"/>
      </g>
      <path d="M 96 12 q 2.4 -2.8 4.8 0 M 100.8 12 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>`,
    lake: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <path d="M 0 34 L 28 14 L 54 34 Z" fill="#C4A484" stroke="#9E8468" stroke-width="0.7"/>
      <path d="M 40 34 L 68 10 L 96 34 Z" fill="#D9B77E" stroke="#B99B62" stroke-width="0.7"/>
      <path d="M 58 32 L 84 16 L 110 34 Z" fill="#E5C896" stroke="#C4A484" stroke-width="0.7"/>
      <path d="M 62 24 L 68 16 L 74 24 Z M 64 20 L 68 16 L 72 20 Z" fill="#FFF"/>
      <rect x="0" y="38" width="120" height="32" rx="6" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.8"/>
      <path d="M 8 46 q 5 -1.6 10 0 M 26 52 q 5 -1.6 10 0 M 90 46 q 5 -1.6 10 0 M 70 58 q 5 -1.6 10 0" fill="none" stroke="#5D9AA6" stroke-width="0.8"/>
      <path d="M 20 38 L 100 38" stroke="#5D9AA6" stroke-width="0.6" opacity=".5"/>
      <g transform="translate(58,34)">
        <path d="M -12 4 L 12 4 L 8 0 L -8 0 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.7"/>
        <line x1="0" y1="0" x2="0" y2="-8" stroke="#6E4A32" stroke-width="0.9"/>
        <path d="M 0.8 0 L 0.8 -7 L 6.5 -0.8 Z" fill="#F7F5EC" stroke="#C9C2AF" stroke-width="0.4"/>
        <path d="M -4.5 -8 q 4 3 8 0" fill="none" stroke="#8A6A44" stroke-width="1.4"/>
      </g>
      <path d="M 14 26 q 2.4 -2.8 4.8 0 M 18.8 26 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>`,
    lotus: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="44" width="120" height="26" class="sa-ground"/>
      <g transform="translate(30,14)">
        <circle cx="8" cy="12" r="11" fill="var(--map-tree2)" stroke="var(--map-route)" stroke-width="0.7"/>
        <circle cx="0" cy="17" r="8" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.7"/>
        <circle cx="17" cy="17" r="8" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.7"/>
        <line x1="8" y1="23" x2="8" y2="34" stroke="var(--map-trunk)" stroke-width="1.8"/>
      </g>
      <rect x="52" y="36" width="56" height="16" rx="8" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.8"/>
      <path d="M 60 40 q 4 -1.4 8 0 M 78 44 q 4 -1.4 8 0 M 92 39 q 4 -1.4 8 0" fill="none" stroke="#5D9AA6" stroke-width="0.7"/>
      <g transform="translate(66,34)">
        <path d="M 0 2 q -6 -2 -7 -6 q 5 -1 7 2 q 1 -5 6 -5 q 1 5 -2 7 q 5 -1 7 3 q -5 3 -8 0 Z" fill="#E8A54B" stroke="#B9871F" stroke-width="0.5"/>
      </g>
      <g transform="translate(92,32)">
        <path d="M 0 2 q -5 -2 -6 -5 q 4 -1 6 2 q 1 -4 5 -4 q 1 4 -2 6 q 4 -1 6 2 q -4 3 -7 0 Z" fill="#F2C14E" stroke="#B9871F" stroke-width="0.5"/>
      </g>
      <g transform="translate(50,20)">
        <rect x="0" y="8" width="7" height="20" rx="1" fill="#E8B48E" stroke="#9E4629" stroke-width="0.7"/>
        <path d="M -3 8 L 3.5 1 L 10 8 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.7"/>
        <rect x="1.4" y="12" width="4.2" height="4.2" rx="0.5" fill="#8FB5C0"/>
      </g>
      <path d="M 20 12 q 2.4 -2.8 4.8 0 M 24.8 12 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>`,
    jungle: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="40" width="120" height="30" class="sa-ground"/>
      <rect x="0" y="40" width="120" height="30" fill="var(--map-green2)"/>
      <g transform="translate(14,20)">
        <line x1="0" y1="20" x2="0" y2="10" stroke="var(--map-trunk)" stroke-width="1.8"/>
        <path d="M 0 -8 L 4 -2 L 2 -2 L 5.5 4 L -5.5 4 L -2 -2 L -4 -2 Z" fill="var(--map-tree2)" stroke="var(--map-route)" stroke-width="0.6"/>
      </g>
      <g transform="translate(104,22) scale(0.8)">
        <line x1="0" y1="20" x2="0" y2="10" stroke="var(--map-trunk)" stroke-width="1.8"/>
        <path d="M 0 -8 L 4 -2 L 2 -2 L 5.5 4 L -5.5 4 L -2 -2 L -4 -2 Z" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.6"/>
      </g>
      <g transform="translate(56,30)">
        <path d="M -18 18 Q -20 4 -8 2 L 12 2 Q 22 4 22 12 Q 20 18 12 18 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="1" stroke-linejoin="round"/>
        <path d="M 21.5 3.5 L 26 1 L 21.8 0.4 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="0.6"/>
        <path d="M -14 18 L -14 22 M 14 18 L 14 22" stroke="#6E6E66" stroke-width="1.3"/>
        <circle cx="-16" cy="-1" r="1" fill="#6E6E66"/>
      </g>
      <g transform="translate(24,36)">
        <ellipse cx="0" cy="0" rx="10" ry="6.5" fill="#8A8A82" stroke="#6E6E66" stroke-width="0.9"/>
        <rect x="7" y="-4" width="7" height="5" rx="2" fill="#8A8A82" stroke="#6E6E66" stroke-width="0.7"/>
        <line x1="13.5" y1="-4" x2="16.5" y2="-7" stroke="#8A8A82" stroke-width="1.4"/>
        <circle cx="10" cy="-2" r="0.8" fill="#4A4A44"/>
        <rect x="-7" y="-9" width="14" height="5" rx="2" fill="none" stroke="#6E6E66" stroke-width="0.7"/>
        <line x1="-6" y1="5" x2="-6" y2="9" stroke="#6E6E66" stroke-width="1.2"/>
        <line x1="4" y1="5" x2="4" y2="9" stroke="#6E6E66" stroke-width="1.2"/>
      </g>
      <path d="M 66 14 q 2.4 -2.8 4.8 0 M 70.8 14 q 2.4 -2.8 4.8 0 M 88 10 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>
      <g transform="translate(90,50)">
        <path d="M -5 3 L 4 1 M -5 1 L 4 3" fill="none" stroke="#8A6A44" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M 0 -5 C 1.6 -3 2 -1.5 0 0 C -2 -1.5 -1.6 -3 0 -5 Z" fill="#F2C14E"/>
      </g>`,
    summit: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="46" width="120" height="24" class="sa-ground"/>
      <rect x="0" y="46" width="120" height="24" fill="var(--map-high)"/>
      <path d="M 14 62 L 44 16 L 74 62 Z" fill="#C4A484" stroke="#9E8468" stroke-width="0.8"/>
      <path d="M 44.5 62 L 74 16.5 L 104 62 Z" fill="#D9B77E" stroke="#B99B62" stroke-width="0.8"/>
      <path d="M 36 34 L 44 16 L 54 32 L 60 22 L 66 34 L 58 38 L 48 36 Z" fill="#FFF"/>
      <path d="M 70 30 L 74 16.5 L 82 32 L 88 26 L 92 36 Z" fill="#FFF"/>
      <line x1="30" y1="4" x2="30" y2="26" stroke="#8B887C" stroke-width="0.9"/>
      <line x1="58" y1="0" x2="58" y2="20" stroke="#8B887C" stroke-width="0.9"/>
      <path d="M 30 26 Q 36 28 42 24" fill="none" stroke="#8B887C" stroke-width="0.6"/>
      <path d="M 30 4 Q 44 12 58 6 Q 72 0 86 8 Q 100 14 112 10" fill="none" stroke="#8B887C" stroke-width="0.6"/>
      <path d="M 26 8 L 34 10.4 L 26 12.6 Z" fill="#C05B3C"/>
      <path d="M 54 3 L 62 5.4 L 54 7.6 Z" fill="#3E7FA6"/>
      <path d="M 78 4 L 86 6.4 L 78 8.6 Z" fill="#F7F5EC"/>
      <path d="M 98 9 L 106 11.4 L 98 13.6 Z" fill="#5F8A4E"/>
      <g transform="translate(20,50)">
        <path d="M -8 10 L 0 -6 L 8 10 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.8"/>
        <path d="M -2 10 L 0 3 L 2 10 Z" fill="#B9871F"/>
      </g>
      <path d="M 88 12 q 2.4 -2.8 4.8 0 M 92.8 12 q 2.4 -2.8 4.8 0" fill="none" stroke="#5C7A80" stroke-width="0.9"/>`,
    hotel: `
      <rect x="0" y="0" width="120" height="70" rx="10" class="sa-sky"/>
      <ellipse cx="60" cy="63" rx="58" ry="8" class="sa-shadow"/>
      <rect x="0" y="50" width="120" height="20" class="sa-ground"/>
      <g transform="translate(26,8)">
        <rect x="0" y="6" width="52" height="44" rx="2" fill="#F2E3C8" stroke="var(--map-route)" stroke-width="1"/>
        <path d="M -3 6 L 26 -4 L 55 6 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.9"/>
        <rect x="26" y="-11" width="26" height="8" rx="2" fill="#E0A83C" stroke="#B9871F" stroke-width="0.8"/>
        <text x="39" y="-5.2" class="sa-hotel">HOTEL</text>
        <rect x="6" y="14" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="21.5" y="14" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="37" y="14" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="6" y="28" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="37" y="28" width="9" height="9" rx="1" fill="#8FB5C0" stroke="#5D9AA6" stroke-width="0.7"/>
        <rect x="21" y="26" width="10" height="20" rx="1.5" fill="#C05B3C" stroke="#9E4629" stroke-width="0.8"/>
        <circle cx="28.6" cy="36" r="0.9" fill="#F2C14E"/>
        <path d="M 17 46 L 35 46 L 35 50 L 17 50 Z" fill="#D06A48"/>
        <path d="M 17 48 q 4.5 -2 9 0 q 4.5 2 9 0" fill="none" stroke="#F2E3C8" stroke-width="1.2"/>
      </g>
      <g transform="translate(92,44)">
        <rect x="-6" y="3" width="12" height="8" rx="1.5" fill="#8A6A44" stroke="#5C4326" stroke-width="0.8"/>
        <line x1="0" y1="3" x2="0" y2="-4" stroke="#5C4326" stroke-width="1"/>
        <path d="M -5 -4 L 5 -4 L 3.4 -8 L -3.4 -8 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.6"/>
      </g>
      <circle cx="14" cy="44" r="5" fill="var(--map-tree)" stroke="var(--map-route)" stroke-width="0.6"/>
      <line x1="14" y1="49" x2="14" y2="54" stroke="var(--map-trunk)" stroke-width="1.4"/>`
  };
  if (!parts[kind]) return "";
  return `<div class="scene-art" aria-hidden="true"><svg viewBox="0 0 120 70">${parts[kind]}</svg></div>`;
}

/* --- Karten-Rendering --- */
function mapHtml() {
  const xp = state.demoXp != null ? state.demoXp : getXp();
  const stops = JOURNEY.stops;
  const land = landPath(MAP_LAND);
  const route = routePath(MAP_ROUTE.map(p => typeof p === "string" ? MAP_STOPS[p] : p));
  const jp = journeySceneProgress();
  const progress = Math.min(100, Math.round(jp.done / jp.total * 100)); // Route = gemeisterte Szenen

  /* Bergketten: Annapurna-Gruppe über Pokhara + Hauptkamm mit Everest */
  const peaks = [
    [112, 94, 13], [140, 94, 15], [156, 88, 19], [172, 94, 15],
    [278, 98, 17], [300, 86, 21], [326, 76, 24], [378, 82, 20], [396, 98, 13]
  ].map(([x, y, h]) => {
    const w = h * 0.86;
    return `<path d="M ${x - w} ${y} L ${x} ${y - h} L ${x + w} ${y} Z" class="peak"/>
      <path d="M ${x + 1} ${y} L ${x + w} ${y} L ${x} ${y - h} Z" class="peak-shade"/>
      <path d="M ${x - w} ${y} L ${x} ${y - h} L ${x - 2} ${y} Z" class="peak-lit"/>
      <path d="M ${x - w * 0.52} ${y - h * 0.36} L ${x - w * 0.26} ${y - h * 0.66} L ${x - w * 0.08} ${y - h * 0.46} L ${x + w * 0.14} ${y - h * 0.74} L ${x + w * 0.4} ${y - h * 0.4} L ${x + w * 0.22} ${y - h * 0.52} L ${x} ${y - h * 0.32} L ${x - w * 0.24} ${y - h * 0.5} Z" class="peak-snow"/>
      <path d="M ${x} ${y - h + 1.5} L ${x + w * 0.18} ${y - h * 0.62}" class="peak-ridge"/>`;
  }).join("");
  const everestPeak = `
    <path d="M 324 114 L 352 62 L 380 114 Z" class="peak"/>
    <path d="M 353 114 L 380 114 L 352 62 Z" class="peak-shade"/>
    <path d="M 340.5 87 L 345 79.5 L 349 84.5 L 353.5 75.5 L 358 82 L 362 77 L 366.5 88.5 L 361 85.5 L 356 89.5 L 352 84.5 L 347 90 L 343.5 86.5 Z" class="peak-snow"/>
    <line x1="352" y1="62" x2="352" y2="55.5" stroke="#8B887C" stroke-width="1"/>
    <path d="M 352 55.5 L 358 57.2 L 352 58.9 Z" fill="#C05B3C"/>
    <path d="M 352 58.9 L 357 60.3 L 352 61.7 Z" fill="#3E7FA6"/>`;

  const nodes = stops.map((st, i) => {
    const [x, y] = MAP_STOPS[st.id];
    const done = stopDone(st, xp);
    const next = !done && (i === 0 || stopDone(stops[i - 1], xp));
    const cp = stopChapterProgress(st);
    const tip = `${i + 1} · ${st.name} · ${TX(st, "sub")}${done ? " · " + t("trail-reached") : " · " + t("trail-chapter", { n: CHAPTER_FOR[st.id] + 1 }) + " · " + t("trail-scene", { a: Math.min(cp.done + 1, cp.total), b: cp.total })}`;
    return `
      ${next ? `<circle cx="${x}" cy="${y}" r="17" class="pulse-ring"/>` : ""}
      <ellipse cx="${x}" cy="${y + 10}" rx="5.5" ry="1.7" class="pin-shadow"/>
      <circle cx="${x}" cy="${y}" r="10.8" class="pin-halo"/>
      ${i === stops.length - 1 ? `<circle cx="${x}" cy="${y}" r="11.6" class="pin-goal"/>` : ""}
      <g class="lm ${done || next ? "" : "locked"}"><title>${esc(tip)}</title>${landmarkFor(st.id, x, y)}</g>
      <circle cx="${x}" cy="${y}" r="8.5" class="stop-node ${done ? "done" : ""} ${next ? "next" : "locked"}"><title>${esc(tip)}</title></circle>
      <text x="${x}" y="${y + 3.6}" class="map-num ${done ? "done" : ""} ${next ? "next" : ""}">${i + 1}</text>
    `;
  }).join("");

  return `
    <div class="map-hero">
      <svg viewBox="15 0 404 300" role="img" aria-label="${t("map-aria")}">
        <defs>
          <clipPath id="npl">${`<path d="${land}"/>`}</clipPath>
          <pattern id="landdots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="var(--map-land-line)"/>
          </pattern>
        </defs>
        <rect x="15" width="404" height="300" rx="14" class="map-sky"/>
        <g class="sun" transform="translate(40,46)">
          <circle r="11.5" class="sun-body"/>
          ${[0,45,90,135,180,225,270,315].map(a => `<line x1="0" y1="-15" x2="0" y2="-21" transform="rotate(${a})" class="sun-ray"/>`).join("")}
        </g>
        <path d="M 320 44 q 6 -9 16 -7 q 4 -7 13 -5 q 10 2 8 11 q -1 5 -7 5 l -24 0 q -7 0 -6 -4 Z" class="cloud"/>
        <path d="M 240 26 q 5 -8 14 -6 q 3.5 -6 11.5 -4.5 q 9 2 7 10 q -1 4.5 -6 4.5 l -21 0 q -6.5 0 -5.5 -4 Z" class="cloud small"/>
        <path d="M 74 30 q 4.5 -7 12.5 -5.5 q 3 -5.5 10.5 -4 q 8 1.8 6.5 9 q -1 4 -5.5 4 l -19 0 q -5.5 0 -4.5 -3.5 Z" class="cloud small"/>
        <path d="M 70 12 q 4 -5.5 11 -4 q 3 -4 9 -2.5 q 6.5 1.5 5 7.5 q -1 3 -4.5 3 l -15 0 q -4.5 0 -4.5 -4 Z" class="cloud tiny"/>
        <path d="M 283 13 q 2.2 -2.6 4.4 0 M 287.4 13 q 2.2 -2.6 4.4 0" class="birds"/>
        <path d="M 372 52 q 4 -6 11 -4.5 q 3 -4.5 9 -3 q 7 1.5 5.5 8 q -1 3.5 -5 3.5 l -16.5 0 q -5 0 -4 -4 Z" class="cloud tiny"/>
        <path d="M 199 40 q 3 -4.5 8.5 -3.5 q 2.5 -3.5 7.5 -2.5 q 5.5 1.5 4 6.5 l -14.5 0 q -5.5 0 -5.5 -0.5 Z" class="cloud tiny"/>
        <g class="birds">
          <path d="M 206 33 q 2.5 -3 5 0 M 211 33 q 2.5 -3 5 0"/>
          <path d="M 224 26 q 2 -2.4 4 0 M 228 26 q 2 -2.4 4 0"/>
          <path d="M 292 27 q 2.2 -2.6 4.4 0 M 296.4 27 q 2.2 -2.6 4.4 0"/>
          <path d="M 303 40 q 2.4 -2.8 4.8 0 M 307.8 40 q 2.4 -2.8 4.8 0 M 298 45 q 2.4 -2.8 4.8 0"/>
        </g>
        <path d="M 384 46 q 4 -6 11 -4.5 q 3 -4.5 9 -3 q 7 1.5 5.5 8 q -1 3.5 -5 3.5 l -16.5 0 q -5 0 -4 -4 Z" class="cloud tiny"/>
        <path d="M 396 28 q 2.4 -2.8 4.8 0 M 400.8 28 q 2.4 -2.8 4.8 0 M 391 22 q 2.4 -2.8 4.8 0" class="birds"/>
        <g transform="translate(424,52) rotate(12) scale(0.75)" class="plane">
          <path d="M -7 -0.5 L 5 -0.5 L 7.5 -2 L -4 -2 Z" fill="#FBF6E9" stroke="#8B887C" stroke-width="0.6"/>
          <path d="M -1 -2 L 2 -2 L 3.6 -5.4 L 0.6 -5.4 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.5"/>
        </g>
        <g transform="translate(374,32) rotate(-8)" class="plane">
          <path d="M -7 -0.5 L 5 -0.5 L 7.5 -2 L -4 -2 Z" fill="#FBF6E9" stroke="#8B887C" stroke-width="0.6"/>
          <path d="M -1 -2 L 2 -2 L 3.6 -5.4 L 0.6 -5.4 Z" fill="#C05B3C" stroke="#9E4629" stroke-width="0.5"/>
          <path d="M -2.5 -2 L 0.5 -2 L -1 1.5 L -3.8 1.5 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.5"/>
        </g>
        <path d="${land}" transform="translate(0,7)" class="land-shadow"/>
        <path d="${land}" class="land"/>
        <g clip-path="url(#npl)">
          <path d="M 40 70 C 120 52 200 66 260 58 C 320 50 370 58 410 80 L 410 130 C 360 118 320 112 280 118 C 240 124 200 112 160 104 C 120 96 80 92 40 100 Z" class="highland"/>
          <ellipse cx="170" cy="150" rx="70" ry="20" class="hillzone"/>
          <ellipse cx="280" cy="155" rx="75" ry="22" class="hillzone"/>
          <ellipse cx="90" cy="160" rx="45" ry="15" class="hillzone"/>
          <path d="M 40 192 C 120 182 200 196 280 190 C 330 186 380 178 410 174 L 410 250 L 40 250 Z" class="terai"/>
          <rect x="92" y="158" width="30" height="11" rx="2" transform="rotate(-7 107 163)" class="field a"/>
          <rect x="128" y="166" width="26" height="10" rx="2" transform="rotate(5 141 171)" class="field b"/>
          <rect x="252" y="176" width="30" height="11" rx="2" transform="rotate(-5 267 181)" class="field a"/>
          <rect x="286" y="168" width="24" height="10" rx="2" transform="rotate(6 298 173)" class="field b"/>
          <rect x="170" y="218" width="28" height="10" rx="2" transform="rotate(4 184 223)" class="field b"/>
          <rect x="222" y="182" width="24" height="10" rx="2" transform="rotate(-6 234 187)" class="field a"/>
          <rect x="80" y="146" width="18" height="8" rx="2" transform="rotate(-4 89 150)" class="field a"/>
          <rect x="252" y="183" width="24" height="9" rx="2" transform="rotate(5 264 187)" class="field b"/>
          <path d="${land}" fill="url(#landdots)" opacity=".34"/>
          <path d="M 40 208 C 120 200 200 212 280 206 C 330 202 380 196 410 192 L 410 250 L 40 250 Z" class="terai2"/>
          <ellipse cx="180" cy="140" rx="28" ry="10" class="sandblob a"/>
          <ellipse cx="300" cy="145" rx="24" ry="9" class="sandblob b"/>
          <ellipse cx="120" cy="185" rx="20" ry="8" class="sandblob a"/>
        </g>
        <g class="terraces">
          <path d="M 88 136 q 20 9 40 0" class="tband a"/>
          <path d="M 85 144 q 22 10 44 0" class="tband b"/>
          <path d="M 88 152 q 20 9 40 0" class="tband c"/>
          <path d="M 306 158 q 18 8 36 0" class="tband a"/>
          <path d="M 304 166 q 19 9 38 0" class="tband b"/>
          <path d="M 307 174 q 18 8 36 0" class="tband c"/>
          <path d="M 132 145 q 15 7 30 0" class="tband b"/>
          <path d="M 136 126 q 14 7 28 0" class="tband a"/>
          <path d="M 322 132 q 14 6 28 0" class="tband c"/>
          <path d="M 134 133 q 15 7 30 0" class="tband b"/>
          <path d="M 324 139 q 14 6 28 0" class="tband a"/>
        </g>
        <g class="contours">
          <path d="M 120 145 q 50 14 100 0 M 130 156 q 40 12 80 0"/>
          <path d="M 230 150 q 50 14 100 0 M 240 161 q 40 12 80 0"/>
        </g>
        <path d="M 344 128 C 330 150 322 172 300 190 C 286 202 272 208 262 216" class="river"/>
        <path d="M 158 112 C 150 140 158 168 172 190 C 180 202 186 208 192 214" class="river"/>
        <path d="M 78 129 C 80 120 94 114.5 107 115.5 C 119.5 116.5 127 125 122.5 133 C 117 141 93.5 142.5 86 138 C 80.5 135 77 133.5 78 129 Z" class="lake-phewa"/>
        <ellipse cx="70" cy="151" rx="8.5" ry="4.6" class="lake-phewa"/>
        <path d="M 96 128 q 3 -2 6 0 M 104 132 q 3 -2 6 0" class="lake-wave"/>
        <g class="fish"><path d="M 95 136 q 2.2 -1.8 4.4 0 q -2.2 1.8 -4.4 0 Z"/><path d="M 70 154 q 1.8 -1.5 3.6 0 q -1.8 1.5 -3.6 0 Z"/></g>
        ${yakIcon(304, 150, 1)}${yakIcon(314, 156, 0.62)}${yakIcon(295, 144, 0.55)}${yakIcon(288, 150, 0.48)}
        ${tinyHouse(92, 132, "#F7EFD8")}${tinyHouse(101, 135, "#F2E3C8")}${roundTree(110, 138, 0.5)}
        ${peaks}
        ${everestPeak}
        ${flagString(226, 114, 258, 104)}
        ${flagString(118, 98, 146, 90)}
        <g transform="translate(110,142)" class="farmer">
          <path d="M -3 -6.6 L 0 -8 L 3 -6.6 Z" fill="#D9A63B"/>
          <circle cx="0" cy="-5.4" r="1.3" fill="#8A6A44"/>
          <line x1="0" y1="-4.1" x2="0" y2="1.4" stroke="#5F8A4E" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="0" y1="1.4" x2="-1.5" y2="4.6" stroke="#8A6A44" stroke-width="1"/>
          <line x1="0" y1="1.4" x2="1.5" y2="4.6" stroke="#8A6A44" stroke-width="1"/>
          <line x1="2.2" y1="-4.4" x2="4.6" y2="2.4" stroke="#8A6A44" stroke-width="0.9" stroke-linecap="round"/>
          <path d="M 3.4 -4.6 L 6.4 -3.8" stroke="#C9C2AF" stroke-width="1.1" stroke-linecap="round"/>
        </g>
        <g transform="translate(313,181)" class="bridge">
          <line x1="-11" y1="-6" x2="-11" y2="2" stroke="#8A6A44" stroke-width="1.1"/>
          <line x1="11" y1="-6" x2="11" y2="2" stroke="#8A6A44" stroke-width="1.1"/>
          <path d="M -11 -5 Q 0 3 11 -5" fill="none" stroke="#C05B3C" stroke-width="1.4"/>
          <line x1="-6.5" y1="-3.8" x2="-6.5" y2="-1" stroke="#C05B3C" stroke-width="0.6"/>
          <line x1="0" y1="-1.6" x2="0" y2="1" stroke="#C05B3C" stroke-width="0.6"/>
          <line x1="6.5" y1="-3.8" x2="6.5" y2="-1" stroke="#C05B3C" stroke-width="0.6"/>
        </g>
        <path d="M 366 58 q 2.6 -3 5.2 0 M 370.2 58 q 2.6 -3 5.2 0" class="birds"/>
        <circle cx="352" cy="64" r="11" fill="#F2C14E" opacity=".16"/>
        ${tinyHouse(310, 152, "#F7EFD8")}${roundTree(320, 155, 0.55)}
        <g transform="translate(250,120) scale(0.85)" class="chorten">
          <path d="M -4.5 5 A 4.5 4.5 0 0 1 4.5 5 Z" fill="#F8F5EC" stroke="#C9C2AF" stroke-width="0.7"/>
          <rect x="-2.2" y="0" width="4.4" height="1.6" rx="0.5" fill="#E0A83C"/>
          <path d="M -1.1 0 L 0 -4.2 L 1.1 0 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.5"/>
          <circle cx="0" cy="-4.6" r="0.7" fill="#C05B3C"/>
        </g>
        <g transform="translate(206,132) scale(0.7)" class="chorten">
          <path d="M -4.5 5 A 4.5 4.5 0 0 1 4.5 5 Z" fill="#F8F5EC" stroke="#C9C2AF" stroke-width="0.7"/>
          <rect x="-2.2" y="0" width="4.4" height="1.6" rx="0.5" fill="#E0A83C"/>
          <path d="M -1.1 0 L 0 -4.2 L 1.1 0 Z" fill="#E0A83C" stroke="#B9871F" stroke-width="0.5"/>
        </g>
        ${flagString(338, 96, 356, 90)}
        ${pineTree(281, 122, 0.8)}${pineTree(292, 129, 0.6)}${pineTree(272, 131, 0.55)}${pineTree(206, 112, 0.5)}${pineTree(238, 120, 0.5)}
        ${roundTree(98, 208, 0.85)}${roundTree(114, 213, 0.66)}${roundTree(240, 197, 0.7)}${roundTree(320, 199, 0.62)}${roundTree(60, 196, 0.58)}${roundTree(150, 215, 0.6)}${roundTree(285, 203, 0.66)}
        ${roundTree(316, 155, 0.7)}${roundTree(324, 159, 0.75)}${roundTree(332, 163, 0.7)}
        ${roundTree(118, 157, 0.68)}${roundTree(127, 161, 0.72)}${roundTree(136, 165, 0.68)}
        ${roundTree(255, 168, 0.68)}${roundTree(264, 172, 0.72)}${roundTree(273, 176, 0.68)}
        ${roundTree(86, 178, 0.6, true)}${roundTree(232, 213, 0.7, true)}${roundTree(150, 197, 0.55, true)}${roundTree(322, 184, 0.6, true)}
        ${tinyHouse(192, 184, "#F7EFD8")}${tinyHouse(203, 186, "#F2E3C8")}${roundTree(213, 188, 0.55)}
        <g transform="translate(227,213) scale(0.6)">
          <path d="M -7 6 L -7 1.5 Q -7 -2.4 -3 -2.8 L 3.6 -2.8 Q 6.2 -2.5 6.8 -0.8 L 6.8 6 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="0.8" stroke-linejoin="round"/>
          <path d="M 6.9 -1.9 L 9.6 -3 L 6.9 -0.6 Z" fill="#8D8D85" stroke="#6E6E66" stroke-width="0.6" stroke-linejoin="round"/>
          <line x1="-4.5" y1="6" x2="-4.5" y2="8.2" stroke="#6E6E66" stroke-width="1.4"/>
          <line x1="3.6" y1="6" x2="3.6" y2="8.2" stroke="#6E6E66" stroke-width="1.4"/>
        </g>
        <g transform="translate(256,216)" class="heron">
          <ellipse cx="0" cy="-2" rx="3.6" ry="2" fill="#F7F5EC" stroke="#C9C2AF" stroke-width="0.5"/>
          <path d="M 3 -2.5 q 2.5 -0.5 2 -2.5" fill="none" stroke="#F7F5EC" stroke-width="1.1" stroke-linecap="round"/>
          <circle cx="5.3" cy="-5.4" r="0.8" fill="#F7F5EC"/>
          <line x1="-1.5" y1="0" x2="-1.5" y2="3.4" stroke="#8A6A44" stroke-width="0.8"/>
          <line x1="1.5" y1="0" x2="1.5" y2="3.4" stroke="#8A6A44" stroke-width="0.8"/>
        </g>
        <g transform="translate(98,127)">
          <path d="M -5.4 1.2 Q 0 3.4 5.4 1.2 L 4.2 -0.6 L -4.2 -0.6 Z" fill="#8E3E2B"/>
          <line x1="0.4" y1="-0.6" x2="0.4" y2="-6.2" stroke="#6E4A32" stroke-width="0.8"/>
          <path d="M 1.1 -0.6 L 1.1 -5.6 L 4.6 -0.6 Z" fill="#FBF6E9"/>
          <path d="M -0.3 -0.6 L -0.3 -4.4 L -2.9 -0.6 Z" fill="#F2E3C8"/>
        </g>
        <g transform="translate(84,88)" class="balloon">
          <path d="M 0 -7.5 C 4.4 -7.5 5.6 -2 3.8 1.2 L -3.8 1.2 C -5.6 -2 -4.4 -7.5 0 -7.5 Z" fill="#D06A48" stroke="#9E4629" stroke-width="0.7"/>
          <path d="M -1.6 -7.3 C -2.6 -5 -2.6 -1 -1.5 1.2 L 1.5 1.2 C 2.6 -1 2.6 -5 1.6 -7.3 Z" fill="#F2C14E"/>
          <line x1="-1.9" y1="1.2" x2="-1.3" y2="3.4" stroke="#9E4629" stroke-width="0.6"/>
          <line x1="1.9" y1="1.2" x2="1.3" y2="3.4" stroke="#9E4629" stroke-width="0.6"/>
          <rect x="-1.7" y="3.4" width="3.4" height="2.6" rx="0.6" fill="#8A6A44"/>
        </g>
        <path d="${route}" class="route-case" pathLength="100"/>
        <path d="${route}" class="route-base" pathLength="100"/>
        <path d="${route}" class="route-progress" pathLength="100" style="stroke-dasharray: ${progress} 100;"/>
        <path d="${route}" class="route-stitch" pathLength="100"/>
        <g transform="translate(296,190) rotate(-16)" class="jeep">
          <rect x="-6" y="-4" width="11" height="4.6" rx="1.2" fill="#C05B3C" stroke="#8E3E2B" stroke-width="0.6"/>
          <rect x="-3.4" y="-6.6" width="6" height="2.8" rx="1" fill="#D06A48" stroke="#8E3E2B" stroke-width="0.6"/>
          <circle cx="-3" cy="1" r="1.5" fill="#3A3A34"/>
          <circle cx="4" cy="1" r="1.5" fill="#3A3A34"/>
        </g>
        <g transform="translate(335,151)" class="trekker">
          <circle cx="0" cy="-4.6" r="1.4" fill="#8A6A44"/>
          <line x1="0" y1="-3.2" x2="0" y2="1.6" stroke="#C05B3C" stroke-width="1.6" stroke-linecap="round"/>
          <rect x="-2.4" y="-3.2" width="1.8" height="2.8" rx="0.5" fill="#3E5A76"/>
          <line x1="0" y1="1.6" x2="-1.6" y2="4.6" stroke="#8A6A44" stroke-width="1"/>
          <line x1="0" y1="1.6" x2="1.4" y2="4.6" stroke="#8A6A44" stroke-width="1"/>
        </g>
        <g transform="translate(358,127)" class="campfire">
          <path d="M -4 3 L 4 1 M -4 1 L 4 3" fill="none" stroke="#8A6A44" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M 0 -4.5 C 2 -2.5 2.6 -1 0 1 C -2.6 -1 -2 -2.5 0 -4.5 Z" fill="#F2C14E" stroke="#D9A63B" stroke-width="0.5"/>
          <path d="M 0 -2 C 1 -1 1 0 0 0.8 C -1 0 -1 -1 0 -2 Z" fill="#C05B3C"/>
        </g>
        ${nodes}
        <g class="compass" transform="translate(405,259)">
          <circle r="11" class="compass-bg"/>
          <path d="M 0 -6.5 L 2.8 2.5 L 0 0.8 L -2.8 2.5 Z" fill="#C05B3C"/>
          <text x="0" y="-14.5" class="compass-n">N</text>
        </g>
        <g transform="translate(150,29) rotate(-3)" class="banner">
          <rect x="-52" y="-14" width="104" height="28" rx="10" transform="translate(2.5,2.5)" fill="#1F3A36" opacity=".22"/>
          <rect x="-52" y="-14" width="104" height="28" rx="10" class="banner-bg"/>
          <text x="0" y="5.5" class="banner-text">NEPAL</text>
        </g>
        <text x="150" y="53" class="banner-sub">${t("map-banner-sub")}</text>
        <g transform="translate(211,16)" class="npflag">
          <line x1="0" y1="0" x2="0" y2="17" stroke="#8A6A44" stroke-width="1"/>
          <path d="M 0 0.5 L 12 3.4 L 0 6.4 Z" fill="#C05B3C" stroke="#3E5A76" stroke-width="0.7"/>
          <path d="M 0 6.4 L 15 10 L 0 13.6 Z" fill="#C05B3C" stroke="#3E5A76" stroke-width="0.7"/>
        </g>
      </svg>
      <button class="map-zoom" aria-label="${t("map-zoom-aria")}">${ICONS.maximize}</button>
      <div class="map-caption">${t("map-caption")}</div>
    </div>`;
}

/* Karte antippen: Vollbild mit Pinch-Zoom und Schieben */
function openMapOverlay() {
  const src = $(".map-hero svg");
  if (!src || $("#mapOverlay")) return;
  const ov = document.createElement("div");
  ov.id = "mapOverlay";
  ov.setAttribute("role", "dialog");
  ov.setAttribute("aria-label", t("map-overlay-aria"));
  ov.innerHTML = `<div class="mo-stage">${src.outerHTML}</div>
    <button class="mo-close" aria-label="${t("map-close-aria")}">${ICONS.close}</button>
    <div class="mo-hint">${t("map-overlay-hint")}</div>`;
  document.body.appendChild(ov);
  const revealOv = () => ov.classList.add("show");
  requestAnimationFrame(revealOv);
  setTimeout(revealOv, 350); // Fallback, falls rAF im Hintergrund-Pane pausiert

  const stage = $(".mo-stage", ov);
  let scale = 1, tx = 0, ty = 0;
  const apply = () => { stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; };
  const ptrs = new Map();
  let start = null;

  stage.addEventListener("pointerdown", (e) => {
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    start = { scale, tx, ty, pts: new Map(ptrs) };
  });
  stage.addEventListener("pointermove", (e) => {
    if (!ptrs.has(e.pointerId) || !start) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 1) {
      const [p] = ptrs.values();
      const [s] = start.pts.values();
      tx = start.tx + (p.x - s.x);
      ty = start.ty + (p.y - s.y);
    } else if (ptrs.size >= 2) {
      const [a, b] = ptrs.values();
      const [sa, sb] = start.pts.values();
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const sdist = Math.hypot(sa.x - sb.x, sa.y - sb.y) || 1;
      scale = Math.min(6, Math.max(1, start.scale * (dist / sdist)));
      if (scale === 1) { tx = 0; ty = 0; }
    }
    apply();
  });
  const lift = (e) => {
    ptrs.delete(e.pointerId);
    if (!ptrs.size) {
      start = null;
      if (scale === 1 && (tx || ty)) { tx = 0; ty = 0; apply(); } // sanft zurueck auf Anfang
    } else {
      start = { scale, tx, ty, pts: new Map(ptrs) };
    }
  };
  stage.addEventListener("pointerup", lift);
  stage.addEventListener("pointercancel", lift);
  ov.addEventListener("wheel", (e) => {
    e.preventDefault();
    scale = Math.min(6, Math.max(1, scale * (e.deltaY < 0 ? 1.15 : 0.87)));
    if (scale === 1) { tx = 0; ty = 0; }
    apply();
  }, { passive: false });

  const close = () => {
    ov.classList.remove("show");
    document.removeEventListener("keydown", onKey);
    setTimeout(() => ov.remove(), 260);
  };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  $(".mo-close", ov).addEventListener("click", close);
  ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
}

function landmarkFor(id, x, y) {
  switch (id) {
    case "kathmandu": return pagodaIcon(x, y - 16);
    case "thamel": return housesIcon(x - 2, y - 16);
    case "swayambhu": return stupaIcon(x, y - 15);
    case "bhaktapur": return gateIcon(x, y - 16);
    case "nagarkot": return viewpointIcon(x, y - 15);
    case "lumbini": return bodhiIcon(x + 1, y - 15);
    case "chitwan": return rhinoIcon(x, y - 15);
    case "everest": return tentIcon(x - 13, y - 6);
    default: return "";
  }
}

function unlockedItems() {
  const base = LESSONS[0].groups.filter(g => !groupLocked(g)).flatMap(g => g.items);
  const have = new Set(base.map(i => i.id));
  const sceneItems = chapterList()
    .flatMap(c => c.scenes)
    .filter(sc => store.get("sikai_done_" + sc.id, 0) > 0)
    .flatMap(sc => (sc.items || []).concat(sc.warmups || []))
    .filter(it => it && !have.has(it.id) && have.add(it.id));
  return base.concat(sceneItems);
}

function chapterList() {
  return [window.CHAPTER1, window.CHAPTER2, window.CHAPTER3, window.CHAPTER4,
    window.CHAPTER5, window.CHAPTER6, window.CHAPTER7, window.CHAPTER8, window.CHAPTER9].filter(Boolean);
}
function chapterProgress(ch) {
  const done = ch.scenes.filter(sc => store.get("sikai_done_" + sc.id, 0) > 0).length;
  return { done, total: ch.scenes.length, complete: done === ch.scenes.length };
}
const CHAPTER_FOR = { kathmandu: 0, thamel: 1, swayambhu: 2, bhaktapur: 3, nagarkot: 4, pokhara: 5, lumbini: 6, chitwan: 7, everest: 8 };
function stopChapterProgress(st) {
  const ch = chapterList()[CHAPTER_FOR[st.id]];
  return ch ? chapterProgress(ch) : { done: 0, total: 1, complete: false };
}
function journeySceneProgress() {
  const all = chapterList().flatMap(c => c.scenes);
  const done = all.filter(sc => store.get("sikai_done_" + sc.id, 0) > 0).length;
  return { done, total: all.length };
}
function stopDone(st, xp) {
  const ch = chapterList()[CHAPTER_FOR[st.id]];
  if (ch) return chapterProgress(ch).complete; // Station = Kapitel gemeistert, Punkt.
  return xp >= st.xp;
}
function sceneChapter(scId) {
  return chapterList().find(c => c.scenes.some(x => x.id === scId));
}
function sceneLocked(sc) {
  const list = chapterList();
  const ci = list.findIndex(c => c.scenes.some(x => x.id === sc.id));
  if (ci <= 0) return false;
  return !chapterProgress(list[ci - 1]).complete; // Kapitel N erst nach N-1
}
function goalText(xp) {
  const nextStop = JOURNEY.stops.find(s => !stopDone(s, xp)) || JOURNEY.stops[JOURNEY.stops.length - 1];
  const ci = CHAPTER_FOR[nextStop.id];
  if (ci !== undefined) {
    const ch = chapterList()[ci];
    const cp = chapterProgress(ch);
    if (!cp.complete) return t("goal-text", { n: ci + 1, a: Math.min(cp.done + 1, cp.total), b: cp.total });
  }
  return t("goal-xp", { xp, stop: nextStop.name, n: Math.max(nextStop.xp - xp, 0) });
}

function stopXp(id) {
  const st = JOURNEY.stops.find(x => x.id === id);
  return st ? st.xp : 0;
}
function groupLocked(g) {
  if (g.storyOnly) return true; // Kapitel-Woerter kommen mit der Geschichte
  if (!g.unlock) return false;
  const st = JOURNEY.stops.find(x => x.id === g.unlock);
  return !st || !stopDone(st, getXp()); // Gruppe frei, wenn die Station (= Kapitel) erreicht ist
}

function storyCardHtml() {
  const list = chapterList();
  let ci = list.findIndex(c => !chapterProgress(c).complete);
  if (ci === -1) ci = list.length - 1;
  const ch = list[ci];
  const scenes = ch.scenes;
  const next = scenes.find(sc => store.get("sikai_done_" + sc.id, 0) === 0);
  return `
    <div class="card story-card">
      <div class="card-kicker">${ICONS.play} ${t("goal-text", { n: ci + 1, a: next ? scenes.indexOf(next) + 1 : scenes.length, b: scenes.length })}</div>
      <div class="story-card-title">${esc(TX(ch, "title"))}</div>
      <div class="scene-dots">${scenes.map(sc => `<span class="sdot ${store.get("sikai_done_" + sc.id, 0) > 0 ? "done" : ""} ${next && next.id === sc.id ? "next" : ""}" title="${esc(TX(sc, "title"))}"></span>`).join("")}</div>
      ${next
        ? `<button class="btn btn-primary cta" id="storyCta">${ICONS.play} ${t("story-cta", { n: scenes.indexOf(next) + 1, title: TX(next, "title") })}</button>
           <div class="cta-sub">${ci === 0 ? t("story-route-ch1") : t("story-continues")}</div>`
        : `<div class="tbonus ok">${t("story-complete", { n: ci + 1 })}</div>
           <button class="btn btn-ghost cta" id="storyCta">${ICONS.refresh} ${t("story-repeat", { n: ci + 1 })}</button>`}
    </div>`;
}

function passportHtml() {
  const xp = getXp();
  const doneN = JOURNEY.stops.filter(st => stopDone(st, xp)).length;
  return `
  <div class="card passport-card">
    <div class="card-kicker">${ICONS.flag} ${t("passport-title")}</div>
    <div class="stamps">
      ${JOURNEY.stops.map((st, i) => {
        const done = stopDone(st, xp);
        const active = !done && (i === 0 || stopDone(JOURNEY.stops[i - 1], xp));
        return `<span class="stamp ${done ? "done" : ""} ${active ? "active" : ""}" title="${esc(st.name)}">${done ? ICONS.check : i + 1}</span>`;
      }).join("")}
    </div>
    <div class="pass-note">${t("passport-note", { a: doneN, b: JOURNEY.stops.length })}</div>
  </div>`;
}

function sessionCardsHtml() {
  const due = srsDueIds().length;
  const G_ICONS = { g1: "sun", g2: "heart_handshake", g3: "message_circle", g4: "compass",
    g5: "star", g6: "sparkles", g7: "car", g8: "mountain_snow", g9: "flag", g10: "target", g11: "speech", g21: "heart_handshake" };
  const cards = [];
  LESSONS[0].groups.forEach(g => {
    if (g.storyOnly) return; // lebt in den Kapitel-Szenen
    const doneN = groupDoneCount(g.id);
    const locked = groupLocked(g);
    const stop = g.unlock ? JOURNEY.stops.find(x => x.id === g.unlock) : null;
    cards.push({ id: g.id, cls: "group", icon: ICONS[G_ICONS[g.id]] || ICONS.sparkles, title: TX(g, "title"),
      sub: locked
        ? t("group-locked", { n: CHAPTER_FOR[stop.id] + 1, stop: stop.name })
        : t("group-sub", { n: g.items.length }) + (doneN ? " · " + t("group-mastered", { n: doneN }) : ""),
      locked });
  });
  cards.push({ id: "refresh", cls: "srs", icon: ICONS.refresh, title: t("card-trainer"),
    sub: due ? t("card-trainer-due", { n: due, w: due === 1 ? t("unit-word") : t("unit-words") }) : t("card-trainer-free") });
  cards.push({ id: "letters", cls: "letters", icon: '<span class="dev">अ</span>', title: t("card-letters"),
    sub: t("card-letters-sub") });
  cards.push({ id: "detective", cls: "detective", icon: ICONS.search, title: t("card-detective"),
    sub: t("card-detective-sub") });
  cards.push({ id: "story", cls: "story", icon: ICONS.car, title: t("card-story"),
    sub: t("card-story-sub") });
  return cards.map(c => `
    <button class="row-item ${c.disabled || c.locked ? "disabled" : ""}" data-session="${c.id}" ${c.disabled ? "disabled" : ""} ${c.locked ? 'data-locked="1"' : ""}>
      <span class="ri-icon">${c.locked ? ICONS.close : c.icon}</span>
      <span class="ri-body"><b>${esc(c.title)}</b><small>${esc(c.sub)}</small></span>
      <span class="ri-arrow">${c.locked ? "" : ICONS.chevron}</span>
    </button>`).join("");
}

/* Empfehlung: Was soll ich JETZT lernen? */
function recommendedSession() {
  const due = srsDueIds().length;
  for (const c of chapterList()) {
    const nextScene = c.scenes.find(sc => store.get("sikai_done_" + sc.id, 0) === 0);
    if (nextScene) return { id: nextScene.id, label: t("rec-scene", { n: chapterList().indexOf(c) + 1, title: TX(nextScene, "title") }) };
  }
  const g = LESSONS[0].groups.find(g => !groupLocked(g) && groupDoneCount(g.id) === 0);
  if (g) return { id: g.id, label: TX(g, "title") };
  if (due >= 3) return { id: "refresh", label: t("rec-trainer", { n: due }) };
  const extras = [
    { id: "letters", n: store.get("sikai_done_letters", 0) },
    { id: "detective", n: store.get("sikai_done_detective", 0) },
    { id: "story", n: store.get("sikai_done_story", 0) }
  ].sort((a, b) => a.n - b.n);
  if (extras[0].n === 0) return { id: extras[0].id, label: t("card-" + (extras[0].id === "letters" ? "letters" : extras[0].id === "detective" ? "detective" : "story")) };
  if (due > 0) return { id: "refresh", label: t("rec-trainer", { n: due }) };
  const fb = LESSONS[0].groups.find(g => !groupLocked(g)) || LESSONS[0].groups[0];
  return { id: fb.id, label: state.lang === "en" ? "Reinforce: " + TX(fb, "title") : TX(fb, "title") + " festigen" };
}

function dailySceneTitle(dd) { // sceneId sprachneutral aufloesen, aeltere Eintrage mit gespeichertem Titel fallbacken
  if (dd.sceneId) {
    for (const c of chapterList()) {
      const sc = c.scenes.find(x => x.id === dd.sceneId);
      if (sc) return TX(sc, "title");
    }
  }
  return dd.sceneTitle || "";
}

function todayCardHtml() {
  const dd = dailyData();
  const nx = nextSceneDef();
  const streakN = streakData().count;
  const sceneDone = dd.scene || !nx;
  const reviewDone = !!dd.review;
  const complete = sceneDone && reviewDone;
  const sceneSub = !nx ? t("today-all-mastered")
    : sceneDone ? t("today-scene-done", { title: dailySceneTitle(dd) ? " (" + dailySceneTitle(dd) + ")" : "" })
    : t("today-scene-next", { n: nx.ci + 1, i: chapterList()[nx.ci].scenes.indexOf(nx.scene) + 1, title: TX(nx.scene, "title") });
  return `
    <div class="card today-card" id="todayCard">
      <div class="tc-head">
        <span class="tc-kicker">${t("today-kicker")}${streakN ? ` · <b>${t("today-day", { n: streakN })}</b>` : ""}</span>
        ${streakN && !streakCold() ? `<span class="tc-flame">${ICONS.flame}</span>` : ""}
        ${complete ? `<span class="tc-badge">${ICONS.check} ${t("today-goal-done")}</span>` : ""}
      </div>
      <div class="tc-tasks">
        <button class="tc-task ${sceneDone ? "done" : ""}" data-goal="scene">
          <span class="tc-check">${ICONS.check}</span>
          <span class="tc-body"><b>${t("today-new-scene")}</b><small>${esc(sceneSub)}</small></span>
          ${nx ? `<span class="tc-go">${sceneDone ? ICONS.refresh : ICONS.play}</span>` : ""}
        </button>
        <button class="tc-task ${reviewDone ? "done" : ""}" data-goal="review">
          <span class="tc-check">${ICONS.check}</span>
          <span class="tc-body"><b>${t("today-review")}</b><small>${esc(reviewTaskLabel())}</small></span>
          <span class="tc-go">${ICONS.refresh}</span>
        </button>
      </div>
      ${complete
        ? `<div class="tc-note ok">${ICONS.flame} ${t("today-goal-done")}${dd.goalBonus ? " · " + t("today-bonus-got") : ""}</div>`
        : `<div class="tc-note">${t("today-note")}</div>`}
    </div>`;
}

const TABS = [
  { id: "start", label: "tab-start" },
  { id: "ueben", label: "tab-ueben" },
  { id: "einstellungen", label: "tab-settings" }
];
const TAB_ICONS = { start: "home", ueben: "refresh", einstellungen: "settings" };

function renderTabbar() {
  const bar = $("#tabbar");
  if (!bar) return;
  bar.innerHTML = TABS.map(tab => `
    <button data-tab="${tab.id}" class="${state.tab === tab.id ? "active" : ""}" aria-current="${state.tab === tab.id ? "page" : "false"}">
      ${ICONS[TAB_ICONS[tab.id]]}<span>${t(tab.label)}</span>
    </button>`).join("");
  bar.querySelectorAll("[data-tab]").forEach(b =>
    b.addEventListener("click", () => switchTab(b.dataset.tab)));
}

function switchTab(tab) {
  if (!TABS.some(t => t.id === tab) || tab === state.tab) return;
  state.tab = tab;
  try { history.replaceState(null, "", "#" + tab); } catch (e) { /* file:// */ }
  renderHome();
}

function renderHome() {
  document.body.dataset.screen = "tabs";
  const ch = challengeToday();
  const chDone = challengeDoneToday();
  const rec = recommendedSession();
  const xp = getXp();
  const streakN = streakData().count;

  if (state.tab === "einstellungen") {
    view.innerHTML = `<div class="settings-sheet settings-page">${settingsHtml()}</div>`;
  } else if (state.tab === "ueben") {
    view.innerHTML = `
      <div class="kicker-row"><span class="kicker">${t("tab-ueben")}</span><span class="kicker-meta">${t("ueben-meta", { n: dailyData().sessions, s: dailyData().sessions === 1 ? t("unit-session") : t("unit-sessions") })}</span></div>
      <div class="cta-row"><button class="btn btn-primary cta" id="ctaBtn">${ICONS.play} ${esc(rec.label)}</button></div>
      ${chapterList().map((c, ci) => `
      <div class="kicker-row"><span class="kicker">${t("chapter-n", { n: ci + 1 })}</span><span class="kicker-meta">${esc(TX(c, "title"))}</span></div>
      <div class="row-list">${c.scenes.map((sc, i) => {
        const done = store.get("sikai_done_" + sc.id, 0) > 0;
        const locked = sceneLocked(sc);
        return `
        <button class="row-item ${locked ? "disabled" : ""}" data-session="${sc.id}" ${locked ? 'data-locked="1"' : ""}>
          <span class="ri-icon">${locked ? ICONS.close : done ? ICONS.check : ICONS.map_pin}</span>
          <span class="ri-body"><b>${t("scene-n", { n: i + 1 })} · ${esc(TX(sc, "title"))}</b><small>${locked ? t("ueben-locked", { n: ci }) : done ? t("ueben-done") : t("ueben-story")}</small></span>
          <span class="ri-arrow">${locked ? "" : ICONS.chevron}</span>
        </button>`;
      }).join("")}</div>`).join("")}
      <div class="kicker-row"><span class="kicker">${t("ueben-all-sessions")}</span></div>
      <div class="row-list">${sessionCardsHtml()}</div>
      <p class="foot-note">${t("ueben-footnote")}</p>`;
  } else {
    view.innerHTML = `
    ${todayCardHtml()}
    <div class="kicker-row"><span class="kicker">${t("home-journey")}</span><span class="kicker-meta">${esc(goalText(xp))}</span></div>
    ${mapHtml()}
    ${storyCardHtml()}
    ${passportHtml()}
    <div class="kicker-row"><span class="kicker">${t("home-streak-challenge")}</span></div>
    <div class="today-band">
      <div class="tb-streak">
        <div class="big-num">${streakN}<small>${streakN === 1 ? t("unit-day") : t("unit-days")}</small></div>
        <div class="stat-cap">${ICONS.flame} ${t("streak")}</div>
        ${plateHtml()}
      </div>
      <div class="tb-sep"></div>
      <div class="tb-challenge">
        <div class="tb-ch-label">${t("challenge")}</div>
        <p class="ch-text">${esc(G(ch))}</p>
        ${ch.gloss ? `
        <button class="linkish ch-help-btn" aria-expanded="false">${t("ch-help")}</button>
        <div class="ch-gloss" hidden>${esc(TX(ch, "gloss"))}</div>` : ""}
        <button class="btn btn-ghost" id="challengeBtn" ${chDone ? "disabled" : ""}>
          ${chDone ? ICONS.check + " " + t("challenge-done") : t("challenge-open")}
        </button>
      </div>
    </div>
    <div class="kicker-row"><span class="kicker">${t("stations-n", { n: JOURNEY.stops.length })}</span></div>
    <div class="trail">${trailHtml()}</div>
    <p class="foot-note">${t("home-footnote")}</p>`;
  }

  renderTabbar();
  if (state.tab === "einstellungen") { wireSettings($(".settings-page", view), () => {}); refreshPwaCards(); }
  const mapHero = $(".map-hero", view);
  if (mapHero) mapHero.addEventListener("click", () => openMapOverlay());
  $("#ctaBtn") && $("#ctaBtn").addEventListener("click", () => startSessionById(rec.id));
  const sCta = $("#storyCta");
  if (sCta) sCta.addEventListener("click", () => {
    let nx = null;
    for (const c of chapterList()) {
      nx = c.scenes.find(sc => store.get("sikai_done_" + sc.id, 0) === 0);
      if (nx) break;
    }
    startSessionById(nx ? nx.id : "c1s1");
  });
  view.querySelectorAll("[data-session]").forEach(b =>
    b.addEventListener("click", () => {
      if (b.dataset.locked) { toast(t("locked-toast")); return; }
      startSessionById(b.dataset.session);
    }));
  const chBtn = $("#challengeBtn");
  if (chBtn && !chBtn.disabled) bindChallengeBtn(chBtn);
  const chHelp = $(".ch-help-btn");
  if (chHelp) chHelp.addEventListener("click", () => {
    const g = $(".ch-gloss");
    const open = g.hasAttribute("hidden");
    g.toggleAttribute("hidden", !open);
    chHelp.textContent = open ? t("ch-hide") : t("ch-help");
    chHelp.setAttribute("aria-expanded", String(open));
  });
  view.querySelectorAll("#todayCard [data-goal]").forEach(b =>
    b.addEventListener("click", () => {
      if (b.dataset.goal === "scene") {
        const nx = nextSceneDef();
        if (nx) startSessionById(nx.scene.id);
        else toast(t("all-mastered-toast"));
      } else {
        startSessionById("refresh");
      }
    }));
  updateHeaderStats();
}

/* Tageswechsel im offenen Tab bemerken – aber nur die Startseite auffrischen */
(() => {
  let seen = todayStr();
  setInterval(() => {
    const t = todayStr();
    if (t !== seen) {
      seen = t;
      if (document.querySelector("#tabbar")) renderHome();
    }
  }, 60 * 60 * 1000);
})();

/* ---------- Session-Definitionen ---------- */

const GRAMMAR_AUDIO = { gt1: "l1_12", gt2: null, gt3: "l1_15", gt4: "l1_16" };

function buildQueue(def) {
  const q = [];
  const quizTypes = ["ne2de", "audio4", "de2ne"];

  if (def.type === "group") {
    const g = LESSONS[0].groups[def.groupIndex];
    const fresh = g.items.filter(it => !srsAll()[it.id]);
    const pool = fresh.length >= 6 ? fresh : g.items.slice();
    shuffle(pool).slice(0, 6).forEach(item => q.push({ type: "new", item, group: g }));
    q.push({ type: "tip", tip: GRAMMAR_TIPS[(def.groupIndex + (store.get("sikai_tiprot", 0))) % GRAMMAR_TIPS.length] });
    shuffle(g.items).slice(0, 4).forEach((item, i) => q.push({ type: quizTypes[i % 3], item, group: g }));
    q.push({ type: "match", group: g });
    if (g.id === "g3") for (const id of BUILD_SENTENCES.slice(0, 2)) q.push({ type: "build", item: itemById(id) });
    if (g.id === "g11") for (const id of BUILD_SENTENCES.slice(3, 5)) q.push({ type: "build", item: itemById(id) });
  }

  if (def.type === "refresh") {
    /* Vokabeltrainer: NUR freigeschaltete Woerter - zuerst Fälliges (SRS),
       dann Gelerntes, dann der Rest des Freigeschalteten. Nie leer. */
    const openIds = new Set(unlockedItems().map(i => i.id));
    const dueIds = srsDueIds().filter(id => openIds.has(id));
    const ids = [...dueIds];
    if (ids.length < 10) {
      const srs = srsAll();
      const learned = Object.keys(srs).filter(id => openIds.has(id) && itemById(id) && !ids.includes(id))
        .sort((a, b) => srs[a].due - srs[b].due);
      for (const id of learned) { if (ids.length >= 10) break; ids.push(id); }
    }
    if (ids.length < 10) {
      const rest = shuffle([...openIds]).filter(id => !ids.includes(id));
      for (const id of rest) { if (ids.length >= 10) break; ids.push(id); }
    }
    ids.filter(id => itemById(id)).forEach((id, i) => q.push({ type: quizTypes[i % 3], item: itemById(id), group: LESSONS[0].groups.find(g => g.items.some(it => it.id === id)) }));
    if (ids.length >= 4) {
      const g = { id: "due", title: dueIds.length ? t("refresh-due-title") : t("card-trainer"), items: ids.map(itemById) };
      q.push({ type: "match", group: g });
    }
  }

  if (def.type === "letters") {
    for (const L of LETTERS) q.push({ type: "letterNew", letter: L });
    for (const L of shuffle(LETTERS).slice(0, 4)) q.push({ type: "letter2sound", letter: L });
    for (const L of shuffle(LETTERS).slice(0, 4)) q.push({ type: "sound2letter", letter: L });
  }

  if (def.type === "detective") {
    q.push({ type: "detIntro" });
    for (const sc of shuffle(DETECTIVE.scenes)) q.push({ type: "scenario", scene: sc });
  }

  if (def.type === "story") {
    STORY1.steps.forEach(s => q.push({ type: "story", step: s }));
  }

  if (def.type === "scene") {
    const sc = def.scene;
    const grp = { id: sc.id, title: TX(sc, "title"), items: [] };
    if (sc.useStory1) {
      const pre = (sc.items || []).map(itemById);
      pre.forEach(it => q.push({ type: "new", item: it, group: { id: sc.id, title: TX(sc, "title"), items: pre } }));
      STORY1.steps.forEach(st => q.push({ type: "story", step: Object.assign({}, st, { art: sc.art }) }));
    } else {
      q.push({ type: "story", step: { type: "narr", art: sc.art, de: sc.intro, en: sc.introEn, reveal: sc.reveal } });
      const items = (sc.items || []).map(itemById);
      grp.items = items;
      items.forEach(it => q.push({ type: "new", item: it, group: grp }));
      const warm = (sc.warmups || []).map(itemById);
      const pool = warm.concat(items);
      grp.items = pool;
      shuffle(pool).filter(it => it).slice(0, 3).forEach((it, i) => q.push({ type: quizTypes[i % 3], item: it, group: grp }));
      if (pool.length >= 4) q.push({ type: "match", group: grp });
      q.push({ type: "story", step: { type: "choice", art: sc.art, de: sc.choice.q, en: sc.choice.qEn, options: sc.choice.options } });
      q.push({ type: "story", step: { type: "end", art: sc.art, de: sc.title + " geschafft!", en: (sc.titleEn || sc.title) + " complete!", bonus: sc.endBonus ? TX(sc, "endBonus") : t("story-goes-on") } });
    }
  }
  return q;
}

function sessionDefById(id) {
  const map = {};
  LESSONS[0].groups.forEach((g, i) => {
    map[g.id] = { id: g.id, type: "group", groupIndex: i, title: TX(g, "title"), xpBonus: 20, group: g };
  });
  map.refresh = { id: "refresh", type: "refresh", title: t("card-trainer"), xpBonus: 15 };
  map.letters = { id: "letters", type: "letters", title: t("card-letters"), xpBonus: 20 };
  map.detective = { id: "detective", type: "detective", title: t("card-detective"), xpBonus: 20 };
  chapterList().forEach((c, ci) => c.scenes.forEach(sc => {
    map[sc.id] = { id: sc.id, type: "scene", scene: sc, title: t("chapter-n", { n: ci + 1 }) + " · " + TX(sc, "title"), xpBonus: sc.xpBonus };
  }));
  map.story = map.c1s5 || { id: "story", type: "story", title: t("story1-title"), xpBonus: 30 };
  return map[id];
}

/* ---------- Session-Kern ---------- */

const session = { def: null, queue: [], total: 0, idx: 0, firstTry: 0, answered: 0, requeued: new Set(), xpEarned: 0 };

function startSessionById(id) {
  const def = sessionDefById(id);
  if (!def) return;
  if (def.group && groupLocked(def.group)) { toast(t("locked-lesson")); return; }
  if (def.scene && sceneLocked(def.scene)) { toast(t("locked-scene")); return; }
  document.body.dataset.screen = "session";
  session.def = def;
  session.queue = buildQueue(def);
  if (!session.queue.length) {
    toast(t("empty-queue"));
    return;
  }
  session.total = session.queue.length;
  session.idx = 0;
  session.firstTry = 0;
  session.answered = 0;
  session.requeued = new Set();
  session.xpEarned = 0;
  renderStep();
}

function stepHtml(step) {
  const chip = txt => `<span class="ex-chip">${txt}</span>`;

  if (step.type === "new") return `
    <div class="exercise" data-step="new">
      ${chip(t("chip-new") + " " + esc(TX(step.group, "title")))}
      <div class="ex-title">${t("ex-new-title")}</div>
      <div class="prompt-ne ne dev">${esc(step.item.ne)}</div>
      <div class="prompt-tr tr">${esc(step.item.tr)}</div>
      <div class="prompt-de">= ${esc(G(step.item))}</div>
      <div class="audio-stage"><button class="audio-btn" data-audio aria-label="${t("aria-read")}">${ICONS.speaker}</button></div>
      ${step.item.note ? `<p class="note">${neTrText(TX(step.item, "note"))}</p>` : ""}
    </div>`;

  if (step.type === "audio4") return `
    <div class="exercise" data-step="audio4">
      ${chip(t("chip-audio"))}<div class="ex-title">${t("ex-audio-title")}</div>
      <div class="audio-stage"><button class="audio-btn" data-audio aria-label="${t("aria-play")}">${ICONS.speaker}</button></div>
      <div class="options" data-options></div>
    </div>`;

  if (step.type === "ne2de") return `
    <div class="exercise" data-step="ne2de">
      ${chip(t("chip-translate"))}<div class="ex-title">${t("ex-ne2de-title")}</div>
      <div class="prompt-ne ne dev">${esc(step.item.ne)}</div>
      <div class="prompt-tr tr">${esc(step.item.tr)}</div>
      <div class="options" data-options></div>
    </div>`;

  if (step.type === "de2ne") return `
    <div class="exercise" data-step="de2ne">
      ${chip(t("chip-translate"))}<div class="ex-title">${t("ex-de2ne-title")}</div>
      <div class="prompt-de">„${esc(G(step.item))}“</div>
      <div class="options" data-options></div>
    </div>`;

  if (step.type === "match") {
    const pool = step.group.items.length > 6 ? shuffle(step.group.items).slice(0, 6) : step.group.items;
    const left = shuffle(pool), right = shuffle(pool);
    return `
      <div class="exercise" data-step="match">
        ${chip(esc(TX(step.group, "title")) + " · " + t("chip-pairs"))}<div class="ex-title">${t("ex-match-title")}</div>
        <div class="match-grid">
          <div data-col="ne">${left.map(i => `<button class="match-tile" data-id="${i.id}" data-side="ne">${neTr(i)}</button>`).join("")}</div>
          <div data-col="de">${right.map(i => `<button class="match-tile" data-id="${i.id}" data-side="de">${esc(G(i))}</button>`).join("")}</div>
        </div>
      </div>`;
  }

  if (step.type === "build") {
    const tokens = step.item.ne.replace(/[।?]$/g, "").trim().split(/\s+/);
    const others = BUILD_SENTENCES.filter(id => id !== step.item.id).map(itemById);
    const distract = shuffle(others.flatMap(o => o.ne.replace(/[।?]$/g, "").trim().split(/\s+/)))
      .filter(tok => !tokens.includes(tok)).slice(0, 3);
    const trMap = {};
    for (const it of BUILD_SENTENCES.map(itemById)) {
      const neT = it.ne.replace(/[।?]$/g, "").trim().split(/\s+/);
      const trT = it.tr.replace(/[।?]$/g, "").trim().split(/\s+/);
      neT.forEach((tok, i) => { if (!trMap[tok] && trT[i]) trMap[tok] = trT[i].replace(/[.,?!]$/, ""); });
    }
    const bank = shuffle(tokens.concat(distract));
    return `
      <div class="exercise" data-step="build">
        ${chip(t("chip-build"))}<div class="ex-title">${t("ex-build-title")}</div>
        <div class="build-target">„${esc(G(step.item))}“</div>
        <div class="build-stage" data-stage></div>
        <div class="bank">${bank.map((tok, i) => `<button class="tile dev" data-bank="${i}" data-token="${esc(tok)}">${esc(tok)}<span class="tr inline">${esc(trMap[tok] || "")}</span></button>`).join("")}</div>
        <div class="check-row"><button class="btn btn-primary" data-check>${t("check")}</button></div>
      </div>`;
  }

  if (step.type === "tip") {
    const audio = GRAMMAR_AUDIO[step.tip.id];
    return `
      <div class="exercise" data-step="tip">
        ${chip(t("chip-grammar"))}<div class="ex-title">${esc(TX(step.tip, "title"))}</div>
        <p class="tip-text">${esc(G(step.tip))}</p>
        <div class="prompt-ne dev" style="font-size:clamp(24px,5vw,34px)">${esc(step.tip.ne)}</div>
        <div class="prompt-tr">${esc(step.tip.tr)}</div>
        ${audio ? `<div class="audio-stage"><button class="audio-btn" data-audio aria-label="${t("aria-example")}">${ICONS.speaker}</button></div>` : ""}
      </div>`;
  }

  if (step.type === "letterNew") {
    const L = step.letter;
    return `
      <div class="exercise" data-step="letterNew">
        ${chip(t("chip-devanagari-new"))}<div class="ex-title">${t("ex-letter-title", { s: esc(L.sound) })}</div>
        <div class="glyph dev">${esc(L.ch)}</div>
        <div class="audio-stage"><button class="audio-btn" data-audio aria-label="${t("aria-sound")}">${ICONS.speaker}</button></div>
        <p class="note">${esc(TX(L, "hint"))}${L.word ? ` · ${t("letter-in")} <span class="dev">${esc(L.word)}</span>` : ""}</p>
      </div>`;
  }

  if (step.type === "letter2sound") {
    return `
      <div class="exercise" data-step="letter2sound">
        ${chip(t("chip-devanagari"))}<div class="ex-title">${t("ex-letter2sound")}</div>
        <div class="glyph dev">${esc(step.letter.ch)}</div>
        <div class="audio-stage"><button class="audio-btn" data-audio aria-label="${t("aria-sound")}">${ICONS.speaker}</button></div>
        <div class="options" data-options></div>
      </div>`;
  }

  if (step.type === "sound2letter") {
    return `
      <div class="exercise" data-step="sound2letter">
        ${chip(t("chip-devanagari"))}<div class="ex-title">${t("ex-sound2letter", { s: esc(step.letter.sound) })}</div>
        <div class="options glyph-options" data-options></div>
      </div>`;
  }

  if (step.type === "detIntro") {
    const d = DETECTIVE.intro;
    return `
      <div class="exercise" data-step="detIntro">
        ${chip(t("card-detective"))}<div class="ex-title">${esc(TX(d, "title"))}</div>
        <p class="tip-text">${esc(TX(d, "body"))}</p>
        ${d.levels.map((l, i) => `
          <div class="level-row">
            <button class="audio-btn small" data-audio data-play="${["det_ta", "det_timi", "det_tapaai"][i]}" aria-label="${t("aria-listen")}">${ICONS.speaker}</button>
            <span class="dev" style="font-size:22px;font-weight:700">${esc(l.ne)}</span>
            <span class="tr inline">${esc(l.tr)}</span>
            <span class="level-de">${esc(G(l))}</span>
          </div>`).join("")}
      </div>`;
  }

  if (step.type === "scenario") {
    const opts = [
      { key: "ta", ne: "तँ", tr: "ta", audio: "det_ta" },
      { key: "timi", ne: "तिमी", tr: "timi", audio: "det_timi" },
      { key: "tapaai", ne: "तपाईं", tr: "tapaai", audio: "det_tapaai" }
    ];
    return `
      <div class="exercise" data-step="scenario">
        ${chip(t("card-detective"))}<div class="ex-title">${t("ex-scenario-title")}</div>
        <div class="scene">${ICONS.search} ${esc(TX(step.scene, "who"))}</div>
        <div class="options" data-options></div>
      </div>`;
  }

  if (step.type === "story") {
    const s = step.step;
    if (s.type === "narr") return `
      <div class="exercise" data-step="storyNarr">
        ${s.art ? sceneArt(s.art) : ""}
        ${chip(t("chip-story") + " · " + esc(session.def.title))}<div class="narr">${esc(G(s))}</div>
        ${s.reveal ? `<div class="reveal-wrap"><button class="reveal-chip" data-reveal>${esc(TX(s.reveal, "q"))}</button></div>` : ""}
      </div>`;
    if (s.type === "line") return `
      <div class="exercise" data-step="storyLine">
        ${chip(t("chip-story") + " · " + esc(session.def.title))}
        <div class="speaker">${esc(TX(s, "who"))}</div>
        <div class="prompt-ne dev">${esc(s.ne)}</div>
        <div class="prompt-tr">${esc(s.tr)}</div>
        <div class="prompt-de">= ${esc(G(s))}</div>
        <div class="audio-stage"><button class="audio-btn" data-audio data-play="${s.audio}" aria-label="${t("aria-speak")}">${ICONS.speaker}</button></div>
        ${s.note ? `<p class="note">${neTrText(TX(s, "note"))}</p>` : ""}
      </div>`;
    if (s.type === "choice") return `
      <div class="exercise" data-step="storyChoice">
        ${chip(t("chip-story") + " · " + esc(session.def.title))}<div class="ex-title">${esc(G(s))}</div>
        <div class="options story-options" data-options></div>
      </div>`;
    if (s.type === "end") return `
      <div class="exercise" data-step="storyEnd">
        ${chip(t("chip-story") + " · " + esc(session.def.title))}
        <div class="ex-title">🎉 ${esc(G(s))}</div>
        <p class="note">${esc(TX(s, "bonus"))}</p>
      </div>`;
  }
  return "";
}

/* ---------- Schritt-Rendering ---------- */

function renderStep() {
  const step = session.queue[session.idx];
  if (step && ["audio4", "ne2de", "de2ne", "new", "build"].includes(step.type) && !step.item) {
    session.idx++;
    if (session.idx < session.total) return renderStep();
    return renderDone();
  }
  const pct = Math.min(100, Math.round(session.idx / session.total * 100));

  view.innerHTML = `
    <div class="session-top">
      <button class="icon-btn" id="exitBtn" title="${t("exit-title")}" aria-label="${t("exit-title")}">${ICONS.close}</button>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <button class="icon-btn" id="soundBtn" title="${t("sound-title")}" aria-label="${t("sound-title")}">${state.sound === "on" ? ICONS.speaker : ICONS.muted}</button>
    </div>
    ${stepHtml(step)}`;

  $("#exitBtn").addEventListener("click", confirmExit);
  $("#soundBtn").addEventListener("click", toggleSound);

  const ex = $(".exercise");

  bindPlainAudio(step, ex);

  // Info-Schritte ohne Wertung bekommen einen eigenen Weiter-Footer
  if (["new", "tip", "letterNew", "detIntro"].includes(step.type)) showFooterContinue(nextStep);

  if (["audio4", "ne2de", "de2ne"].includes(step.type)) {
    const pool = step.group ? step.group.items : allItems();
    const four = shuffle(distractors(step.item, pool).concat([step.item]));
    const box = $("[data-options]", ex);
    box.innerHTML = four.map((o, i) => {
      let label;
      if (step.type === "de2ne") label = `<span class="dev ne">${esc(o.ne)}</span><span class="tr inline">${esc(o.tr)}</span>`;
      else label = esc(G(o));
      return `<button class="option" data-id="${o.id}"><span class="key">${i + 1}</span><span>${label}</span></button>`;
    }).join("");
    if (step.type === "audio4") playItem(step.item, $("[data-audio]", ex));
    box.addEventListener("click", e => {
      const opt = e.target.closest(".option");
      if (!opt || opt.disabled) return;
      const correct = opt.dataset.id === step.item.id;
      opt.classList.add(correct ? "correct" : "wrong");
      if (!correct) box.querySelector(`[data-id="${step.item.id}"]`).classList.add("correct");
      box.querySelectorAll(".option").forEach(o => o.disabled = true);
      answerVocab(correct, step);
    });
    showFooterIdle();
  }

  if (step.type === "match") setupMatch(step, ex);
  if (step.type === "build") setupBuild(step, ex);

  if (step.type === "letter2sound" || step.type === "sound2letter") setupLetterQuiz(step, ex);

  if (step.type === "scenario") {
    const opts = [
      { key: "ta", label: `<span class="dev" style="font-size:20px;font-weight:700">तँ</span><span class="tr inline">ta</span>` },
      { key: "timi", label: `<span class="dev" style="font-size:20px;font-weight:700">तिमी</span><span class="tr inline">timi</span>` },
      { key: "tapaai", label: `<span class="dev" style="font-size:20px;font-weight:700">तपाईं</span><span class="tr inline">tapaai</span>` }
    ];
    const box = $("[data-options]", ex);
    box.innerHTML = opts.map((o, i) =>
      `<button class="option" data-key="${o.key}"><span class="key">${i + 1}</span><span>${o.label}</span></button>`).join("");
    box.addEventListener("click", e => {
      const opt = e.target.closest(".option");
      if (!opt || opt.disabled) return;
      const correct = opt.dataset.key === step.scene.answer;
      opt.classList.add(correct ? "correct" : "wrong");
      if (!correct) box.querySelector(`[data-key="${step.scene.answer}"]`).classList.add("correct");
      box.querySelectorAll(".option").forEach(o => o.disabled = true);
      answerSimple(correct, `det_${step.scene.answer}`, correct ? 10 : 0,
        correct ? t("fb-correct") : t("fb-wrong"),
        `${sceneWhy(step.scene)}`);
    });
    showFooterIdle();
  }

  if (step.type === "story") setupStoryStep(step, ex);
}

function sceneWhy(scene) {
  const why = {
    de: {
      ta: "तँ ist nur für kleine Kinder und ganz Intimes – für Erwachsene, die du nicht gut kennst, eine Beleidigung.",
      timi: "तिमी passt unter Gleichaltrige und Freunde – locker, aber nie herablassend.",
      tapaai: "तपाईं ist der respektvolle Weg – bei Fremden, Älteren und im Laden immer sicher."
    },
    en: {
      ta: "तँ is only for small children and very close family – for adults you don't know well, it's an insult.",
      timi: "तिमी fits peers and friends – casual, but never demeaning.",
      tapaai: "तपाईं is the respectful way – always safe with strangers, elders and in shops."
    }
  };
  return (why[state.lang] || why.de)[scene.answer];
}

function distractors(item, pool, n = 3) {
  if (!item) return [];
  const same = shuffle(pool.filter(i => i && i.id !== item.id));
  const rest = shuffle(allItems().filter(i => i.id !== item.id && !same.includes(i)));
  return same.concat(rest).slice(0, n);
}

function bindPlainAudio(step, ex) {
  // Audio-Buttons ohne Wertung: new/tip/letterNew/storyLine/detIntro (auch mehrere)
  const btns = [...ex.querySelectorAll("[data-audio]")];
  const fallbackId = step.item ? step.item.id
    : step.letter ? step.letter.id
    : step.tip ? GRAMMAR_AUDIO[step.tip.id] : null;
  btns.forEach(btn => {
    const id = btn.dataset.play || fallbackId;
    if (!id) return;
    btn.addEventListener("click", () => playId(id, btn));
  });
  if (["new", "letterNew", "audio4"].includes(step.type) && btns[0]) {
    const id = btns[0].dataset.play || fallbackId;
    if (id) setTimeout(() => playId(id, btns[0]), 250);
  }
}

/* ---------- Antworten & XP ---------- */

function answerVocab(correct, step) {
  session.answered++;
  if (correct) session.firstTry++;
  if (correct && !step.repeat) { // Quest-Zähler: nur echte erste Treffer
    const dd = dailyData(); dd.correct++; saveDaily(dd);
  }
  srsAnswer(step.item.id, correct);
  if (correct) { session.xpEarned += step.repeat ? 5 : 10; addXp(step.repeat ? 5 : 10); }
  blip(correct ? "good" : "bad");
  buzz(correct ? "good" : "bad");
  if (!correct && step.item && !session.requeued.has(step.item.id)) {
    session.requeued.add(step.item.id);
    session.queue.splice(Math.min(session.idx + 3, session.queue.length), 0,
      { type: step.type, item: step.item, group: step.group, repeat: true });
  }
  showFeedback(correct, step);
}

function answerSimple(correct, audioId, xp, verdict, why) {
  blip(correct ? "good" : "bad");
  buzz(correct ? "good" : "bad");
  if (correct && xp) {
    session.xpEarned += xp; addXp(xp);
    const dd = dailyData(); dd.correct++; saveDaily(dd); // Buchstaben/Detektiv zählen mit
  }
  showFeedbackRaw(correct, verdict, why, audioId);
}

/* ---------- Feedback-Leisten ---------- */

function showFooterIdle() { const old = $(".feedback"); if (old) old.remove(); }

function showFooterContinue(onNext) {
  showFooterIdle();
  const bar = document.createElement("div");
  bar.className = "feedback";
  bar.innerHTML = `
    <div class="feedback-inner">
      <span class="recap" style="flex:1">${t("fb-tap-continue")}</span>
      <button class="btn btn-primary" data-next>${t("continue")}</button>
    </div>`;
  document.body.appendChild(bar);
  $("[data-next]", bar).addEventListener("click", onNext);
  $("[data-next]", bar).focus();
}

function showFeedback(correct, step) {
  let recapHtml = "";
  if (step.item) {
    recapHtml = `${both(step.item)} &nbsp;=&nbsp; ${esc(G(step.item))}
      <button class="audio-btn small" data-replay aria-label="${t("aria-replay")}" style="margin-left:8px;vertical-align:middle">${ICONS.speaker}</button>`;
  } else if (step.group) {
    recapHtml = `<b>${esc(TX(step.group, "title"))}</b> – ${t("fb-all-pairs")}`;
  }
  showFeedbackRaw(correct, correct ? t("fb-correct") : t("fb-wrong"), recapHtml, step.item ? step.item.id : null);
}

function showFeedbackRaw(correct, verdict, recapHtml, replayId) {
  showFooterIdle();
  const bar = document.createElement("div");
  bar.className = "feedback " + (correct ? "good" : "bad");
  bar.innerHTML = `
    <div class="feedback-inner">
      <span class="verdict">${verdict}</span>
      <span class="recap">${recapHtml || ""}</span>
      <button class="btn btn-primary" data-next>${t("continue")}</button>
    </div>`;
  document.body.appendChild(bar);
  const replay = replayId ? $("[data-replay]", bar) : null;
  if (replay) replay.addEventListener("click", () => playId(replayId, replay));
  $("[data-next]", bar).addEventListener("click", nextStep);
  $("[data-next]", bar).focus();
}

function nextStep() {
  showFooterIdle();
  session.idx++;
  if (session.idx >= session.queue.length) renderDone();
  else renderStep();
}

/* ---------- Buchstaben-Quiz ---------- */

function setupLetterQuiz(step, ex) {
  const L = step.letter;
  const others = shuffle(LETTERS.filter(x => x.id !== L.id)).slice(0, 2);
  const box = $("[data-options]", ex);
  const three = shuffle(others.concat([L]));

  if (step.type === "letter2sound") {
    box.innerHTML = three.map((o, i) =>
      `<button class="option" data-id="${o.id}"><span class="key">${i + 1}</span><span>„${esc(o.sound)}“</span></button>`).join("");
  } else {
    box.innerHTML = three.map((o, i) =>
      `<button class="option glyph-opt" data-id="${o.id}"><span class="key">${i + 1}</span><span class="glyph-sm dev">${esc(o.ch)}</span></button>`).join("");
  }
  box.addEventListener("click", e => {
    const opt = e.target.closest(".option");
    if (!opt || opt.disabled) return;
    const correct = opt.dataset.id === L.id;
    opt.classList.add(correct ? "correct" : "wrong");
    if (!correct) box.querySelector(`[data-id="${L.id}"]`).classList.add("correct");
    box.querySelectorAll(".option").forEach(o => o.disabled = true);
    answerSimple(correct, L.id, correct ? 8 : 0,
      correct ? t("fb-correct") : t("fb-wrong"),
      `${t("fb-letter-sounds", { ch: esc(L.ch), s: esc(L.sound) })} – ${TX(L, "hint")}`);
  });
}

/* ---------- Story ---------- */

function setupStoryStep(step, ex) {
  const s = step.step;

  if (s.type === "narr" && s.reveal) {
    const chip = $("[data-reveal]", ex);
    if (chip) chip.addEventListener("click", () => {
      if (chip.dataset.claimed) return;
      chip.dataset.claimed = "1";
      chip.classList.add("open");
      chip.innerHTML = `💡 ${neTrText(TX(s.reveal, "a"))}`;
      session.xpEarned += 2;
      addXp(2, t("xp-revealed"));
      const dd = dailyData(); dd.correct++; saveDaily(dd);
      blip("good");
    });
  }

  if (s.type === "choice") {
    const box = $("[data-options]", ex);
    box.innerHTML = shuffle(s.options.map((o, i) => ({ o, i })))
      .map(({ o, i }, pos) => `
        <button class="option story-opt" data-i="${i}">
          <span class="key">${pos + 1}</span>
          <span><span class="dev ne" style="font-size:19px">${esc(o.ne)}</span><span class="tr inline">${esc(o.tr)}</span></span>
        </button>`).join("");
    box.addEventListener("click", e => {
      const opt = e.target.closest(".option");
      if (!opt || opt.disabled) return;
      const o = s.options[+opt.dataset.i];
      const correct = !!o.correct;
      opt.classList.add(correct ? "correct" : "wrong");
      box.querySelectorAll(".option").forEach(x => x.disabled = true); // genau eine Wertung pro Auswahl
      if (o.audio) playId(o.audio);
      blip(correct ? "good" : "bad");
      buzz(correct ? "good" : "bad");
      if (correct) {
        session.xpEarned += 10; addXp(10, t("chip-story"));
        const dd = dailyData(); dd.correct++; saveDaily(dd);
      }
      showFeedbackRaw(correct, correct ? t("fb-exact") : t("fb-wrong"),
        `${neTrText(o.why ? TX(o, "why") : G(o))}${o.de && o.why ? `<br><small>${esc(G(o))}</small>` : ""}`, o.audio);
    });
  } else {
    showFooterContinue(nextStep);
  }
}

/* ---------- Paare ---------- */

function setupMatch(step, ex) {
  // Zaehle nur die GERENDERTEN Tiles (stepHtml deckelt bei >6 auf 6 Paare)
  const visiblePairs = ex.querySelectorAll(".match-tile[data-side='ne']").length;
  let selNe = null, selDe = null, remaining = visiblePairs, wrongPairs = 0;
  const wrongIds = new Set();
  ex.addEventListener("click", e => {
    const tile = e.target.closest(".match-tile");
    if (!tile || tile.classList.contains("done")) return;
    if (tile.dataset.side === "ne") { selNe = tile; } else { selDe = tile; }
    tile.classList.add("selected");
    if (selNe && selDe) {
      if (selNe.dataset.id === selDe.dataset.id) {
        [selNe, selDe].forEach(t => { t.classList.remove("selected"); t.classList.add("done"); });
        selNe = selDe = null;
        remaining--;
        if (remaining === 0) {
          session.answered++;
          const firstTry = wrongPairs === 0;
          if (firstTry) {
            session.firstTry++;
            const dd = dailyData(); dd.correct++; saveDaily(dd);
          }
          const xp = firstTry ? 10 : 5;
          session.xpEarned += xp; addXp(xp);
          blip("good"); buzz("good");
          showFeedbackRaw(true, t("fb-correct"), `<b>${esc(TX(step.group, "title"))}</b> – ${t("fb-all-pairs")}`, null);
        }
      } else {
        wrongPairs++;
        wrongIds.add(selNe.dataset.id);
        const a = selNe, b = selDe;
        a.classList.add("wrong"); b.classList.add("wrong");
        blip("bad"); buzz("bad");
        setTimeout(() => { a.classList.remove("wrong"); b.classList.remove("wrong"); }, 450);
        selNe = selDe = null;
      }
    }
  });
  showFooterIdle();
}

/* ---------- Satz bauen ---------- */

function setupBuild(step, ex) {
  const bank = [...ex.querySelectorAll("[data-bank]")].map(b => b.dataset.token);
  const trMap = {};
  ex.querySelectorAll("[data-bank]").forEach(b => { trMap[b.dataset.token] = b.querySelector(".tr"); });
  const solutionTokens = step.item.ne.replace(/[।?]$/g, "").trim().split(/\s+/);
  const stage = $("[data-stage]", ex);
  const placed = [];

  function refresh() {
    stage.innerHTML = placed.map(p => {
      const tr = (trMap[bank[p]] && trMap[bank[p]].textContent) || "";
      return `<button class="tile dev" data-placed="${p}" data-token="${esc(bank[p])}">${esc(bank[p])}<span class="tr inline">${esc(tr)}</span></button>`;
    }).join("");
    ex.querySelectorAll("[data-bank]").forEach(b => b.classList.toggle("used", placed.includes(+b.dataset.bank)));
  }

  ex.addEventListener("click", e => {
    const bankBtn = e.target.closest("[data-bank]");
    const placedBtn = e.target.closest("[data-placed]");
    if (bankBtn && !bankBtn.classList.contains("used")) {
      placed.push(+bankBtn.dataset.bank);
      refresh();
    } else if (placedBtn) {
      const pos = placed.indexOf(+placedBtn.dataset.placed);
      if (pos !== -1) placed.splice(pos, 1);
      refresh();
    }
  });

  $("[data-check]", ex).addEventListener("click", e => {
    const checkBtn = e.currentTarget;
    if (checkBtn.disabled || !placed.length) return;
    const attempt = placed.map(i => bank[i]).join(" ");
    const correct = attempt === solutionTokens.join(" ");
    checkBtn.disabled = true;
    answerVocab(correct, step);
  });
  refresh();
  showFooterIdle();
}

/* ---------- Verlassen ---------- */

function confirmExit() {
  if ($(".modal-backdrop")) return;
  const overlay = document.createElement("div");
  overlay.className = "modal-backdrop";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-title">${t("exit-title")}</div>
      <p>${t("exit-body")}</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-stay>${t("exit-stay")}</button>
        <button class="btn btn-primary" data-leave>${t("exit-leave")}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  $("[data-stay]", overlay).addEventListener("click", () => overlay.remove());
  $("[data-leave]", overlay).addEventListener("click", () => { overlay.remove(); showFooterIdle(); renderHome(); });
  overlay.addEventListener("keydown", e => { if (e.key === "Escape") overlay.remove(); });
  $("[data-stay]", overlay).focus();
}

/* ---------- Abschluss ---------- */

function renderDone() {
  const def = session.def;
  const acc = session.answered ? Math.round(session.firstTry / session.answered * 100) : 100;
  const bonus = def.xpBonus || 20;
  const xpBefore = getXp();
  const stopsDoneBefore = JOURNEY.stops.map(st => stopDone(st, xpBefore)); // Station = Kapitel: Stand VOR dieser Session

  if (bonus) { session.xpEarned += bonus; addXp(bonus, t("xp-session-done")); }
  completeStreakDay();
  /* Tagesziel: Szene-Aufgabe zählt nur für die NEXTE Szene (Wiederholen gilt nicht),
     fehlt keine neue Szene mehr, ist die Aufgabe automatisch erfüllt */
  const nxScene = nextSceneDef();
  const dd = dailyData();
  dd.sessions++;
  if ((def.type === "scene" || def.type === "story") && (!nxScene || nxScene.scene.id === def.id)) {
    dd.scene = true;
    if (!dd.sceneId && def.scene) dd.sceneId = def.scene.id; // Sprache neutral: ID statt Titel (heutige Karte loest beim Render auf)
  }
  if (def.type === "refresh") dd.review = true;
  let goalNow = false;
  if (!dd.goalBonus && (dd.scene || !nxScene) && dd.review) { dd.goalBonus = true; goalNow = true; }
  saveDaily(dd);
  if (goalNow) { session.xpEarned += 15; addXp(15, t("today-goal-done")); }
  store.set("sikai_done_" + def.id, store.get("sikai_done_" + def.id, 0) + 1);
  if (def.type === "group") {
    bumpGroup(def.group.id);
    srsSeed(def.group.items.map(i => i.id));
    store.set("sikai_tiprot", (store.get("sikai_tiprot", 0) + 1) % GRAMMAR_TIPS.length);
  }
  if (def.type === "letters") srsSeed(LETTERS.map(l => l.id));
  if (def.type === "detective") srsSeed(DETECTIVE.scenes.map(s => s.id));
  if (def.type === "refresh") srsSeed(srsDueIds()); // nicht fällige bleiben, neue fällige neu gesetzt
  if (def.type === "scene") srsSeed((def.scene.items || []).concat(def.scene.warmups || []));

  /* Neue Station = Kapitel wurde gerade komplett gemeistert (nicht: XP-Schwelle gekreuzt) */
  const nextStop = JOURNEY.stops.find((s, i) => !stopsDoneBefore[i] && stopDone(s, getXp()));
  view.innerHTML = `
    <div class="done-hero">
      <div class="big">${ICONS.mountain_snow} ${t("done-big")}</div>
      <div class="dev-big">बधाई छ! <span class="tr">(badhaai chha)</span></div>
    </div>
    <div class="stats">
      <div class="stat"><b>+${session.xpEarned}</b><span>${t("done-xp")}</span></div>
      <div class="stat"><b>${session.firstTry}/${session.answered}</b><span>${t("done-first-try")}</span></div>
      <div class="stat"><b>${streakData().count}</b><span>${streakData().count === 1 ? t("unit-day") : t("unit-days")} ${t("streak")}</span></div>
    </div>
    ${nextStop ? `<div class="arrive-card">🧭 ${t("done-arrive", { stop: esc(nextStop.name), sub: esc(TX(nextStop, "sub")) })}</div>` : ""}
    ${goalNow ? `<div class="arrive-card">🔥 ${t("done-goal")}</div>` : ""}
    <div class="done-actions">
      <button class="btn btn-ghost" id="againBtn">${t("done-again")}</button>
      <button class="btn btn-primary" id="homeBtn">${t("done-home")}</button>
    </div>`;
  $("#againBtn").addEventListener("click", () => startSessionById(def.id));
  $("#homeBtn").addEventListener("click", renderHome);
  blip("good");
}

/* ---------- Tastatur ---------- */

document.addEventListener("keydown", e => {
  if ($(".modal-backdrop")) return;
  const next = $("[data-next]");
  if (next && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next.click(); return; }
  const opt = document.querySelectorAll(".option:not(:disabled)");
  if (opt.length && /^[1-4]$/.test(e.key)) opt[+e.key - 1].click();
});

/* ---------- Los ---------- */

state.tab = (location.hash || "#start").slice(1);
if (!TABS.some(t => t.id === state.tab)) state.tab = "start";
window.addEventListener("hashchange", () => {
  const t = location.hash.slice(1);
  if (TABS.some(x => x.id === t) && t !== state.tab) { state.tab = t; renderHome(); }
});

applyTheme(state.theme);
applyScript(state.script);
bindHeader();
$("#themeBtn").innerHTML = state.theme === "dark" ? ICONS.sun : ICONS.moon;
refreshStaticChrome();
renderHome();
maybeShowLangPicker();

initPwa();

/* Demo/Screenshot-Hooks: ?demo=... */
(() => {
  const demo = new URLSearchParams(location.search).get("demo");
  if (!demo || demo === "home") return;

  if (demo === "tabcheck") {
    setTimeout(() => {
      const pre = document.createElement("pre");
      pre.id = "tabgeo";
      pre.textContent = JSON.stringify({innerW: innerWidth, dpr: devicePixelRatio, docW: document.documentElement.scrollWidth, btns: [...document.querySelectorAll("#tabbar button")].map(b => {
        const r = b.getBoundingClientRect();
        return { tab: b.dataset.tab, x: Math.round(r.x), w: Math.round(r.width), right: Math.round(r.right) };
      }) });
      document.body.appendChild(pre);
    }, 300);
  }

  if (demo === "scenetest") {
    // Teste neTrText mit einer Devanagari-Note
    startSessionById("c1s4");
    const ns = session.queue.find(x => x.type === "new" && x.item && x.item.note && /[ऀ-ॿ]/.test(x.item.note));
    if (ns) { session.idx = session.queue.indexOf(ns); renderStep(); }
  }

  if (demo === "scene") {
    startSessionById(new URLSearchParams(location.search).get("s") || "c1s1");
    if (new URLSearchParams(location.search).get("c")) {
      const cs = session.queue.find(x => x.type === "story" && x.step.type === "choice");
      if (cs) { session.idx = session.queue.indexOf(cs); renderStep(); }
    }
  }

  if (demo === "settings") { state.tab = "einstellungen"; renderHome(); }

  if (demo === "map") {
    state.tab = "start";
    const xpv = new URLSearchParams(location.search).get("xpv");
    if (xpv) state.demoXp = parseInt(xpv, 10) || 0;
    document.body.classList.add("demo-maponly");
    if (state.demoXp != null) { updateHeaderStats(); renderHome(); } // Karte mit Demo-XP neu zeichnen
  }

  if (demo === "todaycard") {
    // Screenshot-Hook: Heute-Karte in drei Zuständen (fresh / scene / complete)
    const st8 = new URLSearchParams(location.search).get("state") || "fresh";
    ["sikai_daily", "sikai_srs", "sikai_streak"].forEach(k => localStorage.removeItem(k));
    chapterList().forEach(c => c.scenes.forEach(sc => localStorage.removeItem("sikai_done_" + sc.id)));
    localStorage.setItem("sikai_xp", "0");
    if (st8 !== "fresh") {
      store.set("sikai_done_c1s1", 1);
      store.set("sikai_streak", { count: 3, last: todayStr() });
      const srs = {};
      for (let i = 1; i <= 9; i++) srs["l1_0" + i] = { s: 1, due: 1 };
      store.set("sikai_srs", srs);
      store.set("sikai_daily", st8 === "complete"
        ? { date: todayStr(), xp: 240, sessions: 2, correct: 19, scene: true, review: true, goalBonus: true, sceneTitle: "Landung" }
        : { date: todayStr(), xp: 120, sessions: 1, correct: 8, scene: true, review: false, goalBonus: false, sceneTitle: "Landung" });
    }
    state.tab = "start"; renderHome();
  }

  if (demo === "selftest") {
    (async () => {
      const log = [];
      let pass = true;
      state.lang = "de"; store.set("sikai_lang", "de"); // Selbsttest-Checks pruefen deutsche Texte
      /* Deterministischer Start: alter Spielstand (z.B. vom manuellen Testen) wuerde die
         reset-*-Checks falsch brechen lassen - alles auf Null, Spracheinstellung behalten */
      Object.keys(localStorage).filter(k => k.indexOf("sikai_") === 0 && k !== "sikai_lang").forEach(k => localStorage.removeItem(k));
      renderHome();
      const check = (name, ok, detail = "") => {
        log.push(name + ": " + (ok ? "ok" : "FEHLER" + (detail ? " " + detail : "")));
        if (!ok) pass = false;
      };
      try {
        // 1) Gruppen-Session mit Paaren (früherer Blocker) – in g3 folgt danach Satz-Bau
        startSessionById("g3");
        const mstep = session.queue.find(s => s.type === "match");
        session.idx = session.queue.indexOf(mstep);
        renderStep();
        await new Promise(r => setTimeout(r, 50));
        for (const item of mstep.group.items) {
          document.querySelector(`.match-tile[data-id="${item.id}"][data-side="ne"]`).click();
          document.querySelector(`.match-tile[data-id="${item.id}"][data-side="de"]`).click();
        }
        await new Promise(r => setTimeout(r, 500));
        check("match-feedback", !!document.querySelector(".feedback.good"));
        const next = document.querySelector("[data-next]");
        check("match-weiter", !!next);
        if (next) next.click();
        await new Promise(r => setTimeout(r, 100));
        check("match-next-step", !!document.querySelector(".ex-chip"));

        // 2) Satz-Bau in g3 (Bank-Mapping + Chip-Entfernung + Prüf-Guard)
        startSessionById("g3");
        const bstep = session.queue.find(s => s.type === "build");
        session.idx = session.queue.indexOf(bstep);
        renderStep();
        await new Promise(r => setTimeout(r, 50));
        const solution = bstep.item.ne.replace(/[।?]$/g, "").trim().split(/\s+/);
        for (const tok of solution) {
          const btn = [...document.querySelectorAll("[data-bank]")]
            .find(b => !b.classList.contains("used") && b.dataset.token === tok);
          check("bank-token(" + tok + ")", !!btn);
          if (btn) btn.click();
        }
        const stage = document.querySelector("[data-stage]");
        check("build-placed", stage.querySelectorAll(".tile").length === solution.length,
          stage.querySelectorAll(".tile").length + "/" + solution.length);
        const placedTexts = [...stage.querySelectorAll(".tile")].map(t => t.dataset.token);
        check("build-placed-texts", placedTexts.join(" ") === solution.join(" "), placedTexts.join("|"));
        const chips = [...stage.querySelectorAll(".tile")];
        if (chips[1]) chips[1].click();
        await new Promise(r => setTimeout(r, 50));
        const texts = [...document.querySelectorAll("[data-stage] .tile")].map(t => t.dataset.token);
        check("build-remove-chip",
          texts.length === solution.length - 1 && !texts.includes(solution[1]) && texts.includes(solution[0]),
          texts.join("|"));
        document.querySelector("[data-check]").click();
        await new Promise(r => setTimeout(r, 100));
        check("build-check-disabled", document.querySelector("[data-check]").disabled);
        check("build-feedback", !!document.querySelector(".feedback"));

        // 3) Alle Session-Typen bauen sich ohne leere Queues
        for (const id of ["g1", "g2", "g3", "g4", "refresh", "letters", "detective", "story"]) {
          const def = sessionDefById(id);
          const q = buildQueue(def);
          check("queue(" + id + ")", q.length > 0, q.length + " Steps");
        }

        // 3b) Info-Schritte haben einen Weiter-Button (früherer Deadlock-Blocker)
        startSessionById("g1");
        const tstep = session.queue.find(s => s.type === "tip");
        session.idx = session.queue.indexOf(tstep);
        renderStep();
        check("tip-weiter", !!document.querySelector("[data-next]"));
        document.querySelector("[data-next]").click();

        startSessionById("letters");
        check("letterNew-weiter", document.querySelector(".exercise") &&
          !!document.querySelector("[data-next]"));
        document.querySelector("[data-next]").click();

        startSessionById("detective");
        check("detIntro-weiter", document.querySelector(".exercise") &&
          !!document.querySelector("[data-next]"));

        // 3c) Vokabeltrainer ohne Fällige: startet trotzdem (freies Üben)
        localStorage.removeItem("sikai_srs");
        renderHome();
        startSessionById("refresh");
        check("trainer-startet-ohne-faellige", !!document.querySelector(".session-top") &&
          !!document.querySelector(".exercise"));

        renderHome(); // Challenge-Tests brauchen die Startseite

        // 3d) todayStr liefert lokales Datumsformat
        check("todaystr-format", /^\d{4}-\d{2}-\d{2}$/.test(todayStr()));

        // 3e) Challenge-Hilfe: Uebersetzung aufdeckbar
        const helpBtn = document.querySelector(".ch-help-btn");
        check("challenge-hilfe-da", !!helpBtn);
        if (helpBtn) {
          helpBtn.click();
          const g = document.querySelector(".ch-gloss");
          check("challenge-hilfe-offen", g && !g.hasAttribute("hidden"));
          helpBtn.click();
          check("challenge-hilfe-zu", g && g.hasAttribute("hidden"));
        }

        // 3f) Challenge-Ritual: ein Klick bewirkt noch nichts, zwei schließen ab
        const chBtn = document.querySelector("#challengeBtn");
        check("challenge-btn-da", !!chBtn && !chBtn.disabled);
        if (chBtn && !chBtn.disabled) {
          chBtn.click();
          check("challenge-erst-armed", !challengeDoneToday());
          chBtn.click();
          await new Promise(r => setTimeout(r, 100));
          check("challenge-dann-erledigt", challengeDoneToday());
        }

        // 4) Story-Choice antwortbar + XP nur einmal vergebbar
        startSessionById("story");
        const narrStep = session.queue.find(s => s.type === "story" && s.step.type === "narr" && s.step.reveal);
        session.idx = session.queue.indexOf(narrStep);
        renderStep();
        const chipBtn = document.querySelector("[data-reveal]");
        check("narr-reveal-da", !!chipBtn);
        if (chipBtn) {
          const xpVor = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          chipBtn.click();
          await new Promise(r => setTimeout(r, 50));
          const xpNach = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          check("narr-reveal-antwort", chipBtn.classList.contains("open") && xpNach - xpVor === 2);
          chipBtn.click(); // kein Doppel-XP
          const xpNach2 = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          check("narr-reveal-once", xpNach2 === xpNach);
        }
        const cstep = session.queue.find(s => s.step && s.step.type === "choice");
        session.idx = session.queue.indexOf(cstep);
        renderStep();
        const correctOpt = [...document.querySelectorAll(".story-opt")]
          .find(o => cstep.step.options[+o.dataset.i].correct);
        check("story-choice-rendered", !!correctOpt);
        if (correctOpt) {
          const xpBefore = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          correctOpt.click();
          await new Promise(r => setTimeout(r, 50));
          const xpAfter = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          check("story-choice-feedback", !!document.querySelector(".feedback.good"));
          check("story-xp-once", xpAfter - xpBefore === 10, (xpAfter - xpBefore) + " XP");
          correctOpt.click(); // zweiter Klick darf nichts mehr geben
          await new Promise(r => setTimeout(r, 50));
          const xpAfter2 = JSON.parse(localStorage.getItem("sikai_xp") || "0");
          check("story-xp-no-farm", xpAfter2 === xpAfter, xpAfter2 - xpAfter + " XP");
        }
        // 4b) Basis-Bestand + Freischaltung entlang der Reise
        check("basis-162-woerter", allItems().length === 162, String(allItems().length));
        check("basis-21-gruppen", LESSONS[0].groups.length === 21, String(LESSONS[0].groups.length));
        localStorage.setItem("sikai_xp", "0");
        renderHome();
        check("tabbar-da", document.querySelectorAll("#tabbar button").length === 3);
        state.tab = "start"; renderHome();
        check("start-zeigt-karte-und-stationen-vorab", !!document.querySelector(".map-hero"));
        check("reset-keine-station-erreicht", document.querySelectorAll(".stop.done").length === 0,
          "done-Flags: " + JSON.stringify(Object.keys(localStorage).filter(k => /^sikai_done_/.test(k))));
        check("reset-genau-eine-aktiv", document.querySelectorAll(".stop.next").length === 1);
        check("reset-genau-ein-du-bist-hier", document.querySelectorAll(".pulse-ring").length === 1);
        check("reset-thamel-gesperrt", (function () {
          const rows = [...document.querySelectorAll(".stop")];
          return rows[1] && rows[1].classList.contains("locked");
        })());
        state.tab = "ueben"; renderHome();
        check("basis-g5-gesperrt-bei-0", !!document.querySelector('[data-session="g5"][data-locked="1"]'));
        check("basis-g10-gesperrt-bei-0", !!document.querySelector('[data-session="g10"][data-locked="1"]'));
        check("basis-g11-gesperrt-bei-0", !!document.querySelector('[data-session="g11"][data-locked="1"]'));
        // === PHASE B: Kapitel 1-4 komplett → Gruppen frei ===
        localStorage.setItem("sikai_xp", "200");
        chapterList().slice(0, 4).forEach(c => c.scenes.forEach(sc => store.set("sikai_done_" + sc.id, 1)));
        renderHome();
        check("basis-g5-frei-nach-kapiteln", !document.querySelector('[data-session="g5"][data-locked="1"]'));
        check("basis-empfehlung-nicht-gesperrt", (function () {
          const rec = recommendedSession();
          const gd = LESSONS[0].groups.find(g => g.id === rec.id);
          return !gd || !groupLocked(gd);
        })());
        startSessionById("g5");
        check("basis-g5-queue-laedt", session.def && session.def.id === "g5" && session.queue.length > 5);
        startSessionById("g11");
        check("basis-g11-mit-satzbau", session.def && session.def.id === "g11" &&
          session.queue.some(st => st.type === "build"));

        // === PHASE C: Kapitel-Check mit weniger Kapiteln (nur 1+2) ===
        state.tab = "ueben"; renderHome();
        check("ueben-zeigt-kapitel", !!document.querySelector('[data-session="c1s1"]'));
        check("ueben-kapitel9-gesperrt", !!document.querySelector('[data-session="c9s1"][data-locked="1"]'));
        check("kapitel-9-defs-da", sessionDefById("c9s4") && sessionDefById("c9s4").type === "scene");

        // === PHASE D: Kapitel-Progression (Kapitel 1 → Kathmandu erreicht) ===
        chapterList().forEach(c => c.scenes.forEach(sc => localStorage.removeItem("sikai_done_" + sc.id)));
        localStorage.setItem("sikai_xp", "200");
        localStorage.removeItem("sikai_srs");
        state.tab = "start"; renderHome();
        check("nach-xp-ohne-kapitel-nichts-erreicht", document.querySelectorAll(".stop.done").length === 0);
        state.tab = "ueben"; renderHome();
        check("ueben-kapitel4-gesperrt-ohne-ch", !!document.querySelector('[data-session="c4s1"][data-locked="1"]'));
        startSessionById("c2s1");
        check("kapitel2-start-geblockt", document.body.dataset.screen === "tabs");
        state.tab = "start"; renderHome();
        check("pass-da", !!document.querySelector(".passport-card") && document.querySelectorAll(".stamp").length === 9);
        localStorage.setItem("sikai_xp", "10");
        CHAPTER1.scenes.forEach(sc => store.set("sikai_done_" + sc.id, 1));
        renderHome();
        check("kapitel1-fertig-kathmandu-erreicht", document.querySelector(".stop.done") !== null);
        check("storycard-zeigt-kapitel2", (document.querySelector(".story-card-title") || {}).textContent === chapterList()[1].title);
        startSessionById("c2s1");
        check("kapitel2-startet-nach-kapitel1", session.def && session.def.id === "c2s1" && session.queue.length > 3);

        // === PHASE E: Trainer-Scoping ===
        localStorage.setItem("sikai_xp", "0");
        localStorage.removeItem("sikai_srs");
        CHAPTER1.scenes.forEach(sc => localStorage.removeItem("sikai_done_" + sc.id));
        chapterList().slice(1).forEach(c => c.scenes.forEach(sc => localStorage.removeItem("sikai_done_" + sc.id)));
        renderHome();
        startSessionById("refresh");
        const trainerIds = session.queue.filter(st => st.item).map(st => st.item.id);
        check("trainer-nur-frei-bei-0", trainerIds.length > 0 && trainerIds.every(id => id.startsWith("l1_") || id.startsWith("l18_")),
          trainerIds.slice(0, 3).join(","));
        localStorage.setItem("sikai_xp", "200");
        localStorage.removeItem("sikai_srs");
        chapterList().slice(0, 4).forEach(c => c.scenes.forEach(sc => store.set("sikai_done_" + sc.id, 1)));
        renderHome();
        startSessionById("refresh");
        const trainerIds2 = session.queue.filter(st => st.item).map(st => st.item.id);
        check("trainer-nur-frei-bei-200", trainerIds2.length > 0 &&
          trainerIds2.every(id => {
            const g = LESSONS[0].groups.find(gr => gr.items.some(it => it.id === id));
            return !g || !groupLocked(g);
          }), trainerIds2.slice(0, 3).join(","));

        // === PHASE F: Tagesziel – Heute-Karte (1 Szene + 1 Wiederholung) ===
        const fastFinish = async () => {
          let guard = 0, stuck = 0, lastSig = "";
          while (!document.querySelector(".done-hero") && guard++ < 120) {
            const st = session.queue[session.idx];
            const nxt = document.querySelector("[data-next]");
            if (nxt) { nxt.click(); stuck = 0; await new Promise(r => setTimeout(r, 20)); continue; }
            const neT = document.querySelector(".match-tile[data-side='ne']:not(.done)");
            if (neT) {
              const deT = document.querySelector(".match-tile[data-side='de'][data-id=\"" + neT.dataset.id + "\"]");
              neT.click(); if (deT) deT.click();
              stuck = 0; await new Promise(r => setTimeout(r, 30)); continue;
            }
            const opts = [...document.querySelectorAll(".option:not(:disabled), .story-opt:not(:disabled)")];
            if (opts.length && st) {
              let good = null;
              if (st.item) good = opts.find(b => b.dataset && b.dataset.id === st.item.id);
              if (!good && st.step && st.step.options) good = opts.find(b => st.step.options[+b.dataset.i] && st.step.options[+b.dataset.i].correct);
              if (!good && st.item) good = opts.find(b => b.textContent.includes(st.item.de));
              (good || opts[0]).click();
              stuck = 0; await new Promise(r => setTimeout(r, 30)); continue;
            }
            // nichts Klickbares: kurz warten (virtuelle Zeit zieht nach), dann selbst heilen
            const sig = session.idx + "|" + (document.querySelector(".feedback") ? 1 : 0) + "|" + document.querySelectorAll(".option:disabled").length;
            if (sig !== lastSig) { lastSig = sig; stuck = 0; await new Promise(r => setTimeout(r, 40)); continue; }
            if (++stuck <= 3) { await new Promise(r => setTimeout(r, 40)); continue; }
            nextStep(); // Selbstheilung: erzwingt Weiter (Ende → renderDone)
            stuck = 0;
          }
          return !!document.querySelector(".done-hero");
        };
        localStorage.setItem("sikai_xp", "0");
        ["sikai_daily", "sikai_srs", "sikai_streak"].forEach(k => localStorage.removeItem(k));
        chapterList().forEach(c => c.scenes.forEach(sc => localStorage.removeItem("sikai_done_" + sc.id)));
        state.tab = "start"; renderHome();
        check("heute-karte-da", !!document.querySelector("#todayCard"));
        check("heute-zwei-aufgaben", document.querySelectorAll("#todayCard .tc-task").length === 2);
        check("heute-start-offen", document.querySelectorAll("#todayCard .tc-task.done").length === 0);
        check("heute-altes-ziel-weg", !document.querySelector("#bonusBtn") && !document.querySelector(".goal-ring"));
        const sceneSub0 = (document.querySelector('[data-goal="scene"] small') || {}).textContent || "";
        check("heute-szene-zeigt-kapitel1", sceneSub0.indexOf("Kapitel 1") === 0 && sceneSub0.indexOf("Szene 1") > -1, sceneSub0);
        document.querySelector('[data-goal="scene"]').click();
        check("heute-szene-startet-c1s1", session.def && session.def.id === "c1s1" && document.body.dataset.screen === "session");
        check("heute-szene-durchspielbar", await fastFinish());
        check("heute-szene-erledigt", dailyData().scene === true, JSON.stringify(dailyData()));
        check("heute-streak-gezaehlt", streakData().last === todayStr() && streakData().count >= 1);
        state.tab = "start"; renderHome();
        check("heute-karte-1-haken", document.querySelectorAll("#todayCard .tc-task.done").length === 1);
        check("heute-bonus-noch-offen", dailyData().goalBonus !== true);
        // Weitere neue Szenen am selben Tag überschreiben den Titel NICHT
        const titelErste = dailyData().sceneId;
        startSessionById("c1s2");
        await fastFinish();
        check("heute-titel-bleibt-erste", dailyData().sceneId === titelErste,
          JSON.stringify(dailyData().sceneId) + " vs " + JSON.stringify(titelErste));
        check("heute-titel-aufloesbar", !dailyData().sceneId || dailySceneTitle(dailyData()) === "Landung",
          dailySceneTitle(dailyData()));
        state.tab = "start"; renderHome();
        let goalAwards = 0;
        const origAddXp = window.addXp;
        window.addXp = function (n, label) { if (label === "Tagesziel komplett") goalAwards++; return origAddXp(n, label); };
        document.querySelector('[data-goal="review"]').click();
        check("heute-review-startet-trainer", session.def && session.def.id === "refresh");
        check("heute-review-durchspielbar", await fastFinish());
        window.addXp = origAddXp;
        check("heute-review-erledigt", dailyData().review === true);
        check("heute-bonus-genau-once", goalAwards === 1 && dailyData().goalBonus === true, goalAwards + " Awards");
        state.tab = "start"; renderHome();
        check("heute-karte-komplett", document.querySelectorAll("#todayCard .tc-task.done").length === 2 &&
          !!document.querySelector("#todayCard .tc-note.ok"));
        goalAwards = 0;
        window.addXp = function (n, label) { if (label === "Tagesziel komplett") goalAwards++; return origAddXp(n, label); };
        startSessionById("refresh");
        await fastFinish();
        window.addXp = origAddXp;
        check("heute-kein-doppelbonus", goalAwards === 0, goalAwards + " Awards");
        store.set("sikai_daily", Object.assign({}, dailyData(), { date: yesterdayStr() }));
        renderHome();
        check("heute-neuer-tag-zurueck", document.querySelectorAll("#todayCard .tc-task.done").length === 0);
        localStorage.removeItem("sikai_daily");
        chapterList().forEach(c => c.scenes.forEach(sc => store.set("sikai_done_" + sc.id, 1)));
        renderHome();
        check("heute-alle-szenen-auto-done", document.querySelector('[data-goal="scene"]').classList.contains("done"));
        check("heute-alle-meister-text", ((document.querySelector('[data-goal="scene"] small') || {}).textContent || "").indexOf("Alle Kapitel") === 0);

        // 4c) Stationen-Balken folgt dem Kapitel (Alt-XP-Schwellen dürfen ihn nicht füllen)
        {
          localStorage.setItem("sikai_xp", JSON.stringify(500)); // weit über Thamels altem 30-XP-Schwellwert
          Object.keys(localStorage).filter(k => /^sikai_done_/.test(k)).forEach(k => localStorage.removeItem(k));
          const ch2 = chapterList()[1];
          chapterList()[0].scenes.forEach(sc => store.set("sikai_done_" + sc.id, 1)); // Kapitel 1 komplett
          store.set("sikai_done_" + ch2.scenes[0].id, 1); // Kapitel 2: erste Szene gemeistert
          state.tab = "start"; renderHome();
          const fills = [...document.querySelectorAll(".trail .stop.next .progress-fill")];
          check("stationen-balken-nur-naechste", fills.length === 1, fills.length + " Balken");
          const expect = Math.round(1 / ch2.scenes.length * 100) + "%";
          if (fills[0]) check("stationen-balken-kapitelbasiert", fills[0].style.width === expect,
            fills[0].style.width + " statt " + expect);
          check("stationen-ohne-alt-xp-text", !/noch -?\d+ XP/.test(document.body.textContent));
        }

        // 4d) Sprache DE<->EN: komplette Umstellung, Fortschritt bleibt, kein Deutsch in EN
        {
          const xpVor = getXp();
          const doneVor = Object.keys(localStorage).filter(k => /^sikai_done_/.test(k)).length;
          const srsVor = JSON.stringify(srsAll());
          applyLang("en");
          check("lang-en-gesetzt", state.lang === "en" && store.get("sikai_lang", null) === "en");
          check("lang-en-tabbar", [...document.querySelectorAll("#tabbar span")].some(x => x.textContent === "Home"));
          check("lang-en-fortschritt-xp", getXp() === xpVor, getXp() + " statt " + xpVor);
          check("lang-en-fortschritt-done", Object.keys(localStorage).filter(k => /^sikai_done_/.test(k)).length === doneVor);
          check("lang-en-fortschritt-srs", JSON.stringify(srsAll()) === srsVor);
          const germanWords = /(Kapitel\s\d|Szene\s\d|Wiederholung|Tagesziel|Einstellungen|Stationen 1|Wörter fällig|geschafft!|Zur Reise|Reise-Pass|Vokabeltrainer|gemeistert – wiederholbar|Teil der Geschichte)/;
          const tabs = ["start", "ueben", "einstellungen"];
          const treffer = [];
          for (const tb of tabs) { state.tab = tb; renderHome(); if (germanWords.test(document.getElementById("view").textContent)) treffer.push(tb); }
          check("lang-en-kein-deutsch-uebrig", treffer.length === 0, treffer.join(","));
          applyLang("de");
          check("lang-zurueck-de", state.lang === "de" && store.get("sikai_lang", null) === "de");
          check("lang-zurueck-fortschritt", getXp() === xpVor);
          state.tab = "start"; renderHome();
        }

        // 5) Einstellungen: Tab-Seite, Schalter, Reset (2-Klick, echt)
        state.tab = "einstellungen"; renderHome();
        {
          check("settings-tab-da", !!document.querySelector(".settings-page"));
          const hSwitch = document.querySelector('[data-set="haptic"]');
          check("settings-haptic-da", !!hSwitch);
          if (hSwitch) {
            hSwitch.click();
            await new Promise(r => setTimeout(r, 30));
            check("settings-haptic-speichert", store.get("sikai_haptic", "on") === "off");
            hSwitch.click();
            await new Promise(r => setTimeout(r, 30));
            check("settings-haptic-zurueck", store.get("sikai_haptic", "on") === "on");
          }
          const allB = document.querySelector("#resetAllBtn");
          check("reset-alles-btn-da", !!allB);
          const voc = document.querySelector("#resetVocabBtn");
          check("reset-vokabular-btn-da", !!voc);
          if (voc) {
            localStorage.setItem("sikai_srs", JSON.stringify({ l1_01: { s: 2, due: 1 } }));
            voc.click();
            check("reset-vokabular-armed", voc.classList.contains("armed"));
            voc.click();
            await new Promise(r => setTimeout(r, 100));
            check("reset-vokabular-wirklich", !localStorage.getItem("sikai_srs"));
          }
          if (allB) {
            localStorage.setItem("sikai_xp", JSON.stringify(999));
            allB.click();
            check("reset-alles-armed", allB.classList.contains("armed"));
            allB.click();
            await new Promise(r => setTimeout(r, 150));
            check("reset-alles-xp0", JSON.parse(localStorage.getItem("sikai_xp") || "0") === 0);
            check("reset-alles-srs-weg", !localStorage.getItem("sikai_srs"));
            check("reset-alles-modal-zu", !document.querySelector(".settings-backdrop"));
          }
        }
      } catch (err) {
        pass = false;
        log.push("EXCEPTION: " + err.message);
      }
      const pre = document.createElement("pre");
      pre.id = "testlog";
      pre.textContent = (pass ? "SELFTEST PASS" : "SELFTEST FAIL") + "\n" + log.join("\n");
      document.body.appendChild(pre);
      document.title = pass ? "SELFTEST PASS" : "SELFTEST FAIL";
    })();
    return;
  }

  // Einzelne Ansichten für Screenshots
  const map = {
    new: () => startSessionById("g1"),
    audio4: () => startSessionById("g1"),
    ne2de: () => startSessionById("g1"),
    match: () => startSessionById("g1"),
    build: () => startSessionById("g3"),
    letters: () => startSessionById("letters"),
    detective: () => startSessionById("detective"),
    story: () => startSessionById("story")
  };
  if (map[demo]) {
    map[demo]();
    const types = { audio4: "audio4", ne2de: "ne2de", match: "match", build: "build", new: "new" };
    if (types[demo]) {
      const step = session.queue.find(s => s.type === types[demo]);
      if (step) { session.idx = session.queue.indexOf(step); renderStep(); }
    }
  }
})();
