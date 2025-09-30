import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CustomPlaylistCardProps } from "@/types/playlist";
import { toast } from "sonner";
import { Music2 } from "lucide-react";

const CustomPlaylistCard = ({
  playlist,
  onPlaylistUpdate,
  onPlaylistDelete,
}: CustomPlaylistCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);

  const router = useRouter();

  const handleView = () => {
    router.push(`/playlists/${playlist.id}`);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(event.target.value);
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(playlist.name);
  };

  const handleDelete = async () => {
    //send a confirmation message
    if (
      !confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      onPlaylistDelete(playlist.id);
      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      toast.error("Failed to delete playlist");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/playlists/${playlist.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      const result = await response.json();

      //on success go back to view mode
      setIsEditing(false);

      //call handleFetchPlaylists to update name
      onPlaylistUpdate();

      return result;
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  //convert date
  const formatCreatedAt = () => {
    const date = new Date(playlist.createdAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-200 border-gray-200 hover:border-purple-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Playlist image - full width at top */}
        <div
          className="relative aspect-square w-full cursor-pointer overflow-hidden"
          onClick={!isEditing ? handleView : undefined}
        >
          {playlist.imageUrl ? (
            <Image
              src={playlist.imageUrl}
              alt={playlist.name}
              className="object-cover"
              width={300}
              height={300}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <Music2 className="h-16 w-16 text-purple-600" />
            </div>
          )}
        </div>

        {/* Playlist info - below image */}
        <div className="p-4">
          {isEditing ? (
            <Input
              type="text"
              value={editName}
              onChange={handleNameChange}
              className="mb-2 border-purple-300 focus:border-purple-500"
            />
          ) : (
            <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-purple-700 transition-colors mb-1">
              {playlist.name}
            </h3>
          )}

          {playlist.description && (
            <p className="text-sm text-gray-600 truncate mb-1">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-col gap-1 text-xs text-gray-500 mb-2">
            <span>{playlist._count?.PlaylistTrack || 0} tracks</span>
            <span>{formatCreatedAt()}</span>
            <span
              className={playlist.isPublic ? "text-purple-600 font-medium" : ""}
            >
              {playlist.isPublic ? "Public" : "Private"}
            </span>
          </div>

          {/* Action buttons - at bottom */}
          <div className="flex flex-col gap-4 mt-3 pt-3 border-t border-gray-100">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700 w-full text-xs"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full text-xs"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleView}
                  className="bg-purple-600 hover:bg-purple-700 w-full text-xs"
                >
                  View
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleEditMode}
                    variant="outline"
                    className="hover:bg-purple-50 flex-1 text-xs"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDelete}
                    variant="destructive"
                    className="flex-1 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPlaylistCard;
