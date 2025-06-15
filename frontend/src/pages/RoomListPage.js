import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get("rooms/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setRooms(response.data);
      } catch (error) {
        console.error("Error loading rooms:", error);
        alert("Please log in again.");
      }
    };
    fetchRooms();
  }, [token]);

  const handleReservation = async () => {
    if (!selectedRoom || !date || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post(
        "reservations/",
        {
          room: selectedRoom,
          date,
          start_time: startTime,
          end_time: endTime,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      alert("Reservation made successfully");
    } catch (error) {
      console.error(error.response?.data);
      alert("Reservation failed");
    }
  };

  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <strong>{room.name}</strong> – {room.location} – Capacity: {room.capacity}
            <button onClick={() => setSelectedRoom(room.id)}>Book</button>
          </li>
        ))}
      </ul>

      {selectedRoom && (
        <div>
          <h3>Book Room #{selectedRoom}</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button onClick={handleReservation}>Confirm Booking</button>
        </div>
      )}
    </div>
  );
}

export default RoomListPage;
