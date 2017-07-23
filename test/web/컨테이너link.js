{
    // 코드명령 규칙
    var ds = new DataSet("ds_Code");
    ds.tables.add("Area");
    ds.tables.add("Sex");
}
{
    // ######################################
    // 입력 양식 컨테이너 
    var CD_Form = new ContainerAdapter("div", "#for_list"); 

    // 타입: 라디오(지역정보)
    CD_Form.setTableSlot("radio", "td");   
    CD_Form.tables["radio"].column.setSlot("td", "td");

    CD_Form.setTableSlot("selectbox", "tbody");   
    CD_Form.tables["selectbox"].column.setSlot("td", "td");
    CD_Form.tables["selectbox"].addEventListener("td input", "click", function(e) {
        console.log('a');
    });
    //
    // ######################################

    // CD2.update(ds, "Area");  
    CD_Form.bind(ds, "Area", "radio");       // <== 묶어주는 방식이 맞을듯
    CD_Form.bind(ds, "Sex", "selectbox");       // <== 묶어주는 방식이 맞을듯

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