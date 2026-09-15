<template>
  <ion-grid class="ion-no-padding stats-grid">
    <ion-row>
      <ion-col size="4">
        <ion-card
          class="stat-tile"
          :class="{ 'is-active': filterStatus === 'All' }"
          button
          @click="$emit('select-filter', 'All')"
        >
          <ion-card-content class="stat-content">
            <div class="stat-topline">
              <span class="stat-label">TOTAL</span>
              <span class="stat-icon stat-icon-total">●</span>
            </div>
            <div class="stat-number">{{ total }}</div>
            <div class="stat-caption">In collection</div>
            <div class="stat-track">
              <div class="stat-bar stat-bar-total" :style="{ width: total ? '100%' : '0%' }" />
            </div>
          </ion-card-content>
        </ion-card>
      </ion-col>

      <ion-col size="4">
        <ion-card
          class="stat-tile"
          :class="{ 'is-active': filterStatus === 'Watched' }"
          button
          @click="$emit('select-filter', 'Watched')"
        >
          <ion-card-content class="stat-content">
            <div class="stat-topline">
              <span class="stat-label">WATCHED</span>
              <span class="stat-icon stat-icon-watched">✓</span>
            </div>
            <div class="stat-number text-mint">{{ watched }}</div>
            <div class="stat-caption">Finished</div>
            <div class="stat-track">
              <div
                class="stat-bar stat-bar-watched"
                :style="{ width: total ? `${(watched / total) * 100}%` : '0%' }"
              />
            </div>
          </ion-card-content>
        </ion-card>
      </ion-col>

      <ion-col size="4">
        <ion-card
          class="stat-tile"
          :class="{ 'is-active': filterStatus === 'Not Watched' }"
          button
          @click="$emit('select-filter', 'Not Watched')"
        >
          <ion-card-content class="stat-content">
            <div class="stat-topline">
              <span class="stat-label">PENDING</span>
              <span class="stat-icon stat-icon-pending">◷</span>
            </div>
            <div class="stat-number text-orange">{{ pending }}</div>
            <div class="stat-caption">Up next</div>
            <div class="stat-track">
              <div
                class="stat-bar stat-bar-pending"
                :style="{ width: total ? `${(pending / total) * 100}%` : '0%' }"
              />
            </div>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
} from '@ionic/vue';

defineProps<{
  total: number;
  watched: number;
  pending: number;
  filterStatus: 'All' | 'Watched' | 'Not Watched';
}>();

defineEmits<{
  'select-filter': [value: 'All' | 'Watched' | 'Not Watched'];
}>();
</script>

<style scoped>
.stats-grid {
  margin: 0 -4px 22px;
}

.stat-tile {
  margin: 4px;
  border-radius: 22px;
  background: var(--neu-bg);
  box-shadow: var(--neu-raised);
  border: var(--neu-border);
  transition: all 220ms cubic-bezier(0.4, 0, 0.2, 1);
  --background: var(--neu-bg);
  --color: inherit;
  overflow: visible;
}

.stat-tile::part(native) {
  border-radius: 22px;
  background: transparent;
}

.stat-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 128px;
  padding: 16px 14px 14px;
  box-sizing: border-box;
}

.stat-tile:hover {
  transform: translateY(-2px);
}

.stat-tile:active {
  transform: translateY(1px);
  box-shadow: var(--neu-raised-pressed);
}

.stat-tile.is-active {
  box-shadow: var(--neu-inset);
  transform: translateY(0);
}

.stat-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  color: var(--neu-text-sub);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stat-icon {
  font-size: 0.8rem;
  font-weight: 900;
}

.stat-icon-total {
  color: var(--neu-text-sub);
}

.stat-icon-watched {
  color: var(--neu-mint);
}

.stat-icon-pending {
  color: #F36423;
}

.stat-number {
  color: var(--neu-text-main);
  font-size: 1.8rem;
  font-weight: 900;
  line-height: 1;
  margin: 6px 0 2px;
  letter-spacing: -0.02em;
}

.text-mint {
  color: var(--neu-mint);
}

.text-orange {
  color: #F36423;
}

.stat-caption {
  color: var(--neu-text-sub);
  font-size: 0.68rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--neu-bg);
  box-shadow: var(--neu-inset-sm);
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 999px;
  transition: width 350ms ease;
}

.stat-bar-total {
  background: #334454;
}

.stat-bar-watched {
  background: var(--neu-mint);
}

.stat-bar-pending {
  background: var(--neu-orange-grad);
}

@media (max-width: 480px) {
  .stat-content {
    min-height: 118px;
    padding: 12px 10px 10px;
  }

  .stat-tile {
    border-radius: 18px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.58rem;
  }

  .stat-caption {
    font-size: 0.62rem;
  }
}
</style>
