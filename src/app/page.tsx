import MainDescCard from "@/components/mainpage/MainDescCard";
import MainSearchBar from "@/components/mainpage/MainSearchBar";
import MainTitle from "@/components/mainpage/MainTitle";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#141414] overflow-hidden relative py-10">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center pt-20">
        <MainTitle title="수학" />

        <MainSearchBar />
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
          <MainDescCard
            title="수학"
            desc="선형대수학을 할줄 알아도 자율주행은 못만들어요"
          />

          <MainDescCard title="SORA_X" desc="SORA_X는 실수를 할 수 있습니다" />

          <MainDescCard
            title="마법의 소라 고둥"
            desc="마법의 소라고둥 이스터에그가 있습니다."
          />
        </div>
      </div>
    </div>
  );
}
