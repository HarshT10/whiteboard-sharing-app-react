import "./index.css";
import CreateRoomForm from "./CreateRoomForm";
import JoiningRoomForm from "./JoiningRoomForm";

const Forms = ({ uuid, socket, setUser }) => {
  return (
    <div className="forms">
      <div className="row">
        <div className="col-md-4 py-3 px-5 rounded-2 mx-auto d-flex flex-column align-items-center justify-content-center form-container shadow">
          <h1 className="text-primary fw-bold mt-3">Create Room</h1>
          <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        </div>
        <div className="col-md-4 py-3 px-5 rounded-2 mx-auto d-flex flex-column align-items-center justify-content-center form-container shadow">
          <h1 className="text-primary fw-bold mt-3">Join Room</h1>
          <JoiningRoomForm uuid={uuid} socket={socket} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};

export default Forms;
