import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
    const client = new MongoClient(process.env.MONGO_URI as string);
    const db = client.db("fomo");
    const collection = db.collection("crypto");
    await client.connect();

    const stocks = await collection.distinct("code");

    return NextResponse.json({ stocks });
  } catch (error) {
    return NextResponse.error();
  }
}
