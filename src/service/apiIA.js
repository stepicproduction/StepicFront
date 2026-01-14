import axios from "axios";

const iaInstance = axios.create({
  baseURL: "https://stepic-back.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  }
});

export const sendToIA = (data) =>
  iaInstance.post("chat-assistant/", data);
