import { useState } from "react";
import useConversation from "../zustand/useConversations";
import toast from "react-hot-toast";

function useSendMessage() {
  const [loading, setLoading] = useState();
  const { selectedConversation, messages, setMessages } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/message/send/${selectedConversation._id}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...messages, data.data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
}

export default useSendMessage;
