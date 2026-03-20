"use client";
import { useEffect, useState } from "react";

export default function CheckInPage() {
  const [vehicleId, setVehicleId] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [response, setResponse] = useState("");
  const [spaces, setSpaces] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/space")
      .then((res) => res.json())
      .then((data) => setSpaces(data));

    fetch("/api/vehicle")
      .then((res) => res.json())
      .then((data) => setVehicles(data));
  }, []);

  const handleCheckIn = async () => {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vehicleId, spaceId }),
    });

    const data = await res.json();
    setResponse(JSON.stringify(data.message, null, 2));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Check-In</h2>

        <select
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Vehicle</option>

          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.plateNumber} ({v.type})
            </option>
          ))}
        </select>

        <select
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select Space</option>

          {spaces
            .filter((s) => !s.isOccupied && !s.isReservedNow)
            .map((space) => (
              <option key={space.id} value={space.id}>
                {space.number} ({space.zone.name})
              </option>
            ))}
        </select>

        <button onClick={handleCheckIn} className="btn w-full">
          Check In
        </button>

        {response && (
          <pre className="mt-4 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {response}
          </pre>
        )}
      </div>
    </div>
  );
}
