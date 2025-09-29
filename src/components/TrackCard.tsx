// import { Card, CardContent } from "./ui/card";
// import Image from "next/image";
// import { Button } from "./ui/button";
// import { Play } from "lucide-react";
// import { usePlayerStore } from "@/lib/stores/playerStore";
// import { TrackCardProps } from "@/types/spotify";

// const TrackCard = ({
//   track,
//   allTracks,
//   trackIndex,
//   playbackContext,
// }: TrackCardProps) => {
//   const { deviceId } = usePlayerStore();

//   //get album artwork
//   const imageUrl =
//     track.album.images && track.album.images.length > 0
//       ? track.album.images[0].url
//       : null;

//   //convert from miliseconds
//   const formatDuration = (ms: number) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = Math.floor((ms % 60000) / 1000);
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   //join multiple artists names
//   const artistNames = track.artists.map((artist) => artist.name).join(", ");

//   const handlePlayTrack = async () => {
//     if (!deviceId) {
//       console.error("No device ID available");
//       return;
//     }

//     // If we have queue context, set it up
//     if (allTracks && trackIndex !== undefined && playbackContext) {
//       // Set the queue in our store
//       usePlayerStore
//         .getState()
//         .setQueue(allTracks, trackIndex, playbackContext);
//     }

//     try {
//       const response = await fetch("/api/spotify/play", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           // If we have a queue, send all track URIs
//           ...(allTracks && trackIndex !== undefined
//             ? {
//                 trackUris: allTracks.map(
//                   (t) => t.uri || `spotify:track:${t.id}`
//                 ),
//                 offset: trackIndex, // Start at this track
//               }
//             : {
//                 // FALLBACK: Single track (old behavior)
//                 trackUri: track.uri || `spotify:track:${track.id}`,
//               }),
//           deviceId: deviceId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to play track");
//       }
//     } catch (error) {
//       console.error("Error playing track:", error);
//     }
//   };

//   return (
//     <Card className="mb-4">
//       <CardContent className="flex items-center p-4">
//         {/* Album artwork */}
//         {imageUrl ? (
//           <Image
//             src={imageUrl}
//             alt={track.album.name}
//             className="rounded-md mr-4 object-cover"
//             width={64}
//             height={64}
//           />
//         ) : (
//           <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
//             <span className="text-gray-500 text-xs">No Image</span>
//           </div>
//         )}

//         {/* Track info */}
//         <div className="flex-1">
//           <h3 className="font-semibold text-lg">{track.name}</h3>
//           <p className="text-sm text-gray-600">{artistNames}</p>
//           <p className="text-sm text-gray-500">
//             {formatDuration(track.duration_ms)}
//           </p>
//         </div>
//         <Button onClick={handlePlayTrack} variant="outline" size="sm">
//           <Play className="h-4 w-4" />
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default TrackCard;
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import { usePlayerStore } from "@/lib/stores/playerStore";
import { TrackCardProps } from "@/types/spotify";

const TrackCard = ({
  track,
  allTracks,
  trackIndex,
  playbackContext,
}: TrackCardProps) => {
  const { deviceId } = usePlayerStore();

  const imageUrl =
    track.album.images && track.album.images.length > 0
      ? track.album.images[0].url
      : null;

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  const handlePlayTrack = async () => {
    if (!deviceId) {
      console.error("No device ID available");
      return;
    }

    if (allTracks && trackIndex !== undefined && playbackContext) {
      usePlayerStore
        .getState()
        .setQueue(allTracks, trackIndex, playbackContext);
    }

    try {
      const response = await fetch("/api/spotify/play", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(allTracks && trackIndex !== undefined
            ? {
                trackUris: allTracks.map(
                  (t) => t.uri || `spotify:track:${t.id}`
                ),
                offset: trackIndex,
              }
            : {
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
    <Card className="group hover:shadow-lg transition-shadow duration-200 border-gray-200 hover:border-purple-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Album artwork */}
          {imageUrl ? (
            <div className="relative flex-shrink-0">
              <Image
                src={imageUrl}
                alt={track.album.name}
                className="rounded-md object-cover"
                width={80}
                height={80}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <Button
                  onClick={handlePlayTrack}
                  size="icon"
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-10 w-10"
                >
                  <Play className="h-5 w-5 fill-white" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors">
              {track.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">{artistNames}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDuration(track.duration_ms)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackCard;
