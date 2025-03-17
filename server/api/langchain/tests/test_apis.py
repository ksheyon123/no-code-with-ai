from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from utils.langchain import get_langchain_model, set_chat_prompt, set_prompt

from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnableSequence
from langchain_core.output_parsers import JsonOutputParser
from typing import Dict, Any, Optional

from prompt.image_parse_prompt import image_text_extract_format_instruction, image_text_extract_prompt, image_description_format_instruction, image_description_prompt, image_construct_format_instruction, image_construct_prompt
from ..types import RequestImageDict

from utils.hugging_face import extract_text_from_base64_image
from utils.webpage_analyzer import WebpageAnalyzer
from utils.ui_component_detector import detect_ui_components
from utils.resnet_50_prediction import predict_from_base64


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_sample_chat(request, format=None):
    """
    LangChain 간단한 Prompt 작성
    """
    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('간단한 채팅을 수행합니다...')

    # JSON 출력 파서 정의
    parser = JsonOutputParser()
    
    # 응답 형식에 대한 지시사항
    format_instructions = """
    You must respond with a JSON object in the following format:
    {{
        "joke": "The joke content here",
        "followup": "A funny follow-up comment here"
    }}
    """
    
    prompt = set_chat_prompt([
        ("system", f"""I'm professional comedian.
        
        Instructions:
        1. Always make jokes that are family-friendly and appropriate for all ages
        2. Use wordplay and puns whenever possible
        3. End each joke with a funny follow-up comment
        4. Keep the jokes short and to the point
        5. Respond in Korean language
        
        {format_instructions}
        """),
        ("human", "Tell me a joke about {joke}")
    ], ["joke"])
    
    # JsonOutputParser를 사용하여 응답을 JSON 형식으로 강제
    chain = prompt.pipe(model).pipe(parser)
    
    response = chain.invoke({
        "joke" : "banana"
    })
    
    return Response({
        'status': 'Success',
        'message': response
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_sample_answer(request, format=None):
    """
    LangChain 간단한 Prompt 작성
    """
    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    # 실제 LangChain 초기화 로직 호출

    print('간단한 질문을 수행합니다...')

    prompt = set_chat_prompt('You are kind AI. If the user ask you, you will answer.')
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
def req_sample_analyze_image(request, format=None):
    """
    LangChain 간단한 Prompt 작성
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

    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    # 실제 LangChain 초기화 로직 호출
    # texts = extract_text_from_base64_image(base64_data)
    analyzer = WebpageAnalyzer()
    results = analyzer.analyze_webpage(base64_data, True)
    
    return Response({
        'status': 'Success',
        'message': results
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_sample_runnables_sequence(request, format=None):

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
def req_sample_runnables_parallel(request, format=None):
    model = get_langchain_model()
    
    # 프롬프트 정의 - JsonOutputParser 사용하지 않음
    joke_prompt = set_prompt("tell me a joke about {topic}", ["topic"])
    poem_prompt = set_prompt("write a 2-line poem about {topic}", ["topic"])
    
    # 후처리 함수 정의 - 직접 텍스트 처리
    def post_process(result):
        # AIMessage 객체에서 content를 추출
        joke_content = result["joke"].content if hasattr(result["joke"], "content") else result["joke"]
        poem_content = result["poem"].content if hasattr(result["poem"], "content") else result["poem"]
        
        # 결과를 통합된 형식으로 변환
        return {
            "unified_result": {
                "topic": "orange",
                "responses": [
                    {
                        "type": "joke",
                        "content": joke_content
                    },
                    {
                        "type": "poem",
                        "content": poem_content
                    }
                ],
                "timestamp": "2025-03-17T11:52:00+09:00"
            }
        }
    
    # RunnableParallel 결과를 RunnableLambda로 후처리
    chain = RunnableParallel(
        joke=(joke_prompt.pipe(model)),
        poem=(poem_prompt.pipe(model))
    ).pipe(RunnableLambda(post_process))
    
    try:
        response = chain.invoke({
            "topic": "orange",
        })
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
def req_sample_resnet_50_predict(request, format=None):

    try:
        # request.body는 바이트 문자열이므로 디코딩 후 JSON으로 파싱
        import json
        architecture: RequestImageDict = json.loads(request.body.decode('utf-8'))
    except Exception as e:
        print(f"JSON 파싱 오류: {e}")
        # 오류 발생 시 원본 바이트 문자열 사용
        architecture = request.body.decode('utf-8')
        print(f"원본 문자열 사용: {architecture}")

    # 딕셔너리에서 id 값 안전하게 추출
    base64_data = architecture.get('base64Data', '')
    response = predict_from_base64(base64_data)
    return Response({
        'status' : 'success',
        'message' : response
    })
