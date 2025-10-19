import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@layouts/AppLayout';
import ProtectedRoute from '@routes/ProtectedRoute';
import LoginPage from '@pages/auth/LoginPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ProductsPage from '@pages/products/ProductsPage';
import CategoriesPage from '@pages/categories/CategoriesPage';
import InventoryPage from '@pages/inventory/InventoryPage';
import OrdersPage from '@pages/orders/OrdersPage';
import InvoicesPage from '@pages/invoices/InvoicesPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="products" element={<ProductsPage />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="invoices" element={<InvoicesPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
