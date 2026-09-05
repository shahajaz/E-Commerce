// import { useState, useEffect } from "react";
// import { X, Mail, Lock, User } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const LoginModal = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const {authUser, isSigningUp, isLoggingIn, isUpdatingPassword, isRequestingForToken} = useSelector((state) => state.auth);

//   const { isAuthPopupOpen } = useSelector((state) => state.popup);

//   const [mode, setMode] = useState("signin");
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   //Detect reset password url and open popup with reset mode
//   useEffect(() => {
//     if(location.pathname.startsWith("/password/reset/")){
//       setMode("reset");
//       dispatch(toggleAuthPopup());
//     }
//   }, [location.pathname, dispatch]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     data.append("email", formData.email);
//     data.append("password", formData.password);

//     if(mode === "signup") data.append("name", formData.name);

//     if(mode === "forgot"){
//       dispatch(forgotPassword({ email: formData.email })).then(()=>{
//         dispatch(toggleAuthPopup());
//         setMode("signin");
//       })
//       return;
//     }

//     if(mode === "reset"){
//       const token = location.pathname.split("/").pop();
//       dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }));
//       return;
//     }
//     if(mode === "signup"){
//       dispatch(register(data));
//     }else{
//       dispatch(login(data));
//     }

//     if(authUser){
//       setFormData({name: "", email: "", password: "", confirmPassword: ""});
//     }
//   };

//   if(!isAuthPopupOpen || authUser) return null;

//   let isLoading = isSigningUp || isLoggingIn || isRequestingForToken;

//   return <>
//   <div className="fixed inset-0 z-50 flex items-center justify-center">

//     {/* Overlay */}
//     <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]"/>
//     <div className="relative z-10 glass-panel max-w-md mx-4 animate-fade-in-up">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-center text-primary">
//           {
//             mode === "reset" 
//             ? "Reset Password" 
//             : mode === "signup" 
//             ? "Create Account" 
//             : mode === "forgot" 
//             ? "Forgot Password" 
//             : "Welcome Back"
//           }
//         </h2>

//         <button
//           className="p-2 text-gray-500 rounded-full hover:bg-gray-200 animate-smooth"
//           onClick={() => dispatch(toggleAuthPopup())}
//         >
//           <X className="w-5 h-5 text-primary"/>
//         </button>
//       </div>

//       {/*Authentication Form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Full Name - Only for signup */}
//         {mode === "signup" && (
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input
//                 type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
//                 className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
//             />
//           </div>
//         )}

//         {/* Email */}
//         {mode !== "reset" && (
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input
//                 type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
//                 className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
//             />
//           </div>
//         )}

//         {/* Password - Always visible except forgot mode */}
//         {mode === "forgot" && (
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input
//                 type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
//                 className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
//             />
//           </div>
//         )}

//         {/* Confirm Password - Only visible for reset mode */}
//         {mode === "reset" && (
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input
//                 type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
//                 className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
//             />
//           </div>
//         )}

//         {/* Forgot Password Toggle Button */}
//         {
//           mode === "signin" && (
//             <div className="text-right text-sm">
//               <button
//                 type="button"
//                 onClick={() => setMode("forgot")}
//                 className="text-primary hover:text-accent animate-smooth"
//               >
//                 Forgot Password?
//               </button>
//             </div>
//         )}

//         {/* Submit Button */}
//         <button type="submit" disabled={isLoading}
//           className={`w-full py-3 gradient-primary flex justify-center items-center gap-2 text-primary-foreground rounded-lg font-semibold animate-smooth ${
//             isLoading ? "opacity-70 cursor-not-allowed" : "hover:glow-on-hover"
//           }`}
//           >
//             {isLoading ? (
//             <>
//               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               <span>
//                 {mode === "reset"
//                 ? "Resetting Password..."
//                 : mode === "signup"
//                 ? "Signing up..."
//                 : mode === "forgot"
//                 ? "Requesting for email..."
//                 : "Signing in..."}
//               </span>
//             </>
//             ) : mode === "reset" ? (
//               "Reset Password"
//             ) : mode === "signup" ? (
//               ("Create Account")
//             ) : mode === "forgot" ? (
//               ("Send Reset Email")
//             ) : ( "Sign In"
//             )}
//         </button>
//       </form>

//       {/* Mode Toggle Switcher */}
//       {["signin", "signup"].includes(mode) && (
//         <div className="mt-6 text-center">
//           <button type="button" onClick={() => {setMode(prev => prev === "signup" ? "signin" : "signup");
//           }}
//           className="text-primary hover:text-account animate-smooth"
//           >
//             {
//               mode === "signup" ? "Already have an account? Sign in." : "Don't have an account? Sign up."
//             }
//           </button>
//         </div>
//       )}
//     </div>
//   </div>
//   </>;
// };

// export default LoginModal;


