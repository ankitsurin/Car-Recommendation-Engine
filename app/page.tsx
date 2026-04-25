"use client";

import { useState } from "react";

type Car = {
  id: number;
  name: string;
  price: number;
  fuel: string;
  mileage: number;
  safety: number;
  type: string;
  image_url?: string;  // 👈 ADD THIS
  reason?: string;
};

export default function Home() {
  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const [useCase, setUseCase] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [comparison, setComparison] = useState<Car[]>([]);
  const [insights, setInsights] = useState<any>(null);

  const loadInsights = async () => {
    const res = await fetch("/api/insights");
    const data = await res.json();
    setInsights(data);
  };

  const handleReset = () => {
    if (!confirm("Reset all filters and results?")) return;

    setBudget("");
    setFuel("");
    setUseCase("");
    setCars([]);
    setComparison([]);
    setSelectedCars([]);
  };

  const handleSubmit = async () => {
    setInsights(null); // 👈 ADD THIS (auto close)

    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          budget: Number(budget),
          fuel,
          use_case: useCase,
        }),
      });

      const data = await res.json();
      console.log("API Response:", data);  // 👈 ADD THIS
      setCars(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const cheapestCarId =
    comparison.length > 0
      ? comparison.reduce((min, car) =>
        car.price < min.price ? car : min
      ).id
      : null;

  const safestCarId =
    comparison.length > 0
      ? comparison.reduce((max, car) =>
        car.safety > max.safety ? car : max
      ).id
      : null;

  const bestMileageCarId =
    comparison.length > 0
      ? comparison.reduce((max, car) =>
        car.mileage > max.mileage ? car : max
      ).id
      : null;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          🚗 Car Recommendation Engine
        </h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Budget */}
            <input
              type="number"
              placeholder="Budget (₹)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border p-3 rounded-lg"
            />

            {/* Fuel */}
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="border p-3 rounded-lg text-gray-700"
            >
              <option value="" disabled>
                Select Fuel Type
              </option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="EV">EV</option>
            </select>

            {/* Use Case */}
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="border p-3 rounded-lg text-gray-700"
            >
              <option value="" disabled>
                Select Use Case
              </option>
              <option value="City">City</option>
              <option value="Highway">Highway</option>
              <option value="Family">Family</option>
            </select>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Find Cars
            </button>

            <button
              onClick={handleReset}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Reset
            </button>


          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={loadInsights}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Show Insights
          </button>
        </div>

        {insights && (
          <div className="mt-6 bg-white p-6 rounded-2xl shadow-md relative">

            {/* ❌ Close Button */}
            <button
              onClick={() => setInsights(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">📊 Insights Dashboard</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Searches</p>
                <p className="text-xl font-semibold">{insights.total}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Avg Budget</p>
                <p className="text-xl font-semibold">₹{insights.avgBudget}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Popular Fuel</p>
                <p className="text-xl font-semibold">{insights.popularFuel}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Top Car</p>
                <p className="text-xl font-semibold">{insights.topCar}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {cars.length === 0 && !loading && (
            <p className="text-center text-gray-500">
              No results yet. Try searching!
            </p>
          )}

          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="flex justify-between items-center gap-4">

                {/* LEFT: Details */}
                <div className="flex-1">

                  {/* Checkbox + Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCars.includes(car.id)}
                      onChange={() => {
                        if (selectedCars.includes(car.id)) {
                          setSelectedCars(selectedCars.filter((id) => id !== car.id));
                        } else {
                          if (selectedCars.length < 3) {
                            setSelectedCars([...selectedCars, car.id]);
                          }
                        }
                      }}
                    />
                    <h2 className="text-lg font-semibold">{car.name}</h2>
                  </div>

                  {/* Details */}
                  <div className="text-sm text-gray-600">
                    <p>💰 ₹{car.price}</p>
                    <p>⛽ {car.fuel}</p>
                    <p>🛣 {car.mileage} km/l</p>
                    <p>🛡 {car.safety} ⭐</p>
                  </div>

                  {/* Reason */}
                  {car.reason && (
                    <p className="mt-2 text-green-600 text-sm font-medium">
                      {car.reason}
                    </p>
                  )}
                </div>

                {/* RIGHT: Image */}
                <img
                  src={car.image_url || "/cars/default.jpg"}
                  alt={car.name}
                  className="w-32 h-24 object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {comparison.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-md overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Comparison</h2>

            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Feature</th>

                  {comparison.map((car) => (
                    <th key={car.id} className="p-2 border text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold">{car.name}</span>

                        {/* Badges */}
                        {car.id === cheapestCarId && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            💰 Best Price
                          </span>
                        )}

                        {car.id === safestCarId && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            🛡 Safest
                          </span>
                        )}

                        {car.id === bestMileageCarId && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            🛣 Best Mileage
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-2 border font-semibold">Price</td>
                  {comparison.map((car) => (
                    <td key={car.id} className="p-2 border">₹{car.price}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-2 border font-semibold">Fuel</td>
                  {comparison.map((car) => (
                    <td key={car.id} className="p-2 border">{car.fuel}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-2 border font-semibold">Mileage</td>
                  {comparison.map((car) => (
                    <td key={car.id} className="p-2 border">{car.mileage} km/l</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-2 border font-semibold">Safety</td>
                  {comparison.map((car) => (
                    <td key={car.id} className="p-2 border">{car.safety} ⭐</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-2 border font-semibold">Type</td>
                  {comparison.map((car) => (
                    <td key={car.id} className="p-2 border">{car.type}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={async () => {
            if (selectedCars.length < 2) {
              alert("Select at least 2 cars to compare");
              return;
            }

            const res = await fetch("/api/compare", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ids: selectedCars }),
            });

            const data = await res.json();
            setComparison(data);
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition duration-200"
        >
          Compare Selected Cars
        </button>

      </div>
    </main>
  );
}