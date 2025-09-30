import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type PlaylistsFormProps = {
  handleFetchPlaylists: () => Promise<void>;
};

const PlaylistsForm = ({ handleFetchPlaylists }: PlaylistsFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //pieces of state and functions for each form input
  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleIsPublic = () => {
    //toggle the boolean
    setIsPublic(!isPublic);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name) {
      return;
    }
    handleCreatePlaylist();
  };

  const handleCreatePlaylist = async () => {
    //loading state
    setIsLoading(true);

    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, isPublic }),
      });
      //check if response failed
      if (!response.ok) {
        throw new Error("Error creating playlist");
      }

      //return result
      const result = await response.json();

      //clear form after sucessful submission
      setName("");
      setDescription("");
      setIsPublic(false);

      //trigger re-fetch of playlists to show new ones
      handleFetchPlaylists();

      return result;
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New Playlist
          </h2>

          {isLoading && (
            <div className="flex justify-center py-2 mb-4">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                value={name}
                onChange={handleName}
                placeholder="Playlist name"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <Input
                value={description}
                onChange={handleDescription}
                placeholder="Description (optional)"
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isPublic}
                onCheckedChange={handleIsPublic}
                className="border-purple-600 data-[state=checked]:bg-purple-600"
              />
              <label className="text-sm text-gray-700">
                Make playlist public
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Playlist"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaylistsForm;
