import React, { useEffect, useState } from "react";
import "./css/App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js"; // Import Pusher
import axios from "axios"; // Import axios

function App() {
  const [messages, setMessages] = useState([]); // Define setMessages state

  useEffect(() => {
    axios.get("/messages/syn").then((response) => {
      setMessages(response.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("f0c3fd2105ed94373305", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      // alert(JSON.stringify(data));
      setMessages([...messages, data]);
    });

    return () => {
      //   // Clean up when the component unmounts
      //   pusher.disconnect();
      // };
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]); // Add messages as a dependency to the second useEffect

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
