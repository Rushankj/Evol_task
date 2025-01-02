import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API calls
import './Notice.css'; 

const Notice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a FormData object to send data as form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    try {
      // Send the form data to the backend
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsButtonClicked(true);
      alert('Notice Submitted!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('There was an error submitting your notice.');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setIsButtonClicked(!isButtonClicked);
  };

  return (
    <div className="notice-container">
      <div className="notice-card">
        <h2 className="notice-heading">Add New Notice</h2>

        <form onSubmit={handleSubmit}>
         
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              className="form-input"
              placeholder="Enter the title of the notice"
            />
          </div>

         
          <div className="form-group">
            <label className="form-label">Content:</label>
            <textarea
              value={content}
              onChange={handleContentChange}
              required
              className="form-textarea"
              placeholder="Enter the content of the notice"
              rows="5"
            />
          </div>

         
          <div className="form-group">
            <label className="form-label">Upload Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-input"
              required
            />
          </div>

         
          <button
            type="submit"
            onClick={handleButtonClick}
            className={`submit-btn ${isButtonClicked ? 'clicked' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : isButtonClicked ? 'Submitted' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Notice;

