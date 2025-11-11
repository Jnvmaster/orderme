import React,{useState}from 'react'
import { FaChevronDown, FaChevronUp, FaEdit, FaFile, FaList, FaSearch, FaStar, FaThLarge, FaUser } from 'react-icons/fa';

import {Link} from 'react-router-dom';

const AdminSidebar = () => {


  const[openMenus, setOpenMenus]=useState({

    category: false,
    food: false,
    order: false
  })

  const toggleMenu=(menu)=>{
    setOpenMenus((prev)=>({...prev,[menu]:!prev[menu]}));


  }

 

  return (
    <div className='bg-dark  text-white sidebar'>
      <div className='text-center p-3 border-bottom'>
        <img src="/images/admin.png" className='img-fluid rounded-circle ' width='80' alt='Admin icon'/>
           
     <h6>Admin Panel</h6> 
     </div>

     <div className='list-group list-group-flush'>
      
     <Link className='list-group-item list-group-item-action bg-dark text-white  border-0 '>
     <FaThLarge className='me2'/>Dashboard
     </Link>

      <div className='list-group list-group-flush '>
      
     <Link className='list-group-item list-group-item-action bg-dark text-white  '>
     <FaUser className='me2'/>Registered user
     </Link>
     </div>

     <button onClick={()=> toggleMenu('category')} className='list-group-item list-group-item-action bg-dark text-white border-0 '>
      <FaEdit/>food category {openMenus.category ?  <FaChevronUp /> : <FaChevronDown/>}
     </button>

     {openMenus.category && (

     <div className='ps-4'>

      <Link  to= '/add-category'className='list-group-item list-group-item-action bg-dark text-white border-0 '>
     Add category
     </Link>

     <Link  to='/manage-category'className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Manage category
     </Link>
     </div>)}

     <button onClick={()=> toggleMenu('food')} className='list-group-item list-group-item-action bg-dark text-white border-0  '>
      <FaEdit/>food item {openMenus.food ?  <FaChevronUp /> : <FaChevronDown/>}
     </button>

     {openMenus.food &&(

     <div className='ps-4'>

      <Link  to='/add-food'className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Add food item
     </Link>

     <Link to="/manage-food"className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Manage food item
     </Link>
     </div>)}

     <button onClick={()=> toggleMenu('order')} className='list-group-item list-group-item-action bg-dark text-white border-0  '>
      <FaList/>order category {openMenus.order ?  <FaChevronUp /> : <FaChevronDown/>}
     </button> 

     {openMenus.order && (

     <div className='ps-4'>

      <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Confirmed
     </Link>

     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Not Confirmed
     </Link>
     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Bing Prepared
     </Link>
     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Order Pickup
     </Link>
     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     Delivered
     </Link>
     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     cancelled
     </Link>
     <Link className='list-group-item list-group-item-action bg-dark text-white border-0  '>
     All Orders
     </Link>
     </div>)}

     <div className='list-group  list-group-flush'>
      
     <Link className='list-group-item list-group-item-action bg-dark text-white  '>
     <FaFile className='me2'/> B/W Dates Report
     </Link>
     </div>

     

      <div className='list-group  list-group-flush'>
      
     <Link className='list-group-item list-group-item-action bg-dark text-white  '>
     <FaSearch className='me2'/>Search
     </Link>
     </div>

      <div className='list-group  list-group-flush'>
      
     <Link className='list-group-item list-group-item-action bg-dark text-white  '>
     <FaStar className='me2'/>Manage Rivews
     </Link>
     </div>
     </div>

     


    </div>
  )
}

export default AdminSidebar
 