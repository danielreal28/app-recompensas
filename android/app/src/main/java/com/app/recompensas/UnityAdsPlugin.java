package com.app.recompensas;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;

@CapacitorPlugin(name = "UnityAdsNative")
public class UnityAdsPlugin extends Plugin {

    @PluginMethod
    public void showRewardVideo(PluginCall call) {
        String placementId = call.getString("placementId", "Rewarded_Android");

        getActivity().runOnUiThread(() -> {
            // 1. Cargar el anuncio en memoria
            UnityAds.load(placementId, new IUnityAdsLoadListener() {
                @Override
                public void onUnityAdsAdLoaded(String placementId) {
                    // 2. Una vez cargado, reproducirlo
                    UnityAds.show(getActivity(), placementId, new IUnityAdsShowListener() {
                        @Override
                        public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                            call.resolve();
                        }

                        @Override
                        public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                            call.reject("Error al mostrar: " + message);
                        }

                        @Override
                        public void onUnityAdsShowStart(String placementId) {}

                        @Override
                        public void onUnityAdsShowClick(String placementId) {}
                    });
                }

                @Override
                public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                    call.reject("Error al cargar anuncio: " + message);
                }
            });
        });
    }
}
