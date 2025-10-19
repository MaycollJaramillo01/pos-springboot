import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '@components/common/Sidebar';
import Topbar from '@components/common/Topbar';

const AppLayout = () => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Topbar />
      <Container fluid className="py-4" style={{ backgroundColor: '#f5f7fb', minHeight: '100%' }}>
        <Outlet />
      </Container>
    </div>
  </div>
);

export default AppLayout;
