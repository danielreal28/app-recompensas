import Foundation
import UnityAds

@objc public class Unityads: NSObject {
    private var isInitialized = false
    private var testMode = false
    private var currentRewardedPlacementId: String?
    private var currentInterstitialPlacementId: String?
    private var rewardedVideoLoaded = false
    private var interstitialLoaded = false
    
    // Callback types
    typealias InitializationCallback = (Bool, String?) -> Void
    typealias AdLoadCallback = (Bool, String?) -> Void
    typealias RewardedVideoCallback = (Bool, [String: Any]?, String?) -> Void
    typealias InterstitialCallback = (Bool, String?) -> Void
    
    func initialize(gameId: String, testMode: Bool, callback: @escaping InitializationCallback) {
        print("[UnityAds] Initializing with Game ID: \(gameId)")
        
        self.testMode = testMode
        
        UnityAds.initialize(gameId, testMode: testMode) { [weak self] in
            print("[UnityAds] Initialized successfully")
            self?.isInitialized = true
            callback(true, nil)
        } errorHandler: { [weak self] error in
            print("[UnityAds] Initialization failed: \(error.localizedDescription)")
            callback(false, error.localizedDescription)
        }
    }
    
    func loadRewardedVideo(placementId: String, callback: @escaping AdLoadCallback) {
        guard isInitialized else {
            callback(false, "Unity Ads not initialized")
            return
        }
        
        print("[UnityAds] Loading rewarded video with placement ID: \(placementId)")
        
        currentRewardedPlacementId = placementId
        rewardedVideoLoaded = false
        
        UnityAds.load(placementId, loadDelegate: RewardedVideoLoadDelegate(callback: callback, parent: self))
    }
    
    func showRewardedVideo(callback: @escaping RewardedVideoCallback) {
        guard isInitialized else {
            callback(false, nil, "Unity Ads not initialized")
            return
        }
        
        guard let placementId = currentRewardedPlacementId, rewardedVideoLoaded else {
            callback(false, nil, "Rewarded video not loaded")
            return
        }
        
        print("[UnityAds] Showing rewarded video")
        
        UnityAds.show(UIApplication.shared.windows.first?.rootViewController, placementId: placementId, showDelegate: RewardedVideoShowDelegate(callback: callback, parent: self))
    }
    
    func isRewardedVideoLoaded() -> Bool {
        return rewardedVideoLoaded && currentRewardedPlacementId != nil
    }
    
    func loadInterstitial(placementId: String, callback: @escaping AdLoadCallback) {
        guard isInitialized else {
            callback(false, "Unity Ads not initialized")
            return
        }
        
        print("[UnityAds] Loading interstitial with placement ID: \(placementId)")
        
        currentInterstitialPlacementId = placementId
        interstitialLoaded = false
        
        UnityAds.load(placementId, loadDelegate: InterstitialLoadDelegate(callback: callback, parent: self))
    }
    
    func showInterstitial(callback: @escaping InterstitialCallback) {
        guard isInitialized else {
            callback(false, "Unity Ads not initialized")
            return
        }
        
        guard let placementId = currentInterstitialPlacementId, interstitialLoaded else {
            callback(false, "Interstitial not loaded")
            return
        }
        
        print("[UnityAds] Showing interstitial")
        
        UnityAds.show(UIApplication.shared.windows.first?.rootViewController, placementId: placementId, showDelegate: InterstitialShowDelegate(callback: callback, parent: self))
    }
    
    func isInterstitialLoaded() -> Bool {
        return interstitialLoaded && currentInterstitialPlacementId != nil
    }
    
    func setTestMode(enabled: Bool) {
        print("[UnityAds] Setting test mode: \(enabled)")
        self.testMode = enabled
        // Unity Ads test mode is set during initialization
    }
    
    func getVersion() -> String {
        return UnityAds.getVersion() ?? "unknown"
    }
}

// MARK: - Load Delegates

class RewardedVideoLoadDelegate: NSObject, UnityAdsLoadDelegate {
    private let callback: Unityads.AdLoadCallback
    private weak var parent: Unityads?
    
