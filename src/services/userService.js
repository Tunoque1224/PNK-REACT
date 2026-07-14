const API_URL = "http://localhost:82/PNK-INMOBILIARIA/api/usuarios.php";

export async function obtenerUsuarios() {
  const respuesta = await fetch(API_URL, {
    credentials: "include",
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener los usuarios");
  }

  return await respuesta.json();
}
export async function eliminarUsuario(id) {
  const datos = new FormData();
  datos.append("id", id);

  const respuesta = await fetch(
    "http://localhost:82/PNK-INMOBILIARIA/api/eliminar_usuario.php",
    {
      method: "POST",
      body: datos,
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.mensaje || "Error al eliminar el usuario");
  }

  return resultado;
}
export async function actualizarUsuario(usuario) {
  const datos = new FormData();

  datos.append("id", usuario.id);
  datos.append("nombre", usuario.nombre);
  datos.append("correo", usuario.correo);
  datos.append("rol", usuario.rol);
  datos.append("estado", usuario.estado);

  const respuesta = await fetch(
    "http://localhost:82/PNK-INMOBILIARIA/api/actualizar_usuario.php",
    {
      method: "POST",
      body: datos,
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.mensaje || "Error al actualizar el usuario");
  }

  return resultado;
}
export async function guardarUsuario(usuario) {
  const datos = new FormData();

  datos.append("rut", usuario.rut);
  datos.append("nombre", usuario.nombre);
  datos.append("correo", usuario.correo);
  datos.append("password", usuario.password);
  datos.append("rol", usuario.rol);

  const respuesta = await fetch(
    "http://localhost:82/PNK-INMOBILIARIA/api/guardar_usuario.php",
    {
      method: "POST",
      body: datos,
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok || !resultado.success) {
    throw new Error(resultado.mensaje || "Error al crear el usuario");
  }

  return resultado;
}