import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    authUser,
    isSigningUp,
    isLoggingIn,
    isUpdatingPassword,
    isRequestingForToken,
  } = useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector(
    (state) => state.popup
  );

  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState(initialFormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* ==== LOADING === */
  const isLoading =
    isSigningUp ||
    isLoggingIn ||
    isUpdatingPassword ||
    isRequestingForToken;

  /* === RESET PASSWORD URL === */
  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode("reset");
    }
  }, [location.pathname]);

  /* ==== RESET FORM WHEN MODE CHANGES ==== */
  const changeMode = (newMode) => {
    setMode(newMode);
    setFormData(initialFormData);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  /* ==== INPUT HANDLER ==== */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==== SUBMIT ==== */
  const handleSubmit = async (event) => {
    event.preventDefault();

    /* ---------------- SIGN IN ---------------- */
    if (mode === "signin") {
      await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      );
      return;
    }

    /* ---------------- SIGN UP ---------------- */
    if (mode === "signup") {
      await dispatch(
        register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      return;
    }

    /* ---------------- FORGOT PASSWORD ---------------- */
    if (mode === "forgot") {
      const result = await dispatch(
        forgotPassword(formData.email)
      );

      if (forgotPassword.fulfilled.match(result)) {
        changeMode("signin");
      }
      return;
    }

    /* ---------------- RESET PASSWORD ---------------- */
    if (mode === "reset") {
      const token = location.pathname.split("/").pop();

      if (!token) return;

      const result = await dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );

      if (resetPassword.fulfilled.match(result)) {
        changeMode("signin");
      }
    }
  };

  /* ==== CLOSE ==== */
  const handleClose = () => {
    dispatch(toggleAuthPopup());
  };

  /* ==== DON'T SHOW WHEN AUTHENTICATED ==== */
  if (!isAuthPopupOpen || authUser) {
    return null;
  }

  /* ==== TITLE ==== */
  const title =
    mode === "signup"
      ? "Create Account"
      : mode === "forgot"
      ? "Forgot Password"
      : mode === "reset"
      ? "Reset Password"
      : "Welcome Back";

  /* ==== SUBTITLE ==== */

  const subtitle =
    mode === "signup"
      ? "Create your account to get started."
      : mode === "forgot"
      ? "Enter your email and we'll send you a reset link."
      : mode === "reset"
      ? "Create a new password for your account."
      : "Sign in to continue to your account.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl animate-fade-in-up"
      >
        {/* ==== HEADER ==== */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="auth-modal-title"
              className="text-2xl font-bold text-primary"
            >
              {title}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close authentication modal"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X size={19} />
          </button>
        </div>

        {/* ==== FORM ==== */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* ---------------- NAME ---------------- */}
          {mode === "signup" && (
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={isLoading}
                required
                className="h-11 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </div>
          )}

          {/* ---------------- EMAIL ---------------- */}
          {mode !== "reset" && (
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={isLoading}
                required
                className="h-11 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </div>
          )}

          {/* ---------------- PASSWORD ---------------- */}
          {(mode === "signin" ||
            mode === "signup" ||
            mode === "reset") && (
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={
                  mode === "reset"
                    ? "New Password"
                    : "Password"
                }
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  mode === "signin"
                    ? "current-password"
                    : "new-password"
                }
                disabled={isLoading}
                required
                className="h-11 w-full rounded-lg border border-border bg-secondary pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                disabled={isLoading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          )}

          {/* ---------------- CONFIRM PASSWORD ---------------- */}
          {(mode === "signup" || mode === "reset") && (
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={isLoading}
                required
                className="h-11 w-full rounded-lg border border-border bg-secondary pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                disabled={isLoading}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          )}

          {/* ---------------- FORGOT PASSWORD ---------------- */}
          {mode === "signin" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => changeMode("forgot")}
                disabled={isLoading}
                className="text-sm text-primary transition hover:text-accent disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* ---------------- PASSWORD MATCH ---------------- */}
          {(mode === "signup" || mode === "reset") &&
            formData.confirmPassword && (
              <p
                className={`text-xs ${
                  formData.password ===
                  formData.confirmPassword
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                {formData.password ===
                formData.confirmPassword
                  ? "✓ Passwords match"
                  : "Passwords do not match"}
              </p>
            )}

          {/* ==== SUBMIT ==== */}
          <button
            type="submit"
            disabled={isLoading}
            className={`flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition ${
              isLoading
                ? "cursor-not-allowed opacity-60"
                : "hover:opacity-90 hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                <span>
                  {mode === "signup"
                    ? "Creating Account..."
                    : mode === "forgot"
                    ? "Sending Email..."
                    : mode === "reset"
                    ? "Resetting Password..."
                    : "Signing In..."}
                </span>
              </>
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "forgot" ? (
              "Send Reset Email"
            ) : mode === "reset" ? (
              "Reset Password"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* === MODE SWITCH === */}
        {mode === "signin" || mode === "signup" ? (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() =>
                changeMode(
                  mode === "signin"
                    ? "signup"
                    : "signin"
                )
              }
              disabled={isLoading}
              className="text-sm text-primary transition hover:text-accent disabled:opacity-50"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up."
                : "Already have an account? Sign in."}
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => changeMode("signin")}
              disabled={isLoading}
              className="text-sm text-primary transition hover:text-accent disabled:opacity-50"
            >
              Already have an account? Sign in.
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;


