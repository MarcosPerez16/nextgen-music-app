import Image from "next/image";
import { TrackInfoProps } from "@/types/spotify";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { Heart, Play } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppPlaylist } from "@/types/playlist";
import { toast } from "sonner";
import { usePlayerStore } from "@/lib/stores/playerStore";

const TrackInfo = ({
  track,
  showLikeButton = true,
  showAddToPlaylist = false,
  showRemoveButton = false,
  showPlayButton = false,
  playlistId,
  deleteTrack,
  allTracks,
  trackIndex,
  playbackContext,
  onUnlike,
}: TrackInfoProps) => {
  const [liked, setLiked] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<AppPlaylist[]>([]);
  const { deviceId } = usePlayerStore();

  useEffect(() => {
    const checkLikeStatus = async () => {
      //only check if we are showing the like button
      if (!showLikeButton) return;

      try {
        const response = await fetch(
          `/api/tracks/check-like?spotifyId=${track.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [track.id, showLikeButton]);

  //get album artwork
  const imageUrl =
    track.album.images && track.album.images.length > 0
      ? track.album.images[0].url
      : null;

  //join multiple artists names
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  const handleToggleLike = async () => {
    try {
      const response = await fetch("/api/tracks/like", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          spotifyId: track.id,
          name: track.name,
          artist: artistNames,
          album: track.album.name,
          duration_ms: track.duration_ms,
          imageUrl: imageUrl,
        }),
      });

      //check if API call was successful
      if (!response.ok) {
        throw new Error("");
      }

      //parse response to get liked status
      const result = await response.json();

      //update the local state to reflect new like status
      setLiked(result.liked);

      //call the onUnlike callback if track was unliked
      if (!result.liked && onUnlike) {
        onUnlike(track.id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchUserPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists");
      if (response.ok) {
        const data = await response.json();
        setUserPlaylists(data.playlists);
      }
    } catch (error) {
      console.error("Error fetching playlists", error);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          spotifyId: track.id,
          name: track.name,
          artist: artistNames,
          album: track.album.name,
          duration_ms: track.duration_ms,
          imageUrl: imageUrl,
        }),
      });

      if (response.ok) {
        toast.success("Track added to playlist successfully");
      } else if (response.status === 409) {
        toast.error("Track is already in this playlist");
      } else {
        toast.error("Failed to add track to playlist");
      }
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      toast.error("Failed to add track to playlist");
    }
  };

  const handleDelete = async () => {
    //send a confirmation message
    if (
      !confirm(
        "Are you sure you want to delete this track? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          spotifyId: track.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      deleteTrack?.(track.id);
      toast.success("Track removed from playlist successfully");
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      toast.error("Failed to remove track from playlist");
    }
  };

  const handlePlayTrack = async () => {
    if (!deviceId) {
      console.error("No device ID available");
      return;
    }

    // If we have queue context, set it up
    if (allTracks && trackIndex !== undefined && playbackContext) {
      // Set the queue in our store
      usePlayerStore
        .getState()
        .setQueue(allTracks, trackIndex, playbackContext);
    }

    try {
      const response = await fetch("/api/spotify/play", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          //If we have a queue, send all track URIs
          ...(allTracks && trackIndex !== undefined
            ? {
                trackUris: allTracks.map(
                  (t) => t.uri || `spotify:track:${t.id}`
                ),
                offset: trackIndex, // Start at this track
              }
            : {
                // FALLBACK: Single track (old behavior)
                trackUri: track.uri || `spotify:track:${track.id}`,
              }),
          deviceId: deviceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to play track");
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  //convert from miliseconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Album artwork */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={track.album.name}
              className="rounded-md object-cover flex-shrink-0"
              width={64}
              height={64}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate">
              {track.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{artistNames}</p>
            <p className="text-xs text-gray-500 truncate">{track.album.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDuration(track.duration_ms)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showPlayButton && (
              <Button
                onClick={handlePlayTrack}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}

            {showLikeButton && (
              <Button onClick={handleToggleLike} variant="ghost" size="sm">
                <Heart
                  className={liked ? "text-red-500" : "text-gray-400"}
                  fill={liked ? "red" : "none"}
                />
              </Button>
            )}

            {showAddToPlaylist && (
              <DropdownMenu
                onOpenChange={(open) => {
                  if (open) {
                    fetchUserPlaylists();
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-50"
                  >
                    Add to Playlist
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {userPlaylists.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                    >
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showRemoveButton && (
              <Button size="sm" onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackInfo;
