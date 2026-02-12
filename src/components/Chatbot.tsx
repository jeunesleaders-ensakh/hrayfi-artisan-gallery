
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Hrayfi. How can I help you find the perfect Moroccan artisan product today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: currentInput
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      let responseText = '';
      if (data.answer) {
        responseText = data.answer;
      } else if (data.error) {
        responseText = data.error;
      } else {
        responseText = 'Sorry, I couldn\'t process your request right now.';
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Hrayfi Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 overflow-y-auto">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-3 mb-3">
              <div className="space-y-3">
                 {messages.map((message) => (
                   <div
                     key={message.id}
                     className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                   >
                     <div
                       className={`max-w-[80%] p-3 rounded-lg text-sm ${
                         message.isUser
                           ? 'bg-primary text-primary-foreground'
                           : 'bg-muted text-muted-foreground'
                       }`}
                     >
                       {message.text}
                     </div>
                   </div>
                 ))}
                 {isLoading && (
                   <div className="flex justify-start">
                     <div className="max-w-[80%] p-3 rounded-lg text-sm bg-muted text-muted-foreground">
                       <div className="flex items-center space-x-1">
                         <div className="flex space-x-1">
                           <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                           <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                           <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about our products..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Chatbot;
