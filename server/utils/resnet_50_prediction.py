import numpy as np
import base64
import io
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
from PIL import Image
import matplotlib.pyplot as plt

def predict_from_base64(base64_string):
    """
    Base64 인코딩된 이미지를 ResNet50 모델로 예측합니다.
    
    Args:
        base64_string (str): Base64로 인코딩된 이미지 문자열
        
    Returns:
        predictions (list): 상위 5개 예측 결과 (클래스 ID, 클래스명, 확률)
    """
    # ResNet50 모델 로드 (ImageNet으로 사전 훈련됨)
    model = ResNet50(weights='imagenet')
    
    try:
        # Base64 문자열이 'data:image/jpeg;base64,' 형식으로 시작하는 경우 처리
        if 'base64,' in base64_string:
            base64_string = base64_string.split('base64,')[1]
        
        # Base64 디코딩
        img_data = base64.b64decode(base64_string)
        
        # 이미지 열기
        img = Image.open(io.BytesIO(img_data))
        
        # 이미지 크기 조정 (224x224는 ResNet50의 입력 크기)
        img = img.resize((224, 224))
        
        # 이미지 시각화
        plt.figure(figsize=(6, 6))
        plt.imshow(img)
        plt.axis('off')
        plt.title("입력 이미지")
        plt.show()
        
        # 이미지를 numpy 배열로 변환
        img_array = np.array(img)
        
        # RGB 이미지가 아닌 경우 변환 (예: RGBA, 그레이스케일)
        if len(img_array.shape) != 3 or img_array.shape[2] != 3:
            img = img.convert('RGB')
            img_array = np.array(img)
        
        # 배치 형태로 확장 (모델은 배치 입력을 예상)
        img_batch = np.expand_dims(img_array, axis=0)
        
        # ResNet50 전처리 적용
        processed_img = preprocess_input(img_batch)
        
        # 예측 실행
        predictions = model.predict(processed_img, verbose=0)
        
        # 예측 결과 디코딩 (상위 5개)
        decoded_predictions = decode_predictions(predictions, top=5)[0]
        
        print("예측 결과:")
        for i, (imagenet_id, label, score) in enumerate(decoded_predictions):
            print(f"{i+1}: {label} ({score:.4f})")
        
        return decoded_predictions
        
    except Exception as e:
        print(f"이미지 처리 중 오류 발생: {str(e)}")
        return None