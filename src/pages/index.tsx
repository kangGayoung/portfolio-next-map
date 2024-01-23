import Link from "next/link";
import Layout from "@/components/Layout";
import {useState} from "react";
import Map from "@/components/Map";
import Markers from "@/components/Markers";

import * as stores from "@/data/store_data.json";
import StoreBox from "@/components/StoreBox";

export default function Home() {
    const [map, setMap] = useState(null);
    const [currentStore, setCurrentStore] = useState(null);
    const storeDatas = stores["DATA"];
  return (
      <>
        <Map setMap={setMap}/>
        <Markers storeDatas={storeDatas} map={map} setCurrentStore={setCurrentStore} />
        <StoreBox store={currentStore} setStore={setCurrentStore}/>
      </>
  );
}

// getStaticProps 데이터 가져오기
export async function getStaticProps(){
    const stores = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stores`
    ).then((res) => res.json()); // /api/stores 겟 요청

    return {
        props: {stores},
        revalidate:60 * 60,
    }
}
