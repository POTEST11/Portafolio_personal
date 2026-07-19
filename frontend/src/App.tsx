import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { SectionForm } from "./pages/admin/SectionForm";
import { ItemList } from "./pages/admin/ItemList";
import { ItemForm } from "./pages/admin/ItemForm";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/sections/:id"
          element={<ProtectedRoute><SectionForm /></ProtectedRoute>}
        />
        <Route
          path="/admin/sections/:id/items"
          element={<ProtectedRoute><ItemList /></ProtectedRoute>}
        />
        <Route
          path="/admin/sections/:id/items/:itemId"
          element={<ProtectedRoute><ItemForm /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;