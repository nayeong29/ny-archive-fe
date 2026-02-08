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
    createdAt: "",
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-8 mt-[10vh] max-w-[400px] w-[90%] rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
          방명록 작성
        </h1>

        <form onSubmit={writeBoard} className="space-y-4">
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
                    ? "bg-orange-200 ring-2 ring-orange-400" // 선택되었을 때 스타일
                    : "bg-gray-100" // 선택되지 않았을 때 스타일
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
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-gray-500 text-xs mt-1 ml-1">
            비밀번호는 삭제 및 수정에 필요하니 꼬옥 기억해주면되
            <br />
            기억 안나면 나한테 문의하시길...
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-400 text-white rounded w-full hover:bg-orange-500 transition-colors"
            >
              작성
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded w-full hover:bg-gray-500 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardWriteModal;
