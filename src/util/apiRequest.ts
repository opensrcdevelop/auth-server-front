import Request from "./http";

const apiRequest = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URI,
  timeout: 60 * 1000,
  withCredentials: true,
});

export default apiRequest;
