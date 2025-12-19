import Image from "next/image";
import {Button} from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="container mx-auto grid min-h-[80vh] grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2">
      
      {/* Text Content */}
      <div className="flex flex-col gap-6 text-center md:text-start">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          إدارة محاسبة نشاطك التجاري  
          <span className="block text-primary">بسهولة وذكاء</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          مخزنكو يساعدك على متابعة المبيعات، المصروفات، الفواتير،
          والمخزون في مكان واحد مع تقارير ذكية تساعدك على اتخاذ قرارات أفضل.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
          <Button className="btn btn-primary px-8">ابدأ مجانًا</Button>
          <Button className="btn btn-outline px-8">شاهد المميزات</Button>
        </div>
      </div>

      {/* Visual / Image */}
      <div className="relative hidden md:block">
        <div className="absolute  rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
        <Image
          src="/dashboard-preview.png"
          alt="Dashboard Preview"
          width={800}  // اضبط حسب الحجم المطلوب
          height={50} // اضبط حسب الحجم المطلوب
          className="relative w-[300px] h-64 object-cover rounded-2xl shadow-xl"
          priority
        />
      </div>

    </section>
  );
}
