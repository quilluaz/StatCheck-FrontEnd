import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Buffer } from "buffer";
import process from "process";
import util from "util";

window.process = process;
window.Buffer = Buffer;
window.util = util;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
