import React from "react";
import MenuWrapper from "../../components/product/MenuWrapper";
import axios from "axios";
import Head from "next/head";
import { categoryList, productList } from "../../util/data";

const Index = ({ categoryList, productList }) => {
  return (
    <div className="pt-10">
        <Head>
        <title>Our Menu - Sesy Food Point</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <MenuWrapper categoryList={categoryList} productList={productList} />
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      categoryList: categoryList,
      productList: productList,
    },
  };
};

export default Index;
