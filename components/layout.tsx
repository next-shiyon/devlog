import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.scss";
import TableOfContents from "./tableOfContents";
import Image from "next/image";

export const siteTitle = "FRONT INSIGHTS";

type Props = {
  children: React.ReactNode;
  home?: any;
};

const Layout = ({ children, home }: Props) => {
  return (
    <>
      <header className={styles["header"]}>
        <Link href="/">
          <Image
            className={styles["logo"]}
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={0}
            sizes="100vw"
            style={{ height: "auto" }}
          />
        </Link>
      </header>
      <div className={styles["layout"]}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="韓国人フロンドエンドエンジニアのつぶやきブログ"
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
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

        <main className={styles["content-container"]}>
          {children}
          {!home && (
            <div className={styles["backToHome"]}>
              <Link href="/">← Back to home</Link>
            </div>
          )}
        </main>
      </div>
      <footer className={styles["footer"]}>
        Copyright 2023. SIYEON PARK All Rights Reserved.
      </footer>
    </>
  );
};

export default Layout;
