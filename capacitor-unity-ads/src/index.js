import { registerPlugin } from '@capacitor/core';

const UnityAdsNative = registerPlugin('UnityAdsNative');

export * from './definitions';
export { UnityAdsNative };
