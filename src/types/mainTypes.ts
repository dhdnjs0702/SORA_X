export interface answerPropsType {
  isLoading: boolean;
  answer: string;
  question: string;
  imageUrl?: string | null;
}

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
