import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/SearchBar.css";

const SearchBar = ({ doctors }) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const suggestionsRef = useRef(null);

   // Initialize search term from URL params
   useEffect(() => {
      const termFromParams = searchParams.get("search");
      if (termFromParams) {
         setSearchTerm(termFromParams);
      }
   }, [searchParams]);

   // Handle click outside to close suggestions
   useEffect(() => {
      function handleClickOutside(event) {
         if (
            suggestionsRef.current &&
            !suggestionsRef.current.contains(event.target)
         ) {
            setShowSuggestions(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   // Update suggestions based on search term - search by name or specialty
   useEffect(() => {
      if (searchTerm.trim() === "") {
         setSuggestions([]);
         setShowSuggestions(false);
         return;
      }

      const lowercasedTerm = searchTerm.toLowerCase();

      // Filter doctors by name or specialty
      const filteredByName = doctors
         .filter((doctor) => {
            // Check doctor name
            const nameMatch =
               doctor.name &&
               doctor.name.toLowerCase().includes(lowercasedTerm);
            if (nameMatch) return true;

            // Check doctor specialty - handle different API formats
            if (
               Array.isArray(doctor.specialities) &&
               doctor.specialities.length > 0
            ) {
               return doctor.specialities.some(
                  (spec) =>
                     spec.name &&
                     spec.name.toLowerCase().includes(lowercasedTerm)
               );
            }

            if (Array.isArray(doctor.speciality)) {
               return doctor.speciality.some(
                  (spec) => spec && spec.toLowerCase().includes(lowercasedTerm)
               );
            }

            if (doctor.speciality && typeof doctor.speciality === "string") {
               return doctor.speciality.toLowerCase().includes(lowercasedTerm);
            }

            return false;
         })
         .slice(0, 3); // Limit to top 3 matches per features.md

      setSuggestions(filteredByName);
      setShowSuggestions(filteredByName.length > 0);
   }, [searchTerm, doctors]);

   const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
   };

   const handleSelectSuggestion = (name) => {
      setSearchTerm(name);
      setShowSuggestions(false);

      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", name);
      setSearchParams(newParams);
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
         newParams.set("search", searchTerm);
      } else {
         // If search is blank, remove the search parameter to return to default results
         newParams.delete("search");
      }
      setSearchParams(newParams);
      setShowSuggestions(false);
   };

   // Get doctor specialty from any of the possible formats
   const getDoctorSpecialty = (doctor) => {
      if (
         Array.isArray(doctor.specialities) &&
         doctor.specialities.length > 0
      ) {
         return doctor.specialities
            .map((spec) => spec.name || "")
            .filter((name) => name)
            .join(", ");
      }

      if (Array.isArray(doctor.speciality)) {
         return doctor.speciality.join(", ");
      }

      return doctor.speciality || "";
   };

   // Handle image error by showing default placeholder
   const handleImageError = (e) => {
      e.target.src =
         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNNDAgMjVDMzYuNzAzOSAyNSAzNCAyNy43MDM5IDM0IDMxQzM0IDM0LjI5NjEgMzYuNzAzOSAzNyA0MCAzN0M0My4yOTYxIDM3IDQ2IDM0LjI5NjEgNDYgMzFDNDYgMjcuNzAzOSA0My4yOTYxIDI1IDQwIDI1Wk00MCA1MUMzMi4yNjggNTEgMjYgNTcuMjY4IDI2IDY1SDU0QzU0IDU3LjI2OCA0Ny43MzIgNTEgNDAgNTFaIiBmaWxsPSIjQThBOEE4Ii8+PC9zdmc+";
   };

   // Profile icon for the search bar
   const profileIcon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PGNpcmNsZSBjeD0iMTIiIGN5PSI4IiByPSI0Ij48L2NpcmNsZT48cGF0aCBkPSJNNiAyMXYtMmE0IDQgMCAwIDEgNC00aDRhNCA0IDAgMCAxIDQgNHYyIj48L3BhdGg+PC9zdmc+";

   // Right arrow icon for suggestions
   const rightArrowIcon = "›";

   return (
      <div className="header-search">
         <form onSubmit={handleSubmit}>
            <div className="search-input-wrapper" ref={suggestionsRef}>
               <div className="search-icon-left">
                  <img
                     src={profileIcon}
                     alt="Profile"
                     className="doctor-search-icon"
                  />
               </div>
               <input
                  type="text"
                  className="search-input"
                  placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() =>
                     searchTerm &&
                     suggestions.length > 0 &&
                     setShowSuggestions(true)
                  }
                  data-testid="autocomplete-input"
               />
               <button
                  type="submit"
                  className="search-button"
                  aria-label="Search"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <circle cx="11" cy="11" r="8"></circle>
                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
               </button>

               {showSuggestions && (
                  <ul className="suggestions-list">
                     {suggestions.map((doctor, index) => (
                        <li
                           key={index}
                           onClick={() => handleSelectSuggestion(doctor.name)}
                           data-testid="suggestion-item"
                        >
                           <div className="suggestion-content">
                              <div className="suggestion-image">
                                 <img
                                    src={doctor.photo || profileIcon}
                                    alt={doctor.name}
                                    onError={handleImageError}
                                 />
                              </div>
                              <div className="suggestion-item">
                                 <div className="suggestion-name">
                                    {doctor.name}
                                 </div>
                                 <div className="suggestion-specialty">
                                    {getDoctorSpecialty(doctor)}
                                 </div>
                              </div>
                           </div>
                           <div className="suggestion-arrow">
                              {rightArrowIcon}
                           </div>
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </form>
      </div>
   );
};

export default SearchBar;
