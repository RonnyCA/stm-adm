<template lang="pug">
  v-card#categorias.py-2
    v-layout(column)
      v-layout(
        row
        wrap
        align-center
        v-if="!hideSearch"
        ).px-4
        v-text-field.pt-1(
          label="Pesquisar"
          append-icon="search"
          v-model="searchTerm"
          @change="onSearchChange()"
          )
      slot(name="search")
      v-layout(row wrap)
        v-flex(xs12)
          v-data-table(
            hide-actions
            :total-items="totalPages"
            :items="items"
            :headers="headers"
            disable-initial-sort
            :no-data-text="noDataText"
            :no-results-text="noResultsText"
            :pagination.sync="privatePagination"
            :select-all="enableCheckbox"
            )
            template(
              slot="headers"
              slot-scope="props"
              )
              tr
                th(
                  v-for="(header, index) in props.headers"
                  :key="index"
                  :width="header.width"
                  :class="getClassesForHeader(header)"
                  @click="changeSort(header.value, header.sortable)"
                ).text-xs-left
                  | {{ header.text }}
                  v-icon(v-if="header.sortable" small) arrow_upward
                th#btn-add.text-xs-right(v-if="!disabledActions")
                  v-tooltip(left)
                    span Adicionar
                    v-btn.mx-0(
                      icon
                      dark
                      small
                      outline
                      color="success"
                      slot="activator"
                      @click="onClickNewItem()"
                      )
                      v-icon add
                th(v-if="enableCheckbox")
                  v-checkbox(
                    color="primary"
                    hide-details
                    @change="changeCheckbox"
                  )
            template(
              slot="items"
              slot-scope="props"
              )
              tr.truncate-text
                slot(
                  name="items"
                  :item="props.item"
                  )
                td(v-if="!disabledActions")
                  v-tooltip(left)
                    span Editar
                    v-btn.mx-0.mr-1(
                      dark
                      icon
                      small
                      outline
                      color="warning"
                      slot="activator"
                      @click="onClickEditItem(props.item)"
                      )
                      v-icon(small) edit

                  v-tooltip(left)
                    span Remover
                    v-btn.mx-0(
                      dark
                      icon
                      small
                      outline
                      color="error"
                      slot="activator"
                      @click="onClickDeleteItem(props.item)"
                      )
                      v-icon(small) delete
          v-layout.mt-2.px-4(
            row
            wrap
            )
            v-flex#rows-per-page(
              v-if="!disableRowsPerPage"
              xs12
              justify-center
              )
              | Por página:
              v-select.select.ml-2.mt-0.pt-0(
                hide-details
                :items="perPagePossibilities"
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
                :total-visible="computedPagesVisible"
                )
            v-spacer
</template>

<script>
export default {
  name: 'data-table',

  props: {
    items: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    pagesVisible: {
      type: Number,
      default: 7,
    },
    noDataText: {
      type: String,
      default: 'Não foram encontrados resultados para a busca.',
    },
    noResultsText: {
      type: String,
      default: 'Nenhum registro encontrado',
    },
    disabledActions: {
      type: Boolean,
      default: false,
    },
    hideSearch: {
      type: Boolean,
      default: false,
    },
    rowsPerPagePossibilites: {
      type: Array,
      default: () => [5, 10, 30, 50],
    },
    disableRowsPerPage: {
      type: Boolean,
      default: false,
    },
    search: {
      type: String,
      default: '',
    },
    enableCheckbox: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    privatePagination: {
      get() {
        return this.pagination;
      },
      set(value) {
        this.$emit('update:pagination', value);
      },
    },
    computedPagesVisible() {
      const { xsOnly } = this.$vuetify.breakpoint;
      const { pagesVisible } = this;

      return xsOnly ? 4 : pagesVisible;
    },
    perPageComputed: {
      get() {
        const {privatePagination} = this;
        return privatePagination.rowsPerPage;
      },
      set(value) {
        const {privatePagination} = this;
        if (value !== privatePagination.rowsPerPage) {
          privatePagination.rowsPerPage = value;
          this.$emit('changeRowsPerPage', value);
        }
      },
    },
    atualPageComputed: {
      get() {
        const { privatePagination } = this;
        return privatePagination.page;
      },
      set(value) {
        const { privatePagination } = this;
        if (value !== privatePagination.page) {
          privatePagination.page = value;
          this.$emit('changePage', value);
        }
      },
    },
    perPagePossibilities() {
      return this.rowsPerPagePossibilites;
    }
  },

  data: () => ({
    searchTerm: '',
  }),

  created() {
    this
      .privatePagination
      .totalItems = 0;

    this.searchTerm = this.search;
  },

  methods: {
    getClassesForHeader(header) {
      const { privatePagination } = this;
      const order = privatePagination.descending ? 'desc' : 'asc';
      const classes = {
        column: true,
        sortable: true,
      };

      classes[order] = true;

      if (header.value === privatePagination.sortBy) {
        classes.active = true;
      }

      return classes;
    },
    changeSort(column, sortable) {
      if (!sortable) return;
      const sortByIsEqualColumn = this.privatePagination.sortBy === column
      if (sortByIsEqualColumn) {
        this.privatePagination.descending = !this.privatePagination.descending;
      }

      if (!sortByIsEqualColumn) {
        this.privatePagination.descending = false;
        this.privatePagination.sortBy = column;
      }
      this.sortByItems(column);
    },
    sortByItems(column) {
      const { descending } = this.privatePagination;

      let { items } = this
      items.sort(function (item, nextItem) {
        let itemColumn = item[column];
        let nextItemColumn = nextItem[column];
        if (typeof item[column] === 'string' && typeof nextItem[column] === 'string') {
          itemColumn = item[column].toLowerCase();
          nextItemColumn = nextItem[column].toLowerCase();
        }

        if (itemColumn > nextItemColumn) {
          return 1;
        }

        if (itemColumn < nextItemColumn) {
          return -1;
        }

        return 0;
      });
      if (descending) {
        items.reverse();
      }
      this.$forceUpdate();
    },
    onSearchChange() {
      const { searchTerm } = this;
      this.$emit('search', searchTerm);
    },
    onClickNewItem() {
      this.$emit('newitem');
    },
    onClickEditItem(item) {
      this.$emit('edititem', item);
    },
    onClickDeleteItem(item) {
      this.$emit('deleteitem', item);
    },
    onClickItem(item) {
      this.$emit('clickitem', item);
    },
    changeCheckbox() {
      this.$emit('updateCheckBox');
    },
  },
};
</script>

<style lang="stylus">
th#btn-add
  width 108px

#rows-per-page
  display flex
  align-items center
  flex-direction row
  flex-wrap wrap

  .select
    max-width 50px

  @media only screen and (min-width: 600px) {
    position absolute
  }

.absolute
  position absolute

.truncate-text
  td
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    max-width 1px
</style>
