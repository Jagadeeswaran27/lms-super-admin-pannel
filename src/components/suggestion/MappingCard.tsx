interface MappingCardProps {
  category: string;
  superCategory: string;
}

function MappingCard({ category, superCategory }: MappingCardProps) {
  return (
    <div
      className={`bg-white rounded-md w-[80%] mx-auto my-3 flex relative gap-2 items-center shadow-custom px-2 py-5 lg:pl-5 max-lg:px-7 max-sm:px-2 `}
    >
      <div className="flex gap-3 max-w-[40%] min-w-[40%] items-center">
        <div className="rounded-full overflow-hidden">
          <p>{category}</p>
        </div>
      </div>
      <div className="flex justify-between w-[60%] items-start gap-5">
        <p className="bg-authPrimary text-sm rounded-full px-2 py-[1px] text-white">
          {superCategory}
        </p>
      </div>
    </div>
  );
}

export default MappingCard;
