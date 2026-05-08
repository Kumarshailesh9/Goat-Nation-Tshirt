"use client";

import {
  useState,
  FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import {
  loginUser,
  registerUser,
  setupRecaptcha,
} from "@/lib/auth";

export default function LoginPage() {

  const [isLogin, setIsLogin] =
    useState(true);

  const [isOtpLogin, setIsOtpLogin] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [confirmationResult,
    setConfirmationResult] =
    useState<any>(null);

  const router = useRouter();

  // ================= EMAIL LOGIN =================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      if (isLogin) {

        const res =
          await loginUser(
            email,
            password
          );

        toast.success("Login successful");

        if (res.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }

      } else {

        await registerUser(
          name,
          email,
          password,
          phone
        );

        toast.success(
          "Account created successfully"
        );

        setIsLogin(true);

      }

    } catch (error: any) {

      toast.error(error.message);

    } finally {

      setLoading(false);

    }
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {

    try {

      setLoading(true);

      const confirmation =
        await setupRecaptcha(
          `+91${phone}`
        );

      setConfirmationResult(
        confirmation
      );

      toast.success(
        "OTP sent successfully"
      );

    } catch (error: any) {

      toast.error(error.message);

    } finally {

      setLoading(false);

    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {

    try {

      setLoading(true);

      await confirmationResult.confirm(
        otp
      );

      toast.success(
        "Login successful"
      );

      router.push("/");

    } catch (error: any) {

      toast.error("Invalid OTP");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* TOGGLE */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">

          <button
            onClick={() =>
              setIsOtpLogin(false)
            }
            className={`flex-1 py-2 rounded-lg transition ${
              !isOtpLogin
                ? "bg-black text-white"
                : ""
            }`}
          >
            Email
          </button>

          <button
            onClick={() =>
              setIsOtpLogin(true)
            }
            className={`flex-1 py-2 rounded-lg transition ${
              isOtpLogin
                ? "bg-black text-white"
                : ""
            }`}
          >
            OTP
          </button>

        </div>

        {/* ================= EMAIL LOGIN ================= */}
        {!isOtpLogin ? (

          <form
            onSubmit={handleSubmit}
          >

            <h2 className="text-2xl font-bold text-center mb-6">

              {isLogin
                ? "Login"
                : "Register"}

            </h2>

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border p-3 mb-4 rounded-lg outline-none"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full border p-3 mb-4 rounded-lg outline-none"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </>
            )}

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 mb-4 rounded-lg outline-none"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border p-3 mb-4 rounded-lg outline-none"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>

            <p
              className="text-center mt-4 cursor-pointer text-blue-600"
              onClick={() =>
                setIsLogin(!isLogin)
              }
            >
              {isLogin
                ? "Create new account"
                : "Already have an account? Login"}
            </p>

            <a
              href="/forgot-password"
              className="text-sm text-blue-600 underline block text-center mt-3"
            >
              Forgot Password?
            </a>

          </form>

        ) : (

          /* ================= OTP LOGIN ================= */
          <div>

            <h2 className="text-2xl font-bold text-center mb-6">
              Login with OTP
            </h2>

            <input
              type="tel"
              placeholder="Enter mobile number"
              className="w-full border p-3 mb-4 rounded-lg outline-none"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            {!confirmationResult ? (

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-black text-white p-3 rounded-lg"
              >
                Send OTP
              </button>

            ) : (

              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border p-3 mt-4 mb-4 rounded-lg outline-none"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />

                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="w-full bg-black text-white p-3 rounded-lg"
                >
                  Verify OTP
                </button>
              </>
            )}

            <div
              id="recaptcha-container"
              className="mt-5 flex justify-center"
            />

          </div>
        )}

      </div>
    </div>
  );
}