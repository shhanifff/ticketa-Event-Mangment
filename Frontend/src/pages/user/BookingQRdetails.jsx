/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookingQRdetails = () => {
  const { bookingId } = useParams(); // Get the bookingId from the URL
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    async function qr() {
      let a = bookingId.split("-");
      const userId = a[0];
      console.log('user id',userId)
      console.log("uer booking details url", bookingId);
      let res =await  axios.post("http://localhost:5000/api/qrCode-details", {
        userId,
      });

      console.log("evet qr details", res);
    }
    qr();
  }, []);

  if (!bookingDetails) return <p>Loading...</p>;

  return (
    <div>
      <h1>Booking Details</h1>
      <p>Booking ID: {bookingDetails.bookingId}</p>
      <p>Event: {bookingDetails.eventName}</p>
      <p>Quantity: {bookingDetails.quantity}</p>
    </div>
  );
};

export default BookingQRdetails;
