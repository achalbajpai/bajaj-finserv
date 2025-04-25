import React from "react";
import DoctorCard from "./DoctorCard";
import "../styles/DoctorList.css";

const DoctorList = ({ doctors }) => {
   // Ensure doctors is always an array even if invalid data is passed
   const validDoctors = Array.isArray(doctors) ? doctors : [];

   // Helper to safely render each doctor card with error handling
   const renderDoctorCard = (doctor, index) => {
      try {
         // Only render if doctor is an object
         if (doctor && typeof doctor === "object") {
            return <DoctorCard key={doctor.id || index} doctor={doctor} />;
         }
         return null;
      } catch (error) {
         console.error("Error rendering doctor card:", error);
         return null;
      }
   };

   return (
      <div className="doctor-list">
         {validDoctors.length > 0 ? (
            validDoctors.map(renderDoctorCard)
         ) : (
            <div className="no-results">
               <h3>No doctors found</h3>
               <p>Try adjusting your filters or search term</p>
            </div>
         )}
      </div>
   );
};

export default DoctorList;
