import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import AppWorkspace from "@/pages/AppWorkspace";
import "@/App.css";

function App() {
  return (
    <div className="App min-h-screen bg-[#09090b]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/app/:appId" element={<AppWorkspace />} />
        </Routes>
      </BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#121212',
            border: '1px solid #27272a',
            color: '#ededed',
          },
        }}
      />
    </div>
  );
}

export default App;
