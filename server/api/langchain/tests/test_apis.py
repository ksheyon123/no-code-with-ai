from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.response import Response
from utils.langchain import get_langchain_model, set_chat_prompt, set_prompt, get_token_usage_from_response, estimate_token_cost

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

minimum_text_len = 100

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
def req_sample_tools_with_agent(request, format=None):
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


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_sample_tools_simple(request, format=None):
    """
    LangChain Tools를 사용한 간단한 계산기 예제 (Agent 없이 직접 Tool 사용)
    변수가 포함된 수식도 처리 가능 (예: "x+y=? (x=1, y=2)")
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
            return f"{expression} = {result}"
        except Exception as e:
            return f"계산 오류: {str(e)}"
    
    # 변수 추출 및 수식 계산 도구
    @tool
    def variable_calculator(problem: str) -> str:
        """
        변수가 포함된 수학 문제를 계산합니다.
        
        Args:
            problem: 변수가 포함된 수학 문제 (예: "x+y=? (x=1, y=2)")
            
        Returns:
            계산 결과를 문자열로 반환
        """
        try:
            # 수식과 변수 부분 분리
            import re
            
            # 변수 값 추출 (예: x=1, y=2)
            variables = {}
            var_matches = re.findall(r'([a-zA-Z]+)=([0-9.]+)', problem)
            for var_name, var_value in var_matches:
                variables[var_name] = float(var_value)
            
            # 수식 부분 추출 (예: x+y=?)
            equation_match = re.search(r'([^(]+)', problem)
            if equation_match:
                equation = equation_match.group(1).strip()
                # "=?" 부분 제거
                equation = equation.replace("=?", "").strip()
                
                # 변수 값 대입
                for var_name, var_value in variables.items():
                    equation = equation.replace(var_name, str(var_value))
                
                # 계산 실행
                result = eval(equation)
                
                # 원래 수식과 변수 값, 계산 결과 반환
                var_str = ", ".join([f"{var}={val}" for var, val in variables.items()])
                return f"{equation_match.group(1).strip()} (여기서 {var_str}) = {result}"
            else:
                return f"수식 형식 오류: {problem}"
        except Exception as e:
            return f"계산 오류: {str(e)}"
    
    # 프롬프트 정의 - 계산기 도구의 결과를 받아 응답 생성
    prompt = set_chat_prompt([
        ("system", """당신은 수학 문제를 해결하는 도우미입니다.
        계산 결과를 바탕으로 친절하고 명확한 답변을 제공하세요.
        계산 과정과 결과를 포함하여 설명해주세요.
        변수가 포함된 수식이라면 각 변수의 값과 대입 과정을 설명해주세요.
        """),
        ("human", "다음 수학 문제를 계산했습니다: {problem}\n결과: {calculation_result}\n이 계산 결과에 대해 설명해주세요.")
    ], ["problem", "calculation_result"])
    
    try:
        # 요청에서 수학 문제 가져오기
        math_problem = request.GET.get('problem', 'x+y=? (x=1, y=2)')
        print(f"수학 문제 해결을 시작합니다: {math_problem}")
        
        # 1. 적절한 계산기 도구 선택 및 호출
        if '=' in math_problem and any(c.isalpha() for c in math_problem):
            # 변수가 포함된 수식인 경우
            calculation_result = variable_calculator.invoke(math_problem)
        else:
            # 일반 수식인 경우
            calculation_result = calculator.invoke(math_problem)
            
        print(f"계산 결과: {calculation_result}")
        
        # 2. 계산 결과를 바탕으로 LLM에 설명 요청
        chain = prompt.pipe(model)
        response = chain.invoke({
            "problem": math_problem,
            "calculation_result": calculation_result
        })
        
        # 3. 최종 응답 반환
        return Response({
            'status': 'Success',
            'problem': math_problem,
            'calculation': calculation_result,
            'explanation': response.content if hasattr(response, 'content') else response
        })
    except Exception as e:
        print(f"계산기 도구 사용 중 에러 발생: {e}")
        return Response({
            'status': 'Error',
            'message': str(e)
        }, status=500)
    

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_fortune_telling_parallel_by_item(request, format=None):
    """
    LangChain을 통해 일일, 주간, 월간, 년간 사주풀이를 항목별로 병렬 처리하는 API
    각 기간(일간, 주간, 월간, 년간)의 개별 항목(대인관계, 일과학업, 금전운 등)별로 요청해서 합치는 방식
    JSON 형식으로 응답을 반환합니다.
    토큰 사용량 및 비용 정보도 함께 제공합니다.
    """
    try:
        # 요청 데이터 파싱
        user_data = json.loads(request.body.decode('utf-8'))
        user_info = user_data.get('user_info', '')
        
        print("LangChain Model을 가져옵니다...")
        model = get_langchain_model()
        model_name = model.model_name if hasattr(model, 'model_name') else "claude-3-5-sonnet-20240620"
        
        # JSON 출력 파서 정의
        parser = JsonOutputParser()
        
        # 항목 정의
        items = {
            "daily": [
                {"key": "relationship", "label": "대인관계"},
                {"key": "work", "label": "일과 학업"},
                {"key": "money", "label": "금전운"},
                {"key": "health", "label": "건강"},
                {"key": "advice", "label": "오늘의 조언"},
                {"key": "color", "label": "오늘의 색상"},
                {"key": "food", "label": "오늘의 음식"}
            ],
            "weekly": [
                {"key": "relationship", "label": "대인관계"},
                {"key": "work", "label": "일과 학업"},
                {"key": "money", "label": "금전운"},
                {"key": "health", "label": "건강"},
                {"key": "advice", "label": "이번 주 조언"}
            ],
            "monthly": [
                {"key": "relationship", "label": "대인관계"},
                {"key": "work", "label": "일과 학업"},
                {"key": "money", "label": "금전운"},
                {"key": "health", "label": "건강"},
                {"key": "advice", "label": "이번 달 조언"}
            ],
            "yearly": [
                {"key": "relationship", "label": "대인관계"},
                {"key": "work", "label": "일과 학업"},
                {"key": "money", "label": "금전운"},
                {"key": "health", "label": "건강"},
                {"key": "advice", "label": "올해의 조언"}
            ]
        }
        
        # 기간별 접두사 정의
        period_prefixes = {
            "daily": "오늘의",
            "weekly": "이번 주",
            "monthly": "이번 달",
            "yearly": "올해"
        }
        
        # 프롬프트 및 체인 생성 함수
        def create_item_prompt(period, item):
            period_text = {"daily": "오늘", "weekly": "이번 주", "monthly": "이번 달", "yearly": "올해"}[period]
            format_instructions = f"""
            RETURN ONLY JSON!
            NO DESCRIPTION ABOUT CREATED MESSAGE!
            다음 JSON 형식으로 응답해주세요:
            {{
                "label": "{item['label']}",
                "message": "{period_prefixes[period]} {item['label']}에 대한 사주풀이 내용",
                "key": "{item['key']}"
            }}
            """
            
            prompt_text = f"다음 정보를 바탕으로 {period_text}의 {item['label']}에 대한 사주풀이를 해주세요. {{format_instructions}} 사용자 정보: {{user_info}}"
            prompt = set_prompt(prompt_text, ["user_info"], {"format_instructions": format_instructions})
            return prompt.pipe(model).pipe(parser)
        
        # 모든 항목에 대한 병렬 체인 구성
        parallel_chains = {}
        
        # 각 기간의 각 항목에 대한 체인 생성
        for period, period_items in items.items():
            for item in period_items:
                chain_key = f"{period}_{item['key']}"
                parallel_chains[chain_key] = create_item_prompt(period, item)
        
        # 후처리 함수 정의
        def post_process(result):
            try:
                # 결과 정리
                processed_results = {
                    "daily": [],
                    "weekly": [],
                    "monthly": [],
                    "yearly": []
                }
                
                # 토큰 사용량 계산을 위한 구조
                token_usage = {
                    "daily": {},
                    "weekly": {},
                    "monthly": {},
                    "yearly": {}
                }
                
                # 각 결과 처리
                for key, value in result.items():
                    period, item_key = key.split('_', 1)
                    
                    # 결과 추출
                    content = value.content if hasattr(value, "content") else value
                    
                    # 결과가 문자열인 경우 JSON으로 파싱
                    if isinstance(content, str):
                        try:
                            content = json.loads(content)
                        except:
                            # JSON 파싱 실패 시 원본 유지
                            pass
                    
                    # 결과 추가
                    processed_results[period].append(content)
                    
                    # 토큰 사용량 계산
                    token_usage[period][item_key] = get_token_usage_from_response(value)
                
                # 현재 시간 포맷팅
                current_time = datetime.now().isoformat()
                
                # 토큰 사용량 합계 계산
                period_totals = {}
                for period, usage in token_usage.items():
                    period_input_tokens = sum(item_usage.get('input_tokens', 0) for item_usage in usage.values())
                    period_output_tokens = sum(item_usage.get('output_tokens', 0) for item_usage in usage.values())
                    period_totals[period] = {
                        'input_tokens': period_input_tokens,
                        'output_tokens': period_output_tokens,
                        'total_tokens': period_input_tokens + period_output_tokens
                    }
                
                # 총 토큰 사용량 계산
                total_input_tokens = sum(period_total.get('input_tokens', 0) for period_total in period_totals.values())
                total_output_tokens = sum(period_total.get('output_tokens', 0) for period_total in period_totals.values())
                total_tokens = total_input_tokens + total_output_tokens
                
                # 비용 계산
                cost = estimate_token_cost({
                    'input_tokens': total_input_tokens,
                    'output_tokens': total_output_tokens
                }, model_name)
                
                # 결과를 통합된 형식으로 변환
                return {
                    "fortune_telling": {
                        "user_info": user_info,
                        "results": {
                            "daily": processed_results["daily"],
                            "weekly": processed_results["weekly"],
                            "monthly": processed_results["monthly"],
                            "yearly": processed_results["yearly"]
                        },
                        "timestamp": current_time,
                        "token_usage": {
                            "by_item": token_usage,
                            "by_period": period_totals,
                            "total": {
                                "input_tokens": total_input_tokens,
                                "output_tokens": total_output_tokens,
                                "total_tokens": total_tokens
                            },
                            "cost": cost
                        }
                    }
                }
            except Exception as e:
                print(f"결과 처리 중 오류 발생: {e}")
                return {
                    "error": f"결과 처리 중 오류 발생: {str(e)}"
                }
        
        # 병렬 처리 체인 구성
        chain = RunnableParallel(**parallel_chains).pipe(RunnableLambda(post_process))
        
        # 체인 실행
        print(f"사주풀이 항목별 병렬 처리를 시작합니다. 사용자 정보: {user_info}")
        start_time = datetime.now()
        response = chain.invoke({
            "user_info": user_info,
        })
        end_time = datetime.now()
        execution_time = (end_time - start_time).total_seconds()
        
        # 실행 시간 정보 추가
        if "fortune_telling" in response:
            response["fortune_telling"]["execution_time"] = {
                "seconds": execution_time,
                "formatted": f"{execution_time:.2f}초"
            }
        
        return Response({
            'status': 'Success',
            'message': response
        })
    except Exception as e:
        print(f"사주풀이 항목별 병렬 처리 중 에러 발생: {e}")
        return Response({
            'status': 'Error',
            'message': str(e)
        }, status=500)    

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def req_fortune_telling_combined(request, format=None):
    """
    LangChain을 통해 일일, 주간, 월간, 년간 사주풀이를 하나의 프롬프트로 한 번에 요청하는 API
    JSON 형식으로 응답을 반환합니다.
    토큰 사용량 및 비용 정보도 함께 제공합니다.
    """
    try:
        # 요청 데이터 파싱
        user_data = json.loads(request.body.decode('utf-8'))
        user_info = user_data.get('user_info', '')
        
        print("LangChain Model을 가져옵니다...")
        model = get_langchain_model()
        model_name = model.model_name if hasattr(model, 'model_name') else "claude-3-5-sonnet-20240620"
        
        # JSON 출력 파서 정의
        parser = JsonOutputParser()
        
        # 통합 사주풀이 프롬프트 (JSON 형식 지정)
        combined_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        {
            "daily": [
                {
                    "label": "대인관계",
                    "message": "오늘의 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "relationship"
                },
                {
                    "label": "일과 학업",
                    "message": "오늘의 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "work"
                },
                {
                    "label": "금전운",
                    "message": "오늘의 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "money"
                },
                {
                    "label": "건강",
                    "message": "오늘의 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "health"
                },
                {
                    "label": "오늘의 조언",
                    "message": "오늘의 조언 내용 (최소 {minimum_text_len}자)",
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
            ],
            "weekly": [
                {
                    "label": "대인관계",
                    "message": "이번 주 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "relationship"
                },
                {
                    "label": "일과 학업",
                    "message": "이번 주 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "work"
                },
                {
                    "label": "금전운",
                    "message": "이번 주 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "money"
                },
                {
                    "label": "건강",
                    "message": "이번 주 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "health"
                },
                {
                    "label": "이번 주 조언",
                    "message": "이번 주 조언 내용 (최소 {minimum_text_len}자)",
                    "key": "advice"
                }
            ],
            "monthly": [
                {
                    "label": "대인관계",
                    "message": "이번 달 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "relationship"
                },
                {
                    "label": "일과 학업",
                    "message": "이번 달 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "work"
                },
                {
                    "label": "금전운",
                    "message": "이번 달 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "money"
                },
                {
                    "label": "건강",
                    "message": "이번 달 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "health"
                },
                {
                    "label": "이번 달 조언",
                    "message": "이번 달 조언 내용 (최소 {minimum_text_len}자)",
                    "key": "advice"
                }
            ],
            "yearly": [
                {
                    "label": "대인관계",
                    "message": "올해 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "relationship"
                },
                {
                    "label": "일과 학업",
                    "message": "올해 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "work"
                },
                {
                    "label": "금전운",
                    "message": "올해 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "money"
                },
                {
                    "label": "건강",
                    "message": "올해 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                    "key": "health"
                },
                {
                    "label": "올해의 조언",
                    "message": "올해의 조언 내용 (최소 {minimum_text_len}자)",
                    "key": "advice"
                }
            ]
        }
        """
        
        # 통합 사주풀이 프롬프트 정의
        combined_prompt = set_prompt("""
            다음 정보를 바탕으로 일간, 주간, 월간, 연간의 사주풀이를 해주세요. 
            반드시 daily, weekly, monthly, yearly 모든 항목에 대한 결과를 포함해야 합니다.
            각 기간별로 대인관계, 일과 학업, 금전운, 건강, 조언 등의 항목에 대한 운세를 제공해주세요. 
            {format_instructions} 사용자 정보: {user_info}
            """,
            ["user_info"], 
            {"format_instructions": combined_format_instructions}
        )
        
        # 체인 구성
        chain = combined_prompt.pipe(model).pipe(parser)
        
        # 체인 실행
        print(f"통합 사주풀이를 시작합니다. 사용자 정보: {user_info}")
        start_time = datetime.now()
        response_content = chain.invoke({
            "user_info": user_info,
            "minimum_text_len" : minimum_text_len
        })
        end_time = datetime.now()
        execution_time = (end_time - start_time).total_seconds()
        
        # 토큰 사용량 계산
        token_usage = get_token_usage_from_response(response_content)
        
        # 비용 계산
        cost = estimate_token_cost({
            'input_tokens': token_usage.get('input_tokens', 0),
            'output_tokens': token_usage.get('output_tokens', 0)
        }, model_name)
        
        # 결과 구성
        result = {
            "fortune_telling": {
                "user_info": user_info,
                "results": response_content,
                "timestamp": datetime.now().isoformat(),
                "token_usage": {
                    "total": token_usage,
                    "cost": cost
                },
                "execution_time": {
                    "seconds": execution_time,
                    "formatted": f"{execution_time:.2f}초"
                }
            }
        }
        
        return Response({
            'status': 'Success',
            'message': result
        })
    except Exception as e:
        print(f"통합 사주풀이 처리 중 에러 발생: {e}")
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
    토큰 사용량 및 비용 정보도 함께 제공합니다.
    """
    try:
        # 요청 데이터 파싱
        user_data = json.loads(request.body.decode('utf-8'))
        user_info = user_data.get('user_info', '')
        
        print("LangChain Model을 가져옵니다...")
        model = get_langchain_model()
        model_name = model.model_name if hasattr(model, 'model_name') else "claude-3-5-sonnet-20240620"
        
        # JSON 출력 파서 정의
        parser = JsonOutputParser()
        
        # 일일 사주풀이 프롬프트 (JSON 형식 지정)
        daily_format_instructions = """
        다음 JSON 형식으로 응답해주세요:
        [
            {
                "label": "대인관계",
                "message": "대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "health"
            },
            {
                "label": "오늘의 조언",
                "message": "오늘의 조언 내용 (최소 {minimum_text_len}자)",
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
                "message": "이번 주 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "이번 주 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "이번 주 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "이번 주 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "health"
            },
            {
                "label": "이번 주 조언",
                "message": "이번 주 조언 내용 (최소 40자)",
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
                "message": "이번 달 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "이번 달 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "이번 달 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "이번 달 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "health"
            },
            {
                "label": "이번 달 조언",
                "message": "이번 달 조언 내용 (최소 {minimum_text_len}자)",
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
                "message": "올해 대인관계에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "relationship"
            },
            {
                "label": "일과 학업",
                "message": "올해 일과 학업에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "work"
            },
            {
                "label": "금전운",
                "message": "올해 금전운에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "money"
            },
            {
                "label": "건강",
                "message": "올해 건강에 대한 사주풀이 내용 (최소 {minimum_text_len}자)",
                "key": "health"
            },
            {
                "label": "올해의 조언",
                "message": "올해의 조언 내용 (최소 {minimum_text_len}자)",
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
                
                # 토큰 사용량 계산
                token_usage = {
                    "daily": get_token_usage_from_response(result["daily"]),
                    "weekly": get_token_usage_from_response(result["weekly"]),
                    "monthly": get_token_usage_from_response(result["monthly"]),
                    "yearly": get_token_usage_from_response(result["yearly"])
                }
                
                # 총 토큰 사용량 계산
                total_input_tokens = sum(usage.get('input_tokens', 0) for usage in token_usage.values())
                total_output_tokens = sum(usage.get('output_tokens', 0) for usage in token_usage.values())
                total_tokens = total_input_tokens + total_output_tokens
                
                # 비용 계산
                cost = estimate_token_cost({
                    'input_tokens': total_input_tokens,
                    'output_tokens': total_output_tokens
                }, model_name)
                
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
                        "timestamp": current_time,
                        "token_usage": {
                            "by_request": token_usage,
                            "total": {
                                "input_tokens": total_input_tokens,
                                "output_tokens": total_output_tokens,
                                "total_tokens": total_tokens
                            },
                            "cost": cost
                        }
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
        start_time = datetime.now()
        response = chain.invoke({
            "user_info": user_info,
        })
        end_time = datetime.now()
        execution_time = (end_time - start_time).total_seconds()
        
        # 실행 시간 정보 추가
        if "fortune_telling" in response:
            response["fortune_telling"]["execution_time"] = {
                "seconds": execution_time,
                "formatted": f"{execution_time:.2f}초"
            }
        
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
