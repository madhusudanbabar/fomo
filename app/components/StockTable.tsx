"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { addStock } from "@/store/stocksSlice";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io();

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [stock, setStock] = useState("BTC");

  const store = useAppSelector((state) => state.stocks.stocks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      socket.emit("stock", stock);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("stock-updated", (msg: any) => {
      console.log("stock-updated", msg);
      if (Array.isArray(msg)) {
        dispatch(addStock(msg));
      }
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log(store);
  }, [store]);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <p>Stock: {stock}</p>
      <table>
        <thead>
          <tr>
            <th>sr no.</th>
            <th>Code</th>
            <th>Rate</th>
            <th>Volume</th>
            <th>Cap</th>
          </tr>
        </thead>
        <tbody>
          {store.map((row, index) => (
            <tr key={`${row._id}-${row.code}`}>
              <td>{index + 1}</td>
              <td>{row.code}</td>
              <td>{row.rate}</td>
              <td>{row.volume}</td>
              <td>{row.cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
