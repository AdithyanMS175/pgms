"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      
      router.push("/");
      router.refresh();
      alert(data.message);
      
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={login}
          className="btn w-full bg-amber-300 rounded-4xl p-3 cursor-pointer"
        >
          Login
        </button>

        <p className="text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 ">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
