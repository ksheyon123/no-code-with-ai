from django.urls import path, include
from . import apis

urlpatterns = [
    # 테스트 API
    path('req_sample_fine_tune', apis.req_sample_fine_tune),

]
