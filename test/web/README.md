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

## import 형식 - CAd_T02.task.html

    1. 주석 템플릿
        + 최상위 요소는 1개만 만드는 규칙 

    2. 스크립트 템플릿

    3. 템플릿
        + 쉐도우돔 처리는 putElement 위치에 적용하는게 맞음

    4. 텍스트 (String 형태의 요소)

    5. 요소 (요소 원본 지정 방식)

    - 쉬도우돔 (ShadowDOM)
        + 쉬도우돔 처리시 putElement 를 독립적으로 구성해야함

        + 쉬도우돔 사용시 <Style>태그로  내부에 나열해서 이용 
          (내부에 *link src="*.css" 사용 못함)

        + putElement 미 지정시 쉬도우 돔 사용 못함  (우회방법은 있으나 불필요)

        + setShadow(true); 사용시  putElement 지정후 사용 가능, update 호출 전에 사용

## 슬롯 지정 방식에 비교 - CAd_T03.task.html
    
    1. 레코드-O | 레코드슬롯-X | 컬럼슬롯-O

    2. 레코드-O | 레코드슬롯-X | 컬럼슬롯-X

    3. 레코드-X | 레코드슬롯-X | 컬럼슬롯-O

    4. 레코드-X | 레코드슬롯-X | 컬럼슬롯-X
    
    - 예제 방향
        + 동일한 템플릿으로 슬롯의 다양한 적용 방식

    - 주의 사항
        + setSlot("tr")의 선택자는 setTableSlot()의 하위부터 선택 가능함
          (*기본템플릿 사용시)
 

## 컬럼-콜백  - CAd_T04.task.html
    
    - 컬럼 콜백

    - 콜백 속성 제한

    - 제목에 컬럼 타이틀 제공

        + 주의! : initTableMapping() 매핑테이블 초기화 할경우 (table을 이중으로 사용하는 경우)
                * CD.update(..) 호출할 경우 매핑을 꼭! 명시해 줘야 함

        + 주의! : 복수의 테이블을 update 할 경우 (내부 템플릿 이용시) setSlot(설정) 완료후
                 하위에서 일괄 호출해야 임의의 템플릿 조각이 정리됨

    - 컬럼서브슬롯 콜백


## DS의 다중 테이블 - CAd_T05.task.html

    - 복수 ds, ds의 멀티테이블

## 이벤트 연동 - CAd_T06.task.html

    - (이벤트) 버튼 클릭 -> 데이터셋 추가 -> 컨테이너 update

    - (이벤트) 컨테이너 컬럼 클릭 -> 데이터셋 삭제 -> -> 컨테이너 update

    - 공통
        + 매핑테이블 이용함 
            * CD2.updateCommit(ds1, "list2", "list");

        + CD2.initTableMapping(); : 매핑테이블 초기화 (*동일 테이블 사용시)

    - 주의사항
        + update 호출 전에 onUpdated 이벤트 function() 을 등록해야함

        + CD.onUpdated = funciton 에서 커밋처리 하면 갱신 안됨

        + 커밋 시점으로 갱신 여부를 반영 결정


## 템플릿 형식 - CAd_T07.task.html

    - C.Ad 생성후 템플릿 등록 방식
    
    - C.Ad 생성시 템플릿 선택자 지정 방식

    - 내부 템플릿 이용  (기존 예제 많음) 

    - 외부 템플릿 이용

    - 공통
        + 주석형 템플릿 이용 (IE 호환성 문제)

    - 디자인의 다양한 사례 검토

        + 테이블 TD 안에 li 목록 배치 할 경우 - OK

        + 




## 트렌젝션 사용 - CAd_T08.task.html

    - 커밋 : 

    - 롤백 : 

    - 커밋 + 롤백  + 커밋 : 


## 데이터셋 변형 - CAd_T09.task.html

    - 추가, 중간에 추가, 삭제, 수정(방식)

## 동적 템플릿  vs  정적 템플릿 - CAd_T10.task.html

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


## 다중 컨테이너 연동 - CAd_T11.task.html

    - 독립 다중 컨테이너 

    - 컬럼 콜백 다중 컨테이너

## 주요 예제 (List, View, Form) - CAd_T12-VFL.task.html

> View
    - 단일 Row, 요소값

> Form
    - 단일 Row, 속성값

> List 
    - 복수 Row, 요소값


## 컨테이너 배포 방식 - CAd_T13.task.html

    - 원본 요소에 기능 적용 (정적템플릿)
    
    - 정적 템플릿 방식

    - 동적 템플릿 방식 (콜백 + 컬럼속성제한)

## 이슈 및 검토 - CAd_T14.task.html

    - 목록 (리스트+페이지)

    - 우편번호, 지역바인딩 요소, 체크박스

    - NPM 재귀적 사용 방식 검토 (이벤트 & 콜백활용 ?)

    - 멀티 DS & 멀티 테이블 활용방안


## 기타 - CAd_T15.task.html

    - single row 제약조건

    - update 테이블명 매핑

    - Row 제한

## 이후 작업

    - select 적용 : html 내용에 => 데이서 추출 기능

> 호출방식   => 오히려 혼란의 소지 이후에 검토
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