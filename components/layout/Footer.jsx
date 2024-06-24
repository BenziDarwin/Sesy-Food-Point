import React, { useEffect, useState } from "react";
import Title from "../ui/Title";
import axios from "axios";

const Footer = () => {
  return (
    <div className="bg-secondary text-white">
      <div className="container mx-auto pt-16 pb-6">
        <div className="flex md:justify-between justify-center text-center flex-wrap md:gap-y-0 gap-y-6 ">
          <div className="md:flex-1">
            <Title addClass="text-[30px]">Contact Us</Title>
            <div className="flex flex-col gap-y-2 mt-3">
              <a href="https://maps.app.goo.gl/oh1LHjNwvVattYa2A" target="_blank" rel="noreferrer">
                <i className="fa fa-map-marker"></i>
                <span className="inline-block ml-2">Location</span>
              </a>
              <div>
                <i className="fa fa-phone"></i>
                <a
                  className="inline-block ml-2"
                  href={`tel:+256774791185`}
                >
                  +256 774 791 185
                </a>
              </div>
            </div>
          </div>
          <div className="md:flex-1">
            <Title addClass="text-[38px]">Sesy Food Point</Title>
            <p className="mt-3">For All your cravings...</p>
            <div className="flex items-center justify-center mt-5 gap-x-2">
            
            </div>
          </div>
          <div className="md:flex-1">
            <Title addClass="text-[30px]">Opening Hours</Title>
            <div className="flex flex-col gap-y-2 mt-3">
              <div>
                <span className="inline-block ml-2">
                  Monday to Friday
                </span>
              </div>
              <div>
                <span className="inline-block ml-2">
                  8:00am to 5:00pm
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-10">
          Developed by <a href="https://innosolvetech.com">Innosolve Tech</a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
