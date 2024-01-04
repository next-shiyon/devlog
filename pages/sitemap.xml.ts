import { NextPage } from "next";
import { getAllPostIds } from "../lib/posts";
import { ServerResponse } from "http";

const SitemapPage: NextPage = () => {
  return null;
};

const createXMLString = (xmlContents: string[]): string => {
  const xmlString = xmlContents.join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
          ${xmlString}
        </urlset>
      `;
};

export const getServerSideProps = async ({ res }: { res: ServerResponse }) => {
  const postIdList = getAllPostIds();

  const dynamicPaths = postIdList.map(({ params: { id } }) => {
    return `<url>
      <loc>https://www.siyeon-park.com/posts/${id}</loc>
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

export default SitemapPage;
