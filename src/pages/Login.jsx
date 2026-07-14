import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import { loginUser, saveSession } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Debe ingresar correo y contraseña.",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        correo,
        password,
      });

      saveSession(response.data.user);

      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola ${response.data.user.nombre}`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (response.data.user.rol === "Administrador") {
        navigate("/dashboard");
      } else {
        navigate("/propiedades");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow" style={{ width: "420px" }}>
        <Card.Body>

          <h3 className="text-center mb-4">
            PNK Inmobiliaria
          </h3>

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>

              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>

              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
            <div className="text-center mt-4">
  <p className="mb-2">
    ¿No tienes cuenta?
  </p>

  <Button
    variant="link"
    onClick={() => navigate("/registro")}
  >
    Regístrate aquí
  </Button>
</div>
<hr />

<Button
  variant="outline-secondary"
  className="w-100"
  onClick={() => navigate("/catalogo")}
>
  Volver al catálogo
</Button>

          </Form>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;