import type { Metadata, Viewport } from "next"; import "./globals.css"; import {AppShell} from "@/components/app-shell";
export const metadata:Metadata={title:{default:"WatchLyst",template:"%s · WatchLyst"},description:"Your private, fast TV and movie progress tracker.",applicationName:"WatchLyst",manifest:"/manifest.webmanifest",appleWebApp:{capable:true,statusBarStyle:"black-translucent",title:"WatchLyst"},icons:{icon:"/icon.svg",apple:"/apple-touch-icon.svg"}};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#09090b"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}
