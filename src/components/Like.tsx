import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import { StoreType } from "@/interface";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface LikeProps {
    storeId: number;
}

export default function Like({ storeId }: LikeProps) {
    const { data: session, status } = useSession();

    const fetchStore = async () => {
        const { data } = await axios(`/api/stores?id=${storeId}`);
        return data as StoreType;
    };

    const { data: store, refetch } = useQuery<StoreType>(
        `like-store-${storeId}`,
        fetchStore,
        {
            enabled: !!storeId,
            refetchOnWindowFocus: false,
        },
    );

    const toggleLike = async () => {
        // 찜하기 / 찜취소 로직
        // 1. 데이터에 좋아요 찜 어떻게 되어있는지 판별 => 백엔드 API 수정

        if (session?.user && store) {
            //세션에 유저가 있고 가게데이터도 있다면
            try {
                const like = await axios.post("/api/likes", {
                    storeId: store.id,
                });
                console.log(like);

                if (like.status === 201) {
                    toast.success("가게를 찜했습니다.");
                } else {
                    toast.warn("찜을 취소했습니다.");
                }
                refetch(); // 찜하기 하트 변경 -> 데이터 새로 업데이트
            } catch (e) {
                console.log(e);
            }
            //세션 유저가 없는 경우
        } else if (status === "unauthenticated") {
            toast.warn("로그인 후 이용해주세요.");
        }
    };

    return (
        <button type="button" onClick={toggleLike}>
            {/* 로그인 안된 유저 -> 빈하트 화면 */}
            {/* 로그인 된 사용자가 좋아요를 눌렀다면? */}
            {status === "unauthenticated" && store?.likes?.length ? (
                <AiFillHeart className="hover:text-red-600 focus:text-red-600 text-red-500" />
            ) : (
                <AiOutlineHeart className="hover:text-red-600 focus:text-red-600" />
            )}
        </button>
    );
}
