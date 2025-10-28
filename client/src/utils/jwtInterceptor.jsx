import axios from "axios";

function jwtInterceptor() {
  // Set global API base URL once for all axios requests
  const defaultBaseUrl = "https://my-personal-blog-project-lsig.vercel.app";
  axios.defaults.baseURL = import.meta?.env?.VITE_API_BASE_URL || defaultBaseUrl;

  axios.interceptors.request.use((req) => {
    const hasToken = Boolean(window.localStorage.getItem("token"));

    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }

    return req;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error.includes("Unauthorized")
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;

