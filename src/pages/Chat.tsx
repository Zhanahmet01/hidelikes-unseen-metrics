import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Search } from "lucide-react";

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  isAI: boolean;
  unread?: number;
}

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const mockChats: Chat[] = [
  {
    id: "ai-assistant",
    name: "AI Assistant",
    lastMessage: "How can I help you today?",
    time: "Now",
    isAI: true,
  },
  {
    id: "1",
    name: "Anna Smith",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "See you tomorrow!",
    time: "2m ago",
    isAI: false,
    unread: 2,
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "That sounds great!",
    time: "1h ago",
    isAI: false,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Thanks for the update",
    time: "3h ago",
    isAI: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hello! How are you?",
    sender: "other",
    time: "10:30",
  },
  {
    id: "2",
    text: "Hi! I'm doing great, thanks for asking!",
    sender: "me",
    time: "10:31",
  },
  {
    id: "3",
    text: "Would you like to grab coffee later?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Sure! What time works for you?",
    sender: "me",
    time: "10:33",
  },
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: "me",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");

    // Simulate AI response
    if (selectedChat.isAI) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm your AI assistant. How can I help you today?",
          sender: "other",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-main pt-8 pb-16">
        <div className="flex gap-6 h-[calc(100vh-160px)]">
          {/* Left Sidebar - Chat List */}
          <div className="w-80 bg-card rounded-2xl border border-border flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Messages
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      if (chat.id === "ai-assistant") {
                        setMessages([
                          {
                            id: "ai-1",
                            text: "Hello! I'm your AI assistant. How can I help you today?",
                            sender: "other",
                            time: "Now",
                          },
                        ]);
                      } else {
                        setMessages(mockMessages);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover-lift ${
                      selectedChat.id === chat.id
                        ? "bg-hover"
                        : "hover:bg-background-secondary"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        {chat.isAI ? (
                          <div className="w-full h-full bg-primary flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary-foreground" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>
                              <User className="w-6 h-6" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      {chat.unread && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Chat Area */}
          <div className="flex-1 bg-card rounded-2xl border border-border flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Avatar className="w-12 h-12">
                {selectedChat.isAI ? (
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">
                  {selectedChat.name}
                </h3>
                <p className="text-sm text-text-muted">
                  {selectedChat.isAI ? "AI Assistant" : "Active now"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "me" ? "justify-end" : "justify-start"
                    } animate-fade-in`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background-secondary text-foreground"
                      }`}
                    >
                      <p className="text-base">{message.text}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.sender === "me"
                            ? "text-primary-foreground/70"
                            : "text-text-muted"
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-3">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
