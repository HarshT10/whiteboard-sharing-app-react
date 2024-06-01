import { Route, Routes } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import Forms from "./components/Forms";
import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const server =
  "https://real-time-white-board-lm8745svb-harsht10s-projects.vercel.app/";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        setUsers(data.users);
      } else {
        console.log("error");
      }
    });

    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("userJoinedMessage", (data) => {
      toast.info(`${data} joined the room.`);
    });

    socket.on("userLeftMessage", (data) => {
      toast.info(`${data} left the room.`);
    });
  }, [socket]);

  const uuid = () => {
    var generateRandomHex = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      generateRandomHex() +
      generateRandomHex() +
      "-" +
      generateRandomHex() +
      "-" +
      generateRandomHex() +
      "-" +
      generateRandomHex() +
      "-" +
      generateRandomHex() +
      generateRandomHex() +
      generateRandomHex()
    );
  };

  return (
    <div className="container">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}
        />
        <Route
          path="/:meetingCode"
          element={<RoomPage user={user} socket={socket} users={users} />}
        />
      </Routes>
    </div>
  );
};

export default App;
