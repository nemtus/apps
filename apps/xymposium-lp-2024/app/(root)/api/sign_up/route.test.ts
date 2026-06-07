import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("POST /api/sign_up", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe("受付が無効 (既定)", () => {
    it("REGISTRATION_ENABLED 未設定なら 403 を返し外部 API を呼ばない", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const res = await POST(postRequest(validBody));
      expect(res.status).toBe(403);
      await expect(res.json()).resolves.toEqual({ message: "Registration is closed" });
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe("受付が有効 (REGISTRATION_ENABLED=true)", () => {
    beforeEach(() => {
      vi.stubEnv("REGISTRATION_ENABLED", "true");
    });

    it("不正なメールは 400 を返し外部 API を呼ばない", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const res = await POST(postRequest({ ...validBody, email: "invalid" }));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ message: "Invalid email address" });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("不正な phone(記号含む) は 400 を返す", async () => {
      const res = await POST(postRequest({ ...validBody, phone: "090-1234-5678" }));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ message: "Invalid phone address" });
    });

    it("firstName 未入力は 400 を返し外部 API を呼ばない", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const { firstName: _firstName, ...noFirstName } = validBody;
      const res = await POST(postRequest(noFirstName));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ message: "You must enter your first name to continue" });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("lastName 未入力は 400 を返し外部 API を呼ばない", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const { lastName: _lastName, ...noLastName } = validBody;
      const res = await POST(postRequest(noLastName));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ message: "You must enter your last name to continue" });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("有効な入力では外部 API の結果(ok)を 200 で返す", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));
      const res = await POST(postRequest(validBody));
      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual({ message: "ok" });
    });

    it("外部 API がエラーメッセージを返したら 400 で中継する", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ message: "duplicated" }), { status: 200 }),
      );
      const res = await POST(postRequest(validBody));
      expect(res.status).toBe(400);
      await expect(res.json()).resolves.toEqual({ message: "duplicated" });
    });

    it("バリデーション通過後は Google Apps Script へ検証済みボディを転送する", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

      await POST(postRequest(validBody));

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, init] = fetchSpy.mock.calls[0];
      expect(String(url)).toContain("script.google.com");
      expect(init?.method).toBe("POST");
      expect(JSON.parse(String(init?.body))).toMatchObject({
        email: "taro@example.com",
        firstName: "Taro",
        lastName: "Yamada",
      });
    });

    it("address 未指定時は空文字として転送する", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

      const { address: _address, ...withoutAddress } = validBody;
      await POST(postRequest(withoutAddress));

      const body = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
      expect(body.address).toBe("");
    });

    it("email が空の場合はメール検証をスキップして外部 API を呼ぶ", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

      const res = await POST(postRequest({ ...validBody, email: "" }));

      expect(res.status).toBe(200);
      expect(fetchSpy).toHaveBeenCalledOnce();
    });

    it("外部 API が落ちた場合は例外が伝播する (現状はハンドリングしていない)", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
      await expect(POST(postRequest(validBody))).rejects.toThrow("network down");
    });
  });
});
