import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    let query = "SELECT * FROM articles";
    const values = [];

    if (category) {
      query += " WHERE category = $1";
      values.push(category);
    }

    query += " ORDER BY published_at DESC LIMIT $" + (values.length + 1);
    values.push(limit);

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/articles error", error);
    return Response.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, content, excerpt, featured_image_url, pdf_url, category } =
      body;
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const rows = await sql`
      INSERT INTO articles (title, slug, content, excerpt, featured_image_url, pdf_url, category, author_id)
      VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${featured_image_url}, ${pdf_url}, ${category}, ${session.user.id})
      RETURNING *
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/articles error", error);
    return Response.json(
      { error: "Failed to create article" },
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
      title,
      content,
      excerpt,
      featured_image_url,
      pdf_url,
      category,
    } = await request.json();
    const rows = await sql(
      "UPDATE articles SET title=$1, content=$2, excerpt=$3, featured_image_url=$4, pdf_url=$5, category=$6 WHERE id=$7 RETURNING *",
      [title, content, excerpt, featured_image_url, pdf_url, category, id],
    );
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/articles error", error);
    return Response.json(
      { error: "Failed to update article" },
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
    await sql("DELETE FROM articles WHERE id=$1", [id]);
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/articles error", error);
    return Response.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
