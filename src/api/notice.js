import request from "@/utils/request";

//获取公告列表
export const getNoticeListService = () => {
  return request.get('/studentUser/noticeList')
}
