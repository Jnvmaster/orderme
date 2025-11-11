import React,{useState,useEffect} from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

const AdminLayout = ({children}) => {

  const [sidebarOpen,setsidebarOpen]= useState(true)

   useEffect(()=>{
    const handelResize = () => {
      if(window.innerWidth < 768) {
        setsidebarOpen(false);
      }
      else{
        setsidebarOpen(true)
      }
    }
    handelResize();
    window.addEventListener('resize',handelResize);
    return() =>  window.removeEventListener('resize',handelResize);

   },  []);

   const toggleSidebar=()=> setsidebarOpen(prev=>!prev);

  return (
    <div className='d-flex'>
       {sidebarOpen && <AdminSidebar/>}

      <div id='page-content-wrapper' className={` w-100 ${sidebarOpen ? 'with-sidebar': 'full-width'}`}>

          <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen}/>
      
      <div className='container-fluid mt-4'>
         {children}
      </div >
          
      </div>
    </div>
  )
}

export default AdminLayout
