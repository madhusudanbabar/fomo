import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Stock {
  code: string;
  volume: number;
  cap: number;
  rate: number;
}

const initialState: Stock[] = [];

export const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock(state, action: PayloadAction<any>) {
      state.push(action.payload);
    },
  },
});

export const { addStock } = stocksSlice.actions;
export const stocksReducer = stocksSlice.reducer;
