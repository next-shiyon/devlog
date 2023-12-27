---
title: "ブログの記事に TOC（Table of Contents）を追加してみよう"
date: "2023-12-09"
category: "TOC"
tags: ["TOC", "css", "react-markdown"]
---

## TOC とはなんでしょうか

![本の目次と Web ページの目次](/images/posts/toc1.png)
本に目次があるように、Web ページのドキュメントにも目次が存在する。テキストの量が多くなると、この目次の必要性ももっと大きくなる。**目次を通して読者はどのような構造で記事が作成されているのか、自分は今どの時点を読んでいるのか、などを把握しやすくなるので、テキストベースのコンテンツを提供する Web としては目次は欠かせない存在とも思う。**　この目次のことを `TOC (Table of contents)`と呼ぶ。

個人的に、ブログを実装しながら必ず実装してみたかった機能がこの TOC である。今回ちょうど TOC を実装してみたので、この記事では Next.js で TOC を実装する方法についてお話ししたいと思う。（React でも同様なので、Next.js ではなくても可能）

## TOC コンポーネントを作る

```tsx
export const TableOfContents = () => {
  return <nav aria-label="Table of contents">Hello world!</nav>;
};
export default TableOfContents;
```

> aria-label はスクリーンリーダーが読み取る要素

`TableOfContent` というコンポーネントを作る。TOC コンポーネントでは、ナビゲーションリンクを持っている目次を提供するので、`nav`タグを使用しよう。 [The Navigation Section element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)

## TOC スタイリング

![望ましい画面レイアウト](/images/posts/toc2.png)
個人的に望ましかったレイアウトはこの写真のように、メインコンテンツは画面のど真ん中に配置し、TOC は右側の空間に置くこと。なので、このようなレイアウトを実現してみよう。

```css
.tableOfContents {
  position: sticky;
  position: -webkit-sticky;
  top: 150px;
}
```

`position: sticky`を利用して、指定した画面の位置に TOC を固定する。（`position: -webkit-sticky;`は safari 対応の目的）要素を画面の特定の位置に固定させる方法はいろんな手法があるが、わざと`sticky`を利用した理由は、画面をスクロールすると要素も一緒に画面の上部に移動するけど、一定の位置からは固定されるような実装ができるため。上記の CSS だと、`top: 150px` の位置で TOC が引っかかって固定されるという意味になる。`absolute`や`fixed`を利用すると、スクロールによってい動くなどの動作はできず、画面の指定した位置にずっと固定される。

#### position: fixed

![position fixed の動作](/images/posts/toc3.gif)

#### position: sticky

![position sticky の動作](/images/posts/toc4.gif)

> 個人的ではあるが・・TOC がある程度スクロールによって動くのがより自然に感じる

### TOC コンポーネントの呼び元

```tsx
<style>
    .container {
        display: grid;
        grid-template-columns: 1fr 764px 1fr;
        grid-template-areas:
        ". header-container ."
        ". content-container table-of-contents"
        ". footer .";
        grid-template-rows: auto 1fr; /* NEW */
    }

    .content-container {
        grid-area: content-container;
    }

    .header-container {
        grid-area: header-container;
    }

    .table-of-contents {
        grid-area: table-of-contents;
    }

    .footer {
        grid-area: footer;
    }
</style>


export  const Layout = () => {
    return (
        <div class="container">
            <div class="table-of-contents">
                <TableOfContents />
            </div>
            <div class="header-container">...</div>
            <div class="content-container">...</div>
            <div class="footer">...</div>
        </div>
    )
}
```

一応画面を３分割かつ画面の真ん中にある要素は他の要素の width に関係なく、真ん中にしたかったので、`display: grid`を利用。それぞれの class に `grid-area` で keyword を付与し、`grid-template-areas`　で３分割を実現。`grid-template-columns`では `content-container` を画面の真ん中に配置し、764px の width を持つようにする。

## React-markdown で生成した HTML タグに id を付与

TOC のリストをクリックすると該当の位置に画面が遷移（移動）する機能を実現するためには、HTML タグに id 属性を付与し、その id でナビゲーションを作る必要がある。ただ、直接 HTML を作成するわけではないため、`react-markdown`から生成される HTML タグに id を付与することが必要になる。

