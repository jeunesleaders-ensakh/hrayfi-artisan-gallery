import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am the Hrayfi Assistant. How can I help you with Moroccan artisan products today?',
      isUser: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

 const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    const userMessage = { id: Date.now().toString(), text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Build conversation history
    const history = messages
        .filter(m => m.id !== '1') // Filter out Welcome Message
        .map(m => ({
            role: m.isUser ? "user" : "assistant",
            content: m.text
        }));

    const payload = {
        model: "arcee-ai/trinity-large-preview:free",
        messages: [
            {
                role: "system",
                content: "You are the Hrayfi Assistant, an expert in Moroccan artisan products. Provide helpful, culturally-aware recommendations. Be polite, concise, and helpful."
            },
            ...history,
            { role: "user", content: inputMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024,
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'X-Title': 'Hrayfi Assistant'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            throw new Error(`API Error: ${response.status} - ${errorBody.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const botText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request right now.";

        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: botText,
            isUser: false
        }]);

    } catch (error: any) {
        console.error("Fetch Error:", error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: "There was an error communicating with the AI. Please try again later.",
            isUser: false
        }]);
    } finally {
        setIsLoading(false);
    }
};

  return (
    <>
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
          <MessageCircle />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-sm font-bold uppercase">Hrayfi Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="text-xs text-muted-foreground animate-pulse">Assistant is thinking...</div>}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t flex gap-2">
              <Input 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                placeholder="Type your message..." 
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !inputMessage.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;