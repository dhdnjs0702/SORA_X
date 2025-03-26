import RankingHeader from "@/components/(ranking)/RankingHeader";
import RefreshButton from "@/components/(ranking)/RefreshButton";
import { ReactNode } from "react";
import { HiMiniTrophy } from "react-icons/hi2";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full bg-color-black1 flex flex-col items-center">
      <main>
        <div className="w-full flex flex-col mt-16 mb-8">
          <h1 className="flex justify-start text-4xl font-bold mb-8 gap-2">
            <HiMiniTrophy />
            학습 랭크
          </h1>
          <div className="flex flex-row justify-start items-center gap-4">
            <RankingHeader />
            <RefreshButton />
          </div>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
