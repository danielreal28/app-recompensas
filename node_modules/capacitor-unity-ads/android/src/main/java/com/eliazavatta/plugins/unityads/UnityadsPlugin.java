package com.eliazavatta.plugins.unityads;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Unityads")
public class UnityadsPlugin extends Plugin {

    private Unityads implementation = new Unityads();

    @PluginMethod
    public void initialize(PluginCall call) {
        String gameId = call.getString("gameId");
        Boolean testMode = call.getBoolean("testMode", false);

        if (gameId == null) {
            call.reject("Game ID is required");
            return;
        }

        implementation.initialize(
            getContext(),
            gameId,
            testMode,
            new Unityads.InitializationCallback() {
                @Override
                public void onSuccess() {
                    call.resolve();
                }

                @Override
                public void onError(String error) {
                    call.reject(error);
                }
            }
        );
    }

    @PluginMethod
    public void loadRewardedVideo(PluginCall call) {
        String placementId = call.getString("placementId");

        if (placementId == null) {
            call.reject("Placement ID is required");
            return;
        }

        implementation.loadRewardedVideo(
            placementId,
            new Unityads.AdLoadCallback() {
                @Override
                public void onAdLoaded() {
                    call.resolve();
                }

                @Override
                public void onError(String error) {
                    call.reject(error);
                }
            }
        );
    }

    @PluginMethod
    public void showRewardedVideo(PluginCall call) {
        implementation.showRewardedVideo(
            getActivity(),
            new Unityads.RewardedVideoCallback() {
                @Override
                public void onAdShown() {
                    // Ad shown successfully
                }

                @Override
                public void onRewardEarned(String rewardType, int rewardAmount) {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    JSObject reward = new JSObject();
                    reward.put("type", rewardType);
                    reward.put("amount", rewardAmount);
                    ret.put("reward", reward);
                    call.resolve(ret);
                }

                @Override
                public void onAdClosed() {
                    // Ad closed without reward
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    call.resolve(ret);
                }

                @Override
                public void onError(String error) {
                    call.reject(error);
                }
            }
        );
    }

    @PluginMethod
    public void isRewardedVideoLoaded(PluginCall call) {
        boolean loaded = implementation.isRewardedVideoLoaded();
        JSObject ret = new JSObject();
        ret.put("loaded", loaded);
        call.resolve(ret);
    }

    @PluginMethod
    public void loadInterstitial(PluginCall call) {
        String placementId = call.getString("placementId");

        if (placementId == null) {
            call.reject("Placement ID is required");
            return;
        }

        implementation.loadInterstitial(
            placementId,
            new Unityads.AdLoadCallback() {
                @Override
                public void onAdLoaded() {
                    call.resolve();
                }

                @Override
                public void onError(String error) {
                    call.reject(error);
                }
            }
        );
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        implementation.showInterstitial(
            getActivity(),
            new Unityads.InterstitialCallback() {
                @Override
                public void onAdShown() {
                    JSObject ret = new JSObject();
                    ret.put("success", true);
                    call.resolve(ret);
                }

                @Override
                public void onAdClosed() {
                    // Ad closed
                }

                @Override
                public void onError(String error) {
                    call.reject(error);
                }
            }
        );
    }

    @PluginMethod
    public void isInterstitialLoaded(PluginCall call) {
        boolean loaded = implementation.isInterstitialLoaded();
        JSObject ret = new JSObject();
        ret.put("loaded", loaded);
        call.resolve(ret);
    }

    @PluginMethod
    public void setTestMode(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled", false);
        implementation.setTestMode(enabled);
        call.resolve();
    }

    @PluginMethod
    public void getVersion(PluginCall call) {
        String version = implementation.getVersion();
        JSObject ret = new JSObject();
        ret.put("version", version);
        call.resolve(ret);
    }
}
