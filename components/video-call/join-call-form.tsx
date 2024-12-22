"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface JoinCallFormProps {
  onJoin: (roomId: string) => void;
}

export function JoinCallForm({ onJoin }: JoinCallFormProps) {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoin(roomId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roomId">Room ID</Label>
        <Input
          id="roomId"
          placeholder="Enter room ID or leave empty for new room"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Join Call
      </Button>
    </form>
  );
}