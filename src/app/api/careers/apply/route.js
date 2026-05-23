import sql from "@/app/api/utils/sql";
import { upload } from "@/app/api/utils/upload";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const career_id = searchParams.get("career_id");
    let rows;
    if (career_id) {
      rows = await sql(
        "SELECT * FROM career_applications WHERE career_id=$1 ORDER BY submitted_at DESC",
        [career_id],
      );
    } else {
      rows =
        await sql`SELECT ca.*, c.title as career_title FROM career_applications ca JOIN careers c ON ca.career_id = c.id ORDER BY ca.submitted_at DESC`;
    }
    return Response.json(rows);
  } catch (e) {
    console.error(e);
    return Response.json([]);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { career_id, applicant_data, documents } = body;
    // Verify career is active and deadline not passed
    const careers = await sql("SELECT * FROM careers WHERE id=$1", [career_id]);
    if (!careers.length)
      return Response.json({ error: "Position not found" }, { status: 404 });
    const career = careers[0];
    if (!career.is_active)
      return Response.json(
        { error: "This position is no longer accepting applications" },
        { status: 400 },
      );
    if (career.deadline && new Date(career.deadline) < new Date()) {
      return Response.json(
        { error: "The application deadline has passed" },
        { status: 400 },
      );
    }
    const rows = await sql(
      "INSERT INTO career_applications (career_id, applicant_data, documents) VALUES ($1,$2,$3) RETURNING *",
      [
        career_id,
        JSON.stringify(applicant_data || {}),
        JSON.stringify(documents || []),
      ],
    );
    return Response.json(rows[0]);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
