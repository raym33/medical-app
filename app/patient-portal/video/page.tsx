"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { VideoCall } from "@/components/video/video-call";
import { useAuth } from "@/lib/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export default function VideoCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout title="Video Consultation">
      {!isCallActive ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-4">Start Video Consultation</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect with your doctor through a secure video call. Make sure your camera
              and microphone are working properly.
            </p>
            <Button onClick={() => setIsCallActive(true)}>
              Start Call
            </Button>
          </CardContent>
        </Card>
      ) : (
        <VideoCall
          patientId={user.id}
          onEndCall={() => setIsCallActive(false)}
        />
      )}
    </DashboardLayout>
  );
}