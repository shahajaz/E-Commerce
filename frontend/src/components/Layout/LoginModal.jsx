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

  if(!AuthPopupOpen || authUser) return null;

  let idLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  return <>
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]"/>

  </div>
  </>;
};

export default LoginModal;
