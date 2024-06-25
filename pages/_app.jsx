import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../styles/globals.css";

import Layout from "../layout/Layout";

import { Provider } from "react-redux";
import store from "../redux/store";

import { ToastContainer } from "react-toastify";

import { Router, useRouter } from "next/router";

import nProgress from "nprogress";
import Head from "next/head";

Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  return (
      <Provider store={store}>
        <Head>
        <title>Sesy Food Point</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link rel='icon' href='/favicon.ico' />
        </Head>
        {router.pathname.startsWith("/admin") ? (
          <div className="bg-[#ececec] h-screen">
            <ToastContainer />
            <Component {...pageProps} />
          </div>
        ) : (
          <Layout>
            <ToastContainer />
            <Component {...pageProps} />
          </Layout>
        )}
      </Provider>
  );
}

export default MyApp;
