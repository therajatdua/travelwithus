/* ============================================================
   Route: /api/chat
   ============================================================ */

import { Router } from "express";
import { chatWithAI } from "../controllers/chat";

const router = Router();

router.post("/", chatWithAI);

export default router;
