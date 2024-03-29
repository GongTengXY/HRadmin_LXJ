import { config } from "@vue/test-utils";
import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import { getTimeStamp } from "@/utils/auth";

const TimeOut = 4800; // 定义超时时间 这里这个单位是秒

const service = axios.create({
  // 当执行 npm run dev 时会读取 .env.development文件的内容  其中变量为/api 此时是可以触发跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000, // 超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      // 在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        // true 就是token过期了
        store.dispatch("user/logout"); // 退出操作
        // 然后跳转到登录页
        router.push("/login");
        return Promise.reject(new Error("token超时了"));
      }
      // 如果token存在的话 注入token
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config; // 必须返回配置
  },
  (error) => {
    return Promise.reject(error); // 如果出错会进入这里
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // axios 默认加了一层data
    const { success, message, data } = response.data;
    // 要根据success来决定下面的操作
    if (success) {
      return data;
    } else {
      // 业务已经错了，所以不能进.then  应该进catch
      Message.error(message); // 提示错误消息
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    // error 信息 里面 response的对象
    if (
      error.response &&
      error.response.data &&
      error.response.data.code == 10002
    ) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch("user/logout");
      router.push("/login");
    } else {
      console.log(error.message);
      //    Message.error(error.message)   //提示错误信息
    }
    return Promise.reject(error); // 返回执行错误， 让当前执行链跳出成功，直接进入catch
  }
);

// 定义一个方法检查是否超时
function IsCheckTimeOut() {
  // 当前时间 - 缓存中的时间  是否大于时间差
  const currentTime = Date.now(); // 当前时间戳
  const timeStamp = getTimeStamp(); // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut;
}

export default service;
