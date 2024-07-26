import useConversation from "../../zustand/useConversations";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromMe = authUser.id === message.senderId;
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation.profilePic;
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${fromMe ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble text-white  pb-4 ${
          fromMe ? "bg-blue-500" : ""
        } ${shakeClass}`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {extractTime(message.createdAt)}
      </div>
    </div>
  );
};
export default Message;
