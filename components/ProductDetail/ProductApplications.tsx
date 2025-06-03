'use client';

import React, { useState } from 'react';
import OptimizedImage from '../layouts/OptimizedImage';

// 定义应用项接口
interface ApplicationItem {
  icon?: string; // 保留icon字段但设为可选
  title: string;
  description: string;
}

interface ProductApplicationsProps {
  applications: ApplicationItem[];
  locale: string;
  applicationsImage?: string; // 保留这个字段但设为可选
}

const ProductApplications: React.FC<ProductApplicationsProps> = ({ applications, locale, applicationsImage }) => {
  const [showZoom, setShowZoom] = useState(false);
  
  if (!applications || applications.length === 0) return null;
  
  const isZh = locale === 'zh';

  return (
    <>
      <section id="applications" className="mb-16 lg:mb-32 scroll-mt-32">
        <div className="contain">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧标题 */}
            <div className="lg:w-1/3">
              <h2 className="text-3xl lg:text-4xl mb-4 font-headline">{isZh ? '应用领域' : 'Applications'}</h2>
              {/* 工艺流程图 */}
              {applicationsImage && (
                <div className="mt-4">
                  <div 
                    className="cursor-pointer flow-chart-container" 
                    onClick={() => setShowZoom(true)}
                  >
                    <OptimizedImage 
                      src={applicationsImage}
                      alt={isZh ? "工艺流程图" : "Process Flow Diagram"}
                      width={400}
                      height={500}
                      className="w-[400px] h-[500px] object-contain shadow-lg rounded bg-[#f8f8f8]"
                      quality={90}
                      unoptimized={true}
                  />
                  </div>
                </div>
              )}
            </div>
            
            {/* 右侧文本框列表 */}
            <div className="lg:w-2/3">
              <div className="flex flex-col gap-4">
                {applications.map((app, index) => (
                  <div key={index} className="bg-[#f8f8f8] text-black p-6">
                    <h3 className="text-xl font-medium mb-3 font-headline">{app.title}</h3>
                    <p className="text-gray-800 font-text">{app.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 放大图片的遮罩层 */}
      {showZoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowZoom(false)}
        >
          <OptimizedImage 
            src={applicationsImage!}
            alt={isZh ? "工艺流程图" : "Process Flow Diagram"}
            width={1200}
            height={1500}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            quality={100}
            unoptimized={true}
            style={{ pointerEvents: 'none' }}
          />
        </div>
      )}
    </>
  );
};

export default ProductApplications; 