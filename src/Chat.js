import { Avatar } from "@material-ui/core";
import {
  AttachFile,
  SearchOutlined,
  MoreVert,
  InsertEmoticon,
} from "@material-ui/icons";
import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import "./css/Chat.css";
import MicIcon from "@material-ui/icons/Mic";
import axios from "./axios";
function Chat({ messages }) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    axios.post("/messages/new", {
      name: "DEMO APP",
      timestamp: "just now!",
      message: input,
      receiver: false,
    });

    setInput("");
  };
  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at...</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {" "}
        <p className="chat_message chat_reciever">
          <span className="chat_names">Vanshi</span>
          This is a message.
          <span className="chat_timestamp">{new Date().toUTCString()}</span>
        </p>
        <p className="chat_message">
          <span className="chat_names">Vanshi</span>
          This is a message.
          <span className="chat_timestamp">{new Date().toUTCString()}</span>
        </p>
        {messages.map((message) => (
          <p className={`chat_message ${message.received && "chat_receiver"}`}>
            <span className="chat_names">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message{" "}
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
