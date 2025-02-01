import { translate } from '@vitalets/google-translate-api';

// translateFAQ accepts an FAQ document and an array of target languages (excluding 'en')
export const translateFAQ = async (faq, targetLangs = []) => {
  try {
    const translations = { question: {}, answer: {} };

    for (const lang of targetLangs) {
      // Translate the English question and answer concurrently
      const [qRes, aRes] = await Promise.all([
        translate(faq.question.en, { to: lang }),
        translate(faq.answer.en, { to: lang }),
      ]);
      translations.question[lang] = qRes.text;
      translations.answer[lang] = aRes.text;
    }
    return translations;
  } catch (err) {
    console.error('Translation failed:', err);
    // On failure, return an empty translation object (caller will merge with the original English)
    return { question: {}, answer: {} };
  }
};
