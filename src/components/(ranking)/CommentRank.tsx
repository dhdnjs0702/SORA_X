import { RANKING_COUNT, RANKING_TOP3 } from "@/constants/ranking/rank";
import { CommentUsersResponse } from "@/utils/ranking/server-action";
import React from "react";

const CommentRank = ({ commentUsers }: { commentUsers: CommentUsersResponse[] | null }) => {
  const userNickname = (commentUsers ?? []).map((user) => user.user_nickname);
  const commentCount = (commentUsers ?? []).map((user) => user.answer_count);

  return (
    <ul className="space-y-5">
      {RANKING_COUNT.map((count, i) => {
        return (
          <li key={count} className="flex flex-row gap-8 w-full">
            <p
              className={`w-16 text-right text-2xl mr-16 ${
                RANKING_TOP3.includes(count) ? "text-color-orange1" : "text-white"
              }`}
            >
              {commentCount[i] ? `${count} 등` : ""}
            </p>
            <p className="w-56 text-xl mr-96">{userNickname[i]}</p>
            <p className="w-16 flex-1 text-xl text-right">{commentCount[i] ? `${commentCount[i]}회` : ""}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default CommentRank;
