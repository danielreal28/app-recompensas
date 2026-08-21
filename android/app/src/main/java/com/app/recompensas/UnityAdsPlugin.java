package com.app.recompensas;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.IUnityAdsShowListener;

@CapacitorPlugin(name = "UnityAdsNative")
public class UnityAdsPlugin extends Plugin {

    @PluginMethod
    public void showRewardVideo(PluginCall call) {
        String placementId = call.getString("placementId", "Rewarded_Android");

        getActivity().runOnUiThread(() -> {
            UnityAds.show(getActivity(), placementId, new IUnityAdsShowListener() {
                @Override
                public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                    call.resolve();
                }

                @Override
                public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                    call.reject("Error Unity Ads: " + message);
                }

                @Override
                public void onUnityAdsShowStart(String placementId) {}

                @Override
                public void onUnityAdsShowClick(String placementId) {}
            });
        });
    }
}
