ui_component_format_instructions = """
  {{ 
    'new_id': '생성한 DOM 객체의 id입니다.', 
    'html': '여기에 HTML 코드를 문자열로 넣어주세요.', 
    'functions': '컴포넌트 내부에서 사용하는 Hooks 과 비즈니스 로직을 넣습니다.', 
    'component_name': 'ComponentName', 'imports': ['필요한 import 문들'], 
    'props'?: '상위 컴포넌트에서 하위 컴포넌트로 전달하는 Property',
    'styles'?: 'UI 생성에 필요한 style CSS Property', 
    'attributes'?: 'disabled, onFocus, onClick 등의 컴포넌트의 Property' 
  }}
"""

ui_component_example = example = """
      "new_id" : {new_id},
      "target_id" : lkasjjasldiwnmxals,
      "html": <div id={new_id} style={\\styles.container}>\n      <div>\n        <label>label 텍스트를 표현합니다.</label>\n        <input value={\\inputValue} onChange={\\handleInputChange} style={\\styles.input} />\n      </div>\n      <button disabled={\\!inputValue} style={\\styles.button}>\n        이 button 컴포넌트를 표현합니다. default는 disabled input 값이 있으면 abled 됩니다.\n      </button>\n    </div>,
      "functions" : ["const [inputValue, setInputValue] = useState('');", "const handleInputChange = (e) => {\n    setInputValue(e.target.value);\n  };"],
      "component_name": "ComponentName",
      "imports": ["import React, { useState } from 'react';"],
      "props"?: "{ children, onSubmit }",
      "styles"?: {"width" : "100%", "height" : "100%"},
      "attributes"?: {"onChange" : (data) => onChange(data) }
    """

ui_component_prompt = """
    You are an expert web developer. Create JSX code based on the given architecture.

    Example : {example}

    Architecture: {architecture}
    
    1. No "\n" (line break) in styles.
    2. Return a Only JSON response (without description of response) with the following structure:
    {format_instructions}
    """