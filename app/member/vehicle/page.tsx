"use client";
import { useState } from "react";

export default function AddVehicle() {
  const [plateNumber, setPlateNumber] = useState("");
  const [type, setType] = useState("MEDIUM");

  const addVehicle = async () => {
    const res = await fetch("/api/vehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plateNumber, type }),
    });

    const data = await res.json();
    alert(JSON.stringify(data.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Add Vehicle</h2>

        <input
          placeholder="Plate Number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>

        <button onClick={addVehicle} className="btn w-full">
          Add Vehicle
        </button>
      </div>
    </div>
  );
}