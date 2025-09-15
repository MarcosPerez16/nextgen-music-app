import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import { Loader2 } from "lucide-react";

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
    <div>
      {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}

      <form onSubmit={handleSubmit}>
        <Input value={name} onChange={handleName} placeholder="Name" />
        <Input
          value={description}
          onChange={handleDescription}
          placeholder="Description"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating...." : "Submit"}
        </Button>

        <Checkbox
          className="m-4"
          checked={isPublic}
          onCheckedChange={handleIsPublic}
        />
        <span>Make playlist public.</span>
      </form>
    </div>
  );
};

export default PlaylistsForm;
