import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table
} from 'reactstrap';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createInventory,
  fetchInventories,
  updateInventory
} from '@features/inventories/inventorySlice';
import { fetchProducts } from '@features/products/productSlice';
import { Inventory } from '@types/inventory';
import { formatDate } from '@utils/formatters';

const defaultForm = {
  productId: 0,
  quantity: 0,
  minStock: 5,
  maxStock: 100,
  location: ''
};

type InventoryFormState = typeof defaultForm;

const InventoryPage = () => {
  const dispatch = useAppDispatch();
  const { items: inventories, loading } = useAppSelector((state) => state.inventories);
  const products = useAppSelector((state) => state.products.items);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Inventory | null>(null);
  const [formState, setFormState] = useState<InventoryFormState>(defaultForm);
  const [filter, setFilter] = useState<'all' | 'low' | 'ok'>('all');

  useEffect(() => {
    dispatch(fetchInventories());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredInventories = useMemo(() => {
    if (filter === 'low') {
      return inventories.filter((item) => item.quantity <= item.minStock);
    }
    if (filter === 'ok') {
      return inventories.filter((item) => item.quantity > item.minStock);
    }
    return inventories;
  }, [inventories, filter]);

  const handleOpen = (inventory?: Inventory) => {
    if (inventory) {
      setEditing(inventory);
      setFormState({
        productId: inventory.product?.id ?? 0,
        quantity: inventory.quantity,
        minStock: inventory.minStock,
        maxStock: inventory.maxStock,
        location: inventory.location ?? ''
      });
    } else {
      setEditing(null);
      setFormState(defaultForm);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditing(null);
    setFormState(defaultForm);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: name === 'location' ? value : Number(value) }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { ...formState };
    if (editing) {
      await dispatch(updateInventory({ id: editing.id, data: payload }));
    } else {
      await dispatch(createInventory(payload));
    }
    handleClose();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Inventario</h2>
          <p className="text-muted mb-0">Controle niveles de stock, ubicaciones y alertas de reposición.</p>
        </div>
        <Button color="primary" onClick={() => handleOpen()}>
          Registrar inventario
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <CardTitle tag="h5" className="mb-0">
              Existencias por producto
            </CardTitle>
            <div className="d-flex gap-2">
              <Button color={filter === 'all' ? 'primary' : 'light'} size="sm" onClick={() => setFilter('all')}>
                Todos
              </Button>
              <Button color={filter === 'low' ? 'warning' : 'light'} size="sm" onClick={() => setFilter('low')}>
                Bajo stock
              </Button>
              <Button color={filter === 'ok' ? 'success' : 'light'} size="sm" onClick={() => setFilter('ok')}>
                Saludable
              </Button>
            </div>
          </div>
          <Table responsive hover striped>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Mínimo</th>
                <th>Máximo</th>
                <th>Ubicación</th>
                <th>Último abastecimiento</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.map((inventory) => {
                const isLow = inventory.quantity <= inventory.minStock;
                return (
                  <tr key={inventory.id}>
                    <td className="fw-semibold">{inventory.product?.name ?? 'Producto'}</td>
                    <td>
                      <Badge color={isLow ? 'danger' : 'success'}>{inventory.quantity}</Badge>
                    </td>
                    <td>{inventory.minStock}</td>
                    <td>{inventory.maxStock}</td>
                    <td>{inventory.location ?? '-'}</td>
                    <td>{formatDate(inventory.lastRestockDate)}</td>
                    <td className="text-end">
                      <Button color="outline-primary" size="sm" onClick={() => handleOpen(inventory)}>
                        Actualizar
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredInventories.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay inventarios registrados
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center">
                    Cargando inventario...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>
          {editing ? 'Actualizar inventario' : 'Registrar inventario'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="row g-3">
              <div className="col-md-12">
                <FormGroup>
                  <Label for="productId">Producto</Label>
                  <Input
                    id="productId"
                    name="productId"
                    type="select"
                    value={formState.productId}
                    onChange={handleChange}
                    required
                    disabled={Boolean(editing)}
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="quantity">Cantidad actual</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formState.quantity}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="minStock">Stock mínimo</Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    min="0"
                    value={formState.minStock}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="maxStock">Stock máximo</Label>
                  <Input
                    id="maxStock"
                    name="maxStock"
                    type="number"
                    min="0"
                    value={formState.maxStock}
                    onChange={handleChange}
                  />
                </FormGroup>
              </div>
              <div className="col-md-12">
                <FormGroup>
                  <Label for="location">Ubicación</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formState.location}
                    onChange={handleChange}
                    placeholder="Bodega principal, Estante A3, etc"
                  />
                </FormGroup>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar cambios
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
