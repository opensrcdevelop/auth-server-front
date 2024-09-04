import Request from "./http";
import { getOAuthIssuer } from "./tool";

const apiRequest = new Request({
  baseURL: `${getOAuthIssuer()}${import.meta.env.VITE_API_BASE_URI}`,
  timeout: 60 * 1000,
  withCredentials: true,
});

export default apiRequest;
