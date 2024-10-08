import {
  PostCreate,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components";
import { FollowingFeed, ForYouFeed, TrendsSidebar } from "./_components";
import path from "@/lib/path";

export default function MainHomePage() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostCreate />
        <Tabs defaultValue={path.FOR_YOU}>
          <TabsList>
            <TabsTrigger value={path.FOR_YOU}>For you</TabsTrigger>
            <TabsTrigger value={path.FOLLOWING}>Following</TabsTrigger>
          </TabsList>
          <TabsContent value={path.FOR_YOU}>
            <ForYouFeed />
          </TabsContent>
          <TabsContent value={path.FOLLOWING}>
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
