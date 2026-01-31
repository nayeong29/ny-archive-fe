import next from "next";

// 방명록 기본 구조 (Response)
export interface Board{
    id: number;
    author: string;
    content: string;
    stickerId: number;
    createdAt: string;
}

// 방명록 생성
export interface CreateBoardRequest{
    author: string;
    content: string;
    stickerId: number;
    password: string;
}

// 방명록 수정
// CreateBoardInput과 똑같은 타입을 쓰겠다는 의미
export type UpdateBoardRequest = CreateBoardRequest;

// 방명록 삭제
export interface DeleteBoardRequest{
    password: string;
}

const BASE_URL = 'http://localhost:8080/api/boards';

export async function getBaords(): Promise<Board[]>{
    const response = await fetch(BASE_URL, {
        method: 'GET',
        next: {revalidate:0},
    });
    if(!response.ok){
        throw new Error('방명록 불러오기에 실패했습니다.');
    }
    return response.json();
}

export async function getBoardById(id: number): Promise<Board>{
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        next: {revalidate:0},
    });
    if(!response.ok){
        throw new Error('${id}번 방명록 불러오기에 실패했습니다.');
    }
    return response.json();
}

export async function createBoard(data: CreateBoardRequest): Promise<Board> {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        // 방명록은 생성 즉시 보여야 함으로 캐시 off
        next: { revalidate: 0 },
    });
    if(!response.ok){
        throw new Error('방명록 생성에 실패했습니다.');
    }
    return response.json();
}

export async function updateBoard(id: number, data: UpdateBoardRequest): Promise<Board>{
    const response = await fetch(`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(data),
        next:{revalidate:0},
    });
    if(!response.ok){
        throw new Error('방명록 수정에 실패했습니다.');
    }
    return response.json();
}
