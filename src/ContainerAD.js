/**
 * @version 0.0.1 
 */
(function(G) {
    'use strict';    
    var _G;     // 내부 전역

    // ## import & 네이밍 표준 설치
    var LArray;
    var Observer;
    var DataAdapter;

    if (typeof module !== 'undefined' && module.exports) {
        
        if (global.DataAdapter) {
            DataAdapter = global.DataAdapter;
        } else {
            DataAdapter = require('./DataAD.js');
        }

        require('../external/LCommon.js');
        LArray      = global.L.class.LArray;
        Observer    = global.L.class.Observer;

    } else if(G){
        DataAdapter = G.DataAdapter;
        LArray      = G.L.class.LArray;
        Observer    = G.L.class.Observer;
    } else {
        console.log('ERR: 클래스(생성형함수) 로딩 실패');
    }

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // @종속성 : HTML DOM, DataAdapter
    // 컨테이너 삽입 방식
    // 템플릿 방법 
    // - [추천] <scirpt> 태그 방식     
    // - [추천] handlebrs 라이브러리 사용 방식  {{url}}
    // - [검토] <template> 방식 : 호환성 문제
    //      장점 : querySelector 를 통한 접근이 쉬움
    //      단점 : 브라우저 호환성 문제 특히 IE
    // - %s 문자열 교체 방식 
    // - 주석 
    //      장점 : 단순한 구조 임
    //      단점 : 복잡한 구조 사용에 코드가 지져분해짐
    // - 서버 가져오기
    // function ContainerAdapter(pPutSelector, pTemplate, pIsSingleRow) {
    function ContainerAdapter(pPutSelector, pImpSelector, pIsSingleRow) {        
        DataAdapter.call(this, pIsSingleRow);     // ### 상속(prototype) ###

        this._importTemp    = null;
        this._isShadow      = false;                   // 쉐도움돔 처리
        
        this.isDebug        = false;
        this.putElement     = null;                     // 붙일 위치
        this.element        = null;                     // TemplateElement : 컨테이너 
        this.template       = new TemplateElement(this);
        this.tables         = new LArray();
        
        if (typeof pPutSelector === "string") {
            this.putElement = document.querySelector(pPutSelector);
            // if (this.isShadow) {
            //     this.putElement = document.querySelector(pPutSelector).createShadowRoot();
            // } else {
            //     this.putElement = document.querySelector(pPutSelector);
            // }
            
        }
        if (typeof pImpSelector === "string") {
            var template = document.querySelector(pImpSelector);
            this.import(template);
        }
        

        this.eventList.push("inserted", "deleted", "updated", "selected");
    }
    (function() {   
        // ### 상속(prototype) ###
        ContainerAdapter.prototype =  Object.create(DataAdapter.prototype);
        ContainerAdapter.prototype.constructor = ContainerAdapter;
        ContainerAdapter.prototype.parent = DataAdapter.prototype;    

        // ##### 메소드 ####

        // tables 에 이전 레코드 찾기
        // pOnwerTableObject : 기준(소유) 테이블 객체
        ContainerAdapter.prototype._beforeRecord = function(pOnwerTableObject) {
            
            var idx = -1;
            var selector = null;
            var selectorLoop = null;
            var before = [];
            idx = this.tables.indexOf(pOnwerTableObject);
            selector = pOnwerTableObject.mainSlotSelector;

            // 이전 등록된 테이블 과 비교 함
            for (var i = 0; i < this.tables.length; i++) {

                selectorLoop = this.tables[i].mainSlotSelector;

                if (L.web.querySelecotrOuter(this.template._element, selector) ===
                    L.web.querySelecotrOuter(this.template._element, selectorLoop)) {
                        before.push(this.tables[i]);
                }
            }
            return before;
        };

        // 컨테이너 객체 초기화
        ContainerAdapter.prototype._countRecord = function(pArray) {
            
            var count = 0;

            for (var i = 0; i < pArray.length; i++) {
                count = count + pArray[i].recordCount;
            }
            return count;
        }

        ContainerAdapter.prototype._getTableInfo = function(pTableName) {

            var mainElement         = null; 
            var mainSlot            = null;
            var mainSlotSelector    = this.tables[pTableName].mainSlotSelector;
            var hasRecord           = this.tables[pTableName].record._element ? true : false;
            var hasElement          = this.element ? true : false;
            var hasRecordSubSlot    = this.tables[pTableName].record.subSlot ? true : false;
            var hasColumnSubSlot    = this.tables[pTableName].column.subSlot ? true : false;

            if (hasElement) {
                mainElement         = this.element;
                // 17-07-06 동일 putElement 에 CD 2개 이상 적용시 썩음 문제 
                // mainSlot            = L.web.querySelecotrOuter(this.element, mainSlotSelector);
                mainSlot            = this.element.querySelector(mainSlotSelector);
            } else {
                mainElement         = this.template._element.cloneNode(true);
                mainSlot            = L.web.querySelecotrOuter(mainElement, mainSlotSelector);
            }

            return {
                mainElement: mainElement,
                mainSlot: mainSlot,
                mainSlotSelector: mainSlotSelector,
                hasRecord: hasRecord,
                hasElement: hasElement,
                hasRecordSubSlot: hasRecordSubSlot,
                hasColumnSubSlot: hasColumnSubSlot
            };
        }

        // 레코드가 유무와 상관없이 호출함
        ContainerAdapter.prototype._equelRowCantiner = function(pTableName) {

            var container           = null;
            var row                 = null;
            var mainSlotSelector    = null;
            var recordSlotSelector  = null;

            if (!this.tables[pTableName].record._element) return true;

            mainSlotSelector    = this.tables[pTableName].mainSlotSelector;            
            recordSlotSelector  = this.tables[pTableName].record.slotSelector;

            container  = L.web.querySelecotrOuter(this.template._original, mainSlotSelector);
            row        = L.web.querySelecotrOuter(this.template._original, recordSlotSelector);
            
            if (container.isEqualNode(row)) {
                return true;
            } else{
                return false;
            }
        }

        // 콜백 호출
        ContainerAdapter.prototype._callbackManager = function(pSlotSelector, pCallback, pRowValue, pColumnIdx, pDataRow, pColumClone) {
            
            var columnChild         = null;
            var attrName            = "";
            var stIdx               = 0;
            var endIdx              = 0; 

            if (pCallback && typeof pCallback === "function") {
                columnChild = pCallback.call(this, pRowValue, pColumnIdx, pDataRow, pColumClone);
            } else {
                stIdx = pSlotSelector.indexOf("[");
                endIdx = pSlotSelector.indexOf("]");

                // 속성값 설정의 경우
                if (stIdx > -1 && endIdx > -1) {
                    attrName = pSlotSelector.substring(stIdx + 1, endIdx);
                    pColumClone.setAttribute(attrName, pRowValue);

                // 요소값 설정의 경우
                } else {
                    // 텍스트 노드만 검색후 삭제함
                    // TODO: 이후 전역으로 검토
                    // TEXT_NODE : 3
                    for (var i = 0; i < pColumClone.childNodes.length; i++) {
                        if (pColumClone.childNodes[i].nodeType === 3) {
                            pColumClone.childNodes[i].nodeValue = '';
                        }
                    }
                    
                    // pColumClone.textContent = ""; // 기존 텍스트 초기화   폴리필 삽입함 1.0.1 이후용
                    columnChild = document.createTextNode(pRowValue);
                }
                
                
                
            }
            return columnChild;
        };

        ContainerAdapter.prototype._attachManager = function(pTableName, pRecord, pIdx, pRecordCount, pDataRow) {

            var info                = this._getTableInfo(pTableName);
            var beforeRecordCount   = 0;
            var elementIdx          = 0;
            var index               = 0;

            pRecordCount = pRecordCount || 0;

// 디버깅
// if (pIdx === 1) {
//     console.log('Stop');
// }

            // 병합 관점 레코드 카운터 가져오기 (레코드 위치 관리)
            beforeRecordCount = this._countRecord(this.tables[pTableName].beforeRecord);

            // pIdx 가 없거나 정수 타입이 아니면 기본값 0 설정
            if (!pIdx || typeof pIdx !== "number") {
                pIdx = 0;
            }

            if (!info.hasRecord) {
                elementIdx = pIdx ? (pIdx * pDataRow.length) : 0;
            } else {
                elementIdx = pIdx;
            }
            
            // (pIdx)인덱스 값 + (beforeRecordCount)이전레코드 수 + 컬럼=>레코드 변환 누적카운터
            // index = elementIdx + beforeRecordCount + pRecordCount + pIdx;
            index = elementIdx + beforeRecordCount + pRecordCount;

            // REVIEW : 방식에 따라서 fill 위치와 연관 있음 => 당연한 결과
            info.mainSlot.insertBefore(pRecord, info.mainSlot.childNodes[index]);
            
            // 레코드 카운터 추가 (!삭제 변경시 관리 해야 함)
            this.tables[pTableName].recordCount++;  

            // 문서에 붙임
            if (!info.hasElement) {

                this.element = info.mainElement;

                if (this.putElement) {
                    this.putElement.appendChild(this.element);
                } else {
                    this._importTemp.parentElement.replaceChild(this.element, this._importTemp);
                }
            }
        };

        ContainerAdapter.prototype._removeManager = function(pTableName, pIdx, pRecordCount, pDataRow) {

            var info                = this._getTableInfo(pTableName);
            var beforeRecordCount   = 0;
            var elementIdx          = 0;
            var index               = 0;

            pRecordCount = pRecordCount || 0;

            // 병합 관점 레코드 카운터 가져오기 (레코드 위치 관리)
            beforeRecordCount = this._countRecord(this.tables[pTableName].beforeRecord);

            // pIdx 가 없거나 정수 타입이 아니면 기본값 0 설정
            if (!pIdx || typeof pIdx !== "number") {
                pIdx = 0;
            }

            if (!info.hasRecord) {
                elementIdx = pIdx ? (pIdx * pDataRow.length) : 0;
            } else {
                elementIdx = pIdx;
            }
            
            // (pIdx)인덱스 값 + (beforeRecordCount)이전레코드 수 + 컬럼=>레코드 변환 누적카운터
            // index = elementIdx + beforeRecordCount + pRecordCount + pIdx;
            index = elementIdx + beforeRecordCount;

            // REVIEW : 방식에 따라서 fill 위치와 연관 있음 => 당연한 결과
            info.mainSlot.removeChild(info.mainSlot.childNodes[index]);
            
            // 레코드 카운터 추가 (!삭제 변경시 관리 해야 함)
            this.tables[pTableName].recordCount--;

            // 문서에 붙임
            if (!info.hasElement) {
                
                this.element = info.mainElement;
                
                if (this.putElement) {
                    this.putElement.appendChild(this.element);
                } else {
                    // 원본.부모.기준으로 교체함
                    this._importTemp.parentElement.replaceChild(this.element, this._importTemp);
                }
            }
        };


        ContainerAdapter.prototype._createContainer = function(pTableName, pDataRow, pIdx) {

            var info                = this._getTableInfo(pTableName);
            var equelRowCantiner    = this._equelRowCantiner(pTableName);
            var record              = null;

            // [O, -, -, -] : 레코드 = 메인컨테이너 같음 유무  (공통: 로우블럭X)
            if (equelRowCantiner) {
                
                // [O, O, -, -] : 레코드 유무-O
                if (info.hasRecord) {
                    
                    // 로우 블럭 제거 로직
                    record = this._recordManager(pTableName, pDataRow);
                    this._attachManager(pTableName, record, pIdx);

                // [O, X, -, -] :  레코드 유무-X   
                } else {

                    // [O, X, X, O]  레코드 서브 무조건 없음 - 컬럼서브슬롯-O
                    if (info.hasColumnSubSlot) {
                        record = this._createColumnSubSlot(pTableName, pDataRow);
                        // this._attachManager(pTableName, record, pIdx, i);  //17-07-04 아래코드로 디버깅 수정함 
                        this._attachManager(pTableName, record, pIdx, i, pDataRow);
                    
                    // [O, X, X, X]  레코드 서브 무조건 없음 - 컬럼서브슬롯-X   
                    } else {
                        for (var i = 0; i < pDataRow.length; i++) {
                            record = this._createColumn(pTableName, pDataRow[i], pDataRow);
                            this._attachManager(pTableName, record, pIdx, i, pDataRow);
                        }
                    }
                }

            // [X, -, -, -] : 레코드 != 메인컨테이너
            } else {

                // [X, O, -, -] : 레코드 유무-O  (레코드 무조건 있음)
                if (info.hasRecord) {
                    record = this._recordManager(pTableName, pDataRow);
                    this._attachManager(pTableName, record, pIdx);
                }            
            }
        }

        ContainerAdapter.prototype._removeContainer = function(pTableName, pDataRow, pIdx) {

            var info                = this._getTableInfo(pTableName);
            var equelRowCantiner    = this._equelRowCantiner(pTableName);

            // [O, -, -, -] : 레코드 = 메인컨테이너 같음 유무  (공통: 로우블럭X)
            if (equelRowCantiner) {
                
                // [O, O, -, -] : 레코드 유무-O
                if (info.hasRecord) {
                    
                    // 로우 블럭 제거 로직
                    this._removeManager(pTableName, pIdx);

                // [O, X, -, -] :  레코드 유무-X   
                } else {

                    // [O, X, X, O]  레코드 서브 무조건 없음 - 컬럼서브슬롯-O
                    if (info.hasColumnSubSlot) {
                        this._removeManager(pTableName, pIdx, i, pDataRow);
                    // [O, X, X, X]  레코드 서브 무조건 없음 - 컬럼서브슬롯-X   
                    } else {
                        for (var i = 0; i < pDataRow.length; i++) {
                            this._removeManager(pTableName, pIdx, i, pDataRow);
                        }
                    }
                }

            // [X, -, -, -] : 레코드 != 메인컨테이너
            } else {

                // [X, O, -, -] : 레코드 유무-O  (레코드 무조건 있음)
                if (info.hasRecord) {
                    this._removeManager(pTableName, pIdx);
                }            
            }
        }        

        ContainerAdapter.prototype._replaceContainer = function(pTableName, pDataRow, pIdx) {
            
            // TODO: 삭제 후 생성 (테스트 필요)
            this._removeContainer(pTableName, pDataRow, pIdx);
            this._createContainer(pTableName, pDataRow, pIdx);
        };

        // ContainerAdapter.prototype._removeContainer = function(pTableName, pDataRow, pIdx) {
        //     // TODO: 삭제 로직 (테스트 필요)
        //     this._removeContainer(pTableName, pDataRow, pIdx);
        // };

        ContainerAdapter.prototype._selectContainer = function(pTableName, pDataRow, pIdx) {
            // TODO: 조회 로직
        };

        ContainerAdapter.prototype._recordManager = function(pTableName, pDataRow) {

            var info            = this._getTableInfo(pTableName);
            var createRow       = this._createRecord(pTableName);

            // 분기 : 레코드 생성 | 레코드슬롯 생성
            if (info.hasRecordSubSlot) {
                this._createRecordSubSlot(createRow.recordSlot, pTableName, pDataRow);
            } else {
                this._columnManager(createRow.recordSlot, pTableName, pDataRow);
            }
            return createRow.record;
        };

        ContainerAdapter.prototype._createRecord = function(pTableName) {
            
            var info                = this._getTableInfo(pTableName);
            var equelRowCantiner    = this._equelRowCantiner(pTableName);
            var record              = null;
            var recordSlotSelector  = null;
            // var slotSelector        = null;
            var recordSlot          = null;

            // 레코드는 복제해서 생성
            if (equelRowCantiner) {
                record              = this.template._element.cloneNode(true);
                recordSlotSelector  = this.tables[pTableName].mainSlotSelector
                recordSlot          = L.web.querySelecotrOuter(record, recordSlotSelector);
            } else {
                record              = this.tables[pTableName].record._element.cloneNode(true);
                recordSlotSelector  = this.tables[pTableName].record.slotSelector;
                recordSlot          = L.web.querySelecotrOuter(record, recordSlotSelector);
            }

            return {
                record: record,
                recordSlotSelector: recordSlotSelector,
                recordSlot: recordSlot
            };
        };

        ContainerAdapter.prototype._createRecordSubSlot = function(pSlot, pTableName, pDataRow) {

            // 컬럼 메니저 호출
            // TODO: 레코드 for
            var column = this._columnManager(pSlot, pTableName, pDataRow);

        };

        // 레코드가 유무와 상관없이 호출함
        ContainerAdapter.prototype._columnManager = function(pSlot, pTableName, pDataRow) {
            
            var hasColumnSubSlot    = this.tables[pTableName].column.subSlot;
            var column              = null;
            var equelRowCantiner    = this._equelRowCantiner(pTableName);


            // 분기 : 컬럼 생성 | 컬럼서브슬롯 생성
            if (hasColumnSubSlot) {
                column = this._createColumnSubSlot(pTableName, pDataRow);
                pSlot.appendChild(column);
            
            } else {
                for (var i = 0; i < pDataRow.length; i++) {
                    column = this._createColumn(pTableName, pDataRow[i], pDataRow);
                    pSlot.appendChild(column);
                }
            }
        };

        ContainerAdapter.prototype._createColumn = function(pTableName, pRowValue, pDataRow) {
            
            var column              = this.tables[pTableName].column._element;
            var columnSlotSelector  = this.tables[pTableName].column.slotSelector;;
            var columnCallback      = this.tables[pTableName].column._callback;
            var columnIdx           = pDataRow.indexOf(pRowValue);
            var columnClone         = column.cloneNode(true);
            var columnChild         = null;
            var columnCloneSlot     = null;

            columnCloneSlot = L.web.querySelecotrOuter(columnClone, columnSlotSelector);
            columnChild     = this._callbackManager(columnSlotSelector, columnCallback, pRowValue, columnIdx, pDataRow, columnCloneSlot);
            
            if (columnChild) {
                columnCloneSlot.appendChild(columnChild);
            }

            return columnClone;
        };

        ContainerAdapter.prototype._createColumnSubSlot = function(pTableName, pDataRow) {
            
            var column              = this.tables[pTableName].column._element;
            var columnSubSlot       = this.tables[pTableName].column.subSlot;
            var columnClone         = column.cloneNode(true);
            var columnChild         = null;
            var columnCloneSlot     = null;
            var columnCallback      = null;
            var columnName          = "";
            var columnIdx           = -1;
            var rowValue            = "";

            for (var i = 0; i < columnSubSlot.length; i++) {

                // REVIEW: 확인필요
                columnCloneSlot      = L.web.querySelecotrOuter(columnClone, columnSubSlot[i].selector); 
                // columnCloneSlot     = columnClone.querySelector(columnSubSlot[i].selector);
                columnName    = columnSubSlot[i].name;
                columnIdx     =  columnName ? pDataRow.indexOf(pDataRow[columnName]) : -1;
                columnIdx     = (columnIdx <= 0 && columnSubSlot[i].idx) ? columnSubSlot[i].idx : columnIdx;

                if (columnIdx >= 0) {
                    rowValue        = pDataRow[columnIdx];
                    columnCallback  = columnSubSlot[i].callback;
                    columnChild     = this._callbackManager(columnSubSlot[i].selector, columnCallback, rowValue, columnIdx, pDataRow, columnCloneSlot);
                } else {
                    console.log('서브 슬록 없음' + i);
                }
                
                // 요소가 있는 경우 (속성값의 경우 요소가 아님)
                if (columnChild) {
                    columnCloneSlot.appendChild(columnChild);
                }
                
            }
            return columnClone;
        };

        /**
         * ******************************************
         * Public 메소드
         * ******************************************
         */

        // 컨테이너 객체 초기화
        ContainerAdapter.prototype.clear = function() {
            this.putElement     = null;     // 붙일 위치
            this.element        = null;
            this.template       = new TemplateElement(this);
            this.tables         = new LArray();
        };

        // 쉐도우돔 설정
        // 주의! : update 호출전에 사용해야함
        ContainerAdapter.prototype.setShadow = function(pIsShadow) {



            if (!this._isShadow && pIsShadow) {
                this.putElement = this.putElement.createShadowRoot();
            } else if (this._isShadow && !pIsShadow) {
                this.putElement = this.putElement.querySelector("*"); // 부모 벗겨냄
            }
           
            this._isShadow = pIsShadow;  // 상태 저장
        };        

        // insertTable => 이름 교체 됨
        ContainerAdapter.prototype.setTableSlot = function(pTableName, pSelector) {
            
            var _refElem = null;
            var tableObject = {};

            // this.template.element 선택슬롯을 잘라냄
            L.web.cutElement(this.template._element, pSelector, true);

            // TODO: 필수 값 처리,  selector 는 없을때 로직
            // TODO: _refElem null 예외처리
            _refElem = L.web.querySelecotrOuter(this.template._element, pSelector);

            tableObject.mainSlot = _refElem;
            tableObject.mainSlotSelector = pSelector;
            tableObject.record = new TemplateSlotElement(this, "record");
            tableObject.column = new TemplateSlotElement(this, "column");
            tableObject.beforeRecord = this._beforeRecord(tableObject);
            tableObject.recordCount = 0;
            
            // TODAY: 작업중
            tableObject.rows = [];

            this.tables.pushAttr(tableObject, pTableName);
        };        

        
        ContainerAdapter.prototype.deleteTable = function(pTableName) {
            this.tables.popAttr(pTableName);
        };

        // 컨테이너 객체 초기화
        ContainerAdapter.prototype.import = function(pObject) {
            
            this.template.importSlot(pObject);
            if (this.putElement === null) {
                this._importTemp = pObject;
                // pObject.outerHTML = "<div id='abcd'>a</div>";
                // this.putElement = pObject;
            }
            // pObject.outerHTML = '<div></div>';
        };

        ContainerAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx) {
            this._createContainer(pTableName, pDataRow, pIdx);
            
            this._event.publish("inserted");
            
            // TODO: 조견별 결과 필요
            return true;
        };

        ContainerAdapter.prototype.deleteCommand = function(pTableName, pDataRow, pIdx) {
            this._removeContainer(pTableName, pDataRow, pIdx);
            
            this._event.publish("deleted");

            // TODO: 조견별 결과 필요
            return true;
        };

        ContainerAdapter.prototype.updateCommand = function(pTableName, pDataRow, pIdx) {
            this.replaceContainer(pTableName, pDataRow, pIdx);
            
            this._event.publish("updated");

            // TODO: 조견별 결과 필요
            return true;
        };

        ContainerAdapter.prototype.selectCommand = function(pTableName, pDataTable) {
            
            // TODO: 입력값을 뭐로 할지 선택
            this._selectContainer(pTableName, pDataRow, pIdx);
            
            this._event.publish("selected");
            
            // TODO: 조견별 결과 필요
            return true;
        };

    }());

    
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // pObjct : Element, selector => X 없음
    // 종속성 : DOM Element
    // TODO: Selector 필수 값 처리
    // function Table(pSelector, precord, pcolumn) {
        
    //     // this.containerElement   = pContainerElement || new TemplateElement();
    //     var _refElem = null;
        
    //     _refElem = L.web.querySelecotrOuter(this.element, pSelector);
        
    //     this.mainSlot           = _refElem;
    //     this.record      = precord ||  new TemplateElement();
    //     this.column      = pcolumn ||  new TemplateElement();

    //     // TODO:  refElem 없을시 오류 처리
    // }
    // (function() {   // prototype 상속
        
    // }());

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // pObjct : Element, selector => X 없음
    // 종속성 : DOM Element
    function TemplateElement(pOnwerContainerAdapter) {

        this.isDebug            = false;
        this._onwer             = pOnwerContainerAdapter;
        this._original          = null;         // 원본 템플릿 (import시점 유지)
        this._element           = null;

        this._event             = new Observer(this, this._onwer);    
        this.eventList      = ["succeed", "failed", "closed"];
    }
    (function() {   // prototype 상속


        // span 태그 기본으로 추가됨 (body 역활)
        function _importCommit(pObject) {

            var elem =  document.createElement('span');

            elem.innerHTML = pObject.nodeValue;
            elem = elem.querySelector("*"); // span 제거 할 경우

            return elem;
        }

        function _importScript(pObject) {

            var text  = pObject.text;
            var elem =  document.createElement('span');

            // 'beforebegin' :element 앞에 
            // 'afterbegin' : element 안에 가장 첫번째 child  [v]
            // 'beforeend' : element 안에 가장 마지막 child
            // 'afterend' : element 뒤에
            elem.insertAdjacentHTML('afterbegin', text);
            elem = elem.querySelector("*"); // span 제거 할 경우

            return elem;
        }

        /**
         * <template> import
         * @param {*} pObject 
         * @example
         * - ie 등 호환성 이슈 있음 !!
         * - 일부브라우저 polyfill 필요함
         */
        function _importTemplate(pObject) {
            
            var content     = pObject.content;
            var clone       =  document.importNode(content, true);
            var elem        =  document.createElement('span');

            elem.appendChild(clone);
            elem = elem.querySelector("*"); // 일반처리는 span 을 벗겨냄
            
            return elem;
        }

        function _importElement(pObject) {
            
            return pObject.cloneNode(true);
        }

        function _importText(pObject) {
            var text  = pObject;
            var elem =  document.createElement('span');
            
            elem.innerHTML = pObject;
            elem = elem.querySelector("*");

            return elem;
        }

        // 초기화
        TemplateElement.prototype.clear = function() {
            
            this._original          = null;
            this._element           = null;
        };

        // 컬럼의 경우 셀렉터를 배열 형태로 넘겨서 매칭함
        /*
            - 1: 컬럼명으로 셀렉터 지정 (우선순위 높음)
            - 2: 인덱스로 셀렉터 지정
            - 3: 중복해서 적용한 경우
            - 4: 기본값으 경우
        */
        var SubSlot = [
            {
                name: "p1_name",                                    // 우선 순위 idx 보다 높음
                idx: -1,                                            // name 또는 idx 중 선택해야함            

                selector: "li #a1",
                callback: function(pValue, pSlotElem, pRow) {}      // 선택값
            }
        ];


        TemplateElement.prototype.importSlot = function(pObject) {
            
            var elem        = null;

            // 슬롯 초기화
            this.clear();

            // 텍스트  <테스트>
            if (typeof pObject === "string") {
                elem = _importText(pObject);

            // 주석 <!-- -->      
            } else if (pObject.nodeType === 8) {
                elem = _importCommit(pObject);

            // <요소><!-- --></요소>   : 요소뒤 주석
            } else if (pObject.firstChild && pObject.firstChild.nodeType === 8) {      
                elem = _importCommit(pObject.firstChild);

            // 스크립트 <script>
            } else if (pObject instanceof HTMLScriptElement) {      
                elem = _importScript(pObject);

            // 템플릿 <template>
            // TODO: 태그 이름으로 해야함,  IE 호환성 이슈
            } else if (pObject.content) {
                elem = _importTemplate(pObject);

            // HTML 요소 <요소>
            } else if (pObject instanceof HTMLElement) {
                elem = _importElement(pObject);

            } else {
                throw new Error('pObject 타입 오류 : pObject=' + pOriginal);
            }
            
            // 리턴 및 this 설정
            this._element   = elem;
            this._original  = elem.cloneNode(true); // 복제본 삽입


            if (elem) {
                this._event.publish("succeed");
            } else {
                this._event.publish("failed");
            }
            this._event.publish("closed");

            return elem;
        }

        // 이벤트 등록
        // TODO: 확인필요
        TemplateElement.prototype.onEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.subscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

        // 이벤트 해제
        // TODO: 확인필요
        TemplateElement.prototype.offEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.unsubscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

    }());

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // pObjct : Element, selector => X 없음
    // 종속성 : DOM Element
    // TODO: Selector 필수 값 처리
    // function Table(pSelector, precord, pcolumn) {
        
    //     // this.containerElement   = pContainerElement || new TemplateElement();
    //     var _refElem = null;
        
    //     _refElem = L.web.querySelecotrOuter(this.element, pSelector);
        
    //     this.mainSlot           = _refElem;
    //     this.record      = precord ||  new TemplateElement();
    //     this.column      = pcolumn ||  new TemplateElement();

    //     // TODO:  refElem 없을시 오류 처리
    // }
    // (function() {   // prototype 상속
        
    // }());

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // pObjct : Element, selector => X 없음
    // 종속성 : DOM Element
    function TemplateSlotElement(pOnwerContainerAdapter, pAttrName) {
        TemplateElement.call(this, pOnwerContainerAdapter);  // ### prototype 상속 ###
        
        this.name               = pAttrName;
        this._callback          = null;
        this.slot               = null;
        this.slotSelector       = null;
        this.subSlot            = null;

        // this.deep       = pIsDeep || true;       // REVIEW : 불필요 

        // 객체 생성 빌더
        // if (typeof pObject === "string") {
        //     _elemTemp = document.querySelector(pObject);
        // }
        // if (pObject instanceof Element) {
        //     _original = pObject.cloneNode(this.deep);
        //     this.element = _original.cloneNode(this.deep);
        // } else {
        //     throw new Error('pObject 오류 : pObject=' + pObject);
        //     return null;
        // }

    }
    (function() {
        // ### prototype 상속 ###
        TemplateSlotElement.prototype =  Object.create(TemplateElement.prototype); // Array 상속
        TemplateSlotElement.prototype.constructor = TemplateSlotElement;
        TemplateSlotElement.prototype.parent = TemplateElement.prototype;

        // ### 메소드 ###

        // 초기화
        // 오버라이딩
        TemplateSlotElement.prototype.clear = function() {
            this.parent.clear.call(this);    // 오버라이딩 메소드 호출
            
            this._callback          = null;
            this.slot               = null;
            this.slotSelector       = null;
            this.subSlot            = null;
        };

        // (시작위치, 슬롯위치)
        // TemplateSlotElement.prototype.setSlot = function(pSelector, pIsCut, pCallback) {
        TemplateSlotElement.prototype.setSlot = function(pSelector, pSlotSelector, pCallback) {
            
            var elem            = null;
            var CA_original     = this._onwer.template._original;  // 컨테이너 원본
            var clone           = CA_original.cloneNode(true);
            var _refElem        = null;

            if (!pSelector) {
                throw new Error('오류 필수값: pSelector= ' + pSelector);
            }

            // 슬롯 초기화
            this.clear();
            pSlotSelector = pSlotSelector || pSelector;

            this._original  = L.web.querySelecotrOuter(clone, pSelector);
            this._element   = this._original.cloneNode(true); // 복제본 삽입


            // 서브슬롯 (배열형태)
            // REVIEW: 서브슬롯은 커팅을 안하는데 확인 필요
            if (pSlotSelector instanceof Array) {

                if (pSlotSelector[0].selector) {
                    this.subSlot = pSlotSelector;

                    // TODO:  레코드 서브 슬롯을 사용할경우  if (this.name === "record") { } 로직 삽입필요

                } else {
                    throw new Error('subSlot 형식 오류 :');                
                }

            } else if(typeof pSlotSelector === "string") {
                
                // 레코드는 자동 커팅
                if (this.name === "record") {
                    this._element   = L.web.cutElement(this._element, pSlotSelector, true);
                }
                _refElem = L.web.querySelecotrOuter(this._element, pSlotSelector);

                this.slot = _refElem;
                this.slotSelector = pSlotSelector;            

            } else {
                this.defaultSetSlot();
            }

            // TODO: callback 온 경우 컬럼인 경우인지 확인 검사        
            if (typeof pCallback === "function") {
                this._callback = pCallback;
            }
        }

        // (pObject요소 [, 슬롯선택자 | {서브슬롯선택자}, 콜백] )
        TemplateSlotElement.prototype.importSlot = function(pObject, pSlotSelector, pCallback) {
            
            var elem        = null;
            var _refElem    = null;

            // 슬롯 초기화
            this.clear();

            // 오버라이딩 부모 메소드 호출
            elem = this.parent.importSlot.call(this, pObject);

            if (!(elem instanceof HTMLElement)) {
                throw new Error('오류 HTMLElement 타입아님 ' + elem);
            }

            // 서브슬롯 (배열형태)
            // REVIEW: 서브슬롯은 커팅을 안하는데 확인 필요
            if (pSlotSelector instanceof Array) {

                if (pSlotSelector[0].selector) {
                    this.subSlot = pSlotSelector;
                } else {
                    throw new Error('subSlot 형식 오류 :');                
                }

            } else if(typeof pSlotSelector === "string") {

                this._element = L.web.cutElement(this._element, pSlotSelector, true);
                _refElem = L.web.querySelecotrOuter(this._element, pSlotSelector);

                this.slot = _refElem;
                this.slotSelector = pSlotSelector;            

            } else {
                this.defaultSetSlot();
            }

            // TODO: callback 온 경우 컬럼인 경우인지 확인 검사        
            if (typeof pCallback === "function") {
                this._callback = pCallback;
            }

            return elem;
        }

        // TODAY: 테스트후 삭제
        TemplateSlotElement.prototype.__importSlot = function(pObject, pSelector, pCallback, pSubSlot) {
            
            var elem        = null;

            // 슬롯 초기화
            this.clear();

            // 오버라이딩 부모 메소드 호출
            elem = this.parent.importSlot.call(this, pObject);


            // 셀렉터 있는 경우 main 이외
            // !! 서브셀렉터느 안됨.
            if (pSelector && !pSubSlot) {
                
                L.web.cutElement(this._element, pSelector, true);
                
                var _refElem = null;

                _refElem = L.web.querySelecotrOuter(this._element, pSelector);

                this.slot = _refElem;
                this.slotSelector = pSelector;            
            }

            // TODO: callback 온 경우 컬럼인 경우인지 확인 검사        
            if (typeof pCallback === "function") {
                this._callback = pCallback;
            }

            if (pSubSlot) {
                if (pSubSlot instanceof Array && pSubSlot[0].selector) {
                    this.subSlot = pSubSlot;
                } else {
                    throw new Error('subSlot 형식 오류 :');                
                }
            }

            return elem;
        }


        // 슬롯이 추가되고 자식은 삭제됨
        TemplateSlotElement.prototype._setSlot = function(pSelector) {
            
            var refElem = null;
            
            // 레퍼방식으로 querySelector        
            refElem = L.web.querySelecotrOuter(this._element, pSelector);
            this.slot = refElem;
            this.slotSelector = pSelector

            // 자식 노드 삭제
            var maxLength = refElem.childNodes.length;
            for (var i = maxLength - 1; i >= 0; i--) {  // NodeList 임
                refElem.removeChild(refElem.childNodes[i]);
            }
        };

        
        // 최상위를 슬롯 배치
        TemplateSlotElement.prototype.defaultSetSlot = function() {
            
            var firstNodeSelector = "";

            if (this._original) {

                firstNodeSelector = String(this._original.nodeName);
                firstNodeSelector = firstNodeSelector.toLowerCase();
                this._setSlot(firstNodeSelector);

                return true;

            } else {
                // 에외 처리
            }
            return false;
        }
        
        // 슬롯이 삭제되고 원본에서 자식이 복구됨
        // TODO: 삭제 대기
        TemplateSlotElement.prototype.deleteSlot = function(pSlotName) {
            
            var selector = this.slot[pSlotName].S_Selector;
            var refElem = this._element.querySelector(selector);
            var orgElem = this._original.querySelector(selector);

            // 슬롯 삭제
            for (var i = 0; i < refElem.length; i++) {  // NodeList 임
                refElem.removeChild(refElem.childNodes[i]);
            }
            
            // 슬롯 삭제
            this.slot.popAttr(pSlotName);

            // 기존 복구
            for (var i = 0; i < orgElem.length; i++) {  // NodeList 임
                this._element.appendChild(orgElem.childNodes[i]);
            }

        };
        
        // css class 등록
        TemplateSlotElement.prototype.insertCSS = function(pDataSet, pClassName) {};
        
        // css class 제거
        TemplateSlotElement.prototype.deleteCSS = function(pDataSet, pClassName) {};

    }());


    // 배포 (RequireJS 용도)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports      = ContainerAdapter;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }
    // 전역 배포
    _G.ContainerAdapter     = ContainerAdapter;
    _G.TemplateElement      = TemplateElement;

}(this));