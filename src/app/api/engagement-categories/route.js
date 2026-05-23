import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM engagement_categories ORDER BY name`;
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([]);
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { name } = await req.json();
    const rows = await sql(
      "INSERT INTO engagement_categories (name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *",
      [name],
    );
    return Response.json(rows[0] || { name });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await sql("DELETE FROM engagement_categories WHERE id=$1", [id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
