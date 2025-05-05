import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './ViewPage.css';

export default function DetailPage({ type }: { type: 'view' | 'collected' }) {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (id) {
      supabase
        .from('lost_items')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (error) console.error('Fetch error:', error);
          else {
            setItem(data);
            if (data?.collected_by) setStudentName(data.collected_by);
            if (data?.collector_id) setStudentId(data.collector_id);
            if (data?.returned_at) setReturnDate(data.returned_at.slice(0, 10));
          }
        });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('lost_items')
      .update({
        collected_by: studentName,
        collector_id: studentId,
        returned_at: returnDate,
      })
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
      setStatus('Update failed.');
    } else {
      setStatus('Item updated successfully!');
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="detail-container">
      <h2>{item.title}</h2>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Found at:</strong> {item.location_found}</p>
      <p><strong>Reported on:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
      {item.image_url && <img src={item.image_url} alt="Lost item" className="detail-image" />}

      {type === 'collected' && (
        <form className="collected-info" onSubmit={handleSubmit}>
          <h3>Mark as Returned</h3>
          <label>
            Student Name:
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </label>
          <label>
            Student ID:
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </label>
          <label>
            Return Date:
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Update Item</button>
          {status && <p className="status">{status}</p>}
        </form>
      )}
    </div>
  );
}
