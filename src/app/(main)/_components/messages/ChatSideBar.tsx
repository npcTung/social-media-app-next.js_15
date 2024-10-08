import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { useSession } from "../../SessionProvider";
import { Button } from "@/components";
import icons from "@/lib/icons";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { NewChatDialog } from "./NewChatDialog";
import { useQueryClient } from "@tanstack/react-query";

const { X, MessageCirclePlus } = icons;

interface ChatSideBarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSideBar({ open, onClose }: ChatSideBarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [channel?.id, queryClient]);

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({ onClose }: MenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);

  return (
    <>
      <NewChatDialog
        open={showNewChatDialog}
        onOpenChange={setShowNewChatDialog}
        onChatCreated={() => {
          setShowNewChatDialog(false);
          onClose();
        }}
      />
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size={"icon"} variant={"ghost"} onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size={"icon"}
          variant={"ghost"}
          title="Start new chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MessageCirclePlus className="size-5" />
        </Button>
      </div>
    </>
  );
}
