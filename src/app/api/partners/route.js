import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM partners`;
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/partners error", error);
    return Response.json(
      { error: "Failed to fetch partners" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, logo_url, partner_type, website_url } = body;
    const rows = await sql`
      INSERT INTO partners (name, logo_url, partner_type, website_url)
      VALUES (${name}, ${logo_url}, ${partner_type}, ${website_url})
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/partners error", error);
    return Response.json(
      { error: "Failed to create partner" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, name, logo_url, partner_type, website_url, category } =
      await request.json();
    const rows = await sql`
      UPDATE partners SET name=${name}, logo_url=${logo_url}, partner_type=${partner_type}, website_url=${website_url}, category=${category || partner_type}
      WHERE id=${id} RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/partners error", error);
    return Response.json(
      { error: "Failed to update partner" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await sql`DELETE FROM partners WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/partners error", error);
    return Response.json(
      { error: "Failed to delete partner" },
      { status: 500 },
    );
  }
}
