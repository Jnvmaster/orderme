import React, { useState, useEffect } from 'react';
import AdminLayout from '../comp/AdminLayout';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setAllCategories(data);
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleSearch = (keyword) => {
    const searchKey = keyword.toLowerCase();
    if (!searchKey) {
      setCategories(allCategories);
    } else {
      const filtered = allCategories.filter((c) =>
        c.name.toLowerCase().includes(searchKey)
      );
      setCategories(filtered);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    // DELETE API call placeholder
    fetch(`http://127.0.0.1:8000/api/categories/${id}/delete/`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setCategories(categories.filter(c => c.id !== id));
          setAllCategories(allCategories.filter(c => c.id !== id));
        } else {
          throw new Error("Failed to delete category");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <AdminLayout>
      <div>
        <h3 className='text-center text-primary mb-4'>
          <i className='fas fa-list-alt me-1'></i>
          Manage Food Category
        </h3>

        <h5 className='text-end text-muted'> 
          <i className='fas fa-database me-2'></i> Total Categories
          <span className='ms-2 badge bg-success'>{categories.length}</span>
        </h5>

        <div className='mb-3 d-flex justify-content-between'>
          <input 
            type='text' 
            className='form-control w-50' 
            placeholder='Search by category name' 
            onChange={(e) => handleSearch(e.target.value)} 
          />

          <CSVLink data={categories} className='btn btn-success' filename='category_list.csv'>
            <i className='fas fa-file-csv me-2'></i> Export to CSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className='table-dark'> 
            <tr>
              <th>Sr. No</th>
              <th>Category</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody> 
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{new Date(cat.creation_date).toLocaleString()}</td>
                <td>
                  <Link className='btn btn-sm btn-primary me-2' to={`/admin/category/edit/${cat.id}`}>
                    <i className='fas fa-edit me-1'></i>Edit
                  </Link>

                  <button 
                    className='btn btn-sm btn-danger' 
                    onClick={() => handleDelete(cat.id)}
                  >
                    <i className='fas fa-trash-alt me-1'></i>Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;
