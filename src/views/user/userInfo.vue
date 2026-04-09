<template>
  <div class="page-container">
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">修改个人信息</h1>
        <div class="header-action" @click="goBack">
          <span>返回</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <h2 class="section-title">基本信息</h2>
      <van-form ref="infoFormRef" @submit="updateUserInfo" :model="userInfo" :rules="rules">
        <van-cell-group inset class="form-group">
          <van-field
            v-model="userInfo.nickname"
            name="用户昵称"
            label="用户昵称"
            placeholder="请输入您的昵称"
            :border="false"
            class="custom-field"
            left-icon="user-o"
          />
          <van-field
            v-model="userInfo.email"
            type="email"
            name="邮箱"
            label="邮箱"
            placeholder="请输入您的邮箱"
            :border="false"
            class="custom-field"
            left-icon="envelop-o"
          />
        </van-cell-group>
        <div class="button-container">
          <van-button round block type="primary" native-type="submit" class="submit-button">
            保存信息
          </van-button>
        </div>
      </van-form>

      <div class="divider"></div>

      <h2 class="section-title">修改密码</h2>
      <van-form ref="pwdFormRef" @submit="updateUserPwd" :model="userInfo" :rules="rules">
        <van-cell-group inset class="form-group">
          <van-field
            v-model="userInfo.oldPwd"
            type="password"
            name="旧密码"
            label="旧密码"
            placeholder="请输入旧密码"
            :border="false"
            class="custom-field"
            left-icon="lock"
          />
          <van-field
            v-model="userInfo.newPwd"
            type="password"
            name="新密码"
            label="新密码"
            placeholder="请输入新密码"
            :border="false"
            class="custom-field"
            left-icon="lock"
          />
          <van-field
            v-model="userInfo.rePwd"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="请再次输入新密码"
            :border="false"
            class="custom-field"
            left-icon="lock"
          />
        </van-cell-group>
        <div class="button-container">
          <van-button round block type="primary" native-type="submit" class="submit-button">
            修改密码
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
import { userInfoUpdateService, userResetPasswordService } from '@/api/user.js'
import { showFailToast, showToast } from 'vant'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()

const userInfo = ref({ ...userInfoStore.info })
const infoFormRef = ref(null)
const pwdFormRef = ref(null)

const goBack = () => {
  router.back()
}

const updateUserInfo = async () => {
  //调用接口
  let result = await userInfoUpdateService(userInfo.value)
  showToast({
    message: result.message,
    type: result.success ? 'success' : 'error',
  })
  //修改pinia中的个人信息
  userInfoStore.setInfo(userInfo.value)
}

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
  ],
  rePwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' },
    {
      validator: (val) => val === userInfo.value.newPwd,
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
}

const updateUserPwd = async () => {
  if (!pwdFormRef.value) {
    console.error('表单未绑定')
    return
  }

  try {
    // 使用 validate 方法的正确写法（返回 Promise）
    await pwdFormRef.value.validate()

    const { oldPwd, newPwd, rePwd } = userInfo.value

    if (newPwd !== rePwd) {
      showFailToast('新密码和确认密码不一致')
      return
    }

    let result = await userResetPasswordService(oldPwd, newPwd, rePwd)
    showToast({
      message: '修改成功',
      type: result.success ? 'success' : 'error',
    })

    tokenStore.removeToken()
    userInfoStore.removeInfo()
    router.push('/login')
  } catch (error) {
    showFailToast('修改失败')
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
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

.content-wrapper {
  flex: 1;
  padding: 20px 16px;
  margin-top: -1rem;
  background-color: white;
  border-radius: 2rem 2rem 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin: 24px 8px 16px;
  position: relative;
  padding-left: 12px;
  text-align: left;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    height: 16px;
    width: 4px;
    background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
    border-radius: 2px;
  }
}

.form-group {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
  margin-bottom: 16px;

  :deep(.van-cell) {
    padding: 16px;
  }

  :deep(.van-field__label) {
    width: 80px;
    color: #323233;
    font-weight: 500;
  }
}

.custom-field {
  :deep(.van-field__left-icon) {
    margin-right: 8px;
    color: #4a7afe;
  }
}

.button-container {
  margin: 24px 8px;
}

.submit-button {
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  box-shadow: 0 4px 8px rgba(63, 81, 181, 0.3);
  transition: all 0.3s ease;
  border: none;
  font-weight: 500;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(63, 81, 181, 0.3);
  }
}

.divider {
  height: 8px;
  background-color: #f2f3f5;
  margin: 24px -16px 16px;
  border-radius: 4px;
}
</style>
