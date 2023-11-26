import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.scss";
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
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, category, tags }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <br />
              <div className={styles.postInfoContainer}>
                <small className={utilStyles.lightText}>{category}</small>
                <div className={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <small
                      className={`${utilStyles.lightText} ${styles.tag}`}
                      key={index}
                    >
                      {tag}
                    </small>
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
