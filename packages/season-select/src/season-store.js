import {
  ToPlainObject,
  TypeOf
} from 'element-ui/src/utils/funcs';

// op [Number]  1 或 -1
const mathOperateOne = function (val, op) {
  let valtype = TypeOf(val);
  let opNum = op === 1 ? 1 : -1;
  let mathRet = '';

  switch (valtype) {
    case 'String':
      if (val === '') mathRet = '';
      if (!isNaN(val)) {
        mathRet = parseInt(val, 10) + opNum;
      } else {
        mathRet = val;
      }
      break;

    case 'Number':
      mathRet = parseInt(val, 10) + opNum;
      break;

    default:
      mathRet = val;
  }
  return isNaN(mathRet) ? '' : mathRet;
};

// 获取选择值, 从 1 开始或从0开始
// sval [Aarry]   季度选择值
// flag [Number]  1 或 0
const getIndexNumVal = function (states, sval, flag) {
  let fields = states.fields;
  let fld_season = fields['season'];
  let fld_startMonth = fields['startMonth'];
  let fld_endMonth = fields['endMonth'];
  let dat = TypeOf(sval) === 'Array' ? ToPlainObject(sval) : [{}, {}, {}, {}];

  for (let i = 0; i < dat.length; i++) {
    if (TypeOf(dat[i]) === 'Object') {
      dat[i][fld_season] = mathOperateOne(dat[i][fld_season], flag);
      dat[i][fld_startMonth] = mathOperateOne(dat[i][fld_startMonth], flag);
      dat[i][fld_endMonth] = mathOperateOne(dat[i][fld_endMonth], flag);
    }
  }
  return dat;
};

// 获取月值状态
// const getMonthStatus = function (states, seasonIndex, index) {
//   let season = states.seasons[seasonIndex];
//   if (season && season && typeof season[index] !== undefined) {
//     return season[index];
//   } else {
//     return null;
//   }
// };

// 清空季节标识
const resetSeasons = function (states) {
  let seasons = states.seasons;
  for (let i = 0; i < seasons.length; i++) {
    for (let j = 0; j < seasons[i].length; j++) {
      seasons[i][j] = 0;
    }
  }
  states.seasons = seasons;
};

// 季节选择状态更新
const seasonStatusUpdate = function (states) {

  let seasons = ToPlainObject(states.seasons);
  let seasonsEnd = [-1, -1, -1, -1], endIndexVal = 0;
  let seasonsLen = 4, monthsLen = 24;

  if (states.periodType != 2) { // 自然季 不跨年
    monthsLen = 12;
  }
  // 获取每行尾值
  const getEndValue = function (currentIndex) {
    let EndIndex = -1;
    if (currentIndex > -1) {
      for (let i = currentIndex; i >= 0; i--) {
        if (seasonsEnd[i] > -1) {
          EndIndex = seasonsEnd[i];
          break;
        }
      }
    }
    return EndIndex;
  };

  // 获取 End 值
  for (let i = 0; i < seasonsLen; i++) {
    for (let j = 0; j < monthsLen; j++) {
      if (seasons[i][j] == 1) seasonsEnd[i] = j;
    }
  }

  // 规范 End 值
  for (let g = 0; g < seasonsLen; g++) {
    if (g == 0 && seasonsEnd[g] < 0) {
      seasonsEnd[g] = -1;
    } else if (g > 0 && seasonsEnd[g] < seasonsEnd[g - 1]) {
      seasonsEnd[g] = seasonsEnd[g - 1];
    }
  }

  // 设置状态，只有第一行的第1个可以选，其他行的第1个都不可以选
  for (let k = 0; k < seasonsLen; k++) {

    for (let h = 0; h < monthsLen; h++) {

      if (k == 0 && seasons[k][h] == -1) { // 第一行不禁用
        seasons[k][h] = 0;
      } else if (k > 0) {
        endIndexVal = getEndValue(k - 1);
        if (h <= endIndexVal) {
          seasons[k][h] = -1;
        } else if (endIndexVal > -1 && seasons[k][h] == -1) {
          seasons[k][h] = 0;
        }
      }
    }
  }

  states.seasons = seasons;
};

