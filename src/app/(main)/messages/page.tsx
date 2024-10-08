import { Metadata } from "next";
import { Chat } from "../_components";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <Chat />;
}
