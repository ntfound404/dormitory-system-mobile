<template>
  <div class="page-container">
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">绑定学生信息</h1>
        <div class="header-action" @click="goBack">
          <span>返回</span>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <div v-if="isAlreadyBound" class="already-bound-container">
        <van-empty description="您已绑定学生信息" image="error">
          <template #description>
            <p class="empty-desc">您已绑定学生信息，不能重复绑定</p>
          </template>
          <van-button round type="primary" class="back-button" @click="goBack">返回</van-button>
        </van-empty>
      </div>
      <template v-else>
        <h2 class="section-title">学生信息</h2>
        <van-form ref="studentInfoRef" @submit.prevent :model="studentData" :rules="rules">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="studentData.studentId"
              name="学号"
              label="学号"
              placeholder="请输入学号"
              :border="false"
              class="custom-field"
              left-icon="bookmark-o"
            />
            <van-field
              v-model="studentData.name"
              name="姓名"
              label="姓名"
              placeholder="请输入学生姓名"
              :border="false"
              class="custom-field"
              left-icon="user-o"
            />

            <van-field
              v-model="studentData.gender"
              name="性别"
              label="性别"
              placeholder="请选择学生性别"
              :border="false"
              class="custom-field"
              left-icon="friends-o"
              is-link
              readonly
              @click="showGender = true"
            />
            <van-popup v-model:show="showGender" destroy-on-close position="bottom">
              <van-picker
                :columns="gender"
                @confirm="onGenderConfirm"
                @cancel="showGender = false"
              />
            </van-popup>
            <van-field
              v-model="studentData.phone"
              name="手机号码"
              label="手机号码"
              placeholder="请输入学生手机号码"
              :border="false"
              class="custom-field"
              left-icon="phone-o"
            />
            <van-field
              v-model="studentData.group"
              name="班级"
              label="班级"
              placeholder="请输入学生班级"
              :border="false"
              class="custom-field"
              left-icon="cluster-o"
            />
            <van-field
              v-model="studentData.major"
              name="专业"
              label="专业"
              placeholder="请输入学生专业"
              :border="false"
              class="custom-field"
              left-icon="todo-list-o"
            />
            <van-field
              v-model="studentData.building"
              name="宿舍楼"
              label="宿舍楼"
              placeholder="请选择学生宿舍楼"
              :border="false"
              class="custom-field"
              left-icon="wap-home-o"
              is-link
              readonly
              @click="showBuilding = true"
            />
            <van-popup v-model:show="showBuilding" destroy-on-close position="bottom">
              <van-picker
                :columns="buildingList"
                @confirm="onBuildingConfirm"
                @cancel="showBuilding = false"
              />
            </van-popup>
            <van-field
              v-model="dormDisplay"
              name="宿舍号"
              label="宿舍号"
              placeholder="请选择学生宿舍号"
              :border="false"
              class="custom-field"
              left-icon="home-o"
              is-link
              readonly
              @click="showRoom = true"
            />
            <van-popup v-model:show="showRoom" destroy-on-close position="bottom">
              <van-picker :columns="roomList" @confirm="onRoomConfirm" @cancel="showRoom = false" />
            </van-popup>
            <van-field
              v-model="studentData.enrollmentYear"
              name="入学年份"
              label="入学年份"
              placeholder="请输入学生入学年份"
              :border="false"
              class="custom-field"
              left-icon="calendar-o"
            />
          </van-cell-group>
          <div class="button-container">
            <van-button
              round
              block
              type="primary"
              class="add-button"
              :loading="isAddingStudent"
              :disabled="isAddingStudent || isBinding || studentAdded"
              @click="handleAddStudent"
            >
              {{ isAddingStudent ? '绑定中...' : studentAdded ? '已绑定学生' : '绑定学生信息' }}
            </van-button>
          </div>
        </van-form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getDormListService,
  getDormRoomService,
  addStudentService,
  selectStudentUserService,
  updateRoomCountService,
  getUserStudentService,
} from '@/api/user.js'
import { showFailToast, showToast, showLoadingToast, closeToast } from 'vant'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'

const router = useRouter()
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const userInfo = ref({ ...userInfoStore.info })

