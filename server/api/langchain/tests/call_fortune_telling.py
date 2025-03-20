import requests
import json
import time

def call_fortune_telling_api(by_item=False):
    """
    사주풀이 API를 호출하고 응답을 출력하는 함수
    
    Args:
        by_item (bool): True이면 항목별 병렬 처리 API를 호출, False이면 기존 병렬 처리 API를 호출
    """
    # API 엔드포인트 URL
    if by_item:
        url = 'http://localhost:8000/api/langchain/req_fortune_telling_parallel_by_item'
        print("항목별 병렬 처리 API 호출 중...")
    else:
        url = 'http://localhost:8000/api/langchain/req_fortune_telling_parallel'
        print("기존 병렬 처리 API 호출 중...")
    
    # 요청 데이터 (사용자 정보)
    data = {
        "user_info": "1990년 5월 15일 오전 8시 30분 출생, 여자"
    }
    
    # API 호출 시간 측정 시작
    start_time = time.time()
    
    # API 호출
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
            
            # 실행 시간 정보 출력 (있는 경우)
            if 'message' in response_data and 'fortune_telling' in response_data['message'] and 'execution_time' in response_data['message']['fortune_telling']:
                execution_time = response_data['message']['fortune_telling']['execution_time']
                print(f"서버 내부 실행 시간: {execution_time['formatted']}")
            
            # 토큰 사용량 및 비용 정보 출력 (있는 경우)
            if 'message' in response_data and 'fortune_telling' in response_data['message'] and 'token_usage' in response_data['message']['fortune_telling']:
                token_usage = response_data['message']['fortune_telling']['token_usage']
                if 'total' in token_usage:
                    total = token_usage['total']
                    print(f"총 토큰 사용량: {total['total_tokens']} 토큰 (입력: {total['input_tokens']}, 출력: {total['output_tokens']})")
                
                if 'cost' in token_usage:
                    cost = token_usage['cost']
                    print(f"예상 비용: ${cost['total_cost']:.6f} USD")
            
            print("\n=== API 응답 원본 ===")
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"응답 처리 중 오류 발생: {e}")
            print(f"원본 응답: {response.text[:500]}...")  # 처음 500자만 출력
    else:
        print(f"API 호출 실패: {response.status_code}")
        print(f"응답 내용: {response.text[:500]}...")  # 처음 500자만 출력

def compare_fortune_telling_apis():
    """
    두 가지 사주풀이 API의 성능을 비교하는 함수
    """
    # print("===== 기존 병렬 처리 API 호출 =====")
    # call_fortune_telling_api(by_item=False)
    
    print("\n\n===== 항목별 병렬 처리 API 호출 =====")
    call_fortune_telling_api(by_item=True)

if __name__ == "__main__":
    # 단일 API 호출
    # call_fortune_telling_api(by_item=False)  # 기존 API 호출
    # call_fortune_telling_api(by_item=True)   # 새 API 호출
    
    # 두 API 비교
    compare_fortune_telling_apis()
