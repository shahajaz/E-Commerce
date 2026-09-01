import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {authUser, isSigningUp, isLoggingIn, isUpdatingPassword, isRequestingForToken} = useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //Detect reset password url and open popup with reset mode
  useEffect(() => {
    if(location.pathname.startsWith("/password/reset/")){
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("email", formData.email);
    data.append("password", formData.password);

    if(mode === "signup") data.append("name", formData.name);

    if(mode === "forgot"){
      dispatch(forgotPassword({ email: formData.email })).then(()=>{
        dispatch(toggleAuthPopup());
        setMode("signin");
      })
      return;
    }

    if(mode === "reset"){
      const token = location.pathname.split("/").pop();
      dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword }));
      return;
    }
    if(mode === "signup"){
      dispatch(register(data));
    }else{
      dispatch(login(data));
    }

    if(authUser){
      setFormData({name: "", email: "", password: "", confirmPassword: ""});
    }
  };

  if(!isAuthPopupOpen || authUser) return null;

  let idLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  return <>
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* Overlay */}
    <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]"/>
    <div className="relative z-10 glass-panel max-w-md mx-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-center text-primary">
          {
            mode === "reset" 
            ? "Reset Password" 
            : mode === "signup" 
            ? "Create Account" 
            : mode === "forgot" 
            ? "Forgot Password" 
            : "Welcome Back"
          }
        </h2>

        <button
          className="p-2 text-gray-500 rounded-full hover:bg-gray-200 animate-smooth"
          onClick={() => dispatch(toggleAuthPopup())}
        >
          <X className="w-5 h-5 text-primary"/>
        </button>
      </div>

      {/*Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name - Only for signup */}
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
            />
          </div>
        )}

        {/* Email */}
        {mode !== "reset" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
            />
          </div>
        )}

        {/* Password - Always visible except forgot mode */}
        {mode === "forgot" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
            />
          </div>
        )}

        {/* Confirm Password - Only visible for reset mode */}
        {mode === "reset" && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
              <input
                type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full focus:outline-none"required
            />
          </div>
        )}

        {/* Forgot Password Toggle Button */}
        {
          mode === "signin" && (
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-primary hover:text-accent animate-smooth"
              >
                Forgot Password?
              </button>
            </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={isLoading}
          className={`w-full py-3 gradient-primary flex justify-center items-center gap-2 text-primary-foreground rounded-lg font-semibold animate-smooth ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:glow-on-hover"
          }`}
          >
            {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {mode === "reset"
                ? "Resetting Password..."
                : mode === "signup"
                ? "Signing up..."
                : mode === "forgot"
                ? "Requesting for email..."
                : "Signing in..."}
              </span>
            </>
            ) : mode === "reset" ? (
              "Reset Password"
            ) : mode === "signup" ? (
              "Create Account"
            ) : mode === "forgot" ? (
              "Request Reset Email"
            ) : (
              "Sign In"
              )}
        </button>

      </form>
    </div>
  </div>
  </>;
};

export default LoginModal;
