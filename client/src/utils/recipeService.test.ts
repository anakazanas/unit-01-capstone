import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import recipeService from "./recipeService";

vi.mock("axios");

function makeToken(payload: object) {
  const header = btoa(JSON.stringify({ alg: "none" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe("recipeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("getAll calls GET /api/recipes with query params", async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] });
    await recipeService.getAll({ title: "soup" });
    expect(axios.get).toHaveBeenCalledWith("/api/recipes", { params: { title: "soup" } });
  });

  it("create sends the Authorization header with the stored token", async () => {
    const token = makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem("token", token);
    vi.mocked(axios.post).mockResolvedValueOnce({ data: {} });

    await recipeService.create({ title: "Soup" });

    expect(axios.post).toHaveBeenCalledWith(
      "/api/recipes",
      { title: "Soup" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  });

  it("delete calls DELETE /api/recipes/:id with auth header", async () => {
    const token = makeToken({ exp: Math.floor(Date.now() / 1000) + 3600 });
    localStorage.setItem("token", token);
    vi.mocked(axios.delete).mockResolvedValueOnce({ data: {} });

    await recipeService.delete("recipe1");

    expect(axios.delete).toHaveBeenCalledWith("/api/recipes/recipe1", {
      headers: { Authorization: `Bearer ${token}` },
    });
  });
});