import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './ReportPage.css';

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_found: '',
    image: null as File | null,
  });

  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Uploading...');

    let imageUrl = '';

    try {
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('lost-item-images')
          .upload(fileName, formData.image);

        if (uploadError) {
          setStatus('Image upload failed.');
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('lost-item-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('lost_items').insert({
        title: formData.title,
        description: formData.description,
        location_found: formData.location_found,
        image_url: imageUrl,
      });

      if (insertError) {
        setStatus('Failed to report item.');
      } else {
        setStatus('Item reported successfully!');
        setFormData({
          title: '',
          description: '',
          location_found: '',
          image: null,
        });
      }
    } catch (error) {
      setStatus('Unexpected error occurred.');
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-heading">Report a Lost Item</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Item Title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Item Description"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location_found">Location Found</label>
          <input
            type="text"
            id="location_found"
            name="location_found"
            value={formData.location_found}
            onChange={handleChange}
            placeholder="Location Found"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
        {status && <p className="status-msg">{status}</p>}
      </form>
    </div>
  );
}
