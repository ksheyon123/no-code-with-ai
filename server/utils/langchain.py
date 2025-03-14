import os
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate

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
    

