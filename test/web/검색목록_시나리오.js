// ################################################
{
    /**
     * 페이지 컨테이너
     * - 여러게의 페이징 타입 구성됨
     * - 이전다음,  페이지만,, 등등
     */
    var cAd_page = new ContainerAdapter();

    cAd_page.setContainer("pageT1");
    cAd_page.containers["pageT1"].column.importSlot("#select", "label li");
    cAd_page.containers["pageT1"].callback = function(cObject) {
        cObject.element.click = function(e) {
            refObj.container.event.publish("page_go", e.number);
        };
    };
    // REVIEW: 정수형을 넘기면 바인딩시 데이터셋을 강제로 생성
    cAd_page.tables["pageT1"].dataSource = function() {
        if (this.dataSoucre === Number) {
            dt = DataTable("Search_Type");
            dt.columns.add("NAME");          // 이름
            dt.columns.add("WRITER");        // 작성자
            dr = dt.newRow();
            dr["NAME"] = true;               // 기본값 설정
            dt1.rows.add(dr);
            this.tataTable = dt;            
        }
    };
}
// ################################################
{
    /**
     * 목록 컨테이너
     * TODO: 동일테이블에서 가져와서 설정 하므로 가져오는 부분 검토 필요
     */
    var cAd_headList = new ContainerAdapter("#table");

    // 해더(제목)
    cAd_headList.setContainer("Head", "#thead", "COLUMN_BIND"); // 컬럼기준 바인딩
    // REVIEW : row없이 컬럼 타임으로 바인딩 
    // => column => data 로 바꿀건지 ? 검토
    cAd_headList.containers["Head"].column.setSlot("th");
    cAd_headList.containers["Head"].column.callback = function(pDataRow) {
        var columnValue = null;
        if (pDataRow.column.attr === {type: "sort"}) {
            columnValue = document.createTextNode(column.caption);
            var b = document.createElement('button');
            b.setAttribute("value", "<");
            b.onclick = function() {
                this.refData.event.publish("list_bind", "INC");
            };
            // TODO: 묶어줘야함
        } else {
            columnValue = document.createTextNode(column.caption);
        }
        return columnValue;
    };
    
    // 내용
    cAd_ListSrh.setContainer("List", "#list");
    cAd_ListSrh.containers["List"].row.setSlot("tr");
    cAd_ListSrh.containers["List"].column.setSlot("th", "th");

    // REVEIW: 매핑 슬롯을 추가하고 + 테이블 속성으로 매칭 하던지..
    //         호출시점에 head, list 바인딩 설정
}
// ################################################
{
    /**
     * 코드명령 데이터셋 설정 
     */
    var ds_code = new DataSet("CODE");
    var dr = null;

    ds_code.tables.add("Code_Area"); 
    ds_code.tables["Code_Area"].attr = {type: "select"};    // 테이블 속성 설정
    ds_code.tables["Code_Area"].columns.add("A01");         // 전국
    ds_code.tables["Code_Area"].columns.add("A02");         // 경기
    ds_code.tables["Code_Area"].columns.add("A03");         // 서울
    dr = dt.newRow();
    dr["A01"] = true;                                       // 기본값 설정
    dt1.rows.add(dr);
    /**
     * ...........
     */
    // 코드명령 사용자 정의 추가방식 1
    ds_code.tables.add("Search_Type"); 
    ds_code.tables["Search_Type"].attr = {type: "srhType"};     // 테이블 속성 설정
    ds_code.tables["Search_Type"].columns.add("NAME");          // 이름
    ds_code.tables["Search_Type"].columns.add("WRITER");        // 작성자
    dr = dt.newRow();
    dr["NAME"] = true;                                          // 기본값 설정
    dt1.rows.add(dr);
}
// ################################################
{
    /**
     * 코드명령 규칙 컨테이너
     *  - 컬럼명 기준으로 가지는 경우
     */
    var cAd_Code = new ContainerAdapter();
    
    cAd_Code.setContainer("select");
    cAd_Code.containers["select"].column.importSlot("#select", "label select");

    // TODO: input 타입 속성
    cAd_Code.setContainer("input");
    cAd_Code.containers["input"].importSlot("#input", "label input[value]");

    cAd_Code.setContainer("button");
    cAd_Code.containers["button"].importSlot("#button", "label button[value]");
    cAd_Code.containers["button"].callback = function(cObject) {
        cObject.element.click = function(e) {
            refObj.container.event.publish("list_load", dataRow);
        };
    };

    cAd_Code.setContainer("radio");
    cAd_Code.setContainer("checkbox");
    cAd_Code.setContainer("textarea");
    
    cAd_Code.tableSlot(ds_code, [
        // ds table 갯수만큼 조건 검사함 생성함
        {
            container: "select",
            attr: {type: "code_select"},                    // 테이블 속성 */
            mapping: {
                COLUMN: {attr: {type: "select"}}            // 호출처 컬럼 속성
            }
        },
        // REVIEW: 'table' 테이블이 지정된 1회만 바인딩됨 
        {
            container: "input",
            table: null,
            mapping: {
                COLUMN: {name: "text"}                      // 호출처 컬럼명
            }
        },
        // 코드명령 사용자 정의 추가방식 1
        {
            container: "select",
            table: function(o) {
                return o.column.table;
            },
            mapping: {
                COLUMN: {attr: {type: "table"}}             // 호출처 컬럼 속성
            }
        },
        
    ]);

}
// ################################################
{
    /**
     * 목록 검색 데이터셋 설정 
     */
    var ds_page = new DataSet("Search_Page");
    var dr = null;

    ds_page.tables.add("Search");
    ds_page.tables["Search"].columns.add("area");                           // 지역
    ds_page.tables["Search"].columns["area"].attr = {type: "select"};       // 지역 속성
    ds_page.tables["Search"].columns.add("writer");                         // 이름
    ds_page.tables["Search"].columns["writer"].attr = {type: "text"};       // 이름 속성    
    // TODO: 검색텍스트 타입 설정 하는 부분
    ds_page.tables["Search"].columns.add("srhType");                        // 검색 타입
    ds_page.tables["Search"].columns["srhType"].attr = 
    {
        type: "table", 
        table: function(obj){
            dt = DataTable("Search_Type");
            dt.columns.add("NAME");          // 이름
            dt.columns.add("WRITER");        // 작성자
            dr = dt.newRow();
            dr["NAME"] = true;               // 기본값 설정
            dt1.rows.add(dr);
            return dt;
        }
    };   // 이름 속성    
    ds_page.tables["Search"].columns.add("srhText");                        // 검색 텍스트
    ds_page.tables["Search"].columns["srhText"].attr = {type: "text"};      // 이름 속성    
    ds_page.tables["Search"].columns.add("srhButton");                      // 검색 버튼 => 상위에 노출도 검토
    ds_page.tables["Search"].columns["srhButton"].attr = {type: "button"};  // 이름 속성    

    dr = dt.newRow();
    dt1.rows.add(dr);

    // => 아작스에서 로딩함
    ds_page.tables.add("List");
    ds_page.tables["List"].columns.add("num");
    ds_page.tables["List"].columns.add("title");
    ds_page.tables["List"].columns.add("writer");
    ds_page.tables["List"].columns.add("count");
    // TODO: 목록내의 체크박스, 처리버튼 표현
}
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// ################################################
// UIElemet 상속 및 오버다이딩 형식으로 확장
{
    /**
     * 목록 검색 틀
     */
    // 검색 조건 ==================================
     var cAd_ListSrh = new ContainerAdapter("#srh_list", put);

    cAd_ListSrh.setContainer("Search_S", "#srh");
    cAd_ListSrh.containers["Search_S"].column.setSlot("div");           // 복합 슬롯으로도 노출 검토
    cAd_ListSrh.containers["Search_S"].column.link = cAd_Code;
    cAd_ListSrh.addEvent(function(callObj) {
        ajaxAd.update(ds, "Notice");
    }, "load");
    
    // 목록      ==================================
    {
        // 해더 없는 경우 + 동적 컬럼 형식
        cAd_ListSrh.setContainer("List_S", "#list");
        cAd_ListSrh.containers["List_S"].row.setSlot("tr");
        cAd_ListSrh.containers["List_S"].column.setSlot("th", "th");
        cAd_ListSrh.containers["List_S"].column.callback = function(obj)  {
            // 리스트 바인딩별로 세부 속성 설정
            if (rowData.column.name === this.refRow.value) {
                    rowData.setAttrabute('selected', "");
            } 
        };
        cAd_ListSrh.addEvent(function(callObj) {
            cAd_ListSrh.update(callObj, "Notice");
        }, "list_bind");
    }
{
    // 컨테이너 로딩 형식
    cAd_ListSrh.setContainer("List_S2", "#list");
    // REVIEW: 리크에 매핑 정보 head, list 매필 설정 하던지.. 속성타입으로 매핑하던지
    cAd.containers["List_S2"].link = cAd_headList;
}

    // 페이지     ==================================
    cAd_ListSrh.setContainer("Page_S", "#page");
    cAd_ListSrh.containers["Page_S"].link = {
        object: cAd_page.containers["List"],
        // REVIEW: 정수형 넘김
        table: function(obj){
            return __obj.rows.totalcount;
        }
    };
    cAd_ListSrh.addEvent(function(callObj) {
        cAd_ListSrh.update(callObj, "Notice");
    }, "page_go");

    
    // 검새조건으로 버블 로딩함
    // @@@ 초기 로딩 시작점 @@@
    cAd_ListSrh.update(ds_page, "Search", "Search_S");
}
// ################################################
// UIElemet 상속 및 오버다이딩 형식으로 확장
{
    /**
     * 데이터 로딩
     */
    var ajaxAd = new AjaxAdapter();
    
    ajaxAd.insertTable("Notice");
    ajaxAd.tables["Notice"].select.url = "Notice_Lst.C.asp";

    // 이벤트 등록함 (이벤트 호출을 통해서 로딩)
    ajaxAd.addEvent(function(callObj) {

        // 전달 파라메터 설정
        ajaxAd.tables["Notice"].select.addCollection({
            cmd: "SELECT",
            selPage: 1,
            listCnt: 10,
            sto_id: "S00001"
            // TODO: 검색조건에서 가져온 자료 바인딩 해야함
        });

        // 채운후에 컨테이너 update 트함
        A1.fill(ds, "Notice", function(data) {
            // 타입 1 : 직접 컨테이너 바인딩
            cAd_ListSrh.update(data, "List", "List_S"); 

            // 타입 2 : 이벤트 호출 바인딩
            refObj.container.event.publish("list_bind", data);

        });
    }, "list_load");

}