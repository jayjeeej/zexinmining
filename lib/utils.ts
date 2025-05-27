/**
 * 安全处理动态路由参数，确保在使用前先等待参数
 * 解决 "params should be awaited before using its properties" 错误
 * @param params 路由参数对象
 * @returns 处理后的参数对象
 */
export async function safelyGetRouteParams<T>(params: T): Promise<T> {
  return await Promise.resolve(params);
} 