const studentInfoRef = ref(null)
const isAddingStudent = ref(false) // 添加学生状态
const isBinding = ref(false) // 绑定学生状态
const studentAdded = ref(false) // 学生是否已添加
const studentId = ref(null) // 存储添加后的学生ID
const dormDisplay = ref('') // 用于显示宿舍号
const isAlreadyBound = ref(false) // 用户是否已经绑定学生

const gender = [
  { text: '男', value: '男' },
  { text: '女', value: '女' },
]

// 查询宿舍楼列表
const buildingList = ref([])
// 查询寝室列表
const roomList = ref([])

const studentData = ref({
  studentId: '', // 学号
  name: '', // 姓名
  gender: '', // 性别
  phone: '', // 手机号码
  major: '', // 专业
  dormId: null, // 宿舍楼ID
  group: '', // 班级
  roomId: null, // 寝室ID
  dormNumber: null, // 宿舍号(用于显示)
  enrollmentYear: '', // 入学年份
  // 不初始化id字段
})

// 检查用户是否已绑定学生
const checkUserBinding = async () => {
  try {
    showLoadingToast({
      message: '检查绑定状态...',
      forbidClick: true,
    })

    const result = await getUserStudentService(userInfoStore.info.id)
    closeToast()

    if (result && result.data && result.data.id) {
      // 用户已经绑定了学生
      isAlreadyBound.value = true
      showToast('您已绑定学生信息，不能重复绑定')
    } else {
      // 用户未绑定学生，加载宿舍楼列表
      await getDormList()
    }
  } catch (error) {
    closeToast()
    console.error('检查绑定状态错误:', error)
    // 出错时，假设用户未绑定，继续加载宿舍楼列表
    await getDormList()
  }
}

// 加载宿舍楼列表
const getDormList = async () => {
  try {
    showLoadingToast({
      message: '加载宿舍楼列表...',
      forbidClick: true,
    })

    let result = await getDormListService()
    closeToast()

    if (result && result.data) {
      buildingList.value = result.data.map((item) => ({
        id: item.id,
        text: item.building,
        value: item.building,
        gender: item.gender,
      }))
    } else {
      showFailToast('获取宿舍楼列表失败')
    }
  } catch (error) {
    closeToast()
    console.error('获取宿舍楼列表错误:', error)
    showFailToast('获取宿舍楼列表出错')
  }
}

// 页面加载时检查绑定状态
onMounted(() => {
  checkUserBinding()
})

// 性别选择确认
const onGenderConfirm = ({ selectedOptions }) => {
  studentData.value.gender = selectedOptions[0].value

  // 根据性别筛选宿舍楼
  let filteredBuildings = []
  if (studentData.value.gender === '男') {
    filteredBuildings = buildingList.value.filter((dorm) => dorm.gender === '男')
  }
  if (studentData.value.gender === '女') {
    filteredBuildings = buildingList.value.filter((dorm) => dorm.gender === '女')
  }

  // 只有在有过滤结果时更新列表
  if (filteredBuildings.length > 0) {
    buildingList.value = filteredBuildings
  }

  showGender.value = false
}

// 宿舍楼选择确认
const onBuildingConfirm = async ({ selectedOptions }) => {
  try {
    // 保存宿舍楼ID和名称
    const dormId = selectedOptions[0].id
    studentData.value.dormId = dormId
    studentData.value.building = selectedOptions[0].value

    // 清空之前选择的宿舍号
    dormDisplay.value = ''
    studentData.value.roomId = null

    // 查询对应宿舍楼的寝室列表
    showLoadingToast({
      message: '加载宿舍号...',
      forbidClick: true,
    })

    let result = await getDormRoomService(dormId)
    closeToast()

    if (result && result.data) {
      roomList.value = result.data.map((item) => ({
        id: item.id,
        text: item.dormNumber,
        value: item.dormNumber,
      }))
    } else {
      showFailToast('获取宿舍号列表失败')
    }
  } catch (error) {
    closeToast()
    console.error('获取宿舍号列表错误:', error)
    showFailToast('获取宿舍号列表出错')
  } finally {
    showBuilding.value = false
  }
}