// 设置月值状态
const setMonthStatus = function (states, seasonIndex, index, status) {

  if (states.periodType != 1) { // 初始化状态
    seasonStatusUpdate(states);
  }

  let season = states.seasons[seasonIndex];
  // let monthStatus = getMonthStatus(states, seasonIndex, index);
  let currMonth = season.indexOf(1);
  let fields = states.fields;
  // let fld_kindCode = fields['kindCode'];
  // let fld_periodType = fields['periodType'];
  // let fld_season = fields['season'];
  let fld_startMonth = fields['startMonth'];
  // let fld_endMonth = fields['endMonth'];
  let startIndex = 0;

  if (states.periodType != 1 && typeof season[index] !== undefined && status > -1) {

    if (currMonth > -1 || seasonIndex > 0) {

      if (!states.junction) {
        states.selectedSeasons[seasonIndex][fld_startMonth] = currMonth;
      }

      startIndex = states.selectedSeasons[seasonIndex][fld_startMonth];
      if ((startIndex != '' || String(startIndex) === '0') && status == 1) {
        for (let i = 0; i < season.length; i++) {
          if (index >= startIndex && i >= startIndex && i <= index) {
            season[i] = 1;
          } else if (index <= startIndex && i >= index && i <= startIndex) {
            season[i] = 1;
          } else {
            season[i] = 0;
          }
        }
      } else {
        for (let i = 0; i < season.length; i++) {
          if (index >= startIndex && i >= startIndex && i <= index) {
            season[i] = status;
          } else if (index <= startIndex && i >= index && i <= startIndex) {
            season[i] = status;
          } else {
            season[i] = 0;
          }
        }
      }

    } else if (states.selectedSeasons) {
      states.selectedSeasons[seasonIndex][fld_startMonth] = index;
      season[index] = status;
    }

    states.seasons.splice(seasonIndex, 1, season);
    seasonStatusUpdate(states);
    return true;
  } else {
    return false;
  }
};
// 切换月值状态
const toggleSetStatus = function (currVal) {
  if (currVal == 0) {
    return 1;
  } else if (currVal == 1) {
    return 0;
  }
  return -1;
};

// 初始化自然季
const initNaturalSeason = function (states) {
  let tmp, seasons = states.seasons;
  for (let i = 0; i < 4; i++) {
    tmp = i;
    for (let j = 0; j < 12; j++) {
      if (j >= tmp * 3 && j < ((tmp + 1) * 3)) {
        seasons[i][j] = 1;
      } else {
        seasons[i][j] = -1;
      }
    }
  }
};
// 初始化 season 选择内容
const initDisplaySeasons = function (states, type) {

  let selectedSeasons, seasType = type || 2;

  if (seasType == 2) {
    selectedSeasons = states.selectedSpanSeasons;
  } else {
    selectedSeasons = states.selectedNonSeasons;
  }

  if (selectedSeasons.length && selectedSeasons.length == 4) {

    // let seasons = states.seasons;
    let fields = states.fields;
    let fld_kindCode = fields['kindCode'];
    let fld_periodType = fields['periodType'];
    // let fld_season = fields['season'];
    let fld_startMonth = fields['startMonth'];
    let fld_endMonth = fields['endMonth'];
    let seasonsLen = 4, monthsLen = 24, startMonth = 0, endMonth = 0;

    states.periodType = selectedSeasons[0][fld_periodType];

    if (states.periodType == 3) {
      monthsLen = 12;
    }

    // 默认内容为空时
    if (!states.periodType) {
      states.periodType = seasType;
      resetSeasons(states);
    } else {

      states.kindCode = selectedSeasons[0][fld_kindCode];

      for (let i = 0; i < seasonsLen; i++) {
        startMonth = selectedSeasons[i][fld_startMonth];
        endMonth = selectedSeasons[i][fld_endMonth];

        if (startMonth != '' && endMonth != '' && startMonth > -1 && endMonth > -1) {

          for (let j = 0; j < monthsLen; j++) {

            if (j >= startMonth && j <= endMonth) {
              states.seasons[i][j] = 1;
            } else {
              states.seasons[i][j] = 0;
            }
          }
        }
      }
    }

    states.selectedSeasons = ToPlainObject(selectedSeasons);
  }
};

