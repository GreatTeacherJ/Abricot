import express from "express";
import { generateProjectEmbeddings } from "../controllers/embeddingController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/:projectId", authenticateToken, generateProjectEmbeddings);

export default router;
