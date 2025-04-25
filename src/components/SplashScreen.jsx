import React, { useEffect, useState } from "react";
import "../styles/SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
   const [visible, setVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setVisible(false);
         if (onFinish) {
            onFinish();
         }
      }, 2000); // 5 seconds

      return () => clearTimeout(timer);
   }, [onFinish]);

   if (!visible) return null;

   return (
      <div className="splash-screen">
         <div className="splash-content">
            <img src="/init.png" alt="Bajaj Finserv" className="splash-logo" />
         </div>
      </div>
   );
};

export default SplashScreen;
