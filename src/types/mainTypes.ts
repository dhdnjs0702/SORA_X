export interface answerPropsType {
  isLoading: boolean;
  answer: string;
  question: string;
  imageUrl?: string | null;
}

export type User = {
  user_id: string;
  user_created_at: string;
  user_nickname: string;
  user_email: string;
};

export type Answer = {
  answer_id: string;
  answer_created_at: string;
  answer_image?: string;
  answer_text: string;
  answer_answer: string;
  user?: User | null;
};

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export interface MessageTypes {
  role: "system" | "user";
  content: string | MessageContent[];
}

export interface RequestData {
  question: string;
  image_url?: string;
}
