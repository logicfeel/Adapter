{
    /**
     * 컨테이너 슬롯 설정 - O
     */
    var cAd = new ContainerAdapter();
    cAd.import("#tables");  // <= 요약가능
    cAd.setSlot("table", [
        {
            name: "head",   /* 타겟정보 아닌지? */
            selector: "thead",
        },
        {
            name: "body",
            selector: "tbody"
        }
    ]);
    cAd.setTable("head");   // 결할 필요 있음
    CD2.tables["head"].record.importSlot("tr", "tr");
    cAd.tables["head"].column.importSlot("thead", "th", "th");

    cAd.setTable("body");   // 결할 필요 있음
    CD2.tables["body"].record.importSlot("tr", "tr");
    cAd.tables["body"].column.importSlot("thead", "th", "th");

    cAd.update(ds, "Area", "head");
    cAd.update(ds, "Job", "body");
}
// ############################################
{
    /**
     * 컨테이너 슬롯 설정 - X
     */
    var cAd = new ContainerAdapter();
    cAd.setTable("head");   // 결할 필요 있음
    CD2.tables["head"].record.importSlot("tr", "tr");
    cAd.tables["head"].column.importSlot("thead", "th", "th");

    cAd.setTable("body");   // 결할 필요 있음
    CD2.tables["body"].record.importSlot("tr", "tr");
    cAd.tables["body"].column.importSlot("thead", "th", "th");

    // (데이터셋, 테이블명 [, 컨테이너테이블명,  붙임요소 | 붙임선택자 ])
    cAd.update(ds, "Area", "head");
    cAd.update(ds, "Job", "body"); 
}
// ############################################
{
    /**
     * 컨테이너 슬롯 설정 - X :: 상위 템플릿 이용 방식
     */
    var cAd = new ContainerAdapter();
    cAd.setTable("head", "thead");
    cAd.tables["head"].record.setSlot("tr");
    cAd.tables["head"].column.setSlot("th", "th");
    
    cAd.setTable("body", "tbody");
    cAd.tables["body"].column.setSlot("td", "td");
    cAd.tables["body"].column.setSlot("td", "td");

    // (데이터셋, 테이블명 [, 컨테이너테이블명,  붙임요소 | 붙임선택자 ])
    cAd.update(ds, "Area", "head", "#div1");
    cAd.update(ds, "Job", "body", "#div2" );
    /**
     * 매번 갱신할때 테이블과, PUT 위치를 지정 ??
     */
}
{
    /**
     * - 업데이트 위치
     * - dataSoucre, 테이블명관리
     */
    var cAd = new ContainerAdapter();
    cAd.setTable("head", "thead");
    cAd.container["head"].record.setSlot("tr");
    cAd.container["head"].column.setSlot("th", "th");
    
    cAd.setTable("body", "tbody");
    cAd.container["body"].record.setSlot("td", "td");
    cAd.container["body"].column.setSlot("td", "td");

    cAd.slotBind([
        {
            name: "head",
            table: ds.tables["Area"],
            element: elem
        },
        {
            name: "body",
            table: ds.tables["Job"],
            selector: "#bcode"
        },        
    ]);
    cAd.container["body"].dataBind();  // 테이블 바인딩 
    cAd.dataBind();                 // 전체 바인딩
}
{
    /**
     * 동적 컨테이너 + 인스턴스 방식
     */
    var cAd = new ContainerAdapter();
    cAd.setTable("head", "thead");
    cAd.container["head"].record.setSlot("tr");
    cAd.container["head"].column.setSlot("th", "th");
    
    cAd.setTable("body", "tbody");
    cAd.container["body"].record.setSlot("td", "td");
    cAd.container["body"].column.setSlot("td", "td");

    // slotBind() 자동 처리됨
    cAd.updateSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",  
            put_selector: "#abc",
            put: "#abc",
        }
    ]);

    // 접근
    cAd.tables["Area"].element; 
    cAd.tables["Job"].element;
    cAd.tables["Sex"].element;
    cAd.tables["B_type"].element;

}
{
    /**
     * link 호출
     */
    var cAd = new ContainerAdapter();
    cAd.setContainer("head", "thead");
    cAd.container["head"].record.setSlot("tr");
    cAd.container["head"].column.setSlot("th", "th");
    
    cAd.setContainer("body", "tbody");
    cAd.container["body"].record.callback = function() {
        this.dataSource =  this.linkData;   // 이부분은 삽입하는 로직
    };
    cAd.container["body"].record.setSlot("td", "td");
    cAd.container["body"].column.setSlot("td", "td");

    // slotBind() 자동 처리됨
    cAd.updateSlot(ds, [
        {
            container: "head",
            attr: {type: "select"},
            /* 아래것중 적당한것 선택  생각해봄 */
            selector: "#abc",  
            put_selector: "#abc",
            put: "#abc",
        }
    ]);

    // add(컨테이너, 사용처);
    cAd.linkMapping.add(
        {attr: {type: "select"}},   // 테이블 속성
        {attr: {type: "select"}}    // 컬럼 속성
    );
    cAd.linkMapping.add(
        {container: "head"},
        {name: "p1_name"}
    );
    cAd.linkMapping.add(
        {container: "head"},
        {name: "p1_name"}
    );

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