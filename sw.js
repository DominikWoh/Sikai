/* Sikai Service Worker - generiert von tools/make_offline.py, nicht von Hand editieren.
 * Precacht die komplette App (Shell + Daten + alle Audios), damit Sikai
 * nach dem ersten Oeffnen komplett ohne Internet laeuft. */
"use strict";

const BUILD = "v19-81e18aefaa";
const CACHE = "sikai-" + BUILD;
const ASSETS = [
  "app.js",
  "assets/fonts/Fraunces-italic-500.woff2",
  "assets/fonts/Fraunces-normal-500.woff2",
  "assets/fonts/Fraunces-normal-600.woff2",
  "assets/fonts/Fraunces-normal-700.woff2",
  "assets/fonts/Mukta-normal-400-dev.woff2",
  "assets/fonts/Mukta-normal-400.woff2",
  "assets/fonts/Mukta-normal-600-dev.woff2",
  "assets/fonts/Mukta-normal-600.woff2",
  "assets/fonts/Mukta-normal-700-dev.woff2",
  "assets/fonts/Mukta-normal-700.woff2",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/arrow-left-right.svg",
  "assets/icons/calendar-check.svg",
  "assets/icons/car.svg",
  "assets/icons/check.svg",
  "assets/icons/compass.svg",
  "assets/icons/flag.svg",
  "assets/icons/flame.svg",
  "assets/icons/heart-handshake.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-192.png",
  "assets/icons/icon-maskable-512.png",
  "assets/icons/map-pin.svg",
  "assets/icons/message-circle.svg",
  "assets/icons/moon.svg",
  "assets/icons/mountain-snow.svg",
  "assets/icons/play.svg",
  "assets/icons/refresh-ccw.svg",
  "assets/icons/search.svg",
  "assets/icons/sparkles.svg",
  "assets/icons/star.svg",
  "assets/icons/sun.svg",
  "assets/icons/target.svg",
  "assets/icons/type.svg",
  "assets/icons/volume-2.svg",
  "assets/icons/volume-x.svg",
  "assets/icons/x.svg",
  "audio/det_ta.mp3",
  "audio/det_tapaai.mp3",
  "audio/det_timi.mp3",
  "audio/l10_01.mp3",
  "audio/l10_02.mp3",
  "audio/l10_03.mp3",
  "audio/l10_04.mp3",
  "audio/l10_05.mp3",
  "audio/l10_06.mp3",
  "audio/l10_07.mp3",
  "audio/l11_01.mp3",
  "audio/l11_02.mp3",
  "audio/l11_03.mp3",
  "audio/l11_04.mp3",
  "audio/l11_05.mp3",
  "audio/l11_06.mp3",
  "audio/l11_07.mp3",
  "audio/l12_01.mp3",
  "audio/l12_02.mp3",
  "audio/l12_03.mp3",
  "audio/l12_04.mp3",
  "audio/l12_05.mp3",
  "audio/l12_06.mp3",
  "audio/l12_07.mp3",
  "audio/l13_01.mp3",
  "audio/l13_02.mp3",
  "audio/l13_03.mp3",
  "audio/l13_04.mp3",
  "audio/l13_05.mp3",
  "audio/l14_01.mp3",
  "audio/l14_02.mp3",
  "audio/l14_03.mp3",
  "audio/l14_04.mp3",
  "audio/l15_01.mp3",
  "audio/l15_02.mp3",
  "audio/l15_03.mp3",
  "audio/l15_04.mp3",
  "audio/l16_01.mp3",
  "audio/l16_02.mp3",
  "audio/l16_03.mp3",
  "audio/l16_04.mp3",
  "audio/l17_01.mp3",
  "audio/l17_02.mp3",
  "audio/l17_03.mp3",
  "audio/l17_04.mp3",
  "audio/l18_01.mp3",
  "audio/l18_02.mp3",
  "audio/l18_03.mp3",
  "audio/l18_04.mp3",
  "audio/l18_05.mp3",
  "audio/l18_06.mp3",
  "audio/l18_07.mp3",
  "audio/l18_08.mp3",
  "audio/l18_09.mp3",
  "audio/l18_10.mp3",
  "audio/l18_11.mp3",
  "audio/l1_01.mp3",
  "audio/l1_02.mp3",
  "audio/l1_03.mp3",
  "audio/l1_04.mp3",
  "audio/l1_05.mp3",
  "audio/l1_06.mp3",
  "audio/l1_07.mp3",
  "audio/l1_08.mp3",
  "audio/l1_09.mp3",
  "audio/l1_10.mp3",
  "audio/l1_11.mp3",
  "audio/l1_12.mp3",
  "audio/l1_13.mp3",
  "audio/l1_14.mp3",
  "audio/l1_15.mp3",
  "audio/l1_16.mp3",
  "audio/l1_17.mp3",
  "audio/l1_18.mp3",
  "audio/l1_19.mp3",
  "audio/l1_20.mp3",
  "audio/l2_01.mp3",
  "audio/l2_02.mp3",
  "audio/l2_03.mp3",
  "audio/l2_04.mp3",
  "audio/l2_05.mp3",
  "audio/l2_06.mp3",
  "audio/l2_07.mp3",
  "audio/l2_08.mp3",
  "audio/l2_09.mp3",
  "audio/l2_10.mp3",
  "audio/l2_11.mp3",
  "audio/l3_01.mp3",
  "audio/l3_02.mp3",
  "audio/l3_03.mp3",
  "audio/l3_04.mp3",
  "audio/l3_05.mp3",
  "audio/l3_06.mp3",
  "audio/l3_07.mp3",
  "audio/l3_08.mp3",
  "audio/l3_09.mp3",
  "audio/l3_10.mp3",
  "audio/l4_01.mp3",
  "audio/l4_02.mp3",
  "audio/l4_03.mp3",
  "audio/l4_04.mp3",
  "audio/l4_05.mp3",
  "audio/l4_06.mp3",
  "audio/l4_07.mp3",
  "audio/l4_08.mp3",
  "audio/l4_09.mp3",
  "audio/l4_10.mp3",
  "audio/l4_11.mp3",
  "audio/l4_12.mp3",
  "audio/l4_13.mp3",
  "audio/l4_14.mp3",
  "audio/l5_01.mp3",
  "audio/l5_02.mp3",
  "audio/l5_03.mp3",
  "audio/l5_04.mp3",
  "audio/l5_05.mp3",
  "audio/l5_06.mp3",
  "audio/l5_07.mp3",
  "audio/l5_08.mp3",
  "audio/l5_09.mp3",
  "audio/l5_10.mp3",
  "audio/l6_01.mp3",
  "audio/l6_02.mp3",
  "audio/l6_03.mp3",
  "audio/l6_04.mp3",
  "audio/l6_05.mp3",
  "audio/l6_06.mp3",
  "audio/l6_07.mp3",
  "audio/l6_08.mp3",
  "audio/l6_09.mp3",
  "audio/l6_10.mp3",
  "audio/l7_01.mp3",
  "audio/l7_02.mp3",
  "audio/l7_03.mp3",
  "audio/l7_04.mp3",
  "audio/l7_05.mp3",
  "audio/l7_06.mp3",
  "audio/l7_07.mp3",
  "audio/l7_08.mp3",
  "audio/l7_09.mp3",
  "audio/l7_10.mp3",
  "audio/l7_11.mp3",
  "audio/l8_01.mp3",
  "audio/l8_02.mp3",
  "audio/l8_03.mp3",
  "audio/l8_04.mp3",
  "audio/l8_05.mp3",
  "audio/l8_06.mp3",
  "audio/l8_07.mp3",
  "audio/l8_08.mp3",
  "audio/l8_09.mp3",
  "audio/l8_10.mp3",
  "audio/l8_11.mp3",
  "audio/l8_12.mp3",
  "audio/l9_01.mp3",
  "audio/l9_02.mp3",
  "audio/l9_03.mp3",
  "audio/l9_04.mp3",
  "audio/l9_05.mp3",
  "audio/l9_06.mp3",
  "audio/l9_07.mp3",
  "audio/l9_08.mp3",
  "audio/l9_09.mp3",
  "audio/l9_10.mp3",
  "audio/l9_11.mp3",
  "audio/let_01.mp3",
  "audio/let_02.mp3",
  "audio/let_03.mp3",
  "audio/let_04.mp3",
  "audio/let_05.mp3",
  "audio/let_06.mp3",
  "audio/let_07.mp3",
  "audio/let_08.mp3",
  "audio/let_09.mp3",
  "audio/let_10.mp3",
  "audio/let_11.mp3",
  "audio/let_12.mp3",
  "audio/st1_01.mp3",
  "audio/st1_02.mp3",
  "audio/st1_03.mp3",
  "audio/st1_04.mp3",
  "audio/st1_05.mp3",
  "audio/st1_06.mp3",
  "data/journey.js",
  "data/lesson1.js",
  "index.html",
  "manifest.json",
  "styles.css"
];
const TOTAL = ASSETS.length;

