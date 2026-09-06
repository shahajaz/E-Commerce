import { useEffect, useState } from "react";
import {Eye, EyeOff, Lock, Mail, User, X, } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { forgotPassword, login, register, resetPassword, } from "../../store/slices/authSlice";
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
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
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
                className="h-11 w-full rounded-full border border-border bg-primary pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
                className="h-11 w-full rounded-full border border-border bg-primary pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
                className="h-11 w-full rounded-full border border-border bg-primary pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
                className="h-11 w-full rounded-full border border-border bg-primary pl-10 pr-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
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
                className="text-sm text-[hsl(var(--primary))] transition hover:text-accent disabled:opacity-50"
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
            className={`flex h-11 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,hsl(24_94%_53%),hsl(20_91%_48%),hsl(0_84%_60%))] px-4 text-sm font-semibold text-white cursor-pointer ${
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


