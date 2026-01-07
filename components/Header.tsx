import { Button } from "./ui/button";
import { logoutSVG } from "@/assets";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = (user: UserData) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={user.$id} accountId={user.accountId} />
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
