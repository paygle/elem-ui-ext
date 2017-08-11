'use strict';

exports.__esModule = true;
exports.Browser = exports.isAuthorizedUrl = exports.Date2Week = exports.Date2String = exports.String2Date = exports.ObjectPlainIsEqual = exports.UniqueEditArray = exports.UniqueArray = exports.JsonToObject = exports.ToPlainObject = exports.TypeOf = exports.randomChar = exports.getFloatNumber = exports.cssUnitsCalc = exports.setLocalDataItem = exports.getLocalDataItem = exports.createDomElement = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 
 * @param tag 标签名
 * @param attrs 属性对象
 * @param children 子结点对象
 */
var createDomElement = exports.createDomElement = function createDomElement(tag, attrs, children) {
  var el = document.createElement(tag);
  if (attrs) {
    for (var key in attrs) {
      attrs.hasOwnProperty(key) && el.setAttribute(key, attrs[key]);
    }
  }
  if (children) {
    for (var i = 0, length = children.length; i < length; i++) {
      el.appendChild(children[i]);
    }
  }
  return el;
};

/**获取本地数据
 * @param  {} feild       数据字段名称
 * @param  {} dat         存入库名称
 * @param  {} validTime   有效时间间隔 1 个单位/小时
 */
var getLocalDataItem = exports.getLocalDataItem = function getLocalDataItem(field, dat, time) {
  var database = dat || 'default0';
  var validTime = time || 1;
  var between = 1000 * 3600 * validTime;
  var ctime = new Date().getTime();
  var data = JSON.parse(localStorage.getItem(database));
  var out = null;
  if (Object.prototype.toString.call(data) === '[object Object]' && data[field]) {
    out = data[field];
    if (!isNaN(out.save) && out.save - ctime < between) {
      return out.data;
    } else {
      delete data[field];
      localStorage.setItem(dat, JSON.stringify(data));
      out = data[field];
    }
  }
  return out;
};

/**存储为本地数据
 * @param  {} field          数据字段名称
 * @param  {} value          数据值
 * @param  {} dat='default0' 存入库名称
 * @param  {} validTime=1    有效时间间隔 1 个单位/小时
 */
var setLocalDataItem = exports.setLocalDataItem = function setLocalDataItem(field, value, dat, time) {
  var database = dat || 'default0';
  var validTime = time || 1;
  var between = 1000 * 3600 * validTime;
  var stime = new Date().getTime() + between;
  var data = null;
  try {
    data = JSON.parse(localStorage.getItem(database));
  } catch (e) {
    console.info(e);
  }
  if (Object.prototype.toString.call(data) === '[object Object]') {
    data[field] = {
      data: value,
      save: stime
    };
    localStorage.setItem(dat, JSON.stringify(data));
  } else {
    var defd = {};
    defd[field] = {
      data: value,
      save: stime
    };
    localStorage.setItem(dat, JSON.stringify(defd));
  }
};

/**
 * CSS样式计算器
 * operator [String]  操作符号 + - * /
 * unitA [String, Number]  单位操作数A  两个操作符号不同时以unitA的单位为准
 * unitB [String, Number]  单位操作数B  [* /] 操作时unitB参数必须是 Number类型 
 */
var cssUnitsCalc = exports.cssUnitsCalc = function cssUnitsCalc(operator, unitA, unitB) {

  if (operator && typeof unitA !== 'undefined' && typeof unitB !== 'undefined') {

    var regxNum = /^\-?\d+/g;
    var regxUnit = /[A-Za-z\-]+$/gi;
    var a_num = String(unitA).replace(regxUnit, '');
    var a_unit = String(unitA).replace(regxNum, '');
    var b_num = String(unitB).replace(regxUnit, '');

    if (!isNaN(b_num) && isNaN(a_num)) {
      return unitB;
    }
    if (!isNaN(a_num) && isNaN(b_num)) {
      return unitA;
    }
    if (isNaN(a_num) && isNaN(b_num)) {
      return '';
    }

    switch (operator) {
      case '+':
        return Number(a_num) + Number(b_num) + a_unit;
      case '-':
        return Number(a_num) - Number(b_num) + a_unit;
      case '*':
        return Number(a_num) * Number(b_num) + a_unit;
      case '/':
        return Number(a_num) / Number(b_num) + a_unit;
    }
  }
  return '';
};
/**
 * @author liuxp
 * 获取浮点数据值
 * precision [Number] 小数点后精度位数
 * value [Number, String] 数值或字符型数值
 * roundoff [Boolean] 是否四舍五入，默认false 直接舍弃多余部分
 * 返回类型浮点数字： [String]
 */
