import React, { useState } from "react";
import "../styles/DoctorCard.css";
import AppointmentModal from "./AppointmentModal";

const DoctorCard = ({ doctor }) => {
   const [showAppointmentModal, setShowAppointmentModal] = useState(false);

   // Function to safely handle possibly complex object values
   const renderText = (value) => {
      if (value === null || value === undefined) return "";
      if (typeof value === "object") {
         try {
            // If it's an object with address/locality/city info, format it nicely
            if (value.locality && value.city) {
               return `${value.locality}, ${value.city}`;
            }
            // If it's an address_line1, just return that
            if (value.address_line1) {
               return value.address_line1;
            }
            // For any other object, convert to string but keep it readable
            return (
               JSON.stringify(value).slice(0, 70) +
               (JSON.stringify(value).length > 70 ? "..." : "")
            );
         } catch (error) {
            return "";
         }
      }
      return value;
   };

   // Parse JSON strings if needed (for when address or clinic info comes as JSON string)
   const parseIfJSON = (value) => {
      if (
         typeof value === "string" &&
         (value.startsWith("{") || value.startsWith("["))
      ) {
         try {
            return JSON.parse(value);
         } catch (e) {
            return value;
         }
      }
      return value;
   };

   // Create a default image URL
   const defaultImageUrl =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNFNUU1RTUiLz48cGF0aCBkPSJNNDAgMjVDMzYuNzAzOSAyNSAzNCAyNy43MDM5IDM0IDMxQzM0IDM0LjI5NjEgMzYuNzAzOSAzNyA0MCAzN0M0My4yOTYxIDM3IDQ2IDM0LjI5NjEgNDYgMzFDNDYgMjcuNzAzOSA0My4yOTYxIDI1IDQwIDI1Wk00MCA1MUMzMi4yNjggNTEgMjYgNTcuMjY4IDI2IDY1SDU0QzU0IDU3LjI2OCA0Ny43MzIgNTEgNDAgNTFaIiBmaWxsPSIjQThBOEE4Ii8+PC9zdmc+";

   // Extract doctor name - might be in a nested object or directly in the name field
   const getDoctorName = () => {
      // If doctor.name is an object with a name property, use that
      if (doctor.name && typeof doctor.name === "object" && doctor.name.name) {
         return doctor.name.name;
      }

      // Otherwise use the name property or a fallback
      const name = renderText(doctor.name || "Doctor");

      // Ensure the name has "Dr." prefix but avoid duplication
      if (name.startsWith("Dr.") || name.startsWith("Dr ")) {
         return name;
      } else {
         return `Dr. ${name}`;
      }
   };

   // Extract clinic or hospital info - might be in a nested object
   const getClinicInfo = () => {
      // Try to get clinic data based on the API format
      if (doctor.clinic && typeof doctor.clinic === "object") {
         return doctor.clinic.name || "";
      }

      const clinicRaw = doctor.clinic || doctor.hospital || doctor.name?.clinic;
      // Try to parse if it's a JSON string
      const clinic = parseIfJSON(clinicRaw);

      if (typeof clinic === "object") {
         return clinic.name || renderText(clinic);
      }

      return renderText(clinic || "");
   };

   // Extract address info - might be in a nested object
   const getAddressInfo = () => {
      // Try to get address from clinic.address structure (as in API example)
      if (doctor.clinic && doctor.clinic.address) {
         const { locality, city } = doctor.clinic.address;
         if (locality) {
            return city ? `${locality}, ${city}` : locality;
         }
         return doctor.clinic.address.address_line1 || "";
      }

      const addressRaw =
         doctor.address ||
         doctor.location ||
         doctor.city ||
         doctor.name?.address;
      // Try to parse if it's a JSON string
      const address = parseIfJSON(addressRaw);

      if (typeof address === "object") {
         if (address.locality && address.city) {
            return `${address.locality}, ${address.city}`;
         }
         return renderText(address);
      }

      return renderText(address || "");
   };

   // Get education info
   const getEducation = () => {
      return renderText(doctor.education || doctor.qualification || "MBBS");
   };

   // Get specialty info
   const getSpecialty = () => {
      // Handle API format where specialities is an array of objects with name property
      if (
         Array.isArray(doctor.specialities) &&
         doctor.specialities.length > 0
      ) {
         return doctor.specialities
            .map((spec) => spec.name || renderText(spec))
            .join(", ");
      }

      if (Array.isArray(doctor.speciality)) {
         return doctor.speciality.map((spec) => renderText(spec)).join(", ");
      }
      return renderText(doctor.speciality || "General Physician");
   };

   // Get experience (format as just the number + yrs exp.)
   const getExperience = () => {
      const exp = doctor.experience || "";
      // Try to extract just the number if it's in format like "11 Years of experience"
      const match = /(\d+)\s*(?:Years?|yrs?)?/.exec(exp);
      if (match && match[1]) {
         return `${match[1]} yrs exp.`;
      }
      return exp.includes("yrs") ? exp : `${exp} yrs exp.`;
   };

   // Get fee
   const getFee = () => {
      const fee = doctor.fees || doctor.fee || "500";
      // If fee already includes ₹ symbol, return as is
      if (typeof fee === "string" && fee.includes("₹")) {
         return fee.trim();
      }
      // Otherwise add the symbol
      return `₹ ${renderText(fee)}`;
   };

   // Get languages
   const getLanguages = () => {
      if (Array.isArray(doctor.languages) && doctor.languages.length > 0) {
         return doctor.languages.join(", ");
      }
      return "";
   };

   // Get doctor introduction
   const getDoctorIntroduction = () => {
      return doctor.doctor_introduction || "";
   };

   // Check consultation availability
   const hasVideoConsult = doctor.video_consult === true;
   const hasInClinic = doctor.in_clinic === true;

   const handleBookAppointment = () => {
      setShowAppointmentModal(true);
   };

   const handleCloseModal = () => {
      setShowAppointmentModal(false);
   };

   return (
      <div className="doctor-card" data-testid="doctor-card">
         <div className="doctor-profile">
            <div className="doctor-image">
               <img
                  src={doctor.photo || doctor.image || defaultImageUrl}
                  alt={getDoctorName()}
               />
            </div>
            <div className="doctor-basic-info">
               <h2 data-testid="doctor-name">{getDoctorName()}</h2>
               <p className="doctor-specialties" data-testid="doctor-specialty">
                  {getSpecialty()}
               </p>
               <p className="doctor-education">{getEducation()}</p>
               <p className="doctor-experience" data-testid="doctor-experience">
                  {getExperience()}
               </p>
            </div>
         </div>

         <div className="doctor-details">
            <div className="doctor-location">
               <p className="clinic-name">
                  <span className="icon building-icon">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     >
                        <rect
                           x="4"
                           y="2"
                           width="16"
                           height="20"
                           rx="2"
                           ry="2"
                        ></rect>
                        <line x1="12" y1="6" x2="12" y2="6.01"></line>
                        <line x1="12" y1="10" x2="12" y2="10.01"></line>
                        <line x1="12" y1="14" x2="12" y2="14.01"></line>
                        <line x1="12" y1="18" x2="12" y2="18.01"></line>
                     </svg>
                  </span>
                  {getClinicInfo()}
               </p>
               <p className="location-name">
                  <span className="icon location-icon">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                        <circle cx="12" cy="9" r="2.5"></circle>
                     </svg>
                  </span>
                  {getAddressInfo()}
               </p>

               {getLanguages() && (
                  <p className="doctor-languages">
                     <span className="icon language-icon">
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           width="16"
                           height="16"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        >
                           <path d="M5 8l6 6M9 8l6 6" />
                           <circle cx="12" cy="12" r="10" />
                        </svg>
                     </span>
                     {getLanguages()}
                  </p>
               )}

               {(hasVideoConsult || hasInClinic) && (
                  <div className="consultation-options">
                     {hasVideoConsult && (
                        <span className="consult-badge video">
                           Video Consult
                        </span>
                     )}
                     {hasInClinic && (
                        <span className="consult-badge clinic">In-clinic</span>
                     )}
                  </div>
               )}
            </div>

            <div className="doctor-fee" data-testid="doctor-fee">
               {getFee()}
            </div>
         </div>

         <div className="appointment-button">
            <button onClick={handleBookAppointment}>Book Appointment</button>
         </div>

         {showAppointmentModal && (
            <AppointmentModal
               doctor={doctor}
               onClose={handleCloseModal}
               doctorName={getDoctorName()}
               doctorSpecialty={getSpecialty()}
               doctorIntroduction={getDoctorIntroduction()}
               clinicName={getClinicInfo()}
               clinicAddress={getAddressInfo()}
               fees={getFee()}
               photo={doctor.photo || doctor.image || defaultImageUrl}
            />
         )}
      </div>
   );
};

export default DoctorCard;
