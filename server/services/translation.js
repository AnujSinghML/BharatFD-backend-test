import translate from '@vitalets/google-translate-api';

const SUPPORTED_LANGS = ['en', 'hi', 'bn'];

export const translateFAQ = async (faq, targetLang) => {
  if (!SUPPORTED_LANGS.includes(targetLang)) return faq;

  try {
    const [questionRes, answerRes] = await Promise.all([
      translate(faq.question.en, { to: targetLang }),
      translate(faq.answer.en, { to: targetLang }),
    ]);

    return {
      question: { ...faq.question, [targetLang]: questionRes.text },
      answer: { ...faq.answer, [targetLang]: answerRes.text },
      createdAt: faq.createdAt,
    };
  } catch (err) {
    console.error('Translation failed:', err);
    return faq; // Fallback to English
  }
};
