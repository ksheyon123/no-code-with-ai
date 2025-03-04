from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# DRF 라우터 설정
router = DefaultRouter()
router.register(r'items', views.ItemViewSet)

urlpatterns = [
    path('', views.api_root),
    path('', include(router.urls)),
    path('init_langchain', views.init_langchain)
]
