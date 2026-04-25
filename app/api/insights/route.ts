import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("queries")
      .select("*");

    if (error) {
      return Response.json({ error: "DB error" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json({
        total: 0,
        avgBudget: 0,
        popularFuel: "N/A",
        topCar: "N/A",
      });
    }

    // 📊 Total searches
    const total = data.length;

    // 💰 Avg budget
    const avgBudget =
      data.reduce((sum, q) => sum + (q.input?.budget || 0), 0) / total;

    // ⛽ Most common fuel
    const fuelCount: Record<string, number> = {};

    data.forEach((q) => {
      const fuel = q.input?.fuel;
      if (fuel) {
        fuelCount[fuel] = (fuelCount[fuel] || 0) + 1;
      }
    });

    const popularFuel =
      Object.entries(fuelCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    // 🚗 Most recommended car
    const carCount: Record<string, number> = {};

    data.forEach((q) => {
      q.results?.forEach((car: any) => {
        carCount[car.name] = (carCount[car.name] || 0) + 1;
      });
    });

    const topCar =
      Object.entries(carCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return Response.json({
      total,
      avgBudget: Math.round(avgBudget),
      popularFuel,
      topCar,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}