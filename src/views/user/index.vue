<template>
  <div class="profile-page">
    <!-- 顶部区域 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">个人中心</h1>
        <div class="header-action" @click="goToUserInfo">
          <span>修改个人信息</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-container">
      <!-- 加载状态 -->
      <div class="loading-state" v-if="!userInfoStore.info.username">
        <van-loading type="spinner" color="#4a7afe" size="36px" />
        <p>加载用户信息中...</p>
      </div>

      <!-- 用户信息卡片 -->
      <div class="profile-card" v-else>
        <div class="card-section">
          <div class="section-header">
            <van-icon name="user-circle-o" color="#4a7afe" />
            <span>个人信息</span>
          </div>
          <van-divider dashed :style="{ margin: '10px 0' }" />

          <div class="info-item">
            <div class="info-label">
              <van-icon name="user-o" color="#4a7afe" />
              <span>用户名</span>
            </div>
            <div class="info-value">{{ userInfoStore.info.username }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <van-icon name="label-o" color="#4a7afe" />
              <span>用户昵称</span>
            </div>
            <div class="info-value" v-if="userInfoStore.info.nickname">
              {{ userInfoStore.info.nickname }}
            </div>
            <div class="info-value empty" v-else>暂无用户昵称</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <van-icon name="envelop-o" color="#4a7afe" />
              <span>用户邮箱</span>
            </div>
            <div class="info-value" v-if="userInfoStore.info.email">
              {{ userInfoStore.info.email }}
            </div>
            <div class="info-value empty" v-else>暂无用户邮箱</div>
          </div>
        </div>

        <!-- 学生信息卡片 -->
        <div class="card-section">
          <div class="section-header">
            <van-icon name="manager-o" color="#4a7afe" />
            <span>学生信息</span>
          </div>
          <van-divider dashed :style="{ margin: '10px 0' }" />

          <div class="info-item">
            <div class="info-label">
              <van-icon name="bookmark-o" color="#4a7afe" />
              <span>学号</span>
            </div>
            <div class="info-value" v-if="studentData.studentId">
              {{ studentData.studentId }}
            </div>
            <div class="info-value empty" v-else>暂无学生学号</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <van-icon name="contact" color="#4a7afe" />
              <span>学生姓名</span>
            </div>
            <div class="info-value" v-if="studentData.name">{{ studentData.name }}</div>
            <div class="info-value empty" v-else>暂无学生姓名</div>
          </div>

          <div class="info-grid">
            <div class="grid-item">
              <div class="info-label">
                <van-icon name="friends-o" color="#4a7afe" />
                <span>性别</span>
              </div>
              <div class="info-value" v-if="studentData.gender">
                {{ studentData.gender }}
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>

            <div class="grid-item">
              <div class="info-label">
                <van-icon name="cluster-o" color="#4a7afe" />
                <span>班级</span>
              </div>
              <div class="info-value" v-if="studentData.group">
                {{ studentData.group }}班
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="grid-item">
              <div class="info-label">
                <van-icon name="home-o" color="#4a7afe" />
                <span>寝室号</span>
              </div>
              <div class="info-value" v-if="studentData.dormNumber">
                {{ studentData.dormNumber }}
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>

            <div class="grid-item">
              <div class="info-label">
                <van-icon name="todo-list-o" color="#4a7afe" />
                <span>专业</span>
              </div>
              <div class="info-value" v-if="studentData.major">
                {{ studentData.major }}
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="grid-item">
              <div class="info-label">
                <van-icon name="phone-o" color="#4a7afe" />
                <span>电话</span>
              </div>
              <div class="info-value" v-if="studentData.phone">
                {{ studentData.phone }}
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>

            <div class="grid-item">
              <div class="info-label">
                <van-icon name="calendar-o" color="#4a7afe" />
                <span>入学年份</span>
              </div>
              <div class="info-value" v-if="studentData.enrollmentYear">
                {{ studentData.enrollmentYear }}年
              </div>
              <div class="info-value empty" v-else>暂无</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
          @click="goToSelectStudentInfo"
          round
          block
          type="primary"
          class="action-button"
        >
          <van-icon name="link-o" />
          <span>绑定学生信息</span>
        </van-button>

        <van-button
          @click="logout"
          round
          block
          type="danger"
          class="action-button logout-button"
        >
          <van-icon name="close" />
          <span>退出登录</span>
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  userInfoService,
  getStudnetInfoService,
  getRoomInfoService,
} from "@/api/user.js";
import useUserInfoStore from "@/stores/userInfo.js";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";
import { showConfirmDialog } from "vant";

