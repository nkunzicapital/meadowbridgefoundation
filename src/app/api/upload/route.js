import { upload } from "@/app/api/utils/upload";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { base64, url } = body;

    let result;
    if (base64) {
      result = await upload({ base64 });
    } else if (url) {
      result = await upload({ url });
    } else {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({ url: result.url, mimeType: result.mimeType });
  } catch (e) {
    console.error("POST /api/upload error", e);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
