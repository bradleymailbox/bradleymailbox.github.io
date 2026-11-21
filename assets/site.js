// Screenshot lightbox for title pages: click a screenshot to view it full size; arrows, swipe and Esc work.
(function () {
  var dialog = document.querySelector(".lightbox");
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  if (!dialog || !shots.length || typeof dialog.showModal !== "function") return;
  var img = dialog.querySelector("img");
  var index = 0;

  function show(i) {
    index = (i + shots.length) % shots.length;
    var inner = shots[index].querySelector("img");
    img.src = shots[index].getAttribute("data-full");
    img.alt = inner ? inner.alt : "";
  }

  shots.forEach(function (btn, i) {
    btn.addEventListener("click", function () { show(i); dialog.showModal(); });
  });
  dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  dialog.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  if (shots.length < 2) {
    dialog.querySelector(".lb-prev").hidden = true;
    dialog.querySelector(".lb-next").hidden = true;
  }

  var startX = null;
  dialog.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

// Home hero: the phones take turns in the spotlight. Pauses on hover and in background tabs; click a side phone to
// bring it forward. Skipped for reduced motion, where the static fan stays.
(function () {
  var art = document.querySelector(".hero-art");
  if (!art) return;
  var phones = Array.prototype.slice.call(art.querySelectorAll(".phone"));
  if (phones.length < 2 || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var slots = phones.length === 2 ? ["slot-left", "slot-center"] : ["slot-left", "slot-center", "slot-right"];
  phones = phones.slice(0, slots.length);
  var n = slots.length;
  var offset = 0;
  var timer = null;
  var hovering = false;
  var DELAY = 3400;

  function slotOf(i, off) { return ((i - off) % n + n) % n; }

  function apply(next) {
    phones.forEach(function (p, i) {
      var from = slotOf(i, offset), to = slotOf(i, next);
      if (Math.abs(to - from) > 1) {
        // Wrapping round the back: fade out, move, fade in.
        p.classList.add("crossing");
        setTimeout(function () { p.classList.remove("crossing"); }, 550);
      }
      slots.forEach(function (s) { p.classList.remove(s); });
      p.classList.add(slots[to]);
    });
    offset = next;
  }

  function step() { apply(offset + 1); }
  function start() { stop(); if (!hovering && !document.hidden) timer = setInterval(step, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  apply(0);
  art.classList.add("is-rotating");
  start();

  phones.forEach(function (p, i) {
    p.addEventListener("click", function () {
      var center = slots.indexOf("slot-center");
      var cur = slotOf(i, offset);
      if (cur === center) return;
      apply(offset + (cur - center));
      start();
    });
  });
  art.addEventListener("mouseenter", function () { hovering = true; stop(); });
  art.addEventListener("mouseleave", function () { hovering = false; start(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
