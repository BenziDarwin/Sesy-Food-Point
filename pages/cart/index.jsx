import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Title from "../../components/ui/Title";
import FireStore from "../../firebase/firestore";
import {
  quantityDecrease,
  quantityIncrease,
  removeProduct,
  reset,
} from "../../redux/cartSlice";

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
      timestamp: product.timestamp,
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
    return uniqueDays.size === selectedDays.length && selectedDays.every((day) => daysOfWeek.includes(day));
  };

  const isWeekday = () => {
    const today = new Date();
    const day = today.getDay();
    return day !== 0 && day !== 6;
  };

 
  const getCurrentWeekOrders = async (uid) => {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay(); 
      const last = first + 6;

      const firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0, 0);

      const lastday = new Date(curr.setDate(last));
      lastday.setHours(23, 59, 59, 999);

      const orders = await new FireStore("orders").conditionalGet([
        { field: "customer", operator: "==", value: uid },
      ]);

      const currentOrders = orders.filter(order => {
        const orderDate = new Date(order.timestamp.toDate());
        return orderDate >= firstday && orderDate <= lastday;
      });

      return currentOrders;
    } catch (error) {
      console.error("Error fetching current week orders:", error);
      return [];
    }
  };

  const createOrder = async () => {
    try {
      // if (!isWeekday()) {
      //   toast.error("Orders can only be placed on weekdays.");
      //   return;
      // }

      if (!validateDays()) {
        toast.error("Please select a unique day for each product.");
        return;
      }

      const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
      if (!user) {
        router.push("/auth/login");
        throw new Error("You must be logged in to create an order");
      }

      const uid = user.user.uid.substring(0, 5);
      const currentWeekOrders = await getCurrentWeekOrders(uid);
      if (currentWeekOrders.length > 0) {
        if (!confirm("You already have orders for this week. Creating new orders will override the old ones. Do you want to proceed?")) {
          return;
        }

        const orderIds = currentWeekOrders.map(order => order.id);
        await new FireStore("orders").deleteDocuments(orderIds);
      }

      const orders = productState.map((item) => ({
        ...item,
        customer: uid,
        timestamp: new Date(),
      }));

      await new FireStore("orders").addDocuments(orders);
      router.push(`/menu`);
      dispatch(reset());
      toast.success("Order created successfully");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
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
    dispatch(removeProduct(index));
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
        <div className="bg-secondary min-h-[calc(100vh_-_433px)] md:h-screen flex flex-col justify-center text-white p-12 lg:w-auto md:w-[250px] w-full md:text-start !text-center">
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
