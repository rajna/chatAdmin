import { defineStore } from "pinia";

export const useChatGPTStore = defineStore({
  id: "chatGPT",
  state: () => ({
    propmpt: "CREATE TABLE IF NOT EXISTS 'users' ('id' INT NOT NULL AUTO_INCREMENT,'username' VARCHAR(50) NOT NULL,'password' VARCHAR(50) NOT NULL,'email' VARCHAR(100),'create_time' DATETIME DEFAULT CURRENT_TIMESTAMP,'update_time' DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,PRIMARY KEY ('id'),UNIQUE KEY 'username_UNIQUE' ('username'),UNIQUE KEY 'email_UNIQUE' ('email')) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;这是我的数据库中户表的创建方式",
    configDialog: false,
    apiKey: "",
    proxyUrl: "https://api.openai-proxy.com",
    model: "gpt-4-turbo-2024-04-09",
  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ["propmpt", "apiKey", "proxyUrl", "model"] }],
  },

  getters: {
    // If you have set up an API key, please use your own key. If not, please use the one I provided.
    // getApiKey: (state) => state.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    getApiKey: (state) => state.apiKey,
  },
  actions: {
    updatePropmpt() { },
    updateModel(model: string) {
      this.model = model;
    },
  },
});
