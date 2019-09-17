<template lang="pug">
  #totalSmartsFlow
    v-card.primary.white--text.my-3
      v-card-title Fluxo total de smarts
      v-card-text
        v-container(grid-list-md)
          v-layout(column)
            v-flex(md12 xs12)
              .text-xs-center.display-4.font-weight-regular {{ totalSmartsFlow | currency }}
</template>

<script>
import WebSocketService from '@/services/WebSocketService';

export default {
  name: 'total-smarts-flow',

  data: () => ({
    webSocketService: WebSocketService.facade(),
    totalSmartsFlow: 0,
  }),

  created() {
    this.listenOnUpdateTotalSmartsFlow();
    this.webSocketService.startConnection()
  },

  methods: {
    listenOnUpdateTotalSmartsFlow() {
      const { hub } = this.webSocketService;
      hub.on('onUpdate', (value) => {
        this.totalSmartsFlow = value;
      })
    },
  },
};
</script>
