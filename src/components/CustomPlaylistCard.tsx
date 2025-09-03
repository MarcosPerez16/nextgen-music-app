import { AppPlaylist } from "@/types/playlist";
import { Card } from "./ui/card";
import Image from "next/image";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const CustomPlaylistCard = ({
  playlist,
  onPlaylistUpdate,
}: {
  playlist: AppPlaylist;
  onPlaylistUpdate: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);

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
    <Card className="p-4 mb-4">
      <div className="flex items-center space-x-4">
        {playlist.imageUrl ? (
          <Image
            src={playlist.imageUrl}
            alt={playlist.name}
            className="rounded-md object-cover"
            width={64}
            height={64}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
        <div className="flex-1">
          {isEditing ? (
            <Input type="text" value={editName} onChange={handleNameChange} />
          ) : (
            <h3 className="font-semibold text-lg">{playlist.name}</h3>
          )}

          <p className="text-gray-500 text-sm">{playlist.description}</p>
          <p className="text-gray-500 text-sm">{formatCreatedAt()}</p>
          {playlist.isPublic ? "Public" : "Private"}
        </div>
        {isEditing ? (
          <div>
            <Button className="ml-4" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button className="ml-4" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button className="ml-4" size="sm" onClick={handleEditMode}>
            Edit Name
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CustomPlaylistCard;
