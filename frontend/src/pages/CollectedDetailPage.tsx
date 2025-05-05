import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './ReportPage.css';

function CollectedDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function fetchItem() {
      const { data, error } = await supabase
        .from('lost_items')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setItem(data);
      else console.error('Fetch error:', error);
    }

    fetchItem();
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <button onClick={() => navigate('/collected')} className="back-button">← Back to List</button>
      <h2>{item.title}</h2>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Found at:</strong> {item.location_found}</p>
      <p><strong>Reported on:</strong> {new Date(item.created_at).toLocaleDateString()}</p>

      <p><strong>Collected by:</strong> {item.collected_by_name || '(Not Available)'}</p>
      <p><strong>ID:</strong> {item.collected_by_id || '(Not Available)'}</p>
      <p><strong>Returned on:</strong> {item.return_date ? new Date(item.return_date).toLocaleDateString() : '(Not Available)'}</p>

      {item.image_url && (
        <img src={item.image_url} alt="Lost item" className="preview-image" />
      )}
    </div>
  );
}

export default CollectedDetailPage;
