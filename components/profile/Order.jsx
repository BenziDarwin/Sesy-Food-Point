import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FireStore from "../../firebase/firestore";
import Title from "../ui/Title";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();


  const getCurrentWeekOrders = async (uid) => {
    try {
      const curr = new Date(); // get current date
      const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week + 1 (Monday)
      const last = first + 6; // Last day is the first day + 4 (Friday)

      const firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0, 0); // Set time to the start of the day

      const lastday = new Date(curr.setDate(last));
      lastday.setHours(23, 59, 59, 999); // Set time to the end of the day

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

  const fetchOrders = async (uid) => {
    try {
      const odrs = await getCurrentWeekOrders(uid);
      if(odrs || odrs.length > 0) {
        setOrders(odrs);
      }
    
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
    if (user) {
      setCurrentUser(user)
      fetchOrders(user.user.uid.substring(0, 5));
    } else {
      router.push("/auth/login");
    }
  }, [router]);


  return (
    <div className="lg:p-8 flex-1 lg:mt-0 mt-5">
      <Title addClass="text-[40px]">My Orders</Title>
      <div className="overflow-x-auto w-full mt-5">
        <table className="md:w-[60vw] w-full text-sm text-center text-gray-500 xl:min-w-[1000px]">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="py-3 px-6">
                ID
              </th>
              <th scope="col" className="py-3 px-6">
                CUSTOMER
              </th>
              <th scope="col" className="py-3 px-6">
                ORDER
              </th>
              <th scope="col" className="py-3 px-6">
                DATE
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                className="transition-all bg-secondary border-gray-700 hover:bg-primary  cursor-pointer"
                key={order.id}
              >
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white flex items-center gap-x-1 justify-center">
                  <span>{order.id}...</span>
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {currentUser.fullName}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
                  {order.title}
                </td>
                <td className="py-4 px-6 font-medium whitespace-nowrap hover:text-white">
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
