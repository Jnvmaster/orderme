import React, { useState, useEffect } from 'react';
import AdminLayout from '../comp/AdminLayout';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/foods/')
      .then(res => res.json())
      .then(data => {
        // Remove null entries (food items without a category)
        const filteredData = data.filter(food => food.category_name !== null);
        setFoods(filteredData);
        setAllFoods(filteredData);
      })
      .catch(err => console.error("Error fetching foods:", err));
  }, []);

  const handleSearch = (keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    if (!lowerKeyword) {
      setFoods(allFoods);
    } else {
      const filtered = allFoods.filter(f => f.name.toLowerCase().includes(lowerKeyword));
      setFoods(filtered);
    }
  };

  return (
    <AdminLayout>
      <div>
        <h3 className='text-center text-primary mb-4'>
          <i className='fas fa-list-alt me-1'></i>
          Manage Food Items
        </h3>

        <h5 className='text-end text-muted'> 
          <i className='fas fa-database me-2'></i> Total Food Items
          <span className='ms-2 badge bg-success'>{foods.length}</span>
        </h5>

        <div className='mb-3 d-flex justify-content-between'>
          <input 
            type='text' 
            className='form-control w-50' 
            placeholder='Search by food item name...' 
            onChange={(e) => handleSearch(e.target.value)}
          />
          <CSVLink data={foods} className='btn btn-success' filename='food_list.csv'>
            <i className='fas fa-file-csv me-2'></i> Export to CSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className='table-dark'>
            <tr>
              <th>Sr.No</th>
              <th>Category</th>
              <th>Food Item Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan={5} className='text-center text-muted'>
                  No food items found
                </td>
              </tr>
            ) : (
              foods.map((food, index) => (
                <tr key={food.id}>
                  <td>{index + 1}</td>
                  <td>{food.category_name || 'N/A'}</td>
                  <td>{food.name}</td> {/* Corrected field */}
                  <td>
                    {food.price !== null && food.price !== undefined && !isNaN(food.price)
                      ? `₹${Number(food.price).toFixed(2)}`
                      : 'N/A'}
                  </td>
                  <td>
                    <Link className='btn btn-sm btn-primary me-2'>
                      <i className='fas fa-edit me-1'></i>Edit
                    </Link>
                    <button className='btn btn-sm btn-danger'>
                      <i className='fas fa-trash-alt me-1'></i>Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageFood;
