
    var CD = new ContainerAdapter("div");
    var template = document.querySelector("#temp_1").firstChild;
    CD.template.importTemplate(template);

    CD.insertTable("body", "tbody");

    var mainElem;   // 테스용
    // mainElem = common.querySelecotrOuter(CD._original, "*");
    mainElem = CD.template._original;


    select_elem = mainElem.querySelector("tbody tr");
    CD.tables["body"].recordElement.importTemplate(select_elem, "tr");

    select_elem = mainElem.querySelector("tbody tr td");
    CD.tables["body"].columnElement.importTemplate(select_elem, "td");





    // ###############################

    /**
     * 1안 :원본 템플릿을 활용한 경우
     */

    var CD = new ContainerAdapter("div");  // 붙임 위치 바로 지정
    var template = document.querySelector("#temp_1").firstChild;
    CD.import(template);

    // (테이블명, 셀렉터)
    // 아래 중 선택
    CD.setTableSlot("body", "tbody");   // <== 유력

    // REVIEW: 테이블 아래에서 검색[!유력] vs  전체에서 검색  선택?
    // (선택자 [, 슬롯선택자])
    CD.tables["body"].record.setSlot("tr");
    CD.tables["body"].column.setSlot("td", "p");

    CD.update(ds, "body");


    /**
     * 2안 : 슬롯에 별도 요소 추가할 경우
     */
    var CD = new ContainerAdapter("div");  // 붙임 위치 바로 지정
    var template = document.querySelector("#temp_1").firstChild;
    CD.import(template);

    // (테이블명, 셀렉터)
    CD.setTableSlot("body", "tbody");   // <== 유력

    // 주입위치
    var elem1 = document.querySelector("#elem_1");
    var elem2 = document.querySelector("#elem_2");

    // (요소, 슬롯선택자 | 서브슬롯배열, 콜백 )
    CD.tables["body"].record.importSlot(elem1, "tr");
    CD.tables["body"].column.importSlot(elem2, "p");

    CD.tables["body"].column.importSlot(elem2, [
        {
           name: "p1_name",
           selector: "p"               
        },
        {
           name: "p2_name",
           selector: "span"               
        }
    ]);

    CD.update(ds, "body");


    /**
     * - 선택자 = 슬롯 위치
     * - 선택자 != 슬롯 위치
     * 
     * - 잘라내서 삽입하는 경우
     * - 선택자에 주입하는 경우
     */

    