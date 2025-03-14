
import base64
import io
from PIL import Image
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import numpy as np
from sklearn.cluster import KMeans
import cv2
import matplotlib
# GUI 없이 Matplotlib 사용 (백엔드를 Agg로 설정)
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

class UIComponentDetector:
    def __init__(self):
        # Load ResNet50 model (deprecated 'pretrained' 대신 'weights' 사용)
        self.model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
        # Remove the fully connected layer to get feature maps
        self.features = nn.Sequential(*list(self.model.children())[:-2])
        self.features.eval()
        
        # Define transformations
        self.transform = transforms.Compose([
            transforms.Resize((800, 800)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # UI component classes
        self.ui_classes = [
            "button", "text_field", "checkbox", "radio_button", "dropdown", 
            "link", "image", "header", "paragraph", "list", "table", "form",
            "navigation", "sidebar", "footer"
        ]
    
    def generate_anchor_boxes(self, image_size, scales=(0.5, 1.0, 2.0), aspect_ratios=(0.5, 1.0, 2.0)):
        """Generate anchor boxes at different scales and aspect ratios"""
        anchors = []
        feature_map_size = image_size // 32  # ResNet50 downsamples by factor of 32
        
        for y in range(feature_map_size):
            for x in range(feature_map_size):
                for scale in scales:
                    for ratio in aspect_ratios:
                        width = scale * np.sqrt(ratio)
                        height = scale / np.sqrt(ratio)
                        
                        # Convert to image coordinates
                        cx = (x + 0.5) * 32
                        cy = (y + 0.5) * 32
                        
                        # Create anchor box (x1, y1, x2, y2)
                        x1 = cx - width * 16
                        y1 = cy - height * 16
                        x2 = cx + width * 16
                        y2 = cy + height * 16
                        
                        anchors.append([x1, y1, x2, y2])
        
        return np.array(anchors)
    
    def extract_roi_features(self, image, boxes):
        """Extract features for regions of interest"""
        # Convert PIL image to tensor
        img_tensor = self.transform(image).unsqueeze(0)
        
        # Extract features
        with torch.no_grad():
            feature_maps = self.features(img_tensor)
        
        # Get feature map dimensions
        _, C, H, W = feature_maps.shape
        
        # Scale boxes to feature map size
        scale_x = W / image.width
        scale_y = H / image.height
        
        scaled_boxes = []
        for box in boxes:
            x1, y1, x2, y2 = box
            scaled_boxes.append([
                int(x1 * scale_x),
                int(y1 * scale_y),
                int(x2 * scale_x),
                int(y2 * scale_y)
            ])
        
        # Extract ROI features
        roi_features = []
        for box in scaled_boxes:
            x1, y1, x2, y2 = box
            # Ensure coordinates are within bounds
            x1 = max(0, min(x1, W-1))
            y1 = max(0, min(y1, H-1))
            x2 = max(x1+1, min(x2, W))
            y2 = max(y1+1, min(y2, H))
            
            # Extract feature for this ROI
            roi_feature = feature_maps[0, :, y1:y2, x1:x2]
            
            # Global average pooling
            roi_feature = roi_feature.mean(dim=(1, 2))
            
            roi_features.append(roi_feature)
        
        return torch.stack(roi_features) if roi_features else torch.empty(0, C)
    
    def detect_components_with_sliding_window(self, image, window_sizes=[(64, 64), (128, 128), (256, 256)], stride=32):
        """Detect UI components using sliding window approach"""
        img_np = np.array(image)
        height, width = img_np.shape[:2]
        detections = []
        
        # 시각화 코드 제거 (GUI 오류 방지)
        # 대신 결과만 반환
        print(window_sizes)
        for window_width, window_height in window_sizes:
            for y in range(0, height - window_height + 1, stride):
                for x in range(0, width - window_width + 1, stride):
                    # Extract window
                    window = image.crop((x, y, x + window_width, y + window_height))
                    
                    # Get features
                    window_tensor = self.transform(window).unsqueeze(0)
                    
                    with torch.no_grad():
                        features = self.features(window_tensor)
                        # Global average pooling
                        features = features.mean(dim=(2, 3))
                    print("WINDOW")
                    # Here you would classify the window using these features
                    # For demonstration, let's use a simple approach
                    component_type = self._simple_classify_window(window, features)
                    
                    if component_type:
                        detection = {
                            "type": component_type,
                            "x": x,
                            "y": y,
                            "width": window_width,
                            "height": window_height,
                            "confidence": 0.85  # Placeholder confidence score
                        }
                        detections.append(detection)
        
        # 시각화 결과를 저장하는 대신 로그 메시지만 출력
        print(f"감지된 UI 컴포넌트 수: {len(detections)}")
        return detections
    
    def _simple_classify_window(self, window, features):
        """Simple classification logic for demo purposes"""
        # Convert window to numpy for OpenCV processing
        window_np = np.array(window)
        
        # Convert to grayscale
        gray = cv2.cvtColor(window_np, cv2.COLOR_RGB2GRAY)
        
        # Calculate aspect ratio
        h, w = gray.shape
        aspect_ratio = w / h if h > 0 else 0
        
        # Calculate edge density
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / (h * w)
        
        # Calculate color variance
        hsv = cv2.cvtColor(window_np, cv2.COLOR_RGB2HSV)
        color_var = np.var(hsv[:,:,0])
        
        # Simple rules for classification
        if aspect_ratio > 3:
            return "navigation"
        elif aspect_ratio < 0.3:
            return "sidebar"
        elif edge_density < 0.05 and np.mean(gray) > 200:
            return "text_field"
        elif edge_density > 0.2 and aspect_ratio > 0.8 and aspect_ratio < 1.2 and w < 100:
            return "button"
        elif edge_density < 0.1 and color_var < 100:
            return "paragraph"
        elif edge_density > 0.15 and color_var > 300:
            return "image"
        
        return None  # No component detected

    def detect_text_regions(self, image):
        """Detect regions that likely contain text"""
        # Convert PIL image to numpy for OpenCV
        img_np = np.array(image)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
        
        # Apply MSER (Maximally Stable Extremal Regions)
        mser = cv2.MSER_create()
        regions, _ = mser.detectRegions(gray)
        
        # Filter and merge text regions
        hulls = [cv2.convexHull(p.reshape(-1, 1, 2)) for p in regions]
        
        # Filter small regions
        hulls = [h for h in hulls if cv2.contourArea(h) > 50]
        
        # Convert hulls to bounding rectangles
        text_regions = []
        for hull in hulls:
            x, y, w, h = cv2.boundingRect(hull)
            text_regions.append({
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "type": "text"
            })
        
        # Merge overlapping regions
        text_regions = self._merge_overlapping_regions(text_regions)
        
        return text_regions
    
    def _merge_overlapping_regions(self, regions, iou_threshold=0.3):
        """Merge overlapping regions based on IoU (Intersection over Union)"""
        if not regions:
            return []
        
        # Sort regions by area (descending)
        regions = sorted(regions, key=lambda r: r["width"] * r["height"], reverse=True)
        
        merged_regions = [regions[0]]
        
        for region in regions[1:]:
            merged = False
            for i, merged_region in enumerate(merged_regions):
                # Calculate IoU
                intersection = self._calculate_intersection(region, merged_region)
                union = (region["width"] * region["height"] + 
                         merged_region["width"] * merged_region["height"] - 
                         intersection)
                
                iou = intersection / union if union > 0 else 0
                
                if iou > iou_threshold:
                    # Merge regions
                    x1 = min(region["x"], merged_region["x"])
                    y1 = min(region["y"], merged_region["y"])
                    x2 = max(region["x"] + region["width"], merged_region["x"] + merged_region["width"])
                    y2 = max(region["y"] + region["height"], merged_region["y"] + merged_region["height"])
                    
                    merged_regions[i] = {
                        "x": x1,
                        "y": y1,
                        "width": x2 - x1,
                        "height": y2 - y1,
                        "type": "text"
                    }
                    merged = True
                    break
            
            if not merged:
                merged_regions.append(region)
        
        return merged_regions
    
    def _calculate_intersection(self, r1, r2):
        """Calculate intersection area between two regions"""
        x1 = max(r1["x"], r2["x"])
        y1 = max(r1["y"], r2["y"])
        x2 = min(r1["x"] + r1["width"], r2["x"] + r2["width"])
        y2 = min(r1["y"] + r1["height"], r2["y"] + r2["height"])
        
        w = max(0, x2 - x1)
        h = max(0, y2 - y1)
        
        return w * h


# Example usage
def detect_ui_components(base64_data):
    try:
        detector = UIComponentDetector()
        
        # 입력 데이터 검증
        if not base64_data:
            return {"error": "Base64 데이터가 비어 있습니다."}
        
        # base64 데이터에서 헤더 제거 (있는 경우)
        if ',' in base64_data:
            base64_data = base64_data.split(',', 1)[1]
        
        # base64 패딩 수정 - 길이가 4의 배수가 되도록 '=' 추가
        base64_data = base64_data.strip()
        padding_needed = len(base64_data) % 4
        if padding_needed:
            base64_data += '=' * (4 - padding_needed)
        
        try:
            # base64 디코딩 시도
            image_bytes = base64.b64decode(base64_data)
        except Exception as e:
            return {"error": f"Base64 디코딩 오류: {str(e)}"}
        
        try:
            # 이미지 열기 시도
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        except Exception as e:
            # 디버깅을 위해 디코딩된 데이터의 처음 몇 바이트 확인
            preview = str(image_bytes[:20]) if image_bytes else "빈 데이터"
            return {"error": f"이미지 파일을 열 수 없습니다: {str(e)}, 데이터 미리보기: {preview}"}
        
        print("시작")
        # Detect components using sliding window
        components = detector.detect_components_with_sliding_window(image)
        print("TEXT 영역")
        # Detect text regions
        text_regions = detector.detect_text_regions(image)
        
        results = {
            "ui_components": components,
            "text_regions": text_regions
        }
        
        return results
    except Exception as e:
        # 예상치 못한 오류 처리
        return {"error": f"UI 컴포넌트 감지 중 오류 발생: {str(e)}"}
