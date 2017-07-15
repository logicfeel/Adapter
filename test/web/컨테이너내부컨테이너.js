


{
    // 서브컨테이너
    var CD_sub1 = new ContainerAdapter("String값", "#temp_1"); 
    CD_sub1.setTableSlot("body", "tbody");
    CD_sub1.tables["body"].column.setSlot("label", "input", 
        function() {
            // input-value-속성, input_값 : 설정
        }
    );

    // CD1.update(ds, "body");


    // 메인컨테이너
    var CD1 = new ContainerAdapter("#put_1", "#temp_1"); 

    CD1.setTableSlot("body", "tbody");
    CD1.tables["body"].record.setSlot("tr");
    CD1.tables["body"].column.setSlot("td", "td");
    CD1.tables["body"].value.setSlot(CD_sub1);

    CD1.update(ds, "body");
}
{
    // value.setSlot(CD_sub1) 내부
    
}
{
    function Container(){
        this.CAd = new ContainerAdapter();
        this.CAd.tables[0].column[1]
    }
}