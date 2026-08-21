package com.recompensas.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.IUnityAdsInitializationListener;

public class MainActivity extends BridgeActivity {

    private static final String GAME_ID = "800359230";
    private static final boolean TEST_MODE = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        UnityAds.initialize(getApplicationContext(), GAME_ID, TEST_MODE, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {}

            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {}
        });
    }
}
