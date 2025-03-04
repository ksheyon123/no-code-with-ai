import os
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic

def initialize_langchain():
    """
    Anthropic API를 사용하기 위한 LangChain 초기화 함수
    .env 파일에서 ANTHROPIC_API_KEY를 로드하여 ChatAnthropic 모델을 초기화합니다.
    """
    # .env 파일에서 환경 변수 로드
    load_dotenv()
    
    # Anthropic API 키 확인
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        raise ValueError("ANTHROPIC_API_KEY가 설정되지 않았습니다. .env 파일에 유효한 API 키를 설정해주세요.")
    
    print(api_key)
    # ChatAnthropic 모델 초기화
    model = ChatAnthropic(model="claude-3-opus-20240229")
    
    return model
