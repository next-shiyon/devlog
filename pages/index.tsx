import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";

import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";
import Date from "../components/date";
import styles from "./index.module.scss";

export type PostType = {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
};

type Props = {
  allPostsData: PostType[];
};

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

const Home = ({ allPostsData }: Props) => {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <h2>Blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title, category, tags }) => (
            <li key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
              <br />
              <div>
                <small>{category}</small>
                <div>
                  {tags.map((tag, index) => (
                    <small key={index}>{tag}</small>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default Home;
