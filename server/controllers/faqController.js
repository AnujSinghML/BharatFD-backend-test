import FAQ from '../models/FAQ.js';
import { translateFAQ } from '../services/translation.js';
import { redis } from '../src/cache.js';

// GET all FAQs with optional language selection (?lang=)
export const getFAQs = async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const faqs = await FAQ.find();
    const translatedFAQs = faqs.map((faq) => ({
      id: faq._id,
      ...faq.getTranslated(lang),
      createdAt: faq.createdAt
    }));
    res.status(200).json(translatedFAQs);
  } catch (err) {
    console.error('Error fetching FAQs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new FAQ with translation and Redis caching integration
export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    // Save FAQ with only English version initially
    const faq = new FAQ({
      question: { en: question },
      answer: { en: answer },
    });
    const savedFAQ = await faq.save();

    // Define a cache key based on the FAQ ID
    const cacheKey = `faq:${savedFAQ._id}:translations`;

    // Check Redis for cached translations
    let cachedTranslations = await redis.get(cacheKey);
    let translations;
    if (cachedTranslations) {
      translations = JSON.parse(cachedTranslations);
      console.log(`Translations retrieved from Redis for FAQ ${savedFAQ._id}`);
    } else {
      // Generate translations for Hindi and Bengali
      translations = await translateFAQ(savedFAQ, ['hi', 'bn']);
      console.log(`Translations generated from API for FAQ ${savedFAQ._id}`);
      // Cache the translations for 15 minutes (900 seconds)
      await redis.set(cacheKey, JSON.stringify(translations), 'EX', 900);
    }

    // Merge the translations with the savedFAQ content
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      savedFAQ._id,
      {
        question: { ...savedFAQ.question, ...translations.question },
        answer: { ...savedFAQ.answer, ...translations.answer },
      },
      { new: true }
    );

    res.status(201).json(updatedFAQ);
  } catch (err) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
