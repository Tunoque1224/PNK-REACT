import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";
import PropertyList from "../components/properties/PropertyList.jsx";
import UserList from "../components/users/UserList.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRoute from "./RoleRoute.jsx";
import { getUser } from "../services/authService.js";
import CatalogoPublico from "../pages/CatalogoPublico.jsx";
import DetallePropiedad from "../pages/DetallePropiedad.jsx";
import RegistroPropietario from "../pages/RegistroPropietario.jsx";
function StartRedirect() {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.rol === "Administrador") {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.rol === "Propietario") {
    return <Navigate to="/propiedades" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogoPublico />} />
        <Route path="/catalogo" element={<CatalogoPublico />} />
        <Route path="/detalle/:id" element={<DetallePropiedad />} />
        <Route path="/registro" element={<RegistroPropietario />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<StartRedirect />} />

          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={["Administrador"]}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/propiedades"
            element={
              <RoleRoute
                allowedRoles={[
                  "Administrador",
                  "Propietario",
                ]}
              >
                <PropertyList />
              </RoleRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <RoleRoute allowedRoles={["Administrador"]}>
                <UserList />
              </RoleRoute>
            }
          />
        </Route>

        <Route path="*" element={<StartRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;