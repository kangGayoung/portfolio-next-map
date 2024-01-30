/*global kakao*/
import Script from "next/script";
import * as stores from "@/data/store_data.json";
import {Dispatch, SetStateAction} from "react";

declare global {
    interface Window {
        kakao:any;
    }
}

// 위도, 경도 변수(강남역)
const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;

interface MapProps{
    setMap: Dispatch<SetStateAction<any>>;
}

export default function Map({setMap}: MapProps){
    const loadkakaoMap = () => {
        // kakao map 로드
        //kakao.maps.load(function() {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map") //div id="map"
            const mapOption = {
                center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
                level:3,
            }
            // var map = new kakao.maps.Map(node, options);
            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            setMap(map);
        })
    };
    return(
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