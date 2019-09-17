<template lang="pug">
  #chartPayment
    total-smarts-flow
    chart-payment-pending-smarts
    chart-payment-pending-currency
    chart-receive-smart
    chart-payment-smart
</template>

<script>
import TotalSmartsFlow from '@/app/dashboard/Smarts/TotalSmartsFlow';
import ChartPaymentPendingSmarts from '@/app/dashboard/Smarts/ChartPaymentPendingSmarts';
import ChartPaymentPendingCurrency from '@/app/dashboard/Smarts/ChartPaymentPendingCurrency';
import ChartReceiveSmart from '@/app/dashboard/Smarts/ChartReceiveSmart';
import ChartPaymentSmart from '@/app/dashboard/Smarts/ChartPaymentSmart'

export default {
  components: {
    TotalSmartsFlow,
    ChartPaymentPendingSmarts,
    ChartPaymentPendingCurrency,
    ChartReceiveSmart,
    ChartPaymentSmart,
  }
}
</script>
