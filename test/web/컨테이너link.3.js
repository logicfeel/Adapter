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

    CD.setTableSlot(ds, [
        {
            table: "Code_Area",
            name: "Area",
            selector: "td"      /* <= 이부분이 없으면 (메인에) 삽입이 안됨 */
        },
        {
            attr: {form: "select"},
            selector: "td select"
        },
    ]);

    CD_Form.tables["radio"].column.setSlot("td", "td");

    CD_Form.setTableSlot("select", "tbody");   
    CD_Form.tables["select"].column.setSlot("td", "td");
    CD_Form.tables["select"].addEventListener("td input", "click", function(e) {
        console.log('a');
    });

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
            link: CD_Form.tables["select"]
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