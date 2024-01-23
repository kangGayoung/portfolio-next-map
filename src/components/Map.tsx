/*global kakao*/

import Script from "next/script";

declare global {
    interface Window {
        kakao:any;
    }
}

export default function Map(){
    const loadkakaoMap = () => {
        // kakao map 로드
        //kakao.maps.load(function() {
        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map") //div id="map"
            const mapOption = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level:3,
            }
            // var map = new kakao.maps.Map(node, options);
            new window.kakao.maps.Map(mapContainer, mapOption);
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