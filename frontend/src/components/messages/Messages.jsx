import useGetMessages from "../../hooks/useGetMessages";
import Message from "./Message";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useEffect, useRef } from "react";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
  const { loading, messages } = useGetMessages();
  useListenMessages();
  const messageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {loading &&
        [...Array(3)].map((_, i) => {
          return <MessageSkeleton key={i} />;
        })}

      {!loading && messages?.length === 0 ? (
        <p className="text-center">Send a message to start the conversation</p>
      ) : (
        messages?.map((item) => {
          return (
            <div key={item._id} ref={messageRef}>
              <Message message={item} />
            </div>
          );
        })
      )}
    </div>
  );
};
export default Messages;
