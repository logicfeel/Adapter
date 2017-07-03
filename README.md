# Adapter


## 용도 
    - DataAdapter : node + web  (공통사용)

    - AjaxAdapter : web

    - ContainerAdpater : web


## 종속성

    - LCommon

        + LCommon.web.js : 1.0.x

        + LCommon.js : 1.0.x
    
    - DataSet : 1.0.x


## 디렉토리 구조

    - external 
        + LCommon.web.js

        + LCommon.js

        + DataSet.js

    - src : 원본 소스

        + DataAD.js : 어뎁터 부모(공통) 클래스

        + ContainerAD.js : 컨테이너 어뎁터 클래스

        + AjaxAD.js : AJAX 어뎁터 클래스
        

    - test : 디버깅 & 테스트
        + web : 브라우저 테스트 디버깅 => 개발자도구 (IE, 크롬)

        + node : 테스트 디버깅 => VS.Code

    - dist  : 배포
        + Adapter.js  => 전체 병합 묶음 파일 
         (*버전별로 묶음 구성이 달라질 수 있음)

        + AjaxAdapter.js : AJAX 어뎁터 전용  (공통과 병합)

        + ContainerAdapter.js : AJAX 어뎁터 전용  (공통과 병합)

    - api : 문서
        + ~.html : html 문서
        
        + ~.md : github 문서 


## API

    - DataAdapter 클래스 :

    - AjaxAdapter 클래스 :

    - ContainerAdapter 클래스 :


## 개발 시나리오

    - [x] master -> 개발 -> [태그]
    
    - [ ] master -> 브런치 -> 개발 -> 병합 -> [태그]
        (* 분리 개발이 필요한 경우)

## 태그명 규칙

    - 0.0.0 : 버전명 표기  (주버전.기능버전.패치버전)
    
        + 초기 개발시 주버전 "0" 으로 시작

        + 주버전 "1" 번부터 태그 붙임

## 브런치 규칙

    - 논리적 관점 명칭 지정

    - 브런치는 병합을 기본 병합을 목표로함
        * 파일 및 테스트 디버깅 분리의 목적

## 버전 규칙

    - 버전은 태그명으로 배포함

    - 규칙 : X.X.X   