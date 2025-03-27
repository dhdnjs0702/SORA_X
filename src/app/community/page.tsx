"use client";

import { useEffect, useState } from "react";
import supabase from "../supabase/client";
import { Answer } from "@/types/mainTypes";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";

const CommunityPage = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    <div className="wrapper w-full h-screen overflow-hidden flex flex-col justify-center items-center">
      <div className="rounded-3xl w-full h-full flex justify-center items-center bg-color-black1 m-3">
        <div className="container w-1/2 flex flex-col mx-auto">
          <h1 className="text-3xl font-bold mb-8">질문의 광장</h1>
          <div className="bg-color-black2 rounded-xl w-full h-16 flex justify-start items-center px-8 mb-8">
            <h2 className="text-lg">
              <span className="text-color-orange2">
                다른 이용자들의 질문과 답변
              </span>
              을 확인하고, 함께 공부해 보세요!
            </h2>
          </div>
          <h1 className="text-lg font-semibold underline decoration-4 underline-offset-8 mb-10">
            전체
          </h1>
          <div className="w-full max-h-[500px] overflow-y-auto space-y-4 flex flex-col">
            {answers?.map((item: Answer) => (
              <Link key={item.answer_id} href={`/detail/${item.answer_id}`}>
                <div className="w-full h-40 flex flex-col justify-center overflow-y-hidden bg-color-black1 text-white text-justify text-md rounded-lg group">
                  <div className="w-full flex justify-between items-center mb-2">
                    <span className="text-md text-color-orange2 font-semibold">
                      🧩 {item.user?.user_nickname ?? "익명"}
                    </span>
                    <span className="text-sm text-color-black4">
                      {new Date(item.answer_created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-56 flex justify-between">
                    <div className="w-8/12 flex flex-col">
                      <h2 className="text-md text-white font-semibold mb-2">
                        {item.answer_text}
                      </h2>
                      <p className="w-full line-clamp-2 text-color-black4">
                        {item.answer_answer}
                      </p>
                    </div>
                    <div className="w-3/12 flex justify-center items-center ml-4">
                      {item.answer_image && (
                        <div className="border rounded-lg w-48 h-28 flex justify-center items-center">
                          <Image
                            src={item.answer_image}
                            alt="질문 이미지"
                            className="w-full h-full object-contain"
                            width={60}
                            height={50}
                          />
                        </div>
                      )}
                    </div>
                    <div className="w-1/12 flex justify-center items-center">
                      <IoIosArrowForward className="arrow w-8 h-8 aspect-square text-xl text-gray-300 bg-color-black4 rounded-full p-2 flex items-center justify-center transition-all duration-300 group-hover:bg-color-orange2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
