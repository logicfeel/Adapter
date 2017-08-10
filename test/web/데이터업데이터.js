{
    // 삭제
    ds.tables[0].rows.removeAt(1);

    // (원본, 수정할것)
    ds.tables[0].rows.update(ds.tables[0].rows[0], )

    //ds.tables[0].rows[0].update()

    
    /**
     * 수정시 복제된 컬럼을 Update 처리함
     */
    ds.tables[0].rows[0].SetModified();

}