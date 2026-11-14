// Audio effects completely disabled
class SilentSoundSystem {
  constructor() {
    this.muted = true;
  }
  init() {}
  toggleMute() { return true; }
  playUiBeep() {}
  playDrsHiss() {}
  playLaunchBeep() {}
  playEngineBurst() {}
}

export const sounds = new SilentSoundSystem();
