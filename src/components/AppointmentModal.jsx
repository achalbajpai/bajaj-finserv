import React, { useState } from "react";
import "../styles/AppointmentModal.css";

const AppointmentModal = ({
   doctor,
   onClose,
   doctorName,
   doctorSpecialty,
   doctorIntroduction,
   clinicName,
   clinicAddress,
   fees,
   photo,
}) => {
   const [selectedDate, setSelectedDate] = useState("");
   const [selectedTime, setSelectedTime] = useState("");

   // Generate next 7 days for appointment selection
   const generateDateOptions = () => {
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
         const date = new Date(today);
         date.setDate(today.getDate() + i);

         const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
         });

         dates.push({
            value: date.toISOString().split("T")[0],
            label: formattedDate,
         });
      }

      return dates;
   };

   // Generate time slots
   const generateTimeSlots = () => {
      const timeSlots = [];
      const startHour = 9; // 9 AM
      const endHour = 18; // 6 PM

      for (let hour = startHour; hour <= endHour; hour++) {
         const time = `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`;
         timeSlots.push({
            value: time,
            label: time,
         });
      }

      return timeSlots;
   };

   const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
   };

   const handleTimeChange = (e) => {
      setSelectedTime(e.target.value);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      alert(
         `Appointment booked with ${doctorName} on ${selectedDate} at ${selectedTime}`
      );
      onClose();
   };

   return (
      <div className="modal-overlay">
         <div className="appointment-modal">
            <div className="modal-header">
               <h2>Book Appointment</h2>
               <button className="close-button" onClick={onClose}>
                  ×
               </button>
            </div>

            <div className="modal-content">
               <div className="doctor-profile-section">
                  <div className="doctor-profile-image">
                     <img src={photo} alt={doctorName} />
                  </div>
                  <div className="doctor-profile-details">
                     <h3>{doctorName}</h3>
                     <p className="doctor-specialty">{doctorSpecialty}</p>
                     {doctorIntroduction && (
                        <p className="doctor-introduction">
                           {doctorIntroduction}
                        </p>
                     )}
                     <div className="clinic-details">
                        <p className="clinic-name">{clinicName}</p>
                        <p className="clinic-address">{clinicAddress}</p>
                     </div>
                     <p className="appointment-fee">Consultation Fee: {fees}</p>
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="appointment-form">
                  <div className="form-group">
                     <label htmlFor="appointment-date">Select Date</label>
                     <select
                        id="appointment-date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        required
                     >
                        <option value="">Select a date</option>
                        {generateDateOptions().map((date) => (
                           <option key={date.value} value={date.value}>
                              {date.label}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="form-group">
                     <label htmlFor="appointment-time">Select Time</label>
                     <select
                        id="appointment-time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        required
                     >
                        <option value="">Select a time</option>
                        {generateTimeSlots().map((time) => (
                           <option key={time.value} value={time.value}>
                              {time.label}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="form-actions">
                     <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                     >
                        Cancel
                     </button>
                     <button
                        type="submit"
                        className="confirm-button"
                        disabled={!selectedDate || !selectedTime}
                     >
                        Confirm Appointment
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default AppointmentModal;
