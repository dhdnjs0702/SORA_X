"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import supabase from "@/app/supabase/client";
import { useAuthStore } from "@/stores/store";

interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

const SignupForm = () => {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null); //서버 오류 저장

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>();

  const onSubmit = async (data: SignupData) => {
    const { email, password, nickname } = data;

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { user_nickname: nickname } },
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(signUpData.user);
      router.push("/"); // 회원가입 성공 시 홈페이지로 이동동
    }
  };

  return (
    <div className="w-[450px] h-4/6 bg-neutral-800 text-white py-12 px-10 rounded-2xl">
      <h3 className="text-2xl font-bold text-center mb-8">회원가입</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "이메일을 입력해주세요",
            })}
            className="w-full p-3 bg-zinc-600 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="이메일을 입력해주세요"
          />
          {errors.email && (
            <p className="text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 6,
                message: "비밀번호는 최소 6자 이상이어야 합니다",
              },
            })}
            className="w-full p-3 bg-zinc-600 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="비밀번호를 입력해주세요"
          />
          {errors.password && (
            <p className="text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* 닉네임 입력 */}
        <div>
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            {...register("nickname", { required: "닉네임을 입력해주세요" })}
            className="w-full p-3 bg-zinc-600 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            placeholder="닉네임을 입력해주세요"
          />
          {errors.nickname && (
            <p className="text-red-500 mt-1">{errors.nickname.message}</p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg"
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>

        {/* 서버 오류 메시지 */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>

      {/* 로그인 링크 */}
      <div className="text-center mt-4">
        <p className="text-gray-400 text-sm">
          이미 가입했어요!
          <Link href="/login">
            <button className="ml-2 border border-color-orange1 text-color-orange1 py-2 px-3 rounded-full font-medium text-sm transition-all duration-300 hover:bg-color-orange2 hover:text-white mt-2">
              로그인
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
