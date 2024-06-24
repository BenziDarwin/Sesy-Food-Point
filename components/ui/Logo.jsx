import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex justify-center items-center ">
      <Image src="/images/logo.png" width={100} height={100} className="m-3"/>
      <span className="text-[2rem] font-dancing font-bold cursor-pointer">
     
     Sesy Food Point
   </span>
      </div>
     
    </Link>
  );
};

export default Logo;
