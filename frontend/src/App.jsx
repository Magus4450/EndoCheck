import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
const queryClient = new QueryClient();
function App() {
  return (
    <div className="App h-screen">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <React.StrictMode>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/about" element={<About />} /> */}
            </Routes>
          </React.StrictMode>
          {/* <Footer /> */}
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
