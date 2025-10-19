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
import { fetchInvoices, createInvoice } from '@features/invoices/invoiceSlice';
import { fetchOrders } from '@features/orders/orderSlice';
import { fetchProducts } from '@features/products/productSlice';
import { Invoice } from '@types/invoice';
import { formatCurrency, formatDate } from '@utils/formatters';

const paymentMethods: Invoice['paymentMethod'][] = ['CASH', 'CARD', 'TRANSFER', 'CHECK'];
const invoiceStatuses: Invoice['status'][] = ['DRAFT', 'ISSUED', 'PAID', 'CANCELLED'];

const defaultItem = { productId: 0, description: '', quantity: 1, unitPrice: 0 };

const createDefaultForm = () => ({
  invoiceNumber: '',
  orderId: 0,
  issueDate: new Date().toISOString().substring(0, 10),
  dueDate: new Date().toISOString().substring(0, 10),
  subtotal: 0,
  taxAmount: 0,
  totalAmount: 0,
  taxRate: 19,
  paymentMethod: 'CASH' as Invoice['paymentMethod'],
  status: 'DRAFT' as Invoice['status'],
  notes: '',
  items: [{ ...defaultItem }]
});

type InvoiceFormState = ReturnType<typeof createDefaultForm>;
type InvoiceItemForm = typeof defaultItem;

