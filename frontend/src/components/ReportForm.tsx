import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './ReportForm.css';

export default function ReportForm() {
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
    console.log('[DEBUG] Form submitted:', formData);

    let imageUrl = '';

    try {
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('lost-item-images')
          .upload(fileName, formData.image);

        if (uploadError) {
          console.error('[ERROR] Image upload failed:', uploadError);
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
        console.error('[ERROR] DB insert failed:', insertError);
        setStatus('Failed to report item.');
      } else {
        console.log('[DEBUG] DB insert success!');
        setStatus('Item reported successfully!');
        setFormData({
          title: '',
          description: '',
          location_found: '',
          image: null,
        });
      }

    } catch (error) {
      console.error('[EXCEPTION] Unexpected error occurred:', error);
      setStatus('Unexpected error occurred.');
    }
  };

  return (
    <div className="report-form-wrapper">
      <h2>Report a Lost Item</h2>
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

        <button type="submit">Submit</button>
        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
