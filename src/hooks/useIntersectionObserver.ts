import { RefObject, useEffect, useState } from "react";

//RefObject<Element> 돔요소의 가시성과 감지 -> 사용
function useIntersectionObserver(
    elementRef: RefObject<Element>,
    { threshold = 0.1, root = null, rootMargin = "0%" }, //옵션
) {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    //변경있을 시 콜백
    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry);
    };

    //페이지 마운트 됐을 때 위 로직 실행
    useEffect(() => {
        const node = elementRef?.current;
        const hasIOSupport = !!window.IntersectionObserver; //현재 해당 브라우저가 인터셉터옵저버를 서포트 하는지 확인

        if (!node || !hasIOSupport) return;

        const observerParams = { threshold, root, rootMargin }; //옵션가져오기
        //let observer = new IntersectionObserver(callback, options);
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node); //노드 관찰

        return () => observer.disconnect(); //클린업함수-> 연결끊기
    }, [elementRef?.current, root, rootMargin, JSON.stringify(threshold)]);

    return entry;
}

export default useIntersectionObserver;
