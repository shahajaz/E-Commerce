// import { useEffect, useState } from "react";
// import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { toggleSidebar } from "../../store/slices/popupSlice";

// const ProfilePanel = () => {
//   const dispatch = useDispatch();

//   const { isAuthPopupOpen } = useSelector((state) => state.popup);
//   const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);

//   const [name, setName] = useState(authUser?.name || "");
//   const [email, setEmail] = useState(authUser?.email || "");
//   const [avatar, setAvatar] = useState(null);

//   useEffect(() => {
//     if(authUser){
//       setName(authUser?.name || "");
//       setEmail(authUser?.email || "");
//     }
//   }, [authUser]);

//   const [showPassword, setShowPassword] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");

//   const handleLogout = () => {
//     dispatch(logout());
//   }

//   const handleProfileUpdate = () => {
//     const formData = new FormData();
//     formData.append("name", name)
//     formData.append("email", email)
//     if(avatar){
//       formData.append("avatar", avatar)
//     }
//     dispatch(updateProfile(formData));
//   };

//   const handlePasswordUpdate = () => {
//     const formData = new FormData();
//     formData.append("currentPassword", currentPassword)
//     formData.append("newPassword", newPassword)
//     formData.append("confirmNewPassword", confirmNewPassword)
    
//     dispatch(updatePassword());
//   };

//   if (!isAuthPopupOpen || !authUser) {
//     return null;
//   }

//   return <>
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//     onClick={() => dispatch(toggleSidebar())}>
    
//     {/* Profile Content */} 
//     <div className="flex justify-between items-center p-4 border-b">
//       <h2 className="text-xl font-semibold">Profile</h2>
      
//       <button onClick={() => dispatch(toggleAuthPopup())} aria-label="Close cart" 
//         className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 cursor-pointer transition-all duration-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"> 
//         <X className="w-5 h-5"/>
//       </button>
//     </div>

//     <div className="p-6">
//       {/* Profile Form */}
//       <div className="text-center mb-6">
//         <img src={authUser?.avatar?.url || "/avatar-holder.avif"} alt={authUser?.name} 
//         className="w-20 h-20 rounded-full mx-auto md-4 border-2 border-primary object-cover"/>
//         <h3 className="text-lg font-medium mt-4 text-foreground">{authUser?.name}</h3>
//         <p className="text-sm text-muted-foreground">{authUser?.email}</p>
//       </div>

//       {/* Profile Update Form */}
//       {authUser && (
//         <div className="space-y-4 mb-8">
//             <h3 className="text-lg font-semibold text-primary">Update Profile</h3>

//             <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
//               className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
//             />
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
//             />
//             <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
//               <Upload className="w-4 h-4 text-primary"/>
//               <span>Upload Avatar</span>
//               <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} className="hidden"/>
//             </label>

//             <button onClick={handleProfileUpdate} className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full">
//               {isUpdatingProfile ? (
//                 <>
//                   <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
//                   <span>Updating Profile...</span>
//                 </>
//                 ) : ("Save Changes")
//               }
//             </button>
//         </div>  
//       )}
//     </div>

//     {/* Password Update Form */}
//     <div className="space-y-4 mb-8">
//       <h3 className="text-lg font-semibold text-primary">Update Password</h3>
      
//       <input type={showPassword ? "text" : "password"} placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
//         className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
//       />
//         <input type={showPassword ? "text" : "password"} placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
//         />

//         <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
//           className="w-full p-2 rounded  border border-border bg-secondary text-foreground"
//         />

//         <button onClick={()=> setShowPassword(!showPassword)}
//           className="text-xs text-muted-foreground flex items-center gap-1">
//             {
//               showPassword ? (
//                 <EyeOff className="w-4 h-4 text-primary"/>
//               ) : 
              
//               (<Eye className="w-4 h-4 text-primary"/>)
//             }

//             {showPassword ? "Hide Password" : "Show Password"}
//             Passwords
//         </button>

//         <button onClick={handleProfileUpdate} className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full">
//           {isUpdatingPassword ? (
//             <>
//               <div className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
//               <span>Updating Password...</span>
//             </>
//             ) : ("Update Password")
//           }
//         </button>
//     </div>  

//     <button onClick={handleLogout} 
//       className="my-6 flex item-center space-x-3 p-3 rounded-lg glass-card
//       hover:glow-on-hover text-destructive hover:text-destructive-foreground group w-full">
//         <LogOut className="w-5 h-5"/>
//         <span>Logout</span>
//     </button>

