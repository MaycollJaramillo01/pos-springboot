import { useEffect, useState } from 'react';
import {
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
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from '@features/categories/categorySlice';
import { Category } from '@types/category';

const defaultForm = {
  name: '',
  description: ''
};

type CategoryFormState = typeof defaultForm;

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { items: categories, loading } = useAppSelector((state) => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [formState, setFormState] = useState<CategoryFormState>(defaultForm);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpen = (category?: Category) => {
    if (category) {
      setEditing(category);
      setFormState({ name: category.name, description: category.description ?? '' });
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editing) {
      await dispatch(updateCategory({ id: editing.id, data: formState }));
    } else {
      await dispatch(createCategory(formState));
    }
    handleClose();
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`¿Eliminar la categoría ${category.name}?`)) {
      await dispatch(deleteCategory(category.id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Categorías</h2>
          <p className="text-muted mb-0">Clasifique los productos para mejorar los reportes y filtros.</p>
        </div>
        <Button color="primary" onClick={() => handleOpen()}>
          Nueva categoría
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardBody>
          <CardTitle tag="h5">Listado de categorías</CardTitle>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td className="fw-semibold">{category.name}</td>
                  <td>{category.description ?? '-'}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button color="outline-primary" size="sm" onClick={() => handleOpen(category)}>
                        Editar
                      </Button>
                      <Button color="outline-danger" size="sm" onClick={() => handleDelete(category)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No hay categorías registradas
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Cargando categorías...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={showModal} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>
          {editing ? 'Editar categoría' : 'Nueva categoría'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                type="textarea"
                rows={4}
                value={formState.description}
                onChange={(event) => setFormState({ ...formState, description: event.target.value })}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" type="button" onClick={handleClose}>
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

export default CategoriesPage;
