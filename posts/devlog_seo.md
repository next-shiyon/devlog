---
title: "[SEO] あなたの記事は検索されていますか？"
date: "2023-11-19"
series: "blog"
tag: ["SEO"]
---

## SEO のきっかけ

![blog posting](/images/posts/blog-posting.png)

自分が記事をググってみたらちゃんと検索されるよねーっていう期待感を持っていたがなんと！

![google search result](/images/posts/google-search.png)

ヒットされない〜 😇 そういう意味で SEO をやっていきたいと思う。([参考ドキュメントはこちら](https://nextjs.org/learn-pages-router/seo/introduction-to-seo))

## SEO 最適化の 3 つの柱

1. **Technical** – Optimize your website for crawling and web performance.
2. **Creation** – Create a content strategy to target specific keywords.
3. **Popularity** – Boost your site's presence online so search engines know you are a trusted source. This is done through the use of [backlinks](https://moz.com/learn/seo/backlinks) – third-party sites that link back to your site.

> (SEO についてもっと調べてみたいのであれば、こちらの[リンク](https://learningseo.io/)をご覧。)

## 検索エンジンが持つ主要な責任

1. **Crawling** – the process of going through the Web and parsing the content in all websites. This is a massive task as there are [over 350 million domains](https://www.businesswire.com/news/home/20200528005832/en/Internet-Grows-to-366.8-Million-Domain-Name-Registrations-at-the-End-of-the-First-Quarter-of-2020) available.
2. **Indexing** – finding places to store all of the data gathered during the crawling stage so it can be accessed.
3. **Rendering** – executing any resources on the page such as JavaScript that might enhance the features and enrich content on the site. This process doesn't happen for all pages that are crawled and sometimes it happens before the content is actually indexed. Rendering might happen after indexing if there are no available resources to perform the task at the time.
4. **Ranking** – querying data to craft relevant results pages based on user input. This is where the different ranking criteria are applied in Search engines to give users the best answer to fulfill their intent.

（検索エンジンごとに違う対応が必要であった、意外と HTTP status code も SEO と関連があるんだ・・）

## robots.txt

> A [robots.txt file](https://developers.google.com/search/docs/advanced/robots/intro) tells search engine crawlers which pages or files the crawler can or can't request from your site. The `robots.txt` file is a web standard file that most [good bots](https://www.cloudflare.com/learning/bots/how-to-manage-good-bots) consume before requesting anything from a specific domain.

（検索エンジンからクロールされるためには `robots.txt`ファイルが必要らしい）

```txt
# Allow all crawlers
User-agent: *
Allow: /
```

上記の　 robots.txt ファイルを `public`ディレクトリの配下に配置

![robots.txt access](/images/posts/robots-file.png)

そして、`localhost:3000/robots.txt`に移動して見て、上記の内容が出力されればオッケー。これがすべての検索エンジンにこのウェブアプリの全 url に対してクロールして良いよと伝えることである

## sitemaps

**Sitemaps** are the easiest way to communicate with Google.

- **Your site is new and has few external links to it.** Googlebot and other web crawlers navigate the web by following links from one page to another. As a result, Google might not discover your pages if no other sites link to them.

このブログは新しく作られたウェブサイトだから、sitemaps を通した SEO も必要そう。いろんな方法があるみたいだが、まだは簡単なウェブだし、静的コンテンツで作ろう。

```xml
   <!-- public/sitemap.xml -->
   <xml version="1.0" encoding="UTF-8">
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>http://www.example.com/foo</loc>
       <lastmod>2021-06-01</lastmod>
     </url>
   </urlset>
   </xml>
```

この `sitemap.xml`ファイルも `robots.txt`と同様に `public`ディレクトリの配下に配置すればよし。

## 最後に

ちゃんと検索されるところまで、確認したいが今のところはまだ Google に検索されない。クロールされるまで時間がもっと必要なのか？様子を見て追加で最適化をするなりなんなりしてみよう！

あ、余談だけど、もっと 1 つのテーマに対して時間かけて作ってみても良いと思った。SEO をする上でももっとこの記事のクオリティーを高める必要もあるし、テキパキやってしまうと、頭に残るものがないしね・・！じっくり時間かけながら工夫して開発しよう。そしてそれをちゃんと記事にまとめて発信した方が読者さんも喜ぶし。
