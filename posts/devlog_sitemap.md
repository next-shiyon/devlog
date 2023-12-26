---
title: "[SEO] Next.js 에서 Dynamic URL의 sitemap.xml 생성하기"
date: "2023-12-27"
category: "blog"
tags: ["SEO", "google-search-console", "sitemap.xml", "next.js"]
---

본 글은 다음과 같은 전제조건이 있습니다.

> 1. 사이트맵은 `XML 사이트맵`방식을 이용한다.
> 2. Next.js 프레임워크 이용한다.
> 3. Typescript를 이용한다.

## 사이트맵이란?

`사이트맵`은 **사이트에 있는 페이지, 동영상 및 기타 파일과 그 관계에 관한 정보를 제공하는 파일**이다.(중요하다고 생각하는 페이지와 파일을 알리고, 관련된 중요한 정보를 제공한다) 검색엔진은 이 파일을 읽고 사이트를 더 효율적으로 크롤링할 수 있게 된다. (사이트맵에는 동영상 항목, 이미지 항목, 뉴스 항목 등이 존재하며, 이러한 항목으로 특정 콘텐츠의 유형에 대한 정보를 제공하는 것이 가능하다)

WordPress 와 같은 CMS 를 사용한다면, 이미 검색엔진에서 사용 가능한 사이트맵을 만들었을 수 있으므로, 작업을 필요로 하지 않는다. 다만, CMS 를 사용하지 않고, 새롭게 웹사이트를 만든다면 검색엔진에게 사이트를 알릴 목적으로 사이트맵을 생성하는 것이 좋다.

#### 꼭 사이트맵이 필요할까?

Google 에서는 사이트 페이지가 제대로 링크되었다면 대개 대부분의 사이트를 찾을 수 있다고 한다. 그러나, 사이트맵을 사용하면 복잡한 사이트나 전문화된 파일의 크롤링을 개선할 수 있다고 한다. (사이트맵이 있다고 해서 사이트의 모든 항목이 크롤링되고 색인이 생성된다고 보장하지는 않는다)

##### 사이트맵이 필요한 경우

1. 사이트 크기가 큰 경우
2. 연결되는 외부 링크가 많지 않은 새로운 사이트
3. 리치 미디어 콘텐츠(동영상, 이미지)가 많거나 Google 뉴스에 표시되는 사이트

> Googlebot 및 기타 웹 크롤러는 한 페이지에서 다른 페이지로 연결되는 링크를 따라 웹을 크롤링한다. 연결되는 외부 링크가 많지 않은 사이트의 경우, 크롤러가 사이트를 찾지 못할 수도 있기 때문에, 사이트맵이 필요하다고 볼 수 있다.

##### 사이트맵이 필요하지 않은 경우

1. 크기가 '작은' 사이트 (500개 미만)
2. 내부적으로 긴밀히 연견된 사이트
3. 검색 결과에 표시하려는 미디어 파일(동영상, 이미지) 또는 뉴스 페이지가 많지 않음

## Next.js 에서 Dynamic URL의 sitemap 생성하기

구현 순서는 다음과 같습니다.

> 1. `sitemap.xml.ts` 파일 생성
> 2. `getServerSideProps` 내부에서 URL에 대한 사이트맵 구성하기
> 3. 사이트맵을 요청받으면, 작성된 `xml 사이트맵`을 반환하기

### `sitemap.xml.ts` 파일 생성

`pages` 폴더를 통해서 라우팅을 지원하는 `Next.js` 에서는 `pages`폴더에 `sitemap.xml.ts`라는 이름으로 파일을 만든다.

```tsx
// pages/sitemap.xml.ts
import { NextPage } from "next";
import { getAllPostIds } from "../lib/posts";
import { ServerResponse } from "http";

const SitemapPage: NextPage = () => {
  return null;
};

export default SitemapPage;
```

### `getServerSideProps` 내부에서 URL에 대한 사이트맵 구성하기

#### XML 사이트맵 의 기본 구조

````xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://www.example.com/foo.html</loc>
        <lastmod>2018-06-04</lastmod>
    </url>
</urlset>
````

