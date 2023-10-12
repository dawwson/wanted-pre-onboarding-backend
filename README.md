# 원티드 프리온보딩 백엔드 인턴십 - 선발과제

## 👋 지원자 소개
이름 : 신은수  
이메일 : shines1427@gmail.com

## 🚀 Intro: 프로젝트 소개
```
기업 채용을 위한 웹 서비스 API 서버
```

### 실행 방법
#### 1. 테스트 데이터 생성
```
npm run seed
```
#### 2. 개발 버전 서버 실행
```
npm run start:dev
```

## 🛠️ 기술 스택
- Node v18
- NPM v9
- Nest.js v10
- TypeORM v0.3
- PostgreSQL v15.4

## ✉️ Git commit 메시지 컨벤션
```
Build : 빌드 업무 수정
Chore : 프로덕션 코드와 무관한 자잘한 수정
Comment : 주석 추가 및 수정 
Docs : 문서 수정 
Feat : 새로운 기능 추가  
Add: 기능 관련 이외 코드나 라이브러리 추가
Fix : 버그 수정 
Style : 코드 스타일, 코드 포맷팅 
Refactor : 코드 리팩토링 
Rename : 파일/폴더 이름 수정 및 위치 변경 
Remove : 파일 삭제 
Test : 테스트 코드 추가 및 수정
```

## 🌳 요구사항 분석 및 구현과정
### 📝 요구사항 분석
#### 1. 기능 목록
- [X] 채용공고 등록 `기업회원 only`
- [X] 채용공고 수정 `기업회원 only`
- [X] 채용공고 삭제 `기업회원 only`
- [X] 채용공고 목록 조회
  - [X] 채용공고 검색 ~~(선택사항 & 가산점)~~
- [X] 채용공고 상세 조회 
  - [X] 채용 내용이 추가적으로 담겨 있음
  - [X] 해당 회사가 올린 다른 채용공고 포함 ~~(선택사항 & 가산점)~~
- [X] 채용공고 지원 `일반회원 only` ~~(선택사항 & 가산점)~~
#### 2. 도메인 모델 설계
- 기업회원은 여러 개의 채용 공고를 등록할 수 있다.
- 기업회원은 등록한 채용공고를 수정, 삭제할 수 있다.
- 모든 회원은 채용공고 조회, 검색할 수 있다.
- 개인회원은 여러 채용공고에 지원할 수 있다.
- 회사는 한명의 기업회원을 가진다.(추가한 가정)

## 📝 ERD 설계(작성중...)

## 📝 REST API 설계(작성중...)
### 주요 상태 코드
|         **HTTP 상태코드**         | **설명**                                                               |
|:-----------------------------:|----------------------------------------------------------------------|
|          200<br/>OK           | 서버가 클라이언트의 요청을 성공적으로 수행하였음을 의미합니다.                                   |
|        201<br/>Created        | 서버가 클라이언트의 요청을 성공적으로 수행 후 리소스가 생성되었음을 의미합니다.                         |
|      204<br/>No Content       | 서버가 성공적으로 리소스를 삭제하였으며, 응답 바디가 없음을 나타냅니다.                             |
|      400<br/>Bad Request      | 서버가 클라이언트 오류(잘못된 요청 구문 등)를 감지해 요청을 처리할 수 없거나, 하지 않는다는 것을 의미합니다.      |
|     401<br/>Unauthorized      | 클라이언트 오류 상태 응답 코드는 해당 리소스에 유효한 인증 자격 증명이 없기 때문에 요청이 수행되지 않았음을 나타냅니다. |
|       403<br/>Forbidden       | 서버에 요청이 전달되었지만, 권한 때문에 거절되었음을 의미합니다.                                 |
| 500<br/>Internal Server Error | 	요청을 처리하는 과정에서 서버가 예상하지 못한 상황에 놓였다는 것을 나타냅니다.                        |

