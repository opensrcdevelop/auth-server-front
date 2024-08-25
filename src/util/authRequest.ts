import Request from "./http";

const request = new Request({
  // 认证服务地址
  baseURL: import.meta.env.VITE_OAUTH_ISSUER,
  timeout: 60 * 1000,
  withCredentials: true,
});

export default request;
