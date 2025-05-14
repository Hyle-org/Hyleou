<script setup lang="ts">
import ExplorerLayout from "@/explorer/components/ExplorerLayout.vue";
import CopyButton from "@/components/CopyButton.vue";
import { contractStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const contract_name = computed(() => route.params.contract_name as string);

watchEffect(() => {
    if (!contractStore.value.data[contract_name.value]) {
        contractStore.value.load(contract_name.value);
    }
});

const data = computed(() => contractStore.value.data?.[contract_name.value]);

const tabs = [{ name: "Overview" }, { name: "Raw JSON" }];
</script>

<template>
    <ExplorerLayout title="Contract Details" :tabs="tabs">
        <template #default="{ activeTab }">
            <div v-if="activeTab === 'Overview'" class="data-card">
                <div class="divide-y divide-secondary/5">
                    <div class="info-row">
                        <span class="info-label">Contract Name:</span>
                        <div class="flex items-center gap-2">
                            <span class="text-label">{{ contract_name }}</span>
                            <CopyButton :text="contract_name" />
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Transaction Hash:</span>
                        <div class="flex items-center gap-2">
                            <RouterLink
                                v-if="data?.tx_hash"
                                :to="{ name: 'Transaction', params: { tx_hash: data.tx_hash } }"
                                class="text-link"
                            >
                                {{ data.tx_hash }}
                            </RouterLink>
                            <CopyButton v-if="data?.tx_hash" :text="data.tx_hash" />
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Verifier:</span>
                        <span class="text-label">{{ data?.verifier }}</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Program ID:</span>
                        <span class="text-label">{{ data?.program_id }}</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">State Commitment:</span>
                        <div class="flex items-center gap-2 flex-1">
                            <span class="text-label">{{ data?.state_commitment }}</span>
                            <CopyButton v-if="data?.state_commitment" :text="data.state_commitment" />
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Total Transactions:</span>
                        <span class="text-label">{{ data?.total_tx || "0" }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total unsettled Transactions:</span>
                        <span class="text-label">{{ data?.unsettled_tx || "0" }}</span>
                    </div>
                </div>
            </div>

            <div v-else class="data-card">
                <h3 class="card-header">Contract Data</h3>
                <pre class="code-block">{{ JSON.stringify(data, null, 2) }}</pre>
            </div>
        </template>
    </ExplorerLayout>
</template>

<style scoped></style>
