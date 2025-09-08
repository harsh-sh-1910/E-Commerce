import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { RiFileList3Fill } from "react-icons/ri";

const Dashboard = () => {
  const URL = "https://e-commerce-4pcq.onrender.com";
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: {},
      xAxis: { data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      yAxis: {},
      series: [
        {
          name: "Sales",
          type: "bar",
          data: [120, 200, 150, 80, 70, 110, 130],
        },
      ],
    });

    return () => chart.dispose();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Your Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mt-5">
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3 px-2">
            <p className="text-2xl font-bold">
              New <br /> Orders
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">1234</p>
        </div>
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              Pending <br /> Shipping
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              In <br /> Transit
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              Delivered <br />
              Order
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold">Your Payments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mt-5">
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              Pending <br /> Payment
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>

        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              Total <br />
              Payment
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
      </div>
      <h2 className="text-3xl font-bold">Your Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 mt-5">
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3 px-2">
            <p className="text-2xl font-bold">
              Total <br /> Products
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">1234</p>
        </div>

        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              New <br /> Products
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
        <div className="bg-white rounded-xl shadow py-7 px-5 flex justify-between items-center">
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold">
              Out Of
              <br />
              Stock
            </p>
          </div>
          <p className="text-2xl font-semibold px-2">782</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h1 className="w-full text-center text-xl font-semibold">
          Daily sales
        </h1>
        <div ref={chartRef} style={{ height: "400px" }} />
      </div>
    </div>
  );
};

export default Dashboard;
