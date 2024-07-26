import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = ({ filteredConversations }) => {
  const { loading, conversations } = useGetConversations();
  const finalConversations =
    filteredConversations.length > 0 ? filteredConversations : conversations;

  return (
    <div className="py-2 flex flex-col overflow-auto">
      {finalConversations?.map((item, i) => (
        <Conversation
          conversation={item}
          key={item._id}
          lastIndex={i === finalConversations.length - 1}
          // emoji={getRandomEmoji()}
        />
      ))}
      {loading && <span className="loading loading-spinner mx-auto" />}
    </div>
  );
};

export default Conversations;
