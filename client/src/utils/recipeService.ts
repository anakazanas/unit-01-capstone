import axios from "axios";
import tokenService from "./tokenService";

const BASE_URL = "/api/recipes";

function authHeaders() {
  const token = tokenService.getToken();
  return { Authorization: `Bearer ${token}` };
}

async function getAll(query: { title?: string; tag?: string; ingredient?: string } = {}) {
  const response = await axios.get(BASE_URL, { params: query });
  return response.data;
}

async function getOne(id: string) {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
}

async function create(recipeData: object) {
  const response = await axios.post(BASE_URL, recipeData, { headers: authHeaders() });
  return response.data;
}

async function update(id: string, recipeData: object) {
  const response = await axios.put(`${BASE_URL}/${id}`, recipeData, { headers: authHeaders() });
  return response.data;
}

async function deleteRecipe(id: string) {
  const response = await axios.delete(`${BASE_URL}/${id}`, { headers: authHeaders() });
  return response.data;
}

export default { getAll, getOne, create, update, delete: deleteRecipe };