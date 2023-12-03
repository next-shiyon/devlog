import { AppProps } from "next/app";
import "../styles/global.scss";
import "../styles/common-properties.css";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