const tokenStore = useTokenStore();
const router = useRouter();
const userInfoStore = useUserInfoStore();

//获取用户信息
const getUserInfo = async () => {
  let result = await userInfoService();
  userInfoStore.setInfo(result.data);
};

// 获取学生信息
const getStudentInfo = async () => {
  try {
    // 等待用户信息获取完成后，才能获取学生信息
    if (!userInfoStore.info || !userInfoStore.info.id) {
      console.error("用户ID未获取到，无法查询学生信息");
      return;
    }

    let result = await getStudnetInfoService(userInfoStore.info.id);

    // 检查是否有返回数据
    if (!result || !result.data) {
      console.error("未获取到学生信息");
      return;
    }

    studentData.value = result.data;

    // 检查是否有宿舍ID，再获取宿舍信息
    if (studentData.value && studentData.value.roomId) {
      const dormNumber = await getRoomInfoService(studentData.value.roomId);
      if (dormNumber && dormNumber.data && dormNumber.data.length > 0) {
        studentData.value.dormNumber = dormNumber.data[0].dormNumber;
      }
    }
  } catch (error) {
    console.error("获取学生信息出错:", error);
  }
};

onMounted(async () => {
  await getUserInfo();
  await getStudentInfo();
});

const studentData = ref({
  studentId: null,
  name: "",
  gender: "",
  group: "",
  major: "",
  phone: null,
  enrollmentYear: null,
  dormNumber: "",
});

const goToSelectStudentInfo = () => {
  router.push("/studentInfo");
};

const goToUserInfo = () => {
  router.push("/userInfo");
};

const logout = () => {
  showConfirmDialog({
    title: "确认退出",
    message: "您确定要退出登录吗？",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    confirmButtonColor: "#4a7afe",
    cancelButtonColor: "#333",
    showCancelButton: true,
    closeOnConfirm: false,
    closeOnCancel: false,
  })
    .then(() => {
      tokenStore.removeToken();
      userInfoStore.removeInfo();

      //2.跳转到登录页面
      router.push("/login");
    })
    .catch(() => {
      // 点击取消按钮不做任何操作
    });
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header-section {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  padding: 1.5rem 1rem 1.5rem;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-action {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
}

.header-action .van-icon {
  margin-left: 4px;
  font-size: 0.8rem;
}

.profile-container {
  flex: 1;
  padding: 1rem;
  margin-top: -1rem;
  z-index: 1;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #969799;
}

.loading-state p {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-section {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.section-header .van-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f2f3f5;
}

.info-item:last-child {
  border-bottom: none;
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
  font-weight: 500;
}

.info-value.empty {
  color: #969799;
  font-weight: normal;
}

.info-grid {
  display: flex;
  border-bottom: 1px solid #f2f3f5;
}

.info-grid:last-child {
  border-bottom: none;
}

.grid-item {
  flex: 1;
  padding: 0.8rem 0;
  display: flex;
  flex-direction: column;
}

.grid-item:first-child {
  border-right: 1px solid #f2f3f5;
  padding-right: 0.8rem;
}

.grid-item:last-child {
  padding-left: 0.8rem;
}

.grid-item .info-label {
  margin-bottom: 0.4rem;
}

.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
}

.action-button .van-icon {
  margin-right: 0.4rem;
  font-size: 1.1rem;
}

.van-button--primary {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%) !important;
  border: none !important;
}

.logout-button {
  background: linear-gradient(135deg, #ff6b6b, #f03e3e) !important;
  border: none !important;
}
</style>
