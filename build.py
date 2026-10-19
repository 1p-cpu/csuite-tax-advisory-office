#!/usr/bin/env python3
"""
ザクトリン合同会社 コーポレートサイト ビルドスクリプト
依存ライブラリなし（Python 3.8+ 標準ライブラリのみ）。

  python3 build.py        → src/ から public/ を生成

構成:
  src/site.json        サイト共通設定（URL・ナビ・フォームURL等）
  src/layout.html      共通レイアウト（head / header / footer）
  src/pages/*.html     各ページ。先頭の <!-- meta ... --> ブロックでページ情報を定義
  src/assets/          CSS / JS / 画像（そのまま public/assets へコピー）
"""
import json, re, shutil, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "docs"

site = json.loads((SRC / "site.json").read_text(encoding="utf-8"))
layout = (SRC / "layout.html").read_text(encoding="utf-8")

META_RE = re.compile(r"^\s*<!--\s*meta\s*(\{.*?\})\s*-->\s*", re.S)


def render(template: str, ctx: dict) -> str:
    """{{key}} を置換。未定義キーは空文字。"""
    def rep(m):
        key = m.group(1).strip()
        return str(ctx.get(key, ""))
    return re.sub(r"\{\{\s*([\w.]+)\s*\}\}", rep, template)


def nav_html(current: str) -> str:
    items = []
    for it in site["nav"]:
        cls = []
        if it.get("cta"):
            cls.append("nav-cta")
        active = current == it["path"] or (it["path"] != "/" and current.startswith(it["path"]))
        attrs = f' class="{" ".join(cls)}"' if cls else ""
        if active and not it.get("cta"):
            attrs += ' aria-current="page"'
        items.append(f'<a href="{it["path"]}"{attrs}>{it["label"]}</a>')
    return "\n      ".join(items)


def footer_links(group: str) -> str:
    return "\n        ".join(
        f'<a href="{it["path"]}"{" target=\"_blank\" rel=\"noopener noreferrer\"" if it["path"].startswith("http") else ""}>{it["label"]}</a>'
        for it in site["footer"][group]
    )


def breadcrumb(meta: dict) -> str:
    if meta["path"] == "/":
        return ""
    crumbs = [("ホーム", "/")]
    for c in meta.get("parents", []):
        crumbs.append((c["label"], c["path"]))
    crumbs.append((meta["title_short"], None))
    lis = []
    for label, href in crumbs:
        if href:
            lis.append(f'<li><a href="{href}">{label}</a></li>')
        else:
            lis.append(f'<li aria-current="page">{label}</li>')
    return f'<nav class="breadcrumb" aria-label="パンくず"><ol>{"".join(lis)}</ol></nav>'


def build_page(src: Path, pages_meta: list):
    raw = src.read_text(encoding="utf-8")
    m = META_RE.match(raw)
    if not m:
        raise SystemExit(f"meta ブロックがありません: {src}")
    meta = json.loads(m.group(1))
    body = raw[m.end():]
    body = render(body, {**site["vars"], "FORM_URL": site["contact_form_url"]})

    path = meta["path"]
    if meta.get("out"):
        out_file = OUT / meta["out"]
    else:
        out_file = OUT / path.strip("/") / "index.html" if path != "/" else OUT / "index.html"
    out_file.parent.mkdir(parents=True, exist_ok=True)

    full_title = site["name"] if path == "/" else f'{meta["title_short"]}｜{site["name"]}'
    ctx = {
        **site["vars"],
        "SITE_NAME": site["name"],
        "SITE_NAME_EN": site["name_en"],
        "SITE_URL": site["url"].rstrip("/"),
        "FORM_URL": site["contact_form_url"],
        "PAGE_TITLE": meta.get("title", full_title),
        "PAGE_DESC": meta["description"],
        "CANONICAL": site["url"].rstrip("/") + path,
        "OG_TYPE": "website" if path == "/" else "article",
        "BODY_CLASS": meta.get("body_class", ""),
        "NAV": nav_html(path),
        "BREADCRUMB": breadcrumb(meta),
        "FOOTER_COMPANY": footer_links("company"),
        "FOOTER_SERVICES": footer_links("services"),
        "FOOTER_RELATED": footer_links("related"),
        "YEAR": str(datetime.date.today().year),
        "CONTENT": body,
        "EXTRA_HEAD": meta.get("extra_head", ""),
    }
    out_file.write_text(render(layout, ctx), encoding="utf-8")
    pages_meta.append({"path": path, "priority": meta.get("priority", "0.6"), "noindex": meta.get("noindex", False)})
    print("  wrote", out_file.relative_to(ROOT))


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(SRC / "assets", OUT / "assets")
    for extra in ("favicon.svg", "CNAME", ".nojekyll", "privacy.html"):
        p = SRC / extra
        if p.exists():
            shutil.copy(p, OUT / extra)

    pages = []
    for f in sorted((SRC / "pages").glob("*.html")):
        build_page(f, pages)

    base = site["url"].rstrip("/")
    today = datetime.date.today().isoformat()
    urls = "\n".join(
        f"  <url><loc>{base}{p['path']}</loc><lastmod>{today}</lastmod><priority>{p['priority']}</priority></url>"
        for p in pages if not p["noindex"]
    )
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n",
        encoding="utf-8",
    )
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n", encoding="utf-8")
    print(f"done: {len(pages)} pages")


if __name__ == "__main__":
    main()
