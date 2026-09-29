# OFF — Your day ends here.

잠들기 전 마음에 남은 생각을 내려놓고, 짧게 이완한 뒤 화면을 끄는 한국어 모바일 웹앱입니다. 첨부 명세서의 HTML/CSS/Vanilla JavaScript 구성을 따릅니다.

## 실행

Node.js 22 이상. 외부 패키지를 설치하지 않아도 실행됩니다.

```sh
# 실제 AI 없이 전체 흐름 체험 (규칙 기반, 화면에 체험 모드 표시)
OFF_DEMO=true node server.mjs
# http://127.0.0.1:4174
```

실제 AI를 사용할 때는 `.env.example`을 `.env.local`로 복사하고 `AI_API_KEY`에 본인의 키를 넣습니다. 키를 브라우저나 채팅에 입력하지 마세요.

```sh
node --env-file=.env.local server.mjs
```

- `AI_API_KEY`: 서버 전용 OpenAI API 키
- `AI_MODEL`: 기본 `gpt-4.1-mini`; 계정에서 사용할 수 있는 Structured Outputs 지원 모델로 변경 가능
- `OFF_DEMO`: `true`일 때 명시적 체험 모드. Production에서는 무시
- `PORT`: 로컬 포트, 기본 4174

이 컴퓨터의 Codex 미리보기는 `http://127.0.0.1:4174`에서 실행합니다. 서버를 종료하면 로컬 링크도 종료됩니다. `시작.command`로 다시 실행할 수 있습니다.

## 사용자 흐름

생각 입력 → 정리 결과 확인·수정 → 3분 호흡 / 몸 이완 / 고요 → 사운드 → 취침 → 다음 날 확인.

- 2,000자 입력, 400ms 자동 저장, 이탈 시 즉시 저장
- 내일 / 나중 / 내려놓기 분류, 항목 문구 수정·이동·삭제
- 4초 들숨 + 2초 멈춤 + 6초 날숨, 일시정지 및 진행 복원
- 5개 첨부 MP3, 직접 재생·일시정지·종료, 마지막 선택 기억
- 10/20/30/60분 재생 타이머, 클립 반복
- 아침 할 일 완료·삭제·나중으로 이동, 지난밤 주관적 피드백
- 이전 날짜의 세션이 있으면 현지 시각 05–17시에 아침 화면. 상단 버튼으로 수동 확인 가능
- 브라우저가 지원하면 한국어 음성 입력
- AI 실패 시 원문을 하나의 내일 메모로 저장, 오디오 실패 시 소리 없이 마무리

## 파일 구조

- `index.html`, `styles.css`: 앱 구조와 Midnight UI
- `app.js`: 화면 흐름, 초안, 정리·아침 화면
- `storage.js`: LocalStorage와 오류 안내
- `winddown.js`, `sound.js`: 호흡·이완 및 오디오
- `data.js`: 사운드 정보, 명시적 체험용 분류
- `contract.js`: AI 출력 스키마와 양쪽 검증
- `api/thoughts/analyze.js`: Vercel 서버리스 함수
- `server.mjs`: 로컬 정적 파일·API 서버 (공개 파일 허용 목록 사용)
- `assets/audio/`: 첨부 원본 복사본 5개
- `scripts/build.mjs`: 정적 배포 파일 생성
- `tests/api.test.js`: 서버 검증·오류·음원 메타데이터 테스트
- `QA.md`: 실제 검증 범위와 미검증 항목

## AI 구조와 보안

브라우저는 `POST /api/thoughts/analyze`로 입력을 전송합니다. 서버만 키를 읽고 OpenAI Responses API를 호출합니다. `store:false`, Structured Outputs, 서버·클라이언트 응답 검증, 서버 15초 / 클라이언트 20초 제한을 적용했습니다.

공식 참조: https://developers.openai.com/api/docs/guides/structured-outputs

JSON 요청, 1–2,000자, 요청 방식 검증. 오류에는 내부 정보가 포함되지 않습니다. 서버 인스턴스별 1분 8회 제한은 MVP 보호 장치이며 여러 인스턴스를 통합하는 한도는 아닙니다. 공개 운영 시 Vercel Firewall에서 추가 요청 제한과 API 지출 한도를 설정해야 합니다.

