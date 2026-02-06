# 🚀 GitHub Pages 배포 가이드

초보자도 5분 만에 웹사이트를 만들 수 있습니다!

## 📋 사전 준비

1. ✅ GitHub 계정 (없으면 https://github.com 에서 가입)
2. ✅ 다운로드한 프로젝트 파일들

## 🎯 배포 단계

### 1단계: GitHub 저장소 만들기

1. **GitHub에 로그인**
   - https://github.com 접속
   - 로그인

2. **새 저장소 생성**
   - 우측 상단 `+` 버튼 클릭
   - `New repository` 선택

3. **저장소 설정**
   ```
   Repository name: delivery-tracker
   Description: 통합 택배 배송 조회 시스템
   Public 선택
   ✅ Add a README file (체크 안 함)
   Create repository 클릭
   ```

### 2단계: 파일 업로드하기

#### 방법 A: 웹에서 업로드 (가장 쉬움)

1. **파일 업로드**
   - 저장소 페이지에서 `uploading an existing file` 클릭
   
2. **파일 선택**
   - 다음 파일들을 드래그앤드롭:
     - `index.html`
     - `style.css`
     - `app.js`
     - `README.md`
   
3. **커밋**
   - Commit message: `Initial commit`
   - `Commit changes` 버튼 클릭

#### 방법 B: Git 사용 (추천)

```bash
# 1. 프로젝트 폴더로 이동
cd github-deploy

# 2. Git 초기화
git init

# 3. 파일 추가
git add .

# 4. 커밋
git commit -m "Initial commit"

# 5. GitHub 연결
git remote add origin https://github.com/YOUR_USERNAME/delivery-tracker.git

# 6. 푸시
git push -u origin main
```

> ⚠️ `YOUR_USERNAME`을 본인의 GitHub 아이디로 변경하세요!

### 3단계: GitHub Pages 활성화

1. **Settings 이동**
   - 저장소 페이지에서 `Settings` 탭 클릭

2. **Pages 설정**
   - 왼쪽 메뉴에서 `Pages` 클릭
   
3. **소스 설정**
   ```
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   Save 버튼 클릭
   ```

4. **대기**
   - 1-2분 정도 기다리면 배포 완료
   - 페이지 새로고침

### 4단계: 웹사이트 접속

배포가 완료되면 다음 주소로 접속 가능:

```
https://YOUR_USERNAME.github.io/delivery-tracker
```

🎉 **축하합니다! 웹사이트가 완성되었습니다!**

## 📱 실제 사용 예시

### 예시 1: 자동 조회
```
1. https://yourusername.github.io/delivery-tracker 접속
2. "🔍 자동 조회" 탭 클릭
3. 전화번호 입력: 010-1234-5678
4. "배송 정보 자동 조회" 클릭
5. 랜덤 배송 정보 생성 (시뮬레이션)
```

### 예시 2: 수동 추가
```
1. "✏️ 수동 추가" 탭 클릭
2. 정보 입력:
   - 쇼핑몰: 네이버쇼핑
   - 택배사: CJ대한통운
   - 상품명: 무선 이어폰
   - 송장번호: 123456789012
3. "배송 추가하기" 클릭
```

## 🔄 업데이트 방법

파일을 수정한 후 다시 업로드:

### 웹에서 수정

1. GitHub 저장소에서 수정할 파일 클릭
2. 연필 아이콘(Edit) 클릭
3. 수정 후 `Commit changes` 클릭
4. 1-2분 후 자동 배포

### Git으로 수정

```bash
# 1. 파일 수정

# 2. 변경사항 확인
git status

# 3. 변경사항 추가
git add .

# 4. 커밋
git commit -m "Update: 기능 개선"

# 5. 푸시
git push
```

## 🎨 커스터마이징

### 1. 색상 변경

`style.css`에서 다음 부분 수정:

```css
/* 메인 그라데이션 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 원하는 색상으로 변경 */
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

### 2. 로고 추가

`index.html`의 `<h1>` 태그 수정:

```html
<h1>
    <img src="logo.png" alt="로고" style="height: 50px; vertical-align: middle;">
    통합 택배 배송 조회
</h1>
```

### 3. 타이틀 변경

`index.html`의 `<title>` 태그 수정:

```html
<title>나만의 택배 조회 시스템</title>
```

## 🐛 문제 해결

### Q1. 페이지가 안 보여요

**확인사항:**
1. Settings > Pages에서 URL 확인
2. 1-2분 기다린 후 새로고침
3. 브라우저 캐시 삭제 (Ctrl+Shift+R)

**해결:**
```
Settings > Pages에서 
Source를 다시 선택하고 Save
```

### Q2. 파일 업로드가 안 돼요

**해결:**
1. 파일 크기 확인 (25MB 이하)
2. 파일 이름에 한글 있으면 영어로 변경
3. 인터넷 연결 확인

### Q3. Git push가 안 돼요

**해결:**
```bash
# 계정 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 재시도
git push -u origin main
```

## 🌟 추가 기능

### 도메인 연결

무료 도메인 또는 구매한 도메인 연결:

1. **Settings > Pages**
2. **Custom domain** 입력
3. DNS 설정 (도메인 제공업체)

### SSL (HTTPS) 자동 적용

GitHub Pages는 자동으로 HTTPS 적용!

## 📚 참고 자료

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Git 기초 가이드](https://git-scm.com/book/ko/v2)
- [Markdown 문법](https://www.markdownguide.org/)

## 💡 팁

### 1. README.md 꾸미기

```markdown
# 프로젝트 제목

![스크린샷](screenshot.png)

## 배지 추가
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-green)
```

### 2. 방문자 수 확인

[GitHub Stats](https://github.com/anuraghazra/github-readme-stats) 사용

### 3. 소셜 공유

```html
<!-- index.html에 메타 태그 추가 -->
<meta property="og:title" content="통합 택배 배송 조회">
<meta property="og:description" content="네이버, 쿠팡, 올리브영 배송 조회">
<meta property="og:image" content="thumbnail.png">
```

## 🎯 다음 단계

1. ✅ GitHub Pages 배포 완료
2. 📱 친구들과 공유
3. 🔧 기능 추가 및 개선
4. 🌐 실제 API 연동 (Vercel/Netlify)

## 📞 도움이 필요하신가요?

- [GitHub Issues](https://github.com/YOUR_USERNAME/delivery-tracker/issues)
- [GitHub Discussions](https://github.com/YOUR_USERNAME/delivery-tracker/discussions)

---

**Happy Coding! 🚀**
