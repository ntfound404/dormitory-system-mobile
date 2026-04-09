<template>
  <div class="check-in-page">
    <!-- 顶部区域 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">打卡签到</h1>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-container">
      <!-- 地图卡片 -->
      <div class="map-card">
        <div class="card-section">
          <GaoDeMap @updateLocation="handleLocationUpdate" />

          <div class="location-info">
            <div class="info-item">
              <div class="info-label">
                <van-icon name="location-o" color="#4a7afe" />
                <span>当前位置</span>
              </div>
              <div class="info-value">{{ currentLocation?.address || "获取中..." }}</div>
            </div>

            <van-button type="primary" block class="check-in-btn" @click="handleSignIn">
              <van-icon name="sign" />
              <span>立即打卡</span>
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import GaoDeMap from "@/components/MapContainer.vue";
import { SignInService } from "@/api/check.js";
import { getUserStudentService } from "@/api/user.js";
import useUserInfoStore from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
import { showFailToast, showToast } from "vant";

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();

const studentId = ref(null);
const currentLocation = ref(null);

const handleLocationUpdate = (data) => {
  currentLocation.value = data;
};

//获取用户绑定学生信息
const getStudentInfo = async () => {
  if (!userInfoStore.info || !userInfoStore.info.id) {
    showFailToast("用户信息未加载，无法获取学生信息,请稍后重试");
    return;
  }
  let result = await getUserStudentService(userInfoStore.info.id);
  studentId.value = result.data.id;
};
getStudentInfo();

const handleSignIn = async () => {
  if (
    currentLocation.value.address ===
    "河南省郑州市新郑市龙湖镇公园大地河南工程学院龙湖校区西区"
  ) {
    await SignInService(studentId.value);
    showToast({
      type: "success",
      message: "打卡成功",
    });
  } else {
    showFailToast("打卡失败，请在指定地点打卡");
  }
};
</script>

<style scoped>
.check-in-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header-section {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  padding: 1.5rem 1rem 2rem;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
}

.page-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  padding-left: 0.5rem;
}

.content-container {
  flex: 1;
  padding: 1rem;
  margin-top: -1rem;
  z-index: 1;
}

.map-card {
  display: flex;
  flex-direction: column;
}

.card-section {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.location-info {
  padding: 0.5rem 1rem 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f2f3f5;
}

.info-label {
  display: flex;
  align-items: center;
  color: #666;
}

.info-label .van-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.info-value {
  color: #323233;
  font-size: 0.9rem;
  max-width: 70%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check-in-btn {
  margin-top: 1rem;
  height: 44px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 24px;
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%) !important;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-in-btn .van-icon {
  margin-right: 0.4rem;
  font-size: 1.1rem;
}
</style>
