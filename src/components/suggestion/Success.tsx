import { icons } from "../../resources/icons";

interface SuccessProps {
  closeModal: () => void;
}

function Success({ closeModal }: SuccessProps) {
  return (
    <div className="fixed z-10  w-screen fade-in h-screen top-0 left-0 bg-[rgba(255,255,255,0.7)] flex justify-center items-center">
      <div className="flex w-full h-full justify-center items-center">
        <section
          className="w-[40%] h-[50%] mx-auto rounded-2xl shadow-primary overflow-hidden bg-white "
          style={{ animation: "fadeInUp 0.3s ease-in" }}
        >
          <div className="text-center shadow-custom text-brown font-semibold text-xl py-3 px-5">
            Successfully
          </div>
          <div className="p-3 my-3 text-center ">
            <p className="text-brown font-medium">
              The Course Suggestion has
              <br /> been added
            </p>
            <img src={icons.success} className="mx-auto my-5" />
            <button
              onClick={closeModal}
              className="bg-cardColor text-primary px-10 py-1 font-medium shadow-custom rounded-full cursor-pointer"
            >
              Ok
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Success;
