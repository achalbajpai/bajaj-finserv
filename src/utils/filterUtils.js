/**
 * Get all unique specialties from the doctor data
 * @param {Array} doctors - Array of doctor objects
 * @returns {Array} - Array of unique specialties
 */
export const getUniqueSpecialties = (doctors) => {
   if (!Array.isArray(doctors) || doctors.length === 0) {
      return [];
   }

   // Collect all specialties from all doctors (they might be arrays)
   const allSpecialties = doctors.reduce((acc, doctor) => {
      if (!doctor) return acc;

      try {
         // Handle specialities array of objects from API
         if (
            Array.isArray(doctor.specialities) &&
            doctor.specialities.length > 0
         ) {
            const specialityNames = doctor.specialities
               .map((spec) => spec.name)
               .filter(Boolean);
            return [...acc, ...specialityNames];
         }

         // Handle speciality as an array of strings
         if (Array.isArray(doctor.speciality)) {
            return [...acc, ...doctor.speciality.filter(Boolean)];
         }

         // Handle speciality as a string
         if (doctor.speciality) {
            return [...acc, doctor.speciality];
         }

         return acc;
      } catch (error) {
         console.error("Error processing doctor specialty:", error);
         return acc;
      }
   }, []);

   // Remove duplicates and return sorted list
   return [...new Set(allSpecialties)].sort();
};

/**
 * Filter doctors based on search term, consultation mode, and specialties
 * @param {Array} doctors - Array of doctor objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered array of doctors
 */
export const filterDoctors = (doctors, filters) => {
   if (!Array.isArray(doctors)) {
      return [];
   }

   const { searchTerm, consultMode, specialties, sortBy } = filters;

   // Start with all doctors
   let filteredDoctors = [...doctors];

   // Filter by search term (only if non-empty)
   if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filteredDoctors = filteredDoctors.filter((doctor) => {
         try {
            // Search by doctor name
            if (
               doctor &&
               doctor.name &&
               doctor.name.toLowerCase().includes(term)
            ) {
               return true;
            }

            // Search by specialty - handle different formats

            // Handle specialities array of objects from API
            if (
               Array.isArray(doctor.specialities) &&
               doctor.specialities.length > 0
            ) {
               return doctor.specialities.some(
                  (spec) => spec.name && spec.name.toLowerCase().includes(term)
               );
            }

            // Handle speciality as an array of strings
            if (Array.isArray(doctor.speciality)) {
               return doctor.speciality.some(
                  (spec) => spec && spec.toLowerCase().includes(term)
               );
            }

            // Handle speciality as a string
            if (doctor.speciality && typeof doctor.speciality === "string") {
               return doctor.speciality.toLowerCase().includes(term);
            }

            return false;
         } catch (error) {
            console.error("Error filtering by search term:", error);
            return false;
         }
      });
   }

   // Filter by consultation mode
   if (consultMode) {
      filteredDoctors = filteredDoctors.filter((doctor) => {
         try {
            // Check video_consult and in_clinic properties from API data
            if (
               consultMode === "Video Consult" &&
               doctor.video_consult === true
            ) {
               return true;
            }

            if (consultMode === "In Clinic" && doctor.in_clinic === true) {
               return true;
            }

            // Also check the consultationMode property for compatibility
            return (
               doctor &&
               doctor.consultationMode &&
               (Array.isArray(doctor.consultationMode)
                  ? doctor.consultationMode.includes(consultMode)
                  : doctor.consultationMode === consultMode)
            );
         } catch (error) {
            console.error("Error filtering by consultation mode:", error);
            return false;
         }
      });
   }

   // Filter by specialties (any of the selected specialties)
   if (specialties && specialties.length > 0) {
      filteredDoctors = filteredDoctors.filter((doctor) => {
         try {
            // Handle specialities array of objects from API
            if (
               Array.isArray(doctor.specialities) &&
               doctor.specialities.length > 0
            ) {
               return doctor.specialities.some(
                  (spec) => spec.name && specialties.includes(spec.name)
               );
            }

            // If the doctor has a speciality array
            if (Array.isArray(doctor.speciality)) {
               return doctor.speciality.some((spec) =>
                  specialties.includes(spec)
               );
            }

            // If the doctor has a single speciality string
            if (doctor.speciality) {
               return specialties.includes(doctor.speciality);
            }

            return false;
         } catch (error) {
            console.error("Error filtering by specialties:", error);
            return false;
         }
      });
   }

   // Sort the results
   if (sortBy) {
      try {
         switch (sortBy) {
            case "fees":
               // Sort by fees (ascending) - handle different fee formats
               filteredDoctors.sort((a, b) => {
                  const getFeeValue = (doctor) => {
                     if (!doctor) return 0;

                     // Handle fees as string with currency symbol
                     if (typeof doctor.fees === "string") {
                        const match = doctor.fees.match(/\d+/);
                        return match ? parseInt(match[0], 10) : 0;
                     }

                     // Handle numeric fees
                     return parseInt(doctor.fee || doctor.fees || 0, 10);
                  };

                  return getFeeValue(a) - getFeeValue(b);
               });
               break;
            case "experience":
               // Sort by experience (descending) - handle different experience formats
               filteredDoctors.sort((a, b) => {
                  const getExperienceValue = (doctor) => {
                     if (!doctor) return 0;

                     // Handle experience as string like "11 Years of experience"
                     if (typeof doctor.experience === "string") {
                        const match = doctor.experience.match(/\d+/);
                        return match ? parseInt(match[0], 10) : 0;
                     }

                     // Handle numeric experience
                     return parseInt(
                        doctor.experience || doctor.yearsOfExperience || 0,
                        10
                     );
                  };

                  return getExperienceValue(b) - getExperienceValue(a);
               });
               break;
            default:
               // No sorting
               break;
         }
      } catch (error) {
         console.error("Error sorting doctors:", error);
      }
   }

   return filteredDoctors;
};
