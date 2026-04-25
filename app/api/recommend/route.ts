import { supabase } from "@/lib/supabase";

type Car = {
  id: number;
  name: string;
  price: number;
  fuel: string;
  mileage: number;
  safety: number;
  type: string;
};

// const cars: Car[] = [
//   { id: 1, name: "Hyundai i20", price: 800000, fuel: "Petrol", mileage: 20, safety: 4, type: "Hatchback" },
//   { id: 2, name: "Tata Nexon", price: 1100000, fuel: "Petrol", mileage: 17, safety: 5, type: "SUV" },
//   { id: 3, name: "Maruti Swift", price: 700000, fuel: "Petrol", mileage: 22, safety: 3, type: "Hatchback" },
//   { id: 4, name: "Honda City", price: 1300000, fuel: "Petrol", mileage: 18, safety: 4, type: "Sedan" },
//   { id: 5, name: "Tata Punch", price: 600000, fuel: "Petrol", mileage: 20, safety: 4, type: "SUV" },
//   { id: 6, name: "Mahindra XUV300", price: 1200000, fuel: "Diesel", mileage: 19, safety: 5, type: "SUV" },
// ];


export async function POST(req: Request) {
  try {
    const { budget, fuel, use_case } = await req.json();

    const { data: cars, error } = await supabase
      .from("cars")
      .select("*");

    if (error) {
      console.error(error);
      return Response.json({ error: "DB error" }, { status: 500 });
    }

    // 🔍 Filtering
    let filtered = cars.filter((car) => {
      return (
        (!budget || car.price <= budget) &&
        (!fuel || car.fuel === fuel)
      );
    });

    if (filtered.length === 0) {
      filtered = cars;
    }

    // 🧠 Scoring
    const scored = filtered.map((car) => {
      let score = 0;
      let reasons: string[] = [];

      if (budget && car.price <= budget) {
        score += 2;
        reasons.push("Fits your budget");
      }

      if (use_case === "City" && car.mileage >= 20) {
        score += 3;
        reasons.push("Great mileage for city");
      }

      if (use_case === "Family") {
        if (car.safety >= 4) {
          score += 3;
          reasons.push("High safety rating");
        }
        if (car.type === "SUV") {
          score += 2;
          reasons.push("Spacious for family");
        }
      }

      return {
        ...car,
        score,
        reason: reasons.slice(0, 2).join(" • "),
      };
    });

    const topCars = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // 💾 SAVE TO SUPABASE
    await supabase.from("queries").insert([
      {
        input: { budget, fuel, use_case },
        results: topCars,
      },
    ]);

    return Response.json(topCars);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}