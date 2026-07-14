import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { obtenerDetallePropiedad } from "../services/publicPropertyService.js";

function DetallePropiedad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [propiedad, setPropiedad] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarDetalle() {
      try {
        setCargando(true);

        const resultado = await obtenerDetallePropiedad(id);

        setPropiedad(resultado.propiedad);
        setFotos(resultado.fotos || []);
        setError("");
      } catch (error) {
        setError(
          error.message || "No se pudo cargar la propiedad."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarDetalle();
  }, [id]);

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">Cargando propiedad...</p>
        </div>
      </div>
    );
  }

  if (error || !propiedad) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || "La propiedad no está disponible."}
        </Alert>

        <Button onClick={() => navigate("/catalogo")}>
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  const caracteristicas = propiedad.caracteristicas
    ? propiedad.caracteristicas
        .split(",")
        .map((caracteristica) => caracteristica.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand mb-0 h1">
          PNK Inmobiliaria
        </span>

        <Button
          variant="outline-light"
          onClick={() => navigate("/catalogo")}
        >
          Volver al catálogo
        </Button>
      </nav>

      <Container className="py-5">
        <Row className="g-4">
          <Col lg={7}>
            <Card className="shadow-sm overflow-hidden">
              {fotos.length > 0 ? (
                <Carousel>
                  {fotos.map((foto) => (
                    <Carousel.Item key={foto.id}>
                      <img
                        className="d-block w-100"
                        src={`http://localhost:82/PNK-INMOBILIARIA/${foto.ruta}`}
                        alt="Fotografía de la propiedad"
                        style={{
                          height: "480px",
                          objectFit: "cover",
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center bg-secondary-subtle"
                  style={{ height: "480px" }}
                >
                  Sin fotografías disponibles
                </div>
              )}
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="shadow-sm h-100">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <Badge bg="primary" className="mb-2">
                      {propiedad.tipo}
                    </Badge>

                    <h2>{propiedad.descripcion}</h2>
                  </div>
                </div>

                <h3 className="text-primary mb-4">
                  $
                  {Number(propiedad.precio || 0).toLocaleString(
                    "es-CL"
                  )}
                </h3>

                <p>
                  <strong>Precio UF:</strong>{" "}
                  {propiedad.precioUF} UF
                </p>

                <p>
                  <strong>Ubicación:</strong>{" "}
                  {propiedad.comuna}, {propiedad.sector}
                </p>

                <p>
                  <strong>Fecha de publicación:</strong>{" "}
                  {propiedad.fecha}
                </p>

                <hr />

                <Row className="g-3 text-center">
                  {propiedad.tipo !== "Terreno" && (
                    <>
                      <Col xs={6}>
                        <div className="border rounded p-3">
                          <div className="fs-3">🛏️</div>
                          <strong>
                            {propiedad.dormitorios}
                          </strong>
                          <div>Dormitorios</div>
                        </div>
                      </Col>

                      <Col xs={6}>
                        <div className="border rounded p-3">
                          <div className="fs-3">🚿</div>
                          <strong>{propiedad.banos}</strong>
                          <div>Baños</div>
                        </div>
                      </Col>
                    </>
                  )}

                  {propiedad.tipo !== "Terreno" && (
                    <Col xs={6}>
                      <div className="border rounded p-3">
                        <div className="fs-3">🏠</div>
                        <strong>
                          {propiedad.areaConstruida} m²
                        </strong>
                        <div>Área construida</div>
                      </div>
                    </Col>
                  )}

                  {propiedad.tipo !== "Departamento" && (
                    <Col xs={6}>
                      <div className="border rounded p-3">
                        <div className="fs-3">📐</div>
                        <strong>
                          {propiedad.areaTerreno} m²
                        </strong>
                        <div>Área terreno</div>
                      </div>
                    </Col>
                  )}
                </Row>

                {caracteristicas.length > 0 && (
                  <>
                    <hr />

                    <h5>Características</h5>

                    <div className="d-flex flex-wrap gap-2">
                      {caracteristicas.map((caracteristica) => (
                        <Badge
                          bg="secondary"
                          key={caracteristica}
                          className="p-2"
                        >
                          ✓ {caracteristica}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                <hr />

                <p className="mb-0">
                  <strong>Visitas disponibles:</strong>{" "}
                  {propiedad.visita}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DetallePropiedad;