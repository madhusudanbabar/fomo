import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Stock {
  code: string;
  volume: number;
  cap: number;
  rate: number;
  _id: number;
}

const initialState: { stocks: Stock[]; symbols: string[] } = {
  stocks: [],
  symbols: [],
};

export const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock(state, action: PayloadAction<Stock[]>) {
      state.stocks = action.payload;
    },
    setSymbols(state, action: PayloadAction<string[]>) {
      state.symbols = action.payload;
    },
    resetStocks(state) {
      state.stocks = [];
    },
  },
});

export const { addStock, setSymbols, resetStocks } = stocksSlice.actions;
export const stocksReducer = stocksSlice.reducer;
