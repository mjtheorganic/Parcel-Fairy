# 🎯 GitHub Pages 5분 배포 가이드

## 📦 준비된 파일

다음 파일들을 GitHub에 업로드하세요:

```
github-pages/
├── index.html          ← 메인 웹페이지
├── style.css           ← 디자인
├── app.js              ← 기능 로직
├── README.md           ← 프로젝트 설명
└── GITHUB-DEPLOY.md    ← 상세 배포 가이드
```

## 🚀 배포 3단계

### 1️⃣ 저장소 만들기 (1분)

1. https://github.com 로그인
2. 우측 상단 `+` → `New repository`
3. 저장소 이름: `delivery-tracker`
4. Public 선택
5. `Create repository` 클릭

### 2️⃣ 파일 업로드 (2분)

**방법 A: 웹에서 업로드 (초보자 추천)**
```
1. `uploading an existing file` 클릭
2. 5개 파일 모두 드래그 앤 드롭
3. Commit message: "Initial commit"
4. `Commit changes` 클릭
```

**방법 B: Git 명령어 (개발자용)**
```bash
cd github-pages
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/delivery-tracker.git
git push -u origin main
```

### 3️⃣ GitHub Pages 활성화 (1분)

1. 저장소 → `Settings` 탭
2. 왼쪽 메뉴 → `Pages`
3. Source:
   - Branch: `main`
   - Folder: `/ (root)`
4. `Save` 클릭
5. 1-2분 대기

## 🌐 접속 주소

```
https://YOUR_USERNAME.github.io/delivery-tracker
```

## ✅ 체크리스트

배포 전:
- [ ] GitHub 계정 있음
- [ ] 5개 파일 준비 완료
- [ ] 인터넷 연결 확인

배포 후:
- [ ] 저장소 생성 완료
- [ ] 파일 업로드 완료
- [ ] GitHub Pages 활성화
- [ ] 웹사이트 접속 확인

## 🎉 완료!

웹사이트가 성공적으로 배포되었습니다!

**다음 단계:**
1. 친구들과 공유하기
2. 기능 추가하기
3. 디자인 커스터마이징

**문제가 있나요?**
→ `GITHUB-DEPLOY.md` 파일의 "문제 해결" 섹션 참고

---

**Happy Deployment! 🚀**
