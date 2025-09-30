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

  return (
    <Card className="group hover:shadow-xl transition-all duration-200 border-gray-200 hover:border-purple-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Album artwork - full width at top */}
        <div className="relative aspect-square">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={track.album.name}
                className="object-cover w-full h-full"
                width={300}
                height={300}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={handlePlayTrack}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-14 w-14 shadow-lg"
                >
                  <Play className="h-6 w-6 fill-white ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Track info - below image */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-1">
            {track.name}
          </h3>
          <p className="text-sm text-gray-600 truncate mb-1">{artistNames}</p>
          <p className="text-xs text-gray-500 truncate">{track.album.name}</p>

          {/* Action buttons - horizontal row at bottom */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            {showLikeButton && (
              <Button
                onClick={handleToggleLike}
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <Heart
                  className={`h-4 w-4 ${
                    liked ? "text-red-500" : "text-gray-400"
                  }`}
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
                    className="flex-1 text-xs hover:bg-purple-50"
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
              <Button
                size="sm"
                onClick={handleDelete}
                variant="destructive"
                className="flex-1 text-xs"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackInfo;