// seasonSelects To  Dispaly Map
const selectsToDisplayMap = function (states) {
  // 切换暂存数据
  switch (parseInt(states.periodType, 10)) {
    case 1: // 自然季节 1
      initNaturalSeason(states);
      break;
    case 2: // 跨年季节 2
      initDisplaySeasons(states, 2);
      break;
    case 3: // 非跨年季节 3
      initDisplaySeasons(states, 3);
      break;
    default: // 自然季节 1
      initNaturalSeason(states);
      break;
  }
};

// store 初始化
const SeasonStore = function (SeasonSelect, initialState = {}) {
  if (!SeasonSelect) {
    throw new Error('SeasonSelect is required.');
  }
  this.SeasonSelect = SeasonSelect;

  let seasons = [];
  for (let i = 0; i < 4; i++) {
    seasons.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }

  this.states = {
    junction: true, // 是否要求月分是连续的
    totalLess: 12, // 最低月份数总和
    totalMonths: 12, // 允许选择的月份数总和
    seasonMonths: 3, // 每季最多月份数
    seasonLess: 1,
    seasons: seasons, // 季选择状态集
    periodType: 1, // 季周期类型    1：自然季， 2：非自然季-跨年， 3：非自然季-不跨年
    kindCode: '', // 类型代称
    fields: { // 返回字段名称设置
      kindCode: 'kind_code',
      periodType: 'period_type',
      season: 'season',
      startMonth: 'start_month',
      endMonth: 'end_month'
    },
    selectedNatSeasons: [{}, {}, {}, {}], // 自然季节 1
    selectedSpanSeasons: [{}, {}, {}, {}], // 跨年季节 2
    selectedNonSeasons: [{}, {}, {}, {}], // 非跨年季节 3
    selectedSeasons: [{}, {}, {}, {}], // 选择结果
    selectedCpSeasons: [{}, {}, {}, {}] // 最终计算结果
  };

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }

  if (this.states.periodType == 1) {
    initNaturalSeason(this.states);
  }
  selectsToDisplayMap(this.states);
  this.selectedValCompute();
};

// 初始化为自然季
SeasonStore.prototype.initNaturalSeason = function () {
  initNaturalSeason(this.states.seasons);
  this.selectedValCompute();
};

// 获取相应的季节选择值
SeasonStore.prototype.getPeriodSeason = function (periodType) {
  let selectedSeasons =  [{},{},{},{}];
  let states = this.states;
  // 切换暂存数据
  switch (parseInt(periodType, 10)) {
    case 1: // 自然季节 1
      selectedSeasons = ToPlainObject(states.selectedNatSeasons);
      break;
    case 2: // 跨年季节 2
      selectedSeasons = ToPlainObject(states.selectedSpanSeasons);
      break;
    case 3: // 非跨年季节 3
      selectedSeasons = ToPlainObject(states.selectedNonSeasons);
      break;
    default: // 自然季节 1
      selectedSeasons = ToPlainObject(states.selectedNatSeasons);
      break;
  }
  return selectedSeasons;
};

