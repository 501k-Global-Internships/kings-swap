import bgImage from "../assets/swap-bg.svg";

const KingsSwap = () => {
  return (
    <div
      className="
        relative 
        w-full 
        h-[200px]    
        sm:h-[250px]      
        md:h-[300px]    
        lg:h-[350px]     
        bg-blue-600 
        bg-cover 
        bg-center 
        bg-no-repeat
        mx-auto
        px-2            
        sm:px-3         
        md:px-4          
        lg:px-6          
        py-2            
        sm:py-3           
        md:py-4          
      "
      style={{
        backgroundImage: `url(${bgImage.src})`,
      }}
    />
  );
};

export default KingsSwap;
