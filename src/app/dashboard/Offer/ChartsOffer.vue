<template lang="pug">
  #chartOffer
    chart-offer-active
    chart-offer-pending-approval-per-plan
    chart-offer-pending-approval-by-advertiser-per-plan
</template>
<script>
import ChartOfferActive from '@/app/dashboard/Offer/ChartOfferActive';
import ChartOfferPendingApprovalPerPlan from '@/app/dashboard/Offer/ChartOfferPendingApprovalPerPlan';
import ChartOfferPendingApprovalByAdvertiserPerPlan from '@/app/dashboard/Offer/ChartOfferPendingApprovalByAdvertiserPerPlan';
export default {
  components: {
    ChartOfferActive,
    ChartOfferPendingApprovalPerPlan,
    ChartOfferPendingApprovalByAdvertiserPerPlan,
  }
};
</script>

