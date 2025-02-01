const mongoose = require('mongoose');

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

// Translation method
faqSchema.methods.getTranslated = function (lang = 'en') {
  return {
    question: this.question[lang] || this.question.en,
    answer: this.answer[lang] || this.answer.en,
  };
};

module.exports = mongoose.model('FAQ', faqSchema);
