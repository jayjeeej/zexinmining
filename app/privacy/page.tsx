'use client';

import { useLanguage } from "../contexts/LanguageContext";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import PageSection from "../components/PageSection";

export default function PrivacyPolicy() {
  const { isZh } = useLanguage();
  
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 max-w-[1200px] py-8">
        <Breadcrumb 
          items={[
            { label: { zh: '首页', en: 'Home' }, href: '/' },
            { label: { zh: '隐私政策', en: 'Privacy Policy' }, href: '/privacy' }
          ]} 
        />
        <PageSection>
          <h1 className="text-3xl font-bold mb-8">{isZh ? '隐私政策' : 'Privacy Policy'}</h1>
          
          <div className="prose max-w-none">
            {isZh ? (
              <>
                <p className="mb-4">最后更新: 2025年4月</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. 引言</h2>
                <p>泽鑫矿山设备有限公司（"我们"或"泽鑫"）尊重并保护您的隐私。本隐私政策描述了我们如何收集、使用、存储和保护您的个人信息。</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. 我们收集的信息</h2>
                <p>我们可能收集以下类型的信息：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>基本信息：您的姓名、电子邮件地址、电话号码、公司名称等。</li>
                  <li>访问信息：IP地址、浏览器类型、访问时间等。</li>
                  <li>询盘信息：您通过联系表单提交的产品或服务需求信息。</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. 信息使用</h2>
                <p>我们使用收集的信息用于：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>提供、维护和改进我们的产品和服务</li>
                  <li>响应您的询问、评论或问题</li>
                  <li>向您发送技术通知、更新、安全警报</li>
                  <li>监控和分析网站使用趋势和偏好</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. 联系我们</h2>
                <p>如果您对我们的隐私政策有任何疑问，请通过以下方式联系我们：</p>
                <p>
                  <strong>电子邮件：</strong> info@zexinmining.com<br />
                  <strong>电话：</strong> +86 XXX XXXX XXXX<br />
                  <strong>地址：</strong> 中国 XX省 XX市
                </p>
                
                <p className="mt-8">有关我们的服务和产品的更多信息，请访问我们的 <Link href="/" className="text-blue-600 hover:underline">网站首页</Link>。</p>
              </>
            ) : (
              <>
                <p className="mb-4">Last Updated: April 2025</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
                <p>Zexin Mining Equipment Co., Ltd. ("we" or "Zexin") respects and protects your privacy. This Privacy Policy describes how we collect, use, store, and protect your personal information.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Basic Information: Your name, email address, phone number, company name, etc.</li>
                  <li>Access Information: IP address, browser type, access time, etc.</li>
                  <li>Inquiry Information: Product or service requirements you submit through our contact forms.</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">3. Use of Information</h2>
                <p>We use the collected information to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide, maintain, and improve our products and services</li>
                  <li>Respond to your inquiries, comments, or questions</li>
                  <li>Send you technical notices, updates, and security alerts</li>
                  <li>Monitor and analyze website usage trends and preferences</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">4. Contact Us</h2>
                <p>If you have any questions about our Privacy Policy, please contact us:</p>
                <p>
                  <strong>Email:</strong> info@zexinmining.com<br />
                  <strong>Phone:</strong> +86 XXX XXXX XXXX<br />
                  <strong>Address:</strong> XX City, XX Province, China
                </p>
                
                <p className="mt-8">For more information about our services and products, please visit our <Link href="/" className="text-blue-600 hover:underline">homepage</Link>.</p>
              </>
            )}
          </div>
        </PageSection>
      </div>
    </main>
  );
} 