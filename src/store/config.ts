import { defineStore } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";

// Интерфейс для хранилища конфигурации
interface ConfigStore {
  [key: string]: any;
}

// Константа для хранения значений конфигурации по умолчанию
const DEFAULT_CONFIG: ConfigStore = {} as ConfigStore;

// Константа для хранения имени хранилища
const STORE_NAME = "config";

// Функция для получения конфигурации из локального хранилища
const getConfig = (): ConfigStore => {
  const config = localStorage.getItem(STORE_NAME);
  return config ? JSON.parse(config) : DEFAULT_CONFIG;
};

const getPreferredScheme = () =>
  window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
    ? "dark"
    : "light";

// Экспорт хука для работы с конфигурацией
export const useConfigStore = defineStore(STORE_NAME, () => {
  const config = ref<ConfigStore>(getConfig());
  reactive(config);
  // Функция для обновления конфигурации
  const updateConfig = (params: ConfigStore) => {
    config.value = {
      ...config.value,
      ...params,
    };
  };

  const getTheme = () => {
    if (config.value.theme && config.value.theme !== "auto")
      return config.value.theme;
    else return getPreferredScheme();
  };

  const updateTheme = () => {
    document.documentElement.dataset["theme"] = getTheme();
  };

  watch(config, (value) => {
    updateTheme();
    localStorage.setItem(STORE_NAME, JSON.stringify(value));
  });

  onMounted(() => updateTheme());

  return {
    config,
    updateConfig,
    getTheme,
    updateTheme
  };
});