> [sitemaps.org](https://www.sitemaps.org/protocol.html)에서 복잡한 예와 전체 문서를 확인할 수 있다

1. `<loc>`: 노출될 페이지의 URL
2. `<lastmod>`: 페이지의 정보가 마지막으로 수정된 날짜

`<url></url>`에 들어갈 부분이 URL 정보이므로, 사이트의 모든 URL를 취득해서 다음과 같은 문자열로 만들고, `<urlset></urlset>`내부에 삽입시킬 것이다.

#### XML 사이트맵에 삽입될 문자열

```xml
<url>
    <loc>http://www.example.com/1</loc>
    <lastmod>2018-06-04</lastmod>
</url>
<url>
    <loc>http://www.example.com/2</loc>
    <lastmod>2018-06-04</lastmod>
</url>
<url>
    <loc>http://www.example.com/3</loc>
    <lastmod>2018-06-04</lastmod>
</url>
```

> 여기서, `<loc>`에 들어가는 URL은 상대경로가 아닌 절대 경로를 지정해야 한다.

#### 최종적인 형태의 XML 사이트맵

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://www.example.com/1</loc>
        <lastmod>2018-06-04</lastmod>
    </url>
    <url>
        <loc>http://www.example.com/2</loc>
        <lastmod>2018-06-04</lastmod>
    </url>
    <url>
        <loc>http://www.example.com/3</loc>
        <lastmod>2018-06-04</lastmod>
    </url>
</urlset>
```

```tsx
// pages/sitemap.xml.ts
...
export const getServerSideProps = async ({ res }: { res: ServerResponse }) => {
  const postIdList = getAllPostIds();

  const dynamicPaths = postIdList.map(({ params: { id } }) => {
    return `<url>
      <loc>https://siyeon-park.com/posts/${id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`;
  });

  const allPaths = [...dynamicPaths];
  const xmlContents = createXMLString(allPaths);

  ...
}
```

`getServerSideProps`를 이용해서, 서버 사이드 처리를 진행한다. `getAllPostIds()`함수에서 반환된 URL 값을 `map`으로 순회하면서, `<urlset></urlset>`내부에 넣을 문자열을 만들어주자. 그리고 이를 `createXMLString` 함수에 전달하여, XML 사이트맵 템플릿에 삽입할 것이다.

`getAllPostIds()`함수에서 돌아오는 데이터 타입은 다음과 같다.

```JSON
[
{
  "params": {
    "id": "test-url1"
  }
},
{
  "params": {
    "id": "test-url2"
  }
},
...
]
```

```tsx
// pages/sitemap.xml.ts
...
const SitemapPage: NextPage = () => {
  return null;
};
...

const createXMLString = (xmlContents: string[]): string => {
  const xmlString = xmlContents.join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
          ${xmlString}
        </urlset>
      `;
};

...
```

배열 형태로 되어있는 `xmlContents`를 인자값으로 받아와서, `join` 매서드를 통해서 하나의 문자열로 결합시킨다. 그 후, XML 사이트맵 탬플릿에 삽입 후 반환한다.

### 웹에서 사이트맵을 요청받으면, 작성된 `xml 사이트맵`을 반환하기

```tsx
// pages/sitemap.xml.ts
...
export const getServerSideProps = async ({ res }: { res: ServerResponse }) => {
  const postIdList = getAllPostIds();

  const dynamicPaths = postIdList.map(({ params: { id } }) => {
    return `<url>
      <loc>https://siyeon-park.com/posts/${id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>`;
  });

  const allPaths = [...dynamicPaths];

  const xmlContents = createXMLString(allPaths);

  if (res !== undefined) {
    res.setHeader("Content-Type", "text/xml");
    res.write(xmlContents);
    res.end();
  }

  return {};
};
...
```

최종적으로 `xmlContents`에 저장된 데이터를 ServerResponse 인 `res`로 전달해서 사이트맵을 반환한다.

### 결과 확인

`www.siyeon-park.com/sitemap.xml`로 접속하면 아래와 같이 xml 사이트맵 파일을 확인할 수 있다.
![xml sitemap](/images/posts/sitemap-1.png)

### Google Search Console 에 사이트맵 제출하기

![google search console sitemap 제출 결과](/images/posts/sitemap-2.png)

### 참고링크

1. [Next.js에서 동적 URL의 사이트맵 만들기 📄](https://velog.io/@yiyb0603/Next.js-%EB%8F%99%EC%A0%81-URL-%EC%82%AC%EC%9D%B4%ED%8A%B8%EB%A7%B5)
2. [Next.js에서 동적으로 sitemap.xml 만들기](https://morethanmin.com/posts/hot-to-make-sitemap-in-next-js)
3. [Google Search Center](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=ko)
