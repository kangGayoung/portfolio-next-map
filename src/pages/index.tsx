import React, { useState } from "react";
import Map from "@/components/Map";
import Markers from "@/components/Markers";

import StoreBox from "@/components/StoreBox";
import { StoreType } from "@/interface";

import axios from "axios";
import CurrentLocationButton from "@/components/CurrentLocationButton";

export default function Home({ stores }: { stores: StoreType[] }) {
    //const [map, setMap] = useState(null);
    //const [currentStore, setCurrentStore] = useState(null);
    //const storeDatas = stores['DATA'];
    return (
        <>
            <Map />
            {/*Markers 에 stores 데이터 전달*/}
            <Markers stores={stores} />
            <StoreBox />
            <CurrentLocationButton />
        </>
    );
}

// export async function getStaticProps() {
//     // api/stores get 요청
//     const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
//     // ).then((res) => res.json()); // respose를 json으로 변경
//     return {
//         props: { stores: stores.data },
//         revalidate: 60 * 60, //**한시간마다 한번 update**
//     };
// }

// fetching 할때마다  새로운 데이터 변경
export async function getServerSideProps() {
    // api/stores get 요청
    const stores = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
    // ).then((res) => res.json()); // respose를 json으로 변경
    return {
        props: { stores: stores.data },
    };
}
