<template>
  <label class="rich-checkbox">
    <span class="rich-checkbox__input"
      :class="{
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
    >
      <span v-if="layout==='tick'" class="rich-checkbox__inner">
        <i :class="'el-icon-' + icon" v-if="icon"></i
        ><span class="rich-checkbox__label"
          v-if="$slots.default || label"
        ><slot></slot><template
          v-if="!$slots.default">{{label}}</template>
        </span>
      </span>
      <input
        v-if="trueLabel || falseLabel"
        class="rich-checkbox__original"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        v-model="model"
        :tabindex="tabindex"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
      <input
        v-else
        class="rich-checkbox__original"
        type="checkbox"
        :tabindex="tabindex"
        :disabled="disabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false">
    </span>
  </label>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'RichCheckbox',

    mixins: [Emitter],

    componentName: 'RichCheckbox',

    data() {
      return {
        selfModel: false,
        focus: false
      };
    },

    computed: {
      model: {
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
            ? this.value : this.selfModel;
        },

        set(val) {
          if (this.isGroup) {
            let isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (isLimitExceeded = true));

            isLimitExceeded === false &&
            this.dispatch('RichCheckboxGroup', 'input', [val]);
          } else {
            this.$emit('input', val);
            this.selfModel = val;
            this.dispatch('ElForm', 'compare-change', this);
            this.dispatch(this.validItemName, 'compare-change', this);
          }
        }
      },

      isChecked() {
        if ({}.toString.call(this.model) === '[object Boolean]') {
          return this.model;
        } else if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        } else if (this.model !== null && this.model !== undefined) {
          return this.model === this.trueLabel;
        }
      },

      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'RichCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },

      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      }
    },

    props: {
      validItemName: {     // 使用 valid-item组件时的组件名称
        type: String,
        default: 'ValidItem'
      },
      value: {},
      label: {},
      icon: String,
      layout:{          // 自定义布局类型
        type: String,
        default: function(){
          return 'tick';
        }
      },
      tabindex: null,
      indeterminate: Boolean,
      disabled: Boolean,
      checked: Boolean,
      name: String,
      trueLabel: [String, Number],
      falseLabel: [String, Number]
    },

    methods: {
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = this.trueLabel || true;
        }
      },
      handleChange(ev) {
        this.$emit('change', ev);
        if (this.isGroup) {
          this.$nextTick(_ => {
            this.dispatch('RichCheckboxGroup', 'change', [this._checkboxGroup.value]);
          });
        }
      }
    },

    created() {
      this.checked && this.addToStore();

      if (!this.isGroup) {
        this.$nextTick(() => {
          this.dispatch('ElForm', 'compare-change', this);
          this.dispatch(this.validItemName, 'compare-change', this);
        });
      }
    }
  };
</script>
