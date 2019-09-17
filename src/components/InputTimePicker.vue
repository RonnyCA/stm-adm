<template lang="pug">
  .inputTimePicker
    v-menu(
      transition='scale-transition'
      offset-y
      :nudge-left='40'
      max-width='290px'
      :close-on-content-click='false'
      v-model="menu"
      @input='input'
      ref="menuFim"
    )
      v-text-field(
        slot='activator'
        :label='label'
        v-model='time'
        prepend-icon='schedule'
        readonly
      )
      v-time-picker(
        ref='timePicker'
        v-model='time'
        no-title=''
        scrollable=''
        format='24hr'
        @change="$refs.menuFim.save(time)"
      )
</template>

<script>
export default {
  name: 'time-picker',
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
    },
  },

  computed: {
    time: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  data: () => ({
    menu: false,
  }),

  methods: {
    onInput() {
      this.menu = false;
    },
    input(val) {
      return !val && (this.$refs.timePicker.selectingHour = true);
    },
  },
};
</script>

<style lang="stylus">
.inputTimePicker
  width : 200px
</style>
