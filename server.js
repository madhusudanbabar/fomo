import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { MongoClient } from "mongodb";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });

const handler = app.getRequestHandler();

let stock;

const getRecentData = async (collection) => {
  const recentData = await collection
    .find({ code: stock })
    .sort({ _id: -1 })
    .limit(20)
    .toArray();
  return recentData;
};

setInterval(() => {
  console.log("Running every 5 seconds");
  fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/crawl`
  );
}, 5000);

app.prepare().then(async () => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  const client = new MongoClient(process.env.MONGO_URI);
  const db = client.db("fomo");
  const collection = db.collection("crypto");
  await client.connect();

  const stream = client.watch();

  io.on("connection", (socket) => {
    socket.on("stock", async (val) => {
      stock = val;
      socket.emit("stock-updated", await getRecentData(collection));
    });

    stream.on("change", async () => {
      socket.emit("stock-updated", await getRecentData(collection));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
