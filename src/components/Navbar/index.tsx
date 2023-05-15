import LoginButton from "../LoginButton";
import { Branding } from "./Branding";

export const Navbar = () => {
  return (
    <>
      <div
        className={`
        z-10
        hidden
        w-full flex-row items-center justify-between gap-8
        px-3 font-secondary text-sm
        text-primary-lighter
        shadow-md
        sm:flex
        bg-primary
      `}
      >
        <div className="flex flex-grow flex-row justify-around gap-8">
        <Branding />
        <LoginButton/>
        </div>
      </div>
    </>
  );
};
