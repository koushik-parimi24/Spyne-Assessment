import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
  isLoading :false,
  productList: [],
  
}
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
      const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/shop/products/get`
      );

      return result?.data;
  }
);


const shoppingProductSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers:{},
  extraReducers: (builder) =>{
    builder
    .addCase(fetchAllFilteredProducts.pending, (state, action) => {
      state.isLoading = true;
    })
    .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.productList = action.payload.data;
    })
    .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.productList = [];
      console.log("failed to fetch products", action.error.message)
    })
  }
})
export default shoppingProductSlice.reducer
