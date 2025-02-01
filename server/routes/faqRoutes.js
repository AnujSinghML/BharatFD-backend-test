import { Router } from 'express';
import { getFAQs, createFAQ } from '../controllers/faqController.js';

const router = Router();

router.get('/', getFAQs); // GET all FAQs
router.post('/', createFAQ); // POST a new FAQ

export default router;
