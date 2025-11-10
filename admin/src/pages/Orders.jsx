import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKEND_URL
const currency = import.meta.env.VITE_CURRENCY || "$"

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token"); // lấy token admin
  console.log("Admin token:", token);

  const fetchOrders = async () => {
    if (!token) return console.error("No admin token found");

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/all`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        
        const safeOrders = (response.data.orders || []).map((order) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
          address: order.address || {},
        }));
        setOrders(safeOrders);
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.message || "Error loading order list");
    }
  };
const handleStatusChange = async (orderId, newStatus) => {
    try {
        const response = await axios.patch( 
            `${backendUrl}/api/order/status`,
            { 
                orderId, 
                status: newStatus 
            },
            { 
                headers: { Authorization: `Bearer ${token}` } 
            }
        );

        if (response.data.success) {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            toast.success("Order status updated successfully");
        } else {
            toast.error(response.data.message || "Update failed");
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        toast.error(error.response?.data?.message || "An error occurred while updating");
    }
};
  useEffect(() => {
    fetchOrders();
  }, []);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      <div className="grid gap-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order.id || index}
              className="border p-4 rounded-lg shadow bg-white"
            >
              {/* --- Header --- */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={assets.parcel_icon}
                  alt="parcel"
                  className="w-10 h-10"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {order.items?.map((item, idx) => (
                      <span key={idx}>
                        {item.name} x {item.quantity} ({item.size})
                        {idx < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- Order Details --- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium">Customer</p>
                  <p><span className="font-medium">Recipient:</span>{order.address?.fullName || "N/A"}</p>
                  <p><span className="font-medium">Phone:</span> {order.address?.phone || "N/A"}</p>
                  <p><span className="font-medium">Email:</span>{order.address?.email || "N/A"}</p>
                  <p><span className="font-medium">Address:</span>{order.address?.address || "N/A"}</p>
                </div>

                <div>
                  <p className="font-medium">Order Info</p>
                  <p>Items: {order.items?.length || 0}</p>
                  <p>Method: {order.paymentMethod || "N/A"}</p>
                  <p>Payment: {order.payment ? "Paid" : "Pending"}</p>
                  <p>
                    Date:{" "}
                    {order.date
                      ? new Date(order.date).toLocaleString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-lg font-semibold">
                    {currency}
                    {order.amount?.toLocaleString("en-US") || "0"}
                  </p>
                </div>
              </div>

              {/* --- Status --- */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={order.status || "Order Placed"}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value)
                  }
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
