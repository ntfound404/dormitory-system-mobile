<template>
  <div class="register-page">
    <div class="header-section">
      <div class="header-content">
        <h1 class="title">学生宿舍管理系统</h1>
        <div class="building-illustration">
          <van-icon name="friends-o" size="48" />
        </div>
      </div>
    </div>

    <div class="register-form-container">
      <h2 class="welcome-text">创建账号</h2>
      <p class="instruction-text">加入学生宿舍管理平台</p>

      <van-form @submit="register" class="register-form">
        <van-cell-group inset>
          <van-field
            v-model="registerData.username"
            name="username"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          >
            <template #right-icon>
              <van-icon name="contact" color="#1989fa" />
            </template>
          </van-field>

          <van-field
            v-model="registerData.password"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="[
              { required: true, message: '请填写密码' },
              { min: 6, message: '密码长度不能少于6位' },
            ]"
          >
            <template #right-icon>
              <van-icon name="lock" color="#1989fa" />
            </template>
          </van-field>

          <van-field
            v-model="registerData.rePassword"
            type="password"
            name="rePassword"
            placeholder="请再次输入密码"
            :rules="[{ required: true, message: '请再次输入密码' }]"
          >
            <template #right-icon>
              <van-icon name="lock" color="#1989fa" />
            </template>
          </van-field>
        </van-cell-group>

        <div class="button-container">
          <van-button
            round
            block
            native-type="submit"
            size="large"
            class="register-button"
          >
            注册
          </van-button>
        </div>

        <div class="login-section">
          <p>已有账号? <span class="login-link" @click="toLogin">立即登录</span></p>
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
import { userRegisterService } from "@/api/user.js";

const router = useRouter();

// 表单数据
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
});

const agreeTerms = ref(false);

// 提交表单
const register = async () => {
  if (registerData.value.password !== registerData.value.rePassword) {
    showToast({
      type: "fail",
      message: "两次密码输入不一致",
    });
    return;
  }

  try {
    await userRegisterService(registerData.value);

    showToast({
      type: "success",
      message: "注册成功",
      onClose: () => {
        // 注册成功后跳转到登录页
        router.push("/login");
      },
    });
  } catch (error) {
    showToast({
      type: "fail",
      message: "注册失败，请稍后重试",
    });
  }
};

// 跳转到登录页
const toLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-page {
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

.register-form-container {
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

.register-form {
  margin-bottom: 2rem;
}

.terms-container {
  margin: 1.5rem 0.5rem;
  font-size: 0.8rem;
}

.terms-link {
  color: #4a7afe;
  margin: 0 3px;
}

.button-container {
  margin: 2rem 0;
}

.register-button {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  border: none;
  font-weight: 600;
  height: 48px;
  font-size: 1rem;
}

.register-button:disabled {
  opacity: 0.6;
  background: linear-gradient(135deg, #a0b8e0 0%, #7a9bd0 100%);
}

.login-section {
  text-align: center;
  margin-top: 1.5rem;
}

.login-link {
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
