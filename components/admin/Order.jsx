import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Title from "../ui/Title";
import FireStore from "../../firebase/firestore";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const router = useRouter();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getCurrentWeekOrders = async () => {
    try {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week + 1 (Monday)
      const last = first + 4; // Last day is the first day + 4 (Friday)

      const firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0, 0); // Set time to the start of the day

      const lastday = new Date(curr.setDate(last));
      lastday.setHours(23, 59, 59, 999); // Set time to the end of the day

      const orders = await new FireStore("orders").conditionalGet([]);

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

  const fetchOrders = async () => {
    try {
      const odrs = await getCurrentWeekOrders();
      if (odrs.length > 0) {
        setOrders(odrs);
        setFilteredOrders(odrs);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
    if (user) {
      fetchOrders();
    } else {
      router.push("/auth/login");
    }
  }, []);

  const handleDayFilterChange = (day) => {
    setSelectedDay(day);
    if (day) {
      const filtered = orders.filter(order => order.selectedDay === day);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5 lg:max-w-[70%] xl:max-w-none flex flex-col justify-center">
      <Title addClass="text-[40px]">Products</Title>
      <div className="mt-5 flex justify-between items-center">
        <label className="text-gray-500 text-sm mr-2">Filter by Day:</label>
        <select
          className="bg-gray-800 text-white border border-gray-600 rounded-md p-2"
          value={selectedDay}
          onChange={(e) => handleDayFilterChange(e.target.value)}
        >
          <option value="">All</option>
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto w-full mt-5">
        <table className="w-full text-sm text-center text-gray-500">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                Customer
              </th>
              <th scope="col" className="py-3 px-6">
                Product
              </th>
              <th scope="col" className="py-3 px-6">
                Day
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 &&
              filteredOrders.map((order) => (
                <tr
                  className="transition-all bg-secondary border-gray-700 hover:bg-primary"
                  key={order.id}
                >
                  <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1">
                    {order.customer}
                  </td>
                  <td className="py-4 px-6 font-medium hover:text-white flex-wrap w-[100px] whitespace-nowrap">
                    {order.title}
                  </td>
                  <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white gap-x-1">
                    {order.selectedDay}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
