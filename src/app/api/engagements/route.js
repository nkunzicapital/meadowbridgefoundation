import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    let rows;
    if (category) {
      rows = await sql(
        "SELECT * FROM engagements WHERE category = $1 ORDER BY engagement_date DESC, created_at DESC",
        [category],
      );
    } else {
      rows =
        await sql`SELECT * FROM engagements ORDER BY engagement_date DESC, created_at DESC`;
    }
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const {
      title,
      category,
      year,
      engagement_date,
      country,
      representative,
      report_url,
    } = body;
    const rows = await sql(
      "INSERT INTO engagements (title, category, year, engagement_date, country, representative, report_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [
        title,
        category,
        year,
        engagement_date || null,
        country,
        representative,
        report_url,
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
    const body = await req.json();
    const {
      id,
      title,
      category,
      year,
      engagement_date,
      country,
      representative,
      report_url,
    } = body;
    const rows = await sql(
      "UPDATE engagements SET title=$1, category=$2, year=$3, engagement_date=$4, country=$5, representative=$6, report_url=$7 WHERE id=$8 RETURNING *",
      [
        title,
        category,
        year,
        engagement_date || null,
        country,
        representative,
        report_url,
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
    await sql("DELETE FROM engagements WHERE id=$1", [id]);
    return Response.json({ success: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
