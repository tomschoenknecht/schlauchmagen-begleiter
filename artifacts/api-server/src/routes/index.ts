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
import billingRouter from "./billing";
import { requireAuth } from "../middleware/auth";
import { requireTier } from "../middleware/requireTier";

const router: IRouter = Router();

// Öffentliche Routen (kein Auth nötig)
router.use(healthRouter);
router.use(authRouter);

// Alle folgenden Routen brauchen einen gültigen JWT
router.use(requireAuth);

// Kostenlos (auch nötig, um überhaupt kaufen zu können)
router.use(billingRouter);
router.use(requirementsRouter);
router.use(statsRouter);
router.use(assessmentRouter);
router.use(profileRouter);

// Basis+ (Tracker/Dokumentation)
router.use(requireTier("basis"), appointmentsRouter);
router.use(requireTier("basis"), journalRouter);
router.use(requireTier("basis"), weightRouter);

// Deluxe (KI-Begleiter)
router.use(requireTier("deluxe"), openaiRouter);
router.use(requireTier("deluxe"), didRouter);
router.use(requireTier("deluxe"), elevenlabsRouter);

export default router;
