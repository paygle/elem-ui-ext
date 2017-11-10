'use strict';

import dateUtil from './date';

/**
 * @param { Object, String } el   对象选择符或结点对象
 */
export const focusInput = (el) => {

  function focus(elm) {
    let inputEl = null;
    if (elm.tagName === 'INPUT') {
      inputEl = elm;
    } else if (elm.querySelector) {
      inputEl = elm.querySelector('input');
      if (!inputEl) inputEl = elm.querySelector('textarea');
    }
    if (inputEl) {
      inputEl.focus();
    }
  }

  if (typeof el === 'string') {
    let dom = document.body.querySelector(el);
    if (dom !== null && typeof dom === 'object') focus(dom);
  } else if (typeof el === 'object' && el !== null) {
    focus(el);
  }
};

/**
 * 判断对象是否为空对象
 */
export const isOwnEmpty = (obj) => {
  for(var name in obj) { if(obj.hasOwnProperty(name)) return false; }
  return true;
};

 // 自定义转换日期格式为斜杠 YYYY/MM/DD/ HH:MM:SS 兼容格式
 export const compatDateStr = function(date){
  function getZerov(v) { return v < 10 ? '0' + parseInt(v, 10) : v; }
  if (typeof date === 'string') {
    let t = date.split(':');
    let dt = new Date(), Y = dt.getFullYear(), M = dt.getMonth() + 1, D = dt.getDate();
    if (/^\d{1,2}(:\d{1,2}){0,2}$/.test(date)) {
      if (t.length === 1) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0]) + ':00:00';
      } else if (t.length === 2) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0]) + ':' + getZerov(t[1]) + ':00';
      } else if (t.length === 3) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0])  + ':' +  getZerov(t[1]) + ':' + getZerov(t[2]);
      } else {
        return dt;
      }
    } else {
      return String(date).replace(/\-/g, '/');
    }
  } else {
    return date;
  }
};

/**
 * 
 * @param tag 标签名
 * @param attrs 属性对象
 * @param children 子结点对象
 */
