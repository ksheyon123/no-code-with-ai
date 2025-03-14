import base64
import io
from PIL import Image
import torch  # 이 줄 추가
from transformers import TrOCRProcessor, VisionEncoderDecoderModel



def extract_text_from_base64_image(base64_image):
    try:
        # naorm/website-screenshots-git-large
        # microsoft/resnet-50
        # TrOCR 모델 로드
        processor = TrOCRProcessor.from_pretrained('microsoft/resnet-50')
        model = VisionEncoderDecoderModel.from_pretrained('microsoft/resnet-50')
        
        # base64 문자열 디코딩
        if ',' in base64_image:
            base64_image = base64_image.split(',')[1]
        
        image_bytes = base64.b64decode(base64_image)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # 이미지 크기 줄이기 (메모리 사용량 감소)
        max_size = 800
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = (int(image.width * ratio), int(image.height * ratio))
            image = image.resize(new_size, Image.LANCZOS)
        
        print(f"이미지 크기: {image.size}")
    
        # # 수정된 부분: 이미지를 base64로 인코딩하여 확인
        # buffered = io.BytesIO()
        # image.save(buffered, format="JPEG")
        # img_bytes = buffered.getvalue()
        # img_base64 = base64.b64encode(img_bytes).decode('utf-8')
        # print(f"변환된 base64 이미지: {img_base64}") 

        # 이미지 처리
        pixel_values = processor(images=image, return_tensors="pt").pixel_values
        print("텍스트 추출 전", pixel_values)
        
        # 텍스트 추출 - 메모리 효율적인 설정으로 변경
        try:
            with torch.no_grad():  # 메모리 사용량 줄이기
                generated_ids = model.generate(
                    pixel_values,
                    max_length=64,  # 짧게 설정
                    num_beams=1
                    # early_stopping=True
                )
            print("텍스트 생성 완료")
            
            generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            print(f"추출된 텍스트: {generated_text}")
            return generated_text
        except RuntimeError as e:
            if 'CUDA out of memory' in str(e) or 'DefaultCPUAllocator: not enough memory' in str(e):
                print("메모리 부족 오류 발생")
                # 더 작은 이미지로 다시 시도
                smaller_size = (int(image.width * 0.5), int(image.height * 0.5))
                image = image.resize(smaller_size, Image.LANCZOS)
                pixel_values = processor(images=image, return_tensors="pt").pixel_values
                
                with torch.no_grad():
                    generated_ids = model.generate(
                        pixel_values,
                        max_length=32,  # 더 짧게 설정
                        num_beams=1
                    )
                generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                return generated_text
            else:
                print(f"오류 발생: {str(e)}")
                return f"오류: {str(e)}"
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"예상치 못한 오류: {str(e)}")
        return f"오류: {str(e)}"