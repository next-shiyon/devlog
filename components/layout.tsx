import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "./layout.module.scss";
import TableOfContents from "./tableOfContents";

const name = "SIYEON PARK";
export const siteTitle = "SIYEON's blog";

type Props = {
  children: React.ReactNode;
  home?: any;
};

const Layout = ({ children, home }: Props) => {
  return (
    <div className={styles["container"]}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="韓国人フロンドエンドエンジニアのつぶやきブログ"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://siyeon-park.com"} />
        <meta property="og:article:author" content="SIYEON PARK" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="all" />
        <meta
          name="google-site-verification"
          content="CIWWv06k_isL0fYmnOS2gyxrWDQWK_JvGq-pW2ZkhUM"
        />
      </Head>

      {!home && (
        <div className={styles["table-of-contents"]}>
          <TableOfContents />
        </div>
      )}
      {home && (
        <header className={styles["header-container"]}>
          <figure>
            <Image
              priority
              src="/images/profile.jpg"
              height={144}
              width={144}
              alt={name}
              quality={70}
            />
            <figcaption>
              <h1>{name}</h1>
              <p>I love Front-End so much ... ✨</p>
            </figcaption>
          </figure>
        </header>
      )}

      <main className={styles["content-container"]}>
        {children}
        {!home && (
          <div className={styles["backToHome"]}>
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </main>

      <footer className={styles["footer"]}>
        Copyright 2023. SIYEON PARK All Rights Reserved.
      </footer>
    </div>
  );
};

export default Layout;
