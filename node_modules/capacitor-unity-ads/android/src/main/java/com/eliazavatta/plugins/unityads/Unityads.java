package com.eliazavatta.plugins.unityads;

import android.content.Context;
import android.util.Log;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

public class Unityads {

    private static final String TAG = "UnityAds";

    private boolean isInitialized = false;
    private boolean testMode = false;
    private String currentRewardedPlacementId;
    private String currentInterstitialPlacementId;
    private boolean rewardedVideoLoaded = false;
    private boolean interstitialLoaded = false;

    // Callback interfaces
    public interface InitializationCallback {
        void onSuccess();
        void onError(String error);
    }

    public interface AdLoadCallback {
        void onAdLoaded();
        void onError(String error);
    }

    public interface RewardedVideoCallback {
        void onAdShown();
        void onRewardEarned(String rewardType, int rewardAmount);
        void onAdClosed();
        void onError(String error);
    }

    public interface InterstitialCallback {
        void onAdShown();
        void onAdClosed();
        void onError(String error);
    }

    public void initialize(Context context, String gameId, boolean testMode, InitializationCallback callback) {
        try {
            Log.d(TAG, "Initializing Unity Ads with Game ID: " + gameId);

            this.testMode = testMode;

            IUnityAdsInitializationListener initializationListener = new IUnityAdsInitializationListener() {
                @Override
                public void onInitializationComplete() {
                    Log.d(TAG, "Unity Ads initialized successfully");
                    isInitialized = true;
                    callback.onSuccess();
                }

                @Override
                public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
                    Log.e(TAG, "Unity Ads initialization failed: " + message);
                    callback.onError("Initialization failed: " + message);
                }
            };

            // Initialize Unity Ads
            UnityAds.initialize(context, gameId, testMode, initializationListener);
        } catch (Exception e) {
            Log.e(TAG, "Failed to initialize Unity Ads", e);
            callback.onError("Initialization failed: " + e.getMessage());
        }
    }

    public void loadRewardedVideo(String placementId, AdLoadCallback callback) {
        if (!isInitialized) {
            callback.onError("Unity Ads not initialized");
            return;
        }

        try {
            Log.d(TAG, "Loading rewarded video with placement ID: " + placementId);

            currentRewardedPlacementId = placementId;
            rewardedVideoLoaded = false;

            IUnityAdsLoadListener loadListener = new IUnityAdsLoadListener() {
                @Override
                public void onUnityAdsAdLoaded(String placementId) {
                    Log.d(TAG, "Rewarded video loaded successfully");
                    rewardedVideoLoaded = true;
                    callback.onAdLoaded();
                }

                @Override
                public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                    Log.e(TAG, "Rewarded video failed to load: " + message);
                    rewardedVideoLoaded = false;
                    callback.onError("Failed to load rewarded video: " + message);
                }
            };

            UnityAds.load(placementId, loadListener);
        } catch (Exception e) {
            Log.e(TAG, "Error loading rewarded video", e);
            callback.onError("Error loading rewarded video: " + e.getMessage());
        }
    }

    public void showRewardedVideo(android.app.Activity activity, RewardedVideoCallback callback) {
        if (!isInitialized) {
            callback.onError("Unity Ads not initialized");
            return;
        }

        if (currentRewardedPlacementId == null || !rewardedVideoLoaded) {
            callback.onError("Rewarded video not loaded");
            return;
        }

        try {
            Log.d(TAG, "Showing rewarded video");

            IUnityAdsShowListener showListener = new IUnityAdsShowListener() {
                @Override
                public void onUnityAdsShowStart(String placementId) {
                    Log.d(TAG, "Rewarded video show started");
                    callback.onAdShown();
                }

                @Override
                public void onUnityAdsShowClick(String placementId) {
                    Log.d(TAG, "Rewarded video clicked");
                }

                @Override
                public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                    Log.d(TAG, "Rewarded video show completed with state: " + state);

                    if (state == UnityAds.UnityAdsShowCompletionState.COMPLETED) {
                        // User watched the full video, give reward
                        callback.onRewardEarned("coins", 1);
                    } else {
                        // User skipped or ad was not completed
                        callback.onAdClosed();
                    }

                    rewardedVideoLoaded = false; // Reset loaded state
                }

                @Override
                public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                    Log.e(TAG, "Rewarded video show failed: " + message);
                    callback.onError("Failed to show rewarded video: " + message);
                    rewardedVideoLoaded = false;
                }
            };

            UnityAds.show(activity, currentRewardedPlacementId, new UnityAdsShowOptions(), showListener);
        } catch (Exception e) {
            Log.e(TAG, "Error showing rewarded video", e);
            callback.onError("Error showing rewarded video: " + e.getMessage());
        }
    }

    public boolean isRewardedVideoLoaded() {
        return rewardedVideoLoaded && currentRewardedPlacementId != null;
    }

    public void loadInterstitial(String placementId, AdLoadCallback callback) {
        if (!isInitialized) {
            callback.onError("Unity Ads not initialized");
            return;
        }

        try {
            Log.d(TAG, "Loading interstitial with placement ID: " + placementId);

            currentInterstitialPlacementId = placementId;
            interstitialLoaded = false;

            IUnityAdsLoadListener loadListener = new IUnityAdsLoadListener() {
                @Override
                public void onUnityAdsAdLoaded(String placementId) {
                    Log.d(TAG, "Interstitial loaded successfully");
                    interstitialLoaded = true;
                    callback.onAdLoaded();
                }

                @Override
                public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                    Log.e(TAG, "Interstitial failed to load: " + message);
                    interstitialLoaded = false;
                    callback.onError("Failed to load interstitial: " + message);
                }
            };

            UnityAds.load(placementId, loadListener);
        } catch (Exception e) {
            Log.e(TAG, "Error loading interstitial", e);
            callback.onError("Error loading interstitial: " + e.getMessage());
        }
    }

    public void showInterstitial(android.app.Activity activity, InterstitialCallback callback) {
        if (!isInitialized) {
            callback.onError("Unity Ads not initialized");
            return;
        }

        if (currentInterstitialPlacementId == null || !interstitialLoaded) {
            callback.onError("Interstitial not loaded");
            return;
        }

        try {
            Log.d(TAG, "Showing interstitial");

            IUnityAdsShowListener showListener = new IUnityAdsShowListener() {
                @Override
                public void onUnityAdsShowStart(String placementId) {
                    Log.d(TAG, "Interstitial show started");
                    callback.onAdShown();
                }

                @Override
                public void onUnityAdsShowClick(String placementId) {
                    Log.d(TAG, "Interstitial clicked");
                }

                @Override
                public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                    Log.d(TAG, "Interstitial show completed");
                    callback.onAdClosed();
                    interstitialLoaded = false; // Reset loaded state
                }

                @Override
                public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                    Log.e(TAG, "Interstitial show failed: " + message);
                    callback.onError("Failed to show interstitial: " + message);
                    interstitialLoaded = false;
                }
            };

            UnityAds.show(activity, currentInterstitialPlacementId, new UnityAdsShowOptions(), showListener);
        } catch (Exception e) {
            Log.e(TAG, "Error showing interstitial", e);
            callback.onError("Error showing interstitial: " + e.getMessage());
        }
    }

    public boolean isInterstitialLoaded() {
        return interstitialLoaded && currentInterstitialPlacementId != null;
    }

    public void setTestMode(boolean enabled) {
        Log.d(TAG, "Setting test mode: " + enabled);
        this.testMode = enabled;
        // Unity Ads test mode is set during initialization
    }

    public String getVersion() {
        try {
            return UnityAds.getVersion();
        } catch (Exception e) {
            Log.e(TAG, "Error getting Unity Ads version", e);
            return "unknown";
        }
    }
}
