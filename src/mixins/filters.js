export default {
   filters: {
    /**
     * 百分比过滤器
     */
    percent: function (value) {
      if (isNaN(value)) return value
      return Number(value)  * 1000000000 * 100 / 1000000000;
    }
  }
}