import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { MyContext } from "../context/EventContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:5000");

function NotificationClient() {
  const { getNotifications, getAllEventsFromAPI, notifications } =
    useContext(MyContext);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  let latest = notifications.reduce((latestEvent, current) => {
    return new Date(current.createdAt) > new Date(latestEvent.createdAt)
      ? current
      : latestEvent;
  }, notifications[0]);

  const showNotification = (title, message, eventId) => {
  toast.info(
    <div style={{ color: "#f1f1f1" }}>
      <strong style={{ color: "#ffffff" }}>{title}</strong>
      <p style={{ margin: "5px 0", color: "#dddddd" }}>{message}</p>
      <button
        style={{
          background: "#444", // dark grey button
          color: "#fff",       // white text
          border: "1px solid #888",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "8px",
        }}
        onClick={() => navigate(`/events/${eventId}`)}
      >
        View Event
      </button>
    </div>,
    {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark", // ✅ use built-in dark theme
      style: {
        background: "#222", // custom dark background
        color: "#fff", // text color
        border: "1px solid #444",
        borderRadius: "8px",
      },
    }
  );
};


  useEffect(() => {
    if (!user) return;

    const isNewLogin = localStorage.getItem("isNewLogin");
    if (isNewLogin === "true") {
      setTimeout(() => {
        showNotification(
          "Latest Event",
          `${latest.event_title}`,
          latest.event_id
        );
        localStorage.removeItem("isNewLogin");
      }, 1000);
    }

    socket.on("notification", (data) => {
      console.log("Notification received", data);
      showNotification("Event Update", data.message, data.eventId);
      getNotifications();
      getAllEventsFromAPI();
    });

    return () => {
      socket.off("notification");
    };
  }, [user]);

  return <ToastContainer theme="dark"/>;
}

export default NotificationClient;
