import FAQ from '../models/FAQ.js';
import { translateFAQ } from '../services/translation.js';
import { redis } from '../src/cache.js';

const CACHE_EXPIRATION = 3600; // 1 hour

export const getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;

    // Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    // Get from DB
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    
    // Translate and format
    const translatedFAQs = faqs.map(faq => ({
      id: faq._id,
      question: faq.question[lang] || faq.question.en,
      answer: faq.answer[lang] || faq.answer.en
    }));

    // Cache results
    await redis.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(translatedFAQs));

    res.json(translatedFAQs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    // Create base FAQ
    const newFAQ = new FAQ({
      question: { en: question },
      answer: { en: answer }
    });

    // Save to DB
    const savedFAQ = await newFAQ.save();

    // Background translation
    ['hi', 'bn'].forEach(async (lang) => {
      const translated = await translateFAQ(savedFAQ.toObject(), lang);
      await FAQ.findByIdAndUpdate(savedFAQ._id, translated);
    });

    res.status(201).json(savedFAQ);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};