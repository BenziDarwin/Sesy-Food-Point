import React from "react";
import About from "../../components/About";
import Head from "next/head";

const Index = () => {
  return (
    <div>
        <Head>
        <title>About Us - Sesy Food Point</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <About />
    </div>
  );
};

export default Index;
