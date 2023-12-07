import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostType } from "..";
import styles from "./index.module.scss";
import TableOfContents from "../../components/tableOfContents";

type ParamType = {
  params: Pick<PostType, "id">;
};

export type PostDataType = PostType & {
  content: string;
};

type Props = {
  postData: PostDataType;
};

export const getStaticPaths = async () => {
  const paths = getAllPostIds();
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }: ParamType) => {
  const postData = await getPostData(params.id);
  return {
    props: { postData },
  };
};

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
