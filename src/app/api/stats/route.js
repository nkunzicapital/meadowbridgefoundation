import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM impact_stats`;
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/stats error", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, value, icon } = body;
    const rows = await sql`
      INSERT INTO impact_stats (label, value, icon)
      VALUES (${label}, ${value}, ${icon})
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/stats error", error);
    return Response.json({ error: "Failed to create stat" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, label, value, icon } = await request.json();
    const rows =
      await sql`UPDATE impact_stats SET label=${label}, value=${value}, icon=${icon} WHERE id=${id} RETURNING *`;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/stats error", error);
    return Response.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await sql`DELETE FROM impact_stats WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/stats error", error);
    return Response.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}
