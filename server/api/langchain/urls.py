from django.urls import path, include
from . import apis

urlpatterns = [
    path('init_langchain', apis.init_langchain),
    path('req_simple_answer', apis.req_simple_answer),
    path('req_simple_architecture', apis.req_simple_architecture),
    path('req_ui_component', apis.req_ui_component)
]
