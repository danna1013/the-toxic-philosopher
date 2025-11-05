import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());

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
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

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
