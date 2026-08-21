# capacitor-unity-ads

plugin per gestire ads unity

## Install

```bash
npm install capacitor-unity-ads
npx cap sync
```

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`loadRewardedVideo(...)`](#loadrewardedvideo)
* [`showRewardedVideo()`](#showrewardedvideo)
* [`isRewardedVideoLoaded()`](#isrewardedvideoloaded)
* [`loadInterstitial(...)`](#loadinterstitial)
* [`showInterstitial()`](#showinterstitial)
* [`isInterstitialLoaded()`](#isinterstitialloaded)
* [`setTestMode(...)`](#settestmode)
* [`getVersion()`](#getversion)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(options: { gameId: string; testMode?: boolean; }) => Promise<void>
```

Initialize Unity Ads SDK

| Param         | Type                                                 |
| ------------- | ---------------------------------------------------- |
| **`options`** | <code>{ gameId: string; testMode?: boolean; }</code> |

--------------------


### loadRewardedVideo(...)

```typescript
loadRewardedVideo(options: { placementId: string; }) => Promise<void>
```

Load a rewarded video ad

| Param         | Type                                  |
| ------------- | ------------------------------------- |
| **`options`** | <code>{ placementId: string; }</code> |

--------------------


### showRewardedVideo()

```typescript
showRewardedVideo() => Promise<{ success: boolean; reward?: RewardInfo; }>
```

Show a rewarded video ad

**Returns:** <code>Promise&lt;{ success: boolean; reward?: <a href="#rewardinfo">RewardInfo</a>; }&gt;</code>

--------------------


### isRewardedVideoLoaded()

```typescript
isRewardedVideoLoaded() => Promise<{ loaded: boolean; }>
```

Check if rewarded video ad is loaded

**Returns:** <code>Promise&lt;{ loaded: boolean; }&gt;</code>

--------------------


### loadInterstitial(...)

```typescript
loadInterstitial(options: { placementId: string; }) => Promise<void>
```

Load an interstitial ad

| Param         | Type                                  |
| ------------- | ------------------------------------- |
| **`options`** | <code>{ placementId: string; }</code> |

--------------------


### showInterstitial()

```typescript
showInterstitial() => Promise<{ success: boolean; }>
```

Show an interstitial ad

**Returns:** <code>Promise&lt;{ success: boolean; }&gt;</code>

--------------------


### isInterstitialLoaded()

```typescript
isInterstitialLoaded() => Promise<{ loaded: boolean; }>
```

Check if interstitial ad is loaded

**Returns:** <code>Promise&lt;{ loaded: boolean; }&gt;</code>

--------------------


### setTestMode(...)

```typescript
setTestMode(options: { enabled: boolean; }) => Promise<void>
```

Set test mode

| Param         | Type                               |
| ------------- | ---------------------------------- |
| **`options`** | <code>{ enabled: boolean; }</code> |

--------------------


### getVersion()

```typescript
getVersion() => Promise<{ version: string; }>
```

Get Unity Ads version

**Returns:** <code>Promise&lt;{ version: string; }&gt;</code>

--------------------


### Interfaces


#### RewardInfo

| Prop         | Type                |
| ------------ | ------------------- |
| **`type`**   | <code>string</code> |
| **`amount`** | <code>number</code> |

</docgen-api>
