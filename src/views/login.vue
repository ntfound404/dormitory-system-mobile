<template>
  <div class="login-page">
    <div class="header-section">
      <div class="header-content">
        <h1 class="title">学生宿舍管理系统</h1>
        <div class="building-illustration">
          <van-icon name="home-o" size="48" />
        </div>
      </div>
    </div>

    <div class="login-form-container">
      <h2 class="welcome-text">欢迎回来</h2>
      <p class="instruction-text">请使用您的账号登录系统</p>

      <van-form @submit="login" class="login-form">
        <van-cell-group inset>
          <van-field
            v-model="loginData.username"
            name="username"
            placeholder="用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <template #right-icon>
              <van-icon name="contact" color="#1989fa" />
            </template>
          </van-field>

          <van-field
            v-model="loginData.password"
            type="password"
            name="password"
            placeholder="密码"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <template #right-icon>
              <van-icon name="lock" color="#1989fa" />
            </template>
          </van-field>
        </van-cell-group>

        <div class="button-container">
          <van-button round block native-type="submit" size="large" class="login-button">
            登录
          </van-button>
        </div>

        <div class="register-section">
          <p>没有账号? <span class="register-link" @click="toRegister">立即注册</span></p>
        </div>
      </van-form>
    </div>

    <div class="footer">
      <p>© 2025 学生宿舍管理系统</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";
import { userLoginService } from "@/api/user.js";

const router = useRouter();
const tokenStore = useTokenStore();

// 数据模型
const loginData = ref({
  username: "",
  password: "",
});

// 登录方法
const login = async () => {
  try {
    let result = await userLoginService(loginData.value);
    tokenStore.setToken(result.data);

    showToast({
      message: "登录成功",
      type: "success",
    });
    router.push("/notice");
  } catch (error) {
    showToast({
      message: "登录失败，请检查用户名和密码",
      type: "fail",
    });
  }
};

// 跳转到注册页面
const toRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header-section {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  padding: 2rem 1.5rem;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.building-illustration {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 1rem 0;
}

.login-form-container {
  flex: 1;
  padding: 2rem 1.5rem;
  margin-top: -1rem;
  background-color: white;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.welcome-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #323233;
  margin-bottom: 0.5rem;
  text-align: center;
}

.instruction-text {
  font-size: 0.9rem;
  color: #969799;
  margin-bottom: 2rem;
  text-align: center;
}

.login-form {
  margin-bottom: 2rem;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 0 0.5rem;
}

.forgot-password {
  color: #4a7afe;
  font-size: 0.9rem;
}

.button-container {
  margin: 2rem 0;
}

.login-button {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  border: none;
  font-weight: 600;
  height: 48px;
  font-size: 1rem;
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
}

.register-link {
  color: #4a7afe;
  font-weight: 600;
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: #969799;
  margin-top: auto;
}
</style>
