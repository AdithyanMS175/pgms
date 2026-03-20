"use client";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const signup = async () => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password , role }),
    });

    const data = await res.json();
    alert(JSON.stringify(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Signup</h2>

        <div className="flex gap-2 mb-4">
          {["MEMBER", "ATTENDANT", "MANAGER"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded border ${
                role === r ? "bg-orange-500 text-white" : ""
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={signup}
          className="btn w-full bg-amber-300 rounded-4xl p-3 cursor-pointer"
        >
          Signup
        </button>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
