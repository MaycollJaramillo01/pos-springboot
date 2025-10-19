import { Nav, NavItem } from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Panel' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
  { to: '/inventory', label: 'Inventario' },
  { to: '/orders', label: 'Órdenes' },
  { to: '/invoices', label: 'Facturas' }
];

const Sidebar = () => (
  <aside className="bg-dark text-white vh-100 p-3" style={{ width: '260px' }}>
    <h5 className="text-uppercase fw-bold mb-4">POS Multitenant</h5>
    <Nav vertical pills>
      {navItems.map((item) => (
        <NavItem key={item.to} className="mb-2">
          <RouterNavLink
            to={item.to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-primary text-white' : 'text-white-50'}`
            }
          >
            {item.label}
          </RouterNavLink>
        </NavItem>
      ))}
    </Nav>
  </aside>
);

export default Sidebar;
