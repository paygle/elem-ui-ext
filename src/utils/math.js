
export default {
  // 除法
  div(arg1, arg2, limit) {
    arg1 = typeof arg1 === 'undefined' ? 0 : arg1; 
    arg2 = typeof arg2 === 'undefined' ? 0 : arg2;
    var t1 = 0, t2 = 0, r1, r2, ret;
    limit = typeof limit === 'undefined' ? -1 : limit;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    ret = this.multi((r1 / r2), Math.pow(10, t2 - t1));
    return limit < 0 ? ret : this.precision(ret, limit);
  },

  //乘法 
  multi(arg1, arg2, limit) {
    arg1 = typeof arg1 === 'undefined' ? 0 : arg1; 
    arg2 = typeof arg2 === 'undefined' ? 0 : arg2;
    var ret, m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    limit = typeof limit === 'undefined' ? -1 : limit;
    try {
      m += s1.split(".")[1].length;
    } catch (e) {}
    try {
      m += s2.split(".")[1].length;
    } catch (e) {}
    ret = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    return limit < 0 ? ret : this.precision(ret, limit);
  },

  //加法  
  add(arg1, arg2, limit) {
    arg1 = typeof arg1 === 'undefined' ? 0 : arg1; 
    arg2 = typeof arg2 === 'undefined' ? 0 : arg2;
    var r1, r2, m, ret;
    limit = typeof limit === 'undefined' ? -1 : limit;
    
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    ret = (arg1 * m + arg2 * m) / m;
    return limit < 0 ? ret : this.precision(ret, limit);
  },

  //减法  
  sub(arg1, arg2, limit) {
    arg1 = typeof arg1 === 'undefined' ? 0 : arg1; 
    arg2 = typeof arg2 === 'undefined' ? 0 : arg2;
    var r1, r2, m, n, ret;
    limit = typeof limit === 'undefined' ? -1 : limit;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    ret = ((arg1 * m - arg2 * m) / m).toFixed(n);
    return limit < 0 ? ret : this.precision(ret, limit);
  },

  // 精度
  precision(numb, lmt) { 
    if (typeof numb === 'undefined') return '0';
    function fillZero(n, num) {
      num = String(num);
      for (var i = 0; i < n; i++) { num += '0'; }
      return num;
    }
    function half(l, num) {
      var snum, ln, hfs, rep, reps, hight;
      snum = num.toString();
      ln = snum.substr(0, l);
      hfs = Number('0.' + snum.substr(l, 1));
      hight = Number(fillZero(l, '1'));
      rep = Number(ln) + 1;
      if (hfs >= 0.5 && rep === hight) {
        return {H: 1, L: fillZero(l, '')};
      }
      reps = rep.toString().length;
      if (reps < ln.length) {
        rep = fillZero(ln.length - reps, '') + rep;
      }
      return {H: 0, L: hfs < 0.5 ? ln : rep};
    }
    lmt = (lmt && lmt > 0) ? lmt : 0;
    var nm, p, hl;
    if (!isNaN(numb)) {
      nm = Number(numb).toString().split(".");
      try {
        p = nm[1].length;
      } catch (e) {
        p = 0;
        nm[1] = '';
      }
      if (p > 0 && p < lmt) {
        nm[1] = fillZero(lmt - p, nm[1]);
      } else if (lmt > 0 && p > lmt) {
        hl = half(lmt, nm[1]);
        nm[0] = Number(nm[0]) + Number(hl.H);
        nm[1] = hl.L;
      } else if (lmt > 0) {
        nm[1] = fillZero(lmt, nm[1]);
      } else if (lmt === 0) {
        return Math.floor(nm.join('.'));
      }
      return lmt > 0 ? nm.join('.') : nm[0];
    }
    return '0';
  }
};
