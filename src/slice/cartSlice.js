import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axiosInstance";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`/carts/${userId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const addCartItems = createAsyncThunk(
  "cart/addCartItems",
  async (cartItems, thunkAPI) => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      user = user._id;

      // product -> products의 _id, quantity -> default: 1
      cartItems = cartItems.map((cartItem) => ({
        product: cartItem._id,
        quantity: cartItem.qty,
        size: cartItem.size,
      }));

      console.log("{user, cartItems}", { user, cartItems });
      const res = await axios.post("/carts", { user, cartItems });
      if (res.status === 201) thunkAPI.dispatch(getCartItems(user));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const updateCartItems = createAsyncThunk(
  "cart/updateCartItems",
  async (cartItems, thunkAPI) => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      user = user._id;

      cartItems = cartItems.map((cartItem) => {
        return { product: cartItem._id, quantity: cartItem.qty };
      });
      console.log("{user, cartItems}22", { user, cartItems });
      const res = await axios.put("/carts", { user, cartItems });
      // if (res.status === 201) thunkAPI.dispatch(getCartItems());

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const cartItem = state.cartItems.find(
        (item) =>
          item._id === action.payload._id && item.size === action.payload.size
      );
      console.log("cartItem", cartItem);
      console.log("state", action);
      cartItem
        ? (cartItem.qty += action.payload.qty) // 같은 상품을 카트 담기 하는 경우
        : (state.cartItems = [...state.cartItems, action.payload]); // 새로운 상품 카트 담기
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const { _id, size } = action.payload;
      console.log(_id, size);
      state.cartItems = state.cartItems.filter((item) => {
        if (item._id === _id) return item.size !== size;
        else return item._id !== _id;
      });
    },
    increaseQty: (state, action) => {
      const { _id, size } = action.payload;
      const cartItem = state.cartItems.find(
        (item) => item._id === _id && item.size === size
      );
      cartItem.qty += 1;
    },
    decreaseQty: (state, action) => {
      const { _id, size } = action.payload;
      const cartItem = state.cartItems.find(
        (item) => item._id === _id && item.size === size
      );
      cartItem.qty -= 1;
    },
  },

  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.cartItems = action.payload.cartItems;
    },
    [getCartItems.rejected]: (state, action) => {
      state.isLoading = false;
    },

    [addCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [addCartItems.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [addCartItems.rejected]: (state) => {
      state.isLoading = false;
    },

    [updateCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [updateCartItems.fulfilled]: (state) => {
      state.isLoading = false;
    },
    [updateCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { addItem, clearCart, removeItem, increaseQty, decreaseQty } =
  cartSlice.actions;

// Selector
export const selectTotalQty = (store) =>
  store.cart.cartItems.reduce((totalQty, item) => totalQty + item.qty, 0);

export const selectTotalPrice = (state) =>
  state.cart.cartItems.reduce(
    (totalPrice, item) => totalPrice + item.price * item.qty,
    0
  );

export default cartSlice.reducer;
