import { TextValidation } from "@/lib/utils";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as IUser;

  if (body.email && !TextValidation.isEmail(body.email)) {
    return NextResponse.json({ message: "Invalid email address" }, { status: 404 });
  }
  if (body.phone && !TextValidation.isSymbol(body.phone)) {
    return NextResponse.json({ message: "Invalid phone address" }, { status: 404 });
  }
  if (!body.firstName && !TextValidation.isSymbol(body.firstName)) {
    return NextResponse.json({ message: "You must enter your first name to continue" }, { status: 404 });
  }
  if (!body.lastName && !TextValidation.isSymbol(body.lastName)) {
    return NextResponse.json({ message: "You must enter your last name to continue" }, { status: 404 });
  }
  if (!body.address) {
    body.address = "";
  }

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbyv2SuZoiN2SQ-uQGqZ51GehdcPjmrjTf0ygbQff1YPgUBe2VQy7VzombbA8ss8gidB/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const responseJson = await res.json();

  if (responseJson.message === "ok") {
    return NextResponse.json({ message: "ok" }, { status: 200 });
  } else {
    return NextResponse.json({ message: responseJson.message }, { status: 404 });
  }
}
