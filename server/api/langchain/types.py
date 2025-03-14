from typing import TypedDict, Dict, Any, Optional

class RequestImageDict(TypedDict):
    filename: str
    fileType: str
    base64Data: str
    filesize: str
