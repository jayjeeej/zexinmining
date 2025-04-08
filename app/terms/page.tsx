import React from 'react';
import { Metadata } from 'next';
import PageSection from '@/app/components/PageSection';

export const metadata: Metadata = {
  title: '服务条款 | 泽鑫矿山设备',
  description: '泽鑫矿山设备的服务条款和使用条件',
  alternates: {
    canonical: 'https://www.zexinmine.com/terms',
    languages: {
      'en-US': 'https://www.zexinmine.com/en/terms',
      'zh-CN': 'https://www.zexinmine.com/terms',
    },
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <PageSection
        noPadding
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            {
              label: { zh: "服务条款", en: "Terms of Service" }
            }
          ]
        }}
      >
        <div className="relative py-16 px-6 md:px-8 flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-normal text-[#333333] mb-6">
              服务条款
            </h1>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2>1. 接受条款</h2>
          <p>
            欢迎访问泽鑫矿山设备有限公司网站。通过访问或使用我们的网站，您同意遵守这些服务条款。如果您不同意这些条款，请不要使用本网站。
          </p>

          <h2>2. 内容使用</h2>
          <p>
            本网站上的所有内容，包括但不限于文本、图像、图形、徽标、按钮图标、软件和音频片段，均为泽鑫矿山设备有限公司或其内容提供商的财产，受中国和国际版权法保护。未经明确书面许可，不得复制、分发、修改或重新发布我们网站上的任何内容。
          </p>

          <h2>3. 产品信息</h2>
          <p>
            我们努力确保网站上的产品信息准确和最新。然而，我们不保证所有信息的完全准确性。实际产品可能与图片有所不同，规格和价格可能变更，恕不另行通知。
          </p>

          <h2>4. 责任限制</h2>
          <p>
            在任何情况下，泽鑫矿山设备有限公司及其员工、高管、董事和代理人均不对因使用或无法使用本网站或其内容而导致的任何直接、间接、附带、特殊或后果性损害承担责任。
          </p>

          <h2>5. 隐私政策</h2>
          <p>
            我们重视您的隐私。请参阅我们的隐私政策，了解有关我们如何收集、使用和保护您个人信息的详细信息。
          </p>

          <h2>6. 适用法律</h2>
          <p>
            这些服务条款受中华人民共和国法律管辖，并按照这些法律进行解释，不考虑法律冲突原则。
          </p>

          <h2>7. 条款修改</h2>
          <p>
            我们保留随时修改这些服务条款的权利。继续使用本网站即表示您接受任何此类修改。我们建议您定期查看这些条款以了解任何更新。
          </p>

          <p className="text-sm text-gray-500 mt-10">
            最后更新日期：2025年4月5日
          </p>
        </div>
      </PageSection>
    </div>
  );
} 