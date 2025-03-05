from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import Item
from .serializers import ItemSerializer
from utils.langchain import initialize_langchain

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request, format=None):
    """
    API 루트 엔드포인트
    """
    return Response({
        'items': reverse('item-list', request=request, format=format),
        'status': 'API is running',
    })

class ItemViewSet(viewsets.ModelViewSet):
    """
    Item 모델에 대한 CRUD 작업을 위한 ViewSet
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
