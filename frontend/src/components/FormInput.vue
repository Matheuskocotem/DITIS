<template>
  <div class="form-input">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <div class="input-wrapper" :class="{ 'has-error': error, 'has-icon': icon }">
      <i v-if="icon" class="input-icon" :class="icon"></i>
      
      <!-- Input padrão para tipos text, password, email, etc -->
      <input
        v-if="!isSelect && !isDate && !isTime"
        :id="id"
        ref="input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :aria-label="label || placeholder"
        :required="required"
        class="input-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Select para tipo select -->
      <select
        v-if="isSelect"
        :id="id"
        ref="input"
        :value="modelValue"
        :disabled="disabled"
        :aria-label="label || placeholder"
        :required="required"
        class="input-field select-field"
        @change="handleSelectChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      
      <!-- Input para tipo date -->
      <input
        v-if="isDate"
        :id="id"
        ref="input"
        type="date"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="label || placeholder"
        :required="required"
        class="input-field date-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- Input para tipo time -->
      <input
        v-if="isTime"
        :id="id"
        ref="input"
        type="time"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-label="label || placeholder"
        :required="required"
        class="input-field time-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <i v-if="error" class="error-icon fas fa-exclamation-circle"></i>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'FormInput',
  props: {
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substring(2, 9)}`;
      }
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    mask: {
      type: Function,
      default: null
    },
    validator: {
      type: Function,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    validateOnBlur: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    isSelect() {
      return this.type === 'select';
    },
    isDate() {
      return this.type === 'date';
    },
    isTime() {
      return this.type === 'time';
    }
  },
  
  data() {
    return {
      error: '',
      focused: false
    };
  },
  
  methods: {
    handleInput(event) {
      let value = event.target.value;
      
      // Aplicar máscara se existir
      if (this.mask && typeof this.mask === 'function') {
        value = this.mask(value);
      }
      
      this.$emit('update:modelValue', value);
      
      // Validar durante a digitação se necessário
    },

    handleSelectChange(event) {
      console.log('Select changed:', event.target.value);
      const value = event.target.value;
      this.$emit('update:modelValue', value);
      
      // Validar após a seleção
      if (this.validator && typeof this.validator === 'function') {
        this.error = this.validator(value);
      }
      if (!this.validateOnBlur && this.validator) {
        this.validate(value);
      }
    },
    
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      
      // Validar ao perder o foco
      if (this.validateOnBlur && this.validator) {
        this.validate(this.modelValue);
      }
    },
    
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    
    validate(value) {
      if (this.validator) {
        const result = this.validator(value);
        if (typeof result === 'string') {
          this.error = result;
          return false;
        } else {
          this.error = '';
          return true;
        }
      }
      return true;
    },
    
    focus() {
      this.$refs.input.focus();
    },
    
    reset() {
      this.$emit('update:modelValue', '');
      this.error = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.form-input {
  width: 100%;
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-700);
}

.input-wrapper {
  position: relative;
  width: 100%;
  
  &.has-icon .input-field {
    padding-left: 2.5rem;
  }
  
  &.has-error .input-field {
    border-color: var(--red-500);
    
    &:focus {
      border-color: var(--red-500);
      box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
    }
  }
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 1rem;
}

.error-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--red-500);
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: white;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    border-color: var(--gray-400);
  }
  
  &:focus {
    outline: none;
    border-color: var(--green-500);
    box-shadow: 0 0 0 2px rgba(21, 128, 61, 0.1);
  }
  
  &:disabled {
    background-color: var(--gray-100);
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: var(--gray-400);
  }
}

.error-message {
  margin-top: 0.375rem;
  color: var(--red-500);
  font-size: 0.75rem;
}
</style>
