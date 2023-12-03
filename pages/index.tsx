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
        <h2 className={styles["category"]}>blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title, category, tags }) => (
            <li className={styles["postList-container"]} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small>
                <Date dateString={date} />
              </small>
              <br />
              <div className={styles["postInfo-container"]}>
                <small>{category}</small>
                <div className={styles["tagList"]}>
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
