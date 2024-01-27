import Image from "next/image";
import { StoreType } from "@/interface";

import { useQuery } from "react-query";

import axios from "axios";
import Loading from "@/components/Loading";

// export default function StoreListPage({ stores }: { stores: StoreType[] }) {
export default function StoreListPage() {
    const {
        isLoading,
        isError,
        data: stores, //data: stores 데이터 이름 지정 가능
    } = useQuery("stores", async () => {
        const { data } = await axios("/api/stores");
        return data as StoreType[];
    });

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
                    stores?.map((store, index) => (
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
