import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./ViewPage.css"; // Use same CSS as ViewPage for styling consistency

interface LostItem {
  id: string;
  title: string;
  description: string;
  donated_on: string;
}

export default function DonatedPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("lost_items")
        .select("id, title, description, donated_on")
        .eq("ready_for_donation", true)
        .order("donated_on", { ascending: false });

      if (!error && data) {
        setItems(data);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="page-title">Donated Items</h2>

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
              <th>Donated On</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{new Date(item.donated_on).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
