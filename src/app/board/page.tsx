"use client";

import { useState, useEffect } from "react";
import BoardWriteModal from "./_components/BoardWriteModal";
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

export default function BoardPage() {
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
    createdAt: "",
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
      stickerId: selectedBoard.stickerId,
      password: "",
      createdAt: selectedBoard.createdAt,
    });
    setIsEditing(true); // 수정 모드로 전환
  };

  return (
    <div className="p-8 max-w-[800px] mx-auto">
      {/* --- 목록 구역 --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 ml-1">방명록 목록</h1>

        {/* 방명록 작성 버튼 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 -mb-9 mr-2 text-sm font-bold text-white bg-orange-400 rounded-xl shadow-sm cursor-pointer hover:bg-orange-500 transition-colors"
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

      <p className="text-gray-600 text-xs mb-7 mt-2 ml-1">
        나영이한테 인사 하고가라
      </p>

      {/* map 으로 boards에서 목록을 꺼내서 board 라는 이름을 붙임 */}
      <div className="grid grid-cols-3 gap-6">
        {boardList.map((board) => (
          <div
            key={board.id} // 이름표
            // 클릭하면 id 방명록 상세 내용 가져오기
            onClick={() => fetchBoard(board.id)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-52"
          >
            {/* 숫자를 다시 이모지로 변환해서 출력 */}
            <div className="flex justify-between text-3xl mb-3 -ml-1 ">
              {EMOJI_LIST.find((e) => e.id === board.stickerId)?.emoji || "😊"}
              <p className="text-gray-500 text-sm mt-1">{board.createdAt}</p>
            </div>

            {/* 작성자 */}
            <p className="font-bold text-gray-900 mb-1">{board.author}</p>

            {/* 내용 50자만 보여주기 */}
            <p className="text-gray-500 text-sm line-clamp-3">
              {board.content.length > 50
                ? board.content.substring(0, 50) + "..."
                : board.content}
            </p>
          </div>
        ))}
      </div>

      {/* --- 상세 보기 팝업 --- */}
      {/* --- selectedBoard 가 비어있지 않으면 뒤에 코드 출력 --- */}
      {selectedBoard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 mt-[10vh] max-w-[400px] w-[90%] rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            {isEditing ? (
              /* --- [수정 모드] 입력칸들이 나타남 --- */
              <div className="space-y-4">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
                  수정하기
                </h1>
                {/* 이모지 수정 선택창 */}
                <div className="flex gap-2">
                  {EMOJI_LIST.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setEditData({ ...editData, stickerId: item.id })
                      }
                      className={`text-2xl p-2 rounded-lg ${
                        editData.stickerId === item.id
                          ? "bg-orange-200 ring-2 ring-orange-400" // 선택되었을 때 스타일
                          : "bg-gray-100" // 선택되지 않았을 때 스타일
                      }`}
                    >
                      {/* 화면에 이모지 보여줌 */}
                      {item.emoji}
                    </button>
                  ))}
                </div>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  name="author"
                  value={editData.author}
                  onChange={handleEditChange}
                />
                <textarea
                  className="w-full p-2 border border-gray-300 rounded"
                  name="content"
                  value={editData.content}
                  onChange={handleEditChange}
                />
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  className="w-full p-2 border border-gray-300 rounded"
                  name="password"
                  onChange={handleEditChange}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => editBoard(selectedBoard.id, editData)}
                    className="px-4 py-2 bg-orange-400 text-white rounded w-full hover:bg-orange-500 transition-colors"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded w-full hover:bg-gray-500 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              /* --- [보기 모드] 상단 X 버튼 적용 --- */
              <div className="flex flex-col items-start text-left relative max-h-[70vh]">
                {/* 오른쪽 상단 X 버튼 */}
                <button
                  onClick={() => setSelectedBoard(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 flex text-gray-500 items-center justify-center text--400 hover:text-gray-800 transition-all cursor-pointer"
                >
                  <span className="text-5xl">×</span>
                </button>

                <div className="text-5xl mb-6 -ml-1">
                  {EMOJI_LIST.find((e) => e.id === selectedBoard?.stickerId)
                    ?.emoji || "😊"}
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedBoard?.author}님의 한마디
                  </h3>
                  <div className="w-12 h-1 bg-orange-400 mt-5 rounded-full opacity-50"></div>
                </div>

                <div className="overflow-y-auto w-full mb-9 pr-2">
                  <p className="text-gray-900 leading-relaxed text-lg">
                    "{selectedBoard.content}"
                  </p>
                </div>

                {/* 하단 버튼 그룹: 닫기 버튼을 빼고 수정/삭제만 배치 */}
                <div className="w-full flex gap-3">
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-orange-400 text-white rounded w-full hover:bg-orange-500 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-4 py-2 bg-gray-400 text-white rounded w-full hover:bg-gray-500 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
