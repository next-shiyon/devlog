---
title: "Light house を利用して、アクセしビリティを向上しよう"
date: "2023-11-26"
category: "a11y"
tags: ["a11y", "light-houst"]
---

## Light house を利用してみよう

![Lighthoust の chrome extension ページ](/images/posts/a11y-5.png)

自分が管理しているウェブページのアクセシビリティの点数が気になるのであれば、[Lighthouse](https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=ja&pli=1)を利用して確認することができる。

![light house result](/images/posts/a11y-1.png)

上記の extension をダウンロードし、自分のウェブページで実行したみたら、このようにレポートが出る。（インターネットからアクセスできるようにデプロイしないとレポートは出ない）

点数と改善点を教えてくれる。ブログのメインページの、html タグに lang 属性がないことが検出された。

## html に lang 属性を追加

[next.js custom document](https://nextjs.org/docs/pages/building-your-application/routing/custom-document)を参考したら良い。layout みたいに、ページ全体を囲むページを作るイメージ。

```ts
import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html lang="ja">
      　{/* lang 属性を追加 */}
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
```

上記のファイルを `pages/`の配下に配置

### Before

![lang 属性追加前](/images/posts/a11y-2.png)

デベロッパーツールで見てみると、lang 属性がなかったものが・・

### After

![lang 属性追加後](/images/posts/a11y-3.png)

html タグに lang 属性が追加された！

## 結果

![lang 属性追加後](/images/posts/a11y-4.png)

Lighthouse で再度確認してみたら 100 点になった！ただ、ウェブで関連のあるリンク全体をみてくれる訳ではなくて、検査を実行してページのみの結果を出してくれるみたい。なので、他のページに対しての a11y も全体的に改修する必要はありそう。。。
