import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ViewPage.css'; // Reuse same styling

type CollectedItem = {
  id: string;
  title: string;
  description: string;
  location_found: string;
  collected_by_id: string;
  collected_by_name: string;
  return_date: string;
};

export default function CollectedPage() {
  const [items, setItems] = useState<CollectedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    const { data } = await supabase
      .from('lost_items')
      .select('id, title, description, location_found, collected_by_id, collected_by_name, return_date')
      .eq('is_collected', true)
      .order('return_date', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="page-title">Collected Items</h2>

      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
              <th>Collected By</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/collected/${item.id}`}>{item.title}</Link>
                </td>
                <td>{item.collected_by_name || '(ID: ' + item.collected_by_id + ')'}</td>
                <td>{item.return_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
