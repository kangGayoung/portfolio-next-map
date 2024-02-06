import { LikeApiResponse, LikeInterface, StoreType } from "@/interface";
import axios from "axios";
import { useQuery } from "react-query";
import React from "react";
import Loading from "@/components/Loading";
import StoreList from "@/components/StoreListElement";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination";

export default function LikesPage() {
    const router = useRouter();
    const { page = "1" }: any = router.query; // 라우터 쿼리에서 페이지값 가져옴

    const fetchLikes = async () => {
        const { data } = await axios(`/api/likes?limit=10&page=${page}`);
        return data as LikeApiResponse;
    };

    const {
        data: likes,
        isError,
        isLoading,
    } = useQuery(`likes-${page}`, fetchLikes);
    //`likes-${page}` => 페이지 바뀔 때마다 쿼리 키도 바뀌게 해야 업데이트 속도 빨라짐
    // 각각 쿼리가 캐시이 되지 않도록

    if (isError) {
        return (
            <span className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
                다시 시도해주세요
            </span>
        );
    }

    return (
        <div className="px-4 md:max-w-4xl mx-auto py-8">
            <h3 className="text-lg font-semibold">찜한 맛집</h3>
            <div className="mt-1 text-gray-500 text-sm">
                찜한 가게 리스트입니다.
            </div>
            <ul role="list" className="divide-y divide-gray-100 mt-10">
                {isLoading ? (
                    <Loading />
                ) : (
                    likes?.data.map((like: LikeInterface, index) => (
                        <StoreList store={like.store} i={index} key={index} />
                    ))
                )}
            </ul>
            {/* totalPage가 있고 0보다 클때 */}
            <Pagination
                total={likes?.totalPage}
                page={page}
                pathname="/users/likes"
            />
        </div>
    );
}