var getFloatNumber = exports.getFloatNumber = function getFloatNumber(precision, value, roundoff) {
  // 自定义 float 获取

  precision = !isNaN(precision) ? Number(precision) : 0;

  if (precision > 0 && !isNaN(value) && value !== '') {
    var strNums = String(value).split('.');
    var pnum = strNums[1] ? strNums[1] : [];
    var newPnum = '';

    strNums[0] = !isNaN(strNums[0]) ? Number(strNums[0]) : 0;

    for (var i = 0; i < precision; i++) {
      if (!isNaN(pnum[i])) {
        if (i === precision - 1 && pnum[i + 1] && roundoff) {
          // 四舍五入
          newPnum += Math.round(parseInt(pnum[i], 10) + parseInt(pnum[i + 1], 10) / 10);
        } else {
          newPnum += pnum[i];
        }
      } else {
        newPnum += '0';
      }
    }
    if (strNums.length === 2) {
      strNums.splice(1, 1, newPnum);
    } else {
      strNums[1] = newPnum;
    }
    return strNums.join('.');
  }
  return value;
};

/**
 * @author liuxp
 * 随机字符串生成函数
 * len [Number] 返回字符串长度, 默认 10 位
 * pre [String] 前缀字符串， 默认为空
 * 返回类型： String
 */
var randomChar = exports.randomChar = function randomChar(len, pre) {

  var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  var t = new Date().getTime();
  var ulen = len || 10;
  var upre = pre || '';
  var result = '';

  // 字符串生成
  function genChars(first) {
    var mr = Math.random();
    var rds = first ? String(t).replace('0.', '') + String(mr).replace('0.', '') : String(mr).replace('0.', '');
    var rdsLen = rds.length;
    var rdnums = [],
        c = void 0,
        c6 = void 0,
        rdnumsLen = void 0,
        pos = 0,
        rdpos = 0,
        resultChars = [];

    while (pos < rdsLen) {
      c = rds.substring(pos, pos + 1);
      if (c > 6) {
        rdnums.push(Number(c));
        pos++;
      } else if (c == 6) {
        c6 = rds.substring(pos, pos + 2);
        if (c6 < 62) {
          rdnums.push(Number(c6));
          pos += 2;
        } else {
          rdnums.push(c);
          pos++;
        }
      } else if (c < 6) {
        rdnums.push(Number(rds.substring(pos, pos + 2)));
        pos += 2;
      }
    }
    rdnumsLen = rdnums.length;
    while (rdpos < rdnumsLen) {
      resultChars.push(chars[rdnums[rdpos]]);
      rdpos++;
    }
    result += resultChars.join('');
  }

  genChars(true);
  while (result.length < ulen) {
    genChars();
  }
  if (result.length > ulen) {
    result = result.substring(result.length - ulen, result.length);
  }
  return upre + result;
};

/**
 * @author liuxp
 * 数据对象类型判断
 * 支持返回类型：String、 Number、Boolean、Array、Object、Function、Date、Math...
 */
var TypeOf = exports.TypeOf = function TypeOf(o) {
  var type = typeof o !== "undefined" ? Object.prototype.toString.call(o) : undefined;
  if (type) {
    type = String(type).replace(/object\s+\w+/, function (rep) {
      return rep.replace(/object\s+/, '');
    }).replace(/[\[\]]*/g, '');
  }
  return type;
};
/**
 * @author liuxp
 * 将复杂数据对象，转换成简单数据类型
 * @param  ob  [Array | Object]
 */
