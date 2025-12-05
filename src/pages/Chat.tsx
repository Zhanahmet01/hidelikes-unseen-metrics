import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  isAI: boolean;
  unread?: number;
}

type AIMessage = { role: "user" | "assistant"; content: string };

interface DisplayMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const mockChats: Chat[] = [
  {
    id: "ai-assistant",
    name: "AI Ассистент",
    lastMessage: "Чем могу помочь?",
    time: "Сейчас",
    isAI: true,
  },
  {
    id: "1",
    name: "Анна Иванова",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Увидимся завтра!",
    time: "2 мин",
    isAI: false,
    unread: 2,
  },
  {
    id: "2",
    name: "Петр Сидоров",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Звучит отлично!",
    time: "1 ч",
    isAI: false,
  },
  {
    id: "3",
    name: "Мария Козлова",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "Спасибо за обновление",
    time: "3 ч",
    isAI: false,
  },
];

const mockMessages: DisplayMessage[] = [
  { id: "1", text: "Привет! Как дела?", sender: "other", time: "10:30" },
  { id: "2", text: "Привет! Отлично, спасибо!", sender: "me", time: "10:31" },
  { id: "3", text: "Хочешь встретиться попозже?", sender: "other", time: "10:32" },
  { id: "4", text: "Конечно! Во сколько?", sender: "me", time: "10:33" },
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const streamAIChat = async (messages: AIMessage[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Ошибка при отправке сообщения");
    }

    if (!resp.body) throw new Error("Нет ответа от сервера");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    const responseId = Date.now().toString();

    // Add initial empty assistant message
    setDisplayMessages(prev => [...prev, {
      id: responseId,
      text: "",
      sender: "other",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setDisplayMessages(prev => 
              prev.map(msg => msg.id === responseId ? { ...msg, text: assistantContent } : msg)
            );
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Update AI messages history
    setAiMessages(prev => [...prev, { role: "assistant", content: assistantContent }]);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;

    const newMessage: DisplayMessage = {
      id: Date.now().toString(),
      text: messageInput,
      sender: "me",
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    setDisplayMessages(prev => [...prev, newMessage]);
    const userInput = messageInput;
    setMessageInput("");

    if (selectedChat.isAI) {
      setIsLoading(true);
      const newAiMessages: AIMessage[] = [...aiMessages, { role: "user", content: userInput }];
      setAiMessages(newAiMessages);

      try {
        await streamAIChat(newAiMessages);
      } catch (error: any) {
        console.error("AI Chat error:", error);
        toast.error(error.message || "Ошибка при отправке сообщения");
        setDisplayMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: `Ошибка: ${error.message}`,
          sender: "other",
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock response for user chats
      setTimeout(() => {
        setDisplayMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Это демо-ответ. Реальные сообщения будут доступны после подключения базы данных.",
          sender: "other",
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        }]);
      }, 1000);
    }
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setAiMessages([]);
    if (chat.isAI) {
      setDisplayMessages([{
        id: "ai-welcome",
        text: "Привет! Я AI-ассистент HideLikes. Задайте мне любой вопрос!",
        sender: "other",
        time: "Сейчас",
      }]);
    } else {
      setDisplayMessages(mockMessages);
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">Сообщения</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <Input
                  placeholder="Поиск чатов..."
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
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover-lift ${
                      selectedChat.id === chat.id ? "bg-hover" : "hover:bg-background-secondary"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        {chat.isAI ? (
                          <div className="w-full h-full bg-primary flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary-foreground" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
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
                        <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                        <span className="text-xs text-text-muted whitespace-nowrap">{chat.time}</span>
                      </div>
                      <p className="text-sm text-text-secondary truncate">{chat.lastMessage}</p>
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
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{selectedChat.name}</h3>
                <p className="text-sm text-text-muted">
                  {selectedChat.isAI ? "AI Ассистент • Всегда онлайн" : "Онлайн"}
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {displayMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.sender === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background-secondary text-foreground"
                      }`}
                    >
                      <p className="text-base whitespace-pre-wrap">{message.text}</p>
                      <span
                        className={`text-xs mt-1 block ${
                          message.sender === "me" ? "text-primary-foreground/70" : "text-text-muted"
                        }`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && displayMessages[displayMessages.length - 1]?.sender === "me" && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-background-secondary rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-3">
                <Input
                  placeholder="Написать сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isLoading}
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
