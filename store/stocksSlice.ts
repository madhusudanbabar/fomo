import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Stock {
  code: string;
  volume: number;
  cap: number;
  rate: number;
  _id: number;
}

const initialState: { stocks: Stock[] } = {
  stocks: [{ cap: 1222, code: "GOOG", rate: 13233, volume: 212123, _id: 99 }],
};

export const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock(state, action: PayloadAction<any>) {
      state.stocks = action.payload;
    },
    resetStocks(state) {
      state.stocks = [];
    },
  },
});

export const { addStock, resetStocks } = stocksSlice.actions;
export const stocksReducer = stocksSlice.reducer;
