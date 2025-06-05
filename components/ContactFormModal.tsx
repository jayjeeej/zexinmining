'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formTitle?: {
    en: string;
    zh: string;
  };
  formSubtitle?: {
    en: string;
    zh: string;
  };
  subjectDefaultValue?: string;
  formType?: string;
  placeholders?: {
    subject: {
      en: string;
      zh: string;
    };
    message: {
      en: string;
      zh: string;
    };
  };
}

// 默认占位符文本
const defaultPlaceholders = {
  subject: { 
    zh: "请输入咨询主题", 
    en: "Please enter your inquiry subject" 
  },
  message: { 
    zh: "请描述您的需求或提供更多详情", 
    en: "Please describe your requirements or provide more details" 
  }
};

const ContactFormModal: React.FC<ContactFormModalProps> = ({ 
  isOpen, 
  onClose,
  formTitle = { zh: '联系我们', en: 'Contact Us' },
  formSubtitle = { zh: '填写下面的表格，我们将尽快与您联系', en: 'Fill out the form below and we\'ll get back to you shortly' },
  subjectDefaultValue = '',
  formType = 'general',
  placeholders = defaultPlaceholders
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isZh = locale === 'zh';
   
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
   
  // 添加animation-ready类，启用动画效果
  useEffect(() => {
    document.documentElement.classList.add('animation-ready');
    
    return () => {
      // 组件卸载时不移除animation-ready类，因为其他组件可能也需要
    };
  }, []);
   
  // 处理模态框的显示和隐藏
  useEffect(() => {
    let closeTimer: NodeJS.Timeout;
    
    if (isOpen) {
      // 打开模态框时，立即渲染组件
      setShouldRender(true);
    } else if (shouldRender) {
      // 关闭时，等待动画完成后再移除组件
      closeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 与CSS过渡时间相匹配
    }
    
    return () => {
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [isOpen, shouldRender]);
   
  // 处理html transform导致fixed定位问题
  useEffect(() => {
    if (isOpen) {
      // 保存原始状态
      const hadBackfaceFix = document.documentElement.classList.contains('backface-fix');
      const originalTransform = document.documentElement.style.transform;
      
      // 临时移除影响fixed定位的属性
      document.documentElement.classList.remove('backface-fix');
      document.documentElement.style.transform = '';
      
      return () => {
        // 组件关闭时恢复原状态
        if (hadBackfaceFix) {
          document.documentElement.classList.add('backface-fix');
        }
        document.documentElement.style.transform = originalTransform;
      };
    }
  }, [isOpen]);
   
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    subject: subjectDefaultValue,
    message: '',
    consent: false
  });

  // 处理点击模态框外部区域
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 如果点击的是背景层而不是模态框本身，则关闭模态框
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 获取表单数据
      const form = e.target as HTMLFormElement;
      const formDataObj = new FormData(form);
      
      // 发送表单数据到FormSubmit
      await fetch('https://formsubmit.co/ajax/528b574ae16f3fc5ba5ab35a76644453', {
        method: 'POST',
        body: formDataObj,
      });
      
      // 显示提交成功页面
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission failed:', error);
      alert(isZh ? '提交时出错，请稍后再试。' : 'Error submitting form, please try again later.');
    }
  };
  
  // 关闭并重置表单
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        email: '',
        subject: subjectDefaultValue,
        message: '',
        consent: false
      });
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 modal-backdrop ${isOpen ? 'modal-open' : 'modal-closing'}`} 
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef} 
        className={`bg-white border border-gray-200 rounded-md w-full max-w-4xl max-h-[90vh] overflow-y-auto text-black modal-dialog ${isOpen ? 'modal-dialog-open' : 'modal-dialog-closing'}`}
        onClick={(e) => e.stopPropagation()} // 阻止点击事件冒泡
      >
        <div className="flex justify-end">
          <button 
            type="button" 
            className="p-4 hover:text-[#ff6633] transition-colors"
            onClick={handleClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">{isZh ? '关闭' : 'Close'}</span>
          </button>
        </div>
        
        {isSubmitted ? (
          // 提交成功页面
          <div className="flex flex-col h-full">
            <header className="border-b border-gray-200 py-4 px-8 md:px-10 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-black font-headline">
                {isZh ? "提交成功" : "Submission Successful"}
              </h2>
            </header>
            
            <div className="flex items-center justify-center prose max-w-none bg-white px-8 md:px-10 py-16 min-h-[400px]">
              <div className="w-fit text-center">
                <svg 
                  className="w-16 h-16 mx-auto mb-6 text-[#ff6633]" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" fill="none" strokeWidth="1.5" />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12l2 2 4-4" 
                  />
                </svg>
                <h3 className="text-2xl font-bold mb-4 font-headline">
                  {isZh ? "谢谢您的留言" : "Thank you for your message"}
                </h3>
                <p className="text-gray-600 mb-8 font-text">
                  {isZh 
                    ? "我们已经收到您的咨询，将尽快与您联系。" 
                    : "We have received your inquiry and will contact you shortly."}
                </p>
                <button 
                  onClick={handleClose} 
                  className="inline-block bg-white border border-[#ff6633] text-[#ff6633] hover:bg-gray-50 py-2 px-5 text-sm rounded-md transition duration-300"
                >
                  {isZh ? "关闭" : "Close"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="flex flex-col h-full" onSubmit={handleSubmit}>
            <input type="hidden" value={isZh ? `新${formType}咨询` : `New ${formType} Inquiry`} name="_subject" />
            <input type="hidden" value="false" name="_captcha" />
            
            <header className="border-b border-gray-200 py-4 px-8 md:px-10 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-black font-headline">
                {isZh ? formTitle.zh : formTitle.en}
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-text">
                {isZh ? formSubtitle.zh : formSubtitle.en}
              </p>
            </header>
            
            <div className="flex-grow overflow-auto">
              <div className="py-6 px-8 md:px-10 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
                      {isZh ? '名字' : 'First Name'} <span className="text-[#ff6633]">*</span>
                    </label>
                    <input 
                      id="firstName" 
                      name="firstName"
                      required 
                      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black"
                      type="text" 
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700">
                      {isZh ? '姓氏' : 'Last Name'} <span className="text-[#ff6633]">*</span>
                    </label>
                    <input 
                      id="lastName" 
                      name="lastName"
                      required 
                      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                      type="text" 
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1 text-gray-700">
                      {isZh ? '公司' : 'Company'}
                    </label>
                    <input 
                      id="company" 
                      name="company"
                      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                      type="text" 
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                      {isZh ? '电话' : 'Phone'}
                    </label>
                    <input 
                      id="phone" 
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                      type="tel" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="py-6 px-8 md:px-10 bg-white">
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                    {isZh ? '电子邮件' : 'Email'} <span className="text-[#ff6633]">*</span>
                  </label>
                  <input 
                    id="email" 
                    name="email"
                    required 
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-700">
                    {isZh ? '咨询主题' : 'Inquiry Subject'} <span className="text-[#ff6633]">*</span>
                  </label>
                  <input 
                    id="subject" 
                    name="subject"
                    required 
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                    placeholder={isZh ? placeholders.subject.zh : placeholders.subject.en} 
                    type="text" 
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700">
                    {isZh ? '咨询详情' : 'Inquiry Details'} <span className="text-[#ff6633]">*</span>
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#ff6633] focus:border-[#ff6633] text-black" 
                    placeholder={isZh ? placeholders.message.zh : placeholders.message.en} 
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start">
                    <input 
                      id="consent" 
                      name="consent"
                      className="mt-1 mr-2 accent-[#ff6633]" 
                      type="checkbox"
                      checked={formData.consent}
                      onChange={handleChange}
                    />
                    <label htmlFor="consent" className="text-sm text-gray-600">
                      {isZh 
                        ? '我同意接收相关信息和更新。您可以随时取消这些通信。' 
                        : 'I agree to receive information and updates. You can unsubscribe from these communications at any time.'}
                    </label>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      {isZh 
                        ? 'Zexin Mining将使用您的个人数据来回复您的询问。当此目的实现或您提前主动选择退出时，您的个人数据将被删除。' 
                        : 'Zexin Mining will use your personal data to respond to your enquiry. Your personal data will be deleted when this purpose is fulfilled or if you actively opt-out in beforehand.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <footer className="border-t border-gray-200 py-4 px-8 md:px-10 sticky bottom-0 bg-white z-10 flex justify-end">
              <button 
                type="submit" 
                className="inline-block bg-white border border-[#ff6633] text-[#ff6633] hover:bg-gray-50 py-2 px-5 text-sm rounded-md transition duration-300"
              >
                {isZh ? '发送信息' : 'Send Message'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactFormModal; 