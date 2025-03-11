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
    parser = JsonOutputParser()
    # JSON 스키마 형식 정의
    format_instructions = '{{"jsx_code": "여기에 JSX 코드를 문자열로 넣어주세요", "component_name": "ComponentName", "imports": ["필요한 import 문들"] }}' 
    prompt_template = """
    You are an expert web developer. Create JSX code based on the given architecture.
    
    Architecture: {architecture}
    
    1. Return Only JSON 
    2. Return a JSON response with the following structure:
    {format_instructions}
    """
    
    prompt = set_prompt(prompt_template, ["architecture"], {"format_instructions": format_instructions})
    print(prompt)
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)
    response = chain.invoke({
        "architecture": architecture,
        "format_instructions": format_instructions
    })
    
    return Response({
        'status': 'Success',
        'message': response
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_ui_component(request, format=None):
    """
    LangChain을 통해 architecture를 받아 JSX 코드를 JSON 형식으로 반환
    """
    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        import json
        architecture = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")

    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('JSX 코드 생성을 위한 프롬프트를 설정합니다...')
    parser = JsonOutputParser()
    # JSON 스키마 형식 정의
    format_instructions = '{{ "jsx_code": "여기에 JSX 코드를 문자열로 넣어주세요.", "component_name": "ComponentName", "imports": ["필요한 import 문들"] }}' 
    example = """
      jsx_code: "const ComponentName = () => {\n const [inputValue, setInputValue] = useState('');\n\n  const handleInputChange = (e) => {\n    setInputValue(e.target.value);\n  };\n\n  return (\n    <div id={target_id} style={{display: 'flex'}}>\n      <div>\n        <label>label 텍스트를 표현합니다.</label>\n        <input value={inputValue} onChange={handleInputChange} />\n      </div>\n      <button disabled={!inputValue}>\n        이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.\n      </button>\n    </div>\n  );\n};",
      component_name: "ComponentName",
      imports: ["import React, { useState } from 'react';"],
    """
    prompt_template = """
    You are an expert web developer. Create JSX code based on the given architecture.

    Example : {example}
    

    Architecture: {architecture}
    
    1. Return Only JSON 
    2. Return a JSON response with the following structure:
    {format_instructions}
    """
    
    prompt = set_prompt(prompt_template, ["architecture"], {"format_instructions": format_instructions})
    print(prompt)
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)
    # architecture 구조 확인을 위한 디버깅 출력
    print(f"Architecture 구조: {architecture}")
    
    # 딕셔너리에서 id 값 안전하게 추출
    target_id = architecture.get('id', 'default_id')
    print(f"Target ID: {target_id}")
    
    response = chain.invoke({
        "architecture": architecture,
        "example" : example,
        "target_id" : target_id,
        "format_instructions": format_instructions
    })
    print(response)
    
    return Response({
        'status': 'Success',
        'message': response
    })
