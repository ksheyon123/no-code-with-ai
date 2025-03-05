import React, { useState } from "react";

const ComponentPreview = () => {
  const [activeTab, setActiveTab] = useState("preview");
  const [selectedComponent, setSelectedComponent] = useState(null);

  // 샘플 컴포넌트 데이터
  const sampleComponent: any = {
    jsx_code: `const ComponentName = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div style={{display: 'flex'}}>
      <div>
        <label>사용자 이름</label>
        <input 
          value={inputValue} 
          onChange={handleInputChange} 
          placeholder="이름을 입력하세요" 
        />
      </div>
      <button 
        disabled={!inputValue}
        style={{marginLeft: '10px'}}
      >
        저장
      </button>
    </div>
  );
};`,
    component_name: "ComponentName",
    imports: ["import React, { useState } from 'react';"],
  };

  // 컴포넌트 선택 처리
  const handleSelectComponent = () => {
    setSelectedComponent(sampleComponent);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gray-100 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">컴포넌트 빌더</h2>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex h-screen max-h-96">
          {/* 왼쪽 패널: 컴포넌트 영역 */}
          <div className="w-2/3 border-r p-4">
            <div className="mb-4 border-b pb-2">
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${
                    activeTab === "preview"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  미리보기
                </button>
                <button
                  className={`px-3 py-1 rounded ${
                    activeTab === "editor"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("editor")}
                >
                  영역 선택
                </button>
              </div>
            </div>

            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              {selectedComponent ? (
                <div className="p-4">
                  <div className="flex">
                    <div>
                      <label>사용자 이름</label>
                      <input
                        placeholder="이름을 입력하세요"
                        className="border px-2 py-1 rounded"
                      />
                    </div>
                    <button
                      className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                      disabled
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>컴포넌트를 선택하거나 생성하세요</p>
                  <button
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={handleSelectComponent}
                  >
                    샘플 컴포넌트 불러오기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 패널: 속성 및 코드 */}
          <div className="w-1/3 p-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">컴포넌트 속성</h3>
                {selectedComponent && (
                  <button className="text-xs px-2 py-1 bg-green-500 text-white rounded">
                    저장
                  </button>
                )}
              </div>

              {selectedComponent ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm text-gray-600">
                      컴포넌트 유형
                    </label>
                    <select className="w-full p-1 border rounded text-sm">
                      <option>입력 폼</option>
                      <option>버튼</option>
                      <option>컨테이너</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">설명</label>
                    <input
                      className="w-full p-1 border rounded text-sm"
                      defaultValue="사용자 이름 입력 폼"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  컴포넌트를 선택하면 속성을 편집할 수 있습니다.
                </div>
              )}
            </div>

            {selectedComponent && (
              <div>
                <h3 className="font-medium mb-2">코드 미리보기</h3>
                <div className="bg-gray-800 text-gray-100 p-2 rounded text-xs overflow-auto max-h-48">
                  <pre>{`import React, { useState } from 'react';

const ComponentName = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div style={{display: 'flex'}}>
      <div>
        <label>사용자 이름</label>
        <input 
          value={inputValue} 
          onChange={handleInputChange} 
          placeholder="이름을 입력하세요" 
        />
      </div>
      <button 
        disabled={!inputValue}
        style={{marginLeft: '10px'}}
      >
        저장
      </button>
    </div>
  );
};`}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPreview;
