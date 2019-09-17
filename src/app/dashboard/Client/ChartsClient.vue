<template lang="pug">
  #chartsClient
    chart-clients-registered
    chart-clients-registered-and-active
    chart-clients-irregular-payment
    chart-clients-age-range
</template>

<script>
import ChartClientsRegistered from '@/app/dashboard/Client/ChartClientsRegistered';
import ChartClientsRegisteredAndActive from '@/app/dashboard/Client/ChartClientsRegisteredAndActive';
import ChartClientsIrregularPayment from '@/app/dashboard/Client/ChartClientsIrregularPayment';
import ChartClientsAgeRange from '@/app/dashboard/Client/ChartClientsAgeRange';

export default {
  components: {
    ChartClientsRegistered,
    ChartClientsRegisteredAndActive,
    ChartClientsIrregularPayment,
    ChartClientsAgeRange,
  },
};
</script>
