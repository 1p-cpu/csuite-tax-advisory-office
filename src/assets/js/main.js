/* 東貴志公認会計士税理士事務所 --- main.js（外部ライブラリ不使用） */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");

  /* ヘッダー: スクロールで影 */
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ハンバーガーメニュー */
  function closeMenu() {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "メニューを開く");
  }
  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 780) closeMenu(); });
  }

  /* スクロールリビール（フェイルセーフ付き） */
  var targets = document.querySelectorAll(".section-head, .card, .svc-item, .reason-item, .steps li, .org-node, .profile-layout, .def-table, .prose, .cols-2 > *, .contact-box, .pain-item, .feature-list li, .fit-box, .faq-list, .phil-body");
  targets.forEach(function (el) { el.classList.add("reveal"); });
  function revealAll() { targets.forEach(function (el) { el.classList.add("visible"); }); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 3000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) setTimeout(revealAll, 600); });
  } else {
    revealAll();
  }

  /* FAQ: 開いたら他を閉じる */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) faqItems.forEach(function (o) { if (o !== item) o.open = false; });
    });
  });
})();