// 宿舍号选择确认
const onRoomConfirm = ({ selectedOptions }) => {
  // 存储寝室ID和宿舍号
  studentData.value.roomId = selectedOptions[0].id
  dormDisplay.value = selectedOptions[0].value
  studentData.value.dormNumber = selectedOptions[0].value
  showRoom.value = false
}

// 表单提交状态
const showGender = ref(false)
const showBuilding = ref(false)
const showRoom = ref(false)

// 表单验证规则
const rules = {
  studentId: [
    { required: true, message: '学号不能为空', trigger: 'blur' },
    { min: 1, max: 10, message: '学号长度必须在 1 到 10 个字符之间', trigger: 'blur' },
    { pattern: /^[0-9]{1,10}$/, message: '学号必须为数字', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '学生姓名不能为空', trigger: 'blur' },
    {
      min: 1,
      max: 15,
      message: '学生姓名长度必须在 1 到 15 个字符之间',
      trigger: 'blur',
    },
    {
      pattern: /^[\u4e00-\u9fa5]{1,15}$/,
      message: '学生姓名只能包含中文字符',
      trigger: 'blur',
    },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  phone: [
    { required: true, message: '手机号码不能为空', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  group: [
    { required: true, message: '班级不能为空', trigger: 'blur' },
    { min: 1, max: 15, message: '班级长度必须在 1 到 15 个字符之间', trigger: 'blur' },
  ],
  major: [
    { required: true, message: '专业不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '专业长度必须在 1 到 20 个字符之间', trigger: 'blur' },
  ],
  building: [{ required: true, message: '请选择宿舍楼', trigger: 'blur' }],
  roomId: [{ required: true, message: '请选择宿舍号', trigger: 'blur' }],
  enrollmentYear: [
    { required: true, message: '入学年份不能为空', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '入学年份必须是 4 位数字', trigger: 'blur' },
  ],
}

// 添加学生函数
const handleAddStudent = async () => {
  try {
    if (isAddingStudent.value) return
    isAddingStudent.value = true

    await studentInfoRef.value.validate() // 验证表单

    showLoadingToast({
      message: '添加学生中...',
      forbidClick: true,
      duration: 0,
    })

    // 准备要发送的数据
    const studentDataToSend = {
      studentId: studentData.value.studentId,
      name: studentData.value.name,
      gender: studentData.value.gender,
      phone: studentData.value.phone,
      major: studentData.value.major,
      dormId: studentData.value.dormId,
      group: studentData.value.group,
      roomId: studentData.value.roomId,
      dormNumber: studentData.value.dormNumber,
      enrollmentYear: studentData.value.enrollmentYear,
    }

    // 添加学生
    console.log('提交数据:', studentDataToSend)
    const addResult = await addStudentService(studentDataToSend)

    closeToast()

    //绑定学生
    studentId.value = addResult.data.id

    await selectStudentUserService(userInfoStore.info.id, studentId.value)

    const updateResult = await updateRoomCountService(studentData.value.roomId)
    if (updateResult.code !== 0) {
      showFailToast('更新寝室人数失败')
      return // 退出执行
    }

    // 更新状态
    studentAdded.value = true

    showToast({ message: '绑定学生成功', type: 'success' })

    // 短暂延迟后返回上一页
    setTimeout(() => {
      goBack()
    }, 1500)
  } catch (error) {
    closeToast()
    console.error('绑定学生错误:', error)
    showFailToast(error.message || '绑定学生失败')
  } finally {
    isAddingStudent.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.back()
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
  display: flex;
  flex-direction: column;
}

.already-bound-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  margin-top: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.empty-desc {
  color: #969799;
  font-size: 14px;
  margin: 10px 0;
}

.back-button {
  margin-top: 20px;
  width: 120px;
  height: 44px;
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  box-shadow: 0 4px 8px rgba(63, 81, 181, 0.2);
  border: none;
  font-weight: 500;
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

  :deep(.van-field__control) {
    color: #323233;
  }

  :deep(.van-field__placeholder) {
    color: #c8c9cc;
  }
}

.button-container {
  margin: 32px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.add-button {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.35);
  transition: all 0.3s ease;
  border: none;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.35);
  }

  &.van-button--disabled {
    opacity: 0.6;
  }
}
</style>
