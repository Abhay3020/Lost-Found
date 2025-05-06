import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ViewPage.css';

type LostItem = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  ready_for_donation?: boolean;
};

export default function ViewPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lost_items')
      .select('id, title, description, created_at, ready_for_donation')
      .eq('is_collected', false)
      .eq('ready_for_donation', false)
      .order('created_at', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleMarkForDonation = async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('lost_items')
      .update({ ready_for_donation: true, donated_on: today })
      .eq('id', id);
    fetchItems(); // refresh items
  };

  const isOlderThan14Days = (dateStr: string) => {
    const created = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 14;
  };

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => {
              const shouldMark = isOlderThan14Days(item.created_at) && !item.ready_for_donation;
              return (
                <tr
                  key={item.id}
                  className={shouldMark ? 'highlight-donation' : ''}
                >
                  <td>
                    <Link to={`/view/${item.id}`}>{item.title}</Link>
                  </td>
                  <td>{item.description}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    {shouldMark ? (
                      <button onClick={() => handleMarkForDonation(item.id)}>
                        Mark for Donation
                      </button>
                    ) : item.ready_for_donation ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>donated</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
