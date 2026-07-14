import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">

      <h2>Acceso denegado</h2>

      <p>
        No tiene permisos para acceder a esta página.
      </p>

      <Button
        variant="primary"
        onClick={() => navigate("/login")}
      >
        Volver al Login
      </Button>

    </Container>
  );
}

export default Unauthorized;