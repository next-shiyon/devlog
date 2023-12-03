import { AppProps } from "next/app";
import "../styles/common-properties.scss";
import "../styles/global.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
