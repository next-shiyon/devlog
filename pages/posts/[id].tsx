import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostType } from "..";

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
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <Markdown remarkPlugins={[remarkGfm]}>{postData.content}</Markdown>
      </article>
    </Layout>
  );
};

export default Post;
