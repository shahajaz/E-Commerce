import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import {toggleAuthPopup} from "./popupSlice";

export const register = createAsyncThunk("auth/register", async(data, thunkAPI) => {
  try{
    const res = await axiosInstance.post("/auth/register", data);
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  }
  catch (error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const login = createAsyncThunk("auth/login", async(data, thunkAPI) => {
  try{
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  }
  catch (error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getUser = createAsyncThunk("auth/me", async(_, thunkAPI) => {
  try{
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;
  }
  catch (error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

export const logout = createAsyncThunk("auth/logout", async(data, thunkAPI) => {
  try{
    const res = await axiosInstance.get("/auth/logout");
    thunkAPI.dispatch(toggleAuthPopup());
    return null;
  }
  catch (error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
  }
});

export const forgotPassword = createAsyncThunk("auth/forgot/password", async(email, thunkAPI) => {
  try{
    const res = await axiosInstance.post("/auth/forgot/password/forgot?frontendUrl=http://localhost:5173", { email });
    toast.success(res.data.message);
    return null;
  }
  catch (error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {},
});

export default authSlice.reducer;
