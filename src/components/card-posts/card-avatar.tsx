import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CardAvatarProps {
  session: Session | null;
  id: string;
}

export default function CardAvatar({ session, id }: CardAvatarProps) {
  return (
    <Avatar className="h-6 w-6">
      <AvatarFallback>FB</AvatarFallback>
      <AvatarImage
        className="rounded-full"
        src={
          isNumeric(id)
            ? `https://avatars.githubusercontent.com/u/${id}?v=4`
            : `https://github.com/${id}.png`
        }
        alt="avatar"
      />
    </Avatar>
  );
}

function isNumeric(str: string) {
  return /^\d+$/.test(str);
}
