import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const fetchFAQs = async () => {
  const { data } = await axios.get('/api/faqs');
  return data;
};

export default function FAQList() {
  const { data: faqs, isLoading } = useQuery('faqs', fetchFAQs);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage FAQs</h1>
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add New FAQ
        </Link>
      </div>
      
      <div className="space-y-3">
        {faqs.map(faq => (
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
        ))}
      </div>
    </div>
  );
}
  