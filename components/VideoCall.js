"use client";
import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaExpand,
  FaCompress,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";
import { useCollab } from "@/components/documents/CollabContext"; // Import Context

// --- Remote Video Component ---
const RemoteVideo = ({ stream, userName, isMuted, isVideoOff }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      layout
      className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video shadow-2xl group border border-white/5 ring-1 ring-white/10"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transform transition-transform duration-700 ${
          isVideoOff ? "hidden" : "block scale-100 group-hover:scale-105"
        }`}
      />
      {/* Fallback avatar if video is off */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-900 to-black ${
          isVideoOff ? "flex" : "hidden"
        }`}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30 animate-pulse">
          {userName ? userName[0].toUpperCase() : "?"}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="glass px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-white text-sm font-medium drop-shadow-md">
            {userName || "Unknown User"}
          </p>
        </div>
        {isMuted && (
          <div className="bg-red-500/80 p-2 rounded-full text-white backdrop-blur-sm">
            <FaMicrophoneSlash size={12} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function VideoCall({ roomId, onLeave }) {
  // Consume Context
  const { socket, currentUser } = useCollab();
  const userName = currentUser?.name || "Anonymous";

  const [myPeerId, setMyPeerId] = useState(null);
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState({}); // remoteStream by peerId
  const [peerNames, setPeerNames] = useState({}); // peerId -> userName

  // Local Media State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs for State
  const myVideoRef = useRef(null);
  const callsRef = useRef({}); // active PeerJS calls
  const socketRef = useRef(socket); // keep socket ref for callbacks
  const peerInstanceRef = useRef(null);
  const streamRef = useRef(null);
  const userNameRef = useRef(userName);

  // Sync refs safely
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);
  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  // Initialize Media and Peer
  useEffect(() => {
    if (!socket) return; // Wait for socket connection

    const init = async () => {
      try {
        // 1. Get User Media
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
        if (myVideoRef.current) myVideoRef.current.srcObject = currentStream;

        // 2. Initialize PeerJS
        // For production (Render), use the WebSocket URL base
        // For local, use localhost:3001
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
        const peerUrl =
          process.env.NEXT_PUBLIC_PEER_URL || "ws://localhost:3001";

        // Determine if we're using production URL (wss/https)
        const isProduction =
          wsUrl.startsWith("wss://") || wsUrl.startsWith("https://");

        let peerConfig;
        if (isProduction) {
          // Production: Server has path: "/" so client specifies full /peerjs path
          const wsUrlObj = new URL(
            wsUrl.replace("wss://", "https://").replace("ws://", "http://"),
          );
          peerConfig = {
            host: wsUrlObj.hostname,
            port: 443,
            path: "/peerjs", // Full path to PeerJS endpoint
            secure: true,
          };
        } else {
          // Local development: Use PEER_URL as before
          const peerUrlObj = new URL(peerUrl);
          peerConfig = {
            host: peerUrlObj.hostname,
            port: peerUrlObj.port ? parseInt(peerUrlObj.port) : 3001,
            path: "/",
            secure: false,
          };
        }

        const newPeer = new Peer(undefined, peerConfig);

        console.log("[VideoCall] Initializing PeerJS with config:", peerConfig);

        newPeer.on("open", (id) => {
          console.log("[VideoCall] My Peer ID:", id);
          console.log("[VideoCall] Peer Config:", peerConfig);
          setMyPeerId(id);
          peerInstanceRef.current = newPeer;

          // Join the video room via Server signaling using the existing socket
          socket.emit("join-video-room", roomId, id, userName);
        });

        // Add error handler
        newPeer.on("error", (error) => {
          console.error("[VideoCall] PeerJS Error:", error);
          console.error("[VideoCall] Error type:", error.type);
        });

        // Add disconnected handler
        newPeer.on("disconnected", () => {
          console.log("[VideoCall] PeerJS Disconnected - attempting reconnect");
          newPeer.reconnect();
        });

        // Add close handler
        newPeer.on("close", () => {
          console.log("[VideoCall] PeerJS Connection Closed");
        });

        // 3. Handle Incoming Calls
        newPeer.on("call", (call) => {
          console.log("[VideoCall] Incoming Call from:", call.peer);
          // Store caller name if available in metadata
          if (call.metadata && call.metadata.userName) {
            setPeerNames((prev) => ({
              ...prev,
              [call.peer]: call.metadata.userName,
            }));
          }

          call.answer(currentStream); // Send my stream back

          call.on("stream", (userVideoStream) => {
            console.log("[VideoCall] Received stream from caller");
            setPeers((prev) => ({ ...prev, [call.peer]: userVideoStream }));
          });

          call.on("close", () => {
            setPeers((prev) => {
              const newPeers = { ...prev };
              delete newPeers[call.peer];
              return newPeers;
            });
          });

          callsRef.current[call.peer] = call;
        });
      } catch (err) {
        console.error("[VideoCall] Init Error:", err);
      }
    };

    init();

    // 4. Handle Socket Signals
    const handleUserConnected = ({ peerId, userName: remoteName }) => {
      console.log("[VideoCall] User Connected:", peerId, remoteName);
      setPeerNames((prev) => ({ ...prev, [peerId]: remoteName }));
      connectToNewUser(peerId, streamRef.current, peerInstanceRef.current);
    };

    const handleUserDisconnected = (peerId) => {
      console.log("[VideoCall] User Disconnected:", peerId);
      if (callsRef.current[peerId]) callsRef.current[peerId].close();

      setPeers((prev) => {
        const newPeers = { ...prev };
        delete newPeers[peerId];
        return newPeers;
      });
    };

    socket.on("user-connected", handleUserConnected);
    socket.on("user-disconnected", handleUserDisconnected);

    // Cleanup
    return () => {
      socket.off("user-connected", handleUserConnected);
      socket.off("user-disconnected", handleUserDisconnected);

      if (peerInstanceRef.current) peerInstanceRef.current.destroy();
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [socket, roomId]);

  // Check Local Media Toggle
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !isMuted));
      stream.getVideoTracks().forEach((track) => (track.enabled = !isVideoOff));
    }
  }, [isMuted, isVideoOff, stream]);

  const connectToNewUser = (userId, currentStream, peerInstance) => {
    if (!currentStream || !peerInstance) return;

    console.log("[VideoCall] Calling peer:", userId);
    const call = peerInstance.call(userId, currentStream, {
      metadata: { userName: userNameRef.current },
    });

    call.on("stream", (userVideoStream) => {
      setPeers((prev) => ({ ...prev, [userId]: userVideoStream }));
    });

    call.on("close", () => {
      setPeers((prev) => {
        const newPeers = { ...prev };
        delete newPeers[userId];
        return newPeers;
      });
    });
    callsRef.current[userId] = call;
  };

  const handleLeave = () => {
    if (socket) socket.emit("leave-video-room", roomId, myPeerId);

    // Stop all local tracks
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }

    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }

    onLeave();
  };

  // --- UI RENDER ---
  const activePeersCount = Object.keys(peers).length;

  return (
    <motion.div
      drag={!isExpanded}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.05}
      dragMomentum={false}
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        width: isExpanded ? "100%" : "380px",
        height: isExpanded ? "100%" : "auto",
        position: isExpanded ? "fixed" : "static",
        inset: isExpanded ? 0 : "auto",
        borderRadius: isExpanded ? 0 : 28,
      }}
      className={`z-[100] glass-card overflow-hidden flex flex-col transition-colors duration-500 ease-in-out border border-white/20
        ${
          isExpanded
            ? "bg-gray-950/95 backdrop-blur-3xl"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        }
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between z-10 ${
          isExpanded ? "p-6" : "p-4 border-b border-border/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500">
            {activePeersCount === 0 ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaUsers />
            )}
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm">
              {activePeersCount === 0
                ? "Waiting for others..."
                : "Live Meeting"}
            </h3>
            {activePeersCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {activePeersCount + 1} Participants
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        >
          {isExpanded ? <FaCompress /> : <FaExpand />}
        </button>
      </div>

      {/* Video Grid */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar relative ${
          isExpanded
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 content-center"
            : "p-4 flex flex-col gap-4 max-h-[60vh]"
        }`}
      >
        {activePeersCount === 0 && !isExpanded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 text-muted-foreground pointer-events-none opacity-30">
            <div className="animate-ping absolute w-24 h-24 rounded-full bg-indigo-500/10" />
            <div className="animate-pulse absolute w-12 h-12 rounded-full bg-indigo-500/20" />
          </div>
        )}

        {/* My Video */}
        <motion.div
          layout
          className={`relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg group border border-white/5 ring-1 ring-white/10 ${
            isExpanded ? "aspect-video" : "aspect-video"
          }`}
        >
          <video
            ref={myVideoRef}
            muted
            autoPlay
            playsInline
            className={`w-full h-full object-cover mirror-mode transition-transform duration-700 ${
              isVideoOff ? "hidden" : "block scale-100 group-hover:scale-105"
            }`}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
                Me
              </div>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <p className="text-white text-xs font-semibold">
              You {isMuted && "(Muted)"}
            </p>
          </div>
        </motion.div>

        {/* Remote Videos */}
        <AnimatePresence>
          {Object.entries(peers).map(([peerId, peerStream]) => (
            <RemoteVideo
              key={peerId}
              stream={peerStream}
              userName={peerNames[peerId]}
              isMuted={false}
              isVideoOff={!peerStream.getVideoTracks()[0]?.enabled}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Controls Bar */}
      <div
        className={`flex items-center justify-center gap-4 ${
          isExpanded
            ? "fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-full glass border border-white/10 shadow-2xl z-50"
            : "p-4 bg-background/50 border-t border-border/50"
        }`}
      >
        <ControlBtn
          active={isMuted}
          onClick={() => setIsMuted(!isMuted)}
          onIcon={<FaMicrophoneSlash />}
          offIcon={<FaMicrophone />}
          activeClass="bg-red-500 text-white hover:bg-red-600"
          offClass="bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
        />

        <ControlBtn
          active={isVideoOff}
          onClick={() => setIsVideoOff(!isVideoOff)}
          onIcon={<FaVideoSlash />}
          offIcon={<FaVideo />}
          activeClass="bg-red-500 text-white hover:bg-red-600"
          offClass="bg-gray-100 dark:bg-gray-800 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700"
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeave}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all"
        >
          <FaPhoneSlash className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}

const ControlBtn = ({
  active,
  onClick,
  onIcon,
  offIcon,
  activeClass,
  offClass,
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-4 rounded-full transition-all duration-300 shadow-md ${
      active ? activeClass : offClass
    }`}
  >
    <div className="w-5 h-5 flex items-center justify-center">
      {active ? onIcon : offIcon}
    </div>
  </motion.button>
);
