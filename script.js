/* 東貴志公認会計士税理士事務所 / C-suite Tax Advisory  ---  script.js */
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var hamburger = document.getElementById("hamburger");
  var nav = document.getElementById("nav");

  /* --- ヘッダー: スクロールで影 --- */
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- ハンバーガーメニュー --- */
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
    /* メニュー内リンククリックで閉じる */
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    /* Escで閉じる */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    /* リサイズでPC幅に戻ったら閉じる */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  /* --- スクロールリビール --- */
  var targets = document.querySelectorAll(
    ".section-head, .pain-item, .service-card, .reason-item, .phil-body, .profile-layout, .company-table, .faq-list, .contact .container"
  );
  targets.forEach(function (el) { el.classList.add("reveal"); });

  /* 全要素を確実に表示するフェイルセーフ */
  function revealAll() {
    targets.forEach(function (el) { el.classList.add("visible"); });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (el) { io.observe(el); });

    /* 保険1：一定時間経過後は無条件で表示（監視が発火しない環境への対策） */
    setTimeout(revealAll, 3000);

    /* 保険2：非表示タブで読み込まれた場合、表示に切り替わった時点で確実に表示 */
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) setTimeout(revealAll, 600);
    });
  } else {
    revealAll();
  }

  /* --- FAQ: 開いたら他を閉じる（アコーディオン） --- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* --- 現在年をコピーライトに反映（任意） --- */
  var year = new Date().getFullYear();
  document.querySelectorAll(".copyright").forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/©\s?\d{4}/, "© " + (year > 2025 ? "2025–" + year : "2025"));
  });
})();
