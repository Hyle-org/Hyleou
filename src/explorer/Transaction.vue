<script setup lang="ts">
import ExplorerLayout from "@/explorer/components/ExplorerLayout.vue";
import CopyButton from "@/components/CopyButton.vue";
import { transactionStore } from "@/state/data";
import { getTimeAgo } from "@/state/utils";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tx_hash = computed(() => route.params.tx_hash as string);

const loadTransactionData = async () => {
    await transactionStore.value.load(tx_hash.value);
};

// Watch for changes in the tx_hash and reload data
watch(() => tx_hash.value, loadTransactionData, { immediate: true });

const data = computed(() => transactionStore.value.data?.[tx_hash.value]);

const tabs = [{ name: "Overview" }, { name: "Blobs" }, { name: "Events" }, { name: "Raw JSON" }];

const formatTimestamp = (date: Date) => {
    return `${getTimeAgo(date)} (${date.toLocaleString()})`;
};

const decodeBytes = (bytes: number[]): string => {
    try {
        return new TextDecoder().decode(new Uint8Array(bytes));
    } catch (e) {
        return bytes.join(", ");
    }
};

const formatState = (state: number[]): string => {
    return state.map((b) => b.toString(16).padStart(2, "0")).join("");
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
                                :class="
                                    (() => {
                                        if (!data?.transaction_status) return 'pending';
                                        if (data.transaction_status === 'Success') return 'success';
                                        if (data.transaction_status === 'Failed') return 'failed';
                                        return 'default';
                                    })() + ' status-indicator'
                                "
                            ></div>
                            <span class="text-label">{{ data?.transaction_status || "Pending" }}</span>
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Parent DP Hash:</span>
                        <div class="flex items-center gap-2">
                            <span class="text-mono">{{ data?.parent_dp_hash }}</span>
                            <CopyButton :text="data?.parent_dp_hash" />
                        </div>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Timestamp:</span>
                        <span class="text-label">{{ formatTimestamp(new Date()) }} (fake)</span>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'Blobs' && data?.blobs" class="data-card">
                <h3 class="card-header">Blobs</h3>
                <div>
                    <div v-for="(blob, index) in data.blobs" :key="index" class="p-4 border-b-2">
                        <div class="mb-2">
                            <span class="text-sm font-medium text-secondary"
                                >Blob #{{ index + 1 }} to
                                <RouterLink :to="{ name: 'Contract', params: { contract_name: blob.contract_name } }" class="text-link">
                                    {{ blob.contract_name }}
                                </RouterLink>
                            </span>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-neutral">Data:</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-mono text-sm break-all">{{ blob.data }}</span>
                                    <CopyButton :text="blob.data" />
                                </div>
                            </div>
                            <div v-if="blob.proof_outputs && blob.proof_outputs.length > 0">
                                <div class="text-sm text-neutral mb-2">Proof Outputs:</div>
                                <div
                                    v-for="(output, outputIndex) in blob.proof_outputs"
                                    :key="outputIndex"
                                    class="mb-4 bg-secondary/5 rounded p-3"
                                >
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <div class="text-xs font-medium mb-1">Identity</div>
                                            <div class="text-xs text-mono">{{ output.identity }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs font-medium mb-1">Status</div>
                                            <div class="text-xs">
                                                <span :class="output.success ? 'text-green-600' : 'text-red-600'">
                                                    {{ output.success ? "Success" : "Failed" }}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="text-xs font-medium mb-1">Initial State</div>
                                            <div class="text-xs text-mono break-all">{{ formatState(output.initial_state) }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs font-medium mb-1">Next State</div>
                                            <div class="text-xs text-mono break-all">{{ formatState(output.next_state) }}</div>
                                        </div>
                                        <div class="col-span-2" v-if="output.program_outputs.length > 0">
                                            <div class="text-xs font-medium mb-1">Program Output</div>
                                            <div class="text-xs text-neutral">{{ decodeBytes(output.program_outputs) }}</div>
                                        </div>
                                        <div class="col-span-2" v-if="output.onchain_effects.length > 0">
                                            <div class="text-xs font-medium mb-1">Onchain Effects</div>
                                            <pre class="text-xs overflow-x-auto">{{ JSON.stringify(output.onchain_effects, null, 2) }}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'Events' && data?.events" class="data-card">
                <h3 class="card-header">Events</h3>
                <div>
                    <div v-for="(event, index) in data.events" :key="index" class="p-4 border-b-2">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-secondary">Event #{{ index + 1 }}: {{ event.name }}</span>
                            <RouterLink
                                v-if="event.block_hash"
                                :to="{ name: 'Block', params: { block_hash: event.block_hash } }"
                                class="text-xs text-link flex items-center gap-1"
                            >
                                Block: {{ event.block_hash }}
                                <CopyButton :text="event.block_hash" />
                            </RouterLink>
                        </div>
                        <div v-if="event.metadata" class="mt-2">
                            <pre class="text-xs bg-secondary/5 p-2 rounded overflow-x-auto">{{
                                JSON.stringify(event.metadata, null, 2)
                            }}</pre>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'Raw JSON'" class="data-card">
                <h3 class="card-header">Transaction Data</h3>
                <pre class="code-block">{{ JSON.stringify(data, null, 2) }}</pre>
            </div>
        </template>
    </ExplorerLayout>
</template>
