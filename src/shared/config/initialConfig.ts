export const initialConfig = {
  videoSources: import.meta.env.VITE_OKT_INITIAL_VIDEO_SOURCES
    ? JSON.parse(import.meta.env.VITE_OKT_INITIAL_VIDEO_SOURCES)
    : [],
};
