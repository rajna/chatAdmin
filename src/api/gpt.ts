import axios from "axios";
//import { useSnackbarStore } from "@/stores/snackbarStore";
////const snackbarStore = useSnackbarStore();
// change the access key to your own
//const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const instance = axios.create({
  baseURL: "/api",
  timeout: 60000,
  //headers: { Authorization: "Client-ID" + " " + ACCESS_KEY },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      //const status = error.response.status;
      //const data = error.response.data;
      //snackbarStore.showErrorMessage(data.errors[0]);
    } else {
      //snackbarStore.showErrorMessage("Network Error");
    }
    return Promise.reject(error);
  }
);

interface Params {
  messages?: string;
}

// 提问
export const postQaApi = (data: Params) => {
  return instance.post("/api/chatgpt",data);
};

