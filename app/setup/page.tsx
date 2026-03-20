"use client";
import { Router } from "next/router";
import { useState, useEffect } from "react";

export default function Setup() {
  const [ids, setIds] = useState({
    garageId: "",
    floorId: "",
    zoneId: "",
  });

  const [garageForm, setGarageForm] = useState({
    name: "",
    location: "",
  });

  const [garages, setGarages] = useState<any[]>([]);

  const [floorForm, setFloorForm] = useState({
    number: "",
  });

  const [zoneForm, setZoneForm] = useState({
    name: "",
    type: "",
    basePrice: "",
  });

  const [spaceForm, setSpaceForm] = useState({
    number: "",
    size: "",
  });

  useEffect(() => {
    fetchGarages();
    window.location.reload();
  }, []);

  const fetchGarages = async () => {
    const res = await fetch("/api/garage");
    const data = await res.json();
    setGarages(data);
  };

  //  CREATE GARAGE
  const createGarage = async () => {
    const res = await fetch("/api/garage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(garageForm),
    });

    const data = await res.json();

    setIds((prev) => ({ ...prev, garageId: data.id }));
    fetchGarages();
  };

  //  CREATE FLOOR
  const createFloor = async () => {
    try {
      const res = await fetch("/api/floor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: Number(floorForm.number),
          garageId: ids.garageId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setIds((prev) => ({ ...prev, floorId: data.id }));
      fetchGarages();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  //  CREATE ZONE
  const createZone = async () => {
    const res = await fetch("/api/zone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...zoneForm,
        floorId: ids.floorId,
        basePrice: Number(zoneForm.basePrice),
      }),
    });

    const data = await res.json();

    setIds((prev) => ({ ...prev, zoneId: data.id }));
    fetchGarages();
  };

  //  CREATE SPACE
  const createSpace = async () => {
    try {
      const res = await fetch("/api/space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...spaceForm,
          zoneId: ids.zoneId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create space");
        return;
      }

      alert("Space created!");

      fetchGarages();

      setSpaceForm({
        number: "",
        size: "",
      });

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* GARAGE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2"> Create Garage</h2>
        <input
          placeholder="Name"
          onChange={(e) =>
            setGarageForm({ ...garageForm, name: e.target.value })
          }
          className="border-black p-2 mx-5"
        />
        <input
          placeholder="Location"
          onChange={(e) =>
            setGarageForm({ ...garageForm, location: e.target.value })
          }
          className="border-black p-2 mx-5"
        />
        <button onClick={createGarage} className="btn">
          Create Garage
        </button>
      </div>

      {/* FLOOR */}
      {ids.garageId && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">2. Add Floor</h2>
          <input
            placeholder="Floor Number"
            onChange={(e) =>
              setFloorForm({ ...floorForm, number: e.target.value })
            }
            className="border-black mx-2 p-2"
          />
          <button onClick={createFloor} className="btn">
            Add Floor
          </button>
        </div>
      )}

      {/* ZONE */}
      {ids.floorId && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2"> Add Zone</h2>
          <input
            placeholder="Zone Name"
            onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
            className="border-black mx-2 p-2"
          />
          <input
            placeholder="Zone Type (STANDARD/PREMIUM)"
            onChange={(e) => setZoneForm({ ...zoneForm, type: e.target.value })}
            className="border-black mx-10 p-2 w-70"
          />
          <input
            placeholder="Base Price"
            onChange={(e) =>
              setZoneForm({ ...zoneForm, basePrice: e.target.value })
            }
            className="border-black mx-2 p-2"
          />

          <button onClick={createZone} className="btn">
            Add Zone
          </button>
        </div>
      )}

      {/* SPACE */}
      {ids.zoneId && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">4. Add Space</h2>
          <input
            placeholder="Space Number"
            onChange={(e) =>
              setSpaceForm({ ...spaceForm, number: e.target.value })
            }
            className="border-black"
          />
          <input
            placeholder="Size (SMALL/MEDIUM/LARGE)"
            onChange={(e) =>
              setSpaceForm({ ...spaceForm, size: e.target.value })
            }
            className="border-black "
          />
          <button onClick={createSpace} className="btn">
            Add Space
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">Garages Overview</h2>

        {garages.map((garage) => (
          <div
            key={garage.id}
            className="bg-white border rounded-xl p-4 shadow-sm my-5"
          >
            {/* Garage Header */}
            <div className="mb-3">
              <h3 className="text-lg font-bold">{garage.name}</h3>
              <p className="text-sm text-gray-500">
                Location: {garage.location || "No location"}
              </p>
            </div>

            {/* Floors */}
            {garage.floors.length === 0 && (
              <p className="text-sm text-gray-400">No floors added yet</p>
            )}

            <div className="space-y-3">
              {garage.floors.map((floor: any) => (
                <div
                  key={floor.id}
                  className="border rounded-lg p-3 bg-gray-50"
                >
                  <p className="font-medium mb-2"> Floor {floor.number}</p>

                  {/* Zones */}
                  {floor.zones.length === 0 && (
                    <p className="text-sm text-gray-400">No zones added</p>
                  )}

                  <div className="space-y-2">
                    {floor.zones.map((zone: any) => (
                      <div key={zone.id}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{zone.name}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">
                            {zone.type}
                          </span>
                        </div>

                        {/* Spaces */}
                        {zone.spaces.length === 0 ? (
                          <p className="text-xs text-gray-400">No spaces</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {zone.spaces.map((space: any) => (
                              <div
                                key={space.id}
                                className="px-2 py-1 text-xs border rounded bg-white"
                              >
                                {space.number} ({space.size})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
