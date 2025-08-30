import { Offcanvas, Button } from 'react-bootstrap';
// import { useSelector, useDispatch } from 'react-redux';
// import { setOpenSidebar } from '../redux/slices/authSlice';
import Sidebar from './Sidebar';

const MobileSidebar = () => {
  // const { isSidebarOpen } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  // const handleClose = () => dispatch(setOpenSidebar(false));

  return (
    <Offcanvas 
        // show={isSidebarOpen} onHide={handleClose} 
        responsive="md">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Sidebar />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default MobileSidebar;