    init(callback: @escaping Unityads.AdLoadCallback, parent: Unityads) {
        self.callback = callback
        self.parent = parent
    }
    
    func unityAdsAdLoaded(_ placementId: String) {
        print("[UnityAds] Rewarded video loaded successfully")
        parent?.rewardedVideoLoaded = true
        callback(true, nil)
    }
    
    func unityAdsAdFailedToLoad(_ placementId: String, withError error: UnityAdsLoadError, withMessage message: String) {
        print("[UnityAds] Rewarded video failed to load: \(message)")
        parent?.rewardedVideoLoaded = false
        callback(false, "Failed to load rewarded video: \(message)")
    }
}

class InterstitialLoadDelegate: NSObject, UnityAdsLoadDelegate {
    private let callback: Unityads.AdLoadCallback
    private weak var parent: Unityads?
    
    init(callback: @escaping Unityads.AdLoadCallback, parent: Unityads) {
        self.callback = callback
        self.parent = parent
    }
    
    func unityAdsAdLoaded(_ placementId: String) {
        print("[UnityAds] Interstitial loaded successfully")
        parent?.interstitialLoaded = true
        callback(true, nil)
    }
    
    func unityAdsAdFailedToLoad(_ placementId: String, withError error: UnityAdsLoadError, withMessage message: String) {
        print("[UnityAds] Interstitial failed to load: \(message)")
        parent?.interstitialLoaded = false
        callback(false, "Failed to load interstitial: \(message)")
    }
}

// MARK: - Show Delegates

class RewardedVideoShowDelegate: NSObject, UnityAdsShowDelegate {
    private let callback: Unityads.RewardedVideoCallback
    private weak var parent: Unityads?
    
    init(callback: @escaping Unityads.RewardedVideoCallback, parent: Unityads) {
        self.callback = callback
        self.parent = parent
    }
    
    func unityAdsShowStart(_ placementId: String) {
        print("[UnityAds] Rewarded video show started")
    }
    
    func unityAdsShowClick(_ placementId: String) {
        print("[UnityAds] Rewarded video clicked")
    }
    
    func unityAdsShowComplete(_ placementId: String, withFinishState state: UnityAdsShowCompletionState) {
        print("[UnityAds] Rewarded video show completed with state: \(state.rawValue)")
        
        parent?.rewardedVideoLoaded = false // Reset loaded state
        
        if state == .completed {
            // User watched the full video, give reward
            let reward = ["type": "coins", "amount": 1] as [String : Any]
            callback(true, reward, nil)
        } else {
            // User skipped or ad was not completed
            callback(false, nil, nil)
        }
    }
    
    func unityAdsShowFailed(_ placementId: String, withError error: UnityAdsShowError, withMessage message: String) {
        print("[UnityAds] Rewarded video show failed: \(message)")
        parent?.rewardedVideoLoaded = false
        callback(false, nil, "Failed to show rewarded video: \(message)")
    }
}

class InterstitialShowDelegate: NSObject, UnityAdsShowDelegate {
    private let callback: Unityads.InterstitialCallback
    private weak var parent: Unityads?
    
    init(callback: @escaping Unityads.InterstitialCallback, parent: Unityads) {
        self.callback = callback
        self.parent = parent
    }
    
    func unityAdsShowStart(_ placementId: String) {
        print("[UnityAds] Interstitial show started")
        callback(true, nil)
    }
    
    func unityAdsShowClick(_ placementId: String) {
        print("[UnityAds] Interstitial clicked")
    }
    
    func unityAdsShowComplete(_ placementId: String, withFinishState state: UnityAdsShowCompletionState) {
        print("[UnityAds] Interstitial show completed")
        parent?.interstitialLoaded = false // Reset loaded state
    }
    
    func unityAdsShowFailed(_ placementId: String, withError error: UnityAdsShowError, withMessage message: String) {
        print("[UnityAds] Interstitial show failed: \(message)")
        parent?.interstitialLoaded = false
        callback(false, "Failed to show interstitial: \(message)")
    }
}
