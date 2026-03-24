<template>
  <div class="login-screen">
    <!-- 左侧品牌区（大屏） -->
    <div class="login-screen__brand">
      <div class="brand-deco" aria-hidden="true">
        <span class="ring ring--a" />
        <span class="ring ring--b" />
        <span class="ring ring--c" />
      </div>

      <div class="brand-inner">
        <div class="brand-logo-card">
          <div class="brand-logo-mark">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="80" height="80" rx="16" fill="url(#loginBrandGrad)" />
              <text x="40" y="52" font-size="36" font-weight="bold" fill="white" text-anchor="middle">福</text>
              <defs>
                <linearGradient id="loginBrandGrad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stop-color="#BF933B" />
                  <stop offset="100%" stop-color="#D4A94D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="brand-logo-divider" />
          <div>
            <h1 class="brand-logo-title">福田产投信息化系统</h1>
            <p class="brand-logo-en">Futian Industrial Investment Information System</p>
          </div>
        </div>

        <div class="brand-copy">
          <h2 class="brand-headline">
            全面支持
            <br />
            资产与园区运营数字化管理
          </h2>
          <p class="brand-lead">
            面向资产租赁、园区运营与企业孵化的一体化平台，支撑业务全流程管控与经营决策。
          </p>

          <div class="feature-grid">
            <div v-for="(f, i) in features" :key="i" class="feature-tile">
              <el-icon class="feature-tile__icon"><component :is="f.icon" /></el-icon>
              <h3 class="feature-tile__title">{{ f.title }}</h3>
              <p class="feature-tile__desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="brand-footer">© {{ year }} 深圳市福田产业投资服务有限公司</p>
    </div>

    <!-- 右侧表单区 -->
    <div class="login-screen__form">
      <!-- 小屏顶栏 -->
      <div class="mobile-brand">
        <div class="brand-logo-mark brand-logo-mark--sm">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="16" fill="url(#loginBrandGradM)" />
            <text x="40" y="52" font-size="36" font-weight="bold" fill="white" text-anchor="middle">福</text>
            <defs>
              <linearGradient id="loginBrandGradM" x1="0" y1="0" x2="80" y2="80">
                <stop offset="0%" stop-color="#BF933B" />
                <stop offset="100%" stop-color="#D4A94D" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 class="mobile-brand__title">福田产投信息化系统</h1>
          <p class="mobile-brand__sub">Futian Industrial Investment Information System</p>
        </div>
      </div>

      <div class="form-panel">
        <el-card shadow="never" class="form-card">
          <div class="form-card__head">
            <h2>欢迎登录</h2>
            <p>请输入您的账号信息</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                clearable
                autocomplete="username"
              >
                <template #prefix><el-icon><User /></el-icon></template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                autocomplete="current-password"
                @keyup.enter="handleLogin"
              >
                <template #prefix><el-icon><Lock /></el-icon></template>
              </el-input>
            </el-form-item>

            <el-form-item prop="captcha" class="captcha-form-item">
              <div class="captcha-row">
                <el-input
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  maxlength="4"
                  clearable
                  class="captcha-row__input"
                  @keyup.enter="handleLogin"
                >
                  <template #prefix><el-icon><Key /></el-icon></template>
                </el-input>
                <div class="captcha-chip" title="验证码">{{ captchaCode }}</div>
                <el-button class="captcha-row__btn" :icon="Refresh" @click="refreshCaptcha" />
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                class="submit-btn"
                :loading="loading"
                @click="handleLogin"
              >
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>
          </el-form>

          <p class="legal-line">
            登录即表示您同意我们的
            <a href="javascript:;" class="legal-link" @click.prevent>服务条款</a>
            和
            <a href="javascript:;" class="legal-link" @click.prevent>隐私政策</a>
          </p>

          <p class="help-line">
            需要帮助？
            <a href="javascript:;" class="legal-link" @click.prevent>联系技术支持</a>
          </p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Key,
  Refresh,
  OfficeBuilding,
  DataAnalysis,
  TrendCharts,
  Document
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const year = computed(() => new Date().getFullYear())

const features = [
  { icon: OfficeBuilding, title: '资产租赁管理', desc: '合同、租金与续约退租全流程' },
  { icon: Document, title: '租赁合同协同', desc: '台账与业务数据一体化展示' },
  { icon: DataAnalysis, title: '园区运营分析', desc: '多维度指标与报表支撑决策' },
  { icon: TrendCharts, title: '企业孵化服务', desc: '入驻、孵化与毕业退出管理' }
]

