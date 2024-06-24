import Image from "next/image";
import Title from "./ui/Title";

const About = () => {
  return (
    <div className="bg-secondary py-14">
      <div className="container mx-auto flex items-center text-white gap-20 justify-center flex-wrap-reverse">
        <div className="flex justify-center">
          <div className="relative sm:w-[445px] sm:h-[600px]  flex justify-center w-[300px] h-[450px]">
            <Image src="/images/about-img.png" alt="" layout="fill" />
          </div>
        </div>
        <div className="md:w-1/2 ">
        <Title addClass="text-[40px]">About Us</Title>
<p className="my-5 flex flex-col items-center">
  Nestled in the heart of Kololo on Baskerville Avenue, our restaurant
   is a culinary haven for food enthusiasts. We specialize in a wide array of cuisines, 
   catering to diverse palates with our expertly crafted dishes. Our commitment to quality 
   and service ensures that every meal is a memorable experience. Beyond our delicious in-house dining, 
   we offer convenient delivery services, bringing the best food in town right to your doorstep. At our 
   restaurant, we take pride in our passion for food and our dedication to making every visit delightful.
    We look forward to welcoming you and serving you with a smile.
</p>
          <button className="btn-primary">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default About;
