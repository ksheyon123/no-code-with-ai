import os
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from anthropic import Anthropic

# settings.py에서 이미 load_dotenv()가 호출되므로 여기서는 생략

# 전역 변수로 모델 인스턴스 저장
_langchain_model = None

def initialize_langchain():
    """
    Anthropic API를 사용하기 위한 LangChain 초기화 함수
    .env 파일에서 ANTHROPIC_API_KEY를 로드하여 ChatAnthropic 모델을 초기화합니다.
    이미 초기화된 경우 기존 인스턴스를 반환합니다.
    """
    print('Langchain Model 초기화를 수행합니다...')
    global _langchain_model
    
    # 이미 초기화된 경우 기존 인스턴스 반환
    if _langchain_model is not None:
        return _langchain_model
    
    # Anthropic API 키 확인
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        raise ValueError("ANTHROPIC_API_KEY가 설정되지 않았습니다. .env 파일에 유효한 API 키를 설정해주세요.")
    
    # ChatAnthropic 모델 초기화
    # https://python.langchain.com/docs/concepts/chat_models/
    _langchain_model = ChatAnthropic(
            model="claude-3-5-sonnet-20240620", 
            api_key=api_key,
            # temperature=0,
            max_tokens=4000
            # timeout=None,
            # max_retries=2,
        )
    
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

def set_prompt(template, input_variables=None, partial_variables=None) :
    """
        PromptTemplate 생성 메소드

        def _get_datetime():
            now = datetime.now()
            return now.strftime("%m/%d/%Y, %H:%M:%S")

        prompt = PromptTemplate(
            template="Tell me a {adjective} joke about the day {date}",
            input_variables=["adjective"],
            partial_variables={"date": _get_datetime},
        )
        print(prompt.format(adjective="funny"))
    """
    # input_variables와 partial_variables 타입 검사 및 기본값 설정
    if input_variables is None or not isinstance(input_variables, list):
        input_variables = []
    if partial_variables is None or not isinstance(partial_variables, dict):
        partial_variables = {}
        
    return PromptTemplate(
        template=template,
        input_variables=input_variables,
        partial_variables=partial_variables
    )


def set_chat_prompt(messages, input_variables=None, partial_variables=None) :
    """
        ChatPromptTemplate 생성 메소드
        https://python.langchain.com/api_reference/core/prompts/langchain_core.prompts.chat.ChatPromptTemplate.html#chatprompttemplate

        template = ChatPromptTemplate([
            ("system", "You are a helpful AI bot. Your name is {name}."),
            ("human", "Hello, how are you doing?"),
            ("ai", "I'm doing well, thanks!"),
            ("human", "{user_input}"),
        ])

        prompt_value = template.invoke(
            {
                "name": "Bob",
                "user_input": "What is your name?"
            }
        )
        
    """

    # input_variables와 partial_variables 타입 검사 및 기본값 설정
    if input_variables is None or not isinstance(input_variables, list):
        input_variables = []
    if partial_variables is None or not isinstance(partial_variables, dict):
        partial_variables = {}

    return ChatPromptTemplate(messages=messages, input_variables=input_variables, partial_variables=partial_variables)
    

def calculate_tokens(text):
    """
    텍스트 문자열의 토큰 수를 추정합니다.
    
    Args:
        text (str): 토큰 수를 계산할 텍스트
        
    Returns:
        int: 텍스트의 추정 토큰 수
    """
    # 텍스트 길이 기반 토큰 수 추정
    # 한국어/영어 혼합 텍스트에서 대략적인 추정: 1토큰 ≈ 3자
    return len(text) // 3


def get_token_usage_from_response(response):
    """
    LangChain 응답에서 토큰 사용량 정보를 추출합니다.
    응답 객체에서 토큰 정보를 찾을 수 없는 경우, 응답 텍스트의 길이를 기반으로 추정합니다.
    
    Args:
        response: LangChain 모델의 응답 객체
        
    Returns:
        dict: 입력 토큰 수, 출력 토큰 수, 총 토큰 수를 포함하는 딕셔너리
    """
    # 응답 텍스트 추출
    response_text = ""
    if hasattr(response, 'content'):
        response_text = response.content
    elif hasattr(response, 'text'):
        response_text = response.text
    elif isinstance(response, str):
        response_text = response
    elif hasattr(response, '__str__'):
        response_text = str(response)
    
    # 텍스트 길이 기반 토큰 수 추정
    # 한국어/영어 혼합 텍스트에서 대략적인 추정: 1토큰 ≈ 3자
    output_tokens = len(response_text) // 3
    
    # 입력 토큰은 알 수 없으므로 출력 토큰의 2배로 가정 (일반적인 비율)
    input_tokens = output_tokens * 2
    
    # 결과 반환
    return {
        'input_tokens': input_tokens,
        'output_tokens': output_tokens,
        'total_tokens': input_tokens + output_tokens,
        'is_estimated': True  # 이 값이 추정치임을 표시
    }


def estimate_token_cost(usage, model_name=None):
    """
    토큰 사용량에 따른 예상 비용을 계산합니다.
    
    Args:
        usage (dict): 토큰 사용량 정보 (input_tokens, output_tokens)
        model_name (str, optional): 모델 이름. 기본값은 현재 설정된 모델
        
    Returns:
        dict: 입력 비용, 출력 비용, 총 비용을 포함하는 딕셔너리 (USD)
    """
    if model_name is None:
        model = get_langchain_model()
        model_name = model.model_name if hasattr(model, 'model_name') else "claude-3-5-sonnet-20240620"
    
    # 추정 여부 확인
    is_estimated = usage.get('is_estimated', False)
    
    # 모델별 가격 정보 (1K 토큰당 USD)
    # 2024년 6월 기준 가격, 변경될 수 있음
    pricing = {
        "claude-3-5-sonnet-20240620": {"input": 3.00 / 1000, "output": 15.00 / 1000},
        "claude-3-opus-20240229": {"input": 15.00 / 1000, "output": 75.00 / 1000},
        "claude-3-sonnet-20240229": {"input": 3.00 / 1000, "output": 15.00 / 1000},
        "claude-3-haiku-20240307": {"input": 0.25 / 1000, "output": 1.25 / 1000},
        "claude-2.1": {"input": 8.00 / 1000, "output": 24.00 / 1000},
        "claude-2.0": {"input": 8.00 / 1000, "output": 24.00 / 1000},
        "claude-instant-1.2": {"input": 1.63 / 1000, "output": 5.51 / 1000}
    }
    
    # 기본 가격 (모델이 목록에 없는 경우)
    default_pricing = {"input": 3.00 / 1000, "output": 15.00 / 1000}
    
    model_pricing = pricing.get(model_name, default_pricing)
    
    input_tokens = usage.get('input_tokens', 0)
    output_tokens = usage.get('output_tokens', 0)
    
    input_cost = input_tokens * model_pricing["input"]
    output_cost = output_tokens * model_pricing["output"]
    total_cost = input_cost + output_cost
    
    return {
        'input_cost': input_cost,
        'output_cost': output_cost,
        'total_cost': total_cost,
        'currency': 'USD',
        'is_estimated': is_estimated
    }
