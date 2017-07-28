/**
 * setSlot	컨테이너 슬롯 설정
 * 
 * tableSlot	데이터컨테이너 슬롯 설정
 * 
 * mappingSlot	데이터컨테이너의 link 매핑 설정
 * 
 */
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
    cAd.containers["head"].row.importSlot("#tr", "tr");
    cAd.containers["head"].column.importSlot("#thead", "th", "th");

    cAd.setContainer("body");
    cAd.containers["body"].row.importSlot("#tr", "tr");
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
    cAd.containers["head"].row.importSlot("#tr", "tr");
    cAd.containers["head"].column.importSlot("#thead", "th", "th");

    cAd.setContainer("body");
    cAd.containers["body"].row.importSlot("#tr", "tr");
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
    cAd.containers["head"].row.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].row.setSlot("tr");
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
    cAd.containers["head"].row.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].row.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    cAd.tableSlot(null, [
        {
            container: "head",
            name: "Area",       /* 이름을 테이블명을 직접지정 */
            table: ds.tables["Area"],
            element: elem, /* <= 이부분은 필요없을 듯 put 으로 대체 */
            mapping: {
                column: {attr: {type: "F_select"}},
                row: {attr: {type: "F_select"}},
                table: {attr: {type: "F_select"}}
            }            
        },
        {
            container: "body",
            name: "Job",
            table: ds.tables["Job"],
            selector: "#bcode"
        },
    ], "#put1"); /* <= 이부분은 전체(CAd) put 위치  */

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
    cAd.containers["head"].row.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].row.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    // slotBind() 자동 처리됨
    cAd.tableSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",   /* <= 이부분은 필요없을 듯 put 으로 대체 */
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
     * link 호출 : 수동 | dataTable 지정
     * update() 호출문과 비슷함
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head", "#table1");
    cAd.containers["head"].row.setSlot("tr");
    cAd.containers["head"].column.setSlot("th", "th");

    cAd.setContainer("body", "#table2");
    cAd.containers["body"].row.setSlot("tr");
    cAd.containers["body"].column.setSlot("th", "th");

    // slotBind() 자동 처리됨
    cAd.tableSlot(ds, [
        /* ds 매칭 속성 테이블 생성 */
        {
            container: "body",
            attr: {type: "radio"},
            put: "#abc",
        },
        /* ds 매칭 속성 테이블 생성 + 자동매핑 기능 설정 */
        {
            container: "head",
            attr: {type: "select"},
            mapping: {
                column: {attr: {type: "F_select"}}, /* 컬럼에서 link  */
                row: {attr: {type: "F_select"}},    /* 로우에서 link  */
                table: {attr: {type: "F_select"}}   /* 테이블에서 link  */
            }
        },
        /* 직접 테이블 생성 */
        {
            container: "body",
            table: ds.tables["Job"],
            selector: "#bcode"
        },        
    ]);
    
    /* DataContainer 구성후 mapping */
    cAd.mappingSlot(
        ["Area", {attr: {type: "select"}}],
        {
            column: {attr: {type: "F_select"}}, /* 컬럼에서 link  */
            row: {attr: {type: "F_select"}},    /* 로우에서 link  */
            table: {attr: {type: "F_select"}}   /* 테이블에서 link  */            
        }
    );
    /* 매핑정보 데이터 초기화 */
    cAd.clearMapping();

    cAd.clearDataContainer();
    /**
     * 사용 컨테이너
     */
    var CD = new ContainerAdapter(); 
    CD.setContainer("MemReg", "tbody");   
    /*
    TODO: 아래 적당한 이름으로 리펙토링 필요?
    CD.dataTable["MemReg"].row;
    CD.dataContainer["MemReg"].row;
    CD.data["MemReg"].row;
    CD.tables["MemReg"].row;
    */
    CD.container["MemReg"].column.setSlot("td",  [
        {
            name: "p1_name", 
            selector: "p1",
            /* ds 직접 지정 방식 */
            link: {         
                table: ds.tables['Job'],
                container: {
                    object: cAd,
                    name: 'head'
                }
            }
        },
        {
            name: "p2_name", 
            selector: "p2",
            /* DataContainer 직접 선택 방식  */
            link: cAd.tables['Area']
        },
        {
            name: "p2_name", 
            selector: "p3",
            /* 자동 선택 방식  */
            link: cAd
        },
    ]);
    CD.update(ds, "Member", "MemReg", "#div" );
}
// ######################################################
{
    /**
     * 코드명령규칙 로딩
     * - 기본적으로 로딩되는 곳이 없으며
     * - link : cAd 방식만으로 간단하게 바인딩
     */
    var cAd = new ContainerAdapter();

    cAd.setContainer("head");
    cAd.containers["head"].column.importSlot("#input1", "lable", "input[select]");
    cAd.containers["head"].column.callback = function(rowData) {
        // 타입 검사 후 :: 컬럼에서만 호출가능하게
        if (this.refRow.type === 'column') {
            // 참조 값과 넘어온 데이터가 맞으면 선택 체크함
            if (rowData.column.name === this.refRow.value) {
                rowData.setAttrabute('selected', "");
            } 
        }
    };

    cAd.setContainer("body");
    cAd.containers["body"].column.importSlot("#input2", "lable", "th");

    cAd.tableSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            table: ds.tables["Area"],
            mapping: {
                column: {attr: {type: "F_select"}},
                row: {attr: {type: "F_select"}},
                table: {attr: {type: "F_select"}}
            }            
        },
        {
            container: "body",
            name: "Job",
            table: ds.tables["Job"],
            selector: "#bcode"
        },
    ], null);
}

// ######################################################
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


       var CD = new ContainerAdapter(); 
    CD.setContainer("MemReg", "tbody");   
    CD.container["MemReg"].column.setSlot("td",  [
        {
            name: "p1_name", 
            selector: "p1",
            link: {
                table: ds.tables['Job'],
                container: {
                    object: cAd,
                    name: 'head'
                }
            }
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