// 设置相应的季节选择值
SeasonStore.prototype.setPeriodSeason = function (selectedSeasons, periodType, isOld) {
  let states = this.states;
  let fld_periodType = states.fields['periodType'];
  let fld_kindCode = states.fields['kindCode'];
  let seasonsPeriodType = 1, seasonKcode = '', seasonOne;

  if (selectedSeasons && selectedSeasons.length && selectedSeasons[0]) {
    seasonOne = selectedSeasons[0];
    seasonKcode = seasonOne[fld_kindCode] ? seasonOne[fld_kindCode] : '';
    seasonsPeriodType = seasonOne[fld_periodType] ? seasonOne[fld_periodType] : 1;
  }

  let periodTypeNum = periodType || seasonsPeriodType;

  // 切换暂存数据
  switch (parseInt(periodTypeNum, 10)) {
    case 1: // 自然季节 1
      states.selectedNatSeasons = ToPlainObject(selectedSeasons);
      if (!isOld) {
        states.selectedSeasons = ToPlainObject(selectedSeasons);
      }
      break;
    case 2: // 跨年季节 2
      states.selectedSpanSeasons = ToPlainObject(selectedSeasons);
      if (!isOld) {
        states.selectedSeasons = ToPlainObject(selectedSeasons);
      }
      break;
    case 3: // 非跨年季节 3
      states.selectedNonSeasons = ToPlainObject(selectedSeasons);
      if (!isOld) {
        states.selectedSeasons = ToPlainObject(selectedSeasons);
      }
      break;
    default: // 自然季节 1
      states.selectedNatSeasons = ToPlainObject(selectedSeasons);
      if (!isOld) {
        states.selectedSeasons = ToPlainObject(selectedSeasons);
      }
      break;
  }

  if (!isOld) {
    states.kindCode = seasonKcode;
    states.periodType = periodTypeNum;
  }

  if (periodType && !isOld) {
    this.SeasonSelect.updateSeasonType(periodTypeNum);
  }

  selectsToDisplayMap(states); // 设置后完成显示
  seasonStatusUpdate(states);
};

// 获取选择值, 从 1 开始或从0开始
// selVal [Aarry]   季度选择值
// flag  [Number]  1 或 0
SeasonStore.prototype.getIndexNumVal = function (selVal, flag) {
  return getIndexNumVal(this.states, selVal, flag);
};

