// ################################################
{
    /**
     * ds 복제 구조 시연
     */
    
     ds.tables[0].column["p_id"];

    //
     ds.tables[0].rows[0]["p_id"] = "대상값"

     // pIdx 없을시 전체 복사됨
     ds.tables[0].rows.copyTo(pIdx);


}