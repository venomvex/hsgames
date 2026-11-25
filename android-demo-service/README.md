# HSGames — Zero-Cost Android Demo Strategy & Technical Audit

## Executive Summary

To achieve **100% zero ongoing infrastructure costs**, HSGames eliminates reliance on third-party cloud emulator streaming services (such as Appetize.io which charges up to $100+/month after 100 minutes) and self-hosted KVM server hardware that requires costly cloud GPU/Linux instances.

Instead, HSGames provides a **dual zero-cost demonstration pipeline**:
1. **Interactive In-Browser Gameplay Simulation**: Recreates the exact 38-second betting & spinning loop inside the web page using the game's actual 34 HD visual assets and native SoundPool audio effects (`chip_place.wav`). Runs entirely client-side on Cloudflare Pages free tier with **unlimited visitors and zero hosting costs**.
2. **Direct Standalone Demo APK Distribution**: Pre-compiled standalone demo APK (`GreedyMarkhor-v1.0-demo.apk`, 38.6 MB) pre-seeded with 500,000 demo coins and a simulated voice-chat room container. Visitors can install it directly onto their physical Android device to verify genuine 60/120 FPS hardware acceleration.

---

## Technical Audit of Investigated Free Platforms

### 1. SpawnDroid (https://spawndroid.io/)
- **License / Tier**: Proprietary cloud service offering a free "Hobby" tier.
- **Allowance**: 1 concurrent runner, 200 minutes per month.
- **Strengths**: True Android virtualization in browser with touch controls.
- **Limitations**: 200 minutes is exhausted by only 20 ten-minute visitor sessions per month. Once the threshold is crossed, demos stop loading until the next billing cycle.
- **Recommended Usage**: Suitable as an optional private link for pre-screened VIP enterprise buyers, but not for unauthenticated public landing page traffic.

### 2. Vetro (https://github.com/1vcian/Vetro)
- **Architecture**: In-browser WebAssembly-based Android emulator.
- **Evaluation**:
  - Requires translating ARM64 / x86_64 native instructions client-side in the browser.
  - Lacks complete translation for modern Jetpack Compose graphics shaders and low-latency Android `SoundPool` audio buffers.
  - Causes severe frame drops (sub-15 FPS) and crashes on mobile browsers.
- **Conclusion**: Unviable for commercial product presentations.

### 3. Emuly (https://emuly.xyz/)
- **Evaluation**: Enforces an aggressive 3-minute hard session timeout and frequent queue delays during peak traffic. Lacks customizable iframe embedding without an enterprise key.

### 4. Afoli (https://afo.li/en/emulator/)
- **Evaluation**: Interactive sandbox utility designed for manual testing rather than a public white-label embedded demo.

---

## Conclusion & Architecture Decision

The **Browser-Native Simulation + Standalone APK** setup delivers:
- **$0.00 Monthly Cost**: Unlimited scale on Cloudflare Pages.
- **0 Latency**: Zero video streaming compression artifacts or input lag.
- **100% Cross-Platform**: Works instantly on iPhone, iPad, Mac, Windows, and Android.
