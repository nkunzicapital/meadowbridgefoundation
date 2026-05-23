import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM programs ORDER BY created_at ASC`;
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
    const {
      name,
      description,
      location_type,
      location_name,
      image_url,
      bullets,
    } = await req.json();
    const rows = await sql(
      "INSERT INTO programs (name, description, location_type, location_name, image_url, bullets) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [
        name,
        description,
        location_type,
        location_name,
        image_url,
        JSON.stringify(bullets || []),
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
    const {
      id,
      name,
      description,
      location_type,
      location_name,
      image_url,
      bullets,
    } = await req.json();
    const rows = await sql(
      "UPDATE programs SET name=$1, description=$2, location_type=$3, location_name=$4, image_url=$5, bullets=$6 WHERE id=$7 RETURNING *",
      [
        name,
        description,
        location_type,
        location_name,
        image_url,
        JSON.stringify(bullets || []),
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
    await sql("DELETE FROM programs WHERE id=$1", [id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