입력과 AI 출력은 text node/input value로 렌더링합니다. 입력 원문 로깅·분석 수집·서버 DB는 없습니다. 명확한 고위험 문구는 별도 도움 안내 화면으로 이동합니다. 간단한 키워드 검사와 AI 분류는 모든 위험을 감지하지 못하며, 의료 판단을 하지 않습니다.

## 개인정보와 로컬 저장

작성한 내용과 세션은 `off:draft`, `off:session:{id}`, `off:session:index`, `off:current`, `off:last-sound`에 저장됩니다. 브라우저 데이터 삭제 시 사라지며, 다른 기기와 동기화되지 않습니다. LocalStorage는 암호화 저장소가 아닙니다.

정리를 누를 때만 필요한 입력이 서버와 AI 제공자에게 전송됩니다. 제공자 측 처리·보관 정책은 별도로 적용됩니다. 음성 기능은 브라우저의 음성 인식 제공자에게 전달될 수 있으며 OFF가 녹음 파일을 보관하지 않습니다.

## 음원 정보

사용자가 제공한 파일을 그대로 연결했습니다. 종류·제목을 확인할 메타데이터가 없어 중립적인 이름을 사용합니다. `duration`은 실제 클립 길이(초)이며 종료 타이머와 구분됩니다.

| 파일 | 클립 길이 | 출처 | 권리 상태 |
| --- | ---: | --- | --- |
| sound-01.mp3 | 15.05초 | user-provided | unverified |
| sound-02.mp3 | 178.94초 | user-provided | unverified |
| sound-03.mp3 | 178.23초 | user-provided | unverified |
| sound-04.mp3 | 191.64초 | user-provided | unverified |
| sound-05.mp3 | 164.08초 | user-provided | unverified |

명세서 §30에 따라 권리 확인 전 Production 빌드는 차단합니다. 로컬/Preview에서 검토한 뒤, 직접 제작이면 `source: 'owned', rights: 'owned'`, 허가된 라이선스라면 `source: 'licensed', rights: 'cleared'`로 근거와 함께 업데이트하세요. 단순히 빌드 통과를 위해 값을 바꾸지 마세요.

## 빌드와 Vercel

```sh
node scripts/build.mjs
node --test tests/*.test.js
```

`dist/`에 공개 파일만 복사되며 키·로컬 서버·테스트는 포함되지 않습니다. GitHub/Vercel 계정 연결 및 원격 배포는 이번 구현에서 수행하지 않았습니다.

1. 이 `off` 폴더를 GitHub 저장소로 올리고 Vercel에서 가져옵니다.
2. Framework Preset은 Other. 저장된 `vercel.json`이 빌드 명령과 출력 디렉터리를 지정합니다.
3. Preview/Production 환경 변수에 `AI_API_KEY`, `AI_MODEL`을 설정합니다. `OFF_DEMO`는 실제 운영에서 사용하지 않습니다.
4. Preview에서 AI 및 실기기 검증을 마칩니다.
5. 음원 권리 확인 및 운영 요청 제한을 설정한 뒤 Production 배포합니다.

## 제한사항

- Service Worker/PWA를 포함하지 않아 완전 오프라인 최초 실행을 보장하지 않습니다. 이미 열린 앱에서는 입력·저장·아침 보기·고요 모드를 사용할 수 있습니다. AI는 온라인 연결이 필요하며 온라인 복귀 후 자동 전송하지 않습니다.
- 오프라인 음원 재생은 브라우저 캐시에 따라 다릅니다.
- 화면 잠금 후 오디오와 타이머는 모바일 OS의 백그라운드 제한을 받습니다. 앱이 다시 활성화되면 종료 시각을 재확인하지만, 웹만으로 백그라운드 종료 시각을 보장하지 않습니다.
- 새로고침 시 자동으로 오디오를 재생하지 않습니다.
- 짧은 원본 음원 반복 구간에 틈이 들릴 수 있습니다. 별도 오디오 편집·크로스페이드는 포함하지 않았습니다.
- 음성 지원/권한은 브라우저마다 다릅니다. 실제 iPhone/Android, 스크린리더, 장시간 재생은 미검증입니다.

## 설계 결정

React 대신 Vanilla JS, DB 대신 로컬 저장, 라이브러리 대신 5개 음원, 자동재생 대신 사용자 제어, 채팅 대신 짧은 확인 흐름을 선택했습니다. 레퍼런스의 어두운 분위기와 플레이어 구성을 참고하되 명세서에 따라 사진·콘텐츠 목록·강한 색상은 사용하지 않았습니다.
