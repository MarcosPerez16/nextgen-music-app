class SpotifyPlayerManager {
  constructor() {
    this.player = null; // Spotify SDK player instance
    this.deviceId = null; // Unique device identifier from Spotify
    this.isInitialized = false; // Prevent multiple initializations
    this.stateUpdateCallback = null; // Callback to update React state
  }

  /**
   * Sets the callback function that will receive player state updates
   * This is how we communicate player changes back to React components
   */
  setStateUpdateCallback(callback) {
    this.stateUpdateCallback = callback;
  }

  /**
   * Sends state updates to React components through the callback
   * This bridges the gap between the external player and React state
   */
  updateState(stateData) {
    if (this.stateUpdateCallback) {
      this.stateUpdateCallback(stateData);
    }
  }

  /**
   * Initialize the Spotify Web Player (called only once per session)
   * Loads the SDK, creates the player, and sets up event listeners
   */
  async initialize(accessToken) {
    // Prevent multiple initializations
    if (this.isInitialized) {
      return;
    }

    // Load the Spotify SDK script if not already present
    if (!document.querySelector('script[src*="spotify-player"]')) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Wait for SDK to load and initialize player
    return new Promise((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        // Create the Spotify player instance
        this.player = new window.Spotify.Player({
          name: "NextGen Music Player",
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        // Connect to Spotify's servers
        this.player.connect();

        // Handle when player is ready and we get our device ID
        this.player.addListener("ready", (data) => {
          this.deviceId = data.device_id;

          // Notify React that the device is ready
          this.updateState({
            type: "DEVICE_READY",
            deviceId: this.deviceId,
          });

          resolve();
        });

        // Handle playback state changes (play/pause/track changes)
        this.player.addListener("player_state_changed", (data) => {
          if (data) {
            // Send current playback state to React
            this.updateState({
              type: "PLAYBACK_STATE",
              isPlaying: !data.paused,
              currentTrack: data.track_window?.current_track,
              position: data.position,
              duration: data.track_window?.current_track?.duration_ms,
            });
          }
        });

        this.isInitialized = true;
      };
    });
  }

  /**
   * Clean up the player when no longer needed
   */
  async disconnect() {
    if (this.player) {
      try {
        // Wait for pause to complete before disconnecting
        await this.player.pause();
      } catch (error) {
        console.error("Error pausing player:", error);
      }

      // Then disconnect
      this.player.disconnect();
      this.player = null;
      this.deviceId = null;
      this.isInitialized = false;
    }
  }
}

// Export a single global instance (singleton pattern)
// This ensures the same player persists across all components
const spotifyPlayerManager = new SpotifyPlayerManager();
export default spotifyPlayerManager;