export const createDomElement = (tag, attrs, children) => {
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
export const getLocalDataItem = (field, dat, time) => {
  let database = dat || 'default0';
  let validTime = time || 1;
  let between = 1000 * 3600 * validTime;
  let ctime = new Date().getTime();
  let data = JSON.parse(localStorage.getItem(database));
  let out = null;
  if (Object.prototype.toString.call(data) === '[object Object]' && data[field]) {
    out = data[field];
    if (!isNaN(out.save) && (out.save - ctime < between)) {
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
export const setLocalDataItem = (field, value, dat, time) => {
  let database = dat || 'default0';
  let validTime = time || 1;
  let between = 1000 * 3600 * validTime;
  let stime = new Date().getTime() + between;
  let data = null;
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
    let defd = {};
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
export const cssUnitsCalc = (operator, unitA, unitB) => {

  if (operator && typeof unitA !== 'undefined' && typeof unitB !== 'undefined') {

    let regxNum = /^\-?\d+/g;
    let regxUnit = /[A-Za-z\-%]+$/gi;
    let a_num = String(unitA).replace(regxUnit, '');
    let a_unit = String(unitA).replace(regxNum, '');
    let b_num = String(unitB).replace(regxUnit, '');

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
export const getFloatNumber = (precision, value, roundoff) => { // 自定义 float 获取

  precision = !isNaN(precision) ? Number(precision) : 0;

  if (precision > 0 && !isNaN(value) && value !== '') {
    let strNums = String(value).split('.');
    let pnum = strNums[1] ? strNums[1] : [];
    let newPnum = '';

    strNums[0] = !isNaN(strNums[0]) ? Number(strNums[0]) : 0;

    for (let i = 0; i < precision; i++) {
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
export const randomChar = (len, pre) => {

  let chars = ["A", "B",
    "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
    "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
    "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"
  ];
  let t = (new Date()).getTime();
  let ulen = len || 10;
  let upre = pre || '';
  let result = '';

  // 字符串生成
  function genChars(first) {
    let mr = Math.random();
    let rds = first ? String(t).replace('0.', '') + String(mr).replace('0.', '') : String(mr).replace('0.', '');
    let rdsLen = rds.length;
    let rdnums = [], c, c6, rdnumsLen, pos = 0, rdpos = 0, resultChars = [];

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
export const TypeOf = (o) => {
  let type = typeof o !== "undefined" ? Object.prototype.toString.call(o) : undefined;
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
export const ToPlainObject = (ob) => {
  let newo = TypeOf(ob) === 'Array' ? [] : Object.create(null);

  function convert(n, o) {
    let v;
    for (let i in o) {
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
export const JsonToObject = (o) => {
  if (typeof o === 'string') {
    return JSON.parse(o);
  } else if (typeof o === 'object') {
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
export const UniqueArray = (arr) => {
  let tmpArr = ToPlainObject(arr);
  if (TypeOf(arr) === 'Array') {

    for (let i = 0; i < tmpArr.length; i++) {
      for (let j = i + 1; j < tmpArr.length; j++) {
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
export const UniqueEditArray = (existList, newList, delList, editList) => {
  let existLst = TypeOf(existList) === 'Array' ? ToPlainObject(existList) : [];
  let newLst = TypeOf(newList) === 'Array' ? UniqueArray(newList) : [];
  let delLst = TypeOf(delList) === 'Array' ? UniqueArray(delList) : [];
  let editLst = TypeOf(editList) === 'Array' ? UniqueArray(editList) : [];
  let newListCp = [], delListCp = [], editListCp = [], isFind = false;

  function clearList(type) {
    let searchList = newLst;
    if (type === 'edit') {
      searchList = editLst;
    }
    // 项目清理
    for (let i = 0; i < searchList.length; i++) {
      isFind = false;
      for (let j = 0; j < existLst.length; j++) {
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
    for (let n = 0; n < delLst.length; n++) {
      isFind = false;
      for (let m = 0; m < existLst.length; m++) {
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
export const ObjectPlainIsEqual = (one, two) => {
  let oneType = TypeOf(one);
  let twoType = TypeOf(two);
  let equal = true, v;
  // g 集合是否包含 s 集合内容且相等
  function subset(g, s) {
    for (let i in g) {
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
export const String2Date = (dateStr) => {
  return new Date(dateStr);
};
/**
 * @author liuxp
 * Date类型转换为日期字符串类型
 * @param date    [Date]
 * @param format  [String]   如: yyyy-MM-dd
 */
export const Date2String = (date, format) => {
  date = new Date(date);
  if (isNaN(date.getTime())) return null;
  if (!date) return '';
  return dateUtil.format(date, format || 'yyyy-MM-dd');
};

/**
 * Date类型转换为星期几
 * @param {*} date [Date]
 */
export const Date2Week = (date) => {
  var weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return weekArray[date.getDay()];
};

/**
 * 检查是否是有权限的url
 */
export const isAuthorizedUrl = (url) => {
  var reg = new RegExp(url + "$"); //endWith 
  let menusData = window.userMenus || [];
  for (var menu of menusData) {
    if (reg.test(menu.url)) {
      return true;
    } else if (menu.subMenu && menu.subMenu.length > 0) {
      for (var sMenu of menu.subMenu) {
        if (reg.test(sMenu.url)) {
          return true;
        } else if (sMenu.subMenu && sMenu.subMenu.length > 0) {
          for (var ssMenu of sMenu.subMenu) {
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
export const Browser = function () {
  this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
  this.version = this.searchVersion(navigator.userAgent) ||
    this.searchVersion(navigator.appVersion) || "an unknown version";
  this.OS = this.searchString(this.dataOS) || "an unknown OS";
};

Browser.prototype = {

  searchString: function (data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
        if (dataString.indexOf(data[i].subString) !== -1) return data[i].identity;
      } else if (dataProp) return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index === -1) return;
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [{
    string: navigator.userAgent,
    subString: "Chrome",
    identity: "Chrome"
  },
  {
    string: navigator.vendor,
    subString: "Apple",
    identity: "Safari",
    versionSearch: "Version"
  },
  {
    prop: window.opera,
    identity: "Opera"
  },
  {
    string: navigator.userAgent,
    subString: "Firefox",
    identity: "Firefox"
  },
  {
    string: navigator.userAgent,
    subString: "MSIE",
    identity: "IE",
    versionSearch: "MSIE"
  },
  {
    string: navigator.userAgent,
    subString: "Gecko",
    identity: "Mozilla",
    versionSearch: "rv"
  }],
  dataOS: [{
    string: navigator.platform,
    subString: "Win",
    identity: "Windows"
  },
  {
    string: navigator.platform,
    subString: "Mac",
    identity: "Mac"
  },
  {
    string: navigator.userAgent,
    subString: "iPhone",
    identity: "iPhone/iPod"
  },
  {
    string: navigator.platform,
    subString: "Linux",
    identity: "Linux"
  }]
};
