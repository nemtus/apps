import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

function postRequest(body: unknown) {
  return new Request("http://localhost/api/sign_up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: "taro@example.com",
  firstName: "Taro",
  lastName: "Yamada",
  phone: "",
  address: "",
};

describe("POST /api/sign_up バリデーション", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("不正なメールは 404 を返し外部 API を呼ばない", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const res = await POST(postRequest({ ...validBody, email: "invalid" }));
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ message: "Invalid email address" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("不正な phone(記号含む) は 404 を返す", async () => {
    const res = await POST(postRequest({ ...validBody, phone: "090-1234-5678" }));
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ message: "Invalid phone address" });
  });

  it("有効な入力では外部 API の結果(ok)を 200 で返す", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));
    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: "ok" });
  });

  it("外部 API がエラーメッセージを返したら 404 で中継する", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "duplicated" }), { status: 200 }),
    );
    const res = await POST(postRequest(validBody));
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ message: "duplicated" });
  });
});
