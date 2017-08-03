// ################################################
{
    /**
     * 이벤트의 호출 구조 정리
     */
 
}
// ################################################
{
    if (typeof module !== 'undefined' && module.exports) {
        require('../../external/LCommon.js');
        LArray = global.L.class.LArray;
        Observer = global.L.class.Observer;

    } else if(G.L){
        LArray = G.L.class.LArray;
        Observer = G.L.class.Observer;
    } else {
        console.log('ERR: 클래스(생성형함수) 로딩 실패');
    }    
}
// ################################################
{
    /**
     * 옵서버 테스트
     */
    var osv = new Observer(this, 'a');
    var c = 1;
    osv.subscribe(function(aa,bb){
        console.log('a='+aa+',b='+bb+' call');
        aa++;
        return "a,b return";
    }, "E1");

    osv.subscribe(function(aa,bb){
        console.log('call call');
    }, "E1");

    // var k = osv.publish("E1", c);

    function abc(a, b, c, d) {
        console.log('inner abc');    
        console.log('a='+a+',b='+b+' call');
        aaa.apply(this._this, Array.prototype.slice.call( arguments, 1));
    }

    function aaa(aa, bb, cc) {
        console.log('aa='+aa+',bb='+bb+' call');
    }

    abc(11,22,33, 44);

    // temp = {0:'one', 1:'two', 2:'three', length:3};
    // console.log( abc(Array.prototype.slice.call( temp, 1 )) ); 

    console.log('-End');
}    