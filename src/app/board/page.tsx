"use client";

import { useState, useEffect } from "react";
import BoardWriteModal from "./BoardWriteModal";
// 순서 상관 없음
import {
  getBaordList,
  getBoard,
  updateBoard,
  deleteBoard,
  Board,
  UpdateBoardRequest,
  DeleteBoardRequest,
} from "@/services/boardService";
import { EMOJI_LIST } from "@/constants/emojis";

const BoardPage = () => {
  // 사용자가 입력할 값들 저장할 State 만들기

  // 방명록 목록
  // Board[]: 타입 지정, ([]): 빈 배열
  const [boardList, setBoardList] = useState<Board[]>([]);

  // 상세 창에 띄울 글 상태
  // Board | null: Board 타입이거나 null 일 수 있음
  // (null): 초기값 null
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // 팝업창이 수정 중인지 아닌지 저장 (true: 수정 중, false: 보기 중)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // 수정 중 내용 담아둘 변수
  const [editData, setEditData] = useState<UpdateBoardRequest>({
    author: "",
    content: "",
    stickerId: 1,
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 수정창에 글자 값 변경
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
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

  // 4. 방명록 수정 함수
  const editBoard = async (id: number, data: UpdateBoardRequest) => {
    try {
      const result = await updateBoard(id, data);
      setSelectedBoard(result);
      alert("방명록이 성공적으로 수정되었습니다.");
      setIsEditing(false); // 수정 모드 종료
      fetchBoardList(); // 수정 후 방명록 목록 새로고침
    } catch (error: any) {
      console.error("방명록 수정 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  // 5. 방명록 삭제 함수
  const removeBoard = async (id: number, data: DeleteBoardRequest) => {
    try {
      await deleteBoard(id, data);
      setSelectedBoard(null);
      alert("방명록이 성공적으로 삭제되었습니다.");
      fetchBoardList(); // 삭제 후 방명록 목록 새로고침
    } catch (error: any) {
      console.error("방명록 삭제 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  // 버튼 클릭시 실행 함수들
  // 삭제 버튼 클릭
  const handleDeleteClick = () => {
    const password = prompt("비밀번호를 입력하세요");
    if (password && selectedBoard) {
      removeBoard(selectedBoard.id, { password });
    }
  };

  // 수정 버튼 클릭
  const handleEditClick = () => {
    if (!selectedBoard) return;

    setEditData({
      author: selectedBoard.author,
      content: selectedBoard.content,
      stickerId: 1,
      password: "",
    });
    setIsEditing(true); // 수정 모드로 전환
  };

  return (
    <div className="p-8">
      {/* --- 목록 구역 --- */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold mb-4">방명록 목록</h1>
        {/* map 으로 boards에서 목록을 꺼내서 board 라는 이름을 붙임 */}
        {boardList.map((board) => (
          <div
            key={board.id} // 이름표
            // 클릭하면 id 방명록 상세 내용 가져오기
            onClick={() => fetchBoard(board.id)}
            className="p-4 border border-gray-300 rounded mb-2 cursor-pointer"
          >
            {/* 숫자를 다시 이모지로 변환해서 출력 */}
            <span className="text-2xl">
              {EMOJI_LIST.find((e) => e.id === board.stickerId)?.emoji || "😊"}
            </span>
            <p className="font-semibold">{board.author}</p>
            {/* 50자만 보여주기 */}
            <p>
              {board.content.length > 50
                ? board.content.substring(0, 50) + "..."
                : board.content}
            </p>
            <p></p>
          </div>
        ))}
      </div>

      {/* --- 상세 보기 팝업 --- */}
      {/* --- selectedBoard 가 비어있지 않으면 뒤에 코드 출력 --- */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            {isEditing ? (
              /* --- [수정 모드] 입력칸들이 나타남 --- */
              <div className="space-y-4">
                {/* 이모지 수정 선택창 */}
                <div className="flex justify-center gap-2">
                  {EMOJI_LIST.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setEditData({ ...editData, stickerId: item.id })
                      }
                      className={`text-xl p-2 rounded ${editData.stickerId === item.id ? "bg-blue-200" : "bg-gray-50"}`}
                    >
                      {/* 화면에 이모지 보여줌 */}
                      {item.emoji}
                    </button>
                  ))}
                </div>
                <input
                  className="w-full border p-2"
                  name="author"
                  value={editData.author}
                  onChange={handleEditChange}
                />
                <textarea
                  className="w-full border p-2"
                  name="content"
                  value={editData.content}
                  onChange={handleEditChange}
                />
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  className="w-full border p-2"
                  name="password"
                  onChange={handleEditChange}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => editBoard(selectedBoard.id, editData)}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex-1"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              /* --- [보기 모드] 기존 코드와 동일 --- */
              <>
                <div className="text-5xl text-left mb-4">
                  {EMOJI_LIST.find((e) => e.id === selectedBoard?.stickerId)
                    ?.emoji || "😊"}
                </div>
                <h3 className="text-lg font-bold mb-4">
                  {selectedBoard?.author}님의 글
                </h3>
                <p className="mb-4">{selectedBoard.content}</p>

                <div className="flex justify-end">
                  <button
                    onClick={handleEditClick} // 수정 함수 실행
                    className="flex-1 bg-yellow-500 text-white py-2 rounded"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick} // 삭제 함수 실행
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
              </>
            )}
          </div>
        </div>
      )}

      {/* 방명록 작성 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-30 right-8 px-5 py-3 bg-orange-400 text-white rounded-full shadow-lg hover:bg-orange-500 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center text-sm font-bold z-50 cursor-pointer"
      >
        <div className="flex flex-col items-center">
          <span className="text-[12px]">📝 방명록 작성하기</span>
        </div>
      </button>

      {/* 2. 분리한 작성 모달 */}
      <BoardWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBoardList}
      />
    </div>
  );
};

export default BoardPage;
