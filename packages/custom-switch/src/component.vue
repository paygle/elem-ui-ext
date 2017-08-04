<template>
  <label class="el-switch" :class="{ 'is-disabled': disabled, 'el-switch--wide': hasText, 'is-checked': checked }">
    <div class="el-switch__mask" v-show="disabled"></div>
    <input
      class="el-switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :name="name"
      :true-value="ontValue"
      :false-value="offValue"
      :disabled="disabled">
    <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      <span class="el-switch__button" :style="{ transform }"></span>
    </span>
    <transition name="label-fade">
      <div
        class="el-switch__label el-switch__label--left"
        v-show="checked"
        :style="{ 'width': coreWidth + 'px' }">
        <i :class="[ontIconClass]" v-if="ontIconClass"></i>
        <span v-if="!ontIconClass && ontText">{{ ontText }}</span>
      </div>
    </transition>
    <transition name="label-fade">
      <div
        class="el-switch__label el-switch__label--right"
        v-show="!checked"
        :style="{ 'width': coreWidth + 'px' }">
        <i :class="[offIconClass]" v-if="offIconClass"></i>
        <span v-if="!offIconClass && offText">{{ offText }}</span>
      </div>
    </transition>
  </label>
</template>
<script>
  export default {
    name: 'CustomSwitch',
    componentName: 'CustomSwitch',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },

      onIconClass: null,
      oIconClass: {   // jsx不支持onXXX属性
        type: String,
        default: ''
      },
      offIconClass: {
        type: String,
        default: ''
      },

      onText: null,
      oText: {     // jsx不支持onXXX属性
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },

      onColor: null,
      oColor: {    // jsx不支持onXXX属性
        type: String,
        default: ''
      },
      offColor: {
        type: String,
        default: ''
      },

      onValue: null,
      oValue: {    // jsx不支持onXXX属性
        type: [Boolean, String, Number],
        default: true
      },
      offValue: {
        type: [Boolean, String, Number],
        default: false
      },
      name: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        coreWidth: this.width
      };
    },
    created() {
      if (!~[this.ontValue, this.offValue].indexOf(this.value)) {
        this.$emit('input', this.offValue);
      }
    },
    computed: {
      ontIconClass(){    // jsx不支持onXXX属性
        return this.onIconClass !== undefined ? this.onIconClass : this.oIconClass;
      },
      ontText(){         // jsx不支持onXXX属性
        return this.onText !== undefined ? this.onText : this.oText;
      },
      ontColor(){        // jsx不支持onXXX属性
        return this.onColor !== undefined ? this.onColor : this.oColor;
      },
      ontValue(){        // jsx不支持onXXX属性
        return this.onValue !== undefined ? this.onValue : this.oValue;
      },
      checked() {
        return this.value === this.ontValue;
      },
      hasText() {
        /* istanbul ignore next */
        return this.ontText || this.offText;
      },
      transform() {
        return this.checked ? `translate(${ this.coreWidth - 20 }px, 2px)` : 'translate(2px, 2px)';
      }
    },
    watch: {
      checked() {
        if (this.ontColor || this.offColor) {
          this.setBackgroundColor();
        }
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('change', !this.checked ? this.ontValue : this.offValue);
        this.$emit('input', !this.checked ? this.ontValue : this.offValue);
        this.$nextTick(() => {
          // set input's checked property
          // in case parent refuses to change component's value
          this.$refs.input.checked = this.checked;
        });
      },
      setBackgroundColor() {
        let newColor = this.checked ? this.ontColor : this.offColor;
        this.$refs.core.style.borderColor = newColor;
        this.$refs.core.style.backgroundColor = newColor;
      }
    },
    mounted() {
      /* istanbul ignore if */
      if (this.width === 0) {
        this.coreWidth = this.hasText ? 58 : 46;
      }
      if ((this.ontColor || this.offColor) && !this.disabled) {
        this.setBackgroundColor();
      }
      this.$refs.input.checked = this.checked;
    }
  };
</script>
