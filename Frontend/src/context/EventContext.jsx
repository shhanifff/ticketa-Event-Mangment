/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { getAllEvents } from "../api/eventAPI's";
import { useNavigate } from "react-router-dom";
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
var notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const navigate = useNavigate();
  // << START ============================ event option and funcion
  const [eventsArray, setEventsArray] = useState([]);
  const userId = localStorage.getItem("userId");

  // console.log('from localstroage',userId)

  async function getAllEventsFromAPI() {
    const fetchEvents = async () => {
      const data = await getAllEvents();
      // if (data.data) {
      //   // console.log("events data", data.data);
      // }
      setEvents(data.data);
      setEventsArray(data.data);
    };

    await fetchEvents();
    await getNotifications();
  }

  const [events, setEvents] = useState([]);

  // useEffect(() => {
  //   getAllEventsFromAPI();
  // }, [eventsArray]);

  function SelectedByCategory(category) {
    console.log("User selected category:", category);

    if (category === "all" || !category) {
      setEventsArray(events);
      return;
    }

    // Filter events
    const item = events.filter((x) => x.category === category);

    // Set to state
    setEventsArray(item);

    console.log("Filtered items (direct):", item);
  }

  // END  ============================= event option and funcion  >>

  // all reviews api fetch
  const [reviews, setReview] = useState();
  async function allReviews() {
    let response = await axios.get("http://localhost:5000/api/allreview");
    setReview(response.data.data);
    console.log("reviews", response.data.data);
  }

  // delet users
  async function deleteReview(id) {
    console.log("delete review id", id);
    await axios.delete("http://localhost:5000/api/deleteReview", {
      data: { id },
    });
    await allReviews();
  }

  // user api fetch
  const [users, setUsers] = useState();
  async function getAllUsers() {
    let res = await axios.get("http://localhost:5000/api/getUsers");
    console.log("all users", res.data.data);
    setUsers(res.data.data);
  }

  // BlockAndUnblock
  async function BlockAndUnblock(action, id) {
    console.log("action in context", action);
    console.log("id in context", id);

    let a = await axios.delete("http://localhost:5000/api/BlockAndUnblock", {
      data: { action, id },
    });
    await getAllUsers();
  }

  // user delete
  async function userDelete(id) {
    console.log("delete user id", id);
    axios.delete("http://localhost:5000/api/deleteUser", { data: { id } });
    await getAllUsers();
    await navigate(-1);
  }

  async function eventBoking(id, email, phone, quantity, paymentDetails = {}) {
    console.log(
      "id recived in context",
      id,
      email,
      phone,
      quantity,
      paymentDetails
    );
    console.log("user id", userId);

    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      paymentMethod,
    } = paymentDetails;

    console.log(
      `payement details  id :${razorpayPaymentId}`,
      `payement details order id ${razorpayOrderId}`,
      `payement details  signature ${razorpaySignature}`,
      `payement details amunt  ${amount}`,
      `payement details payment meth ${paymentMethod}`
    );

    axios.post("http://localhost:5000/api/booking", {
      userId,
      id,
      email,
      phone,
      quantity,
      paymentDetails,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      amount,
      paymentMethod,
    });
    notyf.success(
      "Your ticket has been successfully booked. A confirmation email has been sent."
    );
    await navigate(-1);
    await getAllEventsFromAPI();
    await allBookings();
    await userProfile();
  }

  const [activeUserDetails, setActiveUserDetails] = useState();
  const [activeUserBookings, setActiveUserBooking] = useState();
  const [currentUser, setCurrentUser] = useState();
  async function userProfile() {

     if (!userId) {
      console.log("userId is null or undefined");
      return null ;
    }

    let res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
    console.log("user details", res.data.data);
    setCurrentUser(res.data.data);
    setActiveUserDetails(res.data.data.user);
    setActiveUserBooking(res.data.data.bookings);
    console.log("aaaaa", res.data.data.bookings);
  }

  useEffect(() => {
    console.log("ssssss", currentUser);
  }, [currentUser]);

  const [adminAllBookings, setAdminAllBookings] = useState([]);
  async function allBookings() {
    let res = await axios.get(`http://localhost:5000/api/allBookings`);
    console.log("all bookings in context ", res.data.data);
    setAdminAllBookings(res.data.data);
  }

  const [notifications, setNotifications] = useState([]);
  async function getNotifications() {
    let res = await axios.get("http://localhost:5000/api/getNotification");
    console.log("all nofications", res.data.data);
    // await getAllEventsFromAPI()
    await setNotifications(res.data.data);
  }

  async function changeUserName(name, email) {
    console.log("name and email", name, email);
    let res = await axios.put(
      `http://localhost:5000/api/changeName/${userId}`,
      {
        name,
        email,
      }
    );
    await userProfile();
    console.log("respons in chnage", res);
  }

  async function profileUpload(formdata, userId) {
   
    console.log("img received", formdata);
    console.log("file inside formdata: ", formdata.get("profileImage")); // optional debug

    let res = await axios.post(
      `http://localhost:5000/api/profileImageUpload/${userId}`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log("res in img", res);
    console.log("image upload response:", res);
    await userProfile();
  }

  useEffect(() => {
    allReviews();
    getAllUsers();
    getAllEventsFromAPI();
    userProfile();
    allBookings();
  }, []);

  return (
    <MyContext.Provider
      value={{
        eventsArray,
        users,
        SelectedByCategory,
        allReviews,
        reviews,
        setEventsArray,
        getAllEventsFromAPI,
        BlockAndUnblock,
        userDelete,
        deleteReview,
        eventBoking,
        activeUserDetails,
        activeUserBookings,
        adminAllBookings,
        notifications,
        getNotifications,
        changeUserName,
        profileUpload,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
