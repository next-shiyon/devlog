---
title: "[Next.js] ブログっぽいものを作る上で、必要最低限 Next.js 知識"
date: "2023-11-10"
series: "blog"
tag: ["next.js"]
---

## はじめに

Next.js でブログを実装する上で必要最低限の知識を勉強して行きたい。

## Next.js とは

モダーンなウェブ開発する上で考慮するところは多い。（Routing、Data Fetching などなど）Next.js を利用すれば、より早めにウェブアプリケーションを制作するできるらしい。

> 自分で一々実装するか、Next.js が提供するツールで実装するかはあなた次第。以下は Next.js が提供してくれるツールリストである。

- **User Interface** - how users will consume and interact with your application.
- **Routing** - how users navigate between different parts of your application.
- **Data Fetching** - where your data lives and how to get it.
- **Rendering** - when and where you render static or dynamic content.
- **Integrations** - what third-party services you use (CMS, auth, payments, etc) and how you connect to them.
- **Infrastructure** - where you deploy, store, and run your application code (Serverless, CDN, Edge, etc).
- **Performance** - how to optimize your application for end-users.
- **Scalability** - how your application adapts as your team, data, and traffic grow.
- **Developer Experience** - your team’s experience building and maintaining your application.

つまり、は考慮しなければならないことや、作成しなければならないことを Next.js がすでに用意してくれたツールを利用することで、簡単にウ解決することができるということになる。（UI を構成するのは React を利用することになる）

