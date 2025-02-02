import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",  // Base URL for all requests
  withCredentials: true,             // Allows credentials like cookies
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
  });
};
