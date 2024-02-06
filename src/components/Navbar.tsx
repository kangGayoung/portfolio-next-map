import { useState } from "react";
import Link from "next/link";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data, status } = useSession();

    console.log(data);

    return (
        <>
            <div className="navbar">
                <Link href="/" className="navbar_logo">
                    next map
                </Link>
                <div className="navbar_list">
                    <Link href="/stores" className="navbar_list-item">
                        맛집 목록
                    </Link>
                    <Link href="/stores/new" className="navbar_list-item">
                        맛집 등록
                    </Link>
                    <Link href="/users/likes" className="navbar_list-item">
                        찜한 가게
                    </Link>
                    <Link href="/users/mypage" className="navbar_list-item">
                        마이페이지
                    </Link>
                    {/*{status === "authenticated" ? (
                        <button type="button" onClick={() => signout()}>
                            로그아웃
                        </button>
                    ) : (
                        <Link
                            href="/api/auth/signin"
                            className="navbar_list-item"
                       >
                            로그인
                        </Link>
                    )}*/}
                    {status === "authenticated" ? (
                        <button type="button" onClick={() => signOut()}>
                            로그아웃
                        </button>
                    ) : (
                        <Link
                            href="/api/auth/signin"
                            className="navbar_list-item"
                        >
                            로그인
                        </Link>
                    )}
                </div>
                {/* mobile button - 열린 상태면 닫고 닫힌 상태면 열고 */}
                <div
                    role="presentation"
                    className="navbar_button"
                    onClick={() => setIsOpen((val) => !val)}
                >
                    {isOpen ? <AiOutlineClose /> : <BiMenu />}
                </div>
            </div>

            {/* mobile navbar */}
            {isOpen && (
                <div className="navbar_list-mobile">
                    <Link href="/stores" className="navbar_list-item-mobile">
                        맛집 목록
                    </Link>
                    <Link
                        href="/stores/new"
                        className="navbar_list-item-mobile"
                    >
                        맛집 등록
                    </Link>
                    <Link
                        href="/users/likes"
                        className="navbar_list-item-mobile"
                    >
                        찜한 가게
                    </Link>
                    <Link
                        href="/users/mypage"
                        className="navbar_list-item-mobile"
                    >
                        마이페이지
                    </Link>
                    {status === "authenticated" ? (
                        <button
                            type="button"
                            onClick={() => signOut()}
                            className="navbar_list-item-mobile  text-left"
                        >
                            로그아웃
                        </button>
                    ) : (
                        <Link
                            href="/api/auth/signin"
                            className="navbar_list-item-mobile"
                        >
                            로그인
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}
