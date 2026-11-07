import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    preact(),
    tailwindcss(),
    {
      name: "github-pages-404",
      async writeBundle(options) {
        const directory = options.dir ?? "dist";
        await copyFile(resolve(directory, "index.html"), resolve(directory, "404.html"));
      },
    },
  ],
});
