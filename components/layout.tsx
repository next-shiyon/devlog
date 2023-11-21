import Head from "next/head";
import Image from "next/image";
import styles from "./layout.module.scss";
import utilStyles from "../styles/utils.module.scss";
import Link from "next/link";

const name = "SIYEON PARK";
export const siteTitle = "SIYEON's blog";

type Props = {
  children: React.ReactNode;
  home?: any;
};

const Layout = ({ children, home }: Props) => {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="韓国人フロンドエンドエンジニアのつぶやきブログ"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="all" />
        <meta
          name="google-site-verification"
          content="CIWWv06k_isL0fYmnOS2gyxrWDQWK_JvGq-pW2ZkhUM"
        />
      </Head>

      <header>
        {home ? (
          <figure className={styles.profile}>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={name}
            />
            <figcaption>
              <h1 className={utilStyles.heading2Xl}>{name}</h1>
              <p>I love Front-End so much ... ✨</p>
            </figcaption>
          </figure>
        ) : (
          <Link href="/" className={utilStyles.colorInherit}>
            <figure className={styles.profile}>
              <Image
                priority
                src="/images/profile.jpg"
                className={utilStyles.borderCircle}
                height={108}
                width={108}
                alt={name}
              />
              <figcaption>
                <h2 className={utilStyles.headingLg}>{name}</h2>
              </figcaption>
            </figure>
          </Link>
        )}
      </header>

      <main>{children}</main>

      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
};

export default Layout;
