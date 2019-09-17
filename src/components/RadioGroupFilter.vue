<template lang="pug">
  v-radio-group(
    :label="label"
    v-model="internalValue"
    :mandatory="false"
    )
    v-radio(
      v-for="(item, index) in items"
      :label="item.text"
      :value="item.value"
      :key="index"
      )
</template>

<script>
export default {
  name: 'radio-group-filter',

  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },

  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
