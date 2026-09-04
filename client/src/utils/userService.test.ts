import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import userService from "./userService";

vi.mock("axios");

function makeToken(payload: object) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe("userService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("signup stores the token and returns the decoded user", async () => {
    const fakeUser = { _id: "1", email: "test@test.com" };
    const token = makeToken({ user: fakeUser, exp: Math.floor(Date.now() / 1000) + 3600 });
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { token } });

    const result = await userService.signup({ email: "test@test.com", password: "pw" });

    expect(axios.post).toHaveBeenCalledWith("/api/users/signup", { email: "test@test.com", password: "pw" });
    expect(localStorage.getItem("token")).toBe(token);
    expect(result).toEqual(fakeUser);
  });

  it("login throws with the server's error message on failure", async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: { data: { err: "bad credentials" } },
    });

    await expect(userService.login({ email: "x@x.com", password: "wrong" })).rejects.toThrow("bad credentials");
  });

  it("getUser returns null when there is no token", () => {
    expect(userService.getUser()).toBeNull();
  });

  it("logout removes the token from localStorage", () => {
    localStorage.setItem("token", "some-token");
    userService.logout();
    expect(localStorage.getItem("token")).toBeNull();
  });
});