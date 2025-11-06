import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const plugins = [
  react(), 
  // Custom plugin to handle API routes
  {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/generate-stances' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              const { topic } = JSON.parse(body);
              
              if (!topic) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Topic is required' }));
                return;
              }

              console.log(`[API] Generating stances for topic: ${topic}`);

              // Call Python script
              const scriptPath = path.resolve(import.meta.dirname, 'generate_custom_topic_stances.py');
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
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (error) {
              console.error('[API] Error generating stances:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to generate stances', details: error.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  }
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
