export interface ChatMessage {
  role: 'user' | 'ai';
  prompt: string;
  code?: string;
}

export interface Project {
  _id: string;
  userId: string;
  title: string;
  chatHistory: ChatMessage[];
  currentCode: string;
  activeJobId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RenderStatus = 'IDLE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export type ViewType = 'editor' | 'preview';