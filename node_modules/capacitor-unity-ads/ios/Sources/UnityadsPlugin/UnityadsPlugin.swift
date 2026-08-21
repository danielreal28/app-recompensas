import Foundation
import Capacitor

/**
 * Unity Ads Capacitor Plugin for iOS
 */
@objc(UnityadsPlugin)
public class UnityadsPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "UnityadsPlugin"
    public let jsName = "Unityads"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initialize", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadRewardedVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showRewardedVideo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isRewardedVideoLoaded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showInterstitial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isInterstitialLoaded", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setTestMode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getVersion", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = Unityads()

    @objc func initialize(_ call: CAPPluginCall) {
        guard let gameId = call.getString("gameId") else {
            call.reject("Game ID is required")
            return
        }
        
        let testMode = call.getBool("testMode") ?? false
        
        implementation.initialize(gameId: gameId, testMode: testMode) { success, error in
            DispatchQueue.main.async {
                if success {
                    call.resolve()
                } else {
                    call.reject(error ?? "Initialization failed")
                }
            }
        }
    }
    
    @objc func loadRewardedVideo(_ call: CAPPluginCall) {
        guard let placementId = call.getString("placementId") else {
            call.reject("Placement ID is required")
            return
        }
        
        implementation.loadRewardedVideo(placementId: placementId) { success, error in
            DispatchQueue.main.async {
                if success {
                    call.resolve()
                } else {
                    call.reject(error ?? "Failed to load rewarded video")
                }
            }
        }
    }
    
    @objc func showRewardedVideo(_ call: CAPPluginCall) {
        implementation.showRewardedVideo { success, reward, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject(error)
                } else {
                    var result: [String: Any] = ["success": success]
                    if let reward = reward {
                        result["reward"] = reward
                    }
                    call.resolve(result)
                }
            }
        }
    }
    
    @objc func isRewardedVideoLoaded(_ call: CAPPluginCall) {
        let loaded = implementation.isRewardedVideoLoaded()
        call.resolve(["loaded": loaded])
    }
    
    @objc func loadInterstitial(_ call: CAPPluginCall) {
        guard let placementId = call.getString("placementId") else {
            call.reject("Placement ID is required")
            return
        }
        
        implementation.loadInterstitial(placementId: placementId) { success, error in
            DispatchQueue.main.async {
                if success {
                    call.resolve()
                } else {
                    call.reject(error ?? "Failed to load interstitial")
                }
            }
        }
    }
    
    @objc func showInterstitial(_ call: CAPPluginCall) {
        implementation.showInterstitial { success, error in
            DispatchQueue.main.async {
                if let error = error {
                    call.reject(error)
                } else {
                    call.resolve(["success": success])
                }
            }
        }
    }
    
    @objc func isInterstitialLoaded(_ call: CAPPluginCall) {
        let loaded = implementation.isInterstitialLoaded()
        call.resolve(["loaded": loaded])
    }
    
    @objc func setTestMode(_ call: CAPPluginCall) {
        let enabled = call.getBool("enabled") ?? false
        implementation.setTestMode(enabled: enabled)
        call.resolve()
    }
    
    @objc func getVersion(_ call: CAPPluginCall) {
        let version = implementation.getVersion()
        call.resolve(["version": version])
    }
}
