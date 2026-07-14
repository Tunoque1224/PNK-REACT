import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerPropiedadesPublicas } from "../services/publicPropertyService.js";
import { getUser } from "../services/authService.js";


function CatalogoPublico() {
  const navigate = useNavigate();

  const usuario = getUser();

  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [tipoFiltro, setTipoFiltro] = useState("");
  const [comunaFiltro, setComunaFiltro] = useState("");
  const [sectorFiltro, setSectorFiltro] = useState("");
  

  useEffect(() => {
    async function cargarPropiedades() {
      try {
        const datos = await obtenerPropiedadesPublicas();
        setPropiedades(datos);
      } catch (error) {
        await Swal.fire(
          "Error",
          error.message || "No se pudieron cargar las propiedades.",
          "error"
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPropiedades();
  }, []);
  const propiedadesFiltradas = propiedades.filter((propiedad) => {
  const coincideTipo =
    tipoFiltro === "" || propiedad.tipo === tipoFiltro;

  const coincideComuna =
    comunaFiltro.trim() === "" ||
    propiedad.comuna
      ?.toLowerCase()
      .includes(comunaFiltro.trim().toLowerCase());

  const coincideSector =
    sectorFiltro.trim() === "" ||
    propiedad.sector
      ?.toLowerCase()
      .includes(sectorFiltro.trim().toLowerCase());

  return coincideTipo && coincideComuna && coincideSector;
});

function limpiarFiltros() {
  setTipoFiltro("");
  setComunaFiltro("");
  setSectorFiltro("");
}

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">
          PNK Inmobiliaria
        </span>

        <div className="d-flex gap-2">
  {!usuario && (
    <Button
      variant="outline-warning"
      onClick={() => navigate("/registro")}
    >
      Registrarse
    </Button>
  )}

  <Button
    variant="outline-light"
    onClick={() => {
      if (usuario?.rol === "Administrador") {
        navigate("/dashboard");
      } else if (usuario?.rol === "Propietario") {
        navigate("/propiedades");
      } else {
        navigate("/login");
      }
    }}
  >
    {usuario ? "Volver al panel" : "Iniciar sesión"}
  </Button>
</div>
      </nav>

      <Container className="py-5">
        <div className="text-center mb-5">
          <h1>Propiedades disponibles</h1>
          <p className="text-muted">
            Encuentra casas, departamentos y terrenos publicados.
          </p>
        </div>
        <Card className="shadow-sm mb-5">
  <Card.Body>
    <Row className="g-3 align-items-end">
      <Col xs={12} md={3}>
        <Form.Group>
          <Form.Label>Tipo de propiedad</Form.Label>

          <Form.Select
            value={tipoFiltro}
            onChange={(event) =>
              setTipoFiltro(event.target.value)
            }
          >
            <option value="">Todos los tipos</option>
            <option value="Casa">Casa</option>
            <option value="Departamento">Departamento</option>
            <option value="Terreno">Terreno</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col xs={12} md={3}>
        <Form.Group>
          <Form.Label>Comuna</Form.Label>

          <Form.Control
            type="text"
            placeholder="Ejemplo: La Serena"
            value={comunaFiltro}
            onChange={(event) =>
              setComunaFiltro(event.target.value)
            }
          />
        </Form.Group>
      </Col>

      <Col xs={12} md={3}>
        <Form.Group>
          <Form.Label>Sector</Form.Label>

          <Form.Control
            type="text"
            placeholder="Ejemplo: El Milagro"
            value={sectorFiltro}
            onChange={(event) =>
              setSectorFiltro(event.target.value)
            }
          />
        </Form.Group>
      </Col>

      <Col xs={12} md={3}>
        <Button
          variant="secondary"
          className="w-100"
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </Button>
      </Col>
    </Row>
  </Card.Body>
</Card>

        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3">Cargando propiedades...</p>
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div className="alert alert-info text-center">
            No se encontraron propiedades con los filtros seleccionados.
          </div>
        ) : (
          <Row className="g-4">
            {propiedadesFiltradas.map((propiedad) => (
              <Col key={propiedad.id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  {propiedad.imagen_principal ? (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:82/PNK-INMOBILIARIA/${propiedad.imagen_principal}`}
                      alt={propiedad.descripcion}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary-subtle"
                      style={{ height: "220px" }}
                    >
                      Sin imagen
                    </div>
                  )}

                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{propiedad.tipo}</Card.Title>

                    <Card.Text>
                      {propiedad.descripcion}
                    </Card.Text>

                    <p className="mb-1">
                      <strong>Comuna:</strong> {propiedad.comuna}
                    </p>

                    <p className="mb-3">
                      <strong>Sector:</strong> {propiedad.sector}
                    </p>

                    <h5 className="mt-auto">
                      ${Number(propiedad.precio || 0).toLocaleString("es-CL")}
                    </h5>

                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() =>
                        navigate(`/detalle/${propiedad.id}`)
                      }
                    >
                      Ver detalle
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default CatalogoPublico;