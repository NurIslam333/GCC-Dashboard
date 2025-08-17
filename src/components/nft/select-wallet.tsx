import Image from '@/components/ui/image';
import metamaskLogo from '@/assets/images/metamask.svg';
import { WalletContext } from '@/lib/hooks/use-connect';
import { useModal } from '@/components/modal-views/context';
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function SelectWallet({ ...props }) {
  const router = useRouter();
  const { address, connectToWallet, error } = useContext(WalletContext);
  const { closeModal } = useModal();
  useEffect(() => {
    if (address) closeModal();
  }, [address, closeModal]);
    const getRole =Cookies.get('role')

  const logout = async () => {
    Cookies.remove("user")
    Cookies.remove("role")
    if(getRole === 'user') {
      router.push("/login");
    }else{
      router.push("/secure-login");
    }
 
    Cookies.remove("token");
  };

  return (
    <div
      className="relative z-50 mx-auto w-[440px] max-w-full rounded-lg bg-white px-9 py-16 dark:bg-light-dark"
      {...props}
    >
      <h2 className="mb-4 text-center text-2xl font-medium uppercase text-gray-900 dark:text-white">
        LogOut
      </h2>
    

      <div
        className="mt-12 flex h-14 w-full cursor-pointer items-center justify-between rounded-lg bg-gradient-to-l from-[#ffdc24] to-[#ff5c00] px-4 text-base text-white transition-all hover:-translate-y-0.5"
        onClick={logout}
      >
        <span>Logout</span>
        <span className="h-auto w-9">
          <Image src={metamaskLogo} alt="metamask" />
        </span>
      </div>


    </div>
  );
}
