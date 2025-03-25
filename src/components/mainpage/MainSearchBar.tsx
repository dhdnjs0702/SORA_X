"use client";
//리팩토링 필요 -> 코드가 너무 길고 복잡해서 읽기가 싫어짐
import Image from "next/image";
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import MainAnswer from "./MainAnswer";
import MainImagePreview from "./MainImagePreview";
import supabase from "@/app/supabase/client";
import { User } from "@supabase/supabase-js";

const MainSearchBar = () => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [latestUserAnswer, setLatestUserAnswer] = useState<{
    answer_text: string;
    answer_answer: string;
    answer_image: string | null;
  } | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const session = supabase.auth.getSession();

      if (!session) {
        alert("로그인 세션이 없습니다.");

        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        alert("사용자 정보를 가져오는 중 에러가 발생했습니다.");
      } else {
        setUser(data.user);
      }
    };

    const fetchLatestAnswer = async () => {
      const data = await getAnswerFromSupabase();
      if (data) {
        setLatestUserAnswer({
          answer_text: data.answer_text,
          answer_answer: data.answer_answer,
          answer_image: data.answer_image,
        });
      }
    };

    if (user) {
      fetchLatestAnswer();
    }

    checkUser();
  }, [answer]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("5MB 이하의 이미지만 업로드 가능합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("sorax-img")
        .upload(fileName, file);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("sorax-img")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim() && !previewUrl) return;

    setIsLoading(true);
    setAnswer("");

    let imageUrl: string | null = null;

    try {
      if (fileInputRef.current?.files?.[0]) {
        imageUrl = await uploadImageToSupabase(fileInputRef.current.files[0]);
        if (!imageUrl) {
          alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          image_url: imageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "API 요청 실패");
      }

      const data = await res.json();
      setAnswer(data);

      const { error } = await supabase.from("answers").insert({
        answer_user_id: user?.id || "",
        answer_text: question,
        answer_image: imageUrl,
        answer_answer: data,
      });

      if (error) {
        console.error("데이터 저장 실패:", error);
      }
    } catch (error) {
      console.error("오류 발생:", error);
      setAnswer("죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAnswerFromSupabase = async () => {
    if (!user) {
      console.error("사용자 정보가 없습니다.");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("answers")
        .select("*")
        .eq("answer_user_id", user.id)
        .order("answer_created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("최신 답변 가져오기 실패:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("최신 답변 조회 중 오류 발생:", error);
      return null;
    }
  };
  console.log(latestUserAnswer);
  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mb-5">
        <div className="w-full h-16 bg-[#1a1a1a] rounded-[54.50px] border border-[#4a4a4a] flex items-center px-6">
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="질문을 입력하거나 파일을 업로드해보세요"
            className="w-full bg-transparent text-white text-lg font-['Gothic_A1'] focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleUploadButtonClick}
              className="flex-shrink-0"
            >
              <Image
                className="w-7 h-7"
                src="https://cdn-icons-png.flaticon.com/512/3459/3459593.png"
                alt="업로드 이미지"
                width={28}
                height={28}
              />
            </button>
            <button
              type="submit"
              className="flex-shrink-0"
              disabled={isLoading || (!question.trim() && !previewUrl)}
            >
              <Image
                className={`w-7 h-7 ${isLoading ? "opacity-50" : ""}`}
                src="https://cdn-icons-png.flaticon.com/512/7109/7109313.png"
                alt="검색 이미지"
                width={28}
                height={28}
              />
            </button>
          </div>
        </div>

        <MainImagePreview
          previewUrl={previewUrl}
          handleRemoveImage={handleRemoveImage}
        />
      </form>

      <MainAnswer
        isLoading={isLoading}
        answer={answer || latestUserAnswer?.answer_answer || ""}
        question={question || latestUserAnswer?.answer_text || ""}
        imageUrl={latestUserAnswer?.answer_image || undefined}
      />

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default MainSearchBar;
