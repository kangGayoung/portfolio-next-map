"use client";

/*global kakao*/
import Script from "next/script";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { locationState, mapState } from "@/atom";

declare global {
    interface Window {
        kakao: any;
    }
}

// 위도, 경도 변수(강남역)
// const DEFAULT_LAT = 37.497625203;
// const DEFAULT_LNG = 127.03088379;
// const DEFAULT_ZOOM = 3;

interface MapProps {
    // setMap: Dispatch<SetStateAction<any>>; 리코일로 상태관리
    lat?: string | null;
    lng?: string | null;
    zoom?: number;
}

export default function Map({ lat, lng, zoom }: MapProps) {
    const setMap = useSetRecoilState(mapState);
    const location = useRecoilValue(locationState); //lat,lng, zoom
    const loadkakaoMap = () => {
        // kakao map 로드
        //kakao.maps.load(function() {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map"); //div id="map"
            const mapOption = {
                center: new window.kakao.maps.LatLng(
                    // lat ?? DEFAULT_LAT, // 위도 값이 있으면 위도값 없으면 디폴트값으로 설정
                    lat ?? location.lat,
                    lng ?? location.lng,
                ),
                level: zoom ?? location.zoom,
            };
            // var map = new kakao.maps.Map(node, options);
            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            setMap(map);
        });
    };
    return (
        <>
            {/*지도 API*/}
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
                onReady={loadkakaoMap}
            />
            <div id="map" className="w-full h-screen"></div>
        </>
    );
}
