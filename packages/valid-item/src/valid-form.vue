<template>
  <form class="valid-form">
    <slot></slot>
  </form>
</template>
<script>
  export default {
    name: 'ValidForm',

    componentName: 'ValidForm',

    props: {
      model: Object,
      rules: Object,
      labelWidth: String,
      showMessage: {
        type: Boolean,
        default: true
      },
      validTrigger: Function, // 触发外部验证函数
      errStyl: Object,     // 错误样式设置
      compareStyl: Array   // 比较字段设置样式
    },
    watch: {
      rules() {
        this.fields.forEach(field => { field.resetStatus(); }); // 自定义状态清除
        this.$nextTick(function(){ this.validate(); });
      }
    },
    data() {
      return {
        fields: []
      };
    },
    created() {
      this.$on('valid.form.addField', (field) => {
        if (field) {
          // 设置初始值
          field.errItemStyl = this.errStyl;
          if (this.compareStyl) field.isCustomStyl = true;
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('valid.form.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
      this.$on('compare-change', this.compareChgStyl);
    },
    methods: {
      /* 比值样式计算
       [
        {
          style: {                 // 自定义样式
            color: '#fff',
            background: 'green'
          },
          fields: ['name', 'desc'], // 需要比较触发计算的字段
          stylefields: ['desc'], // 需要设置样式的字段（省略时，同fields)
          compare:function(data) {
            return data.name > data.desc;    // 返回为真时设置给定样式
          }
        }
       ]
      */
      compareChgStyl(el) {
        if (!Array.isArray(this.compareStyl)) return;
        let that = this;
        let fieldname = el.$parent.prop;  // 获取字段名称
        
        function setCustomStyle(cp, styl) {
          let fields = cp.stylefields || cp.fields;
          fields.forEach((f)=>{
            that.fields.forEach((field)=>{
              if (f === field.prop) field.customStylSet(field.prop, 'custom', styl);
            });
          });
        }
          
        this.compareStyl.forEach((cp)=>{
          let hasf = cp.fields.filter(n => n === fieldname);
          if (hasf.length > 0) {
            if (cp.compare.call(null, that.model)) {
              setCustomStyle(cp, cp.style);
            } else {
              setCustomStyle(cp, {});
            }
          }
        });
      },
      resetFields() {
        if (!this.model) {
          process.env.NODE_ENV !== 'production' &&
          console && console.warn('[Element Warn][Form]model is required for resetFields to work.');
          return;
        }
        this.fields.forEach(field => {
          field.resetField();
        });
      },
      validate(callback) {
        if (!this.model) {
          console && console.warn('[Valid Form Warn][Form]model is required for validate to work!');
          return;
        };
        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }
        this.fields.forEach((field, index) => {
          field.validate('', errors => {
            if (errors) {
              valid = false;
            }
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid);
            }
          });
        });
      },
      validateField(prop, cb) {
        var field = this.fields.filter(field => field.prop === prop)[0];
        if (!field) { throw new Error('must call validateField with valid prop string!'); }

        field.validate('', cb);
      }
    }
  };
</script>
