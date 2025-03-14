from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from typing import Dict, Any, Optional

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def req_sample_fine_tune(request, format=None):
    """
    LangChain 초기화 엔드포인트
    """
    # 실제 LangChain 초기화 로직 호출

    return Response({
        'status': 'Success',
        'message': 'LangChain initialized successfully'
    })