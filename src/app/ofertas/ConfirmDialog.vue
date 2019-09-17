<template lang="pug">
  v-dialog(
    persistent
    max-width="450"
    v-model="showConfirmDialog"
    )
    v-card
      v-toolbar(flat color="primary")
        v-toolbar-title.white--text {{dialogText}}
        v-spacer
        v-btn(icon
          @click="showConfirmDialog=false"
          )
          v-icon.white--text close
      v-card-text
        v-container(grid-list-md)
            .subheading Esta ação é irreversivel.
      v-card-actions
        v-btn(
          flat
          block
          outline
          color="primary"
          @click="confirmAction"
          )
          v-icon(left) check
          | OK
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false,
    },
    otherType: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    showConfirmDialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    dialogText: {
      get() {
        let text = this.otherType ? 'Deseja realmente aprovar esta oferta?' : 'Deseja realmente reprovar esta oferta?'; 
        return text;
      },
    },
  },
  methods: {
    confirmAction() {
      this.otherType ? this.$emit('approve-offer') : this.$emit('reprove-offer');
      this.$emit('input', false);
    },
  },
};
</script>
