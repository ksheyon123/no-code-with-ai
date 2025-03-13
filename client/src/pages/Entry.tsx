import React, { useState, useRef, ChangeEvent } from "react";
import { uploadImage } from "../apis/api";

/**
 * Entry 컴포넌트 - 이미지 업로드 기능을 포함
 */
const Entry = () => {
  // 이미지 파일 상태 관리
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 선택 핸들러
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // 이미지 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 버튼 클릭 핸들러
  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // base64 데이터에서 헤더 제거 함수
  const removeBase64Header = (base64String: string): string => {
    // base64 데이터에서 헤더(예: "data:image/jpeg;base64,") 제거
    return base64String.replace(/^data:image\/[a-z]+;base64,/, "");
  };

  // 로딩 상태 추가
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 이미지 업로드 핸들러
  const handleUpload = async () => {
    if (selectedImage && previewUrl) {
      try {
        // 로딩 상태 설정
        setIsUploading(true);
        console.log("이미지 업로드 중...");

        // base64 데이터에서 헤더 제거
        const base64Data = removeBase64Header(previewUrl);

        // 업로드할 데이터 구성
        const uploadData = {
          fileName: selectedImage.name,
          fileType: selectedImage.type,
          base64Data: base64Data,
          fileSize: selectedImage.size,
        };

        // API 호출하여 이미지 업로드
        const response = await uploadImage(uploadData);
        console.log("업로드 결과:", response);

        // 성공 메시지
        alert("이미지가 성공적으로 업로드되었습니다.");

        // 업로드 후 폼 초기화 (선택적)
        // setSelectedImage(null);
        // setPreviewUrl(null);
      } catch (error) {
        console.error("업로드 오류:", error);
        alert(
          `업로드 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : "알 수 없는 오류"
          }`
        );
      } finally {
        // 로딩 상태 해제
        setIsUploading(false);
      }
    } else {
      alert("업로드할 이미지를 선택해주세요.");
    }
  };

  return (
    <div
      className="entry-container"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        이미지 업로드
      </h1>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* 이미지 선택 영역 */}
      <div
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
          cursor: "pointer",
          backgroundColor: "#f9f9f9",
        }}
        onClick={handleSelectClick}
      >
        {previewUrl ? (
          <div>
            <img
              src={previewUrl}
              alt="선택한 이미지 미리보기"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginBottom: "10px",
              }}
            />
            <p>{selectedImage?.name}</p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "16px", color: "#666" }}>
              클릭하여 이미지를 선택하세요
            </p>
            <p style={{ fontSize: "14px", color: "#999" }}>
              지원 형식: JPG, PNG, GIF 등
            </p>
          </div>
        )}
      </div>

      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={!selectedImage || isUploading}
        style={{
          backgroundColor: selectedImage && !isUploading ? "#4CAF50" : "#ccc",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: selectedImage && !isUploading ? "pointer" : "not-allowed",
          width: "100%",
        }}
      >
        {isUploading ? "업로드 중..." : "이미지 업로드"}
      </button>
    </div>
  );
};

export default Entry;
