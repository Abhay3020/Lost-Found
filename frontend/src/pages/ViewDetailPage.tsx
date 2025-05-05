import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './ReportPage.css';

function ViewDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    student_name: '',
    student_id: '',
    return_date: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { student_name, student_id, return_date } = formData;

    const { error } = await supabase
      .from('lost_items')
      .update({
        is_collected: true,
        collected_by_name: student_name,
        collected_by_id: student_id,
        return_date: return_date, // must be yyyy-mm-dd
      })
      .eq('id', id);

    if (error) {
      console.error('Update failed:', error.message);
    } else {
      alert('Item marked as collected!');
      navigate('/view');
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <button onClick={() => navigate('/view')} className="back-button">← Back to List</button>
      <h2>{item.title}</h2>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Found At:</strong> {item.location_found}</p>
      <p><strong>Reported On:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
      {item.image_url && <img src={item.image_url} alt="Lost item" className="preview-image" />}

      {!item.is_collected && (
        <form className="collect-form" onSubmit={handleSubmit}>
          <h3>Mark as Collected</h3>

          <label>
            Student Name:
            <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
          </label>

          <label>
            Student ID:
            <input type="text" name="student_id" value={formData.student_id} onChange={handleChange} required />
          </label>

          <label>
            Return Date:
            <input type="date" name="return_date" value={formData.return_date} onChange={handleChange} required />
          </label>

          <button type="submit" className="submit-button">Submit as Collected</button>
        </form>
      )}
    </div>
  );
}

export default ViewDetailPage;
