import { ReactNode } from "react";

interface CustomIconButtonProps {
  text: string;
  icon: ReactNode;
  onClick: () => void;
}

function CustomIconButton({ icon, onClick, text }: CustomIconButtonProps) {
  return (
    <div
      className="bg-cardColor px-1 py-2 rounded-full flex items-center justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="w-10"></div>
      <p className="text-center flex-grow text-primary font-semibold">{text}</p>
      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

export default CustomIconButton;
