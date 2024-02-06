import { atom } from "recoil";
import { LocationType, SearchType, StoreType } from "@/interface";

const DEFAULT_LAT = "37.497625203";
const DEFAULT_LNG = "127.03088379";
const DEFAULT_ZOOM = 3;

export const mapState = atom<any>({
    key: "map",
    default: null,
    dangerouslyAllowMutability: true, // 읽기전용의 상태를 수정할수있는 옵션
});

//현재선택한 가게
export const currentStoreState = atom<StoreType | null>({
    key: "store",
    default: null,
});

export const locationState = atom<LocationType>({
    key: "location",
    default: {
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        zoom: DEFAULT_ZOOM,
    },
});

// 검색 바 - 상태관리
export const searchState = atom<SearchType | null>({
    key: "search",
    default: null,
});
