# Django 백엔드 서버

이 프로젝트는 Django와 Django REST Framework를 사용한 백엔드 API 서버입니다.

## 기능

- RESTful API 제공
- 아이템 CRUD 기능
- Django 관리자 인터페이스
- CORS 지원

## 설치 및 실행 방법

### 1. 가상 환경 설정 (선택 사항)

```bash
# 가상 환경 생성
python -m venv venv

# 가상 환경 활성화 (Windows)
venv\Scripts\activate

# 가상 환경 활성화 (macOS/Linux)
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 데이터베이스 마이그레이션

```bash
python manage.py migrate
```

### 4. 관리자 계정 생성

```bash
python manage.py createsuperuser
```

### 5. 서버 실행

```bash
python manage.py runserver
```

## API 엔드포인트

- API 루트: `http://localhost:8000/api/`
- 아이템 목록: `http://localhost:8000/api/items/`
- 관리자 인터페이스: `http://localhost:8000/admin/`

## 테스트 실행

```bash
python manage.py test
```
