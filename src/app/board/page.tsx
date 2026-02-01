"use client";

import { useState, useEffect } from "react";
// 순서 상관 없음
import {
  getBaordList,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  DeleteBoardRequest,
} from "@/services/boardService";

export default function BoardPage() {
  // 사용자가 입력할 값들 저장할 State 만들기

  // 방명록 목록
  // Board[]: 타입 지정, ([]): 빈 배열
  const [boardList, setBoardList] = useState<Board[]>([]);

  // newBoardData: 변수, setNewBoardData: 값을 변경해주는 함수, <CreateBoardRequest>: 타입 지정
  const [newBoardData, setNewBoardData] = useState<CreateBoardRequest>({
    author: "",
    content: "",
    stickerId: 1,
    password: "",
  });

  // 상세 창에 띄울 글 상태
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // 입력참에 글자 칠때 값 변경해주는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // name: input 태그의 name 속성 값, value: 입력한 값, e.target: 이벤트가 발생한 대상
    const { name, value } = e.target;
    // ...: 스프레드 연산자 (기존 객체 복사)
    setNewBoardData({ ...newBoardData, [name]: value });
  };

  // 1. 방명록 목록 조회 함수
  const fetchBoardList = async () => {
    try {
      const data = await getBaordList();
      setBoardList(data);
    } catch (error) {
      console.error("방명록 불러오기 실패: ", error);
    }
  };

  // 컴포넌트가 처음 렌더링 될 때 방명록 목록 불러오기
  useEffect(() => {
    // 방명록 목록 호출
    fetchBoardList();
  }, []);

  // 2. 특정 방명록 상세 조회
  // id: 매개변수
  const fetchBoard = async (id: number) => {
    try {
      const result = await getBoard(id);
      setSelectedBoard(result);
    } catch (error) {
      console.error(`${id}번 방명록 불러오기 실패: `, error);
    }
  };

  // 3. 방명록 작성 함수
  const writeBoard = async (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지

    // 모든 필드가 작성되었는지 확인
    if (
      !newBoardData.author ||
      !newBoardData.content ||
      !newBoardData.password
    ) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    try {
      const result = await createBoard(newBoardData);
      alert("방명록이 성공적으로 작성되었습니다.");
      fetchBoardList(); // 작성 후 방명록 목록 새로고침
    } catch (error: any) {
      console.error("방명록 작성 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  // 4. 방명록 수정 함수
  const editBoard = async (id: number, data: UpdateBoardRequest) => {
    try {
      const result = await updateBoard(id, data);
      setSelectedBoard(result);
      alert("방명록이 성공적으로 수정되었습니다.");
      fetchBoardList(); // 수정 후 방명록 목록 새로고침
    } catch (error: any) {
      console.error("방명록 수정 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  // 5. 방명록 삭제 함수
  const removeBoard = async (id: number, data: DeleteBoardRequest) => {
    try {
      const result = await deleteBoard(id, data);
      setSelectedBoard(null);
      alert("방명록이 성공적으로 삭제되었습니다.");
      fetchBoardList(); // 삭제 후 방명록 목록 새로고침
    } catch (error: any) {
      console.error("방명록 삭제 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">방명록 작성</h1>

      {/* --- 작성 폼 구역 --- */}
      <form onSubmit={writeBoard} className="space-y-4 max-w-md">
        <input
          name="author"
          placeholder="작성자" // 가이드라인
          onChange={handleChange} // 변화가 생길때 마다 handleChange 함수 실행
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="content"
          placeholder="내용"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          작성하기
        </button>
      </form>

      <hr className="my-8" />

      {/* --- 목록 구역 --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">방명록 목록</h2>
        {/* map 으로 boards에서 목록을 꺼내서 board 라는 이름을 붙임 */}
        {boardList.map((board) => (
          <div
            key={board.id} // 이름표
            // 클릭하면 id 방명록 상세 내용 가져오기
            onClick={() => fetchBoard(board.id)}
            className="p-4 border border-gray-300 rounded mb-2 cursor-pointer"
          >
            <p className="font-semibold">{board.author}</p>
            {/* 50자만 보여주기 */}
            <p>
              {board.content.length > 30
                ? board.content.substring(0, 50) + "..."
                : board.content}
            </p>
          </div>
        ))}
      </div>

      {/* --- 상세 보기 팝업 --- */}
      {/* --- selectedBoard 가 비어있지 않으면 뒤에 코드 출력 --- */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {selectedBoard?.author}님의 글
            </h3>
            <p className="mb-4">{selectedBoard.content}</p>

            <div className="flex justify-end">
              <button className="flex-1 bg-yellow-500 text-white py-2 rounded">
                수정
              </button>
              <button
                onClick={() =>
                  removeBoard(selectedBoard.id, {
                    password: prompt("비밀번호를 입력하세요") || "",
                  })
                }
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                삭제
              </button>

              <button
                onClick={() => setSelectedBoard(null)} // selectedBoard를 null 로 만듦
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
