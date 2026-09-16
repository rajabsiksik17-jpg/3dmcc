import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

const ALLOWED_EXT = new Set([
  "pdf", "doc", "docx", "jpg", "jpeg", "png", "webp", "txt", "csv", "xls", "xlsx",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `submissions/${randomUUID()}-${safeName}`;

    const admin = createAdminClient();
    const { error } = await admin.storage
      .from("private")
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ path, name: file.name, size: file.size, mimeType: file.type });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
