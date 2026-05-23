import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM careers ORDER BY created_at DESC`;
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
    const { title, description, deadline, is_active, required_fields } =
      await req.json();
    const rows = await sql(
      "INSERT INTO careers (title, description, deadline, is_active, required_fields) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [
        title,
        description,
        deadline || null,
        is_active !== false,
        JSON.stringify(required_fields || []),
      ],
    );
    return Response.json(rows[0]);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, title, description, deadline, is_active, required_fields } =
      await req.json();
    const rows = await sql(
      "UPDATE careers SET title=$1, description=$2, deadline=$3, is_active=$4, required_fields=$5 WHERE id=$6 RETURNING *",
      [
        title,
        description,
        deadline || null,
        is_active !== false,
        JSON.stringify(required_fields || []),
        id,
      ],
    );
    return Response.json(rows[0]);
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
    await sql("DELETE FROM careers WHERE id=$1", [id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
