import dotenv from 'dotenv';
const result = dotenv.config();
console.log('dotenv result:', result);
console.log('ADMIN_PASSWORD from env:', process.env.ADMIN_PASSWORD);

import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import accessCodeRoutes from "./routes/access-code.js";
import adminRoutes from "./routes/admin.js";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount access code routes
  app.use("/api", accessCodeRoutes);
  app.use("/api/admin", adminRoutes);

  // API endpoint for generating custom topic stances
  // MUST be before static file serving
  app.post("/api/generate-stances", async (req, res) => {
    try {
      const { topic } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      console.log(`[API] Generating stances for topic: ${topic}`);

      // Call Python script to generate stances
      // In development: server/index.ts -> ../generate_custom_topic_stances.py
      const scriptPath = path.resolve(__dirname, "..", "generate_custom_topic_stances.py");
      console.log(`[API] Script path: ${scriptPath}`);
      
      const command = `python3.11 "${scriptPath}" "${topic}"`;
      console.log(`[API] Executing: ${command}`);
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.error(`[API] Python stderr: ${stderr}`);
      }
      
      console.log(`[API] Python stdout: ${stdout}`);
      
      const result = JSON.parse(stdout);
      console.log(`[API] Parsed result:`, result);
      
      res.json(result);
    } catch (error) {
      console.error("[API] Error generating stances:", error);
      res.status(500).json({ error: "Failed to generate stances", details: error.message });
    }
  });

  // Serve static files from dist/public in production
  // Static files are always in dist/public after build
  const staticPath = path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  // This MUST be last
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
