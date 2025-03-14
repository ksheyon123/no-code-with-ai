from django.urls import path, include
from . import apis
from .tests.test_apis import req_sample_chat, req_sample_answer, req_sample_analyze_image, req_sample_runnables

urlpatterns = [
    # 테스트 API
    path('req_sample_chat', req_sample_chat),
    path('req_sample_answer', req_sample_answer),
    path('req_sample_runnables', req_sample_runnables),
    path('req_sample_analyze_image', req_sample_analyze_image),

    # 실제 API
    path('init_langchain', apis.init_langchain),
    path('req_ui_component', apis.req_ui_component),
    path('req_parse_image', apis.req_parse_image),
    path('req_analyze_image', apis.req_analyze_image),
]
