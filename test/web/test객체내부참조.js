

    // 원시 객체
    var obj = {
        name: "Kim",
        attr: { type: "String", default: "A"},
        list: [1, 2, 3],
        val: "값"
    };

    // var _this = obj;

    function test(pObj) {
        
        return pObj;
    }
   test.target = {};

    // var setObj = {
    //     name: "Lee",
    //     link: {
    //         container: "CAd",
    //         table: "Member",
    //         adpter: "Ad_Member",
    //         refdata: _this.attr.type
    //     },
    // };

    var slot1 ;

    var rtn = test({
        /* 이름값이 kim 이면서 val 속성이 있으며 몰록 갯수가 1개인것 */
        /* 대상 찾기 */
        attr: {name: "Kim", val: null , list: {length: 1}},

        link: {
            container: "CAd",
            dataSet: "ds",
            table: "Member",
            adpter: "Ad_Member",
            refdata: function(objs) {return objs.name;}  /* "[object] 고정명 사용도 가능 */
        },

        slot: {
            /* 객체 생성시 설정 값 들어가면 적당할듯 */
            /* 또는 사위에 정의된 ObjectContainer 참조변수 */
        },
        slot: slot1
    });

    var rtn = [
        {attr: "", callback: ""},
        {attr: "", callback: ""}
    ];

    // 컨테이너 갱신 ( 데이터셋, 테이블명 [,매핑테이블명] )
    // CAd3.beforeUpdate(ds, "body");

    var a = {};
    a.abc = 3;
    a="34";
    console.log('-End-');