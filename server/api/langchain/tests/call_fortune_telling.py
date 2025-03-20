import requests
import json
import time

def call_fortune_telling_api():
    """
    req_fortune_telling_parallel API를 호출하고 응답을 출력하는 함수
    """
    # API 엔드포인트 URL
    url = 'http://localhost:8000/api/langchain/req_fortune_telling_parallel'
    
    # 요청 데이터 (사용자 정보)
    data = {
        "user_info": "1990년 5월 15일 오전 8시 30분 출생, 여자"
    }
    
    # API 호출 시간 측정 시작
    start_time = time.time()
    
    # API 호출
    print("API 호출 중...")
    response = requests.post(url, json=data)
    
    # API 호출 시간 측정 종료
    end_time = time.time()
    elapsed_time = end_time - start_time
    
    # 응답 상태 코드 및 소요 시간 출력
    print(f"응답 상태 코드: {response.status_code}")
    print(f"API 호출 소요 시간: {elapsed_time:.2f}초")
    
    # 응답 내용 출력
    if response.status_code == 200:
        try:
            response_data = response.json()
            print("\n=== API 응답 원본 ===")
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"응답 처리 중 오류 발생: {e}")
            print(f"원본 응답: {response.text[:500]}...")  # 처음 500자만 출력
    else:
        print(f"API 호출 실패: {response.status_code}")
        print(f"응답 내용: {response.text[:500]}...")  # 처음 500자만 출력

if __name__ == "__main__":
    call_fortune_telling_api()
