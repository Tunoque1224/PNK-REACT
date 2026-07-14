import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { registrarPropietario } from "../services/registroService.js";

function limpiarRut(rut) {
  return rut
    .replace(/\./g, "")
    .replace(/-/g, "")
    .toUpperCase();
}

function validarRut(rutCompleto) {
  const rutLimpio = limpiarRut(rutCompleto);

  if (!/^\d{7,8}[0-9K]$/.test(rutLimpio)) {
    return false;
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const digitoIngresado = rutLimpio.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;

    multiplicador =
      multiplicador === 7
        ? 2
        : multiplicador + 1;
  }

  const resultado = 11 - (suma % 11);

  let digitoCalculado;

  if (resultado === 11) {
    digitoCalculado = "0";
  } else if (resultado === 10) {
    digitoCalculado = "K";
  } else {
    digitoCalculado = String(resultado);
  }

  return digitoIngresado === digitoCalculado;
}

function validarNombre(nombre) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(
    nombre.trim()
  );
}

function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    correo.trim()
  );
}

function validarPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function RegistroPropietario() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    rut: "",
    nombre: "",
    correo: "",
    password: "",
    confirmarPassword: "",
  });

  const [cargando, setCargando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const rut = formulario.rut.trim();
    const nombre = formulario.nombre.trim();
    const correo = formulario.correo.trim();
    const password = formulario.password;
    const confirmarPassword =
      formulario.confirmarPassword;

    if (
      !rut ||
      !nombre ||
      !correo ||
      !password ||
      !confirmarPassword
    ) {
      await Swal.fire(
        "Campos incompletos",
        "Debe completar todos los campos.",
        "warning"
      );

      return;
    }

    if (!validarRut(rut)) {
      await Swal.fire(
        "RUT inválido",
        "Ingrese un RUT chileno válido.",
        "warning"
      );

      return;
    }

    if (!validarNombre(nombre)) {
      await Swal.fire(
        "Nombre inválido",
        "El nombre solo puede contener letras y espacios.",
        "warning"
      );

      return;
    }

    if (!validarCorreo(correo)) {
      await Swal.fire(
        "Correo inválido",
        "Ingrese un correo electrónico válido.",
        "warning"
      );

      return;
    }

    if (!validarPassword(password)) {
      await Swal.fire(
        "Contraseña inválida",
        "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
        "warning"
      );

      return;
    }

    if (password !== confirmarPassword) {
      await Swal.fire(
        "Contraseñas diferentes",
        "Las contraseñas no coinciden.",
        "warning"
      );

      return;
    }

    try {
      setCargando(true);

      const resultado = await registrarPropietario({
        rut,
        nombre,
        correo,
        password,
        confirmarPassword,
      });

      await Swal.fire(
        "Registro exitoso",
        resultado.mensaje,
        "success"
      );

      navigate("/login");
    } catch (error) {
      await Swal.fire(
        "Error",
        error.message || "No se pudo completar el registro.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }

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
        <Card
          className="shadow mx-auto"
          style={{
            width: "100%",
            maxWidth: "520px",
          }}
        >
          <Card.Body className="p-4">
            <h2 className="text-center mb-3">
              Registro de Propietario
            </h2>

            <p className="text-muted text-center mb-4">
              Complete sus datos. La cuenta quedará pendiente
              de aprobación.
            </p>

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>RUT</Form.Label>

                <Form.Control
                  type="text"
                  name="rut"
                  placeholder="12.345.678-5"
                  value={formulario.rut}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>

                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>

                <Form.Control
                  type="email"
                  name="correo"
                  placeholder="correo@ejemplo.cl"
                  value={formulario.correo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>

                <Form.Control
                  type="password"
                  name="password"
                  value={formulario.password}
                  onChange={handleChange}
                  required
                />

                <Form.Text className="text-muted">
                  Mínimo 8 caracteres, una mayúscula, una
                  minúscula, un número y un símbolo.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  Confirmar contraseña
                </Form.Label>

                <Form.Control
                  type="password"
                  name="confirmarPassword"
                  value={formulario.confirmarPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RegistroPropietario;