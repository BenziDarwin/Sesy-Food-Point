import Image from "next/image";
import { useState } from "react";
import Title from "../../components/ui/Title";
import { addProduct } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { productList } from "../../util/data";

const Index = ({ food }) => {
  const [size, setSize] = useState(0);
  const cart = useSelector((state) => state.cart);

  const findCart = cart.products.find((item) => item._id === food._id);

  const dispatch = useDispatch();

  const handleSize = (sizeIndex) => {
    setSize(sizeIndex);;
  };


  const handleChange = (e, item) => {
    const checked = e.target.checked;
  };

  const handleClick = () => {
    dispatch(
      addProduct({
        ...food,
        foodQuantity: 1,
        title: food.title,
        img: food.img,
        quantity: 1,
      })
    );
  };
  console.log(food);

  return (
    <div className="flex items-center md:h-[calc(100vh_-_88px)] gap-5 py-20 flex-wrap ">
      <div className="relative md:flex-1 md:w-[80%] md:h-[80%] w-36 h-36 mx-auto">
        <Image
          src={food?.img}
          alt=""
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>
      <div className="md:flex-1 md:text-start text-center">
        <Title addClass="text-6xl">{food.title}</Title>
        <p className="text-sm my-4 md:pr-24">{food.desc}</p>
        {food.category === "pizza" && (
          <div>
            <h4 className="text-xl font-bold">Choose the size</h4>
            <div className="flex items-center gap-x-20 md:justify-start justify-center min-h-[100px]">
              <div
                className={`relative w-8 h-8 cursor-pointer hover:h-10 hover:w-10 transition-all ${
                  size === 0 && "border-4 border-primary rounded-full w-10 h-10"
                }`}
                onClick={() => handleSize(0)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Small
                </span>
              </div>
              <div
                className={`relative w-12 h-12 cursor-pointer hover:h-14 hover:w-14 transition-all ${
                  size === 1 && "border-4 border-primary rounded-full w-16 h-16"
                }`}
                onClick={() => handleSize(1)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Medium
                </span>
              </div>
              <div
                className={`relative w-16 h-16 cursor-pointer hover:h-20 hover:w-20 transition-all ${
                  size === 2 && "border-4 border-primary rounded-full w-20 h-20"
                } `}
                onClick={() => handleSize(2)}
              >
                <Image src="/images/size.png" alt="" layout="fill" />
                <span className="absolute top-0 -right-6 text-xs bg-primary rounded-full px-[5px] font-medium">
                  Large
                </span>
              </div>
            </div>
          </div>
        )}
        <button
          className="btn-primary"
          onClick={handleClick}
          disabled={findCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  return {
    props: {
      food: productList[params.id],
    },
  };
};

export default Index;
