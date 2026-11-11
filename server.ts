import express from 'express';
import { createServer as createViteServer } from 'vite';
import { getImageAnalysisProvider } from './src/server/services/imageAnalysisProvider';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

dotenv.config();

const rootDir = process.cwd();

async function startServer() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post('/api/autoelectric/analyze-schematic', async (req, res) => {
    try {
      const { imageBase64, documentName, documentType, regionBox } = req.body;
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid imageBase64 payload' });
      }
      if (!documentName || typeof documentName !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid documentName' });
      }
      if (!documentType || typeof documentType !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid documentType' });
      }

      // Check decoded size limit (max 8MB)
      const approxBytes = Math.ceil((imageBase64.length * 3) / 4);
      if (approxBytes > 8 * 1024 * 1024) {
        return res.status(413).json({ error: 'Payload exceeds maximum 8MB size limit' });
      }

      const provider = getImageAnalysisProvider();
      const result = await provider.analyzeImage({
        imageBase64,
        documentName,
        documentType,
        regionBox,
      });

      res.json({
        status: 'SUCCESS',
        analysis: result,
        model: result.model,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed';
      console.error('Schematic analysis error:', msg);
      res.status(500).json({ error: 'Image analysis service failure. Manual review remains available.' });
    }
  });

  app.get('/api/autoelectric/health', (_req, res) => {
    const provider = process.env.IMAGE_ANALYSIS_PROVIDER || 'manual';
    const hasKey = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
    res.json({
      status: 'ONLINE',
      serviceMode: provider === 'manual' ? 'MANUAL_REVIEW' : 'AI_IMAGE_ANALYSIS',
      hasApiKey: hasKey,
      imageAnalysisProvider: provider,
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProduction) {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    // Serve HTML with Vite dev transform for HMR & script loading
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(rootDir, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));

    app.use('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Autoelectric Lab server listening on http://0.0.0.0:${port} [${isProduction ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
