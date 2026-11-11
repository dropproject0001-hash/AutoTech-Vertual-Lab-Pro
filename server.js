"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vite_1 = require("vite");
const imageAnalysisProvider_1 = require("./src/server/services/imageAnalysisProvider");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function startServer() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json({ limit: '10mb' })); // For base64 images
    const vite = await (0, vite_1.createServer)({
        server: { middlewareMode: true },
        appType: 'custom'
    });
    app.use(vite.middlewares);
    // API Routes
    app.post('/api/autoelectric/analyze-schematic', async (req, res) => {
        try {
            const { imageBase64, documentName, documentType, regionBox } = req.body;
            if (!imageBase64 || !documentName || !documentType) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const provider = (0, imageAnalysisProvider_1.getImageAnalysisProvider)();
            const result = await provider.analyzeImage({
                imageBase64,
                documentName,
                documentType,
                regionBox
            });
            res.json({
                status: "SUCCESS",
                analysis: result,
                model: result.model
            });
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Analysis failed' });
        }
    });
    app.get('/api/autoelectric/health', (req, res) => {
        const provider = process.env.IMAGE_ANALYSIS_PROVIDER || 'manual';
        const hasKey = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
        res.json({
            status: "ONLINE",
            serviceMode: provider === 'manual' ? 'MANUAL_REVIEW' : 'AI_IMAGE_ANALYSIS',
            hasApiKey: hasKey,
            imageAnalysisProvider: provider
        });
    });
    app.listen(3000, () => console.log('Server running on port 3000'));
}
startServer();
