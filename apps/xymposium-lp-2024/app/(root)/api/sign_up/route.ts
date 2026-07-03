import { TextValidation } from "@/lib/utils";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 受付は既定で無効。再開する場合は環境変数 REGISTRATION_ENABLED=true を設定する。
  if (process.env.REGISTRATION_ENABLED !== "true") {
    return NextResponse.json({ message: "Registration is closed" }, { status: 403 });
  }

  const body = (await request.json()) as IUser;

  if (body.email && !TextValidation.isEmail(body.email)) {
    return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
  }
  if (body.phone && !TextValidation.isSymbol(body.phone)) {
    return NextResponse.json({ message: "Invalid phone address" }, { status: 400 });
  }
  if (!body.firstName) {
    return NextResponse.json({ message: "You must enter your first name to continue" }, { status: 400 });
  }
  if (!body.lastName) {
    return NextResponse.json({ message: "You must enter your last name to continue" }, { status: 400 });
  }
  if (!body.address) {
    body.address = "";
  }

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxS73xP5a3g_p3TVOGsgcCJsaEQ28P0MmbuFC822jYJ0XYabD386P65-RFfzvlteqO-/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  const responseJson = (await res.json()) as { message?: string };

  if (responseJson.message === "ok") {
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } else {
    return NextResponse.json({ message: responseJson.message }, { status: 400 });
  }
}
