import { useRef, useState } from "react";
import "./index.css";

import WhiteBoard from "../../components/WhiteBoard";
import ChatBar from "../../components/ChatBar";
// import line from "../../assets/line.png";

const RoomPage = ({ user, socket, users }) => {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Clears Canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillRectangle = "#ffffff";

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setElements([]);
  };

  // Handles Undo
  const handleUndo = () => {
    if (elements.length > 0) {
      setHistory((prevHistory) => [
        ...prevHistory,
        elements[elements.length - 1],
      ]);
      setElements((prevElements) =>
        prevElements.slice(0, prevElements.length - 1)
      );
    }
  };

  //Handles Redo
  const handleRedo = () => {
    if (history.length > 0) {
      setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
      setElements((prevElements) => [
        ...prevElements,
        history[history.length - 1],
      ]);
    }
  };

  return (
    <div className="row row-wrapper">
      <button
        type="button"
        className="btn btn-dark"
        onClick={() => setOpenedUserTab(true)}
        style={{
          display: "block",
          position: "absolute",
          top: "5%",
          right: "3%",
          height: "40px",
          width: "100px",
        }}
      >
        Users
      </button>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setOpenedChatTab(true)}
        style={{
          display: "block",
          position: "absolute",
          top: "5%",
          right: "10%",
          height: "40px",
          width: "100px",
        }}
      >
        Chat
      </button>

      {openedUserTab && (
        <div
          className="position-fixed top-0 h-100 text-white bg-dark"
          style={{ width: "250px", right: "0%" }}
        >
          <button
            type="button"
            className="btn btn-light btn-block w-100 mt-5"
            onClick={() => setOpenedUserTab(false)}
          >
            {" "}
            Close
          </button>
          <div className="w-100 mt-5 pt-5">
            {users.map((u, index) => (
              <p key={index * 999} className="my-2 text-center w-100">
                {u.name} {user && user.userId === u.userId && "(You)"}
              </p>
            ))}
          </div>
        </div>
      )}

      {openedChatTab && (
        <ChatBar socket={socket} setOpenedChatTab={setOpenedChatTab} />
      )}

      <h1 className="text-center py-5">
        White Board Sharing App{" "}
        <span className="text-primary">[Users online: {users.length}]</span>
      </h1>

      {user?.presenter && (
        <div className="gap-5 flex-column d-flex align-items-center tool-box">
          {/* Tools */}
          <div className="d-flex gap-2 flex-column">
            <div className="d-flex gap-2">
              <label htmlFor="pencil" className="pointer">
                Pencil
              </label>
              <input
                type="radio"
                name="tool"
                id="pencil"
                checked={tool === "pencil"}
                value="pencil"
                onChange={(e) => setTool(e.target.value)}
                className="pointer"
              />
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="line" className="pointer">
                Line
              </label>
              <input
                type="radio"
                name="tool"
                id="line"
                checked={tool === "line"}
                value="line"
                onChange={(e) => setTool(e.target.value)}
                className="pointer"
              />
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="rectangle" className="pointer">
                Rectangle
              </label>
              <input
                type="radio"
                name="tool"
                id="rectangle"
                checked={tool === "rectangle"}
                value="rectangle"
                onChange={(e) => setTool(e.target.value)}
                className="pointer"
              />
            </div>
          </div>

          {/* Color */}
          <div className="d-flex flex-column align-items-center">
            <label htmlFor="color" className="pointer">
              Color:
            </label>
            <input
              type="color"
              id="color"
              className="pointer"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          {/* Undo/Redo */}
          <div className="d-flex gap-2 flex-column">
            <button
              className="btn btn-primary"
              disabled={elements.length === 0}
              onClick={() => handleUndo()}
            >
              Undo
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={elements.length < 1}
              onClick={() => handleRedo()}
            >
              Redo
            </button>
          </div>

          {/* Clear Canvas */}
          <div className=" flex-column d-flex mx-4">
            <button className="btn btn-danger" onClick={handleClear}>
              Clear Canvas
            </button>
          </div>
        </div>
      )}

      <div className="col-md-10 mx-auto mt-5 p-0 canvas-container">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          color={color}
          tool={tool}
          user={user}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default RoomPage;