> (Next.js の動作原理について気になる方はこちらのリンクを確認してください。[How Next.js Works](https://nextjs.org/learn-pages-router/foundations/how-nextjs-works))

### Next.js 主に提供している機能の特徴

- An intuitive [page-based](https://nextjs.org/docs/basic-features/pages) routing system (with support for [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes))
- [Pre-rendering](https://nextjs.org/docs/basic-features/pages#pre-rendering), both [static generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended) (SSG) and [server-side rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering) (SSR) are supported on a per-page basis
- Automatic code splitting for faster page loads
- [Client-side routing](https://nextjs.org/docs/routing/introduction#linking-between-pages) with optimized prefetching
- [Built-in CSS](https://nextjs.org/docs/basic-features/built-in-css-support) and [Sass support](https://nextjs.org/docs/basic-features/built-in-css-support#sass-support), and support for any [CSS-in-JS](https://nextjs.org/docs/basic-features/built-in-css-support#css-in-js) library
- Development environment with [Fast Refresh](https://nextjs.org/docs/basic-features/fast-refresh) support
- [API routes](https://nextjs.org/docs/api-routes/introduction) to build API endpoints with Serverless Functions
- Fully extendable

## ページ間の移動（遷移）はどう行われるのか

Next.js では pages 配下のファイルが routing と関連される。

- `pages/index.js`ページは URL として `/`になる
- `pages/posts/first-post.js` は URL として`/posts/first-post`になる

`Link`コンポーネントを利用するとページ間遷移することができ、クライアントサイドのナビゲーションを可能にする。そして、ナビゲーションをコントロールするための、props も渡せる。
（Next.js 12.2 バージョン以前は `Link`コンポーネントで `<a>` を囲む必要があったが、今は不要）

> クライアントサイドナビゲーションとは、ページの移動を Javascript を利用して行うことを意味する。（**ブラウザによるナビゲーションより早いらしい。どのぐらい早いかは気になるけどな**）

**Next.js は `Code Splitting` を自動的に提供するので、各ページは必要な分だけをロードする。**これが SPA とは違うところ。Code Splitting により、最初ページに入った時のロード速度が速くなる。最初に全ページをロードする必要がないため。

1. 他のページにエラーがあっても、そのページにアクセスしない限り正常に動作することを意味する
2. **viewport に Link コンポーネントがある時、Next.js がバックグラウンドで Link ページについてのコードを自動的に prefetch する。そのためページへの遷移がすぐに行われる。**（prefetching）

## Assets, Metadata, and CSS の管理

### Assets

`public` ディレクトリから静的リソースを管理することができる。（`public` ディレクトリは SEO 的にも何かしらの役割があるらしい）

レギュラー HTML でイメージを追加するのは、追加に以下の作業を必要にする。

1. レスポンシブ対応
2. third-party や library についての最適化
3. viewport に入った時だけ、イメージがロードされる

だが、`next/image`を利用すると、上記の作業を最適化してくれる。（イメージは*lazy-loading* される）

### Metadata

メターデータは `Head` 内に作成すれば良い。（まだ、詳しくないが、third-party script を import する時も、ここに記載するらしい。パフォーマンス的に考慮するなら、`<Script>`というものを調べてみよう）

### CSS

CSS を import するときは、二つの方法がある。

1. styles.クラス名
2. styles["クラス名"]

> （少し試してみたら、1 の方が、クラス名を自動補完してくれてて、もっと便利そうだな。2 の方法で自動補完することはできないかな）

next.js は SCSS を利用することで、ユニークなクラス名を自動的につけてくれる。
（Code Splitting は CSS にも適用され、必要な最低限の CSS だけをロードする）
![ユニークなクラス名](/images/posts/unique-class-name.png)

> グローバル CSS は `pages/_app.js`で import するらしい！他のところでは グローバル CSS を import することはできない。（`_app.js`は React コンポーネントのルートにあり、すべてのページを包んでいる。グローバルな状態を管理するのは `_app.js` で行う。）このファイルの格納先やファイル名は特に制約などない。

### Pre Rendering

Next.js はすべての画面を pre-rendering する。pre-rendering は パフォーマンスと SEO 的な側面でりより良い。ここにも二つのパターンがある。違いは、**ページの HTML をいつ生成するのか。**

1. **Static generation**：*アプリケーションのビルド時*に HTML を生成する（いわゆる、SSG）
2. **Server-side rendering**：_各リクエストごとに_ HTML を生成する
   > development モードでは SSR 方式に決まっているらしい

ページごとに、上記の pre-rendering 方式を選択することができる。可能であれば、すべての request に反応する必要がないため、SSG を利用することが良いらしい。

SSG を利用して、良さそうなやつは以下の通り（SEO やユーザにページアクセス速度が重要なサービスでは SSG を利用する）

1. marketing pages
2. blog posts < 🔥
3. e-commerce product listings
4. help and documentation

逆に、頻繁にデータが変更されたり、リクエストによりコンテンツが変わったりするやつは SSR の方が良い（いつも最新の情報を維持しているため。pre-rendering を使わないため）

データがある前提で HTML を生成しなきゃならないんだったら、 SSG with data を利用しましょう。`getStaticProps`（getStaticProps 関数内部じゃないと、ファイルシステムにアクセスするモジュールは使えないらしい）

外部 API や DB request も getStaticProps 内でできる。これができる理由は、getStaticProps が server-side で走るため。（getStaticProps はビルド時に実行されるようになっているため、query params や HTTP header のデータには使えない。）これは、export された page 内でしか使えない。

リクエストごとにデータを fetching したい場合は、SSR を利用しましょう。(getServerSideProps)（エディターをウェブ内で持つのであれば、SSR を利用するのが正しそう）ただ、TTFB は Static Generate より遅いし、別途設定しない限り、CDN のキャッシング機能が使えない。

pre-render する必要がなければ、CSR を使うこともできる。（静的な部分は SSG、動的な部分は CSR）CSR のために useSWR がある。

### 動的ルーティング

dynamic URL を生成してくれるんだ。`[id]`のようなファイル名は動的ルーティングを可能にする。
`getStaticPaths`から id として使える値を return する。

```ts
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return { paths, fallback: false };
}
```

> `getStaticPaths`は動的ルーティングの変数。つまり、`[id]`に該当する値を指定する目的である。（SSG 動的ルーティングを許容する値を指定する目的）
