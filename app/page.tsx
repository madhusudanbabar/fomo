"use client";

import ReduxProvider from "@/store/redux-provider";
import { useAppSelector } from "@/store";
import StockTable from "./components/StockTable";

export default function Home() {
  return (
    <ReduxProvider>
      <StockTable />
    </ReduxProvider>
  );
}