### 일반적인 성공 응답 형식
- 예외적인 케이스도 있으니, 자세한 내용은 각 API에서 확인 가능

| Name    | Type            | Description             |
|---------|-----------------|-------------------------|
| message | string          | 성공 메세지                  |
| 자원이름    | json or json[ ] | 요청에 대한 반환 데이터(없으면 빈 배열) |

#### 예시
```json
{
  "message": "자원이 성공적으로 등록되었습니다.",
  "jobPostings": {
    "id": 123
  }
}
```

### 오류 응답 형식
| Name       | Type   | Description |
|------------|--------|------------|
| message    | string | 에러 메세지     |
| error      | string or string[ ] | 에러 내용      |
| statusCode | string | HTTP 상태 코드 |

#### 예시
```json
{
  "message": [
    "reward must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```
<br>

---

<br>

### 1. 채용공고 등록 
- 채용공고를 등록한다. `기업회원 only`

**Request URL**
- `Authorization` 헤더에 회원 `DB Id`를 담아서 보낸다.
```
POST /job-postings
Authorization: userId={회원 DB Id}
Content-Type: application/json
```

**Request Body**

| Name |  Type  | Description | Required |
|------------|:------:|-------|:--------:|
| jobPosition| string | 채용 포지션 |    O     |
|description| string | 채용 공고 내용 |    O     |
|reward| number | 채용 보상금(단위: 원) |    O     |
|skill| string | 사용 기술 |    O     |

**Response Body**

| Name |  Type  | Description    | Required |  
|------|:------:|----------------|:--------:|  
| id   | number | 생성된 채용공고 `DB Id` |    O     |

**Response Body 예시**
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "채용공고가 성공적으로 등록되었습니다.",
  "jobPosting": {
    "id": 123
  }
}
```

<br>

---

<br>

### 2. 채용공고 수정 
- 채용 공고를 수정한다. `기업회원 only`

**Request URL**
- `Authorization` 헤더에 회원 `DB Id`를 담아서 보낸다.
```
PATCH /job-postings/{id}
Authorization: userId={사용자 DB Id}
Content-Type: application/json
```

**Request Path Variable**

|Name| Description     |Required|
|--|-----------------|:--:|
|id| 수정할 채용 공고 `DB Id` |O|

**Request Body**

|Name|Type| Description       | Required |
|------------|:------:|-------------------|:--------:|
| jobPosition| string | 수정할 채용 포지션        |    X     |
|description| string | 수정할 채용 공고 내용      |    X     |
|reward| number | 수정할 채용 보상금(단위: 원) |    X     |
|skill| string | 수정할 사용 기술         |    X     |

**Response Body**

|Name|Type|Description|Required|  
|--|:--:|--|:--:|
|id|number|수정된 채용공고 `DB Id`|O|

**Response Body 예시**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "채용공고가 성공적으로 업데이트 되었습니다.",
  "jobPosting": {
    "id": 123
  }
}
```

<br>

---

<br>

### 3. 채용공고 삭제
- 채용 공고를 삭제한다. `기업회원 only`

**Request URL**
- `Authorization` 헤더에 회원 `DB Id`를 담아서 보낸다.
```
DELETE /job-postings/{id}
Authorization: userId={사용자 DB Id}
```

**Request Path Variable**

|Name| Description     |Required|
|--|-----------------|:--:|
|id| 삭제할 채용 공고 `DB Id` |O|

**Response**
```
HTTP/1.1 204 No Content
```

<br>

---

<br>

### 4. 채용공고 목록 조회 및 검색
- 채용 공고를 조회하거나 검색한다.
- **회사 이름, 사용 기술**로 검색 가능

**Request URL**
- `Authorization` 헤더에 회원 `DB Id`를 담아서 보낸다.
- 모든 목록을 조회할 경우 `Query parameter`를 포함시키지 않는다.
```
GET /job-postings?search={검색_내용}
Authorization: userId={사용자 DB Id}
```

