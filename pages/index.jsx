import axios from "axios";
import Head from "next/head";
import Home from "./home";
import { categoryList, productList } from "../util/data";

export default function Index({ categoryList, productList }) {
  return (
    <div className="">
      <Head>
        <title>Sesy Food Point</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <Home categoryList={categoryList} productList={productList} />
    </div>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      categoryList: categoryList,
      productList: productList,
    },
  };
};
