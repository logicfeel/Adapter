

{
    // 전체 | 복제
    var slot = "td";

}
{
    // 선택 | 복제
    var slot = {
        name: "p1_name",
        selector: "td"
    };

    // 선택 | 복제
    // 중복이름
    var slot = {
        name: ["p1_name", "p2_name"],
        selector: "td",
    };
}
{
    // 선택 | 붙임
    var slot = [
        {
            name: "p1_name",
            selector: "th"
        },
        {
            name: "p2_name",
            selector: "td"
        },
    ];
}
{
    // 동적 테이블 슬롯 예시
    CD.setTableSlot([
        {
            container: "radio",
            attr: {form: "radio"},
            selector: "th"
        },
        {
            container: "select",
            attr: {form: "radio"},
            selector: "th"
        }
    ]);
    CD.container["input"].column.setSlot("td", "td");
    CD.container["input"].addEventListener("td input", "click", function(e) {
        console.log('a');
    });
    CD.container["select"].column.setSlot("td", "td");

    CD.update(ds, "Area", "input");
    CD.update(ds, "Sex", "select");

}
{
    // 동적 테이블 슬롯 예시
    CD.setTableSlot([
        {
            container: "radio",
            attr: {form: "radio"},
            selector: "th"
        },
        {
            container: "select",
            attr: {form: "radio"},
            selector: "th"
        }
    ]);
    CD.container["input"].column.setSlot("td", "td");
    CD.container["input"].addEventListener("td input", "click", function(e) {
        console.log('a');
    });
    CD.container["select"].column.setSlot("td", "td");

    //  컨테이너 갱신 
    // ( 데이터셋, 테이블명 [, 매핑테이블명] )
    // update 이후 컨테이너 추출은 ??
    CD.update(ds, "Area", "select", target);
    CD.update(ds, "Sex", "select", target);

}
{
    /**
     * 멀티 데이터셋 처리시
     */
    // 빈 컨테이너 생성
    var CD = new ContainerAdapter(); 
    CD.setTableSlot("select");
    CD.container["select"].column.setSlot("td", "td");

    CD.update(ds_code, "Sex", "select", target);
    CD.update(ds_code, "Job", "select", target);
    
    // 설명 : target의 select 컨테이너에서 데이터를 가져와 get_ds 에 채움
    CD.fill(get_ds, "Sex", "select", target);
}
{
    /**
     * 코드명령 규칙 바인딩 시연 1
     */
    // 빈 컨테이너 생성
    var CD = new ContainerAdapter(); 
    CD.setTableSlot("select");
    CD.container["select"].column.setSlot("td", "td");
    // 콤 컨테이너 설정부분
    //...

    // #################### 사용 및 설정 부분
    // 테이블 이름은 알지 못하나 ??
    CD.update(ds_code);
    CD.tableMapping.add("select", {attr: {type:"form_select"}});
}
{
    /**
     * 코드명령 규칙 바인딩 시연 2
     */
    // 빈 컨테이너 생성
    var CD = new ContainerAdapter(); 
    CD.setTableSlot("select");
    CD.container["select"].column.setSlot("td", "td");
    // 콤 컨테이너 설정부분...
    //...

    // #################### 사용 및 설정 부분
    // 테이블 이름은 알지 못하나 ??
    CD.linkMapping.add("cd_Area", 
    {
        dataSet: ds_code,
        name: "cd_Area"
        /* dataTable: ds.tables["cd_Area"] */
    });

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
{
    /**
     * 코드명령 규칙 바인딩 시연 3
     */
    // 빈 컨테이너 생성
    var CD = new ContainerAdapter(); 
    CD.setTableSlot("select");
    CD.container["select"].column.setSlot("td", "td");
    // 콤 컨테이너 설정부분....
    //...
    CD.tableMapping.add("select", {attr: {type:"form_select"}});

    // #################### 사용 및 설정 부분
    // 테이블 이름은 알지 못하나 ??
    CD.linkMapping.add("cd_Area", 
    {
        dataSet: ds_code,
        name: "cd_Area",

    });
    CD.linkMapping.add("cd_Area", 
    {
        dataSet: ds_code,
        attr: {form: "cd_area"}
    });

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