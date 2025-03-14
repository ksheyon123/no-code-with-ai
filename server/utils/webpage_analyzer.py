import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model
import numpy as np
import cv2
import matplotlib.pyplot as plt
from PIL import Image
import io
import os
import base64

class WebpageAnalyzer:
    def __init__(self):
        """
        ResNet50을 기반으로 하는 웹페이지 분석기 초기화
        """
        try:
            # 기본 ResNet50 모델 로드 (이미지넷으로 사전 훈련)
            base_model = ResNet50(weights='imagenet', include_top=False)
            
            # 특징 추출을 위한 모델 생성
            self.feature_model = Model(inputs=base_model.input, 
                                    outputs=base_model.get_layer('conv5_block3_out').output)
        except Exception as e:
            print(f"ResNet50 모델 로드 중 오류 발생: {e}")
            # 모델 로드에 실패한 경우, 더미 모델 사용을 설정
            self.feature_model = None
        
        # UI 요소 탐지를 위한 영역 모델 (추가 훈련 필요)
        self.ui_detector = self._build_ui_detector()
        
        # 웹페이지 기능 분류기 (추가 훈련 필요)
        self.function_classifier = self._build_function_classifier()
        
        # 일반적인 웹 UI 요소 레이블
        self.ui_labels = [
            'navigation_bar', 'search_box', 'button', 'form', 
            'image_carousel', 'menu', 'footer', 'header', 
            'table', 'video_player', 'social_media_widget',
            'login_form', 'shopping_cart', 'product_listing'
        ]
        
        # 일반적인 웹페이지 기능 레이블
        self.function_labels = [
            'e-commerce', 'blog', 'portfolio', 'social_media',
            'news', 'documentation', 'dashboard', 'forum',
            'streaming', 'educational', 'corporate', 'booking_system'
        ]
    
    def _build_ui_detector(self):
        """
        UI 요소 탐지를 위한 모델 구축 (실제 구현에서는 훈련된 객체 탐지 모델 필요)
        """
        # 실제 구현에서는 Faster R-CNN, YOLO 등의 객체 탐지 모델을 ResNet50 백본으로 사용
        # 여기서는 간단한 예시로 대체
        return None  # 실제 구현 필요
    
    def _build_function_classifier(self):
        """
        웹페이지 기능 분류를 위한 모델 구축
        """
        # ResNet50 특징에 기반한 분류기 구현
        # 실제 구현에서는 웹페이지 스크린샷 데이터셋으로 훈련 필요
        return None  # 실제 구현 필요
    
    def preprocess_screenshot(self, img_input, is_base64=False):
        """
        웹페이지 스크린샷 전처리
        
        Args:
            img_input: 이미지 경로 또는 base64 인코딩된 이미지 문자열
            is_base64: 입력이 base64 인코딩된 문자열인지 여부
        """
        if is_base64:
            # Base64 문자열에서 이미지 로드
            # base64 문자열이 'data:image/jpeg;base64,' 같은 프리픽스를 포함할 경우 제거
            if ',' in img_input:
                img_input = img_input.split(',')[1]
                
            img_data = base64.b64decode(img_input)
            img = Image.open(io.BytesIO(img_data))
            
            # 이미지가 RGBA 모드인 경우 RGB로 변환 (알파 채널 제거)
            if img.mode == 'RGBA':
                img = img.convert('RGB')
                
            img = img.resize((224, 224))
        else:
            # 파일 경로에서 이미지 로드
            img = image.load_img(img_input, target_size=(224, 224), color_mode='rgb')
        
        # 이미지 배열로 변환
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # ResNet50 전처리
        processed_img = preprocess_input(img_array)
        
        return processed_img, img
    
    def extract_features(self, processed_img):
        """
        ResNet50을 사용하여 이미지에서 특징 추출
        """
        try:
            # 이미지 채널 수 확인 및 출력
            print(f"입력 이미지 형태: {processed_img.shape}")
            
            # 채널 수가 4인 경우 RGB로 변환
            if processed_img.shape[-1] == 4:
                processed_img = processed_img[:, :, :, :3]
                print(f"RGB로 변환된 이미지 형태: {processed_img.shape}")
            
            # 특징 추출
            features = self.feature_model.predict(processed_img)
            return features
        except ValueError as e:
            print(f"특징 추출 중 오류 발생: {e}")
            # 오류 발생 시 더미 특징 반환 (실제 사용에서는 적절하게 처리 필요)
            # ResNet50의 conv5_block3_out 레이어의 출력 형태에 맞춤
            dummy_features = np.zeros((1, 7, 7, 2048))
            return dummy_features
    
    def detect_ui_elements(self, img_input, is_base64=False):
        """
        웹페이지 스크린샷에서 UI 요소 탐지
        
        Args:
            img_input: 이미지 경로 또는 base64 인코딩된 이미지 문자열
            is_base64: 입력이 base64 인코딩된 문자열인지 여부
        """
        # 실제 구현에서는 객체 탐지 모델 사용
        # 여기서는 샘플 결과를 위해 이미지 크기만 추출
        
        if is_base64:
            # Base64 문자열에서 이미지 로드
            if ',' in img_input:
                img_input = img_input.split(',')[1]
                
            img_data = base64.b64decode(img_input)
            img_array = np.frombuffer(img_data, dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            
            if img is None:
                # 이미지 로드에 실패한 경우 다른 방법으로 시도
                pil_img = Image.open(io.BytesIO(img_data))
                if pil_img.mode == 'RGBA':
                    pil_img = pil_img.convert('RGB')
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        else:
            # 파일 경로에서 이미지 로드
            img = cv2.imread(img_input)
            if img is None:
                # 다른 방법으로 시도
                pil_img = Image.open(img_input).convert('RGB')
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        
        height, width = img.shape[:2]
        
        # 샘플 UI 요소 (실제 구현에서는 모델이 탐지)
        sample_elements = [
            {'label': 'navigation_bar', 'confidence': 0.95, 
             'bbox': [0, 0, width, int(height*0.1)]},
            {'label': 'search_box', 'confidence': 0.89, 
             'bbox': [int(width*0.7), int(height*0.02), int(width*0.25), int(height*0.06)]},
            {'label': 'button', 'confidence': 0.92, 
             'bbox': [int(width*0.8), int(height*0.15), int(width*0.15), int(height*0.05)]},
        ]
        
        return sample_elements
    
    def classify_webpage_function(self, features):
        """
        추출된 특징을 기반으로 웹페이지의 주요 기능 분류
        """
        # 실제 구현에서는 훈련된 분류기 사용
        # 여기서는 샘플 결과 반환
        sample_predictions = {
            'e-commerce': 0.85,
            'blog': 0.12,
            'portfolio': 0.02,
            'corporate': 0.01,
        }
        
        # 디버깅 출력
        print(f"분류하는 특징 형태: {features.shape if features is not None else 'None'}")
        
        return sample_predictions
    
    def visualize_analysis(self, img, ui_elements, webpage_function):
        """
        분석 결과 시각화
        """
        # 원본 이미지에 UI 요소 표시
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        
        for element in ui_elements:
            x, y, w, h = element['bbox']
            label = element['label']
            confidence = element['confidence']
            
            cv2.rectangle(img_cv, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(img_cv, f"{label} ({confidence:.2f})", 
                       (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        # BGR에서 RGB로 변환 (matplotlib 표시용)
        img_cv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
        
        # 결과 시각화
        plt.figure(figsize=(15, 10))
        
        plt.subplot(1, 2, 1)
        plt.imshow(img_cv)
        plt.title('UI Elements Detection')
        plt.axis('off')
        
        plt.subplot(1, 2, 2)
        functions = list(webpage_function.keys())
        scores = list(webpage_function.values())
        
        plt.barh(functions, scores)
        plt.xlim(0, 1)
        plt.title('Webpage Function Classification')
        
        plt.tight_layout()
        
        # 이미지를 파일로 저장
        output_path = 'analysis_result.png'
        plt.savefig(output_path)
        plt.close()
        
        # Base64 인코딩된 이미지도 반환 (웹 환경에서 바로 표시할 수 있도록)
        with open(output_path, "rb") as img_file:
            b64_string = base64.b64encode(img_file.read()).decode('utf-8')
            
        return output_path, b64_string
    
    def generate_explanation(self, ui_elements, webpage_function):
        """
        분석 결과를 바탕으로 웹페이지 기능 설명 생성
        """
        # 주요 기능 결정
        main_function = max(webpage_function.items(), key=lambda x: x[1])
        
        # UI 요소 기반 설명
        ui_description = "이 웹페이지에는 다음과 같은 UI 요소가 포함되어 있습니다:\n"
        for element in ui_elements:
            ui_description += f"- {element['label']} (신뢰도: {element['confidence']:.2f})\n"
        
        # 페이지 기능 설명
        function_description = f"\n이 웹페이지는 주로 {main_function[0]} 기능을 제공하는 것으로 분석됩니다 (신뢰도: {main_function[1]:.2f}).\n"
        function_description += "다른 잠재적 기능은 다음과 같습니다:\n"
        
        for func, score in sorted(webpage_function.items(), key=lambda x: x[1], reverse=True)[1:]:
            if score > 0.05:  # 중요한 기능만 표시
                function_description += f"- {func} (신뢰도: {score:.2f})\n"
        
        # 종합적인 설명
        if main_function[0] == 'e-commerce':
            explanation = f"이 웹페이지는 전자상거래 플랫폼으로, 사용자가 제품을 검색하고 구매할 수 있습니다. "
            explanation += f"탐지된 탐색 바를 통해 제품 카테고리를 탐색하고, 검색 상자를 사용하여 특정 제품을 찾을 수 있습니다. "
            explanation += f"구매 버튼을 통해 제품 구매 과정을 시작할 수 있습니다."
        elif main_function[0] == 'blog':
            explanation = f"이 웹페이지는 블로그로, 글과 미디어 콘텐츠를 공유하는 플랫폼입니다. "
            explanation += f"탐지된 탐색 바를 통해 다양한 카테고리의 콘텐츠에 접근할 수 있으며, "
            explanation += f"검색 기능을 통해 특정 주제의 글을 찾을 수 있습니다."
        else:
            explanation = f"이 웹페이지는 {main_function[0]} 플랫폼으로, 해당 목적에 맞는 기능을 제공합니다. "
            explanation += f"탐지된 UI 요소들은 사용자가 콘텐츠를 탐색하고 상호작용할 수 있도록 설계되어 있습니다."
        
        return ui_description + function_description + "\n\n종합 설명:\n" + explanation
    
    def analyze_webpage(self, screenshot_input, is_base64=False):
        """
        웹페이지 스크린샷 분석 및 결과 반환
        
        Args:
            screenshot_input: 이미지 경로 또는 base64 인코딩된 이미지 문자열
            is_base64: 입력이 base64 인코딩된 문자열인지 여부
        """
        try:
            # 이미지 전처리
            processed_img, original_img = self.preprocess_screenshot(screenshot_input, is_base64)
            
            # 특징 추출
            features = self.extract_features(processed_img)
            
            # UI 요소 탐지
            ui_elements = self.detect_ui_elements(screenshot_input, is_base64)
            
            # 웹페이지 기능 분류
            webpage_function = self.classify_webpage_function(features)
            
            # 결과 시각화
            result_img_path, result_img_b64 = self.visualize_analysis(original_img, ui_elements, webpage_function)
            
            # 설명 생성
            explanation = self.generate_explanation(ui_elements, webpage_function)
            
            return {
                'ui_elements': ui_elements,
                'webpage_function': webpage_function,
                'result_visualization': result_img_path,
                'result_visualization_b64': result_img_b64,
                'explanation': explanation
            }
        except Exception as e:
            print(f"분석 중 오류 발생: {e}")
            # 오류 발생 시 기본 결과 반환
            return {
                'ui_elements': [],
                'webpage_function': {'error': 1.0},
                'result_visualization': 'error.png',
                'result_visualization_b64': '',
                'explanation': f"이미지 분석 중 오류가 발생했습니다: {str(e)}"
            }


# 사용 예시
if __name__ == "__main__":
    analyzer = WebpageAnalyzer()
    
    # 파일 경로를 사용한 예시
    screenshot_path = "webpage_screenshot.png"
    result_file = analyzer.analyze_webpage(screenshot_path, is_base64=False)
    print("파일 경로 분석 결과:")
    print(result_file['explanation'])
    print(f"분석 결과 시각화가 {result_file['result_visualization']}에 저장되었습니다.")
    
    # Base64 문자열을 사용한 예시
    # 실제 Base64 문자열을 변수에 저장 (이 예제에서는 파일에서 읽어 Base64로 변환)
    with open(screenshot_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Base64 문자열로 분석 실행
    result_base64 = analyzer.analyze_webpage(encoded_string, is_base64=True)
    
    print("\nBase64 문자열 분석 결과:")
    print(result_base64['explanation'])
    print(f"분석 결과 시각화가 {result_base64['result_visualization']}에 저장되었습니다.")
    
    # 웹 애플리케이션에서 Base64 이미지를 표시하는 예시 (HTML)
    html_example = f"""
    <html>
    <head><title>웹페이지 분석 결과</title></head>
    <body>
        <h1>웹페이지 분석 결과</h1>
        <h2>UI 요소 및 기능 분석</h2>
        <img src="data:image/png;base64,{result_base64['result_visualization_b64']}" alt="분석 결과" />
        <h2>분석 설명</h2>
        <p>{result_base64['explanation'].replace('\n', '<br/>')}</p>
    </body>
    </html>
    """
    
    # HTML 파일 저장 (웹 애플리케이션 예시용)
    with open("analysis_result.html", "w", encoding="utf-8") as html_file:
        html_file.write(html_example)
    
    print("\nHTML 결과 페이지가 analysis_result.html에 저장되었습니다.")