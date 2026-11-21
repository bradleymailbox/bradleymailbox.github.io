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

// Home hero: every live title takes a turn in the spotlight, three phones on show at a time. Pauses on hover and in
// background tabs; click a side phone to bring it forward. Skipped for reduced motion, where the static fan stays.
(function () {
  var art = document.querySelector(".hero-art");
  if (!art) return;
  var phones = Array.prototype.slice.call(art.querySelectorAll(".phone"));
  var n = phones.length;
  if (n < 2 || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var SLOTS = ["slot-left", "slot-center", "slot-right", "slot-hidden"];
  var DELAY = 3400;
  // Start where the static fan is: phone 1 in the middle (phone 0 when there are only two).
  var focus = n >= 3 ? 1 : 0;
  var timer = null;
  var hovering = false;

  // Slot for phone i: the focused one in the middle, its neighbours either side, the rest hidden behind.
  function slotOf(i, f) {
    var rel = ((i - f) % n + n) % n;
    if (rel === 0) return "slot-center";
    if (rel === 1) return "slot-right";
    if (rel === n - 1) return "slot-left";
    return "slot-hidden";
  }

  function apply(next, first) {
    phones.forEach(function (p, i) {
      var from = slotOf(i, focus), to = slotOf(i, next);
      if (!first && ((from === "slot-left" && to === "slot-right") || (from === "slot-right" && to === "slot-left"))) {
        // Jumping across the front (only with three titles): fade it while it moves behind.
        p.classList.add("crossing");
        setTimeout(function () { p.classList.remove("crossing"); }, 550);
      }
      SLOTS.forEach(function (s) { p.classList.remove(s); });
      p.classList.add(to);
    });
    focus = ((next % n) + n) % n;
  }

  function start() { stop(); if (!hovering && !document.hidden) timer = setInterval(function () { apply(focus + 1); }, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  apply(focus, true);
  art.classList.add("is-rotating");
  start();

  phones.forEach(function (p, i) {
    p.addEventListener("click", function () {
      var slot = slotOf(i, focus);
      if (slot === "slot-left") apply(focus - 1);
      else if (slot === "slot-right") apply(focus + 1);
      else return;
      start();
    });
  });
  art.addEventListener("mouseenter", function () { hovering = true; stop(); });
  art.addEventListener("mouseleave", function () { hovering = false; start(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
