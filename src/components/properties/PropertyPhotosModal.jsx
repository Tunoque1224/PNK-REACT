import { Modal, Button, Row, Col } from "react-bootstrap";

function PropertyPhotosModal({
  show,
  handleClose,
  fotos,
  propiedad,
  handlePrincipal,
  handleEliminarFoto,
}) {
  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Fotografías
          {propiedad?.descripcion
            ? ` - ${propiedad.descripcion}`
            : ""}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {fotos.length === 0 ? (
          <div className="text-center p-4">
            No existen fotografías para esta propiedad.
          </div>
        ) : (
          <Row>
            {fotos.map((foto) => (
              <Col md={4} className="mb-4" key={foto.id}>
                <div className="border rounded p-2 h-100 text-center">
                  <img
                    src={`http://localhost:82/PNK-INMOBILIARIA/${foto.ruta}`}
                    alt="Propiedad"
                    width="100%"
                    height="220"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <div className="mt-3">
                    {Number(foto.principal) === 1 ? (
                      <strong>⭐ Imagen principal</strong>
                    ) : (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                          handlePrincipal(
                            foto.id,
                            foto.id_propiedad
                          )
                        }
                      >
                        ⭐ Hacer principal
                      </Button>
                    )}
                  </div>

                  <div className="mt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleEliminarFoto(
                          foto.id,
                          foto.id_propiedad
                        )
                      }
                    >
                      Eliminar foto
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PropertyPhotosModal;