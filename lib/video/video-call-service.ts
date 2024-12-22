import SimplePeer from 'simple-peer';
import { supabase } from '@/lib/db/supabase';
import { AuditService } from '@/lib/security/audit-service';

export class VideoCallService {
  private static instance: VideoCallService;
  private peer: SimplePeer.Instance | null = null;
  private stream: MediaStream | null = null;

  private constructor() {}

  static getInstance(): VideoCallService {
    if (!VideoCallService.instance) {
      VideoCallService.instance = new VideoCallService();
    }
    return VideoCallService.instance;
  }

  async startCall(patientId: string, doctorId: string): Promise<MediaStream> {
    try {
      // Get user media stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Create new peer connection
      this.peer = new SimplePeer({
        initiator: true,
        stream: this.stream,
        trickle: false
      });

      // Log call start
      await AuditService.logSecurityEvent(doctorId, 'video_call', {
        action: 'start_call',
        patient_id: patientId
      });

      // Save call record
      await supabase.from('video_calls').insert({
        doctor_id: doctorId,
        patient_id: patientId,
        start_time: new Date().toISOString(),
        status: 'active'
      });

      return this.stream;
    } catch (error) {
      console.error('Failed to start video call:', error);
      throw error;
    }
  }

  async endCall(callId: string): Promise<void> {
    try {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      if (this.peer) {
        this.peer.destroy();
        this.peer = null;
      }

      // Update call record
      await supabase
        .from('video_calls')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', callId);
    } catch (error) {
      console.error('Failed to end video call:', error);
      throw error;
    }
  }

  onSignal(callback: (signal: SimplePeer.SignalData) => void): void {
    if (!this.peer) return;
    this.peer.on('signal', callback);
  }

  onStream(callback: (stream: MediaStream) => void): void {
    if (!this.peer) return;
    this.peer.on('stream', callback);
  }

  signal(data: SimplePeer.SignalData): void {
    if (!this.peer) return;
    this.peer.signal(data);
  }
}