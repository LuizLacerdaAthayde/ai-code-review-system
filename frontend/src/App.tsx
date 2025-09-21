import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import SubmitPage from "./pages/SubmitPage";
import HistoryPage from "./pages/HistoryPage";
import DashboardPage from "./pages/DashboardPage";

export default function App(){
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SubmitPage/>}/>
          <Route path="/submit" element={<SubmitPage/>}/>
          <Route path="/history" element={<HistoryPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
