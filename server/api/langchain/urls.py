from django.urls import path, include
from . import apis

urlpatterns = [
    path('init_langchain', apis.init_langchain),
    path('req_simple_answer', apis.req_simple_answer),
    path('req_ui_component', apis.req_ui_component),
    path('req_parse_image', apis.req_parse_image),
    path('req_analyze_image', apis.req_analyze_image),
    path('req_sample_runnables', apis.req_sample_runnables),
]
