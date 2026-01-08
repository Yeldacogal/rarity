export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: 'ADMIN' | 'USER';
  isBanned: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  subcategories?: Subcategory[];
  createdAt: string;
}

export type TagCategory = string; // Dynamic category slug

export interface Subcategory {
  id: number;
  name: string;
  category?: string; // Legacy field
  categoryId?: number;
  categoryEntity?: Category;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  category: string;
  subcategoryId?: number;
  subcategory?: Subcategory;
}

export interface Question {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author: User;
  tags: Tag[];
  answers?: Answer[];
  answerCount?: number;
}

export interface Answer {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  questionId: number;
  parentId?: number;
  author: User;
  votes?: Vote[];
  voteCount?: number;
  replies?: Answer[];
}

export interface Vote {
  id: number;
  userId: number;
  answerId: number;
}

export interface Report {
  id: number;
  reason: 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE' | 'MISINFORMATION' | 'OTHER';
  details?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  reporterId: number;
  answerId: number;
  reporter: User;
  answer: Answer & { question: Question };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Notification {
  id: number;
  type: 'NEW_ANSWER' | 'NEW_REPLY' | 'ANSWER_VOTED' | 'QUESTION_REPORTED' | 'ANSWER_REPORTED';
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: number;
  questionId?: number;
  answerId?: number;
  question?: Question;
  answer?: Answer;
}
