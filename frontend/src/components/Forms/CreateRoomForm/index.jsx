import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
  const [meetingCode, setMeetingCode] = useState("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const copyMeetingCode = () => {
    navigator.clipboard.writeText(meetingCode);
    setShowCopiedMessage(true);
    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 2000);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      meetingCode,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    navigate(`/${meetingCode}`);
    console.log(roomData);
    socket.emit("userJoined", roomData);
  };

  return (
    <form className="form col-md-12 mt-4">
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={meetingCode}
          className="form-control my-2"
          placeholder="Generate meeting code"
          readOnly
          disabled
          id="meetingCode"
        />
      </div>

      <div className="button-group mt-2 d-flex gap-3">
        <div className="w-100">
          <button
            className="btn btn-success w-100"
            onClick={() => setMeetingCode(uuid())}
            type="button"
          >
            Generate
          </button>
        </div>
        <div className="w-100 parent">
          <button
            className="btn btn-outline-danger w-100"
            onClick={copyMeetingCode}
            type="button"
          >
            Copy
          </button>
          <p className={showCopiedMessage ? "show" : "hide"}>Copied!</p>
        </div>
      </div>

      <button className="btn btn-primary mt-4 w-100" onClick={handleCreateRoom}>
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
