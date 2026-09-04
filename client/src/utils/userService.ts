import axios from "axios";
import tokenService from "./tokenService";
import type { User } from "../shared.types";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/users/`;

async function getProfile() {
  const token = tokenService.getToken();
  const response = await axios.get(BASE_URL + "profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

async function updateProfile(updates: { email?: string; password?: string }) {
  const token = tokenService.getToken();
  try {
    const response = await axios.put(BASE_URL + "profile", updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem("token", response.data.token);
    return getUser();
  } catch (err: any) {
    throw new Error(err.response?.data?.err || "Something went wrong");
  }
}

async function deleteAccount() {
  const token = tokenService.getToken();
  await axios.delete(BASE_URL + "profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  logout();
}

async function signup(userData: { email: string; password: string }) {
  return fetchData("signup", userData);
}

async function login(userData: { email: string; password: string }) {
  return fetchData("login", userData);
}

async function fetchData(endpoint: string, userData: object) {
  try {
    const response = await axios.post(BASE_URL + endpoint, userData);
    localStorage.setItem("token", response.data.token);
    return getUser();
  } catch (err: any) {
    const message = err.response?.data?.err || err.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
}

function getUser(): User | null {
  const token = tokenService.getToken();
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.user ?? payload;
}

function logout() {
  localStorage.removeItem("token");
}

export default { signup, login, getUser, logout, getProfile, updateProfile, deleteAccount };