"use client";

import { useState } from 'react';
import { VideoCallRoom } from './video-call-room';
import { JoinCallForm } from './join-call-form';
import { Card, CardContent } from '@/components/ui/card';
import { Video } from 'lucide-react';

export function VideoCallContainer() {
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      {!roomId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-4">Start Video Consultation</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Connect with your doctor through a secure video call. Make sure your camera
              and microphone are working properly.
            </p>
            <JoinCallForm onJoin={setRoomId} />
          </CardContent>
        </Card>
      ) : (
        <VideoCallRoom 
          roomId={roomId} 
          onLeave={() => setRoomId(null)}
        />
      )}
    </div>
  );
}