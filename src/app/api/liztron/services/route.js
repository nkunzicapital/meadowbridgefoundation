import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows =
      await sql`SELECT * FROM liztron_services ORDER BY order_index ASC`;
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
  const {
    id,
    code,
    title,
    subtitle,
    description,
    details,
    specs,
    applications,
  } = body;
  const rows = await sql`
    UPDATE liztron_services SET
      code=${code}, title=${title}, subtitle=${subtitle}, description=${description},
      details=${JSON.stringify(details)}::jsonb, specs=${JSON.stringify(specs)}::jsonb,
      applications=${JSON.stringify(applications)}::jsonb
    WHERE id=${id} RETURNING *
  `;
  return Response.json(rows[0]);
}
