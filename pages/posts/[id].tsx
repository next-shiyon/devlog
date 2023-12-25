import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";
import Markdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostType } from "..";
import styles from "./index.module.scss";
import SyntaxHighlighter from "react-syntax-highlighter";
import { ClassAttributes, HTMLAttributes } from "react";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Image from "next/image";

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

const Pre = ({
  children,
  ...props
}: ClassAttributes<HTMLPreElement> &
  HTMLAttributes<HTMLPreElement> &
  ExtraProps) => {
  if (!children || typeof children !== "object") {
    return <code {...props}>{children}</code>;
  }
  const childType = "type" in children ? children.type : "";
  if (childType !== "code") {
    return <code {...props}>{children}</code>;
  }

  const childProps = "props" in children ? children.props : {};
  const { className, children: code } = childProps;
  const language = className?.replace("language-", "");

  return (
    <SyntaxHighlighter language={language} style={atomOneDark}>
      {String(code).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

const Post = ({ postData }: Props) => {
  const H2 = ({ node, ...props }: any) => {
    return <h2 id={node.position?.start.line.toString()}>{props.children}</h2>;
  };

  const H3 = ({ node, ...props }: any) => {
    return <h3 id={node.position?.start.line.toString()}>{props.children}</h3>;
  };

  const ImageWrapper = ({ node }: any) => {
    const {
      properties: { src, alt },
    } = node;
    return (
      <Image
        src={src}
        alt={alt}
        loading="lazy"
        width={0}
        height={0}
        quality={70}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
    );
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
            pre: Pre,
            img: ImageWrapper,
          }}
        >
          {postData.content}
        </Markdown>
      </article>
    </Layout>
  );
};

export default Post;
