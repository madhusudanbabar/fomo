import { useAppSelector } from "@/store";

const StockTable: React.FunctionComponent<never> = () => {
  const stocks = useAppSelector((state) => state.stocks);

  return <h1>Hello World</h1>;
};
export default StockTable;
