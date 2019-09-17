<template lang="pug">
  v-tabs(
    color="primary"
    v-model="active"
    )
    v-layout(justify-center)
      v-tab(
        ripple
        :key="tab.name"
        v-for="tab in tabs"
        )
        .subheading.white--text {{ tab.name }}
    v-tab-item(
      :key="tab.name"
      v-for="tab in tabs"
      )
      v-card
        publication-status-list(
          :params="tab.params"
          )
</template>

<script>
import PublicationStatusList from './PublicationStatusList.vue';

export default {
  components: {
    PublicationStatusList,
  },
  data: () => ({
    active: null,
    tabs: [
      {
        name: 'Aguardando aprovações',
        params: {
          situacao: 'Aguardando',
          edit: true,
        },
      },
      {
        name: 'Aprovados',
        params: {
          situacao: 'Aprovada',
        },
      },
      {
        name: 'Reprovados',
        params: {
          situacao: 'Reprovada',
        },
      },
      {
        name: 'Todos',
        params: {
          situacao: 'Default',
        },
      },
    ],
  }),
};
</script>
