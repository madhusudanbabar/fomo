"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { addStock, setSymbols } from "@/store/stocksSlice";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

export default function Home() {
  const store = useAppSelector((state) => state.stocks.stocks);
  const stocksList = useAppSelector((state) => state.stocks.symbols);
  const dispatch = useAppDispatch();

  const [stock, setStock] = useState<string>("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      fetch("/api/stockList")
        .then((res) => res.json())
        .then((data: { stocks: string[] }) => {
          const selected = data.stocks;
          dispatch(setSymbols(selected));
          socket.emit("stock", selected[0]);
          setStock(selected[0] || "");
        });
    }

    socket.on("connect", onConnect);

    socket.on("stock-updated", (msg: any) => {
      if (Array.isArray(msg)) {
        dispatch(addStock(msg));
      }
    });

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const handleChange = (event: Event) => {
    const selectedStock = (event.target as HTMLSelectElement).value;
    socket.emit("stock", selectedStock);
    setStock(selectedStock);
  };

  return (
    <div className="prose py-2">
      <div className="container mx-auto">
        <h1 className="text-center">Realtime Crypto Prices</h1>

        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select Crypto
        </label>

        <select
          className="block w-72 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleChange}
        >
          {(stocksList || []).map((code) => (
            <option key={code} value={code} className="capitalize">
              {code}
            </option>
          ))}
        </select>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  sr no.
                </th>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Rate
                </th>
                <th scope="col" className="px-6 py-3">
                  Volume
                </th>
                <th scope="col" className="px-6 py-3">
                  Cap
                </th>
              </tr>
            </thead>

            <tbody>
              {store.map((row, index) => (
                <tr
                  key={`${row._id}-${row.code}`}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.code}
                  </td>
                  <td className="px-6 py-4">{row.rate}</td>
                  <td className="px-6 py-4">{row.volume}</td>
                  <td className="px-6 py-4">{row.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
