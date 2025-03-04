import os
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate

# settings.py에서 이미 load_dotenv()가 호출되므로 여기서는 생략

# 전역 변수로 모델 인스턴스 저장
_langchain_model = None

def initialize_langchain():
    """
    Anthropic API를 사용하기 위한 LangChain 초기화 함수
    .env 파일에서 ANTHROPIC_API_KEY를 로드하여 ChatAnthropic 모델을 초기화합니다.
    이미 초기화된 경우 기존 인스턴스를 반환합니다.
    """
    global _langchain_model
    
    # 이미 초기화된 경우 기존 인스턴스 반환
    if _langchain_model is not None:
        return _langchain_model
    
    # Anthropic API 키 확인
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        raise ValueError("ANTHROPIC_API_KEY가 설정되지 않았습니다. .env 파일에 유효한 API 키를 설정해주세요.")
    
    # ChatAnthropic 모델 초기화
    _langchain_model = ChatAnthropic(model="claude-3-opus-20240229")
    
    return _langchain_model

def get_langchain_model():
    """
    초기화된 LangChain 모델을 반환합니다.
    아직 초기화되지 않은 경우 초기화합니다.
    """
    global _langchain_model
    if _langchain_model is None:
        return initialize_langchain()
    return _langchain_model

def set_structured_prompt() :
    return PromptTemplate.from_messages(
        ("system", '{systemPrompt}\n\n응답 형식:\n{format_instructions}'),
        (
        "user",
        [
            { type: "text", message: "{query}" },
            { type: "image_url", image_url: "data:image/png;base64,{base64}" },
        ],
        )
    ).partial
