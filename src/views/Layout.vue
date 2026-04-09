<template>
  <div class="app-layout">
    <!-- 主内容区域 -->
    <div class="content-container">
      <router-view></router-view>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" class="custom-tabbar" route safe-area-inset-bottom>
      <van-tabbar-item to="/notice">
        <template #icon="props">
          <div class="tab-icon-container">
            <van-icon name="comment-o" :class="{ active: props.active }" />
            <div class="indicator" :class="{ 'indicator-active': props.active }"></div>
          </div>
        </template>
        <span :class="{ active: activeTab === 0 }">公告</span>
      </van-tabbar-item>

      <van-tabbar-item to="/check">
        <template #icon="props">
          <div class="tab-icon-container">
            <van-icon name="location-o" :class="{ active: props.active }" />
            <div class="indicator" :class="{ 'indicator-active': props.active }"></div>
          </div>
        </template>
        <span :class="{ active: activeTab === 1 }">打卡签到</span>
      </van-tabbar-item>

      <van-tabbar-item to="/my">
        <template #icon="props">
          <div class="tab-icon-container">
            <van-icon name="contact-o" :class="{ active: props.active }" />
            <div class="indicator" :class="{ 'indicator-active': props.active }"></div>
          </div>
        </template>
        <span :class="{ active: activeTab === 2 }">个人中心</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const activeTab = ref(0);
const route = useRoute();

// 根据当前路由路径设置活动标签
watch(
  () => route.path,
  (path) => {
    if (path.includes("/notice")) {
      activeTab.value = 0;
    } else if (path.includes("/check")) {
      activeTab.value = 1;
    } else if (path.includes("/my")) {
      activeTab.value = 2;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.content-container {
  flex: 1;
  position: relative;
  overflow-y: auto;
  padding-bottom: 70px; /* 为底部导航留出空间 */
}

.custom-tabbar {
  height: 65px;
  border-top: none;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
  background: white;
  border-radius: 20px 20px 0 0;
}

.tab-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 6px;
}

.van-icon {
  font-size: 20px;
  transition: all 0.3s;
}

.van-icon.active {
  color: #4a7afe;
  transform: translateY(-2px);
}

.indicator {
  position: absolute;
  bottom: -2px;
  width: 0;
  height: 3px;
  background: linear-gradient(to right, #4a7afe, #2364e8);
  border-radius: 3px;
  transition: width 0.3s;
}

.indicator-active {
  width: 20px;
}

span {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
  transition: all 0.3s;
}

span.active {
  color: #4a7afe;
  font-weight: 500;
}
</style>
