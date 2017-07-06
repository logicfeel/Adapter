# 컨테이너 어뎁터 예제

## 일반 테이블 - CAd_T01.task.html
    - 슬록지정 : 메인테이블=레코드 | 레코드-Y |  컬럼서브-Y
    
    - 템 플 릿 : 컨테이너 템플릿 (기본)
    
    - 데이터셋 : 멀티 Row
    
    - 원본형식 : 주석

    - 주의사항 
        + 컬럼은 선택자 뒤로는 슬롯자름(cut)을 하지 않음

        + 컬럼의 속성값 입력시 슬롯선택자 자식의  텍스트노드(Node_Type=3)만 삭제됨

        + 템플릿 선택자는 하나의 요소로 묶여야함

        + 2개 이상 생성시 put 위치 다르게 설정 (같을시 섞임)
            => 오류 잡아야 할듯  => OK 완료
        

> 주요코드
```javascript
// 생성자 ( put선택자, 템플릿선택자 )
var CD = new CAd_T01apter("div", "#temp_1"); 

// 테이블슬롯설정 ( 테이블명, 테이블선택자 )
CD.setTableSlot("body", "tbody");   

// XX슬롯설정 ( 선택자 [, 슬롯선택자] )
CD.tables["body"].record.setSlot("tr");
CD.tables["body"].column.setSlot("td", "td b");

CD.update(ds, "body");

// ##################################

// 테이블슬롯설정 ( 테이블명, 테이블선택자 )
CD.setTableSlot("body2", "tbody");

// XX슬롯설정 ( 선택자 [, 슬롯선택자] )
CD.tables["body"].record.setSlot("tr");
CD.tables["body"].column.setSlot("td", "td b");

// 컨테이너 갱신 ( 데이터셋, 테이블명 [, 매핑테이블명] )
CD.update(ds, "body", "body2");

```

## import 형식 - CAd_T01_T02.task.html
    - 주석 템플릿
        + 최상위 요소는 1개만 만드는 규칙 

    - 스크립트 템플릿

    - 템플릿

    - 요소

    - 텍스트 (String 형태의 요소)

    - 요소 원본 지정 방식



## 슬롯 지정 방식에 비교 - CAd_T01_T03.task.html
    - 메인테이블=레코드  vs  메인테이블!=레코드
    
    - 레코드-O  vs  레코드-X

    - 컬럼-서브슬롯-O  vs 컬럼-서브슬롯-X

## 멀티 테이블 - CAd_T01_T04.task.html

## 이벤트 연동 - CAd_T01_T05.task.html

## 컬럼-콜백  - CAd_T01_T06.task.html
    - 컬럼 속성 제한

## 템플릿 형식 - CAd_T01_T07.task.html
    - 생성시 선택자 vs  템플릿 설정 

## 트렌젝션 사용 - CAd_T01_T08.task.html

## 데이터셋 변형 - CAd_T01_T09.task.html
    - 추가, 중간추가, 삭제

## 동적 템플릿  vs  정적 템플릿 - CAd_T01_T10.task.html
> 정적 템플릿

    - 템플릿 구성에 값(속성/요소)만 적용

    - 사용 시점테 템플릿을 수정사용 가능

    - 구성 디자인에 적용시에 활용 (기존내용, 구성된 html)

    - 컬럼 슬롯명 으로 접근 (UIElement 에서 인터페이스로 제공)

    - 방식 : 컬럼서브슬롯 방식 응용


> 동적 템플릿

    - 컬럼 추가 속성으로 적용

    - 배치 방식 필요 (위치, 순서)

    - 필수사항 존재? 이벤트 비적합?  검토

    - 방식 : 컬럼콜백을 방식 응용

    - 중복 속성 가능, 길이가 동적인 구조에 적합


## 다중 컨테이너 연동 - CAd_T01_T11.task.html

## 주요 예제 (List, View, Form) - CAd_T01_T12.task.html
> View
    - 단일 Row, 요소값

> Form
    - 단일 Row, 속성값

> List 
    - 복수 Row, 요소값

## 컨테이너 배포 방식 - CAd_T01_T13.task.html
    - 원본 요소에 기능 적용 (정적템플릿)
    
    - 정적 템플릿 방식

    - 동적 템플릿 방식 (콜백 + 컬럼속성제한)

## 이슈 및 검토 - CAd_T01_T14.task.html
    - 목록 (리스트+페이지)

    - 우편번호, 지역바인딩 요소, 체크박스

    - NPM 재귀적 사용 방식 검토 (이벤트 & 콜백활용 ?)

    - 멀티 DS & 멀티 테이블 활용방안


## 기타 - CAd_T01_T15.task.html

    - single row 제약조건

    - update 테이블명 매핑

## 이후 작업
    - select 적용

> 호출방식
```javascript
// 객체 설정방식 검토
var CD2 = new CAd_T01apter(
    {
        put: "div",
        template: "#temp_1",
        tables : [
            {
                name: "body",
                selector: "tbody",
                record: "tr",
                column: "td",
                column_slot: "td b"
            }
        ]
    }
); 
```