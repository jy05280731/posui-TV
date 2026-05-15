import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { VideoSource, SourceStore } from '@ouonnki/cms-core'
import {
  addSource,
  removeSource,
  setSourceEnabled,
  selectAllSources,
  deselectAllSources,
  getEnabledSources,
  importSources,
} from '@ouonnki/cms-core/source'
import { getInitialVideoSources } from '@/shared/config/api.config'
import { DEFAULT_SETTINGS } from '@/shared/config/settings.config'
import { v4 as uuidv4 } from 'uuid'
import { useSettingStore } from './settingStore'

export type VideoApi = VideoSource

// ========== 你的 24 个内置视频源 ==========
const BUILTIN_SOURCES: VideoSource[] = [
  {"name":"高清主源1-阿冰资源","url":"https://api.apibdzy.com/api.php/provide/vod/","isEnabled":true,"id":"builtin-1","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"高清主源2-福利资源","url":"https://cj.lziapi.com/api.php/provide/vod/","isEnabled":true,"id":"builtin-2","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"高清主源3-闪电资源","url":"https://sdyzyapi.com/api.php/provide/vod/","isEnabled":true,"id":"builtin-3","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"高清主源4-魔都资源","url":"https://mdzypi.com/api.php/provide/vod/","isEnabled":true,"id":"builtin-4","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"备用源1-小盒子主仓","url":"https://xhztv.top/xhz/","isEnabled":true,"id":"builtin-5","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"备用源2-4K仓","url":"https://xhztv.top/4k.json","isEnabled":true,"id":"builtin-6","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"备用源3-暴风资源","url":"https://bfzyapi.com/api.php/provide/vod/","isEnabled":true,"id":"builtin-7","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"备用源4-高天流云镜像","url":"https://raw.githubusercontent.com/gaotianliuyun/gao/master/js.json","isEnabled":true,"id":"builtin-8","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-饭太硬","url":"http://饭太硬.top/tv","isEnabled":true,"id":"builtin-9","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-肥猫","url":"http://肥猫.com","isEnabled":true,"id":"builtin-10","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-骚零Ray","url":"https://100km.top/0","isEnabled":true,"id":"builtin-11","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-奇艺东少4K","url":"https://szyyds.cn/tv/x.json","isEnabled":true,"id":"builtin-12","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-摸鱼4K","url":"http://我不是.摸鱼儿.top","isEnabled":true,"id":"builtin-13","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-喵影视","url":"http://meowtv.top/tv","isEnabled":true,"id":"builtin-14","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-高天流云","url":"https://gcore.jsdelivr.net/gh/gaotianliuyun/gao@master/js.json","isEnabled":true,"id":"builtin-15","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-OK猫开发","url":"http://ok321.top/ok","isEnabled":true,"id":"builtin-16","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-小苹果","url":"https://agit.ai/nbwzlyd/xiaopingguo/raw/branch/master/xiaopingguo/xiaopingguo.json","isEnabled":true,"id":"builtin-17","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-箩筐","url":"http://tvbox.王二小放牛娃.top","isEnabled":true,"id":"builtin-18","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"✨ 单仓-环宇轩","url":"https://gitee.com/hyxuan_admin/xnf/raw/master/xnfx.json","isEnabled":true,"id":"builtin-19","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"📦 多仓-欧歌","url":"http://tv.nxog.top","isEnabled":true,"id":"builtin-20","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"📦 多仓-天微","url":"https://tvkj.top/DC.txt","isEnabled":true,"id":"builtin-21","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"📦 多仓-OK猫","url":"https://jihulab.com/okcaptain/kko/-/raw/main/tv.txt","isEnabled":true,"id":"builtin-22","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"📦 多仓-自留地","url":"https://gitlab.com/ygbh1/666/-/raw/main/dcang/ygbh.json","isEnabled":true,"id":"builtin-23","timeout":10000,"retry":2,"updatedAt":new Date()},
  {"name":"📦 多仓-影帆","url":"http://52bsj.vip:98/wuai","isEnabled":true,"id":"builtin-24","timeout":10000,"retry":2,"updatedAt":new Date()},
]

// ========== 辅助函数 ==========
function toSourceStore(state: ApiState): SourceStore {
  return { sources: state.videoAPIs, version: 1 }
}
function fromSourceStore(store: SourceStore): VideoSource[] {
  return store.sources
}

// ========== 类型定义 ==========
interface ApiState {
  videoAPIs: VideoSource[]
  adFilteringEnabled: boolean
}

interface ApiActions {
  setApiEnabled: (apiId: string, enabled: boolean) => void
  addAndUpdateVideoAPI: (api: VideoSource) => void
  removeVideoAPI: (apiId: string) => void
  setAdFilteringEnabled: (enabled: boolean) => void
  selectAllAPIs: () => void
  deselectAllAPIs: () => void
  initializeEnvSources: () => void
  importVideoAPIs: (apis: VideoSource[]) => void
  getSelectedAPIs: () => VideoSource[]
  resetVideoSources: () => Promise<void>
  replaceSubscriptionSources: (subscriptionId: string, sources: VideoSource[]) => void
  removeSubscriptionSources: (subscriptionId: string) => void
  reorderVideoAPIs: (orderedIds: string[]) => void
}

type ApiStore = ApiState & ApiActions

// ========== Store 创建 ==========
export const useApiStore = create<ApiStore>()(
  devtools(
    persist(
      immer<ApiStore>((set, get) => ({
        // 初始状态就包含你的 24 个内置源
        videoAPIs: BUILTIN_SOURCES,
        adFilteringEnabled: true,

        setApiEnabled: (apiId, enabled) => {
          set(state => {
            const store = toSourceStore(state)
            const newStore = setSourceEnabled(store, apiId, enabled)
            state.videoAPIs = fromSourceStore(newStore)
          })
        },

        addAndUpdateVideoAPI: (api) => {
          set(state => {
            const store = toSourceStore(state)
            const isExisting = store.sources.some(s => s.id === api.id || (s.name === api.name && s.url === api.url))
            const newStore = addSource(store, { ...api, updatedAt: new Date() })
            const nextSources = fromSourceStore(newStore)
            if (!isExisting) {
              const inserted = nextSources.find(source => source.id === api.id)
              state.videoAPIs = inserted ? [inserted, ...nextSources.filter(s => s.id !== inserted.id)] : nextSources
            } else {
              state.videoAPIs = nextSources
            }
          })
        },

        removeVideoAPI: (apiId) => {
          set(state => {
            const store = toSourceStore(state)
            const newStore = removeSource(store, apiId)
            state.videoAPIs = fromSourceStore(newStore)
          })
        },

        setAdFilteringEnabled: (enabled) => {
          set(state => { state.adFilteringEnabled = enabled })
        },

        selectAllAPIs: () => {
          set(state => {
            const store = toSourceStore(state)
            const newStore = selectAllSources(store)
            state.videoAPIs = fromSourceStore(newStore)
          })
        },

        deselectAllAPIs: () => {
          set(state => {
            const store = toSourceStore(state)
            const newStore = deselectAllSources(store)
            state.videoAPIs = fromSourceStore(newStore)
          })
        },

        initializeEnvSources: async () => {
          // 环境变量源作为补充，不会覆盖已有内置源
          const envSources = await getInitialVideoSources()
          if (envSources.length > 0) {
            set(state => {
              const store = toSourceStore(state)
              const { store: newStore } = importSources(store, envSources, {
                defaultTimeout: useSettingStore.getState().network.defaultTimeout,
                defaultRetry: useSettingStore.getState().network.defaultRetry,
                skipInvalid: true,
              })
              state.videoAPIs = fromSourceStore(newStore)
            })
          }
        },

        importVideoAPIs: (apis) => {
          set(state => {
            const store = toSourceStore(state)
            const apisWithIds = apis.map(api => ({ ...api, id: api.id || uuidv4() }))
            const { store: newStore } = importSources(store, apisWithIds, {
              defaultTimeout: useSettingStore.getState().network.defaultTimeout,
              defaultRetry: useSettingStore.getState().network.defaultRetry,
              skipInvalid: true,
            })
            state.videoAPIs = fromSourceStore(newStore)
          })
        },

        getSelectedAPIs: () => {
          const store = toSourceStore(get())
          return getEnabledSources(store)
        },

        resetVideoSources: async () => {
          set(state => {
            state.videoAPIs = BUILTIN_SOURCES  // 重置回你的内置源
          })
          await get().initializeEnvSources()
        },

        replaceSubscriptionSources: (subscriptionId, sources) => {
          set(state => {
            const prefix = `sub:${subscriptionId}:`
            const oldEnabledMap = new Map<string, boolean>()
            state.videoAPIs.filter(s => s.id.startsWith(prefix)).forEach(s => {
              oldEnabledMap.set(`${s.name}||${s.url}`, s.isEnabled)
            })
            const nonSubscriptionSources = state.videoAPIs.filter(s => !s.id.startsWith(prefix))
            const newSources = sources.map(s => {
              const key = `${s.name}||${s.url}`
              const prevEnabled = oldEnabledMap.get(key)
              return { ...s, isEnabled: prevEnabled !== undefined ? prevEnabled : s.isEnabled }
            })
            state.videoAPIs = [...nonSubscriptionSources, ...newSources]
          })
        },

        removeSubscriptionSources: (subscriptionId) => {
          set(state => {
            const prefix = `sub:${subscriptionId}:`
            state.videoAPIs = state.videoAPIs.filter(s => !s.id.startsWith(prefix))
          })
        },

        reorderVideoAPIs: (orderedIds) => {
          set(state => {
            const idIndexMap = new Map(orderedIds.map((id, idx) => [id, idx]))
            state.videoAPIs = [...state.videoAPIs].sort((a, b) => {
              const idxA = idIndexMap.get(a.id)
              const idxB = idIndexMap.get(b.id)
              if (idxA !== undefined && idxB !== undefined) return idxA - idxB
              if (idxA !== undefined) return -1
              if (idxB !== undefined) return 1
              return 0
            })
          })
        },
      })),
      {
        name: 'ouonnki-tv-api-store',
        version: 7,  // 增加版本号，避免旧缓存覆盖
        migrate: (persistedState: unknown, version: number) => {
          const state = persistedState as Partial<ApiState>
          // 如果迁移前版本低于7，且没有 videoAPIs 或为空，则填充内置源
          if (version < 7) {
            if (!state.videoAPIs || state.videoAPIs.length === 0) {
              state.videoAPIs = BUILTIN_SOURCES
            }
          }
          // 补齐默认字段
          if (state.videoAPIs) {
            state.videoAPIs = state.videoAPIs.map(api => ({
              ...api,
              timeout: api.timeout ?? DEFAULT_SETTINGS.network.defaultTimeout,
              retry: api.retry ?? DEFAULT_SETTINGS.network.defaultRetry,
              updatedAt: api.updatedAt ?? new Date(),
            }))
          }
          return state
        },
      },
    ),
    { name: 'ApiStore' },
  ),
)
