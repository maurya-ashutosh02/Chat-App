import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-base-100">
      <div className="text-center px-6 py-12 max-w-md">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center shadow-sm">
            <MessageSquare className="w-10 h-10 text-primary opacity-80" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-base-content mb-2">
          Welcome to Chatty
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-base-content/70 leading-relaxed">
          Select a conversation from the sidebar to start chatting.  
          Your messages will appear here once you pick a chat.
        </p>

        {/* Subtle divider */}
        <div className="mt-8 border-t border-base-300 pt-4 text-xs text-base-content/50">
          End-to-end encrypted
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
