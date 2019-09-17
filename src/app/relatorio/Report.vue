<template lang="pug">
  v-card#report
    v-card-text
      slot(name="filters")
      v-data-table.truncate-text(
        :headers="headers"
        :items="items"
        no-data-text="Não existem resultados"
        no-results-text="Não existem resultados"
        hide-actions
        disable-initial-sort
        )
        template(slot="items" slot-scope="props")
          tr
            slot(
              name="table-row"
              :item="props.item"
              )
      v-layout.mt-2.px-4(
        row
        wrap
        )
        v-flex#rows-per-page(
          xs12
          justify-center
          )
          | Por página:
          v-select.select.ml-2.mt-0.pt-0(
            hide-details
            :items="[5, 10, 30, 50]"
            v-model="perPageComputed"
            )
        v-spacer
        v-flex.d-flex(
          xs12
          justify-center
          )
          v-pagination.justify-center(
            circle
            v-model="atualPageComputed"
            :length="totalPages"
            :total-visible="totalPages"
            )
</template>

<script>
export default {
  name: 'report',
  props: {
    title: {
      type: String,
      default: 'Relatório',
    },
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    paginaAtual: {
      type: Number,
      default: 1,
    }
  },
  data: () => ({
    pagination: {
      descending: false,
      page: 1,
      rowsPerPage: 5,
      sortBy: '',
      totalItems: 1,
    }
  }),
  computed: {
    atualPageComputed: {
      get() {
        return this.pagination.page;
      },
      set(value) {
        this.pagination.page = value;
        this.$emit('update:pagination', this.pagination);
      },
    },
    perPageComputed: {
      get() {
        return this.pagination.rowsPerPage;
      },
      set(value) {
        this.pagination.rowsPerPage = value;
        this.$emit('update:pagination', this.pagination);
      },
    },
  },
  watch: {
    paginaAtual: {
      handler() {
        this.pagination.page = this.paginaAtual;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="stylus">
#report
  .truncate-text
    td
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      max-width 1px
</style>
