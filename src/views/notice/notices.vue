<template>
  <div class="notice-page">
    <!-- 顶部区域 -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title">宿舍公告</h1>
      </div>
    </div>

    <!-- 公告内容区域 -->
    <div class="notices-container">
      <!-- 加载状态 -->
      <div class="loading-state" v-if="loading">
        <van-loading type="spinner" color="#4a7afe" size="36px" />
        <p>加载公告中...</p>
      </div>

      <!-- 无数据状态 -->
      <div class="empty-state" v-else-if="noticeList.length === 0">
        <van-empty image="search" description="暂无公告信息">
          <template #bottom>
            <van-button round color="#4a7afe" size="small">刷新</van-button>
          </template>
        </van-empty>
      </div>

      <!-- 公告列表 -->
      <div class="notice-list" v-else>
        <div class="notice-category">
          <div class="category-header">
            <van-icon name="bullhorn-o" color="#4a7afe" />
            <span>最新公告</span>
          </div>
          <van-divider dashed :style="{ margin: '10px 0' }" />
        </div>

        <div
          v-for="(notice, index) in noticeList"
          :key="index"
          class="notice-card"
          @click="showNoticeDetail(notice)"
        >
          <div class="notice-content">
            <div class="notice-type">{{ getNoticeType(notice) }}</div>
            <h3 class="notice-title">{{ notice.title }}</h3>
            <div class="notice-meta">
              <span class="author">{{ notice.author || "管理员" }}</span>
              <span class="date">{{ notice.createdTime }}</span>
            </div>
          </div>
          <div class="notice-indicator">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <van-popup
      v-model:show="showDetail"
      round
      position="bottom"
      :style="{ height: '75%' }"
      class="detail-popup"
    >
      <div class="detail-header">
        <div class="back-button" @click="showDetail = false">
          <van-icon name="arrow-left" />
        </div>
        <div class="detail-title-text">公告详情</div>
        <div class="detail-share"></div>
      </div>

      <div class="notice-detail" v-if="currentNotice">
        <div class="detail-banner" :style="getBannerStyle(currentNotice)">
          <div class="banner-overlay"></div>
          <div class="banner-content">
            <h2>{{ currentNotice.title }}</h2>
          </div>
        </div>

        <div class="detail-info">
          <div class="info-row">
            <van-icon name="manager-o" />
            <span>{{ currentNotice.author || "管理员" }}</span>
          </div>
          <div class="info-row">
            <van-icon name="clock-o" />
            <span>{{ currentNotice.createdTime }}</span>
          </div>
        </div>

        <div class="detail-content">
          <div class="content-text">{{ currentNotice.content }}</div>

          <div
            v-if="currentNotice.attachments && currentNotice.attachments.length"
            class="attachments-section"
          >
            <div class="attachments-header">
              <van-icon name="description" />
              <span>附件</span>
            </div>

            <div
              v-for="(attachment, index) in currentNotice.attachments"
              :key="index"
              class="attachment-item"
            >
              <div class="attachment-icon">
                <van-icon name="description" />
              </div>
              <div class="attachment-info">
                <div class="attachment-name">{{ attachment.name }}</div>
                <div class="attachment-size">{{ getFileSize(attachment) }}</div>
              </div>
              <div class="download-icon">
                <van-icon name="down" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <van-button round block type="primary" @click="showDetail = false"
          >关闭</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNoticeListService } from "@/api/notice.js";
import { showToast } from "vant";

const noticeList = ref([]);
const loading = ref(true);
const showDetail = ref(false);
const currentNotice = ref(null);

// 获取公告列表
const getNoticeList = async () => {
  loading.value = true;
  try {
    const result = await getNoticeListService();
    noticeList.value = result.data;
  } catch (error) {
    showToast({
      message: "获取公告失败，请稍后重试",
      type: "fail",
    });
    console.error("获取公告失败", error);
  } finally {
    loading.value = false;
  }
};

// 显示公告详情
const showNoticeDetail = (notice) => {
  currentNotice.value = notice;
  showDetail.value = true;
};

// 获取公告类型标签
const getNoticeType = (notice) => {
  // 根据公告内容或类型返回不同的标签
  const types = ["重要", "通知", "提醒", "活动"];
  return types[Math.floor(Math.random() * types.length)];
};

// 获取公告banner样式
const getBannerStyle = (notice) => {
  // 不同类型的公告可以设置不同的背景
  const gradients = [
    "linear-gradient(135deg, #4a7afe 0%, #2364e8 100%)",
    "linear-gradient(135deg, #5C6BC0 0%, #3949AB 100%)",
    "linear-gradient(135deg, #26A69A 0%, #00897B 100%)",
    "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);
  return {
    background: gradients[randomIndex],
  };
};

// 获取文件大小展示
const getFileSize = (attachment) => {
  // 模拟文件大小
  const sizes = ["56KB", "1.2MB", "3.5MB", "782KB", "124KB"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

onMounted(() => {
  getNoticeList();
});
</script>

<style scoped>
.notice-page {
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
}

.header-content {
  display: flex;
  flex-direction: column;
}

.page-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

.search-box {
  margin-top: 0.5rem;
}

.notices-container {
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

.empty-state {
  margin-top: 2rem;
}

.notice-category {
  margin: 1rem 0;
}

.category-header {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.category-header .van-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.notice-card {
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.notice-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.notice-content {
  flex: 1;
}

.notice-type {
  display: inline-block;
  background-color: rgba(74, 122, 254, 0.1);
  color: #4a7afe;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
}

.notice-title {
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: 500;
  color: #323233;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #969799;
  margin-top: 0.5rem;
}

.notice-indicator {
  display: flex;
  align-items: center;
  color: #c8c9cc;
}

.detail-popup {
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #f2f3f5;
}

.back-button,
.detail-share {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
}

.detail-title-text {
  font-size: 1rem;
  font-weight: 500;
}

.notice-detail {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 5rem;
}

.detail-banner {
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 2rem;
}

.banner-content h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.detail-info {
  background-color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f2f3f5;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
}

.info-row .van-icon {
  margin-right: 0.4rem;
  font-size: 0.9rem;
  color: #4a7afe;
}

.detail-content {
  padding: 1rem;
}

.content-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.attachments-section {
  margin-top: 1.5rem;
  border-top: 1px solid #f2f3f5;
  padding-top: 1rem;
}

.attachments-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

.attachments-header .van-icon {
  margin-right: 0.5rem;
  color: #4a7afe;
}

.attachment-item {
  display: flex;
  align-items: center;
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
}

.attachment-icon {
  width: 36px;
  height: 36px;
  background-color: rgba(74, 122, 254, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.8rem;
}

.attachment-icon .van-icon {
  color: #4a7afe;
  font-size: 1.2rem;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  color: #333;
}

.attachment-size {
  font-size: 0.75rem;
  color: #969799;
}

.download-icon {
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a7afe;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  padding: 1rem;
  border-top: 1px solid #f2f3f5;
}

.action-buttons .van-button {
  background: linear-gradient(135deg, #4a7afe 0%, #2364e8 100%);
  border: none;
}
</style>
