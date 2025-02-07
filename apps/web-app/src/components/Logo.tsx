import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image
        loading="eager"
        decoding="sync"
        className="dark:hidden"
        src="/dark-logo.svg"
        alt="Logo"
        width={40}
        height={40}
      />
      <Image
        loading="eager"
        decoding="sync"
        className="hidden dark:block"
        src="/logo.svg"
        alt="Logo"
        width={40}
        height={40}
      />
    </div>
  );
}
