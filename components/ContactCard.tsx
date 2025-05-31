'use client';

import { useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/layouts/OptimizedImage";
import ContactFormModal from "@/components/ContactFormModal";

interface ContactCardProps {
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  textColor?: string;
  backgroundColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  showImage?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  useModal?: boolean;
  formTitle?: {
    en: string;
    zh: string;
  };
  formSubtitle?: {
    en: string;
    zh: string;
  };
  formType?: string;
}

export default function ContactCard({ 
  title, 
  description, 
  buttonText, 
  linkUrl,
  imageSrc = "/images/mineral-processing/contact-support.jpg",
  imageAlt = "Technical support",
  className = "",
  textColor = "text-black",
  backgroundColor = "bg-white",
  buttonColor = "bg-black",
  buttonHoverColor = "hover:bg-gray-200",
  showImage = false,
  fullWidth = true,
  rounded = false,
  useModal = true,
  formTitle = { zh: '获取专业技术方案', en: 'Get Professional Consultation' },
  formSubtitle = { zh: '请填写以下表单，我们的专业工程师团队将尽快与您联系', en: 'Please fill in the form below, and our professional team will contact you shortly' },
  formType = "general"
}: ContactCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className={`${backgroundColor} ${rounded ? 'rounded-xs' : ''} scroll-mt-32 mb-16 lg:mb-32 last-of-type:mb-0 py-16 md:py-24 ${className}`}>
      <div className={`${fullWidth ? 'max-w-7xl lg:max-w-[90%] 2xl:max-w-[95%] mx-auto' : ''} px-4 lg:px-6`}>
        {/* 极简风格标题和描述区域 */}
        <div className="mb-16">
          <h2 className={`text-2xl md:text-3xl lg:text-4xl ${textColor} mb-8 leading-tight text-right`}>
            {title}
          </h2>
          
          <div className="flex flex-col md:flex-row justify-end items-start gap-6">
            <div className="w-full md:max-w-4xl">
              <div className="prose text-xl md:text-2xl lg:text-[26px] font-bold text-gray-800 text-right">
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 图片区域 - 仅在showImage为true时显示 */}
          {showImage && (
          <div className="mb-16">
              <OptimizedImage
                className="w-full h-auto object-cover rounded-xs"
                src={imageSrc}
                alt={imageAlt}
              width={1200}
              height={600}
              sizes="(max-width: 768px) 100vw, 1200px"
                loading="lazy"
                unoptimized={true}
              />
            </div>
          )}
        
        {/* 按钮区域 - 底部布局 */}
        <div className="border-t border-gray-100 pt-12">
          <div className="flex flex-col md:flex-row justify-end items-center gap-8">
              {/* 始终使用模态框，忽略useModal参数，避免直接跳转到可能包含特殊字符的URL */}
              <button
                onClick={openModal}
                className={`group inline-flex items-center text-sm transition-colors ease-hover no-underline rounded-xs border-2 border-[#ff6633] ${buttonColor} px-8 py-3 text-white hover:text-black ${buttonHoverColor} `}
              >
                <span className="font-medium">{buttonText}</span>
              </button>
          </div>
        </div>
        
        {/* 联系表单模态框 */}
        <ContactFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          formTitle={formTitle}
          formSubtitle={formSubtitle}
          formType={formType}
        />
      </div>
    </section>
  );
} 