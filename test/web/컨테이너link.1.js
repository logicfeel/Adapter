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

    // 타입: 라디오(지역정보)
    CD_Form.setTableSlot("radio", "td");   
    CD_Form.tables["radio"].column.setSlot("td", "td");

    CD_Form.setTableSlot("select", "tbody");   
    CD_Form.tables["select"].column.setSlot("td", "td");
    CD_Form.tables["select"].addEventListener("td input", "click", function(e) {
        console.log('a');
    });
    //
    // ######################################
    
    // ######################################
    // 코드규칙 컨테이너 
    var CD_Code = new ContainerAdapter(); 

    // 코드의 테이블별로 슬롯 생성됨
    CD_Code.setTableSlot(ds, [
        {
            attr: {form: "select"},
            link: {
                cAd: CD_From,
                dataTable: ds[0],
                value : function(rows) {
                    return ref;
                }
            }
        }
    ]);   

    /**
     * !! 문제점 틀만 있고 
     */
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
            link: CD_Code
        },
        {
            name: "p2_name", 
            selector: "p2",
            link: CD_Code
        }
    ]);

    CD.update(ds, "body");    
    //
    // ######################################
}