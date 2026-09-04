import { describe, it, expect, beforeEach } from "vitest";
import tokenService from "./tokenService";

function makeToken(payload: object) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe("tokenService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no token is stored", () => {
    expect(tokenService.getToken()).toBeNull();
  });

  it("returns the token when it is valid and not expired", () => {
    const token = makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem("token", token);
    expect(tokenService.getToken()).toBe(token);
  });

  it("returns null and removes the token when it is expired", () => {
    const token = makeToken({ exp: Math.floor(Date.now() / 1000) - 3600 });
    localStorage.setItem("token", token);
    expect(tokenService.getToken()).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});