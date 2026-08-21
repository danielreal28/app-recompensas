package com.recompensas.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;

public class MainActivity extends BridgeActivity {

    private static final String GAME_ID = "800359230";
    private static final boolean TEST_MODE = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UnityAdsBridge.class);
        super.onCreate(savedInstanceState);

        UnityAds.initialize(getApplicationContext(), GAME_ID, TEST_MODE, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {
                android.util.Log.d("UnityAds", "SDK Inicializado");
            }

            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
                android.util.Log.e("UnityAds", "Error SDK: " + message);
            }
        });
    }
}

@CapacitorPlugin(name = "UnityAdsNative")
class UnityAdsBridge extends Plugin {

    @PluginMethod
    public void showRewardVideo(PluginCall call) {
        String placementId = call.getString("placementId", "Rewarded_Android");

        getActivity().runOnUiThread(() -> {
            UnityAds.load(placementId, new IUnityAdsLoadListener() {
                @Override
                public void onUnityAdsAdLoaded(String placementId) {
                    UnityAds.show(getActivity(), placementId, new IUnityAdsShowListener() {
                        @Override
                        public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                            JSObject ret = new JSObject();
                            ret.put("completed", state == UnityAds.UnityAdsShowCompletionState.COMPLETED);
                            call.resolve(ret);
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
                    call.reject("Error al cargar: " + message);
                }
            });
        });
    }
}