const loginFormRef = ref(null)
const loading = ref(false)
const captchaCode = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '',
  captcha: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码为4位', trigger: 'blur' }
  ]
}

const randomCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const refreshCaptcha = () => {
  captchaCode.value = randomCaptcha()
  loginForm.captcha = ''
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    if (loginForm.captcha.toUpperCase() !== captchaCode.value.toUpperCase()) {
      ElMessage.error('验证码错误')
      refreshCaptcha()
      return
    }
    loading.value = true
    try {
      await userStore.login({
        username: loginForm.username.trim(),
        password: loginForm.password
      })
      ElMessage.success('欢迎，系统管理员')
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
      router.replace(redirect.startsWith('/') ? redirect : '/dashboard')
    } catch (e) {
      ElMessage.error(e.message || '登录失败')
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style lang="scss" scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f6fb;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
}

.login-screen__brand {
  display: none;
  position: relative;
  overflow: hidden;
  padding: 3rem;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #042178 0%, #021556 52%, #011040 100%);
  color: #fff;

  @media (min-width: 1024px) {
    display: flex;
    width: 50%;
    min-height: 100vh;
  }
}

.brand-deco {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  pointer-events: none;
}

.ring {
  position: absolute;
  border: 2px solid #fff;
  border-radius: 50%;
}

.ring--a {
  top: 5rem;
  left: 5rem;
  width: 16rem;
  height: 16rem;
}

.ring--b {
  bottom: 5rem;
  right: 5rem;
  width: 24rem;
  height: 24rem;
}

.ring--c {
  top: 42%;
  left: 28%;
  width: 12rem;
  height: 12rem;
}

.brand-inner {
  position: relative;
  z-index: 1;
}

.brand-logo-card {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-logo-mark {
  flex-shrink: 0;
  svg {
    width: 3rem;
    height: 3rem;
    display: block;
  }
}

.brand-logo-mark--sm svg {
  width: 3.5rem;
  height: 3.5rem;
}

.brand-logo-divider {
  width: 1px;
  height: 2.5rem;
  background: #e5e7eb;
}

.brand-logo-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.02em;
}

.brand-logo-en {
  margin: 0.15rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.brand-copy {
  max-width: 28rem;
}

.brand-headline {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.35;
}

.brand-lead {
  margin: 0 0 2.5rem;
  font-size: 1.05rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.feature-tile {
  padding: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
}

.feature-tile__icon {
  font-size: 1.5rem;
  color: #f0d78c;
  margin-bottom: 0.5rem;
}

.feature-tile__title {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.feature-tile__desc {
  margin: 0;
  font-size: 0.7rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.72);
}

.brand-footer {
  position: relative;
  z-index: 1;
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
}

.login-screen__form {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem 2.5rem;
  min-height: 100vh;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    width: 50%;
    min-height: 100vh;
  }
}

.mobile-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    display: none;
  }
}

.mobile-brand__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #042178;
}

.mobile-brand__sub {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.form-panel {
  width: 100%;
  max-width: 26rem;
}

.form-card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
}

.form-card__head {
  margin-bottom: 1.75rem;

  h2 {
    margin: 0 0 0.35rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-secondary, #042178);
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-secondary, #606266);
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 1.15rem;
  }
}

.captcha-form-item {
  :deep(.el-form-item__content) {
    line-height: normal;
  }
}

.captcha-row {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
}

.captcha-row__input {
  flex: 1;
  min-width: 0;
}

.captcha-chip {
  flex-shrink: 0;
  width: 7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid rgba(4, 33, 120, 0.15);
  background: linear-gradient(90deg, rgba(4, 33, 120, 0.06), rgba(191, 147, 59, 0.08));
  font-family: ui-monospace, monospace;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #042178;
  user-select: none;
}

.captcha-row__btn {
  flex-shrink: 0;
}

.submit-btn {
  width: 100%;
  height: 46px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #bf933b 0%, #a67d2e 100%);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #d4a94d 0%, #bf933b 100%);
  }
}

.legal-line,
.help-line {
  margin: 1rem 0 0;
  text-align: center;
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
}

.help-line {
  margin-top: 0.75rem;
}

.legal-link {
  color: #042178;
  margin: 0 0.15rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
