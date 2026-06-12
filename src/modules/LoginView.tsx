import React, { useState } from "react";
import { Mail, Lock, FolderGit2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { loginUser, resolveLoginError } from "../services/auth/authService";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { User } from "../types";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

export default function LoginView({
  onLoginSuccess,
  onNavigateToRegister,
}: LoginViewProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("rahul@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      dispatch(loginFailure("Please enter a valid email address."));
      return;
    }
    if (!password.trim()) {
      dispatch(loginFailure("Please enter your password."));
      return;
    }

    try {
      dispatch(loginStart());
      const authResponse = await loginUser({ email: email.trim(), password });
      dispatch(loginSuccess(authResponse));
      onLoginSuccess(authResponse.user);
    } catch (err: any) {
      dispatch(loginFailure(resolveLoginError(err)));
    }
  };

  return (
    <div className="min-h-screen bg-bg-slate-50 flex items-center justify-center p-lg font-sans">
      {/* Fixed width card — never grows with error text */}
      <div className="w-[360px] bg-white border border-border-subtle rounded-2xl p-lg shadow-xl flex flex-col gap-lg animate-scale-up select-none">

        {/* Company Branding logo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center text-white mb-md shadow-md shadow-primary/20">
            <FolderGit2 className="w-7 h-7" />
          </div>
          <h2 className="font-headline font-black text-2xl text-on-surface leading-tight tracking-tight">
            CollabFlow
          </h2>
          <p className="text-secondary text-xs font-sans mt-[2px]">
            Sign in to your enterprise workstation
          </p>
        </div>

        {/* Error banner — always occupies space to prevent layout shift.
            min-h keeps the slot reserved; content fades in when error exists. */}
        <div className="min-h-[36px]">
          {error && (
            <div className="flex gap-sm p-sm bg-[#ffdad6] border border-[#ffb4ab] rounded-xl text-xs text-[#ba1a1a] w-full">
              <AlertCircle className="w-4 h-4 shrink-0 mt-[1px]" />
              {/* line-clamp keeps very long server messages from blowing the height */}
              <span className="leading-relaxed line-clamp-2">{error}</span>
            </div>
          )}
        </div>

        {/* SSO Providers */}
        <div className="grid grid-cols-2 gap-sm">
          <button
            type="button"
            disabled={isLoading}
            className="flex items-center justify-center gap-xs border border-[#c7c4d8] hover:border-primary px-3 py-2 rounded-xl text-xs transition-all active:scale-95 bg-white font-semibold cursor-pointer text-on-surface-variant leading-none disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#3b82f6" d="M12 1h10v10H12z" />
              <path fill="#8cbd18" d="M1 12h10v10H1z" />
              <path fill="#ffb900" d="M12 12h10v10H12z" />
            </svg>
            <span>Microsoft</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            className="flex items-center justify-center gap-xs border border-[#c7c4d8] hover:border-primary px-3 py-2 rounded-xl text-xs transition-all active:scale-95 bg-white font-semibold cursor-pointer text-on-surface-variant leading-none disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.41-1.22-.41-2.43 0-3.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Separator */}
        <div className="flex items-center gap-md select-none">
          <div className="h-px bg-border-subtle flex-1" />
          <span className="text-[10px] uppercase font-bold text-outline tracking-wider leading-none whitespace-nowrap">
            Or continue with email
          </span>
          <div className="h-px bg-border-subtle flex-1" />
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-md select-text">

          {/* Email field */}
          <div className="space-y-sm">
            <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#c7c4d8] rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-outline disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-sm">
            <div className="flex justify-between items-center select-none">
              <label className="text-[10px] font-bold text-[#5e617d] uppercase tracking-wider block">
                Password
              </label>
              <a href="#" className="text-[10px] font-bold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full pl-9 pr-9 py-2 bg-[#f8fafc] border border-[#c7c4d8] rounded-xl text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-outline disabled:opacity-60"
              />
              {/* Show / hide password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-sm select-none">
            <input
              id="remember"
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-[#c7c4d8] text-primary focus:ring-primary focus:ring-opacity-20 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-[#5e617d] cursor-pointer">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-xs bg-primary hover:bg-[#6161ff] text-white font-headline text-xs font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              "Sign In to Workstation"
            )}
          </button>
        </form>

        <div className="h-px bg-border-subtle select-none" />

        {/* Footer */}
        <div className="flex flex-col items-center select-none gap-sm">
          <p className="text-xs text-[#5e617d] text-center">
            Don't have an account?{" "}
            <button
              onClick={onNavigateToRegister}
              disabled={isLoading}
              className="font-bold text-primary hover:underline cursor-pointer disabled:opacity-50"
            >
              Sign up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
