import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM liztron_esg ORDER BY order_index ASC`;
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
  const { id, pillar, title, items } = body;
  const rows = await sql`
    UPDATE liztron_esg SET pillar=${pillar}, title=${title}, items=${JSON.stringify(items)}::jsonb
    WHERE id=${id} RETURNING *
  `;
  return Response.json(rows[0]);
}
