from django.urls import path, include
from . import apis
from .tests.test_apis import req_sample_chat, req_sample_answer, req_sample_analyze_image, req_sample_runnables_parallel, req_sample_runnables_sequence, req_sample_resnet_50_predict, req_fortune_telling_parallel

urlpatterns = [
    # 테스트 API
    path('req_sample_chat', req_sample_chat),
    path('req_sample_answer', req_sample_answer),
    path('req_sample_runnables_sequence', req_sample_runnables_sequence),
    path('req_sample_runnables_parallel', req_sample_runnables_parallel),
    path('req_sample_analyze_image', req_sample_analyze_image),
    path('req_sample_resnet_50_predict', req_sample_resnet_50_predict),
    path('req_fortune_telling_parallel', req_fortune_telling_parallel),

    # 실제 API
    path('init_langchain', apis.init_langchain),
    path('req_ui_component', apis.req_ui_component),
    path('req_parse_image', apis.req_parse_image),
    path('req_analyze_image', apis.req_analyze_image),
]
