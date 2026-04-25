import { NextResponse } from "next/server";
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

// Same dataset (or fetch from DB later)
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
        const { ids } = await req.json();

        const { data, error } = await supabase
            .from("cars")
            .select("*")
            .in("id", ids);

        if (error) {
            return Response.json({ error: "DB error" }, { status: 500 });
        }
        return Response.json(data);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error comparing cars" }, { status: 500 });
    }
}