import JSONdb from "simple-json-db";
import uuid from "uuid-random";

const db = new JSONdb("../../../db.json");

export default function handler({ method, body }, res) {
  if (method === "POST") {
    // Add new item.
    db.set([uuid()], body);

    // Return updated db.
    const data = db.JSON();
    const ids = Object.keys(data);

    // Convert db data to array of items.
    const items = ids.map((id) => ({
      id,
      name: data[id].name,
      schedule: data[id].schedule,
    }));

    res.status(200).json({ items });
  } else {
    res.status(405).json({ message: "This method is not allowed." });
  }
}
