import { describe, it, expect } from "vitest";
import { normalizeUrl } from "./url";

describe("normalizeUrl", () => {
  it("adds https:// when the protocol is missing", () => {
    const result = normalizeUrl("example.com");

    expect(result).toEqual({
      ok: true,
      value: { url: "https://example.com", hostname: "example.com" },
    });
  });

  it("rejects localhost", () => {
    const result = normalizeUrl("localhost:3000");

    expect(result.ok).toBe(false);
  });

  it("removes spaces around the address", () => {
    const result = normalizeUrl("  example.com  ");

    expect(result).toEqual({
      ok: true,
      value: { url: "https://example.com", hostname: "example.com" },
    });
  });

  it("removes www. and the trailing slash", () => {
    const result = normalizeUrl("http://www.example.com/");

    expect(result).toEqual({
      ok: true,
      value: { url: "https://example.com", hostname: "example.com" },
    });
  });

  it("rejects private IP addresses", () => {
    const result = normalizeUrl("192.168.0.1");

    expect(result.ok).toBe(false);
  });
});
