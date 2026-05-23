import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const section = searchParams.get("section");
    let rows;
    if (page && section) {
      rows = await sql(
        "SELECT * FROM page_content WHERE page=$1 AND section=$2",
        [page, section],
      );
    } else if (page) {
      rows = await sql("SELECT * FROM page_content WHERE page=$1", [page]);
    } else {
      rows = await sql`SELECT * FROM page_content`;
    }
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
    const { page, section, content } = await req.json();
    const rows = await sql(
      `INSERT INTO page_content (page, section, content, updated_at) VALUES ($1,$2,$3,NOW())
       ON CONFLICT (page, section) DO UPDATE SET content=EXCLUDED.content, updated_at=NOW() RETURNING *`,
      [page, section, JSON.stringify(content)],
    );
    return Response.json(rows[0]);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
