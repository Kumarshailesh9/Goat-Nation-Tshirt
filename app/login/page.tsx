"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser(email, password);

        console.log("User Role:", res.role);

        if (res.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        await registerUser(name, email, password);
        toast.success("Account created successfully");
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border p-3 mb-4 rounded outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-3 mb-4 rounded outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border p-3 mb-4 rounded outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-center mt-4 cursor-pointer text-blue-600"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Create new account"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}