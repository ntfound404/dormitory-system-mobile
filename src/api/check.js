import request from "@/utils/request";

//签到
export const SignInService = (studentId) => {
  return request.post(`/studentUser/signIn?studentId=${studentId}`);
}

