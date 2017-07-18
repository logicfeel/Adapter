{
    // 기본 호출구조
    var CAd = new ContainerAdapter("#put_1", "#temp_1"); 

    CAd.setTableSlot("body", "tbody");
    CAd.tables["body"].record.setSlot("tr");
    CAd.tables["body"].column.setSlot("td", "td");
    CAd.update(ds, "body");
}
{
    // 일반 update
    CAd.update(ds, "Member");

    /**
     * 테이블 매핑  (호출 시점)
     * update( 데이터셋, 테이블명, 어뎁터매핑테이블명)
     */
    CAd.update(ds, "Member", "Ad_Member");

    /**
     * 업데이트 후 커밋
     * 업데이트 완료후 해당 ds 커밋 처리
     */
    CAd.updateCommit(ds, "Member");

    /**
     * 업데이트 추가 데이터 설정
     * REVIEW: 참조데이터의 위치
     *  - 컨테이너
     *  - 테이블별
     *  - 슬롯별
     *  - 객체컨테이너별 
     *  => 선택해야함
     *  * 이용위치 : 컬럼확장 CAd" 
     *  "코드명령규칙에서 선택된 값으로 이용할 수 있음"
     *  "타입을 정해야 하는것 아닌지?"
     */
    CAd.update(ds, "Member", "Ad_Member", ds2.tables[0]);
    CAd.update(ds, "Member", "Ad_Member", ds2.tables[0].rows[0]);
    CAd.update(ds, "Member", "Ad_Member", ds2.tables[0].rows[0]["p_name"]);
    CAd.update(ds, "Member", "Ad_Member", "Text");
}
{
    /**
     * 컬럼 매핑
     */
    CAd.tables["Ad_Meb"].columnMapping.add("p_name", "s_name");

    /**
     * 객컨테이너 슬롯명 매핑
     */
    TS.slotMapping.add("p1_name", "s1_name");   // <== 유력

    // REVIEW: 컬럼 매핑 vs 슬롯매핑 뭐가 필요한지 검토?
}
{
    // 레코드 단일 슬롯

    // 레코드 복합 슬롯 ?

    // 컬럼 단일 슬롯

    // 컬럼 복합 슬롯

    // 객체 슬롯

    // 전역 속성 등록

    // 레코드수 제한  : isSingle  => limitRow  로우수 제한

    // 컨테이너 설정 (가져오기)

    // update 시 확장 데이터 설정  (fill?)

    // 코드명령 규칙 (생성등록)

    // 코드명령 규칙 (가져오기)

    // TemplateElemet 소스의 "handlbars" 적용

}
// ##########################################################
// 우선순위가 낮아서 미뤄진 이슈
{
    /**
     * update/fill  과 ds, 테이블명 분리
     * => 아직은 불필요
     */
}
{
    /**
     * update 동시 업데이터
     * 
     */
}