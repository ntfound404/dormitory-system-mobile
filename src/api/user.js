import request from "@/utils/request";
//提供调用注册接口的函数
export const userRegisterService = (form) => {
  const params = new URLSearchParams();
  for (let key in form) {
    params.append(key, form[key]);
  }
  return request.post("/user/register", params);
};
//提供调用登录接口的函数
export const userLoginService = (loginData) => {
  const params = new URLSearchParams();
  for (let key in loginData) {
    params.append(key, loginData[key]);
  }
  return request.post("/user/login", params);
};

//获取用户详细信息
export const userInfoService = () => {
  return request.get('/user/userInfo')
};

//通过用户id查询学生信息
export const getStudnetInfoService = (userId) => {
  return request.get('/studentUser/getStudentInfo', {
    params: {
      userId
    }
  })
}

// 通过dormId获取宿舍号
export const getRoomInfoService = (roomId) => {
  // 使用 params 将 dormId 作为查询参数传递
  return request.get('/studentUser/room', { params: { roomId } });
}

// 通过dormId获取宿舍号
export const getDormRoomService = (dormId) => {
  // 使用 params 将 dormId 作为查询参数传递
  return request.get('/studentUser/dormRoom', { params: { dormId } });
}

//修改个人信息
export const userInfoUpdateService = (userInfoData) => {
  return request.put('/studentUser/updateUserInfo', userInfoData)
}


// 修改用户密码
export const userResetPasswordService = (oldPwd, newPwd, rePwd) => {
  return request.patch('/studentUser/updatePwd',
    {
      old_pwd: oldPwd,
      new_pwd: newPwd,
      re_pwd: rePwd
    },
  );
}

// 查询宿舍楼列表
export const getDormListService = () => {
  return request.get('/studentUser/dormList');
}

//绑定学生信息
export const selectStudentUserService = (userId, studentId) => {
  return request.post(`/studentUser/selectStudentUser?userId=${userId}&studentId=${studentId}`);
};


//添加学生
export const addStudentService = (studentData) => {
  return request.post('/studentUser/addStudent', studentData)
}

//分配宿舍人数自增
export const updateRoomCountService = (id) => {
  return request.post('/studentUser/updateCount?id=' + id)
}

//检查用户是否绑定学生
export const getUserStudentService = (userId) => {
  return request.post(`/studentUser/checkUserStudent?userId=${userId}`)
}

