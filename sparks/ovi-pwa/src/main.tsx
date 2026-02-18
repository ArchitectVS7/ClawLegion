import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register service worker (handled by vite-plugin-pwa)
if ("serviceWorker" in navigator) {
  // vite-plugin-pwa handles SW registration automatically
  // This is just a log hook
  navigator.serviceWorker.ready.then((registration) => {
    console.log("[OVI] Service worker ready:", registration.scope);
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
