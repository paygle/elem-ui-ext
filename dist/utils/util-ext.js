'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _cacheUtil = require('./cache-util');

var cacheUtil = _interopRequireWildcard(_cacheUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 缓存工具类，从 store 目录转移
var $ = window.$ || window.jQuery || console && console.warn('Need jQuery lib pre.');
var API_URL = window.API_URL || "";
/**
 * Created by wangjingl@sunline.cn on 2016/12/1.
 */
//框架通用工具类
exports.default = {
  consts: {
    STATUS_SUCCESS: "0",
    STATUS_ERROR: "error",
    STATUS_NORMAL: "normal",
    STATUS_INSERT: "insert",
    STATUS_UPDATE: "update",
    STATUS_DELETE: "delete",
    STATUS_TIMEOUT: "sessionTimeout",
    UID: 0
  },
  noop: function noop() {
    //空白function
  },
  /**
   * 比较两个js对象的内容是否相同
   * @param x
   * @param y
   * @returns {boolean}
   */
  isObjectValueEqual: function isObjectValueEqual(x, y) {
    // If both x and y are null or undefined and exactly the same
    if (x === y) {
      return true;
    }

    // If they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }

    // They must have the exact same prototype chain, the closest we can do is
    // test the constructor.
    if (x.constructor !== y.constructor) {
      return false;
    }

    for (var p in x) {
      // Inherited properties were tested using x.constructor === y.constructor
      if (x.hasOwnProperty(p)) {
        // Allows comparing x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
          return false;
        }

        // If they have the same strict value or identity then they are equal
        if (x[p] === y[p]) {
          continue;
        }

        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (_typeof(x[p]) !== "object") {
          return false;
        }

        // Objects and Arrays must be tested recursively
        if (!Object.equals(x[p], y[p])) {
          return false;
        }
      }
    }

    for (p in y) {
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  },
  /**
   * 与后台通信的ajax请求封装
   */
  request: function request(options) {
    var self = this;
    /**
     * 请求成功回调方法 (内部方法)
     * @param options 配置选项
     * @param jqXHR XMLHttpRequest
     * @param textStatus "success", "notmodified", "error", "timeout", "abort", or "parsererror"
     * @param data 服务器返回数据 json对象
     */
    var _onSuccess = function _onSuccess(options, jqXHR, textStatus, data) {
      if ($.isFunction(options.onSuccess)) {
        // 回调自定义的成功处理方法
        options.onSuccess(jqXHR, textStatus, data);
      }
    };

    /**
     * 请求失败回调方法 (内部方法)
     * @param options 配置选项
     * @param jqXHR XMLHttpRequest
     * @param textStatus "success", "notmodified", "error", "timeout", "abort", or "parsererror"
     * @param data 服务器返回数据 json对象
     */
    var _onError = function _onError(options, jqXHR, textStatus, data) {
      var errorMsg = data.message;
      // errorMsgDtl = data.detail_message;
      if ($.isFunction(options.onError)) {
        options.onError(jqXHR, textStatus, data);
      } else {
        alert(errorMsg ? errorMsg : "发生异常，请稍候重试");
      }
    };

    options = $.extend({
      // 请求路径
      url: "core/router",
      // 是否异步请求
      async: true,
      // 请求数据模型
      model: {},
      // 后台返回的数据类型
      dataType: "text",
      //是否显示loading消息(undefined:请求超过1秒时自动显示，true自动立即显示，false不显示)
      showLoading: undefined,
      //loading消息内容
      loadingMessage: '处理中，请稍后...',
      //loading消息多长时间后自动关闭，0表示不关闭（ajax请求完成时会自动关闭）
      loadingDelay: 0,
      /**
       * 请求成功回调方法
       * @param jqXHR XMLHttpRequest
       * @param testStatus "success", "notmodified", "error", "timeout", "abort", or "parsererror"
       * @param data 服务器返回数据 json对象
       */
      onSuccess: function onSuccess(jqXHR, textStatus, data) {},

      /**
       * 请求失败回调方法
       * @param jqXHR XMLHttpRequest
       * @param testStatus "success", "notmodified", "error", "timeout", "abort", or "parsererror"
       * @param data 服务器返回数据 json对象
       */
      onError: function onError(jqXHR, textStatus, data) {}

    }, options);

    if (options.url && options.url.indexOf(API_URL) != 0 && options.url.indexOf('http://') != 0 && options.url.indexOf('https://') != 0) {
      // 不是以上下文路径为开头的，则补充上上下文路径
      options.url = API_URL + options.url;
    }

    var _model = {
      "serviceId": options.serviceId,
      "tranCode": options.tranCode,
      "pageNo": options.pageNo,
      "pageSize": options.pageSize,
      "codelistIds": options.codelistIds,
      "model": options.model
    };
    return $.ajax(options.url, {
      async: options.async,
      type: "POST",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      dataType: options.dataType,
      xhrFields: { //跨域发送Ajax时，Request header中便会带上 Cookie 信息
        withCredentials: true
      },
      headers: {
        "X-Custom-Header": "Ajax"
      },
      data: JSON.stringify(_model),
      success: function success(data, textStatus, jqXHR) {
        var outputModel = null;
        try {
          outputModel = JSON.parse(jqXHR.responseText);
        } catch (e) {
          // 回调错误处理方法
          _onError(options, jqXHR, "PARSERERROR", {
            message: "解析服务器返回数据失败（" + e + "）！",
            detail_message: "返回数据为: " + jqXHR.responseText
          });
          return;
        }
        if (outputModel.status == self.consts.STATUS_SUCCESS || outputModel.status == "S") {
          // 回调成功处理方法
          _onSuccess(options, jqXHR, "success", outputModel);
        } else {
          // 回调错误处理方法
          _onError(options, jqXHR, "error", outputModel);
        }
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        // 回调错误处理方法
        _onError(options, jqXHR, textStatus, {
          message: errorThrown
        });
      }
    });
  },
  /**
   * 判断一个变量是否是function类型
   */
  isFunction: function isFunction(fun) {
    return Object.prototype.toString.call(fun) === '[object Function]';
  },

  /**
   * 返回一个深拷贝的数据对象,自动去掉对象中的函数
   */
  getOriginalData: function getOriginalData(dataObj) {
    return JSON.parse(JSON.stringify(dataObj));
  },

  /**
   * 获取当前登陆用户对象
   */
  getCurrentUser: function getCurrentUser() {
    var oper = cacheUtil.getSessionOper();
    if (!oper) {
      $.ajax({
        url: API_URL + 'core/loadsession',
        async: false,
        type: "GET",
        dataType: 'json',
        xhrFields: { //跨域发送Ajax时，Request header中便会带上 Cookie 信息
          withCredentials: true
        },
        headers: {
          "X-Custom-Header": "Ajax"
        },
        success: function success(data, textStatus, jqXHR) {
          if (data && data.status == 'sessionTimeout') {
            alert(data.message);
          } else {
            oper = data;
          }
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        }
      });
    }
    if (oper) {
      oper.current_dept_code = oper.c_login_dept_code;
      oper.current_dept_name = oper.c_login_dept_name;
    }

    return oper;
  },

  /**
   * 合并js对象
   * 例如 var obj1={a:1},obj2={b:2}  mixinx({},obj1,obj2)将obj1和obj2合并到一个新的对象
   */
  mixins: function mixins(target) {
    for (var i = 1, j = arguments.length; i < j; i++) {
      var source = arguments[i] || {};
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var value = source[prop];
          if (value !== undefined) {
            target[prop] = value;
          }
        }
      }
    }
    return target;
  },
  changeDept: function changeDept(deptCode) {
    $.ajax({
      url: API_URL + 'core/changeDept',
      type: "GET",
      dataType: 'json',
      xhrFields: { //跨域发送Ajax时，Request header中便会带上 Cookie 信息
        withCredentials: true
      },
      headers: {
        "X-Custom-Header": "Ajax"
      },
      data: {
        deptCode: deptCode
      },
      success: function success(data, textStatus, jqXHR) {
        if (data.status == 'F') {
          alert(data.message);
        }
        window.top.location.reload();
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        window.top.location.reload();
      }
    });
  }
};