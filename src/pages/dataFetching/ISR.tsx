//Incremental Static Regeneration (ISR) -> 초당 데이터 값 변경
//https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration

import type { InferGetStaticPropsType, GetStaticProps } from 'next'

export default function Page({
                                 number,
                             }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div>
            <h1>ISR</h1>
            <h2>number: {number}</h2>
        </div>
    )
}

export const getStaticProps = (async () => {

    // https://www.random.org/clients/http/api/ 랜덤 숫자 가져오는 API
    const num = await fetch(
        'https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain')
    const number = await num.json()
    return {
        props: { number },
        revalidate: 5 //변경되는 시간 설정
    }
}) satisfies GetStaticProps<{
    number:number;
}>