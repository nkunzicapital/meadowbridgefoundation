import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");
    let rows;
    if (all === "true") {
      rows = await sql`SELECT * FROM podcasts ORDER BY published_at DESC`;
    } else {
      rows =
        await sql`SELECT * FROM podcasts WHERE is_active = true ORDER BY published_at DESC`;
    }
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/podcasts error", error);
    return Response.json(
      { error: "Failed to fetch podcasts" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, audio_url, is_active } = body;
    const rows = await sql`
      INSERT INTO podcasts (title, description, audio_url, is_active)
      VALUES (${title}, ${description}, ${audio_url}, ${is_active !== undefined ? is_active : true})
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/podcasts error", error);
    return Response.json(
      { error: "Failed to create podcast" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id, title, description, audio_url, is_active } =
      await request.json();
    const rows = await sql`
      UPDATE podcasts SET title=${title}, description=${description}, audio_url=${audio_url}, is_active=${is_active}
      WHERE id=${id} RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/podcasts error", error);
    return Response.json(
      { error: "Failed to update podcast" },
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
    await sql`DELETE FROM podcasts WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/podcasts error", error);
    return Response.json(
      { error: "Failed to delete podcast" },
      { status: 500 },
    );
  }
}
