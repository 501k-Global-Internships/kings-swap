import bgImage from "../assets/swap-bg.svg";

const KingsSwap = () => {
  return (
    <div
      className="
        relative 
        w-full 
        h-[200px]         /* Default height for mobile */
        sm:h-[250px]      /* Small screens */
        md:h-[300px]      /* Medium screens */
        lg:h-[350px]      /* Large screens */
        bg-blue-600 
        bg-cover 
        bg-center 
        bg-no-repeat
        mx-auto
        px-2              /* Minimal horizontal padding for mobile */
        sm:px-3           /* Small screens */
        md:px-4           /* Medium screens */
        lg:px-6           /* Large screens */
        py-2              /* Minimal vertical padding for mobile */
        sm:py-3           /* Small screens */
        md:py-4           /* Medium screens */
      "
      style={{
        backgroundImage: `url(${bgImage.src})`,
      }}
    />
  );
};

export default KingsSwap;
