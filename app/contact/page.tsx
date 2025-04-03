'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";
import PageSection from "@/app/components/PageSection";
import Breadcrumb from "@/app/components/Breadcrumb";
import ContactDialog from "@/app/components/ContactDialog";

export default function Contact() {
  const { isZh } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* 第一屏：主要内容 */}
      <PageSection 
        noPadding
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            { label: { zh: "联系我们", en: "Contact Us" } }
          ]
        }}
      >
        <div className="relative py-16 px-6 md:px-8 flex items-center min-h-[300px] max-w-[1200px] mx-auto">
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between w-full">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "联系我们" : "Contact Us"}
                </h1>
              </div>
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left">
                  <p>
                    {isZh
                      ? "我们致力于为客户提供专业的技术支持和服务，您可以通过多种方式联系我们。"
                      : "We are committed to providing professional technical support and service to our customers. You can contact us in a variety of ways."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 销售及服务 */}
      <section className="mb-16 lg:mb-32 last-of-type:mb-0 bg-black text-white scroll-mt-32">
        <div className="md:py-12 lg:py-20 max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid last-of-type:mb-0 gap-12 md:auto-cols-fr md:grid-flow-col lg:gap-20">
            <div className="flex flex-col items-start justify-between gap-y-10 max-md:pb-16 pb-8 max-md:contain max-md:order-1">
              <strong className="mb-4 md:mb-6 text-xl">
                {isZh ? "服务网络" : "Service Network"}
              </strong>
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance text-white leading-tight font-bold">
                  {isZh ? "专业咨询与支持" : "Professional Consultation & Support"}
                </h2>
                <div className="prose mt-8 lg:mt-10 text-white prose-p:text-white max-w-2xl">
                  <p className="text-lg md:text-xl">
                    {isZh 
                      ? "我们在中国和尼日利亚设有办事处，专业团队随时准备为您提供技术咨询和支持服务。" 
                      : "Our professional teams at our offices in China and Nigeria are ready to provide you with technical consultation and support services."}
                  </p>
                </div>
              </div>
              <div className="mt-6 md:mt-10">
                <ContactDialog 
                  customButton={
                    <button
                      className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                    >
                      {isZh ? '联系我们' : 'Contact Us'}
                    </button>
                  }
                />
              </div>
            </div>
            <div>
              <div className="w-full h-full overflow-hidden rounded-xs">
                <Image
                  src="/images/contact/sales-service.jpg"
                  alt={isZh ? "销售与服务" : "Sales and Service"}
                  width={800}
                  height={800}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 公司总部与分公司 */}
      <section className="mb-16 lg:mb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="prose max-w-none bg-[#B19B73] p-16 text-black">
              <h2 className="text-4xl font-extrabold mb-14">
                {isZh ? "扶绥总部" : "Fusui Headquarters"}
              </h2>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "电话" : "Phone"}</h3>
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                  <p className="text-lg whitespace-nowrap">+86 18577086999</p>
                  <p className="text-lg">{isZh ? "王超" : "Eddie Wang"}</p>
                  <p className="text-lg whitespace-nowrap">+86 13807719695</p>
                  <p className="text-lg">{isZh ? "吴宇涛" : "Cassian Wu"}</p>
                </div>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "WhatsApp" : "WhatsApp"}</h3>
                <p className="text-lg">+639654706775</p>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "电子邮件" : "Email"}</h3>
                <p className="text-lg"><a href="mailto:zexinminingequipment@hotmail.com" className="text-black hover:text-gray-700 underline">zexinminingequipment@hotmail.com</a></p>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "地址" : "Address"}</h3>
                <div className="mb-3 text-lg font-bold text-gray-900">
                  {isZh ? "泽鑫矿山设备有限公司" : "Zexin Mining Equipment Co., Ltd."}
                </div>
                <p className="text-lg mb-5">
                  {isZh ? "广西省南宁市扶绥县东盟青年产业园上龙大道" : "Shanglong Avenue, ASEAN Youth Industrial Park, Fusui County, Nanning City, Guangxi Province"}
                </p>
              </div>
            </div>
            <div className="prose max-w-none bg-gray-100 p-16 text-black">
              <h2 className="text-4xl font-extrabold mb-14">
                {isZh ? "尼日利亚分公司" : "Nigeria Branch"}
              </h2>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "电话" : "Phone"}</h3>
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                  <p className="text-lg whitespace-nowrap">+86 18577086999</p>
                  <p className="text-lg">{isZh ? "王超" : "Eddie Wang"}</p>
                  <p className="text-lg whitespace-nowrap">+86 13807719695</p>
                  <p className="text-lg">{isZh ? "吴宇涛" : "Cassian Wu"}</p>
                </div>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "WhatsApp" : "WhatsApp"}</h3>
                <p className="text-lg">+639654706775</p>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "电子邮件" : "Email"}</h3>
                <p className="text-lg"><a href="mailto:zexinminingequipment@hotmail.com" className="text-black hover:text-gray-700 underline">zexinminingequipment@hotmail.com</a></p>
              </div>
              <div className="mb-12">
                <h3 className="text-xl font-bold mb-3">{isZh ? "地址" : "Address"}</h3>
                <div className="mb-3 text-lg font-bold text-gray-900">
                  {isZh ? "泽鑫矿山设备尼日利亚有限公司" : "Zexin Mining Equipment Nigeria Ltd."}
                </div>
                <p className="text-lg mb-5">
                  {isZh ? "尼日利亚高原州，JosSouthL.G.A Little Rayfield路" : "Little Rayfield Road, Jos South L.G.A, Plateau State, Nigeria"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 