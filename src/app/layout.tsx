'use client'
import {metadata} from './metadata'
import "./globals.css";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";


const store = makeStore();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Provider store={store}>
        {children}
        </Provider>
      </body>
    </html>
  );
}
