"use client";

import { MdOutlineMyLocation } from "react-icons/md";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mapState } from "@/atom";
import { toast } from "react-toastify";
import FullPageLoader from "@/components/FullPageLoader";

export default function CurrentLocationButton() {
    const [loading, setLoading] = useState<boolean>(false);
    const map = useRecoilValue(mapState);

    const handleCurrentPosition = () => {
        // 상태 확인
        setLoading(true);

        // geolocation 으로 현재 위치 가져 오기
        const options = {
            enableHighAccuracy: false, //높은 정확도의 위치값 -> 위치 잡는 시간 오래걸림
            timeout: 5000,
            maximunAge: Infinity, //항상 캐싱되게
        };

        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                // 성공
                (position) => {
                    const currentPosition = new window.kakao.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude,
                    );
                    //console.log(currentPosition); // 허용된 현재위치 콘솔

                    if (currentPosition) {
                        //로딩 끄기
                        setLoading(false);
                        map.panTo(currentPosition); // 이동
                        toast.success("현재 위치로 이동되었습니다.");
                    }

                    return currentPosition;
                },
                // 실패
                () => {
                    toast.error("현재 위치를 가져올 수 없습니다.");
                    setLoading(false);
                },
                options,
            );
        }
    };

    return (
        <>
            {/* 전체 로딩 화면 */}
            {loading && <FullPageLoader />}
            <button
                type="button"
                onClick={handleCurrentPosition}
                className="fixed z-10 p-2 shadow right-10 bottom-20 bg-white rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-200"
            >
                <MdOutlineMyLocation className="w-5 h-5" />
            </button>
        </>
    );
}
