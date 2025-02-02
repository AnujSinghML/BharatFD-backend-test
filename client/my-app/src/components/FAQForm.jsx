import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PropTypes from 'prop-types';

const fetchFAQ = async (id) => {
  const { data } = await axios.get(`/api/faqs/${id}`);
  return data;
};

export default function FAQForm({ initialData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch FAQ data if editing
  const { data: fetchedFAQ } = useQuery({
    queryKey: ['faq', id],
    queryFn: () => fetchFAQ(id),
    enabled: !!id,
  });
  const faqData = fetchedFAQ || initialData;

  // State for English inputs
  const [questionEn, setQuestionEn] = useState(faqData?.question?.en || '');
  const [answerEn, setAnswerEn] = useState(faqData?.answer?.en || '');

  // Create mutation
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
    },
  });

  // Update mutation
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
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const payload = {
      question: { en: questionEn.trim() }, // Only sending English question
      answer: { en: answerEn.trim() }, // Only sending English answer
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
      console.error('Error details:', { status: error.response?.status, data: error.response?.data, headers: error.response?.headers });
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl p-4">
      {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      
      {/* English Inputs */}
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
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={isSubmitting}
      >
        {id ? 'Update FAQ' : 'Create FAQ'}
      </button>
    </form>
  );
}

FAQForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    question: PropTypes.shape({
      en: PropTypes.string,
    }),
    answer: PropTypes.shape({
      en: PropTypes.string,
    }),
  }),
};

FAQForm.defaultProps = {
  initialData: null,
};
