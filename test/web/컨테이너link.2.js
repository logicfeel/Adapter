{
    // 코드명령 규칙
    var ds = new DataSet("ds_Code");
    ds.tables.add("Area");
    ds.tables.add("Sex");
    ds.tables.add("Job");
}
{
    // ######################################
    // 입력 양식 컨테이너 
    var CD_Form = new ContainerAdapter("div", "#for_list"); 

    // 조건별 인스턴스 생성
    for (var i = 0;  i < ds.tables.length; i++) {

        if (ds.tables[i].type === "radio") {
            CD_Form.setTableSlot(ds.tables[i].tableName, "td");   
            CD_Form.tables[ds.tables[i].tableName].column.setSlot("td", "td");
            CD_Form.tables[ds.tables[i].tableName].column.callback = function(rows) {
                if (refRows === rows.idx) {
                    rows.elem.setAttriblte("selected", "");
                }
            }
            CD_Form.bind(ds, ds.tables[i].tableName);

        } else if (ds.tables[i].type === "select") {
            CD_Form.setTableSlot("select", "tbody");   
            CD_Form.tables[ds.tables[i].tableName].column.setSlot("td", "td");
            CD_Form.tables[ds.tables[i].tableName].addEventListener("td input", "click", function(e) {
                console.log('a');
            });
            CD_Form.bind(ds, ds.tables[i].tableName);
        }
    }
    /**
     * TODO: !! 이슈 : 정적슬롯과 동적슬롯의 경계가 모호해짐 정확성 필요
     * TODO: 패키지별로 로딩하는 자동 로딩 부분이 필요
     */
    //
}
{
    // ######################################
    // 강제 지정 없어도됨
    CD_Form.linkMapping.add("Area", {name: "p1_name"});
    CD_Form.linkMapping.add("Sex", {attr: {type:"form"}});
}
{
    // ######################################
    // 폼 > 페이지
    var CD = new ContainerAdapter("div", "#temp_1"); 

    CD.setTableSlot("MemReg", "tbody");   
    CD.tables["MemReg"].column.setSlot("td",  [
        {
            name: "p1_name", 
            selector: "p1",
            link: CD_Form
        },
        {
            name: "p2_name", 
            selector: "p2",
            link: CD_Form
        }
    ]);

    CD.update(ds, "body");    
    //
    // ######################################
}