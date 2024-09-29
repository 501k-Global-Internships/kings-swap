import Image from "next/image";
import Logo from '../assets/Logo.svg'
import Link from "next/link";
    
const Navbar = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <Image src={Logo} alt="Logo" width={70} height={70} />
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/" className="hover:underline">
          About
        </Link>
        <Link href="/" className="hover:underline">
          Contact
        </Link>
      </nav>
      <Link href='/signUp' className="bg-white text-blue-600 px-4 py-2 rounded">
        Get started
      </Link>
    </header>
  );
};

export default Navbar;
