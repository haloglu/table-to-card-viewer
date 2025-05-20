// composables/useColorMode.ts

export function useColorMode() {
  const mode = useState<string>("color-mode", () => {
    if (process.client) {
      return localStorage.getItem("color-mode") || "light";
    }
    return "light";
  });

  const toggleMode = () => {
    mode.value = mode.value === "dark" ? "light" : "dark";
    if (process.client) {
      localStorage.setItem("color-mode", mode.value);
      document.body.className = mode.value;
    }
  };

  onMounted(() => {
    if (process.client) {
      document.body.className = mode.value;
    }
  });

  return { mode, toggleMode };
}
