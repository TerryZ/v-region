import {build, loadEnv} from "vite";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const libraries = [
  {
    entry: path.resolve(__dirname, "../src/index.js"),
    fileName: "v-region",
  },
  {
    entry: path.resolve(__dirname, "../src/index.js"),
    fileName: "v-region-no-town",
  },
];

(async () => {
  for (let i = 0; i < libraries.length; i++) {
    const lib = libraries[i]
    if (lib.fileName === 'v-region') {
      process.env = {...process.env, VITE_NO_TOWN: true}
    }
    await build({
      build: {
        lib,
        emptyOutDir: i === 0, // 编译前清空下目录
      },
    });
  }
})()