function postAll(msg) {
  self.clients.matchAll({ includeUncontrolled: true }).then(cl => cl.forEach(c => {
    try { c.postMessage(msg); } catch (e) { /* Client weg */ }
  }));
}

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    let done = 0, failed = 0;
    await Promise.all(ASSETS.map(async (path) => {
      try {
        // "?b=" buert den HTTP-Cache aus (Pages max-age, aeltere iOS ignorieren cache:"reload")
        await cache.add(new Request(path + "?b=" + BUILD, { cache: "reload" }));
        done++;
      } catch (e) {
        failed++;
      }
      const seen = done + failed;
      if (seen === TOTAL || seen % 5 === 0) {
        postAll({ type: "sikai-cache-progress", done: seen, total: TOTAL, failed });
      }
    }));
    if (failed > 0) {
      // Offline-Speicher unvollstaendig: Installation abbrechen, Browser
      // versucht es bei der naechsten Online-Sitzung automatisch erneut.
      postAll({ type: "sikai-cache-failed", done, total: TOTAL, failed });
      throw new Error("Precache unvollstaendig: " + failed + " Dateien fehlgeschlagen");
    }
    postAll({ type: "sikai-cache-ready", done, total: TOTAL, failed: 0 });
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("sikai-") && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "sikai-skip-waiting") self.skipWaiting();
  if (event.data && event.data.type === "sikai-get-status") {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE);
      const keys = await cache.keys();
      // Nach Pfad deduplizieren: Runtime-Eintraege mit Query zaehlen nur einmal
      const unique = new Set(keys.map(k => new URL(k.url).pathname));
      const src = event.source;
      if (src) src.postMessage({
        type: "sikai-cache-status",
        cached: unique.size,
        total: TOTAL,
        installing: !!self.registration.installing
      });
    })());
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith("sw.js")) return; // Update-Check immer am Netzwerk vorbei

  event.respondWith(cachedFirst(req));
});

