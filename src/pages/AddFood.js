import React, { useState, useEffect } from 'react';
import AdminLayout from '../comp/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    price: "",
    description: "",
    quantity: "",
    image: null
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error("Please select an image.");
      return;
    }

    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("quantity", formData.quantity);
    data.append("image", formData.image);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/foods/add/', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.status === 201) {
        toast.success(result.message);
        setFormData({
          category: "",
          name: "",
          price: "",
          description: "",
          quantity: "",
          image: null
        });
        setPreview(null);
      } else {
        toast.error(result.message || "Failed to add food item.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position='top-right' autoClose={2000} />
      <div className='row'>
        <div className='col-md-8'>
          <div className='p-4 shadow-sm rounded'>
            <h4 className='mb-4'>
              <i className='fas fa-plus-circle text-secondary me-2'></i> Add Food Item
            </h4>

            <form onSubmit={handleSubmit} encType='multipart/form-data'>
              {/* Category */}
              <div className='mb-3'>
                <label className="form-label">Food Category</label>
                <select
                  name='category'
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value=''>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div className='mb-3'>
                <label className="form-label">Food Item Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter food item name'
                  required
                />
              </div>

              {/* Description */}
              <div className='mb-3'>
                <label className="form-label">Description</label>
                <input
                  name="description"
                  type="text"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='Enter description'
                  required
                />
              </div>

              {/* Quantity */}
              <div className='mb-3'>
                <label className="form-label">Quantity</label>
                <input
                  name="quantity"
                  type="text"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder='e.g. 1 pcs / Large / Small'
                  required
                />
              </div>

              {/* Price */}
              <div className='mb-3'>
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Image */}
              <div className='mb-3'>
                <label className="form-label">Image</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-3 rounded"
                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                  />
                )}
              </div>

              <button type="submit" className='btn btn-primary mt-3'>
                <i className='fas fa-plus me-2'></i> Add Food Item
              </button>
            </form>
          </div>
        </div>

        <div className='col-md-4 d-flex justify-content-center align-items-center'>
          <i className='fas fa-pizza-slice' style={{ fontSize: '180px', color: '#e5e5e5' }}></i>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddFood;
