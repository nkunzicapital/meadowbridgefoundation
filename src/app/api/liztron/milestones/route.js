import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM liztron_milestones ORDER BY order_index ASC`;
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { phase, phase_label, year_range, title, items, order_index } = body;
  const rows = await sql`
    INSERT INTO liztron_milestones (phase, phase_label, year_range, title, items, order_index)
    VALUES (${phase}, ${phase_label}, ${year_range}, ${title}, ${JSON.stringify(items)}::jsonb, ${order_index || 0})
    RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function PUT(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, phase, phase_label, year_range, title, items, order_index } =
    body;
  const rows = await sql`
    UPDATE liztron_milestones SET
      phase=${phase}, phase_label=${phase_label}, year_range=${year_range},
      title=${title}, items=${JSON.stringify(items)}::jsonb, order_index=${order_index || 0}
    WHERE id=${id} RETURNING *
  `;
  return Response.json(rows[0]);
}

export async function DELETE(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await sql`DELETE FROM liztron_milestones WHERE id=${id}`;
  return Response.json({ success: true });
}
