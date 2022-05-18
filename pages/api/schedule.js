import JSONdb from "simple-json-db";

const db = new JSONdb("../../../db.json");

export default function handler(req, res) {
  const data = db.JSON();
  const ids = Object.keys(data ?? {});

  // Convert db data to array of items.
  const items = ids.map((id) => ({
    id,
    name: data[id].name,
    schedule: data[id].schedule,
  }));

  res.status(200).json({ items: items ?? [] });
}
