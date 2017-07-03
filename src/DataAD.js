/**
 * @version 0.0.1 
 */
(function(G) {
    'use strict';    
    var _G;     // 내부 전역

    // ## import & 네이밍 표준 설치
    var LArray;
    var Observer;

    if (typeof module !== 'undefined' && module.exports) {
        require('../external/LCommon.js');
        LArray = global.L.class.LArray;
        Observer = global.L.class.Observer;

    } else if(G.L){
        LArray = G.L.class.LArray;
        Observer = G.L.class.Observer;
    } else {
        console.log('ERR: 클래스(생성형함수) 로딩 실패');
    }

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // 추상 클래스 역활
    function DataAdapter() {
        
        this.isDebug        = false;
        this._event         = new Observer(this, this);
        this._tableMapping  = [];
        this.eventList      = ["fill", "update"];
        this.onFilled       = null;       // 완료후 호출 (pDataSet, pTableName)
        this.onUpdated      = null;        // 완료후 호출 (pDataSet, pTableName)

    }
    (function() {   // prototype 상속

        DataAdapter.prototype.insertCommand  = null;
        DataAdapter.prototype.updateCommand  = null;
        DataAdapter.prototype.deleteCommand  = null;
        DataAdapter.prototype.selectCommand  = null;

        // 테이블 매핑
        DataAdapter.prototype._setTableMapping = function(pAdapterTableName, pDataTableName) {
            
            var tableMapping = {
                adapter: pAdapterTableName,
                datatable: pDataTableName
            };

            // adapter 테이블 기준으로 매핑 (기존에 있는경우)
            for (var i = 0; i < this._tableMapping.length; i++) {
                if (this._tableMapping[i].adapter === pAdapterTableName) {
                    this._tableMapping[i].pDataTableName;
                    return;
                }
            }
            this._tableMapping.push(tableMapping);
        };
        
        DataAdapter.prototype.getAdapterName = function(pDataTableName) {

            for (var i = 0; i < this._tableMapping.length; i++) {
                if (this._tableMapping[i].datatable === pDataTableName) {
                    return this._tableMapping[i].adapter;
                }
            }
            return pDataTableName;
        };

        // DS.tables.changes => A.D 반영
        DataAdapter.prototype.fill = function(pDataSet, pTableName, pAdapterName) {

            var tableName = null;
            var aTable  = "";

            if (pAdapterName) {
                this._setTableMapping(pAdapterName, pTableName);
            }
            
            // 분기: 지정 talble => DS 채움
            if (pTableName) {
                aTable = this.getAdapterName(pTableName);
                this.selectCommand(aTable, pDataSet.tables[pTableName]);
            
            // 분기: 전체 table => DS 채움
            } else {
                for (var i = 0; i < this.tables.length; i++) {
                    
                    tableName = this.tables.attributeOfIndex(i);
                    
                    this.selectCommand(tableName, pDataSet.tables[pTableName]);
                }
            }

            if (typeof this.onFilled === "function" ) {
                this.onFilled.call(this, pDataSet, pTableName);
            }
            this._event.publish("fill");
        };

        // A.D  => D.S 전체 채움
        DataAdapter.prototype.update = function(pDataSet, pTableName, pAdapterName) {

            var cTables = null;
            var aTable  = "";

            if (pAdapterName) {
                this._setTableMapping(pAdapterName, pTableName);
            }

            // DS 지정 테이블 update
            if (pTableName) {
                cTables = pDataSet.tables[pTableName].getChanges();
                cTables = [cTables];    // 이중배열 처리    
            
            // DS 전체 update
            } else {
                cTables = pDataSet.getChanges();
            }

            for (var i = 0; i < cTables.length; i++) {
                for (var ii = 0; ii < cTables[i].changes.length; ii++) {
                    
                    aTable = this.getAdapterName(cTables[i].table);
                    
                    switch (cTables[i].changes[ii].cmd) {
                        case "I":       // update() commanad
                            this.insertCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            // this.insertCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            break;
                        case "D":       // update() commanad
                            this.updateCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            // this.updateCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            break;
                        case "U":       // update() commanad
                            this.deleteCommand(aTable, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            //  this.deleteCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                            break;
                        // case "S":       // fill() commanad
                        //      this.selectCommand(cTables[i].table, cTables[i].changes[ii].row, cTables[i].changes[ii].idx);
                        //     break;
                        default:
                            throw new Error('cmd 에러 발생 cmd:' + cTables[i].cmd);
                    }
                }
            }

            if (typeof this.onUpdated === "function" ) {
                this.onUpdated.call(this, pDataSet, pTableName);
            }
            this._event.publish("update");
        };

        // 이벤트 등록
        DataAdapter.prototype.onEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.subscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

        // 이벤트 해제
        DataAdapter.prototype.offEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.unsubscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

    }());

    
    // 배포 (RequireJS 용도)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports      = DataAdapter;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }
    // 전역 배포
    _G.DataAdapter          = DataAdapter;

}(this));