async function cachedFirst(req) {
  const cache = await caches.open(CACHE);

  // Navigationen: nur die App-Shell selbst offline-first. Andere Pfade
  // (z. B. Unterseiten) zuerst ins Netz - offline landet man auf der Shell.
  if (req.mode === "navigate") {
    const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
    const reqPath = new URL(req.url).pathname;
    const isShell = reqPath === scopePath || reqPath === scopePath + "/" || reqPath === scopePath + "/index.html";
    if (isShell) {
      const shell = (await cache.match(req, { ignoreSearch: true })) || (await cache.match("index.html", { ignoreSearch: true }));
      if (shell) return shell;
      try {
        const fresh = await fetch(req);
        if (fresh.ok) cache.put("index.html", fresh.clone());
        return fresh;
      } catch (e) { /* weiter zum Offline-Fallback unten */ }
    } else {
      try { return await fetch(req); } catch (e) { /* weiter zum Offline-Fallback unten */ }
    }
    const shell = await cache.match("index.html", { ignoreSearch: true });
    if (shell) return shell;
    return new Response("<h1>Offline</h1><p>Diese Seite wurde noch nicht offline gespeichert.</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) {
    if (req.headers.has("range")) return sliceRange(hit, req.headers.get("range"));
    return hit;
  }

  try {
    const fresh = await fetch(req);
    // Gelingt nur, wenn das Netzwerk da ist - dann fuer spaeter einlagern.
    if (fresh && fresh.ok && fresh.type === "basic") {
      if (!req.headers.has("range")) cache.put(req, fresh.clone());
    }
    return fresh;
  } catch (e) {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

// Range-Requests (Audio-Streaming, v. a. iOS Safari) aus dem Cache bedienen
async function sliceRange(res, rangeHeader) {
  const m = /bytes=(\d+)-(\d*)/.exec(rangeHeader || "");
  if (!m) return res;
  const buf = await res.clone().arrayBuffer();
  const start = Math.min(+m[1], buf.byteLength - 1);
  const end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
  const chunk = buf.slice(start, end + 1);
  return new Response(chunk, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": "bytes " + start + "-" + end + "/" + buf.byteLength,
      "Content-Length": String(chunk.byteLength),
      "Accept-Ranges": "bytes"
    }
  });
}
