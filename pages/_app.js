// pages/_app.js
import "../styles/globals.css";
import "antd/dist/reset.css";
import { AppProvider } from "../context/AppContext";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  );
}
