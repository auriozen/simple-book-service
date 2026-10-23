import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Catalog from "./pages/Catalog.jsx";
import ManageBooks from "./pages/ManageBooks.jsx";

function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/manage" element={<ManageBooks />} />
      </Routes>
    </>
  );
}

export default App;
