import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push({
        ...action.payload,
        timestamp: new Date().toISOString(),  // Add timestamp
      });
      state.quantity += action.payload.quantity;
      state.total += action.payload.price;
    },
    reset: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
    quantityIncrease: (state, action) => {
      state.products.forEach((item) => {
        if (item.title === action.payload.title) {
          state.quantity += 1;
          item.foodQuantity += 1;
          state.total += action.payload.price;
        }
      });
    },
    quantityDecrease: (state, action) => {
      state.products.forEach((item) => {
        if (item.title === action.payload.title) {
          if (item.foodQuantity > 1) {
            state.quantity -= 1;
            item.foodQuantity -= 1;
            state.total -= action.payload.price;
          } else {
            state.products = state.products.filter(
              (item) => item.title !== action.payload.title
            );
            state.quantity -= 1;
            state.total -= action.payload.price;
          }
        }
      });
    },
    removeProduct: (state, action) => {
      state.products.splice(action.payload, 1);
    },
  },
});

export const { addProduct, reset, quantityDecrease, quantityIncrease, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
