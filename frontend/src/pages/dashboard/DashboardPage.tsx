import { useEffect, useMemo } from 'react';
import { Col, Row, Table } from 'reactstrap';
import StatsCard from '@components/common/StatsCard';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchProducts } from '@features/products/productSlice';
import { fetchCategories } from '@features/categories/categorySlice';
import { fetchInventories } from '@features/inventories/inventorySlice';
import { fetchOrders } from '@features/orders/orderSlice';
import { fetchInvoices } from '@features/invoices/invoiceSlice';
import { formatCurrency, formatDate } from '@utils/formatters';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const categories = useAppSelector((state) => state.categories.items);
  const inventories = useAppSelector((state) => state.inventories.items);
  const orders = useAppSelector((state) => state.orders.items);
  const invoices = useAppSelector((state) => state.invoices.items);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchInventories());
    dispatch(fetchOrders());
    dispatch(fetchInvoices());
  }, [dispatch]);

  const totalStockValue = useMemo(
    () =>
      inventories.reduce((acc, inv) => {
        const cost = inv.product?.costPrice ?? 0;
        return acc + cost * (inv.quantity ?? 0);
      }, 0),
    [inventories]
  );

  const totalSales = useMemo(
    () => invoices.reduce((acc, invoice) => acc + (invoice.totalAmount ?? 0), 0),
    [invoices]
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== 'DELIVERED' && order.status !== 'CANCELLED'),
    [orders]
  );

  return (
    <div>
      <h2 className="fw-bold mb-4">Resumen operativo</h2>
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <StatsCard
            title="Valor total del inventario"
            subtitle="Inventario"
            value={formatCurrency(totalStockValue)}
            color="primary"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Productos registrados"
            subtitle="Catálogo"
            value={products.length}
            color="success"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Categorías activas"
            subtitle="Catálogo"
            value={categories.length}
            color="info"
          />
        </Col>
        <Col md={6} lg={3}>
          <StatsCard
            title="Ventas totales"
            subtitle="Facturación"
            value={formatCurrency(totalSales)}
            color="danger"
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <div className="bg-white rounded-3 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">
              Últimas órdenes
              <span className="badge bg-warning text-dark ms-2">
                {pendingOrders.length} pendientes
              </span>
            </h5>
            <Table responsive striped hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <span className="badge bg-info text-dark">{order.status}</span>
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      Sin órdenes registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col lg={6}>
          <div className="bg-white rounded-3 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">Facturas recientes</h5>
            <Table responsive striped hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Emisión</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{formatDate(invoice.issueDate)}</td>
                    <td>
                      <span className="badge bg-secondary">{invoice.status}</span>
                    </td>
                    <td>{formatCurrency(invoice.totalAmount)}</td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      Sin facturas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col lg={12}>
          <div className="bg-white rounded-3 shadow-sm p-4">
            <h5 className="fw-semibold mb-3">Productos con bajo stock</h5>
            <Table responsive hover size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Mínimo</th>
                  <th>Último reabastecimiento</th>
                </tr>
              </thead>
              <tbody>
                {inventories
                  .filter((inv) => inv.quantity <= inv.minStock)
                  .slice(0, 10)
                  .map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.product?.name ?? 'Producto'}</td>
                      <td>{inv.quantity}</td>
                      <td>{inv.minStock}</td>
                      <td>{formatDate(inv.lastRestockDate)}</td>
                    </tr>
                  ))}
                {inventories.filter((inv) => inv.quantity <= inv.minStock).length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No hay productos por debajo del stock mínimo
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
