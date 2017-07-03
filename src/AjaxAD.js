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
    // @종속성 : DataAdapter, Ajax 관련, RequestInfo
    function AjaxAdapter() {
        DataAdapter.call(this); // ### 상속 ###
        
        this.isDebug        = false;
        this.xhr            = null;         // XMLHttpRequest
        this.tables         = new LArray();     // 테이블별 명령
        this.statusqueue    = [];      // send 결과
        this.isTransSend    = false;        // command 별 일괄 처리 여부
        this.isForced       = false;        // 일괄처리시 강제 완료 여부
        this._createHttpRequestObject();    // 객체 초기화 설정

        this.eventList.push("inserted", "deleted", "updated", "selected")
    }
    (function() {   
        // ### 상속 ###
        AjaxAdapter.prototype =  Object.create(DataAdapter.prototype);
        AjaxAdapter.prototype.constructor = AjaxAdapter;
        AjaxAdapter.prototype.parent = DataAdapter.prototype;    

        // ##### 메소드 ####

        // ajax 객체 생성 (브라우저별)
        AjaxAdapter.prototype._createHttpRequestObject = function() {

            var i, xhr, activeXids = [
                'MSXML2.XMLHTTP.3.0',
                'MSXML2.XMLHTTP',
                'Microsoft.XMLHTTP'
            ];

            if (typeof XMLHttpRequest === "function") { // native XHR
                this.xhr =  new XMLHttpRequest();        
            } else { // IE before 7
                for (i = 0; i < activeXids.length; i += 1) {
                    try {
                        this.xhr = new ActiveXObject(activeXids[i]);
                        break;
                    } catch (e) {}
                }
            }
        };
        
        // [일괄처리] 동일 command 여부 검사
        AjaxAdapter.prototype._checkTransCommand = function() {
            return true;
        };

        // 명령 공통 처리
        AjaxAdapter.prototype._command = function(pCommand, pTableName, pDataRow, pIdx) {

            // 분기 : 일괄 처리
            if (this.isTransSend) {
                
            // 분기 : 단일 처리
            } else {

                // 명령 종류 검사 (동일타입)
                if (this._checkTransCommand()) {

                    switch (pCommand) {
                        case "INSERT":   // update() commanad
                            this.tables[pTableName].insert.addCollection({idx: pIdx});
                            this.tables[pTableName].insert.setRowCollection(pDataRow);
                            this.tables[pTableName].insert.send();
                            break;
                        case "DELETE":   // update() commanad
                            this.tables[pTableName].delete.addCollection({idx: pIdx});
                            this.tables[pTableName].delete.setRowCollection(pDataRow);
                            this.tables[pTableName].delete.send();
                            break;
                        case "UPDATE":   // update() commanad
                            this.tables[pTableName].update.addCollection({idx: pIdx});
                            this.tables[pTableName].update.setRowCollection(pDataRow);
                            this.tables[pTableName].update.send();
                        //     break;
                        // case "SELECT":   // fill() commanad
                        //     this.tables[pTableName].select.addCollection({idx: pIdx});
                        //     this.tables[pTableName].select.setRowCollection(pDataRow);
                        //     this.tables[pTableName].select.send();
                        //     break;
                        default:
                            throw new Error('cmd 에러 발생 cmd:' + cTables[i].cmd);
                    }                

                } else {
                    throw new Error('command 동일 타입 오류 : ');
                }
            }
        };
        
        // 테이블 등록
        AjaxAdapter.prototype.insertTable = function(pTableName) {
            
            var tableObject = {};
            
            tableObject.insert = new RequestInfo(this, "INSERT");
            tableObject.delete = new RequestInfo(this, "DELETE");
            tableObject.update = new RequestInfo(this, "UPDATE");
            tableObject.select = new RequestInfo(this, "SELECT");
            
            this.tables.pushAttr(tableObject, pTableName);
        };
        
        // 테이블 삭제
        AjaxAdapter.prototype.deleteTable = function(pTableName) {
            this.tables.popAttr(pTableName);
        };
        
        // ****************
        // 추상 메소드 구현
        AjaxAdapter.prototype.insertCommand = function(pTableName, pDataRow, pIdx) {

            this.tables[pTableName].insert.onEvent("closed", function() {
                this._event.publish("inserted");
            });

            return this._command("INSERT", pTableName, pDataRow, pIdx);

            // this._event.publish("inserted");
        };
        
        AjaxAdapter.prototype.deleteCommand = function(pTableName, pDataRow, pIdx) {
            
            this.tables[pTableName].delete.onEvent("closed", function() {
                this._event.publish("deleted");
            });        
        };
        
        AjaxAdapter.prototype.updateCommand = function(pTableName, pDataRow, pIdx) {
            
            this.tables[pTableName].update.onEvent("closed", function() {
                this._event.publish("updated");
            });
        };
        
        AjaxAdapter.prototype.selectCommand = function(pTableName, pDataTable) {
            
            this.tables[pTableName].select._dataTable = pDataTable;

            // 놀리적으로 삭제가 맞을듯
            // TODO: 검토는 필요
            // this.tables[pTableName].select.addCollection({idx: pIdx});   
            // this.tables[pTableName].select.setRowCollection(pDataRow);        
            this.tables[pTableName].select.onEvent("closed", function() {
                this._event.publish("selected");
            });
            this.tables[pTableName].select.send();
        };

    }());


    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // @종속성 : Ajax 관련, JQuery 
    // TODO : JQuery 종송성 끊어야 함
    function RequestInfo(pOnwerAjaxAdapter, pCommandName) {
        
        this.isDebug            = false;
        this._onwer             = pOnwerAjaxAdapter;
        this._bodyCollection    = new LArray();
        this._headCollection    = new LArray();
        this._dataTable         = null;
        this._method            = "GET";
        this.command            = pCommandName;   
        this.fnRowMap           = null;     // fn(value, name, rows) return Value
        this.fnRowFilter        = null;     // fn(value, name, rows) return Boolean
        this.fnCallback         = null;     // fn(pEvent, pCount, pRows, pXhr)
        this.url                = null;
        this.header             = [];
        this.async              = true;     // true:비동기화,  false:동기화
        this.resultCount       = false;    // TODO: 비동기시 상태 갱신 시 옵서버 패턴 검토

        this._event         = new Observer(this, this._onwer);
        this.eventList      = ["succeed", "failed", "closed"];
        this.onSucceed          = null;     // TODO: send 성공 콜백
        this.onFailed           = null;     // TODO: send 실패 콜백

    }
    (function() {   // prototype 상속


        // row 변형 콜백 후 리턴
        RequestInfo.prototype._rowsMap = function() {};
        
        // row 필터 콜백 후 리턴
        RequestInfo.prototype._rowsFilter = function() {};
        
        // 콜백
        RequestInfo.prototype._callback = function() {};

        // xhr에 해더 설정
        RequestInfo.prototype._loadHeader = function(pXhr) {
            for (var i = 0; i < this.header.length; i++) {
                pXhr.setRequestHeader(this.header[i].name, this.header[i].value);
            }
        };
        
        RequestInfo.prototype._sendConfig = function() {

            var xhr             = this._onwer.xhr;
            var text            = "";
            var _this           = this;
            var arrLine         = null;

            xhr.onreadystatechange = function(pEvent) {

                var json    = {};
                var xml     = null;
                var result  = null;
                var rows    = null;
                var row     = null;
                var count   = 0;
                var dr      = null;

                if (this.readyState === 4 && this.status === 200) {
                    
                    
                    // XML => JSON 변환
                    if (this.responseXML) {
                        xml = this.responseXML;
                        json = $.xml2json(xml);

                        // json.result =  json.result || {};
                    
                    // 텍스트 => JSON 변환
                    } else {
                        
                        // TODO: 공백줄제거 기능 추가 
                        arrLine = this.responseText.split("\n");
                        
                        json = {};
                        json.rows = [];

                        // TODO: 줄 밑에 공백 제거 필요함
                        for (var i = 0; i < arrLine.length; i++) {
                            row = _this.stringToJson(arrLine[i]);
                            if (row) json.rows.push(row);
                        }
                        json.count = json.rows.length;
                    }

                    // 분기 : 콜백으로 처리 
                    if (typeof _this.fnCallback === "function") {
                        _this.resultCount = _this.fnCallback.call(_this, pEvent, json, rows, _this._dataTable);  // pEvent, count, rows
                    
                    // 분기 : 내부 정해진 규칙으로 처리
                    } else {
                        _this.resultCount = Number(json.count) ? json.count : 0;

                        // SELECT 모드일 경우
                        if (_this.command === "SELECT") {
                            for (var i = 0; i < json.rows.length; i++) {
                                dr = _this._dataTable.newRow();
                                for (var key in json.rows[i]) {
                                    if ( json.rows[i].hasOwnProperty(key)){
                                        dr[key] = json.rows[i][key];
                                    }
                                }
                                _this._dataTable.rows.add(dr);
                            }
                        }
                    }

                    count   = json.count || 0;
                    rows    = json.rows || [];

                    // 동기화 이슈로 콜백으로 우회 처리
                    // TODO: 개선안 또는 구조 검토 필요
                    // 분기 : 성공시 콜백
                    if (count > 0 && typeof _this.onSucceed === "function") {

                        // TODO: 전달 항목 정의 필요
                        _this.onSucceed.call(_this, json);   
                    }
                    
                    // 실패시 처리 이벤트 매핑
                    _this._event.subscribe("failed", function() {
                        if ( typeof _this.onFailed === "function") {
                            _this.onFailed.call(_this, json);
                        }
                    });

                    if (count > 0) {
                        _this._event.publish("succeed");
                    } else {
                        _this._event.publish("failed");
                    }

                    _this._event.publish("closed");
                }
            };
        };

        // GET 방식으로 전송
        RequestInfo.prototype._send_GET = function(pCollection) {
            
            var xhr             = this._onwer.xhr;
            var url             = "";
            
            // send 공통 구성
            this._sendConfig();
            
            // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
            this.url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);


            if (this.url.indexOf("?") > 0) {
                url = this.url + "&" + pCollection;
            } else {
                url = this.url + "?" + pCollection;
            }
            url = encodeURI(url);                       // url = escape(url);
            
            xhr.open("GET", url, this.async);
            this._loadHeader(xhr);
            xhr.send();

            if  (url.length > 2083) {
                console.log(url);
                console.log('GET URL 길이 2083 초과 length:'+url.length);                    
            }
        };

        // POST 방식으로 전송
        RequestInfo.prototype._send_POST = function(pCollection) {
            
            var xhr             = this._onwer.xhr;
            var url             = "";

            // send 공통 구성
            this._sendConfig();
            
            // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
            url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);
            url = this.url;


            // if (pHeadCollection.indexOf("?") > 0) {
            //     url = this.url + "&" + pHeadCollection;
            // } else {
            //     url = this.url + "?" + pHeadCollection;
            // }
            url = encodeURI(url);                       // url = escape(url);
            
            xhr.open("POST", url, this.async);
            this._loadHeader(xhr);
            xhr.send(pCollection);
            // xhr.send();
        };

        // JSONP 방식으로 전송
        RequestInfo.prototype._send_JSONP = function(pCollection) {

            var script = document.createElement("script");
            var url             = "";
            var _event          = this._event;
            
            // 캐쉬방지  TODO:  이후에 상위로 빼던지 해야 함
            this.url = this.url + "?t=" + Math.floor((Math.random() * 10000) + 1);

            if (this.url.indexOf("?") > 0) {
                url = this.url + "&" + pCollection;
            } else {
                url = this.url + "?" + pCollection;
            }
            url = encodeURI(url);                       // url = escape(url);
            
            script.type = "text/javascript";
            script.src =url;
            document.head.appendChild(script);
            
            
            script.onload = function(e) {
                _event.publish("succeed");
                _event.publish("closed");
            }
            script.onerror = function(e) {
                _event.publish("failed");
                _event.publish("closed");
            }

            if  (url.length > 2083) {
                console.log(url);
                console.log('GET URL 길이 2083 초과 length:'+url.length);
            }
        };

        // 전송
        RequestInfo.prototype.send = function() {
            
            // var xhr             = this._onwer.xhr;
            // var url             = "";

            var headCollection  = this.LArrayToQueryString(this._headCollection);
            var bodyCollection  = this.LArrayToQueryString(this._bodyCollection);
            var collection      = headCollection ? headCollection + "&" + bodyCollection : bodyCollection;

            if (collection.endsWith("&")) {
                collection = collection.substring(0, collection.length - 1);
            }

            // 결과 초기화
            this.resultCount = 0;

            // TODO: 동기화 및 여러개 실행시 관련 검토 필요
            if (!this.url) {
                throw new Error('url 에러 발생 url:' + this.url);
            }

            switch (this._method) {
                
                case "GET":
                    this._send_GET(collection);
                    break;

                case "POST":
                    
                    this._send_POST(collection);
                    // this._send_POST(headCollection, bodyCollection);
                    break;

                case "JSONP":
                    this._send_JSONP(collection);
                    break;

                case "PUT":
                    
                    break;

                case "DELETE":
                    
                    break;

                default:
                    throw new Error('method 에러 발생 method:' + this._method, this.async);
            }
        };

        // row 컬렉션 설정
        // 
        RequestInfo.prototype.setRowCollection = function(pRow) {

            var key         = null;
            var value       = null;
            var isInclude   = true;

            if (pRow instanceof LArray) {
                for (var i = 0; i < pRow.length ; i++ ) {
                    key     = pRow.attributeOfIndex(i);
                    value   = pRow[i];
                    
                    // 전송 row 필터 콜백
                    if (typeof this.fnRowFilter === "function" ) {
                        isInclude = this.fnRowFilter.call(this, value, key, pRow);
                    }
                    
                    // 전송 row 변형 코랩ㄱ
                    if (typeof this.fnRowMap === "function" ) {
                        value = this.fnRowMap.call(this, value, key, pRow);
                    }

                    if (isInclude) {
                        this._bodyCollection.pushAttr(value, key);
                    }
                    
                }
            }
        };
        
        //
        RequestInfo.prototype.setJSONPCallback = function(pCallbackName, pCallback) {
            
            if (pCallbackName && typeof pCallback === "function") {
                // TODO: window 변경 필요  global...
                window[pCallbackName] = pCallback;
            }
        };


        // 헤더 설정
        RequestInfo.prototype.setHeader = function(pHeaderName, pHeaderValue) {
            
            var header = {
                name: pHeaderName,
                value: pHeaderValue
            };

            this.header.push(header);
        };


        
        // 전송방식 설정
        // pMethodName : GET, POST, PUT, DELETE, JSONP
        // 기본값 : GET
        RequestInfo.prototype.setMethod = function(pMethodName) {

            var methodList = ["GET", "POST", "JSONP", "PUT", "DELETE"];

            if (methodList.indexOf(pMethodName) > -1) {
                this._method = pMethodName;
            } else {
                throw new Error('method 에러 발생 method:' + pMethodName);
            }
        };
        
        RequestInfo.prototype.initCollection = function() {
            this._headCollection = new LArray();
        };

        // 전송 컬렉션 얻기
        // TODO: 필요성 확인
        RequestInfo.prototype.getCollection = function() {
            
            var headCollection = this.LArrayToQueryString(this._headCollection);
            var bodyCollection = this.LArrayToQueryString(this._bodyCollection);
            var collection      = headCollection ? headCollection + "&" + bodyCollection : bodyCollection;
            return collection;
        };
        
        // 전송 추가 컬렉션 (_rowsMap, _rowsFilter 비 적용됨)
        // pCollection : 객체 타입
        RequestInfo.prototype.addCollection = function(pCollection) {
            
            if (!(pCollection instanceof Object)) {
                throw new Error('pCollection 객체 타입 아님 오류 발생 pCollection:' + pCollection);
            }

            for (var key in pCollection) {
                if ( pCollection.hasOwnProperty(key)){
                    this._headCollection.pushAttr(pCollection[key], key);
                }
            }
        };

        // 문자열을 => JSON 변환
        // TODO: 전역 메소드 검토
        RequestInfo.prototype.stringToJson = function(pStr, pSeparator, pRowSeparator) {
            
            var list        = null;
            var listSub     = null;
            var json        = null;
            
            pRowSeparator   = pRowSeparator || "&";
            pSeparator      = pSeparator || "=";
            
            if (pStr === "") return null;
            // console.log('stringToJson.공백.');

            list        = pStr.split(pRowSeparator);

            for (var i = 0; i < list.length; i++) {
                listSub = list[i].split(pSeparator);
                if (listSub[0].length > 0 && listSub.length > 0) {
                    json = json || {};
                    json[listSub[0]] = listSub[1] ? listSub[1] : "";
                }
            }
            return json;
        };

        // queryString => JSON 변환
        RequestInfo.prototype.queryStringToJson = function(pQueryString) {
            return this.stringToJson(pQueryString, "&", "=");
        };
        
        RequestInfo.prototype.JsonToQueryString = function(pJSON) {

            var queryString = "";

            for (var key in pJSON) {
                if ( pJSON.hasOwnProperty(key)){
                    queryString += key + "=" + pJSON[key].toString() + "&";
                }
            }        
            return queryString;
        };

        RequestInfo.prototype.LArrayToQueryString = function(pLArray) {

            var queryString = "";
            var key         = null;
            var value       = null;

            for (var i = 0; i < pLArray.length; i++) {
                key     = pLArray.attributeOfIndex(i);
                value   = pLArray[i];
                queryString += key + "=" + pLArray[key].toString() + "&";
            }

            if (queryString.endsWith("&")) {
                queryString = queryString.substring(0, queryString.length - 1);
            }
            
            return queryString;
        };

        // 이벤트 등록
        RequestInfo.prototype.onEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.subscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

        // 이벤트 해제
        RequestInfo.prototype.offEvent = function(pType, pFn) {
            if (this.eventList.indexOf(pType) > -1) {
                this._event.unsubscribe(pFn, pType);
            } else {
                throw new Error('pType 에러 발생 pType:' + pType);
            }
        }

    }());


    // 배포 (RequireJS 용도)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports      = AjaxAdapter;
        _G = global;    // node 
    } else {
        _G = G;         // web
    }
    // 전역 배포
    _G.AjaxAdapter          = AjaxAdapter;

}(this));