import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FaTrash, FaEnvelopeOpen, FaCalendarAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Fetch messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact");
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessage({ text: "Failed to load messages", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message log?")) return;
    try {
      await API.delete(`/contact/${id}`);
      setMessage({ text: "Message deleted successfully! 🗑️", isError: false });
      fetchMessages();
      setTimeout(() => setMessage({ text: "", isError: false }), 4000);
    } catch (err) {
      console.error("Error deleting message:", err);
      setMessage({ text: "Failed to delete message.", isError: true });
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Alert Messaging */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border text-center transition ${
            message.isError
              ? "bg-red-950/40 border-red-900 text-red-400 dark:bg-red-50 dark:border-red-200 dark:text-red-600"
              : "bg-green-950/40 border-green-900 text-green-400 dark:bg-green-50 dark:border-green-200 dark:text-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white dark:text-gray-900">Contact Messages</h3>
        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">
          {messages.length} inquiry {messages.length === 1 ? "log" : "logs"} found in the database
        </p>
      </div>

      {/* Message List */}
      {messages.length === 0 ? (
        <div className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 dark:shadow-md">
          Your inbox is empty. Client inquiries will appear here!
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-gray-900 dark:bg-white border border-gray-800 dark:border-gray-200 rounded-2xl p-6 space-y-4 hover:border-yellow-400/30 dark:hover:border-blue-500/30 transition dark:shadow-md"
            >
              {/* Row 1: Header details */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-yellow-400/10 dark:bg-blue-50 border border-yellow-400/20 dark:border-blue-200 text-yellow-400 dark:text-blue-600 rounded-lg text-xs">
                      <FaEnvelopeOpen />
                    </span>
                    <h4 className="text-sm font-bold text-white dark:text-gray-900">{msg.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <a
                      href={`mailto:${msg.email}`}
                      className="flex items-center gap-1.5 hover:text-white dark:hover:text-gray-900 transition text-gray-500 dark:text-gray-500"
                    >
                      <FaEnvelope /> {msg.email}
                    </a>
                    <span>•</span>
                    <a
                      href={`tel:${msg.phone}`}
                      className="flex items-center gap-1.5 hover:text-white dark:hover:text-gray-900 transition text-gray-500 dark:text-gray-500"
                    >
                      <FaPhoneAlt /> {msg.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <FaCalendarAlt /> {new Date(msg.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 bg-red-950/20 dark:bg-red-50 border border-red-900/30 dark:border-red-200 hover:bg-red-900/40 dark:hover:bg-red-100 text-red-400 dark:text-red-600 rounded-lg transition text-xs"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-gray-950 dark:bg-gray-50 border border-gray-850 dark:border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-300 dark:text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
