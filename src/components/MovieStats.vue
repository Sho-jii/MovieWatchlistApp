<template>
  <ion-grid class="ion-no-padding stats-grid">
    <ion-row>
      <ion-col size="4">
        <ion-card
          class="stat-card"
          :class="{ 'is-active': filterStatus === 'All' }"
          button
          @click="$emit('select-filter', 'All')"
        >
          <ion-card-content>
            <div class="stat-card-topline">
              <span class="stat-label">TOTAL LIBRARY</span>
              <span class="stat-icon stat-icon-total">◎</span>
            </div>
            <div class="stat-number">{{ total }}</div>
            <div class="stat-caption">films in your collection</div>
            <div class="stat-track"><span :style="{ width: total ? '100%' : '0%' }" /></div>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="4">
        <ion-card
          class="stat-card stat-watched"
          :class="{ 'is-active': filterStatus === 'Watched' }"
          button
          @click="$emit('select-filter', 'Watched')"
        >
          <ion-card-content>
            <div class="stat-card-topline">
              <span class="stat-label">COMPLETED</span>
              <span class="stat-icon stat-icon-watched">✓</span>
            </div>
            <div class="stat-number">{{ watched }}</div>
            <div class="stat-caption">stories you finished</div>
            <div class="stat-track"><span :style="{ width: total ? `${(watched / total) * 100}%` : '0%' }" /></div>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="4">
        <ion-card
          class="stat-card stat-not-watched"
          :class="{ 'is-active': filterStatus === 'Not Watched' }"
          button
          @click="$emit('select-filter', 'Not Watched')"
        >
          <ion-card-content>
            <div class="stat-card-topline">
              <span class="stat-label">UP NEXT</span>
              <span class="stat-icon stat-icon-pending">◷</span>
            </div>
            <div class="stat-number">{{ pending }}</div>
            <div class="stat-caption">waiting for movie night</div>
            <div class="stat-track"><span :style="{ width: total ? `${(pending / total) * 100}%` : '0%' }" /></div>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonRow,
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
  margin: 0 -4px 18px;
}

.stat-card {
  position: relative;
  overflow: hidden;
  min-height: 148px;
  margin: 4px;
  border: 0;
  border-radius: 20px;
  background: #1f2933;
  box-shadow: 0 12px 24px rgba(31, 41, 51, 0.12);
  text-align: left;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

.stat-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  width: 5px;
  background: #f6c85f;
  content: '';
}

.stat-card::after {
  position: absolute;
  right: -44px;
  bottom: -55px;
  width: 135px;
  height: 135px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  box-shadow: 0 0 0 18px rgba(255, 255, 255, 0.04), 0 0 0 36px rgba(255, 255, 255, 0.03);
  content: '';
  pointer-events: none;
}

.stat-card:first-child {
  background: linear-gradient(145deg, #273b4b, #1f2933);
}

.stat-watched {
  background: linear-gradient(145deg, #167f78, #115d67);
}

.stat-not-watched {
  background: linear-gradient(145deg, #d8793c, #b94e43);
}

.stat-watched::before {
  background: #8de0d3;
}

.stat-not-watched::before {
  background: #f6c85f;
}

.stat-card:hover {
  box-shadow: 0 18px 32px rgba(31, 41, 51, 0.18);
  transform: translateY(-5px);
}

.stat-card.is-active {
  box-shadow: 0 0 0 3px #f6c85f, 0 18px 32px rgba(31, 41, 51, 0.18);
  transform: translateY(-5px);
}

.stat-card:active {
  transform: translateY(0);
}

.stat-card ion-card-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 148px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 18px 16px 16px 21px;
}

.stat-card-topline {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  display: grid;
  width: 30px;
  height: 30px;
  margin: 0;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 1.05rem;
  font-weight: 800;
}

.stat-icon-total {
  color: #f6c85f;
}

.stat-icon-watched {
  color: #8de0d3;
}

.stat-icon-pending {
  color: #f6c85f;
}

.stat-number {
  margin-top: 10px;
  color: #fffefa;
  font-size: 2.15rem;
  font-weight: 800;
  line-height: 1;
}

.stat-watched .stat-number {
  color: #fffefa;
}

.stat-not-watched .stat-number {
  color: #fffefa;
}

.stat-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stat-caption {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.68rem;
  line-height: 1.2;
}

.stat-track {
  width: 100%;
  height: 4px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
}

.stat-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #f6c85f;
  transition: width 350ms ease;
}

.stat-watched .stat-track span {
  background: #8de0d3;
}

.stat-not-watched .stat-track span {
  background: #f6c85f;
}

@media (max-width: 520px) {
  .stat-card {
    min-height: 132px;
  }

  .stat-card ion-card-content {
    min-height: 132px;
    padding: 15px 11px 13px 16px;
  }

  .stat-icon {
    width: 28px;
    height: 28px;
  }

  .stat-number {
    font-size: 1.85rem;
  }

  .stat-label {
    font-size: 0.64rem;
  }

  .stat-caption {
    max-width: 76px;
    font-size: 0.6rem;
  }

  .stat-track {
    margin-top: 9px;
  }
}
</style>
