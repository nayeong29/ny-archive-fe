import { useState } from "react";
import { createBoard, CreateBoardRequest } from "@/services/boardService";
import { EMOJI_LIST } from "@/constants/emojis";

interface BoardWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BoardWriteModal = ({
  isOpen,
  onClose,
  onSuccess,
}: BoardWriteModalProps) => {
  // newBoardData: 변수, setNewBoardData: 값을 변경해주는 함수, <CreateBoardRequest>: 타입 지정
  const [newBoardData, setNewBoardData] = useState<CreateBoardRequest>({
    author: "",
    content: "",
    stickerId: 1,
    password: "",
  });

  // 입력창에 글자 칠때 값 변경해주는 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // name: input 태그의 name 속성 값, value: 입력한 값, e.target: 이벤트가 발생한 대상
    const { name, value } = e.target;
    // ...: 스프레드 연산자 (기존 객체 복사)
    setNewBoardData({ ...newBoardData, [name]: value });
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
      await createBoard(newBoardData);
      alert("방명록이 성공적으로 작성되었습니다.");
      onSuccess(); // 목록 새로고침 실행
      onClose(); // 모달 닫기
    } catch (error: any) {
      console.error("방명록 작성 중 오류 발생: ", error);
      alert(error.message);
    }
  };

  if (!isOpen) return null; // 닫혀있으면 아무것도 안 보여줌
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          margin: "10% auto",
          maxWidth: "400px",
        }}
      >
        <h2>방명록 작성</h2>
        <h1 className="text-2xl font-bold mb-4">방명록 작성</h1>
        {/* --- 작성 폼 구역 --- */}
        <form onSubmit={writeBoard} className=" space-y-4 max-w-md">
          {/* --- 이모지 선택 버튼 --- */}
          <div className="flex gap-2">
            {EMOJI_LIST.map((item) => (
              <button
                key={item.id}
                type="button"
                // 사용자가 해골(💀)을 클릭하면 item.id인 4가 stickerId 에 담김
                onClick={() =>
                  setNewBoardData({ ...newBoardData, stickerId: item.id })
                }
                className={`text-2xl p-2 rounded-lg ${
                  newBoardData.stickerId === item.id
                    ? "bg-blue-200 ring-2 ring-blue-500" // 선택되었을 때 스타일
                    : "bg-white" // 선택되지 않았을 때 스타일
                }`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
          {/* 작성자, 내용, 비밀번호 인풋 */}
          <input
            name="author"
            placeholder="작성자" // 가이드라인
            onChange={handleChange} // 변화가 생길때 마다 handleChange 함수 실행
            className="bg-white w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="content"
            placeholder="내용"
            onChange={handleChange}
            className="bg-white w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="password"
            placeholder="비밀번호"
            onChange={handleChange}
            className="bg-white w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded w-full"
          >
            작성하기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded w-full"
          >
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoardWriteModal;
