import { Explore } from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { RegisterProperty } from "./pages/RegisterProperty";
import { Home } from "./pages/Home";
import { PropertyPage } from "./pages/PropertyPage";
import "./styles/styles.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new-property" element={<RegisterProperty />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/property/:id" element={<PropertyPage />} />
    </Routes>
  );
}

export default App;
