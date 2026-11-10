/* GA4 計測（C-suite グループ共通：csuite-tax.com / c-suitez.com / zakutorin.jp）
 * - 3サイトで同一測定IDを使い、クロスドメイン（linker）でサイト間の回遊を1ユーザーとして追跡
 * - 問い合わせ導線のクリックをイベント化
 *     generate_lead    : 問い合わせフォーム（Googleフォーム）へのクリック ← キーイベント
 *     phone_click      : 電話リンク（tel:）                                  ← キーイベント
 *     email_click      : メールリンク（mailto:）                             ← キーイベント
 *     lp_click         : サービスLP（github.io / chatgpt.site）へのクリック
 *     cross_site_click : グループ他サイトへのクリック
 *     cta_click        : ヘッダー等の「お問い合わせ」ページへの内部CTAクリック
 */
(function () {
  var GA_ID = 'G-Y70062NC23';
  var GROUP = ['csuite-tax.com', 'c-suitez.com', 'zakutorin.jp'];

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('set', 'linker', { domains: GROUP });
  gtag('config', GA_ID, { site_host: location.hostname });

  function send(name, a, extra) {
    var p = {
      link_url: a.href,
      link_text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 100),
      page_path: location.pathname,
      site_host: location.hostname
    };
    for (var k in extra) p[k] = extra[k];
    gtag('event', name, p);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var host = '';
    try { host = new URL(a.href, location.href).hostname; } catch (_) {}

    if (/forms\.gle|docs\.google\.com\/forms/.test(a.href)) {
      send('generate_lead', a, { method: 'google_form' });
    } else if (href.indexOf('tel:') === 0) {
      send('phone_click', a, { method: 'tel' });
    } else if (href.indexOf('mailto:') === 0) {
      send('email_click', a, { method: 'mail' });
    } else if (/github\.io$|chatgpt\.site$/.test(host)) {
      send('lp_click', a, { lp_host: host });
    } else if (host && host !== location.hostname && GROUP.indexOf(host.replace(/^www\./, '')) > -1) {
      send('cross_site_click', a, { dest_site: host });
    } else if (host === location.hostname && /^\/contact\/?$/.test(new URL(a.href).pathname)) {
      send('cta_click', a, { cta_location: a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : 'body' });
    }
  }, true);
})();
