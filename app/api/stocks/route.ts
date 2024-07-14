import client from "../commons";

const listener = client.watch([], { fullDocument: "updateLookup" });

listener.on("change", (next: any) => {
  console.log("changed", next);
});
