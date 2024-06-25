import Title from "../../components/ui/Title";
import { useSelector, useDispatch } from "react-redux";
import {
  quantityDecrease,
  quantityIncrease,
  reset,
  removeProduct,
} from "../../redux/cartSlice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FireStore from "../../firebase/firestore";

const Cart = ({ userList }) => {
  const cart = useSelector((state) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();
  const [productState, setProductState] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const productTitles = cart.products.map((product) => ({
      title: product.title,
      selectedDay: "",
      timestamp: product.timestamp, // Include timestamp
    }));
    setProductState(productTitles);
  }, [cart.products]);

  const handleDayChange = (index, day) => {
    const newProductState = [...productState];
    newProductState[index].selectedDay = day;
    setProductState(newProductState);
  };

  const validateDays = () => {
    const selectedDays = productState.map((product) => product.selectedDay);
    const uniqueDays = new Set(selectedDays);
    return uniqueDays.size === 5 && selectedDays.every((day) => daysOfWeek.includes(day));
  };

  const isWeekday = () => {
    const today = new Date();
    const day = today.getDay();
    return day !== 0 && day !== 6; // Check if today is not Saturday (6) or Sunday (0)
  };

  const createOrder = async () => {
    try {
      if (!isWeekday()) {
        toast.error("Orders can only be placed on weekdays.");
        return;
      }

      if (!validateDays()) {
        toast.error("Please select a unique day for each product from Monday to Friday.");
        return;
      }

      if (sessionStorage.getItem("user")) {
        if (confirm("Are you sure you want to create this order?")) {
          const orders = productState.map((item) => ({
            ...item,
            customer: JSON.parse(sessionStorage.getItem("user")).user.uid.substring(0, 5),
          }));
          await new FireStore("orders").addDocuments(orders).then(() => {
            router.push(`/menu`);
            dispatch(reset());
            toast.success("Order created successfully");
          });
        }
      } else {
        router.push("/auth/login");
        throw new Error("You must be logged in to create an order");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const quantityChange = (type, price) => {
    if (type === 0) {
      dispatch(quantityDecrease(price));
    }
    if (type === 1) {
      dispatch(quantityIncrease(price));
    }
  };

  const handleDelete = (index) => {
    dispatch(removeProduct(index)); // Dispatch the removeProduct action
    const newProductState = [...productState];
    newProductState.splice(index, 1);
    setProductState(newProductState);
  };
  return (
    <div className="min-h-[calc(100vh_-_433px)]">
      <div className="flex justify-between items-center md:flex-row flex-col">
        <div className="md:min-h-[calc(100vh_-_433px)] flex items-center flex-1 p-10 overflow-x-auto w-full justify-center">
          {cart.products.length > 0 ? (
            <div className="max-h-[40rem] overflow-auto">
              <table
                className="w-full text-sm text-center text-gray-500 min-w-[591px] lg:min-w-[650px] xl:min-w-[1000px] 2xl:min-w-[1250px] lg:min-h-[500px] 
              md:min-h-[300px]  lg:text-lg"
              >
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th scope="col" className="py-3 px-0">
                      PRODUCT
                    </th>
                    <th scope="col" className="py-3 px-6">
                      DAY
                    </th>
                    <th scope="col" className="py-3 px-6">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.products.map((product, index) => (
                    <tr
                      className="transition-all bg-secondary border-gray-700 hover:bg-primary"
                      key={product._id}
                    >
                      <td className="py-4 px-0 font-medium whitespace-nowrap text-white hover:text-white ">
                        <span className="text-white">{product.title}</span>
                      </td>
                      <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                        <select
                          className="bg-gray-800 text-white border border-gray-600 rounded-md p-2"
                          value={productState[index]?.selectedDay}
                          onChange={(e) => handleDayChange(index, e.target.value)}
                        >
                          <option value="">Select a day</option>
                          {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                        <button
                          className="bg-red-600 text-white rounded-md px-4 py-2"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-semibold">Your cart is empty</h1>
              <button
                className="btn-primary mt-4"
                onClick={() => router.push("/menu")}
              >
                Go to menu
              </button>
            </div>
          )}
        </div>
        <div className="bg-secondary min-h-[calc(100vh_-_433px)] md:h-screen flex flex-col justify-center text-white p-12 lg:w-auto md:w-[250px] w-full   md:text-start !text-center">
          <Title addClass="text-[40px]">CART TOTAL</Title>
          <div>
            <button
              className="btn-primary mt-4 md:w-auto w-52"
              onClick={createOrder}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
