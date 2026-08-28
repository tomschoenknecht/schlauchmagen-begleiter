import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/outfit";
import "./index.css";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getToken } from "@/hooks/useAuth";

setAuthTokenGetter(async () => getToken());

createRoot(document.getElementById("root")!).render(<App />);
