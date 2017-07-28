/**
 * 목록 시나리오
 * - 검색결과 : 임으로 테이블 설정 후 컨테이너 바인딩 가능
 *  + 또는 스키마에서 로딩후 바인딩 가능
 * - 검색목록 : 템플릿 컨테이너 활용
 *  + 입력 : 검색조건 폼 (외부 입력)
 *  + 출력 : 내부 바인딩
 *  + 처리 : 데이터 로딩, 이벤트 매핑 처리
 * 
 * - 페이지 : 
 *  + 입력 : 전체 수, 선택 페이지  (페이지 표시수:설정값)
 *  + 처리 : 외부 컨테이너에 이벤트 등록 함
 * 
 *  + 데이터 테이블이 없는 컨테이너 ?
 *  + 
 * - 처리버튼 : func 만 있는 컨테이너 구현 ? => 통해서 사용하는게 적당할 수도 있음
 */
{
    var CD1 = new ContainerAdapter();
    CD1.addEvent('pageLoad', function(a) {
        C1.update(ds, "event");
    });
    CD1.method.pageLoad = function(a) {
        C1.update(ds, "event");
    };


    var Page = {};
    Page.DataContainer = CD1.tables[0];

    Page.addEvent('next', function(sel) {
        DataContainer.publish('pageLoad', sel);
    });

    Page.addEvent('prev', function(sel) {
        DataContainer.method.pageLoad(sel);
    });


    Page.publish('next', 1);
}

/**
 * 이런식으로 가면 해결됨  !! !OK !OK
 */