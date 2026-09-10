import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '羽众不同 · 一场轻盈的羽毛球对决',
  description:
    '可爱的第一人称 3D 羽毛球游戏。鼠标挥拍、蓄力击球，与小羽享受薄荷公园的快乐对决。',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
