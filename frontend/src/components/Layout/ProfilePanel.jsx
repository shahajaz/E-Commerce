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

  const [showPassword, setShowPassword] = useState(false);
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
    
    {/* Profile Content */} 
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-xl font-semibold">Profile</h2>
      
      <button onClick={() => dispatch(toggleAuthPopup())} aria-label="Close cart" 
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 cursor-pointer transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"> 
        <X className="w-5 h-5"/>
      </button>
    </div>

    <div className="p-6">
      {/* Profile Form */}
      <div className="text-center mb-6">
        <img src={authUser?.avatar?.url || "/avatar-holder.avif"} alt={authUser?.name} 
        className="w-20 h-20 rounded-full mx-auto md-4 border-2 border-primary object-cover"/>
        <h3 className="text-lg font-medium mt-4 text-foreground">{authUser?.name}</h3>
        <p className="text-sm text-muted-foreground">{authUser?.email}</p>
      </div>

      {/* Profile Update Form */}
      {authUser && (
        <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">Update Profile</h3>

            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
            />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
            />
            <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
              <Upload className="w-4 h-4 text-primary"/>
              <span>Upload Avatar</span>
              <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} className="hidden"/>
            </label>

            <button onClick={handleProfileUpdate} className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full">
              {isUpdatingProfile ? (
                <>
                  <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
                  <span>Updating Profile...</span>
                </>
                ) : ("Save Changes")
              }
            </button>
        </div>  
      )}
    </div>

    {/* Password Update Form */}
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-primary">Update Password</h3>
      
      <input type={showPassword ? "text" : "password"} placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
      />
        <input type={showPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
        />

        <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
        />

        <button onClick={()=> setShowPassword(!showPassword)}
          className="text-xs text-muted-foreground flex items-center gap-1">
            {
              showPassword ? (
                <EyeOff className="w-4 h-4 text-primary"/>
              ) : 
              
              (<Eye className="w-4 h-4 text-primary"/>)
            }

            {showPassword ? "Hide Password" : "Show Password"}
            Passwords
        </button>

        <button onClick={handleProfileUpdate} className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full">
          {isUpdatingPassword ? (
            <>
              <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
              <span>Updating Password...</span>
            </>
            ) : ("Update Password")
          }
        </button>
    </div>  

    <button onClick={handleLogout} 
      className="my-6 flex item-center space-x-3 p-3 rounded-lg glass-card
      hover:glow-on-hover text-destructive hover:text-destructive-foreground group w-full">
        <LogOut className="w-5 h-5"/>
        <span>Logout</span>
    </button>

  </div>
  </>;
};

export default ProfilePanel;
