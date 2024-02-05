import { useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { StoreType } from "@/interface";
import DaumPostcodeEmbed from "react-daum-postcode";

interface AddressProps {
    setValue: UseFormSetValue<StoreType>;
    register: UseFormRegister<StoreType>;
    errors: FieldErrors<StoreType>;
}

export default function AddressSearch({
    register,
    errors,
    setValue,
}: AddressProps) {
    //react-daum-postcode 창 열고닫기
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // react-daum-postcode
    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            // 도로명 "R" / 지번명 : "J"
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress +=
                    extraAddress !== ""
                        ? `, ${data.buildingName}`
                        : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        // 주소추가  //address 필드에 해당값이 등록
        setValue("address", fullAddress);
        setIsOpen(false); //초기화
    };
    return (
        <>
            <div className="col-span-full">
                <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                >
                    주소
                </label>
                <div className="mt-2">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        <input
                            {...register("address", { required: true })}
                            readOnly
                            placeholder="주소를 검색해주세요."
                            className="col-span-2 block w-full rounded-md border-0 outline-none px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                            type="button"
                            onClick={() => setIsOpen((val) => !val)}
                            className="bg-blue-700 hover:bg-blue-600 py-1.5 px-2 rounded text-white"
                        >
                            주소 검색
                        </button>
                    </div>

                    {errors?.address?.type === "required" && (
                        <div className="pt-2 text-xs text-red-600">
                            필수 입력사항입니다.
                        </div>
                    )}
                </div>
            </div>
            {/* 창이 열렸을 때 해당 코드 실행 */}
            {isOpen && (
                <div className="border border-gray-300 w-full col-span-full md:col-span-3 rounded-md p-2 ">
                    <DaumPostcodeEmbed onComplete={handleComplete} />
                </div>
            )}
        </>
    );
}
