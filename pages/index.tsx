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
        <h2 className={styles["category"]}>RECENTLY PUBLISHED</h2>
        <ul>
          {allPostsData.map(({ id, date, title, category, tags }) => (
            <li className={styles["post-container"]} key={id}>
              <article>
                <h3 className={styles["postTitle"]}>
                  <Link href={`/posts/${id}`}>{title}</Link>
                </h3>

                <div className={styles["postInfo-container"]}>
                  <small className={styles["postInfo-category"]}>
                    {category}
                  </small>
                  <small>
                    <Date dateString={date} />
                  </small>

                  {/* <div className={styles["tagList"]}>
                    {tags.map((tag, index) => (
                      <span key={index}>{tag}</span>
                    ))}
                  </div> */}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default Home;
