import { useState } from "react";
import Link from "next/link";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

export default function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="navbar">
                <Link href="/" className="navbar_logo">next map</Link>
                <div className="navbar_list">
                    <Link href="/stores" className="navbar_list-item">맛집 목록</Link>
                    <Link href="/stores/new" className="navbar_list-item">맛집 등록</Link>
                    <Link href="/users/likes" className="navbar_list-item">찜한 가게</Link>
                    <Link href="/users/login" className="navbar_list-item">로그인</Link>
                </div>
                {/* mobile button - 열린 상태면 닫고 닫힌 상태면 열고 */}
                <div
                    role="presentation"
                    className="navbar_button"
                    onClick={() => setIsOpen((val) => !val)}>
                    {isOpen ? <AiOutlineClose/> : <BiMenu /> }
                </div>
            </div>

            {/* mobile navbar */}
            {isOpen && (
                <div className="navbar_list-mobile">
                    <Link href="/stores" className="navbar_list-item-mobile">맛집 목록</Link>
                    <Link href="/stores/new" className="navbar_list-item-mobile">맛집 등록</Link>
                    <Link href="/users/likes" className="navbar_list-item-mobile">찜한 가게</Link>
                    <Link href="/users/login" className="navbar_list-item-mobile">로그인</Link>
                </div>
            )}
        </>
    )
}