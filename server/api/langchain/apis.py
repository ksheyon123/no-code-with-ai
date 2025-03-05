from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from utils.langchain import initialize_langchain, get_langchain_model, set_prompt
from langchain_core.output_parsers import JsonOutputParser

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def init_langchain(request, format=None):
    """
    LangChain 초기화 엔드포인트
    """
    # 실제 LangChain 초기화 로직 호출
    initialize_langchain()
    print("Initialize LangChain")

    return Response({
        'status': 'Success',
        'message': 'LangChain initialized successfully'
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_simple_answer(request, format=None):
    """
    LangChain 간단한 Prompt 작성
    """
    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('간단한 질문을 수행합니다...')

    prompt = set_prompt('You are kind AI. If the user ask you, you will answer.')
    # prompt.from_template("Tell me a joke about {topic}")
    chain = prompt.pipe(model)
    response = chain.invoke({
        "topic" : "banana"
    })
    return Response({
        'status': 'Success',
        'message': response
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_simple_architecture(request, format=None):
    """
    LangChain을 통해 architecture를 받아 JSX 코드를 JSON 형식으로 반환
    """
    architecture = [
        {
            "id": 1,
            "type": "HorizontalWrapper",
            "description": "이 컴포넌트는 DOM 객체를 수평으로 배열 합니다.",
            "style"  : {
                "display" : "flex"
            },
            "child":[
                {
                   "id": 2,
                    "type": "VerticalWrapper",
                    "description": "이 컴포넌트는 DOM 객체를 수직으로 배열 합니다.",
                    "child" : [{
                            "id": 4,
                            "type": "label",
                            "description": "label 텍스트를 표현합니다.",
                        },
                        {
                            "id": 5,
                            "type": "input",
                            "description": "이 input 기능을 표현합니다.",
                        },
                    ]
                },
                {
                   "id": 3,
                    "type": "button",
                    "description": "이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.",
                }
            ]
        }   
    ]

    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('JSX 코드 생성을 위한 프롬프트를 설정합니다...')

    # JsonOutputParser 초기화
    json_parser = JsonOutputParser()
    
    # JSON 스키마 형식 정의
    format_instructions = json_parser.get_format_instructions()
    
    prompt_template = """
    You are an expert web developer. Create JSX code based on the given architecture.
    
    Architecture: {architecture}
    
    {format_instructions}
    
    Return a JSON response with the following structure:
    {{
        "jsx_code": "여기에 JSX 코드를 문자열로 넣어주세요",
        "component_name": "ComponentName",
        "imports": ["필요한 import 문들"]
    }}
    
    The JSX code should accurately implement the architecture provided.
    """
    
    prompt = set_prompt(prompt_template, ["architecture"], {"format_instructions": format_instructions})
    
    # 체인 구성
    chain = prompt | model | json_parser
    
    response = chain.invoke({
        "architecture": architecture,
        "format_instructions": format_instructions
    })
    
    return Response({
        'status': 'Success',
        'message': response
    })