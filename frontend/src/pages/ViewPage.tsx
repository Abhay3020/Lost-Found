// src/pages/ViewPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ViewPage.css';

type LostItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

export default function ViewPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lost_items')
      .select('id, title, description, created_at')
      .eq('is_collected', false)
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="page-title">Reported Lost Items</h2>

      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar with-icon"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Reported Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/view/${item.id}`}>{item.title}</Link>
                </td>
                <td>{item.description}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
