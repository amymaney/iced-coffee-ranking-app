/// <reference types="google.maps" />

export {}; // Required to make it a module

declare global {
  interface Window {
    google: typeof google;
  }
}
