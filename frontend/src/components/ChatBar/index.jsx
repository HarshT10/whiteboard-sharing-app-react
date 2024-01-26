import { useEffect } from "react";
import { useState } from "react";

const ChatBar = ({ setOpenedChatTab, socket }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setChat((prevChats) => [...prevChats, data]);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      socket.emit("message", { message });
      setMessage("");
    }
  };

  return (
    <div
      className="position-fixed d-flex flex-column justify-content-center top-0 h-100 text-white bg-dark"
      style={{ width: "400px", right: "0%" }}
    >
      <button
        type="button"
        className="btn btn-light btn-block w-100"
        onClick={() => setOpenedChatTab(false)}
      >
        Close
      </button>

      <div
        className="w-100 mt-5 p-2 border border-2 border-white rounded-3"
        style={{ height: "70%" }}
      >
        {chat.map((msg, index) => (
          <p
            key={index * 999}
            className="my-2 text-center py-2 w-100 border border border-left-0 border-right-0"
          >
            {msg.name}: {msg.message}
          </p>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-100 mt-5 d-flex border border-2 border-white rounded-3"
      >
        <input
          type="text"
          placeholder="Enter your message"
          className="h-100 border-0 p-2 "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            transform: "none",
            fontSize: "initial",
          }}
        />
        <button type="submit" className="btn btn-primary rounded-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBar;
