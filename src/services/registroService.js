const API_URL =
  "http://localhost:82/PNK-INMOBILIARIA/api/registrar_propietario.php";

export async function registrarPropietario(datosRegistro) {
  const datos = new FormData();

  datos.append("rut", datosRegistro.rut);
  datos.append("nombre", datosRegistro.nombre);
  datos.append("correo", datosRegistro.correo);
  datos.append("password", datosRegistro.password);
  datos.append(
    "confirmar_password",
    datosRegistro.confirmarPassword
  );

  const respuesta = await fetch(API_URL, {
    method: "POST",
    body: datos,
  });

  let resultado;

  try {
    resultado = await respuesta.json();
  } catch {
    throw new Error("La API no entregó una respuesta válida.");
  }

  if (!respuesta.ok || !resultado.success) {
    throw new Error(
      resultado.mensaje || "No se pudo completar el registro."
    );
  }

  return resultado;
}