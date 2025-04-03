'use client';

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';

// 增加自定义按钮选项
interface ContactDialogProps {
  customButton?: React.ReactNode;
}

export default function ContactDialog({ customButton }: ContactDialogProps) {
  const { isZh } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    product: '',
    message: '',
    consent: false
  });
  
  const openDialog = () => {
    setIsOpen(true);
    setIsSubmitted(false);
    document.body.style.overflow = 'hidden';
    
    // 隐藏Header元素
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }
  };
  
  const closeDialog = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    
    // 恢复Header元素
    const header = document.querySelector('header');
    if (header) {
      header.style.display = '';
    }
    
    // 关闭对话框后重置提交状态
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        email: '',
        product: '',
        message: '',
        consent: false
      });
    }, 300);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 获取表单数据
    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    
    try {
      // 发送表单数据到FormSubmit
      await fetch('https://formsubmit.co/ajax/528b574ae16f3fc5ba5ab35a76644453', {
        method: 'POST',
        body: formDataObj,
      });
      
      // 显示提交成功页面
      setIsSubmitted(true);
    } catch (error) {
      console.error('表单提交失败', error);
      // 可以添加错误处理逻辑
    }
  };
  
  // 处理点击背景关闭对话框
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 确保点击的是背景层而不是对话框内容
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  };
  
  return (
    <>
      {/* 对话框触发按钮 - 可以自定义或使用默认 */}
      {customButton ? (
        <div onClick={openDialog}>
          {customButton}
        </div>
      ) : (
        <button 
          onClick={openDialog}
          className="group inline-flex items-center text-base md:text-lg gap-3 transition-colors ease-hover no-underline rounded-xs bg-[#1441F5] px-6 py-3 text-white hover:bg-[#1031C0] hover:text-white active:bg-[#0A2080] active:text-white focus:text-white visited:text-white"
        >
          <span className="">
            {isZh ? "联系我们" : "Contact Us"}
          </span>
        </button>
      )}
      
      {/* 联系表单对话框 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]" onClick={closeDialog}>
          {/* 背景遮罩 - 仅用于视觉效果 */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* 对话框内容 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()} // 阻止点击事件冒泡，防止关闭对话框
            >
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={closeDialog} 
                  className="p-4 hover:text-[#1441F5] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="sr-only">{isZh ? "关闭" : "Close"}</span>
                </button>
              </div>
              
              {isSubmitted ? (
                // 提交成功页面
                <div className="flex flex-col h-full">
                  <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-black">{isZh ? "提交成功" : "Submission Successful"}</h2>
                  </header>
                  
                  <div className="flex items-center justify-center prose max-w-none bg-gray-50 px-8 py-16 min-h-[400px]">
                    <div className="w-fit text-center">
                      <svg 
                        className="w-16 h-16 mx-auto mb-6 text-black" 
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
                      <h3 className="text-2xl font-bold mb-4">
                        {isZh ? "谢谢您的留言" : "Thank you for your message"}
                      </h3>
                      <p className="text-gray-600 mb-8">
                        {isZh 
                          ? "我们已经收到您的询价，将尽快与您联系。" 
                          : "We have received your inquiry and will contact you shortly."}
                      </p>
                      <button 
                        onClick={closeDialog} 
                        className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                      >
                        {isZh ? "关闭" : "Close"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // 表单页面
                <form 
                  onSubmit={handleSubmit}
                  className="flex flex-col h-full"
                >
                  {/* FormSubmit配置 */}
                  <input type="hidden" name="_subject" value={isZh ? "新产品询价请求" : "New Product Inquiry"} />
                  <input type="hidden" name="_captcha" value="false" />
                  
                  <header className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-black">{isZh ? "产品询价" : "Product Inquiry"}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isZh ? "填写以下信息，我们将尽快与您联系" : "Fill out the form below and we'll get back to you shortly"}
                    </p>
                  </header>
                  
                  <div className="flex-grow overflow-auto">
                    <div className="py-6 px-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
                            {isZh ? "名" : "First Name"} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            required 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-700">
                            {isZh ? "姓" : "Last Name"} <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            required 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium mb-1 text-gray-700">
                            {isZh ? "公司名称" : "Company"}
                          </label>
                          <input 
                            type="text" 
                            id="company" 
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-700">
                            {isZh ? "电话" : "Phone"}
                          </label>
                          <input 
                            type="tel" 
                            id="phone" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-6 px-6 bg-gray-50">
                      <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                          {isZh ? "邮箱" : "Email"} <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="product" className="block text-sm font-medium mb-1 text-gray-700">
                          {isZh ? "咨询主题" : "Inquiry Subject"} <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          id="product" 
                          name="product" 
                          required
                          value={formData.product}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black"
                          placeholder={isZh ? "请输入您感兴趣的产品、服务或其他咨询内容" : "Enter any products, services (including EPC) or other inquiries"}
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium mb-1 text-gray-700">
                          {isZh ? "询价内容" : "Inquiry Details"} <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                          id="message" 
                          name="message" 
                          rows={4} 
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black text-black" 
                          placeholder={isZh ? "请描述您的需求，如项目情况、处理物料、产能要求等" : "Please describe your requirements, such as project details, materials to process, capacity requirements, etc."}
                        ></textarea>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-start">
                          <input 
                            type="checkbox" 
                            id="consent" 
                            name="consent"
                            checked={formData.consent}
                            onChange={handleInputChange}
                            className="mt-1 mr-2"
                          />
                          <label htmlFor="consent" className="text-sm text-gray-600">
                            {isZh 
                              ? "我同意接收产品相关信息和更新。您可以随时取消订阅这些通信。" 
                              : "I agree to receive product information and updates. You can unsubscribe from these communications at any time."}
                          </label>
                        </div>
                        
                        <div className="mt-4 text-sm text-gray-600">
                          <p>
                            {isZh
                              ? "泽鑫将使用您的个人数据来回复您的询问。当这个目的实现后，您的个人数据将被删除，或者如果您提前主动选择退出。"
                              : "Zexin will use your personal data to respond to your enquiry. Your personal data will be deleted when this purpose is fulfilled or if you actively opt-out in beforehand."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <footer className="border-t border-gray-100 py-4 px-6 sticky bottom-0 bg-white z-10 flex justify-end">
                    <button 
                      type="submit" 
                      className="inline-block bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 py-3 px-8 transition duration-300"
                    >
                      {isZh ? "发送信息" : "Send Message"}
                    </button>
                  </footer>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 