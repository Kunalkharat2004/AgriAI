import { useState, useEffect, useRef } from "react";
import {
  FaChevronUp,
  FaPaperPlane,
  FaRobot,
  FaChevronDown,
} from "react-icons/fa";
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

  // Language configurations
  const LANGUAGES = {
    en: {
      name: "English",
      code: "en-US",
      speechCode: "en-US",
      introWords: ["hi", "hello", "hey", "greetings"],
      initialMessage:
        "Hello, This is AgriBot! Ask me anything about farming and agriculture!",
      welcomeResponse:
        "Hello! Welcome to AgriBot! How can I assist you with farming today?",
      placeholderText: "Type your message...",
      listeningText: "Listening...",
      errorMessages: {
        apiKey: "API key is missing. Please configure your API key.",
        general: "Sorry, I encountered an error. Please try again later.",
        connection:
          "An error occurred while connecting to the server. Please try again later.",
        processing:
          "I'm having trouble processing your request. Please try again.",
      },
    },
    mr: {
      name: "मराठी",
      code: "mr-IN",
      speechCode: "hi-IN", // Fallback to Hindi for TTS as Marathi might not be available
      introWords: ["नमस्कार", "हाय", "हॅलो"],
      initialMessage:
        "नमस्कार, हा AgriBot आहे! शेतीकरी आणि कृषी संबंधित काहीही विचारा!",
      welcomeResponse:
        "नमस्कार! AgriBot मध्ये आपले स्वागत आहे! आज मी शेतीकरीबद्दल कशी मदत करू शकतो?",
      placeholderText: "आपला संदेश टाइप करा...",
      listeningText: "ऐकत आहे...",
      errorMessages: {
        apiKey: "API की गहाळ आहे. कृपया आपली API की कॉन्फिगर करा.",
        general:
          "माफ करा, मला एक त्रुटी आली आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
        connection:
          "सर्व्हरशी कनेक्ट होताना त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा.",
        processing:
          "मला आपली विनंती प्रक्रिया करण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा.",
      },
    },
    hi: {
      name: "हिंदी",
      code: "hi-IN",
      speechCode: "hi-IN",
      introWords: ["नमस्ते", "हाय", "हॅलो", "नमस्कार"],
      initialMessage:
        "नमस्ते, यह AgriBot है! खेती और कृषि के बारे में कुछ भी पूछें!",
      welcomeResponse:
        "नमस्ते! AgriBot में आपका स्वागत है! आज मैं खेती के बारे में आपकी कैसे सहायता कर सकता हूं?",
      placeholderText: "अपना संदेश टाइप करें...",
      listeningText: "सुन रहा हूं...",
      errorMessages: {
        apiKey: "API कुंजी गायब है. कृपया अपनी API कुंजी कॉन्फ़िगर करें.",
        general: "खुशी, मुझे एक त्रुटि आई है. कृपया बाद में पुन: प्रयास करें.",
        connection:
          "सर्वर से कनेक्ट करने में त्रुटि हुई. कृपया बाद में पुन: प्रयास करें.",
        processing:
          "मुझे आपका अनुरोध प्रोसेस करने में कठिनाई हो रही है. कृपया पुन: प्रयास करें.",
      },
    },
    ta: {
      name: "தமிழ்",
      code: "ta-IN",
      speechCode: "hi-IN", // Fallback to Hindi for TTS as Tamil might not be available
      introWords: ["வணக்கம்", "ஹாய்", "ஹலோ"],
      initialMessage:
        "வணக்கம், இது AgriBot! விவசாயம் மற்றும் வேளாண்மை பற்றி எதையும் கேளுங்கள்!",
      welcomeResponse:
        "வணக்கம்! AgriBot இல் உங்களை வரவேற்கிறோம்! இன்று விவசாயத்தில் நான் எப்படி உதவ முடியும்?",
      placeholderText: "உங்கள் செய்தியை டைப் செய்யுங்கள்...",
      listeningText: "கேட்டுக்கொண்டிருக்கிறேன்...",
      errorMessages: {
        apiKey:
          "API விசை காணவில்லை. தயவுசெய்து உங்கள் API விசையை கட்டமைக்கவும்.",
        general:
          "மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது. தயவுசெய்து பிறகு முயற்சிக்கவும்.",
        connection:
          "சர்வருடன் இணைக்கும்போது பிழை ஏற்பட்டது. தயவுசெய்து பிறகு முயற்சிக்கவும்.",
        processing:
          "உங்கள் கோரிக்கையை செயல்படுத்துவதில் எனக்கு சிரமம் உள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      },
    },
  };

  // State variables
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [messages, setMessages] = useState([]);
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
  const languageDropdownRef = useRef(null);

  // Initialize messages when language changes
  useEffect(() => {
    const currentLang = LANGUAGES[selectedLanguage];
    setMessages([
      {
        text: currentLang.initialMessage,
        isBot: true,
        id: Date.now(),
      },
    ]);
    // Stop any ongoing speech when language changes
    stopSpeech();
  }, [selectedLanguage]);

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

    // Set language for speech recognition
    recognitionRef.current.lang = LANGUAGES[selectedLanguage].code;

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
  }, [selectedLanguage]);

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

      // Close language dropdown if clicked outside
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setShowLanguageDropdown(false);
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
      // Update recognition language
      recognitionRef.current.lang = LANGUAGES[selectedLanguage].code;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Handle language change
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setShowLanguageDropdown(false);
    stopSpeech(); // Stop any ongoing speech
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

  // Get the best voice for selected language
  const getBestVoice = () => {
    if (availableVoices.length === 0) return null;

    const currentLang = LANGUAGES[selectedLanguage];
    const langCode = currentLang.speechCode;

    // Try to find voice for the specific language
    const langVoice = availableVoices.find((voice) =>
      voice.lang.startsWith(langCode.split("-")[0])
    );

    if (langVoice) return langVoice;

    // Try to find a female voice for any language
    const femaleVoice = availableVoices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("samantha")
    );

    return femaleVoice || availableVoices[0];
  };

  // Clean text for speech (remove markdown)
  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/#{1,6}\s/g, "") // Remove headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links
      .trim();
  };

  // Split text into manageable chunks
  const createTextChunks = (text) => {
    const maxChunkLength = 200;
    const sentences = text.split(/[.!?।॥]+/).filter((s) => s.trim().length > 0);
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
      setCurrentSpeechData((prev) => ({ ...prev, currentIndex: 0 }));
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
    utterance.lang = LANGUAGES[selectedLanguage].speechCode;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      const nextIndex = startIndex + 1;
      setCurrentSpeechData((prev) => ({ ...prev, currentIndex: nextIndex }));

      // Continue with next chunk if not paused and more chunks exist
      if (!isPaused && nextIndex < chunks.length) {
        speakFromIndex(chunks, nextIndex);
      } else {
        setIsSpeaking(false);
        if (nextIndex >= chunks.length) {
          setCurrentSpeechData((prev) => ({ ...prev, currentIndex: 0 }));
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
    const latestBotMessage = [...messages].reverse().find((msg) => msg.isBot);

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

    const currentLang = LANGUAGES[selectedLanguage];

    // For intro words, provide an immediate welcome response
    if (
      currentLang.introWords.some((word) =>
        inputValue.toLowerCase().trim().includes(word.toLowerCase())
      )
    ) {
      setTimeout(() => {
        const botResponse = {
          text: currentLang.welcomeResponse,
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
        text: currentLang.errorMessages.general,
        isBot: true,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const processMessage = async (userInput) => {
    const currentLang = LANGUAGES[selectedLanguage];

    if (!API_KEY) {
      const errorMessage = {
        text: currentLang.errorMessages.apiKey,
        isBot: true,
        id: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      return;
    }

    // Create language-specific system message
    const getLanguageInstruction = () => {
      switch (selectedLanguage) {
        case "mr":
          return "You are AgriBot, an AI-powered farming assistant. Respond ONLY in Marathi language. Your job is to provide accurate, context-aware, and professional responses to user queries related to agriculture, crop management, soil health, pest control, weather impact, and sustainable farming practices. Align your responses with modern agricultural guidelines and best practices. IMPORTANT: Always respond in Marathi regardless of the input language. Do not use asterisks (*) or markdown formatting in your responses.";
        case "hi":
          return "You are AgriBot, an AI-powered farming assistant. Respond ONLY in Hindi language. Your job is to provide accurate, context-aware, and professional responses to user queries related to agriculture, crop management, soil health, pest control, weather impact, and sustainable farming practices. Align your responses with modern agricultural guidelines and best practices. IMPORTANT: Always respond in Hindi regardless of the input language. Do not use asterisks (*) or markdown formatting in your responses.";
        case "ta":
          return "You are AgriBot, an AI-powered farming assistant. Respond ONLY in Tamil language. Your job is to provide accurate, context-aware, and professional responses to user queries related to agriculture, crop management, soil health, pest control, weather impact, and sustainable farming practices. Align your responses with modern agricultural guidelines and best practices. IMPORTANT: Always respond in Tamil regardless of the input language. Do not use asterisks (*) or markdown formatting in your responses.";
        default:
          return "You are AgriBot, an AI-powered farming assistant. Your job is to provide accurate, context-aware, and professional responses to user queries related to agriculture, crop management, soil health, pest control, weather impact, and sustainable farming practices. Align your responses with modern agricultural guidelines and best practices. IMPORTANT: Do not use asterisks (*) or markdown formatting in your responses.";
      }
    };

    const systemMessage = {
      text: getLanguageInstruction(),
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
        botResponseText = currentLang.errorMessages.processing;
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
        text: currentLang.errorMessages.connection,
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
        title: "Pause speaking",
      };
    } else if (isPaused) {
      return {
        icon: <MdPlayArrow size={18} />,
        title: "Resume speaking",
      };
    } else {
      return {
        icon: <MdVolumeUp size={18} />,
        title: "Start speaking latest response",
      };
    }
  };

  const speechButtonProps = getSpeechButtonProps();
  const currentLang = LANGUAGES[selectedLanguage];

  // Render mobile-friendly chatbot
  return (
    <>
      {/* Custom styles */}
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
          background-color: #6b7280;
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .chat-shadow {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .message-shadow {
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
      `}</style>

      {/* Back to top button */}
      {!open && isVisible && (
        <div
          className="fixed bottom-20 right-5 z-30 text-white p-3 cursor-pointer rounded-full shadow-lg hover:scale-110 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600"
          title="Back to top"
          onClick={handleBackTop}
        >
          <FaChevronUp size={20} />
        </div>
      )}

      {/* Chat toggle button */}
      <div
        data-chat-toggle
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 z-30 text-white p-4 cursor-pointer rounded-full shadow-lg hover:scale-110 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-600"
        title={open ? "Close chat" : "Open chat"}
      >
        {open ? <MdClear size={24} /> : <FaRobot size={24} />}
      </div>

      {/* Chat container */}
      <div
        ref={chatbotRef}
        className={`fixed right-4 z-40 bg-white rounded-2xl chat-shadow transition-all duration-300 ease-in-out ${
          open
            ? "bottom-24 w-96 max-w-[calc(100vw-2rem)] h-[32rem] opacity-100 visible"
            : "bottom-16 w-0 h-0 opacity-0 invisible"
        }`}
      >
        {/* Chat header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center flex-1">
            <div className="bg-white bg-opacity-20 p-2.5 rounded-full mr-3 shadow-sm">
              <FaRobot className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">AgriBot</h3>
              <p className="text-emerald-100 text-sm">AI Farming Assistant</p>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <span className="text-white font-medium">
                  {currentLang.name}
                </span>
                <FaChevronDown size={12} className="text-white" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-1 min-w-[140px] z-50">
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`w-full text-left px-4 py-2.5 transition-colors font-medium ${
                        selectedLanguage === code
                          ? "bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      style={{
                        backgroundColor:
                          selectedLanguage === code
                            ? "rgb(240 253 244)"
                            : "white",
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gray-50"
          style={{ height: "calc(100% - 128px)" }}
        >
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-start mb-4 ${
                msg.isBot ? "justify-start" : "justify-end"
              }`}
            >
              {msg.isBot && (
                <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-2.5 mr-3 shadow-sm">
                  <FaRobot className="text-white" size={16} />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed message-shadow ${
                  msg.isBot
                    ? "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                    : "bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-br-md"
                }`}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              ></div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start mb- justify-start">
              <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full p-2.5 mr-3 shadow-sm">
                <FaRobot className="text-white" size={16} />
              </div>
              <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-white text-gray-800 rounded-bl-md border border-gray-100 message-shadow">
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

        {/* Chat input */}
        <div className="bg-white border-t border-gray-100">
          <div className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200">
            {/* Speech toggle button */}
            <button
              onClick={toggleSpeech}
              title={speechButtonProps.title}
              className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 flex-shrink-0"
            >
              {speechButtonProps.icon}
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                ref={inputRef}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm placeholder-gray-500"
                placeholder={currentLang.placeholderText}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                style={{ minWidth: 0 }}
              />
            </div>

            {/* Microphone button */}
            <button
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start listening"}
              className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 flex-shrink-0 ${
                isListening
                  ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300"
                  : "text-gray-500 hover:bg-gray-100 focus:ring-gray-300"
              }`}
            >
              {isListening ? <MdMicOff size={18} /> : <MdMic size={18} />}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              title="Send message"
              className="p-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
              disabled={!inputValue.trim() || isTyping}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>

          {/* Status indicator */}
          {isListening && (
            <div className="mt-2 text-center">
              <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                {currentLang.listeningText}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
