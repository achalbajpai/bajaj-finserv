import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/FilterPanel.css";

const FilterPanel = ({ specialties }) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [expandedSections, setExpandedSections] = useState({
      sort: true,
      specialities: true,
      consultation: true,
   });
   const [specialtySearchTerm, setSpecialtySearchTerm] = useState("");

   // Get current filter values from URL
   const consultMode = searchParams.get("consultMode") || "";
   const selectedSpecialties = searchParams.getAll("specialty") || [];
   const sortBy = searchParams.get("sortBy") || "";

   const toggleSection = (section) => {
      setExpandedSections((prev) => ({
         ...prev,
         [section]: !prev[section],
      }));
   };

   const handleConsultModeChange = (mode) => {
      const newParams = new URLSearchParams(searchParams);

      if (mode) {
         newParams.set("consultMode", mode);
      } else {
         newParams.delete("consultMode");
      }

      setSearchParams(newParams);
   };

   const handleSpecialtyChange = (specialty) => {
      const newParams = new URLSearchParams(searchParams);

      if (selectedSpecialties.includes(specialty)) {
         // Remove the specialty
         const updatedSpecialties = selectedSpecialties.filter(
            (s) => s !== specialty
         );
         newParams.delete("specialty");
         updatedSpecialties.forEach((s) => newParams.append("specialty", s));
      } else {
         // Add the specialty
         newParams.append("specialty", specialty);
      }

      setSearchParams(newParams);
   };

   const handleSortChange = (sortOption) => {
      const newParams = new URLSearchParams(searchParams);

      if (sortOption) {
         newParams.set("sortBy", sortOption);
      } else {
         newParams.delete("sortBy");
      }

      setSearchParams(newParams);
   };

   const handleClearAll = () => {
      setSearchParams({});
      setSpecialtySearchTerm("");
   };

   // Filter specialties based on search term
   const filteredSpecialties = specialties.filter((spec) =>
      spec.toLowerCase().includes(specialtySearchTerm.toLowerCase())
   );

   // Handle specialty search input change
   const handleSpecialtySearch = (e) => {
      setSpecialtySearchTerm(e.target.value);
   };

   return (
      <div className="filter-panel">
         <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-all-btn" onClick={handleClearAll}>
               Clear All
            </button>
         </div>

         {/* Sort by section */}
         <div className="filter-section">
            <div
               className="filter-header"
               onClick={() => toggleSection("sort")}
            >
               <h4 data-testid="filter-header-sort">Sort by</h4>
               <span
                  className={`chevron ${expandedSections.sort ? "up" : "down"}`}
               >
                  ▾
               </span>
            </div>

            {expandedSections.sort && (
               <div className="filter-options">
                  <label className="radio-label">
                     <input
                        type="radio"
                        name="sortBy"
                        value="fees"
                        checked={sortBy === "fees"}
                        onChange={() => handleSortChange("fees")}
                        data-testid="sort-fees"
                     />
                     <span>Price: Low-High</span>
                  </label>
                  <label className="radio-label">
                     <input
                        type="radio"
                        name="sortBy"
                        value="experience"
                        checked={sortBy === "experience"}
                        onChange={() => handleSortChange("experience")}
                        data-testid="sort-experience"
                     />
                     <span>Experience: Most Experience first</span>
                  </label>
               </div>
            )}
         </div>

         {/* Specialities section */}
         <div className="filter-section">
            <div
               className="filter-header"
               onClick={() => toggleSection("specialities")}
            >
               <h4 data-testid="filter-header-speciality">Specialities</h4>
               <span
                  className={`chevron ${
                     expandedSections.specialities ? "up" : "down"
                  }`}
               >
                  ▾
               </span>
            </div>

            {expandedSections.specialities && (
               <div className="filter-options search-filter">
                  <div className="specialty-search">
                     <input
                        type="text"
                        placeholder="Search specialities"
                        value={specialtySearchTerm}
                        onChange={handleSpecialtySearch}
                     />
                  </div>
                  <div className="specialty-options">
                     {!specialtySearchTerm && (
                        <>
                           <label className="checkbox-label">
                              <input
                                 type="checkbox"
                                 value="General Physician"
                                 checked={selectedSpecialties.includes(
                                    "General Physician"
                                 )}
                                 onChange={() =>
                                    handleSpecialtyChange("General Physician")
                                 }
                                 data-testid="filter-specialty-General-Physician"
                              />
                              <span>General Physician</span>
                           </label>
                           <label className="checkbox-label">
                              <input
                                 type="checkbox"
                                 value="Neurologist"
                                 checked={selectedSpecialties.includes(
                                    "Neurologist"
                                 )}
                                 onChange={() =>
                                    handleSpecialtyChange("Neurologist")
                                 }
                                 data-testid="filter-specialty-Neurologist"
                              />
                              <span>Neurologist</span>
                           </label>
                           <label className="checkbox-label">
                              <input
                                 type="checkbox"
                                 value="Oncologist"
                                 checked={selectedSpecialties.includes(
                                    "Oncologist"
                                 )}
                                 onChange={() =>
                                    handleSpecialtyChange("Oncologist")
                                 }
                                 data-testid="filter-specialty-Oncologist"
                              />
                              <span>Oncologist</span>
                           </label>
                           <label className="checkbox-label">
                              <input
                                 type="checkbox"
                                 value="Ayurveda"
                                 checked={selectedSpecialties.includes(
                                    "Ayurveda"
                                 )}
                                 onChange={() =>
                                    handleSpecialtyChange("Ayurveda")
                                 }
                                 data-testid="filter-specialty-Ayurveda"
                              />
                              <span>Ayurveda</span>
                           </label>
                           <label className="checkbox-label">
                              <input
                                 type="checkbox"
                                 value="Homeopath"
                                 checked={selectedSpecialties.includes(
                                    "Homeopath"
                                 )}
                                 onChange={() =>
                                    handleSpecialtyChange("Homeopath")
                                 }
                                 data-testid="filter-specialty-Homeopath"
                              />
                              <span>Homeopath</span>
                           </label>
                        </>
                     )}

                     {/* Show filtered specialties when searching */}
                     {specialtySearchTerm
                        ? filteredSpecialties.map((specialty) => (
                             <label key={specialty} className="checkbox-label">
                                <input
                                   type="checkbox"
                                   value={specialty}
                                   checked={selectedSpecialties.includes(
                                      specialty
                                   )}
                                   onChange={() =>
                                      handleSpecialtyChange(specialty)
                                   }
                                   data-testid={`filter-specialty-${specialty.replace(
                                      /\//g,
                                      "-"
                                   )}`}
                                />
                                <span>{specialty}</span>
                             </label>
                          ))
                        : // Show remaining specialties when not searching
                          specialties
                             .filter(
                                (spec) =>
                                   ![
                                      "General Physician",
                                      "Neurologist",
                                      "Oncologist",
                                      "Ayurveda",
                                      "Homeopath",
                                   ].includes(spec)
                             )
                             .map((specialty) => (
                                <label
                                   key={specialty}
                                   className="checkbox-label"
                                >
                                   <input
                                      type="checkbox"
                                      value={specialty}
                                      checked={selectedSpecialties.includes(
                                         specialty
                                      )}
                                      onChange={() =>
                                         handleSpecialtyChange(specialty)
                                      }
                                      data-testid={`filter-specialty-${specialty.replace(
                                         /\//g,
                                         "-"
                                      )}`}
                                   />
                                   <span>{specialty}</span>
                                </label>
                             ))}
                  </div>
               </div>
            )}
         </div>

         {/* Mode of consultation section */}
         <div className="filter-section">
            <div
               className="filter-header"
               onClick={() => toggleSection("consultation")}
            >
               <h4 data-testid="filter-header-moc">Mode of consultation</h4>
               <span
                  className={`chevron ${
                     expandedSections.consultation ? "up" : "down"
                  }`}
               >
                  ▾
               </span>
            </div>

            {expandedSections.consultation && (
               <div className="filter-options">
                  <label className="radio-label">
                     <input
                        type="radio"
                        name="consultMode"
                        value="Video Consult"
                        checked={consultMode === "Video Consult"}
                        onChange={() =>
                           handleConsultModeChange("Video Consult")
                        }
                        data-testid="filter-video-consult"
                     />
                     <span>Video Consultation</span>
                  </label>
                  <label className="radio-label">
                     <input
                        type="radio"
                        name="consultMode"
                        value="In Clinic"
                        checked={consultMode === "In Clinic"}
                        onChange={() => handleConsultModeChange("In Clinic")}
                        data-testid="filter-in-clinic"
                     />
                     <span>In-clinic Consultation</span>
                  </label>
                  <label className="radio-label">
                     <input
                        type="radio"
                        name="consultMode"
                        value=""
                        checked={consultMode === ""}
                        onChange={() => handleConsultModeChange("")}
                     />
                     <span>All</span>
                  </label>
               </div>
            )}
         </div>
      </div>
   );
};

export default FilterPanel;