**Request Query Parameter**

| Name   | Description | Required |
|--------|-----------|:--------:|
| search | 검색 내용     |    X     |

**Response Body(Array)**

| Name           |  Type  | Description |Required|  
|----------------|:------:|-------------|:--:|
| id             | number | 채용공고 `DB Id`  |O|
| companyName    | string | 회사 이름       |O|
| companyCountry | string | 회사 국가       |O|
| companyRegion  | string | 회사 지역       |O|
| jobPosition    | string | 채용 포지션      |O|
| reward         | number | 채용 보상금      |O|
| skill          | string | 사용 기술       |O|

**Response Body 예시**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "모든 채용공고가 성공적으로 조회되었습니다.",
  "jobPostings": [
    {
      "id": 123,
      "companyName: "원티드",
      "companyCountry": "한국",
      "companyRegion": "서울",
      "jobPositon": "백엔드 개발자",
      "reward": 1000000,
      "skill": "Node.js"
    },
    {...}
  ]
}
```

<br>

---

<br>

### 5. 채용공고 상세 조회
- 회사가 올린 다른 채용공고를 포함하여 채용공고를 상세 조회한다.

**Request URL**
- `Authorization` 헤더에 회원 `DB Id`를 담아서 보낸다.
```
GET /job-postings/{id}
Authorization: userId={사용자 DB Id}
```

**Request Path Variable**

|Name| Description     |Required|
|--|-----------------|:--:|
|id| 조회할 채용 공고 `DB Id` |O|

**Response Body**

| Name             |   Type    | Description                             |Required|  
|------------------|:---------:|-----------------------------------------|:--:|
| id               |  number   | 채용공고 `DB Id`                              |O|
| company          |  Company  | 채용공고 올린 회사                              |O|
| jobPosition      |  string   | 채용 포지션                                  |O|
| description      |  string   | 채용 내용                                   |O|
| reward           |  number   | 채용 보상금                                  |O|
| skill            |  string   | 사용 기술                                   |O|
| otherJobPostings | number[ ] | 해당 회사가 올린 다른 채용공고 `DB Id` 리스트<br/>(없으면 빈 배열) |O|

- **Company**

| Name    |   Type    | Description |Required|  
|---------|:---------:|------------|:--:|
| id      |  number   | 회사 `DB Id`   |O|
| name    |  string   | 회사 이름      |O|
| country |  string   | 회사 국가      |O|
| region  |  string   | 회사 지역      |O|

**Response Body 예시**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "채용공고가 성공적으로 조회되었습니다.",
  "jobPosting": {
    "id": 123,
    "company": {
      "id": 10,
      "name": "원티드",
      "country": "한국",
      "region": "서울",
    }
    "jobPositon": "백엔드 개발자",
    "descripton": "채용 웹 서비스를 개발합니다.",
    "reward": 1000000,
    "skill": "Node.js"
  },
  "otherJobPostings": [124, 125, 126]
}
```

<br>

---

<br>

### 6. 지원하기 
- 채용 공고에 지원한다. `개인회원 only`

**Request URL**
- Authorization 헤더에 사용자의 `DB Id`를 담아서 보낸다.
```
POST /job-applications
Authorization: userId={사용자 DB Id}
Content-Type: application/json
```

**Request Body**

| Name         |  Type  | Description       | Required |
|--------------|:------:|-------------------|:--------:|
| jobPostingId | number | 지원할 채용 공고 `DB Id`   |    O     |

**Response Body**

|Name|Type| Description |Required|  
|--|:--:|-------------|:--:|
|id|number| 지원내역 `DB Id`  |O|

**Response Body 예시**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "지원내역이 성공적으로 등록되었습니다.",
  "jobApplication": {
    "id": 123
  }
}
```

<br>

---

## 코드 아키텍처 설계


## 테스트


|Name|Type|Description|Required|  
|--|:--:|--|:--:|  
