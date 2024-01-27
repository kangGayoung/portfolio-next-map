import Image from "next/image";
import { StoreApiResponse, StoreType } from "@/interface";

import { useQuery } from "react-query";

import axios from "axios";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import Link from "next/link";

// export default function StoreListPage({ stores }: { stores: StoreType[] }) {
export default function StoreListPage() {
    const router = useRouter(); //페이지네이션
    const { page = "1" }: any = router.query; //페이지 시작값
    const {
        isLoading,
        isError,
        data: stores, //data: stores 데이터 이름 지정 가능
    } = useQuery(`stores-${page}`, async () => {
        const { data } = await axios(`/api/stores?page=${page}`);
        return data as StoreApiResponse;
    });

    console.log(stores);

    if (isError) {
        return (
            <span className="w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
                다시 시도해주세요
            </span>
        );
    }

    return (
        <div className="px-4 md:max-w-4xl mx-auto py-8">
            <ul role="list" className="divide-y divide-gray-100">
                {isLoading ? (
                    <Loading />
                ) : (
                    stores?.data?.map((store, index) => (
                        <li
                            className="flex justify-between gap-x-6 py-5"
                            key={index}
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
                                    {store?.foodCertifyName} | {store?.category}
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            {stores?.totalPage && (
                <div className="py-6 w-full px-10 flex justify-center gap-3 ba-white my-10 flex-wrap text-black">
                    {stores?.totalPage <= 10 ? (
                        [...Array(stores?.totalPage)].map((x, i) => (
                            <Link
                                href={{
                                    pathname: "/stores",
                                    query: { page: i + 1 },
                                }}
                                key={i}
                            >
                                <span
                                    className={`px-3 py-2 rounded border shadow-sm ba-white ${
                                        i + 1 === parseInt(page, 10)
                                            ? "text-blue-600 font-bold"
                                            : "text-gray-300"
                                    }`}
                                >
                                    {i + 1}
                                </span>
                            </Link>
                        ))
                    ) : (
                        <>
                            <Link
                                href={{
                                    pathname: "/stores",
                                    query: { page: page - 1 },
                                }}
                            >
                                <span
                                    className={`px-3 py-2 rounded border shadow-sm ba-white 
                                    `}
                                >
                                    이전
                                </span>
                            </Link>
                            <Link
                                href={{
                                    pathname: "/stores",
                                    query: { page: page + 1 },
                                }}
                            >
                                <span
                                    className={`px-3 py-2 rounded border shadow-sm ba-white 
                                    `}
                                >
                                    다음
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            )}
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
