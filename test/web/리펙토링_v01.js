{
    /**
     * 컨테이너 슬롯 설정 - O
     */
    var cAd = new ContainerAdapter("#put");
    cAd.template.importSlot("#tables", "table", [
        {
            name: "head",
            selector: "thead",
        },
        {
            name: "body",
            selector: "tbody"
        }
    ]);

    cAd.setContainer("head");
    cAd.containers["head"].record.importSlot("#tr", "tr");
    cAd.containers["head"].column.importSlot("#thead", "th", "th");

    cAd.setContainer("body");
    cAd.containers["body"].record.importSlot("#tr", "tr");
    cAd.containers["body"].column.importSlot("#thead", "th", "th");

    cAd.update(ds, "head", "Area");
    cAd.update(ds, "body", "Job");
}
// ######################################################
{
    /**
     * 컨테이너 슬롯 설정 - X
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head");
    cAd.containers["head"].record.importSlot("#tr", "tr");
    cAd.containers["head"].column.importSlot("#thead", "th", "th");

    cAd.setContainer("body");
    cAd.containers["body"].record.importSlot("#tr", "tr");
    cAd.containers["body"].column.importSlot("#thead", "th", "th");

    // (데이터셋, 테이블명 [, 컨테이너테이블명,  붙임요소 | 붙임선택자 ])
    cAd.update(ds, "Area", "head", "#put1");
    cAd.update(ds, "Job", "body", "#put2"); 

    cAd.tables["Area"].element; // <= 위치참조
    cAd.tables["Job"].dataBind();
}
// ######################################################
{
    /**
     * 컨테이너 슬롯 설정 - X :: 상위 템플릿 이용 방식
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head", "#table1");
    cAd.containers["head"].record.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].record.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    // (데이터셋, 테이블명 [, 컨테이너테이블명,  붙임요소 | 붙임선택자 ])
    cAd.update(ds, "Area", "head", "#put1");
    cAd.update(ds, "Job", "body", "#put2"); 

    cAd.tables["Area"].element; // <= 위치참조
    cAd.tables["Job"].dataBind();   // 이후 갱신할 경우
}
// ######################################################
{
    /**
     * - 업데이트 위치
     * - dataSoucre, 테이블명관리
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head", "#table1");
    cAd.containers["head"].record.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].record.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    cAd.tableSlot(null, [
        {
            container: "head",
            name: "Area",       /* 이름을 테이블명을 직접지정 */
            table: ds.tables["Area"],
            element: elem
        },
        {
            container: "body",
            name: "Job",
            table: ds.tables["Job"],
            selector: "#bcode"
        },
    ], "#put1");

    cAd.tables["Job"].dataBind();       // 테이블 바인딩 
    cAd.dataBind();                     // 전체 바인딩
}
// ######################################################
{
    /**
     * 동적 컨테이너 + 인스턴스 방식
     */
    var cAd = new ContainerAdapter();
    
    cAd.setContainer("head", "#table1");
    cAd.containers["head"].record.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].record.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    // slotBind() 자동 처리됨
    cAd.tableSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",  
            put: "#abc",
        }
    ]);

    // 접근
    cAd.tables["Area"].dataBind(); 
    cAd.tables["Job"].dataBind();
    cAd.tables["Area"].element;
    cAd.tables["Job"].element;
}
// ######################################################
{
    /**
     * link 호출
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head", "#table1");
    cAd.containers["head"].record.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].record.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    // slotBind() 자동 처리됨
    cAd.tableSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",  
            put: "#abc",
        },
        {
            container: "body",
            attr: {type: "radio"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",  
            put: "#abc",
        }
    ]);

    // cAd.linkSlot();

    // // add(컨테이너, 사용처);
    // cAd.linkMapping.add(
    //     {attr: {type: "select"}},   // 테이블 속성
    //     {attr: {type: "select"}}    // 컬럼 속성
    // );
    // cAd.linkMapping.add(
    //     {container: "head"},
    //     {name: "p1_name"}
    // );
    // cAd.linkMapping.add(
    //     {container: "head"},
    //     {name: "p1_name"}
    // );

    /**
     * 사용 컨테이너
     */
    var CD = new ContainerAdapter(); 
    CD.setContainer("MemReg", "tbody");   
    CD.container["MemReg"].column.setSlot("td",  [
        {
            name: "p1_name", 
            selector: "p1",
            link: cAd
        },
        {
            name: "p2_name", 
            selector: "p2",
            link: {
                name: cAd,
                callback: function(obj) {
                    var dr = this.dataSource.newRow();
                    this.dataSource.rows.clear();
                    dr[obj.value] = true;
                    this.dataSource.rows.add(dr);
                }
            }
        }
    ]);
    CD.update(ds, "Member", "MemReg", "#div" );
}
// ######################################################
{
    /**
     * 코드명령규칙 로딩 관련....
     */
    var CD = new ContainerAdapter(); 
    CD.setContainer("MemReg", "tbody");   
    CD.container["MemReg"].column.setSlot("td",  [
        {
            name: "p1_name", 
            selector: "p1",
            link: cAd
        },
        {
            name: "p2_name", 
            selector: "p2",
            link: {
                name: cAd,
                callback: function(obj) {
                    var dr = this.dataSource.newRow();
                    this.dataSource.rows.clear();
                    dr[obj.value] = true;
                    this.dataSource.rows.add(dr);
                }
            }
        }
    ]);
    CD.update(ds, "Member", "MemReg", "#div" );    
}