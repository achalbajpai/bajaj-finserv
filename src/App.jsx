import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

function App() {
   const [showSplash, setShowSplash] = useState(true);

   const handleSplashFinish = () => {
      setShowSplash(false);
   };

   return (
      <>
         {showSplash ? (
            <SplashScreen onFinish={handleSplashFinish} />
         ) : (
            <BrowserRouter>
               <Routes>
                  <Route path="/" element={<HomePage />} />
               </Routes>
            </BrowserRouter>
         )}
      </>
   );
}

export default App;
