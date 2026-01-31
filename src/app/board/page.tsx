'use client'

import {useState} from "react";
import {createBoard, CreateBoardRequest} from "@/services/boardService";

export default function BoardPage(){
    // 사용자가 입력할 값들 저장할 State 만들기
    const [formData, setFormData]=useState<CreateBoardRequest>({
        author:'',
        content:'',
        stickerId:1,
        password:'',
    });

    // 입력참에 글자 칠때 값 변경해주는 함수
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value}=e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };

    // 버튼 눌렀을 때 폼 제출되게 할 함수
    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault(); // 페이지 새로고침 방지
        try{
            const result = await createBoard(formData);
            alert('방명록이 성공적으로 작성되었습니다.');
            console.log('결과: ', result);
        }catch (error){
            console.error('방명록 작성 중 오류 발생: ', error);
            alert('방명록 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return(
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">방명록 작성</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <input
                name="author"
                placeholder="작성자"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"/>

                <input
                name="content"
                placeholder="내용"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"/>

                <input
                name="password"
                placeholder="비밀번호"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"/>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">작성하기</button>
            </form>
        </div>
    );
}