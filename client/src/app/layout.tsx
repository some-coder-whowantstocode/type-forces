'use client'
import "./globals.css";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { SocketProvider } from './context/SocketContext';
import {PopupProvider} from '../../node_modules/@vik_9827/popup/dist/bundle.js'


const store = makeStore();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <PopupProvider>
        <Provider store={store}>
          <SocketProvider>
        {children}
          </SocketProvider>
        </Provider>
        </PopupProvider>
      </body>
    </html>
  );
}