//   </div>
//   </>;
// };

// export default ProfilePanel;



import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Save,
  User,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggle,
  autoComplete,
  disabled,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-11 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={
            showPassword
              ? `Hide ${label}`
              : `Show ${label}`
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
    </div>
  );
};

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { isAuthPopupOpen } = useSelector(
    (state) => state.popup
  );

  const {
    authUser,
    isUpdatingProfile,
    isUpdatingPassword,
  } = useSelector((state) => state.auth);

  /* -------------------------------------------------------
     PROFILE
  ------------------------------------------------------- */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /* -------------------------------------------------------
     SYNC USER DATA
  ------------------------------------------------------- */

  useEffect(() => {
    if (!authUser) return;

    setName(authUser.name || "");
    setEmail(authUser.email || "");
    setAvatar(null);
    setAvatarPreview(authUser.avatar?.url || "");
  }, [authUser]);

  /* -------------------------------------------------------
     ESCAPE TO CLOSE
  ------------------------------------------------------- */

  useEffect(() => {
    if (!isAuthPopupOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        dispatch(toggleAuthPopup());
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isAuthPopupOpen, dispatch]);

  /* -------------------------------------------------------
     AVATAR
  ------------------------------------------------------- */

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setAvatar(file);

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  /* -------------------------------------------------------
     PROFILE UPDATE
  ------------------------------------------------------- */

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const formData = new FormData();

    formData.append("name", trimmedName);
    formData.append("email", trimmedEmail);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    await dispatch(updateProfile(formData));
  };

  /* -------------------------------------------------------
     PASSWORD UPDATE
  ------------------------------------------------------- */

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password."
      );
      return;
    }

    const result = await dispatch(
      updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
    );

    if (updatePassword.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */

  const handleLogout = () => {
    dispatch(logout());
  };

  /* -------------------------------------------------------
     CLOSE
  ------------------------------------------------------- */

  const handleClose = () => {
    dispatch(toggleAuthPopup());
  };

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  if (!isAuthPopupOpen || !authUser) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="profile-title"
              className="text-lg font-semibold text-foreground"
            >
              My Profile
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Manage your account
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close profile"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X size={19} />
          </button>
        </div>

        {/* ==================================================
            SCROLLABLE CONTENT
        ================================================== */}

        <div className="overflow-y-auto">

          {/* ==================================================
              PROFILE
          ================================================== */}

          <section className="p-5">
            {/* Avatar */}

            <div className="mb-6 flex flex-col items-center">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-secondary ring-2 ring-primary/20">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={`${authUser.name || "User"} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User
                      size={38}
                      className="text-muted-foreground"
                    />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={isUpdatingProfile}
                  aria-label="Change profile picture"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Camera size={15} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h3 className="mt-3 text-base font-semibold text-foreground">
                {authUser.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {authUser.email}
              </p>
            </div>

            {/* Section Heading */}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Profile Information
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Update your personal information.
              </p>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-4"
            >
              {/* Name */}

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    autoComplete="name"
                    placeholder="Enter your full name"
                    disabled={isUpdatingProfile}
                    className="h-11 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />

                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    placeholder="Enter your email"
                    disabled={isUpdatingProfile}
                    className="h-11 w-full rounded-lg border border-border bg-secondary/50 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Save */}

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingProfile ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </section>

          {/* ==================================================
              SECURITY
          ================================================== */}

          <section className="border-t border-border p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Security
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Change your account password.
              </p>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4"
            >
              <PasswordField
                id="current-password"
                label="Current Password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                showPassword={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(
                    (value) => !value
                  )
                }
                autoComplete="current-password"
                disabled={isUpdatingPassword}
              />

              <PasswordField
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                showPassword={showNewPassword}
                onToggle={() =>
                  setShowNewPassword(
                    (value) => !value
                  )
                }
                autoComplete="new-password"
                disabled={isUpdatingPassword}
              />

              <PasswordField
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                showPassword={showConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                autoComplete="new-password"
                disabled={isUpdatingPassword}
              />

              {confirmPassword && (
                <p
                  className={`text-xs ${
                    newPassword === confirmPassword
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {newPassword === confirmPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match"}
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </section>

          {/* ==================================================
              LOGOUT
          ================================================== */}

          <section className="border-t border-border p-5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={
                isUpdatingProfile ||
                isUpdatingPassword
              }
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 text-sm font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;



