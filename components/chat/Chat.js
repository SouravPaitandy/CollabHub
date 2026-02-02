"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiSmile } from "react-icons/fi";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useCollab } from "@/components/documents/CollabContext";

// --- Emoji Picker ---
const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🚀", "🎉"];
const EmojiPicker = ({ onSelect }) => (
  <motion.div
    initial={{ y: 10, opacity: 0, scale: 0.9 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 10, opacity: 0, scale: 0.9 }}
    className="absolute -top-12 left-0 z-50 bg-popover text-popover-foreground p-2 rounded-full shadow-lg border border-border flex gap-1.5"
  >
    {EMOJIS.map((emoji) => (
      <button
        key={emoji}
        onClick={() => onSelect(emoji)}
        className="text-lg hover:scale-125 transition-transform p-1 hover:bg-muted/50 rounded-full"
      >
        {emoji}
      </button>
    ))}
  </motion.div>
);

// --- Mention Suggestions ---
const MentionSuggestions = ({ users, onSelect }) => (
  <motion.div
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="absolute z-50 bottom-full left-4 right-4 mb-2 bg-popover text-popover-foreground rounded-lg shadow-xl border border-border overflow-hidden"
  >
    <ul className="max-h-48 overflow-y-auto">
      {users.map((user, idx) => (
        <li key={user?._id || `user-${idx}`}>
          <button
            onClick={() => onSelect(user.name)}
            className="w-full text-left flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
          >
            <Image
              src={user.image || "/default-avatar.png"}
              alt={user.name}
              width={24}
              height={24}
              className="rounded-full border border-border"
            />
            <span className="font-medium text-sm">{user.name}</span>
          </button>
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- Message Renderer ---
const renderMessageContent = (content, currentUserEmail, session) => {
  const mentionRegex = /@(\w+\s\w+)|@(\w+)/g;
  const parts = content.split(mentionRegex);

  return parts.map((part, index) => {
    if (part && content.includes(`@${part}`)) {
      const isCurrentUserMention =
        currentUserEmail && content.includes(`@${session.user.name}`);
      return (
        <span
          key={`mention-${index}`}
          className={`font-semibold rounded px-1 text-xs mx-0.5 ${
            isCurrentUserMention
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
              : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
          }`}
        >
          @{part}
        </span>
      );
    }
    return part;
  });
};

const Chat = ({ onClose, className = "" }) => {
  const { socket, collabId, currentUser: sessionUser } = useCollab();
  const session = { user: sessionUser };

  const [messages, setMessages] = useState([]);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!socket || !collabId) return;

    const handleReceiveMessage = (message) =>
      setMessages((prev) => [...prev, message]);

    const handleReceiveReaction = ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, reactions } : msg,
        ),
      );
    };

    const handleUserTyping = (user) => {
      if (user.email === session?.user?.email) return;
      setTypingUsers((prev) => {
        if (!prev.some((u) => u.email === user.email)) return [...prev, user];
        return prev;
      });
    };

    const handleUserStoppedTyping = (user) => {
      setTypingUsers((prev) => prev.filter((u) => u.email !== user.email));
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("receive_reaction", handleReceiveReaction);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stopped_typing", handleUserStoppedTyping);

    // Initial Data Fetch
    const fetchData = async () => {
      try {
        const [msgRes, partRes] = await Promise.all([
          fetch(`/api/collab/${collabId}/chat`),
          fetch(`/api/collab/${collabId}/participants`),
        ]);

        if (msgRes.ok) setMessages(await msgRes.json());
        if (partRes.ok) {
          const data = await partRes.json();
          if (data?.participants) {
            setParticipants(
              data.participants.map((p) => p.user).filter(Boolean),
            );
          }
        }
      } catch (e) {
        console.error("Chat data fetch error", e);
      }
    };
    fetchData();

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("receive_reaction", handleReceiveReaction);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stopped_typing", handleUserStoppedTyping);
    };
  }, [socket, collabId, session?.user?.email]);

  const handleTyping = () => {
    if (!socket) return;
    socket.emit("typing", { collabId, user: session.user });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { collabId, user: session.user });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user || !socket) return;

    const messageData = {
      collabId,
      content: newMessage,
      sender: session.user,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", { collabId, user: session.user });

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    await fetch(`/api/collab/${collabId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newMessage }),
    });
  };

  const handleReaction = async (messageId, emoji) => {
    if (!messageId) return;

    setMessages((prev) => {
      return prev.map((msg) => {
        if (msg._id !== messageId) return msg;
        const reactions = JSON.parse(JSON.stringify(msg.reactions || []));
        const currentUser = {
          email: session.user.email,
          name: session.user.name,
        };

        // Optimistic update logic omitted for brevity, essentially same as before but cleaner
        // ... (preserving existing logic structure for brevity in rewrite)
        let userPrevReaction = null;
        reactions.forEach((r) => {
          const idx = r.users.findIndex((u) => u.email === currentUser.email);
          if (idx > -1) {
            userPrevReaction = r.emoji;
            r.users.splice(idx, 1);
          }
        });
        const cleanReactions = reactions.filter((r) => r.users.length > 0);

        if (userPrevReaction !== emoji) {
          const existing = cleanReactions.find((r) => r.emoji === emoji);
          if (existing) existing.users.push(currentUser);
          else cleanReactions.push({ emoji, users: [currentUser] });
        }
        return { ...msg, reactions: cleanReactions };
      });
    });

    const res = await fetch(`/api/collab/${collabId}/chat/${messageId}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });

    if (res.ok) {
      const updated = await res.json();
      socket.emit("send_reaction", {
        collabId,
        messageId: updated._id,
        reactions: updated.reactions,
      });
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);
    const mentionMatch = /@([\w\s]*)$/.exec(text);
    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
    } else {
      setShowMentions(false);
    }
    handleTyping();
  };

  return (
    <motion.div
      layout
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`flex flex-col font-geist-sans h-full bg-card border-l border-border shadow-2xl ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div>
          <h2 className="font-semibold font-hacker text-foreground">Chat</h2>
          <p className="text-xs text-muted-foreground">
            {participants.length} Members
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-4 bg-muted/10">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.sender.email === session?.user?.email;
            return (
              <div
                key={msg._id || i}
                onMouseEnter={() => setHoveredMessageId(msg._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
                className={`relative group flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex max-w-[85%] ${
                    isMe ? "flex-row-reverse" : "flex-row"
                  } gap-2`}
                >
                  {!isMe && (
                    <Image
                      src={msg.sender.image || "/default-avatar.png"}
                      alt={msg.sender.name}
                      width={28}
                      height={28}
                      title={msg.sender.name}
                      className="rounded-full w-7 h-7 mt-1 border border-border"
                    />
                  )}

                  <div
                    className={`relative px-4 py-2 rounded-2xl shadow-sm text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card text-card-foreground border border-border/50 rounded-bl-sm"
                    }`}
                  >
                    {/* Hover Emoji Trigger */}
                    <div
                      className={`absolute top-0 ${
                        isMe ? "-left-8" : "-right-8"
                      } opacity-0 group-hover:opacity-100 transition-opacity p-1`}
                    >
                      {msg._id && (
                        <EmojiPicker
                          onSelect={(emoji) => handleReaction(msg._id, emoji)}
                        />
                      )}
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed">
                      {renderMessageContent(
                        msg.content,
                        session?.user?.email,
                        session,
                      )}
                    </p>

                    {msg.reactions?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map(({ emoji, users }) => (
                          <span
                            key={emoji}
                            className="bg-background/50 backdrop-blur px-1.5 py-0.5 rounded-full text-[10px] border border-border/50 shadow-sm"
                          >
                            {emoji} {users.length}
                          </span>
                        ))}
                      </div>
                    )}

                    <span
                      title={msg.sender.name}
                      className={`text-[10px] block mt-1 opacity-70 ${
                        isMe
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.sender.name.split(" ")[0]} •{" "}
                      {formatDistanceToNow(new Date(msg.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card relative pb-safe">
        {showMentions && (
          <MentionSuggestions
            users={participants.filter((p) =>
              p.name.toLowerCase().startsWith(mentionQuery.toLowerCase()),
            )}
            onSelect={(name) => {
              setNewMessage((prev) => prev.replace(/@([\w\s]*)$/, `@${name} `));
              setShowMentions(false);
            }}
          />
        )}

        {typingUsers.length > 0 && (
          <div className="absolute -top-6 left-4 text-xs text-muted-foreground animate-pulse">
            {typingUsers.map((u) => u.name.split(" ")[0]).join(", ")} is
            typing...
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            className="flex-grow px-4 py-2.5 bg-muted/30 border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            placeholder="Type message... (@ to mention)"
            value={newMessage}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chat;
