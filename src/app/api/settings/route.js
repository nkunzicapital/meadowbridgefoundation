import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const rows =
      await sql`SELECT setting_key, setting_value FROM site_settings`;
    const settings = rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    return Response.json(settings);
  } catch (error) {
    console.error("GET /api/settings error", error);
    return Response.json(
      { error: "Failed to fetch settings" },
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
    const { key, value } = body;

    await sql`
      INSERT INTO site_settings (setting_key, setting_value)
      VALUES (${key}, ${JSON.stringify(value)})
      ON CONFLICT (setting_key) DO UPDATE
      SET setting_value = ${JSON.stringify(value)}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("POST /api/settings error", error);
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
