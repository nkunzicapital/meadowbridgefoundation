import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { hash } from "argon2";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const rows =
      await sql`SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC`;
    return Response.json(rows);
  } catch (error) {
    console.error("GET /api/admin/users error", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, password, name, role } = body;
    const passwordHash = await hash(password);

    const rows = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${passwordHash}, ${name}, ${role})
      RETURNING id, email, name, role
    `;

    return Response.json(rows[0]);
  } catch (error) {
    console.error("POST /api/admin/users error", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return Response.json({ error: "Forbidden" }, { status: 403 });
    const { id, role } = await request.json();
    const rows =
      await sql`UPDATE users SET role=${role} WHERE id=${id} RETURNING id, email, name, role`;
    return Response.json(rows[0]);
  } catch (error) {
    console.error("PUT /api/admin/users error", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return Response.json({ error: "Forbidden" }, { status: 403 });
    const { id, password } = await request.json();
    const passwordHash = await hash(password);
    await sql`UPDATE users SET password_hash=${passwordHash} WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/users error", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin")
      return Response.json({ error: "Forbidden" }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await sql`DELETE FROM users WHERE id=${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/users error", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
