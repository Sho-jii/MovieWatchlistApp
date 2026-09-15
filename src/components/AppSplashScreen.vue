<template>
  <transition name="splash-fade">
    <div v-if="isVisible" class="splash-screen" role="dialog" aria-modal="true" aria-label="Loading Movie Watchlist">
      <!-- Ambient Studio Radial Glow -->
      <div class="splash-ambient-light" />

      <div class="splash-center-content">
        <!-- 3D Skeuomorphic App Icon Plaque -->
        <div class="splash-icon-plaque">
          <div class="splash-glow-ring" />
          <img
            src="/app_icon.jpg"
            alt="Movie Watchlist App Icon"
            class="splash-app-icon"
          />
        </div>

        <!-- Typography -->
        <div class="splash-brand">
          <h1 class="splash-title">Ranking</h1>
          <span class="splash-tagline">PERSONAL CINEMA DESK</span>
        </div>

        <!-- Sunken Skeuomorphic Progress Bar -->
        <div class="splash-progress-track">
          <div class="splash-progress-bar" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neu-bg, #EBF0F7);
  overflow: hidden;
}

.splash-ambient-light {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 140, 66, 0.12) 0%, rgba(235, 240, 247, 0) 70%);
  pointer-events: none;
}

.splash-center-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
}

/* 3D Skeuomorphic Extruded Plaque */
.splash-icon-plaque {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 36px;
  background: var(--neu-bg, #EBF0F7);
  box-shadow:
    14px 14px 28px rgba(166, 180, 200, 0.75),
    -14px -14px 28px #FFFFFF,
    inset 1px 1px 2px rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  animation: plaqueFloat 3.2s ease-in-out infinite alternate;
}

.splash-glow-ring {
  position: absolute;
  inset: -6px;
  border-radius: 42px;
  background: radial-gradient(circle, rgba(243, 100, 35, 0.25) 0%, transparent 70%);
  filter: blur(8px);
  z-index: 0;
  animation: glowPulse 2.4s ease-in-out infinite alternate;
}

.splash-app-icon {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 26px;
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.8),
    0 4px 12px rgba(51, 68, 84, 0.12);
}

/* Brand Headings */
.splash-brand {
  margin-top: 28px;
}

.splash-title {
  margin: 0;
  color: var(--neu-text-main, #334454);
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9), -1px -1px 2px rgba(166, 180, 200, 0.4);
}

.splash-tagline {
  display: block;
  margin-top: 4px;
  color: #F36423;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* Sunken Progress Groove */
.splash-progress-track {
  width: 190px;
  height: 8px;
  border-radius: 999px;
  background: var(--neu-bg, #EBF0F7);
  box-shadow:
    inset 3px 3px 6px rgba(166, 180, 200, 0.65),
    inset -3px -3px 6px #FFFFFF;
  margin-top: 28px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.splash-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 45%;
  border-radius: 999px;
  background: linear-gradient(135deg, #FF8C42 0%, #F36423 100%);
  box-shadow: 0 0 10px rgba(243, 100, 35, 0.7);
  animation: liquidProgress 1.6s ease-in-out infinite;
}

/* Animations */
@keyframes plaqueFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-6px);
  }
}

@keyframes glowPulse {
  0% {
    opacity: 0.4;
    transform: scale(0.96);
  }
  100% {
    opacity: 0.85;
    transform: scale(1.04);
  }
}

@keyframes liquidProgress {
  0% {
    left: -45%;
    width: 35%;
  }
  50% {
    width: 65%;
  }
  100% {
    left: 100%;
    width: 35%;
  }
}

@keyframes dotBlink {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

/* Vue Transitions */
.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
