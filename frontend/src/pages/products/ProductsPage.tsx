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
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct
} from '@features/products/productSlice';
import { fetchCategories } from '@features/categories/categorySlice';
import { Product } from '@types/product';
import { formatCurrency } from '@utils/formatters';

const defaultForm = {
  sku: '',
  brand: '',
  name: '',
  description: '',
  barCode: '',
  measureUnit: '',
  costPrice: 0,
  isActive: true,
  taxPercentage: 0,
  categoryIds: [] as number[]
};

type ProductFormState = typeof defaultForm;

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const categories = useAppSelector((state) => state.categories.items);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<ProductFormState>(defaultForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.barCode?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormState({
        sku: product.sku ?? '',
        brand: product.brand ?? '',
        name: product.name ?? '',
        description: product.description ?? '',
        barCode: product.barCode ?? '',
        measureUnit: product.measureUnit ?? '',
        costPrice: product.costPrice ?? 0,
        isActive: product.isActive ?? true,
        taxPercentage: product.taxPercentage ?? 0,
        categoryIds: product.productCategories?.map((category) => category.id) ?? []
      });
    } else {
      setEditingProduct(null);
      setFormState(defaultForm);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormState(defaultForm);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked, multiple, options } = event.target as any;
    if (multiple) {
      const selected = Array.from(options)
        .filter((option: HTMLOptionElement) => option.selected)
        .map((option: HTMLOptionElement) => Number(option.value));
      setFormState((prev) => ({ ...prev, [name]: selected }));
      return;
    }
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'costPrice' || name === 'taxPercentage' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = { ...formState };
    if (editingProduct) {
      await dispatch(updateProduct({ id: editingProduct.id, data: payload }));
    } else {
      await dispatch(createProduct(payload));
    }
    handleCloseModal();
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`¿Eliminar el producto ${product.name}?`)) {
      await dispatch(deleteProduct(product.id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Productos</h2>
          <p className="text-muted mb-0">
            Administre el catálogo de productos disponible para todas las sucursales.
          </p>
        </div>
        <Button color="primary" onClick={() => handleOpenModal()}>
          Nuevo producto
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between mb-3">
            <CardTitle tag="h5" className="mb-0">
              Listado de productos
            </CardTitle>
            <Input
              placeholder="Buscar por nombre, SKU o código de barras"
              style={{ maxWidth: '320px' }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="table-responsive">
            <Table hover striped bordered>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Código de barras</th>
                  <th>Precio costo</th>
                  <th>Impuesto %</th>
                  <th>Estado</th>
                  <th>Categorías</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sku}</td>
                    <td className="fw-semibold">{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.barCode}</td>
                    <td>{formatCurrency(product.costPrice ?? 0)}</td>
                    <td>{product.taxPercentage ?? 0}%</td>
                    <td>
                      <Badge color={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td>
                      {product.productCategories?.length ? (
                        product.productCategories.map((category) => (
                          <Badge color="info" pill className="me-1" key={category.id}>
                            {category.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">Sin categorías</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button color="outline-primary" size="sm" onClick={() => handleOpenModal(product)}>
                          Editar
                        </Button>
                        <Button color="outline-danger" size="sm" onClick={() => handleDelete(product)}>
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={9} className="text-center">
                      Cargando productos...
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} toggle={handleCloseModal} size="lg">
        <ModalHeader toggle={handleCloseModal}>
          {editingProduct ? 'Editar producto' : 'Nuevo producto'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="row g-3">
              <div className="col-md-4">
                <FormGroup>
                  <Label for="sku">SKU</Label>
                  <Input id="sku" name="sku" value={formState.sku} onChange={handleChange} required />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="barCode">Código de barras</Label>
                  <Input id="barCode" name="barCode" value={formState.barCode} onChange={handleChange} required />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="brand">Marca</Label>
                  <Input id="brand" name="brand" value={formState.brand} onChange={handleChange} />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="name">Nombre</Label>
                  <Input id="name" name="name" value={formState.name} onChange={handleChange} required />
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <Label for="measureUnit">Unidad de medida</Label>
                  <Input
                    id="measureUnit"
                    name="measureUnit"
                    value={formState.measureUnit}
                    onChange={handleChange}
                    placeholder="Unidad, Caja, Litro, etc"
                  />
                </FormGroup>
              </div>
              <div className="col-md-12">
                <FormGroup>
                  <Label for="description">Descripción</Label>
                  <Input
                    id="description"
                    name="description"
                    type="textarea"
                    rows={3}
                    value={formState.description}
                    onChange={handleChange}
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="costPrice">Precio costo</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.costPrice}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </div>
              <div className="col-md-4">
                <FormGroup>
                  <Label for="taxPercentage">Impuesto (%)</Label>
                  <Input
                    id="taxPercentage"
                    name="taxPercentage"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.taxPercentage}
                    onChange={handleChange}
                  />
                </FormGroup>
              </div>
              <div className="col-md-4 d-flex align-items-center">
                <FormGroup check className="mt-3">
                  <Input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formState.isActive}
                    onChange={handleChange}
                  />
                  <Label for="isActive" check className="ms-2">
                    Activo para la venta
                  </Label>
                </FormGroup>
              </div>
              <div className="col-md-12">
                <FormGroup>
                  <Label for="categoryIds">Categorías</Label>
                  <Input
                    id="categoryIds"
                    name="categoryIds"
                    type="select"
                    multiple
                    value={formState.categoryIds.map(String)}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleCloseModal} type="button">
              Cancelar
            </Button>
            <Button color="primary" type="submit">
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
