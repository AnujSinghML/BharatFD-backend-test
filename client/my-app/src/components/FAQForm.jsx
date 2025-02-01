import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import RichTextEditor from './RichTextEditor';
export default function FAQForm({ initialData }) {
// Initialize state using initialData if available, otherwise default to empty strings.
const [question, setQuestion] = useState(initialData?.question?.en || '');
const [answer, setAnswer] = useState(initialData?.answer?.en || '');
const navigate = useNavigate();
// Handle form submission.
const handleSubmit = async (e) => {
e.preventDefault();

// Build the payload with current state values.
const payload = {
  question: question,
  answer: answer
};

try {
  // If initialData exists, update the existing FAQ; otherwise, create a new one.
  if (initialData) {
    await axios.put(`/api/faqs/${initialData.id}`, payload);
  } else {
    await axios.post('/api/faqs', payload);
  }
  navigate('/');
} catch (err) {
  console.error('Submission error:', err);
}
};
return (
<form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
<div>
<label className="block text-sm font-medium mb-1">Question (English)</label>
<input
type="text"
value={question}
onChange={(e) => setQuestion(e.target.value)}
className="w-full p-2 border rounded"
required
/>
</div>

  <div>
    <label className="block text-sm font-medium mb-1">Answer (English)</label>
    <RichTextEditor value={answer} onChange={setAnswer} />
  </div>

  <button
    type="submit"
    className="bg-green-500 text-white px-4 py-2 rounded"
  >
    {initialData ? 'Update FAQ' : 'Create FAQ'}
  </button>
</form>
);
}
// PropTypes validation for FAQForm props
FAQForm.propTypes = {
initialData: PropTypes.shape({
id: PropTypes.oneOfType([
PropTypes.string,
PropTypes.number
]),
question: PropTypes.shape({
en: PropTypes.string,
hi: PropTypes.string,
bn: PropTypes.string,
}),
answer: PropTypes.shape({
en: PropTypes.string,
hi: PropTypes.string,
bn: PropTypes.string,
}),
}),
};
// Default props for FAQForm if initialData is not provided.
FAQForm.defaultProps = {
initialData: null,
};