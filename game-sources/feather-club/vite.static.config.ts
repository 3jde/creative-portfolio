import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath } from 'node:url';
const here=(path:string)=>fileURLToPath(new URL(path,import.meta.url));
export default defineConfig({
 root:here('./static'),base:'/games/feather-club/',publicDir:here('./public'),
 plugins:[react()],resolve:{alias:{'@':here('./'),'next/link':here('./static/link.tsx')}},
 css:{postcss:{plugins:[tailwindcss()]}},build:{outDir:here('./dist-static'),emptyOutDir:true},
});
