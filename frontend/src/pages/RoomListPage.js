import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00",
];

function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // today

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [date]);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/api/rooms/");
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error.response?.data || error.message);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/api/reservations/?date=${date}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error.response?.data || error.message);
    }
  };

  const isSlotBooked = (roomId, time) => {
    return reservations.some(res =>
      res.room === roomId &&
      res.date === date &&
      res.start_time.slice(0, 5) === time
    );
  };

  const handleBook = async (roomId, time) => {
    try {
      await api.post("/api/reservations/", {
        room: roomId,
        date,
        start_time: time,
        end_time: getNextHour(time),
      });
      alert("Booking successful!");
      fetchReservations();
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Booking failed.");
    }
  };

  const getNextHour = (time) => {
    const [h, m] = time.split(":").map(Number);
    const nextHour = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return nextHour;
  };

  return (
    <div>
      <h2>Availability for {date}</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Room</th>
            {TIME_SLOTS.map((slot) => (
              <th key={slot}>{slot}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>
                <strong>{room.name}</strong><br />
                Capacity: {room.capacity}<br />
                Location: {room.location}
              </td>
              {TIME_SLOTS.map((time) => (
                <td key={time}>
                  {isSlotBooked(room.id, time) ? (
                    <button disabled style={{ backgroundColor: "#f88", padding: "5px 10px" }}>X</button>
                  ) : (
                    <button style={{ backgroundColor: "#4caf50", color: "#fff", padding: "5px 10px" }}
                      onClick={() => handleBook(room.id, time)}
                    >
                      Book
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomListPage;
