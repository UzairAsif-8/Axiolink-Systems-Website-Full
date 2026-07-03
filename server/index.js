import express from "express";
import cors from "cors";
import certificateRoutes from "./routes/certificate.js";
import enrollRoutes from "./routes/enroll.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/certificate", certificateRoutes);
app.use("/api/enroll", enrollRoutes);

app.listen(PORT, () => {
  console.log(`Certificate API running on http://localhost:${PORT}`);
});
