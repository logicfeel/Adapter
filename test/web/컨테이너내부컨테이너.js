


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
{
    var CD1 = new ContainerAdapter("#put_1", "#temp_1"); 

    CD1.setTableSlot("body", "tbody");
    CD1.tables["body"].record.setSlot("tr");
    CD1.tables["body"].column.setSlot("td", "td");
    /**
     * link( 컨터이너, 연결컨테이어의 데이터테이블, A)
     * A 영역에 들어갈 대상 :
     *  - 코드 : "C | R"  컬럼, 레코드
     *  - 연결할 데이터 : ds.tables[0] 
     */ 
    CD1.tables["body"].value.link(CAd_sub, ds2.tables["radio"]);
    
    CD1.tables["body"].value.link(CAd_sub, ds2, "radio");

    CD1.tables["body"].column.setSlot("td", [
        {name: "p1_name", selector: "p"},
        {name: "p2_name", selector: "p input[value]"},
        {name: "p3_name", selector: "span", link: CAd_sub /* 링크 속성 삽입 위치 TODO: 검토 */ },
        {name: "p4_name", selector: "p", regexp: /$""/ },
    ]);

    CD3.tables["body"].column.setSlot("td", "td", CAd_sub );
    
    /**
     * update( 데이터셋, 테이블명 [, 에덥터매핑테이블명])
     */
    CD1.update(ds, "reg");
}