import { Modal, Button, Form } from "react-bootstrap";

function UserFormModal({
  show,
  handleClose,
  usuario,
  handleChange,
  handleGuardar,
}) {
  const editando = Boolean(usuario.id);

  function handleSubmit(event) {
    event.preventDefault();
    handleGuardar();
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {editando ? "Editar Usuario" : "Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>RUT</Form.Label>
            <Form.Control
              type="text"
              name="rut"
              placeholder="12.345.678-9"
              value={usuario.rut || ""}
              onChange={handleChange}
              disabled={editando}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={usuario.nombre || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={usuario.correo || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {!editando && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={usuario.password || ""}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                Debe tener al menos 8 caracteres.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={usuario.rol || "Propietario"}
              onChange={handleChange}
              required
            >
              <option value="Administrador">Administrador</option>
              <option value="Propietario">Propietario</option>
              <option value="Gestor">Gestor</option>
            </Form.Select>
          </Form.Group>

          {editando && (
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={usuario.estado || "Activo"}
                onChange={handleChange}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Bloqueado">Bloqueado</option>
              </Form.Select>
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button variant="primary" type="submit">
            {editando ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;