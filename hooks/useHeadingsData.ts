import { useEffect, useState } from "react";

type HeadingType = {
  id: string;
  title: string;
};

export type NestedHeadingType = HeadingType & {
  items: HeadingType[];
};

const getNestedHeadings = (headingElements: Array<HTMLHeadingElement>) => {
  const nestedHeadings: NestedHeadingType[] = [];

  headingElements.forEach((heading) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};

export const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState<NestedHeadingType[]>([]);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2, h3")
    ) as HTMLHeadingElement[];

    const newNestedHeading = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeading);
  }, []);

  return { nestedHeadings };
};
