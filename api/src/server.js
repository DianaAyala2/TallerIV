import express from "express";
import cors from "cors";
import { integrantes } from "./data.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "El API está funcionando correctamente"
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    ok: true,
    integrantes
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});