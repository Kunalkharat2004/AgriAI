import { useState, useEffect, useRef } from "react";
import { FaChevronUp, FaPaperPlane, FaRobot } from "react-icons/fa";
import {
  MdClear,
  MdMic,
  MdMicOff,
  MdVolumeUp,
  MdVolumeOff,
  MdPlayArrow,
  MdPause,
} from "react-icons/md";

const ChatBot = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const INTRO_WORDS = ["hi", "hello", "hey", "greetings"];

  // State variables
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello, This is AgriBot! Ask me anything about farming and agriculture!",
      isBot: true,
      id: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // TTS States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeechData, setCurrentSpeechData] = useState({
    text: "",
    currentIndex: 0,
    chunks: [],
    messageId: null,
  });
  const [availableVoices, setAvailableVoices] = useState([]);

  // Refs
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setInputValue(transcriptText);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Load available voices for speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Scroll detection for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      window.scrollY >= 100 ? setIsVisible(true) : setIsVisible(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to bottom of messages whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target) &&
        !event.target.closest("[data-chat-toggle]")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBackTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputValue("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop all speech synthesis
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    if (speechUtteranceRef.current) {
      speechUtteranceRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Get the best female voice available
  const getBestVoice = () => {
    if (availableVoices.length === 0) return null;

    // Try to find a female voice
    const femaleVoice = availableVoices.find(voice =>
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria')
    );

    if (femaleVoice) return femaleVoice;

    // Fallback to any English voice
    const englishVoice = availableVoices.find(voice =>
      voice.lang.startsWith('en')
    );

    return englishVoice || availableVoices[0];
  };

  // Clean text for speech (remove markdown)
  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1")     // Remove italic
      .replace(/#{1,6}\s/g, "")        // Remove headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links
      .trim();
  };

  // Split text into manageable chunks
  const createTextChunks = (text) => {
    const maxChunkLength = 200;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (currentChunk.length + trimmedSentence.length + 1 <= maxChunkLength) {
        currentChunk += (currentChunk ? ". " : "") + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + ".");
        }
        currentChunk = trimmedSentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk + ".");
    }

    return chunks.length > 0 ? chunks : [text];
  };

  // Speak from a specific chunk index
  const speakFromIndex = (chunks, startIndex) => {
    if (startIndex >= chunks.length) {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSpeechData(prev => ({ ...prev, currentIndex: 0 }));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[startIndex]);
    const voice = getBestVoice();
    
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.pitch = 1.1;
    }
    
    utterance.rate = 0.9;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      const nextIndex = startIndex + 1;
      setCurrentSpeechData(prev => ({ ...prev, currentIndex: nextIndex }));
      
      // Continue with next chunk if not paused and more chunks exist
      if (!isPaused && nextIndex < chunks.length) {
        speakFromIndex(chunks, nextIndex);
      } else {
        setIsSpeaking(false);
        if (nextIndex >= chunks.length) {
          setCurrentSpeechData(prev => ({ ...prev, currentIndex: 0 }));
        }
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Start speaking the latest bot message
  const startSpeaking = () => {
    // Find the latest bot message
    const latestBotMessage = [...messages].reverse().find(msg => msg.isBot);
    
    if (!latestBotMessage) return;

    const cleanedText = cleanTextForSpeech(latestBotMessage.text);
    const chunks = createTextChunks(cleanedText);

    setCurrentSpeechData({
      text: cleanedText,
      currentIndex: 0,
      chunks: chunks,
      messageId: latestBotMessage.id,
    });

    speakFromIndex(chunks, 0);
  };

  // Resume speaking from where it was paused
  const resumeSpeaking = () => {
    if (currentSpeechData.chunks.length > 0) {
      speakFromIndex(currentSpeechData.chunks, currentSpeechData.currentIndex);
    }
  };

  // Pause speaking
  const pauseSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPaused(true);
    setIsSpeaking(false);
  };

  // Toggle speech (play/pause)
  const toggleSpeech = () => {
    if (isSpeaking) {
      // Currently speaking, so pause
      pauseSpeaking();
    } else if (isPaused && currentSpeechData.chunks.length > 0) {
      // Paused, so resume
      resumeSpeaking();
    } else {
      // Not speaking and not paused, so start from beginning
      startSpeaking();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      isBot: false,
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Stop any ongoing speech when new message is sent
    stopSpeech();

    // For intro words, provide an immediate welcome response
    if (INTRO_WORDS.includes(inputValue.toLowerCase().trim())) {
      setTimeout(() => {
        const botResponse = {
          text: "Hello! Welcome to AgriBot! How can I assist you with farming today?",
          isBot: true,
          id: Date.now(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 600);
      return;
    }

    try {
      await processMessage(inputValue);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again later.",
        isBot: true,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const processMessage = async (userInput) => {
    if (!API_KEY) {
      const errorMessage = {
        text: "API key is missing. Please configure your API key.",
        isBot: true,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      return;
    }

    const systemMessage = {
      text: "You are AgriBot, an AI-powered farming assistant. Your job is to provide accurate, context-aware, and professional responses to user queries related to agriculture, crop management, soil health, pest control, weather impact, and sustainable farming practices. Align your responses with modern agricultural guidelines and best practices. IMPORTANT: Do not use asterisks (*) or markdown formatting in your responses.",
    };

    // Prepare conversation context
    const formattedMessages = [
      {
        parts: [
          { text: systemMessage.text },
          ...messages.map((msg) => ({ text: msg.text })),
          { text: userInput },
        ],
      },
    ];

    const apiRequestBody = { contents: formattedMessages };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      let botResponseText = "";
      if (responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        botResponseText = responseData.candidates[0].content.parts[0].text;
      } else {
        botResponseText =
          "I'm having trouble processing your request. Please try again.";
      }

      const botResponse = {
        text: botResponseText,
        isBot: true,
        id: Date.now(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = {
        text: "An error occurred while connecting to the server. Please try again later.",
        isBot: true,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to convert markdown to HTML for proper display
  const formatMessage = (text) => {
    // Replace **text** with <strong>text</strong>
    const boldText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Replace *text* with <em>text</em>
    const formattedText = boldText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return formattedText;
  };

  // Get speaking button icon and title
  const getSpeechButtonProps = () => {
    if (isSpeaking) {
      return {
        icon: <MdPause size={18} />,
        title: "Pause speaking"
      };
    } else if (isPaused) {
      return {
        icon: <MdPlayArrow size={18} />,
        title: "Resume speaking"
      };
    } else {
      return {
        icon: <MdVolumeUp size={18} />,
        title: "Start speaking latest response"
      };
    }
  };

  const speechButtonProps = getSpeechButtonProps();

  // Render mobile-friendly chatbot
  return (
    <>
      {/* Custom styles for typing indicator */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Back to top button */}
      {!open && isVisible && (
        <div
          className="fixed bottom-20 right-4 z-30 text-white p-3 cursor-pointer rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            boxShadow:
              "0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
          title="Back to top"
          onClick={handleBackTop}
        >
          <FaChevronUp />
        </div>
      )}

      {/* Chat toggle button */}
      <div
        data-chat-toggle
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-4 z-30 text-white p-4 cursor-pointer rounded-full shadow-lg hover:scale-110 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          boxShadow:
            "0 8px 25px -5px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        title={open ? "Close chat" : "Open chat"}
      >
        {open ? <MdClear size={24} /> : <FaRobot size={24} />}
      </div>

      {/* Chat container */}
      <div
        ref={chatbotRef}
        className={`fixed right-4 bg-white z-40 border border-gray-300 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out backdrop-blur-sm ${
          open
            ? "bottom-24 w-80 max-w-full h-96 opacity-100 visible"
            : "bottom-16 w-0 h-0 opacity-0 invisible"
        }`}
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Chat header */}
        <div
          className="text-white px-4 py-4 rounded-t-3xl flex justify-between items-center"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <FaRobot className="text-white" size={16} />
            </div>
            <div>
              <span className="font-semibold text-lg">AgriBot</span>
              <div className="text-xs text-blue-100">AI Assistant</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={toggleSpeech}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              title={speechButtonProps.title}
            >
              {speechButtonProps.icon}
            </button>
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:bg-white/20"
              }`}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MdMicOff size={18} /> : <MdMic size={18} />}
            </button>
          </div>
        </div>

        {/* Messages container */}
        <div
          className="h-64 overflow-y-auto p-4"
          style={{
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.isBot ? "flex justify-start" : "flex justify-end"
              }`}
            >
              <div
                className={`max-w-3/4 px-4 py-3 rounded-2xl shadow-sm ${
                  msg.isBot
                    ? "bg-white text-gray-800 rounded-tl-md border border-gray-100"
                    : "text-white rounded-tr-md"
                }`}
                style={
                  msg.isBot
                    ? {}
                    : {
                        background:
                          "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                        boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                      }
                }
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              ></div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl rounded-tl-md border border-gray-100 shadow-sm">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          className="border-t p-4 flex items-center rounded-b-3xl"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            borderColor: "#e5e7eb",
          }}
        >
          <div className="flex-grow relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isListening ? "Listening..." : "Type your message..."
              }
              className="w-full bg-white border-2 border-gray-200 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-500"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                color: "#111827",
              }}
              disabled={isListening}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && !isListening}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none hover:bg-blue-700 transition-all duration-200 shadow-md"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
              }}
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;