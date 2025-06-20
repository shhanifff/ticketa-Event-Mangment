import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  position: {
    x: "right",
    y: "top",
  },
});

export async function getAllEvents() {
  try {
    const response = await axios.get("http://localhost:5000/api/getEvents");
    console.log("all events n siuu", response.data.data);

    return response.data;
  } catch (error) {
    return { message: "Failed to fetch events", error };
  }
}

export async function addEvents(obj, get) {
  console.log("add event data recived", obj);

  const formData = new FormData();
  formData.append("title", obj.title);
  formData.append("description", obj.des);
  formData.append("date", obj.date);
  formData.append("time", obj.time);
  formData.append("category", obj.cate);
  formData.append("location", obj.location);
  formData.append("availableSeats", obj.seat);
  formData.append("ticketType", obj.ticketType);
  formData.append("price", obj.price);
  formData.append("eventImage", obj.url.get("eventImage")); // this is the image file

  let a = await axios.post("http://localhost:5000/api/addEvents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("res", a);

  console.log("notification event id ", a.data.data._id);
  getAllEvents();
  get();
  notyf.success("Event Added");
}

export async function editEvent(formData, id, navigate) {
  console.log("formData", formData);
  console.log("id", id);

  const res = await axios.patch(
    `http://localhost:5000/api/editEvent/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log(`res`, res);
  // await getAllEvents();
  notyf.success("Changes Saved");
  navigate(-1);
}

export async function deleteEvent(id, navigate) {
  try {
    await axios.delete("http://localhost:5000/api/deleteEvent", {
      data: { id },
    });

    notyf.success("Event deleted successfully!");

    navigate(-1);
  } catch (error) {
    console.error("Error deleting event:", error);
    notyf.error("Failed to delete the event!");
  }
}
