import { useTranslations } from 'next-intl';

import Navbar from '@/components/layout/Navbar';

import Hero from '@/components/layout/Landing/Hero';
import Feutcher from '@/components/layout/Landing/Feutcher';
import Pricing from '@/components/layout/Landing/Plan';

export default function HomePage() {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
        <Navbar />
          <Hero />
          <Feutcher />
          <Pricing />
       
        </div>
    );
}
