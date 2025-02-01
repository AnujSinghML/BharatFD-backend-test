
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const fetchFAQs = async () => {
  try {
    const response = await axios.get('/api/faqs');
    console.log('API Response:', response);
    console.log('Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export default function FAQList() {
  const { data: faqs, isLoading, error } = useQuery({
    queryKey: ['faqs'],
    queryFn: fetchFAQs
  });

  console.log('FAQs in component:', faqs);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading FAQs: {error.message}</div>;
  
  // Ensure faqs is an array and has items
  const faqList = Array.isArray(faqs) ? faqs : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage FAQs</h1>
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New FAQ
        </Link>
      </div>
      
      <div className="space-y-3">
        {faqList.length === 0 ? (
          <div className="text-gray-500">No FAQs available. API response: {JSON.stringify(faqs)}</div>
        ) : (
          faqList.map(faq => (
            <div key={faq.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              <div className="mt-2 flex space-x-2">
                <Link 
                  to={`/edit/${faq.id}`}
                  className="text-sm bg-gray-100 px-2 py-1 rounded"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}