// 获取已经选择的值
SeasonStore.prototype.getSelectedValue = function (isValid) {
  let states = this.states;
  let seasons = states.seasons;
  let fields = states.fields;
  let fld_kindCode = fields['kindCode'];
  let fld_periodType = fields['periodType'];
  let fld_season = fields['season'];
  let fld_startMonth = fields['startMonth'];
  let fld_endMonth = fields['endMonth'];
  let seasonsLen = 4, monthsLen = 24;
  let seasonsTmp = [], tmpLen = 0;
  let totalMonths = 0; // 允许选择的月份数总和
  let maxMonths = 0; // 每季最多月份数
  let minMonths = 24; // 每季最少月份数
  let selectedSeasons = this.getPeriodSeason(states.periodType);
  let isJunction = true, tmpLength, seaTmpLen, validSuccess = true; // 验证

  if (states.periodType != 2) { // 自然季 不跨年
    monthsLen = 12;
  }

  // 获取已选月份
  for (let i = 0; i < seasonsLen; i++) {
    seasonsTmp[i] = [];

    for (let j = 0; j < monthsLen; j++) {

      if (seasons[i][j] == 1) {
        seasonsTmp[i].push(j);

        tmpLength = seasonsTmp[i].length;

        //换行比较
        if (i > 0 && tmpLength == 1 && seasonsTmp[i - 1].length > 0) {
          seaTmpLen = seasonsTmp[i - 1].length;

          if ((seasonsTmp[i][0] - 1) != seasonsTmp[i - 1][seaTmpLen - 1]) {
            isJunction = false;
          }

          //本行内比较
        } else if (tmpLength > 1) {
          if ((seasonsTmp[i][tmpLength - 1] - 1) != seasonsTmp[i][tmpLength - 2]) {
            isJunction = false;
          }
        }

      }
    }
  }

  let kindcode = (states.kindCode == '' || !states.kindCode) ? this.SeasonSelect.kindCode : states.kindCode;
  // 获取结果数据
  for (let k = 0; k < seasonsLen; k++) {
    tmpLen = seasonsTmp[k].length ? seasonsTmp[k].length : 0;
    selectedSeasons[k][fld_kindCode] = kindcode; // 类型代称
    selectedSeasons[k][fld_periodType] = states.periodType; // 季周期类型    1：自然季， 2：非自然季-跨年， 3：非自然季-不跨年
    selectedSeasons[k][fld_season] = k; // 第N季（行）
    selectedSeasons[k][fld_startMonth] = tmpLen > 0 ? seasonsTmp[k][0] : '';
    selectedSeasons[k][fld_endMonth] = tmpLen > 0 ? seasonsTmp[k][tmpLen - 1] : '';

    // 统计每季，和 总计多少月
    if (maxMonths < tmpLen) {
      maxMonths = tmpLen;
    }
    // 统计每季月数最少多少月
    if (minMonths > tmpLen) {
      minMonths = tmpLen;
    }
    totalMonths += tmpLen;
  }

  if (this.SeasonSelect) {

    // 每季最多月份数
    if (totalMonths > states.totalMonths) {
      this.SeasonSelect.notifyMsg(`总月份数不能超过${states.totalMonths}`, '提示');
      validSuccess = false;
      return states.selectedSeasons;
    }

    // 允许选择的月份数总和
    if (maxMonths > states.seasonMonths) {
      this.SeasonSelect.notifyMsg(`每季月份数不能超过${states.seasonMonths}`, '提示');
      validSuccess = false;
      return states.selectedSeasons;
    }

    // 验证选择
    if (isValid) {
      // 允许选择的最少月份数
      if (minMonths < states.seasonLess) {
        this.SeasonSelect.notifyMsg(`每季月份数不能小于${states.seasonLess}`, '提示');
        validSuccess = false;
      } else if (states.junction && !isJunction) {
        this.SeasonSelect.notifyMsg(`每个季度的月份数必需是连续的`, '提示');
        validSuccess = false;
      } else if (totalMonths < states.totalLess) {
        this.SeasonSelect.notifyMsg(`总月份数不得少于${states.totalLess}`, '提示');
        validSuccess = false;
      }
      // 验证回调
      if (this.SeasonSelect.validate) {
        this.SeasonSelect.validate(validSuccess);
      }
    }

    this.setPeriodSeason(selectedSeasons, states.periodType);
    this.SeasonSelect.updateSelectedValue(getIndexNumVal(states, selectedSeasons, 1));
  }
  return getIndexNumVal(states, selectedSeasons, 1);
};

SeasonStore.prototype.selectedValCompute = function () {
  if (this.SeasonSelect) {
    this.SeasonSelect.getSelectedValue();
  }
};

// mutations functions
SeasonStore.prototype.mutations = {

  // 月份点击事件
  monthClick(states, seasonIndex, index, status) {
    // let monthStatus = getMonthStatus(states, seasonIndex, index);
    let chStatus = toggleSetStatus(status);
    if (setMonthStatus(states, seasonIndex, index, chStatus)) {
      this.SeasonSelect.updateMonthChange(states.seasons);
    }
  },

  // 设置值
  setValue(states, value) {
    this.selectedCpSeasons = value;
    this.setPeriodSeason(getIndexNumVal(states, value, 0));
  },

  setFields(states, value) {
    states.fields = value;
    this.selectedValCompute();
  },

  // 初始化为自然季
  initNatural(states) {
    initNaturalSeason(states);
    states.selectedNatSeasons = ToPlainObject(this.getSelectedValue());
  },

  // 初始化2/3类季选取
  initSeasons(states, type) {
    initDisplaySeasons(states, type);
    this.selectedValCompute();
  },

  // 选择内容清除
  reset(states) {
    if (states.periodType != 1) { // 不允许清除自然季数据
      resetSeasons(states);
      seasonStatusUpdate(states);
    }
  }
};

SeasonStore.prototype.commit = function (name, ...args) {
  const mutations = this.mutations;
  if (mutations[name]) {
    mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

export default SeasonStore;
