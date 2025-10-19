import { Navbar, NavbarBrand, Button } from 'reactstrap';
import { useAuth } from '@hooks/useAuth';
import { useAppDispatch } from '@hooks/redux';
import { logout } from '@features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar color="light" light className="px-3 border-bottom d-flex justify-content-between">
      <NavbarBrand className="fw-bold">Panel de Administración</NavbarBrand>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted">{user?.username ?? 'Usuario'}</span>
        <Button color="outline-danger" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </Navbar>
  );
};

export default Topbar;
