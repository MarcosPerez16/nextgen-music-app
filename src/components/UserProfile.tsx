import { SpotifyUserProfile } from "@/types/spotify";
import { Users, Mail } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface UserProfileProps {
  userProfile: SpotifyUserProfile;
}

const UserProfile = ({ userProfile }: UserProfileProps) => {
  return (
    <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userProfile.display_name}!
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span>
                  {userProfile.followers.total.toLocaleString()} followers
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-purple-600" />
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
