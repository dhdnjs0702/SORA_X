"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ useRouter 사용
import supabase from "../supabase/client";
import { Answer } from "@/types/mainTypes";
import { IoIosArrowForward } from "react-icons/io";

const CommunityPage = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 🔹 비동기 데이터 로드 함수
  useEffect(() => {
    const fetchAnswers = async () => {
      const { data, error } = await supabase
        .from("answers")
        .select("*, user: users (user_id, user_nickname)")
        .order("answer_created_at", { ascending: false });

      if (error) {
        setError("데이터 불러오기에 실패했습니다.");
      } else {
        setAnswers(data || []);
      }
    };

    fetchAnswers();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="wrapper w-full h-screen overflow-hidden bg-color-black1">
      <div className="container w-1/2 flex flex-col mx-auto pt-24">
        <h1 className="text-3xl font-bold mb-8">질문의 광장</h1>
        <div className="bg-color-black2 rounded-xl w-full h-16 flex justify-start items-center px-8 mb-8">
          <h2 className="text-lg">
            <span className="text-color-orange2">
              다른 이용자들의 질문과 답변
            </span>
            을 확인하고, 함께 공부해 보세요!
          </h2>
        </div>

        {/* 질문 리스트 */}
        <div className="w-full max-h-[600px] overflow-y-auto space-y-6">
          {answers?.map((item: Answer) => (
            <div
              key={item.answer_id}
              onClick={() => router.push(`/detail/${item.answer_id}`)} // ✅ 클릭 시 이동
              className="w-full h-40 overflow-y-hidden bg-color-black1 text-white text-justify text-md rounded-lg cursor-pointer hover:bg-color-black2 transition"
            >
              {/* 닉네임 + 날짜 */}
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-md text-color-orange2 font-semibold">
                  🧩 {item.user?.user_nickname || "익명"}
                </span>
                <span className="text-sm text-color-black4">
                  {new Date(item.answer_created_at).toLocaleString()}
                </span>
              </div>
              <div className="w-full h-56 flex justify-between">
                <div className="flex flex-col">
                  {/* 질문 */}
                  <h2 className="text-md text-white font-semibold mb-2">
                    {item.answer_text}
                  </h2>
                  {/* 답변 */}
                  <p className=" w-full line-clamp-3 text-color-black4">
                    {item.answer_answer}
                  </p>
                </div>
                {/* 질문 이미지 (null 가능) */}
                {item.answer_image && (
                  <div className="border rounded-lg w-52 h-36 flex justify-center items-center">
                    <img
                      src={item.answer_image}
                      alt="질문 이미지"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {/* 화살표 아이콘 */}
                <IoIosArrowForward className="w-8 h-8 aspect-square text-xl text-gray-300 bg-color-black4 rounded-full p-2 flex items-center justify-center" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
