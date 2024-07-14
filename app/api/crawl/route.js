import { NextResponse } from "next/server";
import { API_ENDPOINT } from "./constants";
import { MongoClient } from "mongodb";

export async function GET() {
  const client = new MongoClient(process.env.MOGO_URI);

  console.log(process.env.MOGO_URI);
  try {
    await client.connect();

    const db = client.db("fomo");
    const collection = db.collection("crypto");

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "x-api-key": process.env.COINS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: "USD",
        sort: "rank",
        order: "ascending",
        offset: 0,
        limit: 5,
        meta: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    collection.insertMany(data);

    return NextResponse.json({ data });
  } catch (error) {
    // console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
