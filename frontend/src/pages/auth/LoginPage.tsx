import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import { useAppDispatch } from '@hooks/redux';
import { useAuth } from '@hooks/useAuth';
import { login } from '@features/auth/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname ?? '/dashboard';
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(login(credentials));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow-sm" style={{ width: '420px' }}>
        <CardBody className="p-4">
          <CardTitle tag="h4" className="mb-3 text-center fw-bold">
            POS PYMEs - Acceso
          </CardTitle>
          <p className="text-muted text-center mb-4">
            Ingrese sus credenciales para continuar gestionando el punto de venta.
          </p>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="username">Usuario o correo</Label>
              <Input
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="admin@pos.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </FormGroup>
            {error && <div className="text-danger mb-3">{error}</div>}
            <Button color="primary" type="submit" block disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Ingresar'}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
