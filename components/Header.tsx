import { Button } from "./ui/button";
import { logoutSVG } from "@/assets";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  ownerId: string;
  accountId: string;
}

const Header = ({ ownerId, accountId }: Props) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={ownerId} accountId={accountId} />
        <form action={signOutUser}>
          <Button type="submit" className="sign-out-button">
            <Image src={logoutSVG} alt="logo" width={24} height={24} className="w-6" />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
