"use client";
import { useEffect, useState } from "react";

export default function CheckOutPage() {
  const [sessionId, setSessionId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  const handleCheckOut = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Check-Out</h2>

        <select
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select Active Session</option>

          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.vehicle.plateNumber} → {s.space.number}
            </option>
          ))}
        </select>

        <button onClick={handleCheckOut} className="btn w-full">
          Check Out
        </button>

        {result && (
          <div className="mt-4">
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>

            {result.price && (
              <h2 className="text-green-600 font-bold mt-2">
                ₹{result.price.toFixed(2)}
              </h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
