"use client";

import icons from "@/lib/icons";
import useInitializeChatClient from "../../messages/useInitializeChatClient";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSideBar from "./ChatSideBar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

const { Loader2 } = icons;

export default function Chat() {
  const chatClient = useInitializeChatClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { resolvedTheme } = useTheme();

  if (!chatClient) return <Loader2 className="mx-auto my-3 animate-spin" />;

  return (
    <main className="relative w-full overflow-hidden rounded-2xl border bg-card shadow-md">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSideBar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
}
