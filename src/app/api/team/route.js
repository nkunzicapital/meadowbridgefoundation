import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM team_members ORDER BY order_index ASC`;
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/team error", error);
    return Response.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      position,
      bio,
      photo_url,
      linkedin_url,
      group_name,
      order_index,
    } = body;
    const rows = await sql`
      INSERT INTO team_members (name, position, bio, photo_url, linkedin_url, group_name, order_index)
      VALUES (${name}, ${position}, ${bio}, ${photo_url}, ${linkedin_url}, ${group_name}, ${order_index || 0})
      RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/team error", error);
    return Response.json(
      { error: "Failed to create team member" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const {
      id,
      name,
      position,
      bio,
      photo_url,
      linkedin_url,
      group_name,
      order_index,
    } = await request.json();
    const rows = await sql`
      UPDATE team_members SET name=${name}, position=${position}, bio=${bio}, photo_url=${photo_url},
      linkedin_url=${linkedin_url}, group_name=${group_name}, order_index=${order_index || 0}
      WHERE id=${id} RETURNING *
    `;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/team error", error);
    return Response.json(
      { error: "Failed to update team member" },
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
    await sql`DELETE FROM team_members WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/team error", error);
    return Response.json(
      { error: "Failed to delete team member" },
      { status: 500 },
    );
  }
}
