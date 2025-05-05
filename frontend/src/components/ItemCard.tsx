// src/components/ItemCard.tsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './ItemCard.css';


type Item = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location_found: string;
  pickup_location: string;
  is_collected: boolean;
  collected_by_name?: string;
  collected_by_id?: string;
};

type Props = {
  item: Item;
  refresh: () => void;
};

export default function ItemCard({ item, refresh }: Props) {
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCollect = async () => {
    setLoading(true);
    await supabase
      .from('lost_items')
      .update({
        is_collected: true,
        collected_by_name: name,
        collected_by_id: idNumber,
      })
      .eq('id', item.id);
    refresh();
    setLoading(false);
  };

  return (
    <div className="border rounded p-4 shadow-md space-y-2">
      {item.image_url && (
        <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded" />
      )}
      <h3 className="text-xl font-bold">{item.title}</h3>
      <p>{item.description}</p>
      <p><strong>Found At:</strong> {item.location_found}</p>
      <p><strong>Pickup From:</strong> {item.pickup_location}</p>

      {item.is_collected ? (
        <p className="text-green-600 font-semibold">
          ✅ Collected by {item.collected_by_name} (ID: {item.collected_by_id})
        </p>
      ) : (
        <div className="space-y-2">
          <input
            className="w-full p-2 border rounded"
            placeholder="Collector's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Collector's ID"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
          <button
            onClick={handleCollect}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Mark as Collected'}
          </button>
        </div>
      )}
    </div>
  );
}
