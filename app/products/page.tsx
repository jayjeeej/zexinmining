'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../contexts/LanguageContext";
import PageSection from "../components/PageSection";

export default function ProductsPage() {
  const { language, isZh } = useLanguage();
  
  // 产品类别数据
  const productCategories = [
    {
      id: "stationary-crushers",
      nameZh: "固定式破碎机",
      nameEn: "Stationary crushers",
      descriptionZh: "高效率的矿石破碎设备，包括颚式破碎机、圆锥破碎机等，适用于各种硬度矿石。",
      descriptionEn: "High-efficiency ore crushing equipment, including jaw crushers, cone crushers, suitable for various hardness ores.",
      image: "/images/products/stationary-crushers.jpg"
    },
    {
      id: "vibrating-screens",
      nameZh: "固定式振动筛",
      nameEn: "Stationary vibrating screens",
      descriptionZh: "高精度筛分设备，用于矿石的分级和分选，确保后续加工的粒度要求。",
      descriptionEn: "High-precision screening equipment for ore classification and sorting, ensuring particle size requirements for subsequent processing.",
      image: "/images/products/vibrating-screens.jpg"
    },
    {
      id: "washing-equipment",
      nameZh: "洗矿设备",
      nameEn: "Ore washing equipment",
      descriptionZh: "用于去除矿石表面粘附的泥质和杂质，提高后续选矿工艺的效率。",
      descriptionEn: "Used to remove clay and impurities adhering to the surface of ore to improve the efficiency of subsequent beneficiation processes.",
      image: "/images/products/washing-equipment.jpg"
    },
    {
      id: "feeding-equipment",
      nameZh: "给料设备",
      nameEn: "Feeding equipment",
      descriptionZh: "均匀稳定地向生产线输送物料，包括振动给料机、板式给料机等。",
      descriptionEn: "Evenly and steadily feed materials to the production line, including vibrating feeders, plate feeders, etc.",
      image: "/images/products/feeding-equipment.jpg"
    },
    {
      id: "grinding-equipment",
      nameZh: "研磨设备",
      nameEn: "Grinding equipment",
      descriptionZh: "用于物料细磨和超细磨的设备，包括球磨机、棒磨机等，提高后续选矿回收率。",
      descriptionEn: "Equipment for fine and ultra-fine grinding of materials, including ball mills and rod mills, improving subsequent beneficiation recovery rate.",
      image: "/images/products/grinding-equipment.jpg"
    },
    {
      id: "classification-equipment",
      nameZh: "分级设备",
      nameEn: "Classification equipment",
      descriptionZh: "用于矿石颗粒分级处理的设备，提高选矿效率和精度，包括旋流器和分级机。",
      descriptionEn: "Equipment for ore particle classification, improving beneficiation efficiency and precision, including hydrocyclones and classifiers.",
      image: "/images/products/classification-equipment.jpg"
    },
    {
      id: "tailings",
      nameZh: "尾矿处理",
      nameEn: "Tailings Management",
      descriptionZh: "尾矿浓缩、过滤、干排及尾矿库建设等设备与技术。",
      descriptionEn: "Tailings thickening, filtration, dry stacking and tailings dam construction equipment and technology.",
      image: "/images/products/tailings.jpg"
    }
  ];
  
  return (
    <main className="min-h-screen">
      {/* 添加顶部空间，避免固定导航栏遮挡 */}
      <div className="h-0 md:h-0 lg:h-0 xl:h-0"></div>
      
      {/* 页面标题区域 */}
      <PageSection 
        noPadding 
        variant="hero"
        isHero={true}
        breadcrumb={{
          items: [
            {
              label: { zh: "产品中心", en: "Products" }
            }
          ]
        }}
      >
        <div className="relative py-16 px-6 md:px-8 flex items-center min-h-[300px]">
          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between w-full">
              <div className="md:w-1/2 pl-0">
                <h1 className="text-6xl md:text-7xl font-normal text-[#333333] mb-6 text-left">
                  {isZh ? "产品中心" : "Products"}
                </h1>
              </div>
              <div className="md:w-1/2 pr-0">
                <div className="space-y-4 text-black text-left">
                  <p className="text-black max-w-3xl mx-auto">
                    {isZh 
                      ? "泽鑫矿山设备提供全面的矿石加工解决方案，从原矿预处理到精矿生产的全流程设备与工艺技术。" 
                      : "Zexin Mining Equipment provides comprehensive ore processing solutions, from raw ore preprocessing to concentrate production with full-process equipment and technology."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      {/* 产品类别 */}
      <PageSection variant="gray">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "预处理设备" : "Preprocessing Equipment"}
          </h2>
          <p className="text-lg text-black max-w-3xl">
            {isZh
              ? "我们提供从矿石预处理到尾矿处理的全系列矿业装备，满足不同矿种和工艺需求。"
              : "We provide a full range of mining equipment from ore preprocessing to tailings treatment, meeting the needs of different minerals and processes."}
          </p>
        </div>

        {/* 产品类别列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.id}`}
              className="bg-white rounded-sm overflow-hidden shadow-md transition-all hover:shadow-lg group relative"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={isZh ? category.nameZh : category.nameEn}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 pb-12">
                <h3 className="text-2xl font-bold text-[#333333] mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all">
                  {isZh ? category.nameZh : category.nameEn}
                </h3>
                <p className="text-black mb-4">
                  {isZh ? category.descriptionZh : category.descriptionEn}
                </p>
              </div>
              <div className="absolute bottom-6 right-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>

      {/* 重选设备 */}
      <PageSection variant="white">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "重选设备" : "Gravity Separation Equipment"}
          </h2>
          <p className="text-lg text-black max-w-3xl">
            {isZh
              ? "我们提供全系列的重力选矿设备，适用于金、锡、钨、钽铌等多种矿种的高效分选。"
              : "We provide a comprehensive range of gravity separation equipment for efficient separation of gold, tin, tungsten, tantalum-niobium and other minerals."}
          </p>
        </div>

        {/* 产品列表 - 重选设备 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link
            href="/products/gravity-separation"
            className="bg-white rounded-sm overflow-hidden shadow-md transition-all hover:shadow-lg group relative"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/products/gravity-separation.jpg"
                alt={isZh ? "重选设备" : "Gravity Separation Equipment"}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 pb-12">
              <h3 className="text-2xl font-bold text-[#333333] mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all">
                {isZh ? "重选设备" : "Gravity Separation Equipment"}
              </h3>
              <p className="text-black">
                {isZh 
                  ? "采用先进的跳汰技术，适用于金、锡、钨等重选矿物的高效分选。" 
                  : "Using advanced jigging technology for efficient separation of gold, tin, tungsten and other gravity-concentrated minerals."}
              </p>
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/products/flotation"
            className="bg-white rounded-sm overflow-hidden shadow-md transition-all hover:shadow-lg group relative"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/products/flotation.jpg"
                alt={isZh ? "浮选设备" : "Flotation Equipment"}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 pb-12">
              <h3 className="text-2xl font-bold text-[#333333] mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all">
                {isZh ? "浮选设备" : "Flotation Equipment"}
              </h3>
              <p className="text-black">
                {isZh 
                  ? "先进的浮选技术，适用于有色金属、贵金属等多种矿物的分选。" 
                  : "Advanced flotation technology for separation of non-ferrous metals, precious metals and other minerals."}
              </p>
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/products/magnetic-separation"
            className="bg-white rounded-sm overflow-hidden shadow-md transition-all hover:shadow-lg group relative"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src="/images/products/magnetic-separation.jpg"
                alt={isZh ? "磁选设备" : "Magnetic Separation Equipment"}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 pb-12">
              <h3 className="text-2xl font-bold text-[#333333] mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all">
                {isZh ? "磁选设备" : "Magnetic Separation Equipment"}
              </h3>
              <p className="text-black">
                {isZh 
                  ? "高效磁选设备，适用于铁矿、锰矿等磁性矿物的分选。" 
                  : "High-efficiency magnetic separation equipment for iron ore, manganese ore and other magnetic minerals."}
              </p>
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-400 transition-colors">
                <svg
                  className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </PageSection>

      {/* 服务支持 */}
      <PageSection variant="gray">
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold text-[#333333] mb-6">
            {isZh ? "服务支持" : "Service Support"}
          </h2>
          <p className="text-lg text-black max-w-3xl">
            {isZh
              ? "我们提供全面的售前、售中和售后服务，确保客户的选矿项目顺利进行。"
              : "We provide comprehensive pre-sales, during-sales, and after-sales services to ensure the smooth operation of customers' mineral processing projects."}
          </p>
        </div>
        
        {/* 服务列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black p-8 rounded-none shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-white pb-2 border-b border-white h-[60px] flex items-end">
              {isZh ? "技术咨询与设计" : "Technical Consultation & Design"}
            </h3>
            <p className="text-gray-300">
              {isZh
                ? "提供矿石加工方案设计、流程优化和工厂布局规划，确保最佳工艺流程和设备选型。"
                : "Provide ore processing solution design, process optimization, and plant layout planning to ensure the best process flow and equipment selection."}
            </p>
          </div>
          
          <div className="bg-[#A08C64] p-8 rounded-none shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-white pb-2 border-b border-black h-[60px] flex items-end">
              {isZh ? "设备安装与调试" : "Equipment Installation & Commissioning"}
            </h3>
            <p className="text-gray-100">
              {isZh
                ? "专业团队提供设备安装、调试和试运行服务，确保设备性能达到设计要求。"
                : "Professional team provides equipment installation, commissioning, and trial operation services to ensure equipment performance meets design requirements."}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-none shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-3 text-[#333333] pb-2 border-b border-[#A08C64] h-[60px] flex items-end">
              {isZh ? "备品备件与维修" : "Spare Parts & Maintenance"}
            </h3>
            <p className="text-black">
              {isZh
                ? "提供原厂备品备件和专业维修服务，确保设备长期稳定运行，减少停机时间。"
                : "Provide original spare parts and professional maintenance services to ensure long-term stable operation of equipment and reduce downtime."}
            </p>
          </div>
        </div>
      </PageSection>
    </main>
  );
} 