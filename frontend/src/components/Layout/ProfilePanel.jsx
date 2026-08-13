import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toggleSidebar } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);

  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if(authUser){
      setName(authUser?.name || "");
      setEmail(authUser?.email || "");
    }
  }, [authUser]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleLogout = () => {
    dispatch(logout());
  }

  const handleProfileUpdate = () => {
    const formData = new FormData();
    formData.append("name", name)
    formData.append("email", email)
    if(avatar){
      formData.append("avatar", avatar)
    }
    dispatch(updateProfile(formData));
  };

  const handlePasswordUpdate = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword)
    formData.append("newPassword", newPassword)
    formData.append("confirmNewPassword", confirmNewPassword)
    
    dispatch(updatePassword());
  };

  if (!isAuthPopupOpen || !authUser) {
    return null;
  }

  return <>
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={() => dispatch(toggleSidebar())}>
    
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-semibold">Profile</h2>
      
      <button onClick={() => dispatch(toggleAuthPopup())} aria-label="Close cart" 
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 cursor-pointer transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"> 
        <X className="w-5 h-5"/>
      </button>
    </div>

    

  </div>
  </>;
};

export default ProfilePanel;
