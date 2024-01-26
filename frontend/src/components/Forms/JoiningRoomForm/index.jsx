import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoiningRoomForm = ({ socket, setUser, uuid }) => {
  const [meetingCode, setMeetingCode] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      meetingCode,
      userId: uuid(),
      host: false,
      presenter: false,
    };

    setUser(roomData);
    navigate(`/${meetingCode}`);
    console.log(roomData);
    socket.emit("userJoined", roomData);
  };

  return (
    <form action="" className="form col-md-12 mt-4">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group ">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter meeting code"
          value={meetingCode}
          onChange={(e) => setMeetingCode(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary mt-3 w-100"
        onClick={handleJoinRoom}
      >
        Join Room
      </button>
    </form>
  );
};

export default JoiningRoomForm;
