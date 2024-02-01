import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StoreApiResponse, StoreType } from "@/interface";

import { useInfiniteQuery, useQuery } from "react-query";

import axios from "axios";

import Loading from "@/components/Loading";
import userIntersectionObserver from "@/hooks/useIntersectionObserver";
import Loader from "@/components/Loader";
import SearchFilter from "@/components/SearchFilter";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { searchState } from "@/atom";

export default function StoreListPage() {
    const router = useRouter();
    const ref = useRef<HTMLDivElement | null>(null);
    const pageRef = userIntersectionObserver(ref, {});
    const isPageEnd = !!pageRef?.isIntersecting;
    const searchValue = useRecoilValue(searchState);

    // const [q, setQ] = useState<string | null>(null); // 검색어 값
    // const [district, setDistrict] = useState<string | null>(null); //지역구 상태 관리

    // fetchStores 에 넘겨주는 값
    const searchParams = {
        q: searchValue?.q,
        district: searchValue?.district,
    };

    const fetchStores = async ({ pageParam = 1 }) => {
        const { data } = await axios("api/stores?.page=" + pageParam, {
            params: {
                limit: 10,
                page: pageParam,
                ...searchParams,
            },
        });
        return data;
    };

    const {
        data: stores,
        isFetching,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isError,
        isLoading,
    } = useInfiniteQuery(["stores", searchParams], fetchStores, {
        getNextPageParam: (lastPage: any) =>
            lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
    });

    const fetchNext = useCallback(async () => {
        const res = await fetchNextPage();
        if (res.isError) {
            console.log(res.error);
        }
    }, [fetchNextPage]);

    // 다음페이지 로딩하는데 시간 설정하는 함수
    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;

        if (isPageEnd && hasNextPage) {
            timerId = setTimeout(() => {
                fetchNext();
            }, 500);
        }

        return () => clearTimeout(timerId);
    }, [fetchNext, isPageEnd, hasNextPage]);

    if (isError) {
        return (
            <span className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
                다시 시도해주세요
            </span>
        );
    }

    return (
        <div className="px-4 md:max-w-4xl mx-auto py-8">
            {/* search filter - 맛집목록 검색 바 */}
            <SearchFilter />
            <ul role="list" className="divide-y divide-gray-100">
                {isLoading ? (
                    <Loading />
                ) : (
                    stores?.pages?.map((page, index) => (
                        <React.Fragment key={index}>
                            {page.data.map((store: StoreType, i: number) => (
                                <li
                                    className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50"
                                    key={i}
                                    onClick={
                                        () => router.push(`/stores/${store.id}`) //스토어 상세 이동
                                    }
                                >
                                    <div className="flex gap-x-4">
                                        <Image
                                            src={
                                                store?.category
                                                    ? `/images/markers/${store?.category}.png` // 있는이미지
                                                    : "/images/markers/default.png" // 없는 이미지
                                            }
                                            width={48}
                                            height={48}
                                            alt="아이콘 이미지"
                                        />
                                        <div>
                                            <div className="text-sm font-semibold leading-6 text-gray-900">
                                                {store?.name}
                                            </div>
                                            <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                                                {store?.storeType}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <div className="text-sm font-semibold leading-6 text-gray-900">
                                            {store?.address}
                                        </div>
                                        <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                                            {store?.phone || "번호없음"} |{" "}
                                            {store?.foodCertifyName} |{" "}
                                            {store?.category}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </React.Fragment>
                    ))
                )}
            </ul>
            {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
            <div className="w-full touch-none h-10 mb-10" ref={ref} />
        </div>
    );
}

// export async function getServerSideProps() {
//     const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
//     //).then((res) => res.json());
//
//     return {
//         props: { stores: stores.data },
//     };
// }
