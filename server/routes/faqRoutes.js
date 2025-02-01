// server/routes/faqRoutes.js
import { Router } from 'express';
import { getFAQs, createFAQ } from '../controllers/faqController.js';

const router = Router();

router.get('/', getFAQs);      // GET all FAQs; supports ?lang= query param
router.post('/', createFAQ);     // POST a new FAQ (triggers translation and caching)

export default router;
