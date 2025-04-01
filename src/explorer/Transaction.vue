<script setup lang="ts">
import ExplorerLayout from "@/explorer/components/ExplorerLayout.vue";
import CopyButton from "@/components/CopyButton.vue";
import { transactionStore } from "@/state/data";
import { getTimeAgo } from "@/state/utils";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tx_hash = computed(() => route.params.tx_hash as string);

watchEffect(() => {
    if (!transactionStore.value.data[tx_hash.value]) {
        transactionStore.value.load(tx_hash.value);
    }
});

const data = computed(() => transactionStore.value.data?.[tx_hash.value]);

const tabs = [{ name: "Overview" }, { name: "Raw JSON" }];

const formatTimestamp = (date: Date) => {
    return `${getTimeAgo(date)} (${date.toLocaleString()})`;
};
</script>

<template>
    <ExplorerLayout title="Transaction Details" :tabs="tabs">
        <template #default="{ activeTab }">
            <div v-if="activeTab === 'Overview'" class="data-card">
                <div class="divide-y divide-secondary/5">
                    <div class="info-row">
                        <span class="info-label">Transaction Hash:</span>
                        <div class="flex items-center gap-2">
                            <span class="text-mono">{{ tx_hash }}</span>
                            <CopyButton :text="tx_hash" />
                        </div>
                    </div>

                    <div class="info-row" v-if="data?.block_hash">
                        <span class="info-label">Block:</span>
                        <div class="flex items-center gap-2">
                            <RouterLink :to="{ name: 'Block', params: { block_hash: data.block_hash } }" class="text-link">
                                {{ data.block_hash }}
                            </RouterLink>
                            <CopyButton :text="data.block_hash" />
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Transaction Type:</span>
                        <span class="text-label">{{ data?.transaction_type || "BlobTransaction" }}</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <div class="flex items-center gap-2">
                            <div
                                class="status-indicator"
                                :class="{
                                    pending: !data?.transaction_status,
                                    success: data?.transaction_status === 'Success',
                                    failed: data?.transaction_status === 'Failed',
                                    default: true,
                                }"
                            ></div>
                            <span class="text-label">{{ data?.transaction_status || "Pending" }}</span>
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Timestamp:</span>
                        <span class="text-label">{{ formatTimestamp(new Date()) }} (fake)</span>
                    </div>
                </div>
            </div>

            <div v-else class="data-card">
                <h3 class="card-header">Transaction Data</h3>
                <pre class="code-block">{{ JSON.stringify(data, null, 2) }}</pre>
            </div>
        </template>
    </ExplorerLayout>
</template>

<style scoped></style>
