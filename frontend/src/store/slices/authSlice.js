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

export const resetPassword = createAsyncThunk("auth/password/reset", async({ token, password, confirmPassword }, thunkAPI) => {
  try{
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, { password, confirmPassword });
    toast.success(res.data.message);
    return res.data.user;
  }
  catch (error){
    toast.error(error.response.data.message || "Something went wrong");
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const updatePassword = createAsyncThunk("auth/password/update", async({ token, password, confirmPassword }, thunkAPI) => {
  try{
    const res = await axiosInstance.put(`/auth/password/update/`, data);
    toast.success(res.data.message);
    return res.data.user;
  }
  catch (error){
    const message = error.response.data.message;
    toast.error(message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


export const updateProfile = createAsyncThunk("auth/me/update", async({ token, password, confirmPassword }, thunkAPI) => {
  try{
    const res = await axiosInstance.put(`/auth/profile/update/`, data);
    toast.success(res.data.message);
    return res.data.user;
  }
  catch (error){
    const message = error.response.data.message;
    toast.error(message);
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
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {})
    .addCase(register.fulfilled, (state) => {})
    .addCase(register.rejected, (state) => {})
  },
});

export default authSlice.reducer;
