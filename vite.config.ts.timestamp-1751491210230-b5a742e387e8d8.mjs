// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"]
        }
      }
    }
  },
  server: {
    port: 3e3,
    host: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: "/index.html" },
        { from: /^\/pt/, to: "/index.html" },
        { from: /^\/en/, to: "/index.html" },
        { from: /^\/es/, to: "/index.html" }
      ]
    }
  },
  preview: {
    port: 3e3,
    host: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: "/index.html" },
        { from: /^\/pt/, to: "/index.html" },
        { from: /^\/en/, to: "/index.html" },
        { from: /^\/es/, to: "/index.html" }
      ]
    }
  },
  publicDir: "public"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICByb3V0ZXI6IFsncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB7XG4gICAgICByZXdyaXRlczogW1xuICAgICAgICB7IGZyb206IC9eXFwvYWRtaW4vLCB0bzogJy9pbmRleC5odG1sJyB9LFxuICAgICAgICB7IGZyb206IC9eXFwvcHQvLCB0bzogJy9pbmRleC5odG1sJyB9LFxuICAgICAgICB7IGZyb206IC9eXFwvZW4vLCB0bzogJy9pbmRleC5odG1sJyB9LFxuICAgICAgICB7IGZyb206IC9eXFwvZXMvLCB0bzogJy9pbmRleC5odG1sJyB9LFxuICAgICAgXVxuICAgIH1cbiAgfSxcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2s6IHtcbiAgICAgIHJld3JpdGVzOiBbXG4gICAgICAgIHsgZnJvbTogL15cXC9hZG1pbi8sIHRvOiAnL2luZGV4Lmh0bWwnIH0sXG4gICAgICAgIHsgZnJvbTogL15cXC9wdC8sIHRvOiAnL2luZGV4Lmh0bWwnIH0sXG4gICAgICAgIHsgZnJvbTogL15cXC9lbi8sIHRvOiAnL2luZGV4Lmh0bWwnIH0sXG4gICAgICAgIHsgZnJvbTogL15cXC9lcy8sIHRvOiAnL2luZGV4Lmh0bWwnIH0sXG4gICAgICBdXG4gICAgfVxuICB9LFxuICBwdWJsaWNEaXI6ICdwdWJsaWMnXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxrQkFBa0I7QUFBQSxRQUM3QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsTUFDbEIsVUFBVTtBQUFBLFFBQ1IsRUFBRSxNQUFNLFlBQVksSUFBSSxjQUFjO0FBQUEsUUFDdEMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsUUFDbkMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsUUFDbkMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsTUFDckM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUEsTUFDbEIsVUFBVTtBQUFBLFFBQ1IsRUFBRSxNQUFNLFlBQVksSUFBSSxjQUFjO0FBQUEsUUFDdEMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsUUFDbkMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsUUFDbkMsRUFBRSxNQUFNLFNBQVMsSUFBSSxjQUFjO0FBQUEsTUFDckM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsV0FBVztBQUNiLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
