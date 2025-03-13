from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from utils.langchain import initialize_langchain, get_langchain_model, set_prompt
from langchain_core.output_parsers import JsonOutputParser
from typing import TypedDict, Dict, Any, Optional
from langchain_core.runnables import RunnableLambda, RunnableSequence
import json

from prompt.image_parse_prompt import image_text_extract_format_instruction, image_text_extract_prompt, image_description_format_instruction, image_description_prompt, image_construct_format_instruction, image_construct_prompt
from prompt.ui_create_prompt import ui_component_format_instructions, ui_component_example, ui_component_prompt

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
    
    prompt = set_prompt(ui_component_prompt, ["architecture", "new_id"], {"format_instructions": ui_component_format_instructions, "example": ui_component_example})
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)
    
    # 딕셔너리에서 id 값 안전하게 추출
    new_id = architecture.get('newId', '')
    
    response = chain.invoke({
        "architecture": architecture,
        "new_id" : new_id,
    })
    if 'html' in response:
        print("A")
    
    return Response({
        'status': 'Success',
        'message': response
    })

class RequestImageDict(TypedDict):
    filename: str
    fileType: str
    base64Data: str
    filesize: str

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_parse_image(request, format=None):
    """
    LangChain을 통해 Image를 받아 컴포넌트를 추출
    """
    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        import json
        architecture: RequestImageDict = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")

    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('Image 파싱을 위한 프롬프트를 작성합니다.')
    parser = JsonOutputParser()
    # JSON 스키마 형식 정의
    format_instructions = '{{ "components" : [{"role" : "해당 컴포넌트의 역할", "tag" : "컴포넌트 종류", "label"?: "컴포넌트에 있는 텍스트나 아이콘" }] }}' 
    example = """
        "components" : [ { "role" : "Wrapper 컴포넌트 하위 컴포넌트를 수평 배열", "tag" : "div" }, { "role" : "이메일 입력 Input 컴포넌트 ", "tag" : "input", "label": "placeholder 이메일 입력" }]
    """
    prompt_template = """
    You are an expert web developer. Analyze the received image which is encoded into base64 and Extract the components in the image.

    Example : {example}

    Image : {base64_data}

    1. Return a Only JSON response (without description of response) with the following structure:
    {format_instructions}
    """
    
    prompt = set_prompt(prompt_template, ["base64_data"], {"format_instructions": format_instructions, "example": example})
    print(prompt)
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)
    # architecture 구조 확인을 위한 디버깅 출력
    
    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    
    response = chain.invoke({
        "base64_data": base64_data,
        "format_instructions" : format_instructions,
        "example" : example
    })
    print(response)
    
    return Response({
        'status': 'Success',
        'message': response
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_analyze_image(request, format=None): 
    """
    LangChain을 통해 Image를 받아 컴포넌트를 추출
    """

    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        import json
        architecture: RequestImageDict = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")

    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('Image 파싱을 위한 프롬프트를 작성합니다.')
    parser = JsonOutputParser()

    prompt = set_prompt(image_description_prompt, ["image_url"], {"format_instructions": image_description_format_instruction })
    print(prompt)
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)

    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    response = chain.invoke({
        "image_url": "data:image/png;base64," + base64_data,
        "format_instructions" : image_description_format_instruction,
    })

    return Response({
        'status': 'Success',
        'message': response
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_sample_runnables(request, format=None):

    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        import json
        architecture: RequestImageDict = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")

    model = get_langchain_model()

    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    
    # 클로저를 사용하여 base64_data를 캡처
    def create_response_handler(base64_data):
        print("data:image/png;base64," + base64_data)
        def response_handler(result):
            print("========= RESPONSE : ", result)
            # AIMessage 객체에서 content를 추출
            content = result.content if hasattr(result, 'content') else result
            
            # JSON 파싱을 시도하지 않고 content 문자열을 그대로 service_purpose로 사용
            return {
                "image_url": "data:image/png;base64," + base64_data,
                "service_purpose": content
            }
        return response_handler
    
    # 클로저를 사용하여 response_handler 생성
    response_handler = create_response_handler(base64_data)

    prompt_0 = set_prompt(image_text_extract_prompt, ["image_url"], {"format_instructions": image_text_extract_format_instruction })
    prompt_1 = set_prompt(image_description_prompt, ["image_url"], {"format_instructions": image_description_format_instruction })
    prompt_2 = set_prompt(image_construct_prompt, ["image_url", "service_purpose"], {"format_instructions": image_construct_format_instruction })
    
    # 체인 구성 수정: model의 출력을 response_handler로 처리하고 종료
    chain = (
        RunnableLambda(lambda x: {"image_url": x["image_url"]})
        .pipe(prompt_0)
        .pipe(model)
        .pipe(response_handler)
    )
    try:
        response = chain.invoke({
            "image_url": "data:image/png;base64," + base64_data,
        })
        print(response)
        return Response({
            'status': 'Success',
            'message': response
        })
    except Exception as e:
        print(f"req_sample_runnables 에서 에러 발생: {e}")
        return Response({
            'status': 'Error',
            'message': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_analyze_image_with_runnables(request, format=None): 
    """
    LangChain을 통해 Image를 받아 컴포넌트를 추출
    """

    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        architecture: RequestImageDict = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")


    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('Image 파싱을 위한 프롬프트를 작성합니다.')
    parser = JsonOutputParser()

    prompt = set_prompt(image_description_prompt, ["image_url"], {"format_instructions": image_description_format_instruction })
    print(prompt)
    # 체인 구성
    chain = prompt.pipe(model).pipe(parser)

    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    
    response = chain.invoke({
        "image_url": "data:image/png;base64," + base64_data,
        "format_instructions" : image_description_format_instruction,
    })

    return Response({
        'status': 'Success',
        'message': response
    })
