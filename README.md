# 🎬 영화 검색 웹 애플리케이션 - TMDB API 활용 프로젝트

> **React? 안돼요! NextJS? 안돼요! Tailwindcss? 노노입니다.**  
> 커리큘럼에 맞춰 **HTML, CSS, JavaScript**만으로 차근차근 구현 연습을 진행합니다!

## 🎯 프로젝트 개요

어떤 영화가 핫한지 궁금하신가요?  
여러분이 좋아하는 영화를 찾고 싶나요?  
**TMDB의 수많은 영화 데이터를 활용해 검색, 조회, 리뷰까지 가능한 영화 앱**을 직접 만들어보세요! 🍿

넷플릭스를 만든다고 상상하면서 흥미롭게 도전해봅시다.

---

## 🛠️ 목표

- **실제 영화 정보를 보여주는 검색 사이트 만들기**
- **HTML, CSS, JS만 사용**하여 TMDB API와 직접 통신해보기
- **멋진 영화 카드 UI**로 데이터를 보기 좋게 표현하기
- 실시간 데이터를 활용해 **API 사용법 익히기**

---

## 📁 1. 프로젝트 파일 구조 설정

- `index.html`: 기본 구조 (헤더, 본문, 푸터 등)
- `style.css`: 디자인 및 레이아웃 정의
- `app.js`: TMDB API 연동 및 기능 로직 처리

```plaintext
movie/
│
├── index.html
├── style.css
└── app.js
```

- HTML에 CSS와 JS 파일을 연결하세요.

---

## 🔌 2. TMDB API 연결

- TMDB API 키를 발급받아 사용합니다.  
  [TMDB API 시작하기 →](https://developer.themoviedb.org/reference/intro/getting-started)

```js
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json'
  }
};

fetch('https://api.themoviedb.org/3/authentication', options)
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

- 위 코드를 참고하여 API가 정상적으로 작동하는지 **콘솔에서 데이터 출력**으로 확인하세요.

---

## ✅ 필수 구현 기능

### 1. **영화 카드 리스트 UI**

- 포스터 이미지
- 영화 제목
- 평점
- 요약 설명

➡️ HTML과 CSS로 보기 좋게 카드 형태로 구성하세요.

---

### 2. **영화 검색 기능**

- 사용자 검색어 입력 후 버튼 클릭 시 검색 실행
- TMDB에서 관련 영화 데이터를 받아 화면에 표시
- 검색어에 맞는 영화만 필터링하여 보여주기

➡️ 핵심: **검색 로직 정확히 구현하기**

---

### 3. **영화 상세 정보 모달**

- 영화 카드 클릭 시 해당 영화 ID로 상세 정보 요청
- 모달 창으로 상세 정보 표시
- 닫기 및 뒤로가기 기능 포함

➡️ 핵심: **TMDB API로 ID 기반 상세 요청 처리**

---

## 🚫 아직 구현하지 않을 도전 과제들 (추후에!)

- 코드 모듈화 및 분리
- 반응형 디자인
- `Enter` 키로 검색 실행
- 이벤트 위임
- 로컬 스토리지 북마크 기능
- async/await 문법으로 리팩터링
- 쓰로틀링 및 디바운싱

---

## 🔖 참고

- TMDB 공식 문서: https://developer.themoviedb.org/
- TMDB API 키는 절대 외부에 노출되지 않도록 주의하세요.

---

## 🧑‍💻 커밋 규칙 안내

- 기능별로 **하나의 주제당 하나의 커밋**  
  예시:  
  - `feat: TMDB API 연결`
  - `feat: 영화 카드 UI 구현`
  - `feat: 영화 검색 기능 추가`

---

🎉 이제, 손코딩으로 멋진 영화 앱을 직접 만들어보세요!
