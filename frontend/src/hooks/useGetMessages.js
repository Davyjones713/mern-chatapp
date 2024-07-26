import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversations";
import toast from "react-hot-toast";

function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, messages, setMessages } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/message/${selectedConversation._id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data.data || data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation) getMessages();
  }, [selectedConversation, setMessages]);

  return { messages, loading };
}

export default useGetMessages;
