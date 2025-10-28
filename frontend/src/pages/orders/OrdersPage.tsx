import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table
} from 'reactstrap';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createOrder, deleteOrder, fetchOrders } from '@features/orders/orderSlice';
import { fetchProducts } from '@features/products/productSlice';
import { Order } from '@types/order';
import { formatCurrency, formatDate } from '@utils/formatters';

const orderStatuses: Order['status'][] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

const defaultItem = { productId: 0, quantity: 1, unitPrice: 0, description: '' };

const createDefaultForm = () => ({
  orderNumber: '',
  status: 'PENDING' as Order['status'],
  subtotal: 0,
  taxAmount: 0,
  shippingAmount: 0,
  taxRate: 19,
  totalAmount: 0,
  shippingAddress: '',
  billingAddress: '',
  notes: '',
  items: [{ ...defaultItem }]
});

type OrderFormState = ReturnType<typeof createDefaultForm>;

type OrderItemForm = typeof defaultItem;

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { items: orders, loading } = useAppSelector((state) => state.orders);
  const products = useAppSelector((state) => state.products.items);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<OrderFormState>(createDefaultForm());
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const term = search.toLowerCase();
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.notes?.toLowerCase().includes(term)
    );
  }, [orders, search]);

  const handleClose = () => {
    setShowModal(false);
    setFormState(createDefaultForm());
  };

  const handleOpen = () => {
    setFormState(createDefaultForm());
    setShowModal(true);
  };

  const recalculateTotals = (items: OrderItemForm[], shippingAmount: number, taxRate: number) => {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount + shippingAmount;
    setFormState((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
      taxRate,
      items
    }));
  };

  const handleItemChange = (index: number, field: keyof OrderItemForm, value: string) => {
    const newItems = [...formState.items];
    const parsedValue = Number(value);
    if (field === 'productId') {
      const selectedProduct = products.find((product) => product.id === parsedValue);
      newItems[index] = {
        ...newItems[index],
        productId: parsedValue,
        unitPrice: selectedProduct?.costPrice ?? newItems[index].unitPrice,
        quantity: newItems[index].quantity,
        description: selectedProduct?.name ?? newItems[index].description
      };
    } else if (field === 'quantity') {
      newItems[index] = { ...newItems[index], quantity: parsedValue };
    } else {
      newItems[index] = { ...newItems[index], unitPrice: parsedValue };
    }
    recalculateTotals(newItems, formState.shippingAmount, formState.taxRate);
  };

  const handleAddItem = () => {
    const newItems = [...formState.items, { ...defaultItem }];
    recalculateTotals(newItems, formState.shippingAmount, formState.taxRate);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formState.items.filter((_, itemIndex) => itemIndex !== index);
    recalculateTotals(newItems, formState.shippingAmount, formState.taxRate);
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'status') {
      setFormState((prev) => ({ ...prev, status: value as Order['status'] }));
      return;
    }
    if (name === 'shippingAmount') {
      const shippingAmount = Number(value);
      recalculateTotals(formState.items, shippingAmount, formState.taxRate);
      return;
    }
    if (name === 'taxRate') {
      const taxRate = Number(value);
      recalculateTotals(formState.items, formState.shippingAmount, taxRate);
      return;
    }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...formState,
      items: formState.items.filter((item) => item.productId)
    };
    await dispatch(createOrder(payload));
    handleClose();
  };

  const handleDelete = async (order: Order) => {
    if (window.confirm(`¿Eliminar la orden ${order.orderNumber}?`)) {
      await dispatch(deleteOrder(order.id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Órdenes de venta</h2>
          <p className="text-muted mb-0">Registre pedidos para llevar un seguimiento del flujo comercial.</p>
        </div>
        <Button color="primary" onClick={handleOpen}>
          Nueva orden
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h5" className="mb-0">
              Historial de órdenes
            </CardTitle>
            <Input
              placeholder="Buscar por número, estado o nota"
              style={{ maxWidth: '320px' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Número</th>
                <th>Estado</th>
                <th>Subtotal</th>
                <th>Impuestos</th>
                <th>Total</th>
                <th>Creado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-semibold">{order.orderNumber}</td>
                  <td>
                    <Badge color="info">{order.status}</Badge>
                  </td>
                  <td>{formatCurrency(order.subtotal)}</td>
                  <td>{formatCurrency(order.taxAmount ?? 0)}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="text-end">
                    <Button color="outline-danger" size="sm" onClick={() => handleDelete(order)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay órdenes registradas
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center">
                    Cargando órdenes...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} toggle={handleClose} size="xl">
        <ModalHeader toggle={handleClose}>Nueva orden</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row className="g-3">
              <Col md={3}>
                <FormGroup>
                  <Label for="orderNumber">Número de orden</Label>
                  <Input
                    id="orderNumber"
                    name="orderNumber"
                    value={formState.orderNumber}
                    onChange={(event) => setFormState({ ...formState, orderNumber: event.target.value })}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="status">Estado</Label>
                  <Input id="status" name="status" type="select" value={formState.status} onChange={handleSummaryChange}>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="shippingAmount">Costo de envío</Label>
                  <Input
                    id="shippingAmount"
                    name="shippingAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.shippingAmount}
                    onChange={handleSummaryChange}
                  />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="taxRate">Impuesto (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.taxRate}
                    onChange={handleSummaryChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="shippingAddress">Dirección de envío</Label>
                  <Input
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formState.shippingAddress}
                    onChange={(event) => setFormState({ ...formState, shippingAddress: event.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="billingAddress">Dirección de facturación</Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    value={formState.billingAddress}
                    onChange={(event) => setFormState({ ...formState, billingAddress: event.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="notes">Notas</Label>
                  <Input
                    id="notes"
                    name="notes"
                    type="textarea"
                    rows={3}
                    value={formState.notes}
                    onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
                  />
                </FormGroup>
              </Col>
            </Row>

            <h5 className="fw-semibold mt-4 mb-3">Detalle de productos</h5>
            {formState.items.map((item, index) => (
              <Row key={index} className="g-3 align-items-end mb-2">
                <Col md={5}>
                  <FormGroup>
                    <Label>Producto</Label>
                    <Input
                      type="select"
                      value={item.productId}
                      onChange={(event) => handleItemChange(index, 'productId', event.target.value)}
                      required
                    >
                      <option value="">Seleccione un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => handleItemChange(index, 'quantity', event.target.value)}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Precio unitario</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(event) => handleItemChange(index, 'unitPrice', event.target.value)}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={2} className="d-flex gap-2">
                  <Button color="outline-danger" onClick={() => handleRemoveItem(index)} disabled={formState.items.length === 1}>
                    Quitar
                  </Button>
                </Col>
              </Row>
            ))}
            <Button color="link" onClick={handleAddItem}>
              + Agregar otro producto
            </Button>

            <Row className="g-3 mt-3">
              <Col md={4}>
                <FormGroup>
                  <Label>Subtotal</Label>
                  <Input value={formState.subtotal.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Impuesto estimado</Label>
                  <Input value={formState.taxAmount.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Total</Label>
                  <Input value={formState.totalAmount.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar orden
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default OrdersPage;
