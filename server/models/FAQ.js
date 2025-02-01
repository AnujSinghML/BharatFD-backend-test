// server/models/FAQ.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    en: { type: String, required: true },
    hi: String,
    bn: String,
  },
  answer: {
    en: { type: String, required: true },
    hi: String,
    bn: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Instance method: returns translated version dynamically (fallback to 'en')
faqSchema.methods.getTranslated = function (lang = 'en') {
  return {
    question: this.question[lang] || this.question.en,
    answer: this.answer[lang] || this.answer.en,
  };
};

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
