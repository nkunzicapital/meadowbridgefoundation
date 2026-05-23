import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const { name, email, subject, message, message_type } = await req.json();
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }
    const rows = await sql`
      INSERT INTO contact_messages (name, email, subject, message, message_type)
      VALUES (${name}, ${email}, ${subject || ""}, ${message}, ${message_type || "general"})
      RETURNING id
    `;
    return Response.json({ success: true, id: rows[0].id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const rows = unreadOnly
    ? await sql`SELECT * FROM contact_messages WHERE is_read=false ORDER BY created_at DESC`
    : await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function PUT(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id, is_read } = await req.json();
  await sql`UPDATE contact_messages SET is_read=${is_read} WHERE id=${id}`;
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const session = await auth();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await sql`DELETE FROM contact_messages WHERE id=${id}`;
  return Response.json({ success: true });
}
