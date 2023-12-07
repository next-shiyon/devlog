import { NestedHeadingType, useHeadingsData } from "../hooks/useHeadingsData";
import styles from "./tableOfContents.module.scss";

type HeadingsType = {
  headings: NestedHeadingType[];
};

const Headings = ({ headings }: HeadingsType) => (
  <ul>
    {headings.map((heading) => (
      <li key={heading.id}>
        <a href={`#${heading.id}`}>{heading.title}</a>
        <ul>
          {heading.items.map((child) => (
            <li key={child.id}>
              <a href={`#${child.id}`}>{child.title}</a>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
);

export const TableOfContents = () => {
  const { nestedHeadings } = useHeadingsData();

  return (
    <nav className={styles["tableOfContents"]} aria-label="Table of contents">
      <Headings headings={nestedHeadings} />
    </nav>
  );
};

export default TableOfContents;
