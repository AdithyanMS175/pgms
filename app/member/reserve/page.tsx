"use client";
import { useEffect, useState } from "react";

export default function Reserve() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    fetch("/api/space")
      .then((res) => res.json())
      .then((dataspace) => setSpaces(dataspace));

    fetch("/api/vehicle")
      .then((res) => res.json())
      .then((data) => setVehicles(data));
  }, []);

  const reserve = async () => {
    if (!selectedSpace) {
      alert("Select a space");
      return;
    }

    const res = await fetch("/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spaceId: selectedSpace,
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      }),
    });

    const data = await res.json();
    alert(JSON.stringify(data.message));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Select Parking Space
      </h2>
      
      {/* SPACE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {spaces.map((space) => (
          <div
            key={space.id}
            onClick={() => setSelectedSpace(space.id)}
            className={`p-4 rounded-xl shadow cursor-pointer border transition
              ${
                selectedSpace === space.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-gray-50"
              }
            `}
          >
            <h3 className="font-semibold text-lg">Space {space.number}</h3>

            <p className="text-sm text-gray-600">Size: {space.size}</p>

            <p className="text-sm text-gray-500">
              Zone: {space.zone?.name || "N/A"}
            </p>

            <p
              className={`text-sm mt-2 font-medium ${
                space.isReservedNow ? "text-red-500" : "text-green-600"
              }`}
            >
              {space.isReservedNow ? "Occupied" : "Available"}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-6">
        <button onClick={reserve} className="btn px-6">
          Reserve Selected Space
        </button>
      </div>
    </div>
  );
}
