// ################################################
{
    /**
     * 컨테이너 이벤트 호출 구조 (시나리오)
     * 
     * 주로 컨테이너 내부에서 발생함
     */

    // 이벤트 정의
    CA.event.addEvent('bind', function(e){
        // 내용
    });
     
    // 이벤트 호출
    CA.event.event('bind');
    CA.event.bind();
    CA.event['bind']();

}
// ################################################
{
    /**
     * HTML 이벤트 호출 구조
     * 주로 외부에서 발생/노출됨
     */
    
     // 대상
    var elem = document.querySelector("p");

    // 이벤트 정의 : 이벤트명 = 함수정의
    elem.addEventListener("click", function(e){
        // 내용
    });

    // 이벤트 호출
    elem.click();
} 
// ################################################
{
    /**
     * JQuery 이벤트 구조
     */
    // 대상선택 + 이벤트 정의  << 호출은 내부에서 발생
    $("p").click(function(){
        $(this).hide();         // this 는 대상을 가르킴
    });

    // 대상선택 + 복수 이벤트 정의
    $("p").on({
        mouseenter: function(){
            $(this).css("background-color", "lightgray");
        }, 
        mouseleave: function(){
            $(this).css("background-color", "lightblue");
        }, 
        click: function(){
            $(this).css("background-color", "yellow");
        } 
    }); 

    // 이벤트 트리거  : 클릭시 input select 이벤트 발생시킴
    $("button").click(function(){
        $("input").trigger("select");
    });

}
/**
 * 이벤트 클래스 설계
 * - this 의 역활
 * - arg 기본 의 전달
 * - 이벤트명 호출
 * - 이벤트 정의 
 * - 이벤트명 선언
 */