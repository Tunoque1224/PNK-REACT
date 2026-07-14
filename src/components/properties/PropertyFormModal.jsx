import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function PropertyFormModal({
  show,
  handleClose,
  propiedad,
  handleChange,
  handleCaracteristicaChange,
  handleFotosChange,
  handleGuardar,
  propietarios,
  esAdministrador,
}) {
  const esTerreno = propiedad.tipo === "Terreno";
  const esDepartamento = propiedad.tipo === "Departamento";
  const editando = Boolean(propiedad.id);

  const fechaActual = new Date().toISOString().split("T")[0];

  function handleSubmit(event) {
    event.preventDefault();
    handleGuardar();
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editando ? "Editar Propiedad" : "Nueva Propiedad"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} noValidate>
        <Modal.Body>
            {esAdministrador && !editando && (
  <Row>
    <Col md={12}>
      <Form.Group className="mb-3">
        <Form.Label>Propietario</Form.Label>

        <Form.Select
          name="id_propietario_admin"
          value={propiedad.id_propietario_admin || ""}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un propietario...</option>

          {propietarios.map((propietario) => (
            <option
              key={propietario.id}
              value={propietario.id}
            >
              {propietario.nombre} - {propietario.correo}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Col>
  </Row>
)}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de propiedad</Form.Label>

                <Form.Select
                  name="tipo"
                  value={propiedad.tipo || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>

                <Form.Control
                  type="text"
                  name="descripcion"
                  value={propiedad.descripcion || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Comuna</Form.Label>

                <Form.Control
                  type="text"
                  name="comuna"
                  value={propiedad.comuna || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sector</Form.Label>

                <Form.Control
                  type="text"
                  name="sector"
                  value={propiedad.sector || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {!esTerreno && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Dormitorios</Form.Label>

                  <Form.Control
                    type="number"
                    name="dormitorios"
                    min="0"
                    value={propiedad.dormitorios ?? ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Baños</Form.Label>

                  <Form.Control
                    type="number"
                    name="banos"
                    min="0"
                    value={propiedad.banos ?? ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio CLP</Form.Label>

                <Form.Control
                  type="number"
                  name="precio"
                  min="1"
                  value={propiedad.precio || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio UF</Form.Label>

                <Form.Control
                  type="text"
                  name="precioUF"
                  value={propiedad.precioUF || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {!esTerreno && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Área construida (m²)</Form.Label>

                  <Form.Control
                    type="number"
                    name="areaConstruida"
                    min="0"
                    value={propiedad.areaConstruida ?? ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            )}

            {!esDepartamento && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Área terreno (m²)</Form.Label>

                  <Form.Control
                    type="number"
                    name="areaTerreno"
                    min="0"
                    value={propiedad.areaTerreno ?? ""}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de publicación</Form.Label>

                <Form.Control
                  type="date"
                  name="fecha"
                  max={fechaActual}
                  value={propiedad.fecha || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Solicitar visita</Form.Label>

                <Form.Select
                  name="visita"
                  value={propiedad.visita || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {!esTerreno && (
  <Form.Group className="mb-3">
    <Form.Label>Características</Form.Label>

    <div className="d-flex flex-wrap gap-3">
      {[
        "Bodega",
        "Estacionamiento",
        "Logia",
        "Cocina Amoblada",
        "Antejardín",
        "Patio Trasero",
        "Piscina",
      ].map((caracteristica) => (
        <Form.Check
          key={caracteristica}
          type="checkbox"
          label={caracteristica}
          value={caracteristica}
          checked={
            propiedad.caracteristicas?.includes(caracteristica) || false
          }
          onChange={handleCaracteristicaChange}
        />
      ))}
    </div>
  </Form.Group>
)}

          {!editando && (
            <Form.Group className="mb-3">
              <Form.Label>Fotografías</Form.Label>

              <Form.Control
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                onChange={handleFotosChange}
              />

              <Form.Text className="text-muted">
                Puede seleccionar entre 1 y 10 imágenes.
              </Form.Text>
            </Form.Group>
          )}

          {propiedad.fotos?.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {Array.from(propiedad.fotos).map((foto, indice) => (
                <img
                  key={`${foto.name}-${indice}`}
                  src={URL.createObjectURL(foto)}
                  alt={`Vista previa ${indice + 1}`}
                  width="120"
                  height="90"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ))}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button variant="primary" type="submit">
            {editando ? "Guardar Cambios" : "Guardar Propiedad"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PropertyFormModal;