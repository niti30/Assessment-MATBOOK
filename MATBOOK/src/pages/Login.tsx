import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import Logo from "../components/Logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  GoogleIcon,
  FacebookIcon,
  AppleIcon,
} from "@/components/icons/SocialIcons";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/workflows");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Validation error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      } else {
        await signIn(email, password, rememberMe);
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description:
          error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await socialLogin(provider);
    } catch (error) {
      // Error handling is already done in AuthContext
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="relative min-h-screen bg-[url('/leaf-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-12 left-12">
        <Logo className="w-[274px] text-white" />
      </div>
      <div
        className="absolute bottom-12 left-12 text-white max-w-[380px]"
        style={{ marginBottom: 270 }}
      >
        <h2 className="text-[39px] font-bold mb-6">Building the Future...</h2>
        <p className="text-base opacity-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div
          className="w-full max-w-[420px] bg-white rounded-[40px] p-8 shadow-lg mx-4"
          style={{ marginLeft: "47rem" }}
        >
          <div className="mb-8">
            <p className="text-sm font-semibold text-black mb-2">
              WELCOME BACK!
            </p>
            <h1 className="text-[28px] font-bold">
              {isSignUp ? "Sign Up for an Account" : "Log In to your Account"}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[15px] text-[#616161] mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="Type here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#E0E0E0] rounded-xl py-3 px-4 text-base"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm text-[#4F4F4F] mb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="Type here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#E0E0E0] rounded-xl py-3 px-4"
                disabled={isLoading}
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 border rounded cursor-pointer flex items-center justify-center transition-colors ${
                      rememberMe
                        ? "bg-[#EE3425] border-[#EE3425]"
                        : "border-gray-300"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-black">Remember me</span>
                </div>
                <button type="button" className="text-[#424242] font-medium">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#EE3425] text-white rounded-xl py-3.5 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-white border-white/20 rounded-full animate-spin mx-auto"></div>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Log In"
              )}
            </button>

            <div className="relative text-center my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EEEEEE]"></div>
              </div>
              <span className="relative bg-white px-4 text-sm font-medium text-[#212121]">
                Or
              </span>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-3 border border-[#EEEEEE] rounded-xl py-3 text-[15px] text-[#616161] font-medium hover:bg-gray-50"
              >
                <GoogleIcon className="w-5 h-5" />
                {isSignUp ? "Sign Up with Google" : "Log In with Google"}
              </button>

              <button
                onClick={() => handleSocialLogin("facebook")}
                className="w-full flex items-center justify-center gap-3 border border-[#EEEEEE] rounded-xl py-3 text-[15px] text-[#616161] font-medium hover:bg-gray-50"
              >
                <FacebookIcon className="w-5 h-5" />
                {isSignUp ? "Sign Up with Facebook" : "Log In with Facebook"}
              </button>

              <button
                onClick={() => handleSocialLogin("apple")}
                className="w-full flex items-center justify-center gap-3 border border-[#EEEEEE] rounded-xl py-3 text-[15px] text-[#616161] font-medium hover:bg-gray-50"
              >
                <AppleIcon className="w-5 h-5" />
                {isSignUp ? "Sign Up with Apple" : "Log In with Apple"}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-700">
              {isSignUp ? "Already have an account?" : "New User?"}
              <button
                onClick={toggleAuthMode}
                className="font-bold hover:underline ml-1"
              >
                {isSignUp ? "LOG IN HERE" : "SIGN UP HERE"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
