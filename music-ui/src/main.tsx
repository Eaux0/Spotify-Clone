import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainPage from "./MainPage";
import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainPage />
  </StrictMode>
);