const InvoicesPage = () => {
  const dispatch = useAppDispatch();
  const { items: invoices, loading } = useAppSelector((state) => state.invoices);
  const orders = useAppSelector((state) => state.orders.items);
  const products = useAppSelector((state) => state.products.items);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<InvoiceFormState>(createDefaultForm());
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredInvoices = useMemo(() => {
    const term = search.toLowerCase();
    return invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.status.toLowerCase().includes(term) ||
        invoice.notes?.toLowerCase().includes(term)
    );
  }, [invoices, search]);

  const recalculateTotals = (items: InvoiceItemForm[], taxRate: number) => {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;
    setFormState((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
      taxRate,
      items
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItemForm, value: string) => {
    const newItems = [...formState.items];
    if (field === 'productId') {
      newItems[index] = { ...newItems[index], productId: Number(value) };
    } else if (field === 'quantity') {
      newItems[index] = { ...newItems[index], quantity: Number(value) };
    } else if (field === 'unitPrice') {
      newItems[index] = { ...newItems[index], unitPrice: Number(value) };
    } else {
      newItems[index] = { ...newItems[index], description: value };
    }
    recalculateTotals(newItems, formState.taxRate);
  };

  const handleAddItem = () => {
    const newItems = [...formState.items, { ...defaultItem }];
    recalculateTotals(newItems, formState.taxRate);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formState.items.filter((_, itemIndex) => itemIndex !== index);
    recalculateTotals(newItems, formState.taxRate);
  };

  const handleClose = () => {
    setShowModal(false);
    setFormState(createDefaultForm());
  };

  const handleOpen = () => {
    setShowModal(true);
    setFormState(createDefaultForm());
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'orderId') {
      const order = orders.find((item) => item.id === Number(value));
      if (order) {
        const generatedItems =
          order.orderItems?.map((item) => ({
            productId: item.product?.id ?? 0,
            description: item.product?.name ?? 'Producto',
            quantity: item.quantity,
            unitPrice: item.unitPrice
          })) ?? [{ ...defaultItem }];
        recalculateTotals(generatedItems, formState.taxRate);
        setFormState((prev) => ({
          ...prev,
          orderId: order.id,
          items: generatedItems,
          subtotal: order.subtotal,
          taxAmount: order.taxAmount ?? order.subtotal * (prev.taxRate / 100),
          totalAmount: order.totalAmount,
          notes: order.notes ?? prev.notes
        }));
        return;
      }
    }
    if (name === 'taxRate') {
      recalculateTotals(formState.items, Number(value));
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
    await dispatch(createInvoice(payload));
    handleClose();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Facturación</h2>
          <p className="text-muted mb-0">Emita comprobantes de venta y controle el estado de los pagos.</p>
        </div>
        <Button color="primary" onClick={handleOpen}>
          Nueva factura
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h5" className="mb-0">
              Histórico de facturas
            </CardTitle>
            <Input
              placeholder="Buscar por número o estado"
              style={{ maxWidth: '320px' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Número</th>
                <th>Orden</th>
                <th>Estado</th>
                <th>Método pago</th>
                <th>Total</th>
                <th>Emisión</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="fw-semibold">{invoice.invoiceNumber}</td>
                  <td>{invoice.order?.orderNumber ?? '-'}</td>
                  <td>
                    <Badge color="secondary">{invoice.status}</Badge>
                  </td>
                  <td>{invoice.paymentMethod}</td>
                  <td>{formatCurrency(invoice.totalAmount)}</td>
                  <td>{formatDate(invoice.issueDate)}</td>
                </tr>
              ))}
              {!loading && filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted">
                    No hay facturas registradas
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center">
                    Cargando facturas...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} toggle={handleClose} size="xl">
        <ModalHeader toggle={handleClose}>Nueva factura</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Row className="g-3">
              <Col md={4}>
                <FormGroup>
                  <Label for="invoiceNumber">Número de factura</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formState.invoiceNumber}
                    onChange={(event) => setFormState({ ...formState, invoiceNumber: event.target.value })}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="orderId">Orden asociada</Label>
                  <Input id="orderId" name="orderId" type="select" value={formState.orderId} onChange={handleSummaryChange}>
                    <option value="0">Seleccione una orden</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNumber}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="paymentMethod">Método de pago</Label>
                  <Input
                    id="paymentMethod"
                    name="paymentMethod"
                    type="select"
                    value={formState.paymentMethod}
                    onChange={handleSummaryChange}
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="issueDate">Fecha de emisión</Label>
                  <Input id="issueDate" name="issueDate" type="date" value={formState.issueDate} onChange={handleSummaryChange} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="dueDate">Fecha de vencimiento</Label>
                  <Input id="dueDate" name="dueDate" type="date" value={formState.dueDate} onChange={handleSummaryChange} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="status">Estado</Label>
                  <Input id="status" name="status" type="select" value={formState.status} onChange={handleSummaryChange}>
                    {invoiceStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <h5 className="fw-semibold mt-4 mb-3">Detalle de facturación</h5>
            {formState.items.map((item, index) => (
              <Row key={index} className="g-3 align-items-end mb-2">
                <Col md={4}>
                  <FormGroup>
                    <Label>Producto</Label>
                    <Input
                      type="select"
                      value={item.productId}
                      onChange={(event) => handleItemChange(index, 'productId', event.target.value)}
                      required
                    >
                      <option value="0">Seleccione un producto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>Descripción</Label>
                    <Input
                      value={item.description}
                      onChange={(event) => handleItemChange(index, 'description', event.target.value)}
                      placeholder="Detalle en factura"
                    />
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
                <Col md={2}>
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
                <Col md={1} className="d-flex">
                  <Button
                    color="outline-danger"
                    onClick={() => handleRemoveItem(index)}
                    disabled={formState.items.length === 1}
                  >
                    X
                  </Button>
                </Col>
              </Row>
            ))}
            <Button color="link" onClick={handleAddItem}>
              + Agregar concepto
            </Button>

            <Row className="g-3 mt-3">
              <Col md={3}>
                <FormGroup>
                  <Label>Subtotal</Label>
                  <Input value={formState.subtotal.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label>Impuesto</Label>
                  <Input value={formState.taxAmount.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
              <Col md={3}>
                <FormGroup>
                  <Label for="taxRate">Tasa de impuesto (%)</Label>
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
              <Col md={3}>
                <FormGroup>
                  <Label>Total</Label>
                  <Input value={formState.totalAmount.toFixed(2)} readOnly />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup className="mt-3">
              <Label for="notes">Notas adicionales</Label>
              <Input
                id="notes"
                name="notes"
                type="textarea"
                rows={3}
                value={formState.notes}
                onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar factura
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoicesPage;