```tsx
const Post = ({ postData }: Props) => {
  const H2 = ({ node, ...props }: any) => {
    return <h2 id={node.position?.start.line.toString()}>{props.children}</h2>;
  };

  const H3 = ({ node, ...props }: any) => {
    return <h3 id={node.position?.start.line.toString()}>{props.children}</h3>;
  };

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className={styles["post-container"]}>
        <h1 className={styles["postTitle"]}>{postData.title}</h1>
        <div className={styles["postInfo"]}>
          <Date dateString={postData.date} />
        </div>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: H2,
            h3: H3,
          }}
        >
          {postData.content}
        </Markdown>
      </article>
    </Layout>
  );
};

export default Post;
```

Markdown コンポーネントの `components` オプションを利用すると、マークダウンの要素を自分が作成したコンポーネントに置き換えることができるらしい。（[react-markdown に目次をつける](https://qiita.com/toki_dev/items/af810b284fcea62d869d) の記事を参考）今回は `h2`, `h3`タグのみを、TOC 表示させたいため、独自の H2, H3 コンポーネントを作成する。id の値は line number を渡す。別に大した意味を持つ値を渡さなくても良い。それぞれのタグを区分するだけの目的であるため。

![id が付与された heading tag](/images/posts/toc5.png)
はい、これで`h2`, `h3`タグに id が付与されたのがわかった。後はこのタグを TOC コンポーネントで拾って、リスト化し、描画するだけ！

## heading タグを拾ってリスト化しよう

### 画面の HTML を拾う Custom hook を実装しよう

```tsx
type HeadingType = {
  id: string;
  title: string;
};

export type NestedHeadingType = HeadingType & {
  items: HeadingType[];
};

export const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<NestedHeadingType[]>([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[];

    const newNestedHeading = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeading);
  }, []);

  return { nestedHeadings };
};
```

画面から拾った heading タグをどのような構造で作るべきか？

#### TOC 構造

```text
Initial header
Second header
    Third header
```

`h2` の中に存在する `h3` タグは以前の `h2`タグにネストされなければならない。そのような形をデータ構造で移すと以下のようになる。

#### データ構造

```tsx
[
  {
    id: "initial-header",
    title: "Initial header",
    items: [],
  },
  {
    id: "second-header",
    title: "Second header",
    items: [
      {
        id: "third-header",
        title: "Third header",
      },
    ],
  },
];
```

### 拾った HTML タグを構造かする関数を作る

```tsx
const getNestedHeadings = (headingElements: Array<HTMLHeadingElement>) => {
  const nestedHeadings: NestedHeadingType[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading;
    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({ id, title });
    }
  });

  return nestedHeadings;
};
```

## 画面に描画する

```tsx
import { NestedHeadingType, useHeadingsData } from "../hooks/useHeadingsData";
import styles from "./tableOfContents.module.scss";

type HeadingsType = {
  headings: NestedHeadingType[];
};

const Headings = ({ headings }: HeadingsType) => (
  <ul>
    {headings.map((heading) => (
      <li key={heading.id}>
        <a href={`#${heading.id}`}>{heading.title}</a>
        <ul>
          {heading.items.map((child) => (
            <li key={child.id}>
              <a href={`#${child.id}`}>{child.title}</a>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export const TableOfContents = () => {
  const { nestedHeadings } = useHeadingsData();

  return (
    <nav className={styles["tableOfContents"]} aria-label="Table of contents">
      <Headings headings={nestedHeadings} />
    </nav>
  );
};

export default TableOfContents;
```

## 結果

![描画される TOC](/images/posts/toc6.png)
すると？このように TOC が作られる。ウェーイ〜！

### 勉強になったこと

1. `document.querySelectorAll()` で画面の HTML タグを拾えることがわかった`document object` って面白いやつだね。JS は DOM の操作ができるのがめっちゃメリットだと思う。
2. データ構造を考慮する時に、画面の UI から考えてみるのはありだね。UI としてあるべき姿を考えてそこからデータの構造を作れるんだ。
3. position: sticky と fixed の違いについてわかった。画面の特定の位置に要素を留めたいのであれば、`sticky`。ただ、特定の位置に要素を固定したいのであれば、`fixed`を利用する。
4. 2D のレイアウトであれば、`display: grid` を使いましょう。

### 参考

1. [How to build a table of contents in React](https://www.emgoto.com/react-table-of-contents/)
2. [react-markdown に目次をつける
   ](https://qiita.com/toki_dev/items/af810b284fcea62d869d)
