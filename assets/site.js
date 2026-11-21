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
