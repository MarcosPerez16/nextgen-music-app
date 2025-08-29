export interface AppPlaylist {
  id: number;
  name: string;
  imageUrl: string | null;
  userId: number;
  createdAt: string;
  description?: string | null;
  isPublic: boolean;
}
