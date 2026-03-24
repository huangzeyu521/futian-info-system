import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const permissions = ref([])

  /** 与当前前端登录页一致的演示账号（无后端时用于校验） */
  const login = async (loginData) => {
    const { username, password } = loginData
    if (username !== 'admin' || password !== 'admin123456') {
      return Promise.reject(new Error('用户名或密码错误'))
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        token.value = 'mock_token_' + Date.now()
        localStorage.setItem('token', token.value)
        userInfo.value = {
          id: 1,
          username: 'admin',
          realName: '系统管理员',
          deptName: '招商部',
          avatar: ''
        }
        resolve({ code: 200, message: '登录成功' })
      }, 600)
    })
  }

  // 登出
  const logout = () => {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('token')
  }

  // 获取用户信息
  const getUserInfo = async () => {
    // 模拟获取用户信息
    return new Promise((resolve) => {
      setTimeout(() => {
        userInfo.value = {
          id: 1,
          username: 'admin',
          realName: '管理员',
          deptName: '系统管理',
          avatar: ''
        }
        resolve(userInfo.value)
      }, 500)
    })
  }

  return {
    token,
    userInfo,
    permissions,
    login,
    logout,
    getUserInfo
  }
})

