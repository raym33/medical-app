declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private transcription: string = '';

  constructor(
    private onTranscriptionUpdate: (text: string) => void,
    private onError: (error: string) => void
  ) {}

  public initialize(): boolean {
    if (!('webkitSpeechRecognition' in window)) {
      this.onError("Browser doesn't support speech recognition");
      return false;
    }

    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.setupEventListeners();
    return true;
  }

  private setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        this.transcription += ' ' + finalTranscript;
        this.onTranscriptionUpdate(this.transcription.trim());
      }
    };

    this.recognition.onerror = () => {
      this.onError("An error occurred during recording");
      this.stop();
    };
  }

  public start() {
    if (!this.recognition) {
      if (!this.initialize()) return;
    }
    this.transcription = '';
    this.recognition?.start();
  }

  public stop() {
    this.recognition?.stop();
  }
}