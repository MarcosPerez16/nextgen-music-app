export interface AppPlaylist {
  id: number;
  name: string;
  imageUrl: string | null;
  userId: number;
  createdAt: string;
  description?: string | null;
  isPublic: boolean;
  _count?: {
    PlaylistTrack: number;
  };
}

export interface DisplayPlaylistsProps {
  playlists: AppPlaylist[];
  onPlaylistDelete: (playlistId: number) => void;
  onPlaylistUpdate: () => void;
}

export interface CustomPlaylistCardProps {
  playlist: AppPlaylist;
  onPlaylistUpdate: () => void;
  onPlaylistDelete: (playlistId: number) => void;
}
