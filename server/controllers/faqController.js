// /* server/controllers/faqController.js */
import FAQ from '../models/FAQ.js';
import { translateFAQ } from '../services/translation.js';
import { redis } from '../src/cache.js';

// GET all FAQs with optional language selection (?lang=)
export const getFAQs = async (req, res) => {
  try {
    // Default to English if no lang parameter is provided
    const { lang = 'en' } = req.query;
    const faqs = await FAQ.find();
    // Map each FAQ to return only the desired language (fallback to English)
    const translatedFAQs = faqs.map((faq) => ({
      id: faq._id,
      ...faq.getTranslated(lang),
      createdAt: faq.createdAt,
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
    // 1. Save the FAQ using only the English values.
    const faq = new FAQ({
      question: { en: question },
      answer: { en: answer },
    });
    const savedFAQ = await faq.save();

    // 2. Define a unique Redis cache key for this FAQ's translations.
    const cacheKey = `faq:${savedFAQ._id}:translations`;

    let translations;
    // 3. Try to retrieve cached translations from Redis
    const cachedTranslations = await redis.get(cacheKey);
    if (cachedTranslations) {
      translations = JSON.parse(cachedTranslations);
      console.log(`Translations retrieved from Redis for FAQ ${savedFAQ._id}`);
    } else {
      // 4. If not cached, generate translations for Hindi and Bengali
      translations = await translateFAQ(savedFAQ, ['hi', 'bn']);
      console.log(`Translations generated from API for FAQ ${savedFAQ._id}`);
      // 5. Cache the generated translations in Redis for 15 minutes (900 seconds)
      await redis.set(cacheKey, JSON.stringify(translations), 'EX', 900);
    }

    // 6. Merge the translations with the original English content and update the FAQ document.
    //    Note: This update happens regardless of whether the translations came from cache or were just generated.
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      savedFAQ._id,
      {
        question: { ...savedFAQ.question, ...translations.question },
        answer: { ...savedFAQ.answer, ...translations.answer },
      },
      { new: true } // Return the updated document.
    );

    // 7. Return the updated FAQ in the response.
    res.status(201).json(updatedFAQ);
  } catch (err) {
    console.error('Error creating FAQ:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
