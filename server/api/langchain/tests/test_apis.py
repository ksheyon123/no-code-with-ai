from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from utils.langchain import get_langchain_model, set_chat_prompt, set_prompt

from langchain_core.runnables import RunnableLambda, RunnableParallel, RunnableSequence
from langchain_core.output_parsers import JsonOutputParser
from typing import Dict, Any, Optional
import json
from datetime import datetime

# LangChain Tools 관련 임포트
from langchain.tools import BaseTool, StructuredTool, tool
from langchain_core.tools import Tool
from langchain.agents import AgentExecutor, create_react_agent
from langchain_core.prompts import PromptTemplate

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

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_sample_tools(request, format=None):
    """
    LangChain Tools를 사용한 간단한 계산기 예제
    """
    print("LangChain Model을 가져옵니다...")
    model = get_langchain_model()
    
    # 계산기 도구 정의
    @tool
    def calculator(expression: str) -> str:
        """
        문자열로 된 수학 표현식을 계산합니다.
        
        Args:
            expression: 계산할 수학 표현식 (예: "2 + 2", "3 * 4", "10 / 2")
            
        Returns:
            계산 결과를 문자열로 반환
        """
        try:
            # eval은 보안상 위험할 수 있으나 예제 목적으로 사용
            result = eval(expression)
            return f"계산 결과: {expression} = {result}"
        except Exception as e:
            return f"계산 오류: {str(e)}"
    
    # 에이전트 프롬프트 템플릿
    prompt = PromptTemplate.from_template(
        """당신은 수학 문제를 해결하는 도우미입니다.
        
        주어진 도구를 사용하여 사용자의 수학 문제를 해결하세요.
        
        {tools}
        
        도구 이름: {tool_names}
        
        사용자 질문: {input}
        
        해결 과정을 단계별로 보여주세요:
        
        {agent_scratchpad}
        """
    )
    
    # 에이전트 생성
    agent = create_react_agent(model, [calculator], prompt)
    agent_executor = AgentExecutor(agent=agent, tools=[calculator], verbose=True)
    
    # 에이전트 실행
    try:
        math_problem = request.GET.get('problem', '2 + 2')
        print(f"수학 문제 해결을 시작합니다: {math_problem}")
        
        response = agent_executor.invoke({
            "input": f"다음 수학 문제를 계산해주세요: {math_problem}"
        })
        
        return Response({
            'status': 'Success',
            'problem': math_problem,
            'solution': response['output']
        })
    except Exception as e:
        print(f"계산기 도구 사용 중 에러 발생: {e}")
        return Response({
            'status': 'Error',
            'message': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_fortune_telling_parallel(request, format=None):
    """
    LangChain을 통해 일일, 주간, 월간, 년간 사주풀이를 병렬로 처리하는 API
    JSON 형식으로 응답을 반환합니다.
    """
    try:
        # 요청 데이터 파싱
        user_data = json.loads(request.body.decode('utf-8'))
        user_info = user_data.get('user_info', '')
        
        print("LangChain Model을 가져옵니다...")
        model = get_langchain_model()
        
        # JSON 출력 파서 정의
        parser = JsonOutputParser()
        
        # 일일 사주풀이 프롬프트 (JSON 형식 지정)
        daily_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        [
            {
                "label": "대인관계",
                "message": "대인관계에 대한 사주풀이 내용",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "일과 학업에 대한 사주풀이 내용",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "금전운에 대한 사주풀이 내용",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "건강에 대한 사주풀이 내용",
                "key": "health"
            },
            {
                "label": "오늘의 조언",
                "message": "오늘의 조언 내용",
                "key": "advice"
            },
            {
                "label": "오늘의 색상",
                "message": "오늘의 색상 내용",
                "key": "color"
            },
            {
                "label": "오늘의 음식",
                "message": "오늘의 음식 내용",
                "key": "food"
            }
        ]
        """
        
        # 주간 사주풀이 프롬프트 (JSON 형식 지정)
        weekly_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        [
            {
                "label": "대인관계",
                "message": "이번 주 대인관계에 대한 사주풀이 내용",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "이번 주 일과 학업에 대한 사주풀이 내용",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "이번 주 금전운에 대한 사주풀이 내용",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "이번 주 건강에 대한 사주풀이 내용",
                "key": "health"
            },
            {
                "label": "이번 주 조언",
                "message": "이번 주 조언 내용",
                "key": "advice"
            }
        ]
        """
        
        # 월간 사주풀이 프롬프트 (JSON 형식 지정)
        monthly_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        [
            {
                "label": "대인관계",
                "message": "이번 달 대인관계에 대한 사주풀이 내용",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "이번 달 일과 학업에 대한 사주풀이 내용",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "이번 달 금전운에 대한 사주풀이 내용",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "이번 달 건강에 대한 사주풀이 내용",
                "key": "health"
            },
            {
                "label": "이번 달 조언",
                "message": "이번 달 조언 내용",
                "key": "advice"
            }
        ]
        """
        
        # 년간 사주풀이 프롬프트 (JSON 형식 지정)
        yearly_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        [
            {
                "label": "대인관계",
                "message": "올해 대인관계에 대한 사주풀이 내용",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "올해 일과 학업에 대한 사주풀이 내용",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "올해 금전운에 대한 사주풀이 내용",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "올해 건강에 대한 사주풀이 내용",
                "key": "health"
            },
            {
                "label": "올해의 조언",
                "message": "올해의 조언 내용",
                "key": "advice"
            }
        ]
        """
        
        # 각 사주풀이 유형별 프롬프트 정의
        daily_prompt = set_prompt("다음 정보를 바탕으로 오늘의 사주풀이를 해주세요. {format_instructions} 사용자 정보: {user_info}", 
                                ["user_info"], {"format_instructions": daily_format_instructions})
        
        weekly_prompt = set_prompt("다음 정보를 바탕으로 이번 주의 사주풀이를 해주세요. {format_instructions} 사용자 정보: {user_info}", 
                                 ["user_info"], {"format_instructions": weekly_format_instructions})
        
        monthly_prompt = set_prompt("다음 정보를 바탕으로 이번 달의 사주풀이를 해주세요. {format_instructions} 사용자 정보: {user_info}", 
                                  ["user_info"], {"format_instructions": monthly_format_instructions})
        
        yearly_prompt = set_prompt("다음 정보를 바탕으로 올해의 사주풀이를 해주세요. {format_instructions} 사용자 정보: {user_info}", 
                                 ["user_info"], {"format_instructions": yearly_format_instructions})
        
        # 후처리 함수 정의
        def post_process(result):
            # 각 사주풀이 결과 추출 및 JSON 파싱
            try:
                # 각 결과가 이미 JSON 문자열이거나 객체인 경우 처리
                daily_content = result["daily"].content if hasattr(result["daily"], "content") else result["daily"]
                weekly_content = result["weekly"].content if hasattr(result["weekly"], "content") else result["weekly"]
                monthly_content = result["monthly"].content if hasattr(result["monthly"], "content") else result["monthly"]
                yearly_content = result["yearly"].content if hasattr(result["yearly"], "content") else result["yearly"]
                
                # 현재 시간 포맷팅
                current_time = datetime.now().isoformat()
                
                # 결과를 통합된 형식으로 변환
                return {
                    "fortune_telling": {
                        "user_info": user_info,
                        "results": {
                            "daily": daily_content,
                            "weekly": weekly_content,
                            "monthly": monthly_content,
                            "yearly": yearly_content
                        },
                        "timestamp": current_time
                    }
                }
            except Exception as e:
                print(f"JSON 파싱 오류: {e}")
                return {
                    "error": f"결과 처리 중 오류 발생: {str(e)}"
                }
        
        # 병렬 처리 체인 구성
        chain = RunnableParallel(
            daily=(daily_prompt.pipe(model).pipe(parser)),
            weekly=(weekly_prompt.pipe(model).pipe(parser)),
            monthly=(monthly_prompt.pipe(model).pipe(parser)),
            yearly=(yearly_prompt.pipe(model).pipe(parser))
        ).pipe(RunnableLambda(post_process))
        
        # 체인 실행
        print(f"사주풀이 병렬 처리를 시작합니다. 사용자 정보: {user_info}")
        response = chain.invoke({
            "user_info": user_info,
        })
        
        return Response({
            'status': 'Success',
            'message': response
        })
    except Exception as e:
        print(f"사주풀이 병렬 처리 중 에러 발생: {e}")
        return Response({
            'status': 'Error',
            'message': str(e)
        }, status=500)
