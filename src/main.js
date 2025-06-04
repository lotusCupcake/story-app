import { router } from "./routes/router.js";
import "./assets/style.css";

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
