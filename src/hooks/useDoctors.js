import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

const useDoctors = () => {
   const [doctors, setDoctors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchDoctors = async () => {
         try {
            setLoading(true);
            const response = await axios.get(API_URL);

            // Ensure each doctor has the required fields
            const processedDoctors = response.data.map((doctor) => {
               // Create a clean doctor object with consistent structure
               return {
                  ...doctor,
                  // Ensure consultationMode is an array
                  consultationMode: Array.isArray(doctor.consultationMode)
                     ? doctor.consultationMode
                     : doctor.consultationMode
                     ? [doctor.consultationMode]
                     : ["In Clinic"], // Default to In Clinic if not specified

                  // Ensure speciality is always a string or array
                  speciality: doctor.speciality || "General Physician",

                  // Ensure consistent fee property
                  fee:
                     typeof doctor.fee === "number"
                        ? doctor.fee
                        : typeof doctor.fees === "number"
                        ? doctor.fees
                        : 500,

                  // Ensure experience is a number
                  experience:
                     typeof doctor.experience === "number"
                        ? doctor.experience
                        : typeof doctor.yearsOfExperience === "number"
                        ? doctor.yearsOfExperience
                        : 5,

                  // Ensure we have a name
                  name: doctor.name || doctor.doctorName || "Doctor",
               };
            });

            setDoctors(processedDoctors);
            setError(null);
         } catch (err) {
            setError("Failed to fetch doctors. Please try again later.");
            console.error("Error fetching doctor data:", err);
         } finally {
            setLoading(false);
         }
      };

      fetchDoctors();
   }, []);

   return { doctors, loading, error };
};

export default useDoctors;