var ToPlainObject = exports.ToPlainObject = function ToPlainObject(ob) {
  var newo = TypeOf(ob) === 'Array' ? [] : Object.create(null);

  function convert(n, o) {
    var v = void 0;
    for (var i in o) {
      if (Object.prototype.hasOwnProperty.call(o, i)) {
        v = o[i];
        if (TypeOf(v) === 'Array' || TypeOf(v) === 'Object') {
          n[i] = TypeOf(v) === 'Array' ? convert([], v) : convert({}, v);
        } else if (TypeOf(v) !== 'Function') {
          n[i] = v;
        } else {
          console && console.warn('ToPlainObject: property is a function type error!, this value is not return.');
        }
      }
    }
    return n;
  }
  if (TypeOf(ob)) {
    if (TypeOf(ob) === 'String') {
      return ob;
    } else {
      return convert(newo, ob);
    }
  }
  return undefined;
};

/**
 * @author liuxp
 * 将复杂对象和JSON字符串，转换成简单数据类型
 * @param  o  [ Array | Object | JSON String ]
 */
var JsonToObject = exports.JsonToObject = function JsonToObject(o) {
  if (typeof o === 'string') {
    return JSON.parse(o);
  } else if ((typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object') {
    return JSON.parse(JSON.stringify(o));
  }
  return null;
};

/**
 * @author liuxp
 * 将数组数据数据内容相同的数据项除去
 * @arr [ Array ] 需要去重的数组数据
 * 返回，一个唯一性数组, 去重失败返回空数组
 */
var UniqueArray = exports.UniqueArray = function UniqueArray(arr) {
  var tmpArr = ToPlainObject(arr);
  if (TypeOf(arr) === 'Array') {

    for (var i = 0; i < tmpArr.length; i++) {
      for (var j = i + 1; j < tmpArr.length; j++) {
        if (ObjectPlainIsEqual(tmpArr[i], tmpArr[j])) {
          tmpArr.splice(j, 1);
          while (ObjectPlainIsEqual(tmpArr[i], tmpArr[j])) {
            tmpArr.splice(j, 1);
          }
        }
      }
    }
    return tmpArr;
  } else {
    return [];
  }
};

/**
 * @author liuxp
 * 编辑数组列表时的数据重复内容清除
 * @existList [Array]  当前列表已有数据
 * @newList   [Array]  新增列表数据
 * @delList   [Array]  已删除列表数据
 * @editList  [Array]  编辑过的列表数据
 * 返回已清理的 newList 和 delList 数据列表
 */
var UniqueEditArray = exports.UniqueEditArray = function UniqueEditArray(existList, newList, delList, editList) {
  var existLst = TypeOf(existList) === 'Array' ? ToPlainObject(existList) : [];
  var newLst = TypeOf(newList) === 'Array' ? UniqueArray(newList) : [];
  var delLst = TypeOf(delList) === 'Array' ? UniqueArray(delList) : [];
  var editLst = TypeOf(editList) === 'Array' ? UniqueArray(editList) : [];
  var newListCp = [],
      delListCp = [],
      editListCp = [],
      isFind = false;

  function clearList(type) {
    var searchList = newLst;
    if (type === 'edit') {
      searchList = editLst;
    }
    // 项目清理
    for (var i = 0; i < searchList.length; i++) {
      isFind = false;
      for (var j = 0; j < existLst.length; j++) {
        if (ObjectPlainIsEqual(searchList[i], existLst[j])) {
          isFind = true;
        }
      }
      if (isFind) {
        if (type === 'edit') {
          editListCp.push(searchList[i]);
        } else {
          newListCp.push(searchList[i]);
        }
      }
    }
  }

  if (TypeOf(existList) === 'Array') {
    // 新增项目清理
    clearList('add');
    // 新增项目清理
    clearList('edit');
    // 删除项目清理
    for (var n = 0; n < delLst.length; n++) {
      isFind = false;
      for (var m = 0; m < existLst.length; m++) {
        if (ObjectPlainIsEqual(delLst[n], existLst[m])) {
          isFind = true;
        }
      }
      if (!isFind) {
        delListCp.push(delLst[n]);
      }
    }
    return {
      newList: newListCp,
      delList: delListCp,
      editList: editListCp
    };
  } else {
    return undefined;
  }
};

/**
 * @author liuxp
 * 比较两个纯JS对象（不包含函数的对象）的属性值是否相等
 * @one [ Object ]  需要比较的第一个对象
 * @two [ Object ]  需要比较的第二个对象
 * 返回 Boolean 
 */
var ObjectPlainIsEqual = exports.ObjectPlainIsEqual = function ObjectPlainIsEqual(one, two) {
  var oneType = TypeOf(one);
  var twoType = TypeOf(two);
  var equal = true,
      v = void 0;
  // g 集合是否包含 s 集合内容且相等
  function subset(g, s) {
    for (var i in g) {
      if (Object.prototype.hasOwnProperty.call(g, i)) {
        v = g[i];
        if (TypeOf(v) === 'Array' || TypeOf(v) === 'Object') {
          if (TypeOf(v) === TypeOf(s[i])) {
            subset(v, s[i]);
          } else {
            equal = false;
          }
        } else if (TypeOf(v) !== 'Function') {
          if (v !== s[i]) equal = false;
        } else {
          throw new Error('ObjectPlainIsEqual Type ' + v + ' error.');
        }
      }
    }
  }

  if (oneType === twoType) {
    subset(one, two); // 正包含
    subset(two, one); // 负包含
    return equal;
  } else {
    return false;
  }
};

/**
 * @author liuxp
 * 日期字符串转换为 Date 类型
 * @param dataStr [String]  例如 2017-12-12
 */
var String2Date = exports.String2Date = function String2Date(dateStr) {
  return new Date(dateStr);
};
/**
 * @author liuxp
 * Date类型转换为日期字符串类型
 * @param date    [Date]
 * @param format  [String]   如: yyyy-MM-dd
 */
var Date2String = exports.Date2String = function Date2String(date, format) {
  date = new Date(date);
  if (isNaN(date.getTime())) return null;
  if (!date) return '';
  return _date2.default.format(date, format || 'yyyy-MM-dd');
};

/**
 * Date类型转换为星期几
 * @param {*} date [Date]
 */
var Date2Week = exports.Date2Week = function Date2Week(date) {
  var weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return weekArray[date.getDay()];
};

/**
 * 检查是否是有权限的url
 */
var isAuthorizedUrl = exports.isAuthorizedUrl = function isAuthorizedUrl(url) {
  var reg = new RegExp(url + "$"); //endWith 
  var menusData = window.userMenus || [];
  for (var _iterator = menusData, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var menu = _ref;

    if (reg.test(menu.url)) {
      return true;
    } else if (menu.subMenu && menu.subMenu.length > 0) {
      for (var _iterator2 = menu.subMenu, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var sMenu = _ref2;

        if (reg.test(sMenu.url)) {
          return true;
        } else if (sMenu.subMenu && sMenu.subMenu.length > 0) {
          for (var _iterator3 = sMenu.subMenu, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            var ssMenu = _ref3;

            if (reg.test(ssMenu.url)) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

/** Browser Detect */
var Browser = exports.Browser = function Browser() {
  this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
  this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
  this.OS = this.searchString(this.dataOS) || "an unknown OS";
};

Browser.prototype = {

  searchString: function searchString(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) !== -1) return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  },
  searchVersion: function searchVersion(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index === -1) return;
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [{
    string: navigator.userAgent,
    subString: "Chrome",
    identity: "Chrome"
  }, {
    string: navigator.vendor,
    subString: "Apple",
    identity: "Safari",
    versionSearch: "Version"
  }, {
    prop: window.opera,
    identity: "Opera"
  }, {
    string: navigator.userAgent,
    subString: "Firefox",
    identity: "Firefox"
  }, {
    string: navigator.userAgent,
    subString: "MSIE",
    identity: "IE",
    versionSearch: "MSIE"
  }, {
    string: navigator.userAgent,
    subString: "Gecko",
    identity: "Mozilla",
    versionSearch: "rv"
  }],
  dataOS: [{
    string: navigator.platform,
    subString: "Win",
    identity: "Windows"
  }, {
    string: navigator.platform,
    subString: "Mac",
    identity: "Mac"
  }, {
    string: navigator.userAgent,
    subString: "iPhone",
    identity: "iPhone/iPod"
  }, {
    string: navigator.platform,
    subString: "Linux",
    identity: "Linux"
  }]
};