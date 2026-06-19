import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Portfolio } from "./pages/Portfolio";
import { KYC } from "./pages/KYC";
import { DataRoom } from "./pages/DataRoom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/dataroom" element={<DataRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
