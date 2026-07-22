import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { authRouter } from "./auth";
import requirementsRouter from "./requirements";
import journalRouter from "./journal";
import appointmentsRouter from "./appointments";
import weightRouter from "./weight";
import statsRouter from "./stats";
import assessmentRouter from "./assessment";
import openaiRouter from "./openai/index";
import didRouter from "./did/index";
import elevenlabsRouter from "./elevenlabs/index";
import profileRouter from "./profile";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

// Öffentliche Routen (kein Auth nötig)
router.use(healthRouter);
router.use(authRouter);

// Alle folgenden Routen brauchen einen gültigen JWT
router.use(requireAuth);
router.use(requirementsRouter);
router.use(journalRouter);
router.use(appointmentsRouter);
router.use(weightRouter);
router.use(statsRouter);
router.use(assessmentRouter);
router.use(openaiRouter);
router.use(didRouter);
router.use(elevenlabsRouter);
router.use(profileRouter);

export default router;
