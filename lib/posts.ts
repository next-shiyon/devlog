import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostType } from "../pages";
import { PostDataType } from "../pages/posts/[id]";

const postsDirectory = path.join(process.cwd(), "posts");

export const getSortedPostsData = (): PostType[] => {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName): PostType => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);
    const { title, date, category, tags } = matterResult.data;

    return {
      id,
      title,
      date,
      category,
      tags,
    };
  });

  return allPostsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
};

export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostData = async (id: string): Promise<PostDataType> => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const { content, data } = matterResult;
  const { title, date, category, tags } = data;

  return {
    id,
    title,
    date,
    category,
    tags,
    content,
  };
};
