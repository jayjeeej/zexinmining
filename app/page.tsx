'use client';

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { useLanguage } from "./contexts/LanguageContext";
import Section from "./components/Section";

export default function Home() {
  const { isZh } = useLanguage();
  
  // 双语内容
  const content = {
    hero: {
      title: {
        zh: "欢迎来到\n泽鑫矿山设备",
        en: "Welcome to\nZexin Mining Equipment"
      },
      subtitle: {
        zh: "专业矿山设备制造商，为全球矿山提供高效服务",
        en: "Professional mining equipment manufacturer providing efficient solutions globally"
      },
      cta: {
        zh: "浏览产品",
        en: "View Products"
      }
    },
    advantages: {
      title: {
        zh: "我们的目的",
        en: "Our Purpose"
      },
      description: {
        zh: "泽鑫矿山设备致力于通过矿山设备的技术创新，为全球采矿业提供更高效、更可靠的解决方案，助力客户实现可持续发展。",
        en: "Zexin Mining Equipment is committed to providing more efficient and reliable solutions for the global mining industry through technological innovation, helping customers achieve sustainable development."
      },
      items: [
        {
          title: { zh: "技术驱动", en: "Technology-Driven" },
          description: {
            zh: "我们对于持续打造创新解决方案和先进科技进步有着无比的热情，这也因此造就了我们具备引领行业的创新思维。",
            en: "We have an unmatched passion for continuously creating innovative solutions and advancing technology, which has enabled us to develop industry-leading innovative thinking."
          }
        }
      ],
      cta: {
        zh: "更多信息",
        en: "More Information"
      }
    }
  };

  return (
    <main className="flex flex-col w-full">
      {/* 首屏：欢迎内容 */}
      <Section bgColor="bg-white">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between w-full">
          <div className="md:w-1/2 w-full flex flex-col">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              {isZh ? (
                <>欢迎来到<br />泽鑫矿山设备</>
              ) : (
                <>Welcome to<br />Zexin Mining Equipment</>
              )}
            </h1>
          </div>
          <div className="md:w-1/2 w-full flex flex-col">
            <div className="space-y-4 text-black text-right">
              <p className="w-full">{isZh ? content.hero.subtitle.zh : content.hero.subtitle.en}</p>
              <div className="mt-8 text-right w-full">
                <Link 
                  href="/products" 
                  className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                >
                  {isZh ? content.hero.cta.zh : content.hero.cta.en}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 第二屏：视频背景 */}
      <div className="relative h-screen">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full brightness-50"
          >
            <source src="/videos/mining-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-10 h-10 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 我们的目的 */}
      <Section bgColor="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-flow-col md:auto-cols-fr gap-8 lg:gap-16">
          <div className="flex flex-col items-start justify-between gap-y-8 order-1 max-md:pb-16 pb-8">
            <strong>
              {isZh ? "我们的目的" : "Our Purpose"}
            </strong>
            <div>
              <h2 className="text-lg max-md:text-4xl lg:max-w-lg lg:text-2xl xl:text-4xl text-balance text-[#333333]">
                {isZh ? "通过技术创新推动矿业可持续发展" : "Driving Sustainable Mining Through Technological Innovation"}
              </h2>
              <div className="prose mt-4 xl:prose-xl lg:mt-8 text-[#333333]">
                <p>
                  {isZh ? content.advantages.items[0].description.zh : content.advantages.items[0].description.en}
                </p>
              </div>
            </div>
            <div>
              <Link href="/solutions" className="group inline-flex items-center text-sm md:text-base gap-3 transition-colors ease-hover text-current underline-offset-4 hover:text-current focus:text-current active:text-current">
                <span className="underline group-hover:opacity-80 group-focus:opacity-80 group-active:opacity-80 transition-opacity">
                  {isZh ? content.advantages.cta.zh : content.advantages.cta.en}
                </span>
                <span className="text-[#BFA46C] -translate-x-1 transition-transform ease-hover group-hover:translate-x-0.5 group-focus:translate-x-0.5 group-active:translate-x-0.5">
                  <svg focusable="false" fill="currentColor" width="32" height="32" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
          <div>
            <div className="w-full h-full overflow-hidden rounded-xs">
              <Image
                src="/images/solutions-bg.jpg"
                alt={isZh ? "我们的目的" : "Our Purpose"}
                width={800}
                height={800}
                style={{ objectFit: "cover", width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
