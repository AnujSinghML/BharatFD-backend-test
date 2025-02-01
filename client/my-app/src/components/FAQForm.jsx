import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import RichTextEditor from './RichTextEditor';

const fetchFAQ = async (id) => {
  const { data } = await axios.get(`/api/faqs/${id}`);
  return data;
};

export default function FAQForm({ initialData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');

  const { data: fetchedFAQ } = useQuery({
    queryKey: ['faq', id],
    queryFn: () => fetchFAQ(id),
    enabled: !!id,
  });

  const faqData = fetchedFAQ || initialData;

  const [questionEn, setQuestionEn] = useState(faqData?.question_en || '');
  const [questionHi, setQuestionHi] = useState(faqData?.question_hi || '');
  const [questionBn, setQuestionBn] = useState(faqData?.question_bn || '');
  const [answerEn, setAnswerEn] = useState(faqData?.answer_en || '');
  const [answerHi, setAnswerHi] = useState(faqData?.answer_hi || '');
  const [answerBn, setAnswerBn] = useState(faqData?.answer_bn || '');

  const createMutation = useMutation({
    mutationFn: async (newFAQ) => {
      try {
        console.log('Submitting FAQ data:', newFAQ);
        const response = await axios.post('/api/faqs', newFAQ);
        console.log('Server response:', response);
        return response.data;
      } catch (error) {
        console.error('Server error response:', error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      navigate('/');
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Failed to create FAQ. Please try again.');
      console.error('Detailed error:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        console.log('Updating FAQ data:', { id, data });
        const response = await axios.put(`/api/faqs/${id}`, data);
        console.log('Server response:', response);
        return response.data;
      } catch (error) {
        console.error('Server error response:', error.response?.data);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      navigate('/');
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'Failed to update FAQ. Please try again.');
      console.error('Detailed error:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const payload = {
      question: {
        en: questionEn.trim(),
        hi: questionHi.trim(),
        bn: questionBn.trim()
      },
      answer: {
        en: answerEn.trim(),
        hi: answerHi.trim(),
        bn: answerBn.trim()
      }
    };
    

    console.log('Preparing to submit payload:', payload);

    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
      console.error('Submission error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl p-4">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">English</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            type="text"
            value={questionEn}
            onChange={(e) => setQuestionEn(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <textarea
            value={answerEn}
            onChange={(e) => setAnswerEn(e.target.value)}
            className="w-full p-2 border rounded min-h-[150px]"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Hindi</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            type="text"
            value={questionHi}
            onChange={(e) => setQuestionHi(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <textarea
            value={answerHi}
            onChange={(e) => setAnswerHi(e.target.value)}
            className="w-full p-2 border rounded min-h-[150px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Bengali</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            type="text"
            value={questionBn}
            onChange={(e) => setQuestionBn(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <textarea
            value={answerBn}
            onChange={(e) => setAnswerBn(e.target.value)}
            className="w-full p-2 border rounded min-h-[150px]"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : (id ? 'Update FAQ' : 'Create FAQ')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

FAQForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    question_en: PropTypes.string,
    question_hi: PropTypes.string,
    question_bn: PropTypes.string,
    answer_en: PropTypes.string,
    answer_hi: PropTypes.string,
    answer_bn: PropTypes.string,
  }),
};

FAQForm.defaultProps = {
  initialData: null,
};
