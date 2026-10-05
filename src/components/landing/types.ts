export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}
