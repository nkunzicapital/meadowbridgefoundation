import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM liztron_financial ORDER BY order_index ASC`;
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 200 });
  }
}

export async function PUT(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, category, label, value, description, order_index } = body;
  const rows = await sql`
    UPDATE liztron_financial SET
      category=${category}, label=${label}, value=${value},
      description=${description}, order_index=${order_index || 0}
    WHERE id=${id} RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function POST(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { category, label, value, description, order_index } = body;
  const rows = await sql`
    INSERT INTO liztron_financial (category, label, value, description, order_index)
    VALUES (${category}, ${label}, ${value}, ${description}, ${order_index || 0}) RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function DELETE(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await sql`DELETE FROM liztron_financial WHERE id=${id}`;
  return Response.json({ success: true });
}
