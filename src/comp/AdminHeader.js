import React,{useState} from 'react';
import '../style/admin.css'
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const AdminHeader = ({toggleSidebar,sidebarOpen}) => {
  const nevigate=useNavigate();

  const handleLogout= () =>{
    
    localStorage.removeItem('adminUser');
    nevigate("/admin-login ");
  }
  return (
    <nav className='navbar navbar-expand-lg navabr-light bg-white border-bottom px-3 shadow-sm'>

      <button className='btn btn-outline-dark me-3' onClick={toggleSidebar}>
        {sidebarOpen ? <FaChevronLeft/> : <FaChevronRight/>}


      </button>
        <span className='navbar-brand fw-semibold'><i className='fas fa-utensils me-2'></i> ORDERME</span>

        <button className='navbar-toggler border=0 ms-auto align-item-center '>
          
          <FaBars/>

        </button>

        <div className="collapse navbar-collapse">
            <ui className='navbar-nav ms-auto gap-3'> 
              <li className='nav-item'>

                <button className='btn btn-outline-secondary'>
                    <FaBell/>

                </button>

                
              </li>
              <li className='nav-item'>
                <button className='btn btn-outline-danger ' onClick={handleLogout}>
                    <FaSignOutAlt/>Logout

                </button>


              </li>

            </ui>
          </div>

    </nav>
  )
}

export default AdminHeader
