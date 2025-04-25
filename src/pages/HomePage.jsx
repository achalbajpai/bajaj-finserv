import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import DoctorList from "../components/DoctorList";
import useDoctors from "../hooks/useDoctors";
import { filterDoctors, getUniqueSpecialties } from "../utils/filterUtils";
import "../styles/HomePage.css";

const HomePage = () => {
   const { doctors, loading, error } = useDoctors();
   const [searchParams] = useSearchParams();

   // Get filter values from URL parameters
   const searchTerm = searchParams.get("search") || "";
   const consultMode = searchParams.get("consultMode") || "";
   const specialties = searchParams.getAll("specialty") || [];
   const sortBy = searchParams.get("sortBy") || "";

   // Extract unique specialties for filter options
   const uniqueSpecialties = useMemo(() => {
      return getUniqueSpecialties(doctors);
   }, [doctors]);

   // Apply filters to doctors
   const filteredDoctors = useMemo(() => {
      return filterDoctors(doctors, {
         searchTerm,
         consultMode,
         specialties,
         sortBy,
      });
   }, [doctors, searchTerm, consultMode, specialties, sortBy]);

   if (loading) {
      return (
         <div className="app-container">
            <SearchBar doctors={[]} />
            <div className="loading-container">
               <div className="loading-spinner"></div>
               <p>Loading doctor information...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="app-container">
            <SearchBar doctors={[]} />
            <div className="error-container">
               <h2>Error</h2>
               <p>{error}</p>
               <button onClick={() => window.location.reload()}>
                  Try Again
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="app-container">
         <SearchBar doctors={doctors} />

         <div className="content-container">
            <aside className="filter-sidebar">
               <FilterPanel specialties={uniqueSpecialties} />
            </aside>

            <main className="doctors-container">
               <DoctorList doctors={filteredDoctors} />
            </main>
         </div>
      </div>
   );
};

export default HomePage;
