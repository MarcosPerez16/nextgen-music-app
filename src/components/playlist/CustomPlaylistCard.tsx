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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-purple-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Playlist image */}
          {playlist.imageUrl ? (
            <Image
              src={playlist.imageUrl}
              alt={playlist.name}
              className="rounded-md object-cover flex-shrink-0"
              width={80}
              height={80}
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-md flex-shrink-0 flex items-center justify-center">
              <Music2 className="h-8 w-8 text-purple-600" />
            </div>
          )}

          {/* Playlist info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                type="text"
                value={editName}
                onChange={handleNameChange}
                className="mb-2 border-purple-300 focus:border-purple-500"
              />
            ) : (
              <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
                {playlist.name}
              </h3>
            )}

            {playlist.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {playlist.description}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{playlist._count?.PlaylistTrack || 0} tracks</span>
              <span>•</span>
              <span>{formatCreatedAt()}</span>
              <span>•</span>
              <span
                className={
                  playlist.isPublic ? "text-purple-600 font-medium" : ""
                }
              >
                {playlist.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save
                </Button>
                <Button size="sm" onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleView}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditMode}
                  variant="outline"
                  className="hover:bg-purple-50"
                >
                  Edit
                </Button>
                <Button size="sm" onClick={handleDelete} variant="destructive">
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomPlaylistCard;
