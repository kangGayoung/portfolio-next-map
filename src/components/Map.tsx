/*global kakao*/
import Script from "next/script";
import * as stores from "@/data/store_data.json";
import { Dispatch, SetStateAction } from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

// 위도, 경도 변수(강남역)
const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;

const DEFAULT_ZOOM = 3;

interface MapProps {
    setMap: Dispatch<SetStateAction<any>>;
    lat?: string | null;
    lng?: string | null;
    zoom?: number;
}

export default function Map({ setMap, lat, lng, zoom }: MapProps) {
    const loadkakaoMap = () => {
        // kakao map 로드
        //kakao.maps.load(function() {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map"); //div id="map"
            const mapOption = {
                center: new window.kakao.maps.LatLng(
                    lat ?? DEFAULT_LAT, // 위도 값이 있으면 위도값 없으면 디폴트값으로 설정
                    lng ?? DEFAULT_LNG,
                ),
                level: zoom ?? DEFAULT_ZOOM,
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
